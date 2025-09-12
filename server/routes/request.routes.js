const express = require("express");
const router = express.Router();
const db = require("../configs/database"); // your db connection
const authMiddleware = require("../middlewares/auth"); // for token verification

// 📌 Send Buy Request
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { vehicle_id, message, contact } = req.body;
    const user_id = req.user.id; // extracted from token in authMiddleware

    if (!vehicle_id || !message || !contact) {
      return res.status(400).json({
        success: false,
        message: "All fields (vehicle_id, message, contact) are required",
      });
    }

    // Insert request into DB
    await db("request").insert({
      user_id,
      vehicle_id,
      message,
      contact,
    });

    res.status(201).json({
      success: true,
      message: "Purchase request submitted successfully!",
    });
  } catch (error) {
    console.error("Error saving request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while submitting request",
    });
  }
});

// 📌 Get logged-in user's requests
router.get("/my-requests", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;

    const requests = await db("request as r")
      .join("vehicle as v", "r.vehicle_id", "v.vehicle_id")
      .select(
        "r.request_id",
        "r.message",
        "r.contact",
        "v.vehicle_id",
        "v.title",
        "v.image",
        "v.price",
        "v.year",
        "v.description",
        "v.location",
        "v.top_speed"
      )
      .where("r.user_id", user_id);

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ success: false, message: "Error fetching requests" });
  }
});

// Get requests for vehicles owned by logged-in user
router.get("/my-vehicles", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await db("request")
      .join("vehicle", "request.vehicle_id", "=", "vehicle.vehicle_id")
      .join("user_creds", "request.user_id", "=", "user_creds.user_id")
      .select(
        "request.request_id",
        "request.message",
        "request.contact",
        "vehicle.title as vehicle_title",
        "user_creds.full_name as user_name"
      )
      .where("vehicle.owner_id", userId);

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching requests" });
  }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db("request").where({ request_id : id }).del();

    if (deleted) {
      res.json({ success: true, message: "Request deleted successfully!" });
    } else {
      res.status(404).json({ success: false, message: "Request not found!" });
    }
  } catch (err) {
    console.error("Error deleting request:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


module.exports = router;
