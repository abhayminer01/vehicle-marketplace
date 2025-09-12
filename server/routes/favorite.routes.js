const express = require("express");
const router = express.Router();
const db = require("../configs/database");
const authMiddleware = require("../middlewares/auth");

// Add to favorites
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { vehicle_id } = req.body;
    const user_id = req.user.id;
    if (!user_id || !vehicle_id) {
      return res.status(400).json({
        success: false,
        message: "User ID or Vehicle ID missing",
      });
    }

    // Check if already favorited
    const exists = await db("favorites")
      .where({ user_id, vehicle_id })
      .first();

    if (exists) {
      return res.json({ success: true, message: "Already in favorites" });
    }

    await db("favorites").insert({ user_id, vehicle_id });
    res.json({ success: true, message: "Added to favorites" });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to favorites",
      error: error.message,
    });
  }
});

// Get user's favorites
router.get("/", authMiddleware, async (req, res) => {
  try {
    const list = await db("favorites as f")
      .join("vehicles as v", "f.vehicle_id", "v.vehicle_id")
      .select("v.*")
      .where("f.user_id", req.user.id);

    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching favorites",
      error: error.message,
    });
  }
});

// Remove from favorites
router.delete("/:vehicle_id", authMiddleware, async (req, res) => {
  try {
    await db("favorites")
      .where({ user_id: req.user.id, vehicle_id: req.params.vehicle_id })
      .del();

    res.json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing favorite",
      error: error.message,
    });
  }
});

module.exports = router;
