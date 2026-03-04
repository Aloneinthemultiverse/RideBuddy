const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    department: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1, max: 6 },
    phone: { type: String, required: true, trim: true },
    vehicleType: { type: String, enum: ['bike', 'car', 'none'], default: 'none' },
    vehicleNumber: { type: String, trim: true, default: '' },
    profilePic: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    rideCount: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    emergencyContact: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
