const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seatsRequested: { type: Number, required: true, min: 1, default: 1 },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

requestSchema.index({ ride: 1, passenger: 1 }, { unique: true });

module.exports = mongoose.model('Request', requestSchema);
