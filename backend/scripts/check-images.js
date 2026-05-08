require('dotenv').config();
const mongoose = require('mongoose');
const Bus = require('../models/Bus');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const buses = await Bus.find();
    console.log(`Found ${buses.length} buses:\n`);
    
    buses.forEach((bus, i) => {
      console.log(`${i + 1}. ${bus.name}`);
      console.log(`   Image: ${bus.image || '(no image)'}`);
      console.log(`   Created: ${bus.createdAt}`);
      console.log('');
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
