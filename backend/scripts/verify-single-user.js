/**
 * Script: Verify Single User by Email
 * 
 * This script verifies a specific user account by email address.
 * Useful for manually verifying specific accounts.
 * 
 * Usage: node scripts/verify-single-user.js email@example.com
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const verifySingleUser = async (email) => {
  try {
    if (!email) {
      console.error('❌ Error: Email address required');
      console.log('\nUsage: node scripts/verify-single-user.js email@example.com');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log('👤 User found:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Current status: ${user.isEmailVerified ? '✅ Verified' : '❌ Not verified'}\n`);

    if (user.isEmailVerified) {
      console.log('✅ User is already verified!');
      process.exit(0);
    }

    // Verify the user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.log('✅ User successfully verified!');
    console.log(`\n${user.name} (${user.email}) can now log in.\n`);

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Get email from command line argument
const email = process.argv[2];
verifySingleUser(email);
