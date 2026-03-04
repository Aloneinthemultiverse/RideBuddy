const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
    text: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ ride: 1, sender: 1, receiver: 1 });

module.exports = mongoose.model('Message', messageSchema);
