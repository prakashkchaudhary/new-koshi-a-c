const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Bus = require('../models/Bus');
const Company = require('../models/Company');
const Contact = require('../models/Contact');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bus-booking');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Bus.deleteMany({});
    await Company.deleteMany({});
    await Contact.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Prakash Chaudhary',
      email: process.env.ADMIN_EMAIL || 'prakashchaudhary92290@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'prakash@92290',
      phone: '+977-9800000000',
      role: 'admin'
    });
    console.log('Admin created:', admin.email);

    // Create sample user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      phone: '+880 1700-222222',
      role: 'user'
    });
    console.log('Sample user created:', user.email);

    // Create buses — Dharan ↔ Kathmandu Night Service
    const buses = await Bus.insertMany([
      {
        name: 'New Koshi Night Service (DHR→KTM)',
        image: '/images/dharan-kathmandu.jpg.jpeg',
        route: { from: 'Dharan', to: 'Kathmandu' },
        departureTime: '06:30 PM',
        arrivalTime: '05:30 AM',
        price: 1400,
        totalSeats: 40,
        bookedSeats: [],
        amenities: ['AC', 'Charging Port', 'Blanket', 'Pillow', 'Reading Light'],
        busType: 'AC Night Sleeper',
        isActive: true
      },
      {
        name: 'New Koshi Night Service (KTM→DHR)',
        image: '/images/kathmandu-dharan.jpg.jpeg',
        route: { from: 'Kathmandu', to: 'Dharan' },
        departureTime: '07:00 PM',
        arrivalTime: '06:00 AM',
        price: 1400,
        totalSeats: 40,
        bookedSeats: [],
        amenities: ['AC', 'Charging Port', 'Blanket', 'Pillow', 'Reading Light'],
        busType: 'AC Night Sleeper',
        isActive: true
      }
    ]);
    console.log(`${buses.length} buses created`);

    // Create company info
    const company = await Company.create({
      name: 'New Koshi A/C Yatayat Pvt. Ltd.',
      tagline: 'Your Comfort, Our Priority',
      description: 'New Koshi A/C Yatayat Pvt. Ltd. is Nepal\'s trusted bus service provider, offering safe, comfortable, and reliable transportation across the country. With modern AC coaches and professional service, we ensure your journey is as pleasant as your destination.',
      history: 'Founded in 2010, New Koshi A/C Yatayat has grown from a single route to become one of the most trusted names in intercity bus travel in Nepal. Our commitment to safety, punctuality, and customer satisfaction has earned us the loyalty of thousands of passengers.',
      services: [
        'AC Coach Service',
        'Online Booking System',
        'GPS Tracking',
        'Luggage Assistance',
        'Professional Drivers',
        '24/7 Customer Support'
      ],
      routes: [
        'Kathmandu - Dharan (Night Service)',
        'Dharan - Kathmandu (Night Service)',
        'Kathmandu - Dharan via Sindhuli (Day & Night)',
        'Dharan - Kathmandu via Sindhuli (Day & Night)',
        'And many more...'
      ],
      experience: '15+ years of trusted service',
      established: '2010',
      images: []
    });
    console.log('Company info created');

    // Create contact info
    const contact = await Contact.create({
      representativeName: 'Ram Prasad Sharma',
      phone: '+977 9800-000000',
      email: 'info@newkoshiyatayat.com',
      address: 'Head Office, Dharan-8, Sunsari, Nepal',
      officeHours: 'Sun-Fri: 6:00 AM - 8:00 PM',
      mapEmbedUrl: ''
    });
    console.log('Contact info created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin - Email:', admin.email, 'Password: admin123');
    console.log('User  - Email:', user.email, 'Password: user123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
