const express = require('express');
const { auth } = require('../middleware/auth');
const Ride = require('../models/Ride');
const router = express.Router();

// Create a ride
router.post('/', auth, async (req, res) => {
    try {
        const { source, destination, date, time, seatsTotal, vehicleType, costPerSeat, routeDescription } = req.body;

        const ride = new Ride({
            driver: req.user._id,
            source, destination, date, time,
            seatsTotal,
            seatsAvailable: seatsTotal,
            vehicleType, costPerSeat: costPerSeat || 0,
            routeDescription: routeDescription || '',
        });

        await ride.save();
        await ride.populate('driver', 'name department year vehicleType rating');
        res.status(201).json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search / list rides
router.get('/', auth, async (req, res) => {
    try {
        const { source, destination, date, vehicleType } = req.query;
        const filter = { status: 'active', seatsAvailable: { $gt: 0 } };

        if (source) filter.source = { $regex: source, $options: 'i' };
        if (destination) filter.destination = { $regex: destination, $options: 'i' };
        if (date) filter.date = date;
        if (vehicleType) filter.vehicleType = vehicleType;

        const rides = await Ride.find(filter)
            .populate('driver', 'name department year vehicleType rating')
            .sort({ createdAt: -1 });

        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get my posted rides
router.get('/my', auth, async (req, res) => {
    try {
        const rides = await Ride.find({ driver: req.user._id })
            .populate('driver', 'name department year vehicleType rating')
            .sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get ride by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate('driver', 'name department year vehicleType rating phone');
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cancel a ride
router.delete('/:id', auth, async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        ride.status = 'cancelled';
        await ride.save();
        res.json({ message: 'Ride cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Complete a ride
router.put('/:id/complete', auth, async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        ride.status = 'completed';
        await ride.save();
        res.json({ message: 'Ride completed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
