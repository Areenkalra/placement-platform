const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { readDB, writeDB } = require('../utils/jsonDB');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Mock OTP store
const otps = {};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if user exists (skip if in-memory logic is mostly used, but good to have)
    if (mongoose && mongoose.connection.readyState === 1) {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }
    } else {
      const db = readDB();
      if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (mongoose && mongoose.connection.readyState === 1) {
        let user = new User({ name, email, password: hashedPassword, phone });
        await user.save();
    } else {
        const db = readDB();
        db.users.push({ _id: Date.now().toString(), name, email, password: hashedPassword, phone, createdAt: new Date() });
        writeDB(db);
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = null;

    if (mongoose && mongoose.connection.readyState === 1) {
       user = await User.findOne({ email });
    } else {
       const db = readDB();
       user = db.users.find(u => u.email === email);
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = {
        otp,
        user,
        expires: Date.now() + 5 * 60 * 1000 // 5 mins
    };

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your PlacementAI Login OTP',
            text: `Your OTP for login is: ${otp}. It is valid for 5 minutes.`
        });
        console.log(`[OTP Status] Email successfully sent to ${email}`);
    } catch (emailError) {
        console.error("[OTP Status] Failed to send real email. Check your .env EMAIL_USER and EMAIL_PASS settings.");
        console.log(`\n\n----------------------------------------`);
        console.log(`[Mock SMS/Email] OTP for ${email}: ${otp}`);
        console.log(`----------------------------------------\n\n`);
    }

    res.json({ step: 'otp_required', message: 'OTP sent to your registered contact.', email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const record = otps[email];
    if (!record) {
        return res.status(400).json({ error: 'OTP expired or not requested' });
    }
    
    if (record.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    if (Date.now() > record.expires) {
        delete otps[email];
        return res.status(400).json({ error: 'OTP expired' });
    }
    
    const { user } = record;

    const payload = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        delete otps[email];
        res.json({ token, user: payload.user });
      }
    );
    } catch (err) {
        console.error("Login verify Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Forgot Password - Request OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const db = readDB();
        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(404).json({ error: "User with this email not found." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };

        await sendOTP(email, otp);
        res.json({ message: "Password reset OTP sent to email." });
    } catch (err) {
        console.error("Forgot Password Error:", err);
        res.status(500).json({ error: "Server error." });
    }
});

// Reset Password - Verify OTP & Change Password
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const record = otpStore[email];
        if (!record || record.otp !== otp || record.expires < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }

        const db = readDB();
        const userIndex = db.users.findIndex(u => u.email === email);
        if (userIndex === -1) {
            return res.status(404).json({ error: "User not found." });
        }

        // Generate new hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        db.users[userIndex].password = hashedPassword;
        writeDB(db);

        // Clean up OTP
        delete otpStore[email];

        res.json({ message: "Password successfully reset." });
    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ error: "Server error." });
    }
});

module.exports = router;
