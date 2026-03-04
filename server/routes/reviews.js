const express = require('express');
const { auth } = require('../middleware/auth');
const Review = require('../models/Review');
const User = require('../models/User');
const router = express.Router();

// Create a review
router.post('/', auth, async (req, res) => {
    try {
        const { revieweeId, rideId, rating, comment } = req.body;

        if (revieweeId === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot review yourself' });
        }

        const existing = await Review.findOne({ reviewer: req.user._id, ride: rideId });
        if (existing) {
            return res.status(400).json({ message: 'You already reviewed for this ride' });
        }

        const review = new Review({
            reviewer: req.user._id,
            reviewee: revieweeId,
            ride: rideId,
            rating,
            comment: comment || '',
        });

        await review.save();

        // Update user rating
        const allReviews = await Review.find({ reviewee: revieweeId });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await User.findByIdAndUpdate(revieweeId, { rating: Math.round(avgRating * 10) / 10, totalRatings: allReviews.length });

        await review.populate('reviewer', 'name department');
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get reviews for a user
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'name department year')
            .populate('ride', 'source destination date')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
