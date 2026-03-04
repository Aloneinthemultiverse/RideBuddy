const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, department, year, phone, vehicleType, vehicleNumber, emergencyContact } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({
            name, email, password, department, year, phone,
            vehicleType: vehicleType || 'none',
            vehicleNumber: vehicleNumber || '',
            emergencyContact: emergencyContact || '',
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                _id: user._id, name: user.name, email: user.email,
                department: user.department, year: user.year, phone: user.phone,
                vehicleType: user.vehicleType, vehicleNumber: user.vehicleNumber,
                isAdmin: user.isAdmin, rating: user.rating, rideCount: user.rideCount,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account has been blocked. Contact admin.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                _id: user._id, name: user.name, email: user.email,
                department: user.department, year: user.year, phone: user.phone,
                vehicleType: user.vehicleType, vehicleNumber: user.vehicleNumber,
                isAdmin: user.isAdmin, rating: user.rating, rideCount: user.rideCount,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
