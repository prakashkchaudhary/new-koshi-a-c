const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  representativeName: {
    type: String,
    default: 'Mohammad Rahman'
  },
  phone: {
    type: String,
    default: '+880 1700-000000'
  },
  email: {
    type: String,
    default: 'info@swiftride.com'
  },
  address: {
    type: String,
    default: 'Head Office, Dharan, Sunsari, Nepal'
  },
  officeHours: {
    type: String,
    default: 'Mon-Sat: 8:00 AM - 8:00 PM'
  },
  mapEmbedUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
