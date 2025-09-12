const db = require('../configs/database');
const authMiddleware = require('../middlewares/auth');

const router = require('express').Router();

// Add Vehicle
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
      owner_id: req.user.id   // logged-in user
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

// ✅ Get all vehicles
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
        "owner_id"
      )
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


// Get logged-in user's vehicles
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const vehicles = await db('vehicle')
      .where({ owner_id: req.user.id })
      .select('*');

    if (vehicles.length === 0) {
      return res.json({
        success: true,
        message: "No vehicles found",
        vehicles: []
      });
    }

    res.json({
      success: true,
      vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching vehicles",
      error: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await db("vehicle")
      .where({ vehicle_id: id })
      .first();

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vehicle",
      error: error.message,
    });
  }
});

module.exports = router;