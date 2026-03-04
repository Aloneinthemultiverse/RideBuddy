const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get my profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update my profile
router.put('/me', auth, async (req, res) => {
    try {
        const { name, department, year, phone, vehicleType, vehicleNumber, emergencyContact } = req.body;
        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (department) user.department = department;
        if (year) user.year = year;
        if (phone) user.phone = phone;
        if (vehicleType) user.vehicleType = vehicleType;
        if (vehicleNumber !== undefined) user.vehicleNumber = vehicleNumber;
        if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user public profile
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name department year vehicleType rating rideCount totalRatings createdAt');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
