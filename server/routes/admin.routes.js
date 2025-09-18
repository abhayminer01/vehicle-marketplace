const db = require('../configs/database');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const router = require('express').Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await db('admin').where({ email }).first();
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Admin not found' });
        }

        if (admin.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }

        const token = jwt.sign(
            { id: admin.admin_id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }   // ✅ optional expiry
        );

        res.status(200).json({ success: true, message: 'Logged in Successfully', token });
    } catch (error) {
        console.log('Error occurred while admin login : ' + error);
        res.status(500).json({
            success: false,
            message: 'Error Occurred while admin login',
            err: error
        });
    }
});

// ✅ Verify Token Route
router.post('/verifytoken', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token missing' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Invalid or expired token' });
            }

            return res.status(200).json({
                success: true,
                message: 'Token is valid',
                decoded
            });
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ success: false, message: 'Error verifying token', err: error });
    }
});

router.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await db("vehicle").select("*");

    const formatted = vehicles.map((v) => ({
      ...v,
      approved: v.approved === 1, // normalize to boolean
    }));

    res.json({ success: true, vehicles: formatted });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vehicles",
      error: error.message,
    });
  }
});


// admin.routes.js
router.delete("/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db("vehicle").where({ vehicle_id: id }).del();
    res.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ success: false, message: "Error deleting vehicle" });
  }
});

// ✅ GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await db("user_creds").select(
      "user_id",
      "full_name",
      "email",
      "phone",
    );
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

// ✅ GET single user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db("user_creds").where({ user_id: id }).first();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
});


// ✅ UPDATE user details
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, phonenumber, status, password } = req.body;

    let updateData = {
      full_name: fullname,
      email,
      phone: phonenumber,
    };

    // ✅ Hash password only if provided
    if (password && password.trim() !== "") {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }

    const updated = await db("user_creds")
      .where({ user_id: id })
      .update(updateData);

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating user", error });
  }
});


// ✅ DELETE user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("user_creds").where({ user_id: id }).del();

    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
});


// ✅ GET all requests with user + vehicle + owner details
router.get("/requests", async (req, res) => {
  try {
    const requests = await db("request as r")
      .join("user_creds as u", "r.user_id", "u.user_id") // requester
      .join("vehicle as v", "r.vehicle_id", "v.vehicle_id") // vehicle
      .join("user_creds as o", "v.owner_id", "o.user_id") // vehicle owner
      .select(
        "r.request_id",
        "r.message",
        "r.contact",

        "u.user_id as requester_id",
        "u.full_name as requester_name",
        "u.email as requester_email",
        "u.phone as requester_phone",

        "o.user_id as owner_id",
        "o.full_name as owner_name",
        "o.email as owner_email",
        "o.phone as owner_phone",

        "v.vehicle_id",
        "v.title as vehicle_title",
        "v.image as vehicle_image"
      )
      .orderBy("r.request_id", "desc");

    res.json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ success: false, message: "Error fetching requests" });
  }
});

// ✅ DELETE request
router.delete("/requests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("request").where({ request_id: id }).del();

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ success: false, message: "Error deleting request" });
  }
});

// -------------------- APPROVE / DECLINE VEHICLE --------------------
router.put("/vehicles/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    // validate
    if (typeof approved !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Approved field must be true or false",
      });
    }

    // update vehicle approval (store as 0/1)
    const updated = await db("vehicle")
      .where({ vehicle_id: id })
      .update({ approved: approved ? 1 : 0 });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: `Vehicle ${approved ? "approved" : "declined"} successfully`,
    });
  } catch (error) {
    console.error("Error updating vehicle approval:", error);
    res.status(500).json({
      success: false,
      message: "Error updating vehicle approval",
      error: error.message,
    });
  }
});


module.exports = router;
