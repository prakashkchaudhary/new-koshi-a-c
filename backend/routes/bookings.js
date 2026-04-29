const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/bookings/book-ticket - Book a ticket
router.post('/book-ticket', protect, async (req, res) => {
  try {
    const { busId, seats, travelDate } = req.body;

    if (!busId || !seats || !seats.length || !travelDate) {
      return res.status(400).json({ success: false, message: 'Bus, seats, and travel date are required' });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    // Check for already booked seats
    const conflictingSeats = seats.filter(seat => bus.bookedSeats.includes(seat));
    if (conflictingSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats already booked: ${conflictingSeats.join(', ')}`
      });
    }

    // Check seat count doesn't exceed available
    const availableCount = bus.totalSeats - bus.bookedSeats.length;
    if (seats.length > availableCount) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableCount} seats available`
      });
    }

    const totalPrice = seats.length * bus.price;

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      busId,
      seats,
      travelDate: new Date(travelDate),
      totalPrice,
      passengerDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      }
    });

    // Update bus booked seats
    await Bus.findByIdAndUpdate(busId, {
      $push: { bookedSeats: { $each: seats } }
    });

    await booking.populate('busId', 'name route departureTime arrivalTime price');

    res.status(201).json({
      success: true,
      message: 'Ticket booked successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/bookings/my-bookings - Get user's bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('busId', 'name route departureTime arrivalTime price image')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/bookings - Admin: Get all bookings
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('busId', 'name route departureTime arrivalTime')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('busId', 'name route departureTime arrivalTime price image');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only allow owner or admin
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/bookings/:id/cancel - Cancel booking
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Free up the seats
    await Bus.findByIdAndUpdate(booking.busId, {
      $pull: { bookedSeats: { $in: booking.seats } }
    });

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
