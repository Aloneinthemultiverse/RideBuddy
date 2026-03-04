const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const Report = require('../models/Report');
const router = express.Router();

// Report a user
router.post('/', auth, async (req, res) => {
    try {
        const { reportedUserId, reason } = req.body;

        if (reportedUserId === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot report yourself' });
        }

        const report = new Report({
            reporter: req.user._id,
            reportedUser: reportedUserId,
            reason,
        });

        await report.save();
        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: list all reports
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reporter', 'name email department')
            .populate('reportedUser', 'name email department isBlocked')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: resolve a report
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const { status, adminNote } = req.body;
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status, adminNote: adminNote || '' },
            { new: true }
        )
            .populate('reporter', 'name email')
            .populate('reportedUser', 'name email');
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
