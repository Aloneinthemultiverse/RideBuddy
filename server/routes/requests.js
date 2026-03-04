const express = require('express');
const { auth } = require('../middleware/auth');
const Request = require('../models/Request');
const Ride = require('../models/Ride');
const User = require('../models/User');
const router = express.Router();

// Create a seat request
router.post('/', auth, async (req, res) => {
    try {
        const { rideId, seatsRequested } = req.body;
        const seats = seatsRequested || 1;

        const ride = await Ride.findById(rideId);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        if (ride.status !== 'active') return res.status(400).json({ message: 'Ride is not active' });
        if (ride.driver.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot request your own ride' });
        }
        if (ride.seatsAvailable < seats) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        const existingRequest = await Request.findOne({ ride: rideId, passenger: req.user._id });
        if (existingRequest) {
            return res.status(400).json({ message: 'You already requested this ride' });
        }

        const request = new Request({
            ride: rideId,
            passenger: req.user._id,
            seatsRequested: seats,
        });

        await request.save();
        await request.populate('passenger', 'name department year phone rating');
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get requests for a ride (driver view)
router.get('/ride/:rideId', auth, async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.rideId);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const requests = await Request.find({ ride: req.params.rideId })
            .populate('passenger', 'name department year phone rating')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Accept or reject a request
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        const ride = await Ride.findById(request.ride);
        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (status === 'accepted') {
            if (ride.seatsAvailable < request.seatsRequested) {
                return res.status(400).json({ message: 'Not enough seats available' });
            }
            ride.seatsAvailable -= request.seatsRequested;
            await ride.save();

            // Increment ride count for passenger
            await User.findByIdAndUpdate(request.passenger, { $inc: { rideCount: 1 } });
        }

        request.status = status;
        await request.save();
        await request.populate('passenger', 'name department year phone rating');

        res.json({ request, seatsAvailable: ride.seatsAvailable });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get my requests (as passenger)
router.get('/my', auth, async (req, res) => {
    try {
        const requests = await Request.find({ passenger: req.user._id })
            .populate({
                path: 'ride',
                populate: { path: 'driver', select: 'name department year vehicleType rating' }
            })
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
