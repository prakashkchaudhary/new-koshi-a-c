const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/bookings/book-ticket
router.post('/book-ticket', protect, async (req, res) => {
  try {
    const { busId, seats, travelDate } = req.body;

    // Input validation
    if (!busId || !seats || !Array.isArray(seats) || seats.length === 0 || !travelDate) {
      return res.status(400).json({ success: false, message: 'Bus, seats, and travel date are required' });
    }

    // Validate seat count
    if (seats.length > 10) {
      return res.status(400).json({ success: false, message: 'Cannot book more than 10 seats at once' });
    }

    // Validate travel date is not in the past
    const travel = new Date(travelDate);
    if (isNaN(travel.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid travel date' });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (travel < today) {
      return res.status(400).json({ success: false, message: 'Travel date cannot be in the past' });
    }

    // Sanitize seat labels
    const sanitizedSeats = seats.map(s => String(s).trim().toUpperCase().slice(0, 5));

    // ── Atomic seat booking to prevent race conditions ────
    // Use findOneAndUpdate with $addToSet to atomically check & reserve seats
    const bus = await Bus.findOneAndUpdate(
      {
        _id: busId,
        isActive: true,
        // Ensure none of the requested seats are already booked
        bookedSeats: { $not: { $elemMatch: { $in: sanitizedSeats } } },
        // Ensure enough seats are available
        $expr: {
          $lte: [
            { $add: [{ $size: '$bookedSeats' }, sanitizedSeats.length] },
            '$totalSeats'
          ]
        }
      },
      { $push: { bookedSeats: { $each: sanitizedSeats } } },
      { new: true }
    );

    if (!bus) {
      // Check if bus exists at all
      const busExists = await Bus.findById(busId);
      if (!busExists) {
        return res.status(404).json({ success: false, message: 'Bus not found' });
      }
      return res.status(400).json({ success: false, message: 'One or more seats are already booked or bus is full' });
    }

    const totalPrice = sanitizedSeats.length * bus.price;

    const booking = await Booking.create({
      userId: req.user._id,
      busId,
      seats: sanitizedSeats,
      travelDate: travel,
      totalPrice,
      passengerDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      }
    });

    await booking.populate('busId', 'name route departureTime arrivalTime price');

    res.status(201).json({
      success: true,
      message: 'Ticket booked successfully',
      booking
    });
  } catch (error) {
    console.error('Booking error:', error.message);
    res.status(500).json({ success: false, message: 'Booking failed. Please try again.' });
  }
});

// GET /api/bookings/my-bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find({ userId: req.user._id })
        .populate('busId', 'name route departureTime arrivalTime price image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments({ userId: req.user._id })
    ]);

    res.json({ success: true, bookings, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('My bookings error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings — Admin: all bookings with pagination
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find()
        .populate('userId', 'name email phone')
        .populate('busId', 'name route departureTime arrivalTime')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments()
    ]);

    res.json({ success: true, bookings, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Admin bookings error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('busId', 'name route departureTime arrivalTime price image');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Strict ownership check
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Get booking error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch booking' });
  }
});

// PUT /api/bookings/:id/cancel
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

    // Free up the seats atomically
    await Bus.findByIdAndUpdate(booking.busId, {
      $pull: { bookedSeats: { $in: booking.seats } }
    });

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Cancel booking error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  }
});

module.exports = router;
