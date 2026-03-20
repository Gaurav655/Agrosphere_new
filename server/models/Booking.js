const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['pay_now', 'pay_later'],
        default: 'pay_later'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
