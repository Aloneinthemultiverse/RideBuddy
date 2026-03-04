const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    seatsTotal: { type: Number, required: true, min: 1, max: 10 },
    seatsAvailable: { type: Number, required: true, min: 0, max: 10 },
    vehicleType: { type: String, enum: ['bike', 'car'], required: true },
    costPerSeat: { type: Number, default: 0, min: 0 },
    routeDescription: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
}, { timestamps: true });

rideSchema.index({ source: 1, destination: 1, date: 1 });
rideSchema.index({ status: 1 });

module.exports = mongoose.model('Ride', rideSchema);
