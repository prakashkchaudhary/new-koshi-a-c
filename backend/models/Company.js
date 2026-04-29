const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'New Koshi A/C Yatayat Pvt. Ltd.'
  },
  tagline: {
    type: String,
    default: 'Your Comfort, Our Priority'
  },
  description: {
    type: String,
    default: 'New Koshi A/C Yatayat Pvt. Ltd. is Nepal\'s trusted bus service provider, offering safe, comfortable, and reliable transportation across the country.'
  },
  history: {
    type: String,
    default: 'Founded in 2010, New Koshi A/C Yatayat has been providing safe and comfortable bus services across Nepal from its head office in Dharan, Sunsari.'
  },
  services: {
    type: [String],
    default: ['AC Coach', 'Online Booking', 'GPS Tracking', 'Luggage Assistance']
  },
  routes: {
    type: [String],
    default: [
      'Kathmandu - Dharan (Night Service)',
      'Dharan - Kathmandu (Night Service)',
      'Kathmandu - Dharan via Sindhuli (Day & Night)',
      'Dharan - Kathmandu via Sindhuli (Day & Night)'
    ]
  },
  experience: {
    type: String,
    default: '15+ years of trusted service'
  },
  images: {
    type: [String],
    default: []
  },
  established: {
    type: String,
    default: '2010'
  }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
