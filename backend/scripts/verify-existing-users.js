/**
 * Migration Script: Verify Existing Users
 * 
 * This script automatically verifies all existing user accounts
 * that were created before the email verification feature was implemented.
 * 
 * Run this once after deploying the email verification feature.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const verifyExistingUsers = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all users where isEmailVerified is false or undefined
    const unverifiedUsers = await User.find({
      $or: [
        { isEmailVerified: false },
        { isEmailVerified: { $exists: false } }
      ]
    });

    console.log(`📊 Found ${unverifiedUsers.length} unverified users\n`);

    if (unverifiedUsers.length === 0) {
      console.log('✅ All users are already verified!');
      process.exit(0);
    }

    // Show users that will be verified
    console.log('👥 Users to be verified:');
    unverifiedUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
    });
    console.log('');

    // Update all existing users to verified status
    const result = await User.updateMany(
      {
        $or: [
          { isEmailVerified: false },
          { isEmailVerified: { $exists: false } }
        ]
      },
      {
        $set: { isEmailVerified: true },
        $unset: { 
          emailVerificationToken: "",
          emailVerificationExpires: ""
        }
      }
    );

    console.log(`✅ Successfully verified ${result.modifiedCount} existing users!`);
    console.log('');
    console.log('📋 Summary:');
    console.log(`   - Total users found: ${unverifiedUsers.length}`);
    console.log(`   - Users updated: ${result.modifiedCount}`);
    console.log('');
    console.log('✅ Migration complete! All existing users can now log in.');
    console.log('💡 New users registering from now on will need to verify their email.');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the migration
console.log('🚀 Starting migration: Verify Existing Users\n');
console.log('This will verify all existing accounts so they can log in.');
console.log('New accounts created after this will still need email verification.\n');

verifyExistingUsers();
