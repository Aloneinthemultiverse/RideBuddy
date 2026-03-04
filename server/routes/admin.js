const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Ride = require('../models/Ride');
const Report = require('../models/Report');
const Request = require('../models/Request');
const router = express.Router();

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Block/unblock a user
router.put('/users/:id/block', auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Dashboard stats
router.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRides = await Ride.countDocuments();
        const activeRides = await Ride.countDocuments({ status: 'active' });
        const completedRides = await Ride.countDocuments({ status: 'completed' });
        const pendingReports = await Report.countDocuments({ status: 'pending' });
        const totalRequests = await Request.countDocuments();

        res.json({ totalUsers, totalRides, activeRides, completedRides, pendingReports, totalRequests });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
