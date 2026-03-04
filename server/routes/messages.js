const express = require('express');
const { auth } = require('../middleware/auth');
const Message = require('../models/Message');
const router = express.Router();

// Send a message
router.post('/', auth, async (req, res) => {
    try {
        const { receiverId, rideId, text } = req.body;

        const message = new Message({
            sender: req.user._id,
            receiver: receiverId,
            ride: rideId,
            text,
        });

        await message.save();
        await message.populate('sender', 'name');
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get conversation between two users for a ride
router.get('/:rideId/:userId', auth, async (req, res) => {
    try {
        const { rideId, userId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            ride: rideId,
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId },
            ]
        })
            .populate('sender', 'name')
            .sort({ createdAt: 1 });

        // Mark as read
        await Message.updateMany(
            { ride: rideId, sender: userId, receiver: myId, read: false },
            { read: true }
        );

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all my conversations (unique ride+user combos)
router.get('/conversations/all', auth, async (req, res) => {
    try {
        const myId = req.user._id;
        const messages = await Message.aggregate([
            { $match: { $or: [{ sender: myId }, { receiver: myId }] } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: { ride: '$ride', otherUser: { $cond: [{ $eq: ['$sender', myId] }, '$receiver', '$sender'] } },
                    lastMessage: { $first: '$text' },
                    lastTime: { $first: '$createdAt' },
                    unread: { $sum: { $cond: [{ $and: [{ $eq: ['$receiver', myId] }, { $eq: ['$read', false] }] }, 1, 0] } },
                }
            },
            { $sort: { lastTime: -1 } },
        ]);

        // Populate user and ride info
        const populated = await Message.populate(messages, [
            { path: '_id.otherUser', model: 'User', select: 'name department year' },
            { path: '_id.ride', model: 'Ride', select: 'source destination date' },
        ]);

        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
