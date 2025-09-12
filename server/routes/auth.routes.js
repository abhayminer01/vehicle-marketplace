const router = require('express').Router();
const db = require('../configs/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await db('user_creds').where({ email }).first();
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: existingUser.user_id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: existingUser.user_id,
        email: existingUser.email,
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { fullname, email, phonenumber, password } = req.body;
    if(!fullname || !email || !phonenumber || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await db('user_creds').where({ email }).first();
    if(existingUser) {
      return res.status(400).json({ success: false, message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db('user_creds').insert({ full_name : fullname, email : email, phone : phonenumber, password : hashedPassword });

    res.status(200).json({ 
      success : true, 
      message : "User Registered Successfully", 
      user : { 
        email : email, 
        name : fullname, 
        phone : phonenumber 
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.get('/verifytoken', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token"
        });
      }

      return res.json({
        success: true,
        message: "Token is valid",
        user: decoded
      });
    });

  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = router;