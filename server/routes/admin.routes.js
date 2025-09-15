const db = require('../configs/database');
const jwt = require('jsonwebtoken');

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

module.exports = router;
