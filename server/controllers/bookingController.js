const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        if (req.user.role !== 'farmer') {
            return res.status(403).json({ message: 'Access denied. Only farmers can book equipment.' });
        }

        const { equipmentId, startDate, endDate, totalPrice, paymentMethod } = req.body;

        const equipment = await Equipment.findById(equipmentId);
        if (!equipment || !equipment.isAvailable) {
            return res.status(400).json({ message: 'Equipment is not available.' });
        }

        const booking = new Booking({
            equipment: equipmentId,
            farmer: req.user.userId,
            startDate,
            endDate,
            totalPrice,
            paymentMethod,
            paymentStatus: paymentMethod === 'pay_now' ? 'paid' : 'pending'
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get bookings for a user (farmer or owner)
exports.getUserBookings = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'farmer') {
            query.farmer = req.user.userId;
        } else if (req.user.role === 'owner') {
            const ownedEquipment = await Equipment.find({ owner: req.user.userId }).select('_id');
            const equipmentIds = ownedEquipment.map(eq => eq._id);
            query.equipment = { $in: equipmentIds };
        }

        const bookings = await Booking.find(query)
            .populate('equipment')
            .populate('farmer', 'name phone location')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update booking status (owner confirming/completing)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId).populate('equipment');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (req.user.role !== 'owner' || booking.equipment.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
