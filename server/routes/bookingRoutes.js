const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createBooking, getUserBookings, updateBookingStatus } = require('../controllers/bookingController');

// All booking routes require authentication
router.use(auth);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
