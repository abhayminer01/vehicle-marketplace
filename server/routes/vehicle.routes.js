const db = require('../configs/database');
const authMiddleware = require('../middlewares/auth');
const router = require('express').Router();

// -------------------- ADD VEHICLE --------------------
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { title, price, top_speed, location, description, image, year } = req.body;

    if (!title || !price || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, price and location are required"
      });
    }

    const [vehicle_id] = await db('vehicle').insert({
      title,
      price,
      top_speed,
      location,
      description,
      image,
      year,
      owner_id: req.user.id
    });

    res.json({
      success: true,
      message: "Vehicle added successfully",
      vehicle_id
    });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Error adding vehicle",
      error: error.message
    });
  }
});

// -------------------- GET ALL VEHICLES (only approved) --------------------
router.get("/", async (req, res) => {
  try {
    const vehicles = await db("vehicle")
      .select(
        "vehicle_id",
        "title",
        "price",
        "top_speed",
        "location",
        "description",
        "image",
        "year",
        "owner_id",
        "status",
        "approved"
      )
      .where({ approved: true }) // ✅ only approved
      .orderBy("vehicle_id", "desc");

    res.json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vehicles",
      error: error.message,
    });
  }
});

// -------------------- GET VEHICLE BY ID (show all) --------------------
router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user id missing in token"
      });
    }

    console.log("User ID from token:", req.user.id);

    const vehicles = await db("vehicle")
      .where({ owner_id: req.user.id })  // ✅ change owner_id → user_id if needed
      .select("*");

    res.json({
      success: true,
      vehicles
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vehicles",
      error: error.message
    });
  }
});



// -------------------- GET USER'S VEHICLES --------------------
router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found in token"
      });
    }

    const vehicles = await db("vehicle")
      .where({ owner_id: req.user.id }) // change to user_id if that’s your schema
      .select("*");

    if (!vehicles || vehicles.length === 0) {
      return res.json({
        success: true,
        message: "No vehicles found",
        vehicles: []
      });
    }

    // normalize approval field (convert 0/1 → false/true)
    const formatted = vehicles.map(v => ({
      ...v,
      approved: v.approved === 1
    }));

    res.json({
      success: true,
      vehicles: formatted
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vehicles",
      error: error.message
    });
  }
});

// -------------------- UPDATE VEHICLE --------------------
router.put("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, top_speed, location, description, image, year } = req.body;

    // Check if vehicle belongs to the logged-in user
    const vehicle = await db("vehicle")
      .where({ vehicle_id: id, owner_id: req.user.id })
      .first();

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found or not owned by user",
      });
    }

    await db("vehicle")
      .where({ vehicle_id: id })
      .update({
        title,
        price,
        top_speed,
        location,
        description,
        image,
        year,
      });

    res.json({
      success: true,
      message: "Vehicle updated successfully",
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Error updating vehicle",
      error: error.message,
    });
  }
});

// -------------------- DELETE VEHICLE --------------------
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if vehicle belongs to logged-in user
    const vehicle = await db("vehicle")
      .where({ vehicle_id: id, owner_id: req.user.id })
      .first();

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found or not owned by user",
      });
    }

    await db("vehicle").where({ vehicle_id: id }).del();

    res.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting vehicle",
      error: error.message,
    });
  }
});

// ✅ Toggle availability
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["available", "sold"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use 'available' or 'sold'."
      });
    }

    const updated = await db("vehicle")
      .where({ vehicle_id: id, owner_id: req.user.id })
      .update({ status });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found or not owned by you"
      });
    }

    res.json({
      success: true,
      message: `Vehicle marked as ${status}`,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating status",
      error: error.message
    });
  }
});

module.exports = router;
