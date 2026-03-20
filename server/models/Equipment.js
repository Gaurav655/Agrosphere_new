const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
