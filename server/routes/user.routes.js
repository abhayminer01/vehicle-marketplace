const db = require('../configs/database');
const authMiddleware = require('../middlewares/auth');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await db('user_creds')
      .where({ email: req.user.email })
      .first();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        fullname: user.full_name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { fullname, email, phone } = req.body;

    await db('user_creds').where({ email: req.user.email }).update({
      full_name : fullname,
      email : email,
      phone : phone,
    });

    const token = jwt.sign(
      { id: req.user.user_id, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, message: 'Profile updated successfully', token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating profile', error: err.message });
  }
});

// get fav list
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const list = await db('favorites')
      .join('vehicle', 'favorites.vehicle_id', 'vehicle.vehicle_id')
      .where({ 'favorites.user_id': req.user.id })
      .select(
        'vehicle.vehicle_id',
        'vehicle.title',
        'vehicle.price',
        'vehicle.top_speed',
        'vehicle.location',
        'vehicle.image',
        'vehicle.owner_id',
        'vehicle.year',
        'vehicle.description'
      );

    res.json({
      success: true,
      data: list
    });
  } catch (error) {
    console.error("Favorites fetch error:", error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorite list',
      error: error.message
    });
  }
});

module.exports = router;