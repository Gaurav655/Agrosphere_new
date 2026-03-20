const Equipment = require('../models/Equipment');

// Get all equipment (with optional filters)
exports.getAllEquipment = async (req, res) => {
    try {
        const query = { isAvailable: true };
        if (req.query.category) query.category = req.query.category;

        const equipment = await Equipment.find(query).populate('owner', 'name phone location');
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single equipment by ID
exports.getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id).populate('owner', 'name phone location');
        if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
        res.json(equipment);
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Equipment not found' });
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new equipment listing (Owners only)
exports.createEquipment = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ message: 'Access denied. Only owners can list equipment.' });
        }

        const equipment = new Equipment({
            ...req.body,
            owner: req.user.userId
        });

        await equipment.save();
        res.status(201).json(equipment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
