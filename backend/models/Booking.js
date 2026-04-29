const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  seats: {
    type: [String],
    required: [true, 'At least one seat must be selected'],
    validate: {
      validator: (v) => v.length > 0,
      message: 'At least one seat must be selected'
    }
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed'
  },
  passengerDetails: {
    name: String,
    email: String,
    phone: String
  }
}, { timestamps: true });

// Generate ticket ID before saving
bookingSchema.pre('save', function (next) {
  if (!this.ticketId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.ticketId = `TKT-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
