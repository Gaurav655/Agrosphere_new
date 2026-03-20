const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllEquipment, getEquipmentById, createEquipment } = require('../controllers/equipmentController');

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);

// Protected routes
router.post('/', auth, createEquipment);

module.exports = router;
