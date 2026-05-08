require('dotenv').config();
const mongoose = require('mongoose');
const Bus = require('../models/Bus');

// Default fallback images for different routes
const defaultImages = {
  'dharan-kathmandu': '/images/dharan-kathmandu.jpg.jpeg',
  'kathmandu-dharan': '/images/kathmandu-dharan.jpg.jpeg',
  'default': '/images/bus-exterior.jpg.jpeg'
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const buses = await Bus.find();
    let fixed = 0;
    
    for (const bus of buses) {
      // Check if image path starts with /uploads/ (broken)
      if (bus.image && bus.image.startsWith('/uploads/')) {
        console.log(`🔧 Fixing: ${bus.name}`);
        console.log(`   Old image: ${bus.image}`);
        
        // Determine appropriate fallback based on route
        let newImage = defaultImages.default;
        const routeKey = `${bus.route.from.toLowerCase()}-${bus.route.to.toLowerCase()}`;
        
        if (routeKey.includes('dharan') && routeKey.includes('kathmandu')) {
          newImage = defaultImages['dharan-kathmandu'];
        } else if (routeKey.includes('kathmandu') && routeKey.includes('dharan')) {
          newImage = defaultImages['kathmandu-dharan'];
        }
        
        bus.image = newImage;
        await bus.save();
        
        console.log(`   New image: ${newImage}`);
        console.log('   ✅ Fixed\n');
        fixed++;
      }
    }
    
    console.log(`\n✅ Fixed ${fixed} buses with missing images`);
    console.log(`\n💡 Note: These buses now use public folder images.`);
    console.log(`   To use custom images, please use image URLs or set up cloud storage.\n`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
