const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendVerificationEmail, sendWelcomeEmail } = require('../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: '7d',
    issuer: 'bus-booking-api',
    audience: 'bus-booking-client'
  });
};

// POST /api/auth/register
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
    .isLength({ max: 100 })
    .withMessage('Email too long'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be 8-128 characters')
    .matches(/[A-Za-z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .not().matches(/\s/)
    .withMessage('Password cannot contain spaces'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be 10-15 digits')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered. Please login or use a different email.' 
      });
    }

    // Create user
    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase(), 
      password, 
      phone: phone.trim() 
    });

    // Generate verification token
    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      await sendVerificationEmail(user, verificationToken);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        note: 'You need to verify your email before you can log in.'
      });
    } catch (emailError) {
      // If email fails, still return success but mention email issue
      console.error('Failed to send verification email:', emailError);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful! However, we could not send the verification email. Please contact support.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Check if account is locked
    if (user && user.isLocked()) {
      return res.status(423).json({ 
        success: false, 
        message: 'Account temporarily locked due to multiple failed login attempts. Please try again later.' 
      });
    }

    // Check if account is active
    if (user && !user.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account has been deactivated. Please contact support.' 
      });
    }

    // Verify password
    if (!user || !(await user.comparePassword(password))) {
      // Increment login attempts if user exists
      if (user) {
        await user.incLoginAttempts();
      }
      
      // Use same message for both wrong email and wrong password (prevents user enumeration)
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if email is verified (can be disabled via environment variable)
    if (process.env.SKIP_EMAIL_VERIFICATION !== 'true' && !user.isEmailVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before logging in. Check your inbox for the verification link.',
        needsVerification: true
      });
    }
    
    // Log if email verification is skipped
    if (process.env.SKIP_EMAIL_VERIFICATION === 'true') {
      console.log('⚠️  Email verification skipped (SKIP_EMAIL_VERIFICATION=true)');
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      await user.resetLoginAttempts();
    }

    res.json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user data' 
    });
  }
});

// PUT /api/auth/change-password - Change password
router.put('/change-password', protect, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be 8-128 characters')
    .matches(/[A-Za-z]/)
    .withMessage('New password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .not().matches(/\s/)
    .withMessage('New password cannot contain spaces')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id);

    // Verify current password
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Check if new password is same as current
    if (await user.comparePassword(newPassword)) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be different from current password' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again with your new password.',
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to change password' 
    });
  }
});

// GET /api/auth/verify-email/:token - Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification link. Please request a new verification email.'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.json({
        success: true,
        message: 'Email is already verified. You can now log in.',
        alreadyVerified: true
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.json({
      success: true,
      message: 'Email verified successfully! You can now log in to your account. 🎉'
    });
  } catch (error) {
    console.error('Email verification error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Email verification failed. Please try again.'
    });
  }
});

// POST /api/auth/resend-verification - Resend verification email
router.post('/resend-verification', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if email exists (security)
      return res.json({
        success: true,
        message: 'If an account with that email exists, a verification email has been sent.'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified. You can log in now.'
      });
    }

    // Generate new verification token
    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      await sendVerificationEmail(user, verificationToken);

      res.json({
        success: true,
        message: 'Verification email sent! Please check your inbox.'
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);

      res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email. Please try again.'
    });
  }
});

module.exports = router;
