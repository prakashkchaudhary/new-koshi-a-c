const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bus name is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  route: {
    from: {
      type: String,
      required: [true, 'Departure city is required'],
      trim: true
    },
    to: {
      type: String,
      required: [true, 'Destination city is required'],
      trim: true
    }
  },
  departureTime: {
    type: String,
    required: [true, 'Departure time is required']
  },
  arrivalTime: {
    type: String,
    required: [true, 'Arrival time is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    default: 40
  },
  bookedSeats: {
    type: [String],
    default: []
  },
  amenities: {
    type: [String],
    default: ['AC', 'WiFi', 'Charging Port']
  },
  busType: {
    type: String,
    default: 'AC Sleeper'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
