/**
 * Auto-Verify Existing Users
 * 
 * This utility automatically verifies all existing users when the server starts.
 * It only runs once and doesn't affect new users who still need email verification.
 */

const User = require('../models/User');

const autoVerifyExistingUsers = async () => {
  try {
    // Find users without email verification status
    const unverifiedUsers = await User.find({
      $or: [
        { isEmailVerified: false },
        { isEmailVerified: { $exists: false } }
      ]
    });

    if (unverifiedUsers.length === 0) {
      console.log('✅ All users are already verified');
      return;
    }

    console.log(`🔄 Auto-verifying ${unverifiedUsers.length} existing users...`);

    // Update all existing users to verified
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

    console.log(`✅ Auto-verified ${result.modifiedCount} existing users`);
    console.log('💡 New users will still need to verify their email');

  } catch (error) {
    console.error('⚠️  Auto-verification failed:', error.message);
    console.log('⚠️  Existing users may need manual verification');
  }
};

module.exports = autoVerifyExistingUsers;
