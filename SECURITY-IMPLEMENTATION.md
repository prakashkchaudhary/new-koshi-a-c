# Security Implementation Guide

## Overview
This document outlines all security measures implemented in the Bus Booking System to protect against common vulnerabilities and attacks.

## 🔒 Security Features Implemented

### 1. Authentication & Authorization

#### Enhanced User Model
- **Password Security**: Bcrypt hashing with salt rounds of 12
- **Account Locking**: Automatic lock after 5 failed login attempts for 2 hours
- **Password Change Tracking**: `passwordChangedAt` field to invalidate old tokens
- **Account Status**: `isActive` field for account deactivation
- **Login Attempts Tracking**: Monitors and limits failed login attempts

#### JWT Token Security
- **Expiration**: 7-day token expiration
- **Issuer/Audience**: Tokens include issuer and audience claims
- **Token Invalidation**: Tokens invalidated after password change
- **Secure Verification**: Proper error handling for expired/invalid tokens

#### Password Requirements
- Minimum 8 characters, maximum 128 characters
- Must contain at least one letter
- Must contain at least one number
- No spaces allowed
- Cannot reuse current password when changing

### 2. Rate Limiting

#### Auth Rate Limiter
- **Window**: 15 minutes
- **Max Requests**: 5 login attempts
- **Scope**: `/api/auth/*` routes
- **Behavior**: Skips successful requests, only counts failures

#### Booking Rate Limiter
- **Window**: 1 minute
- **Max Requests**: 3 bookings
- **Scope**: `/api/bookings/*` routes
- **Purpose**: Prevent booking spam and seat hoarding

#### API Rate Limiter
- **Window**: 15 minutes
- **Max Requests**: 100 requests
- **Scope**: `/api/buses/*`, `/api/company/*`, `/api/contact/*`
- **Purpose**: General API protection

### 3. Input Validation & Sanitization

#### Input Sanitization Middleware
- **XSS Prevention**: Removes `<script>` tags and JavaScript event handlers
- **Scope**: All request body, query, and params
- **Method**: Recursive sanitization of nested objects

#### Parameter Pollution Prevention
- **Protection**: Prevents array-based parameter pollution
- **Allowed Arrays**: `seats`, `amenities` (whitelisted)
- **Behavior**: Takes first value only for non-whitelisted params

#### MongoDB ObjectId Validation
- **Validation**: Checks ObjectId format before database queries
- **Applied To**: All routes with `:id` parameters
- **Error Response**: 400 Bad Request with clear message

#### Express Validator
- **Email Validation**: Proper email format with normalization
- **Phone Validation**: 10-15 digits with format checking
- **Name Validation**: 2-50 characters, letters and spaces only
- **Length Limits**: All string inputs have max length validation

### 4. Security Headers

#### Custom Security Headers
- **X-Frame-Options**: `DENY` (prevents clickjacking)
- **X-Content-Type-Options**: `nosniff` (prevents MIME sniffing)
- **X-XSS-Protection**: `1; mode=block` (enables XSS filter)
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **X-Powered-By**: Removed (hides Express)

#### Helmet Configuration
- **Content Security Policy**: Strict CSP with specific directives
- **HSTS**: Enabled with 1-year max age and preload
- **Cross-Origin Resource Policy**: `cross-origin` for images
- **Default Protections**: All helmet defaults enabled

### 5. Request Size Limiting
- **Max Size**: 10MB per request
- **Check**: Pre-validation via Content-Length header
- **Response**: 413 Payload Too Large

### 6. CORS Configuration
- **Allowed Origins**: Whitelist-based with dynamic verification
- **Credentials**: Enabled for authenticated requests
- **Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers**: Content-Type, Authorization
- **Special Cases**: Allows Vercel preview deployments and no-origin requests

### 7. Data Protection

#### Atomic Operations
- **Seat Booking**: Uses `findOneAndUpdate` with atomic operations
- **Race Condition Prevention**: Prevents double-booking via MongoDB operators
- **Seat Release**: Atomic `$pull` operation on cancellation

#### Ownership Verification
- **Booking Access**: Users can only view/cancel their own bookings
- **Admin Override**: Admins have full access with explicit checks
- **Strict Comparison**: Uses `.toString()` for ObjectId comparison

#### Input Length Limits
- **Bus Name**: 200 characters
- **Route Names**: 100 characters each
- **Times**: 20 characters
- **Seat Labels**: 5 characters (uppercase, trimmed)
- **Company Description**: 2000 characters
- **Company History**: 2000 characters

### 8. Error Handling

#### Secure Error Messages
- **User Enumeration Prevention**: Same message for wrong email/password
- **Generic Errors**: Internal errors don't expose system details
- **Logging**: Detailed errors logged server-side only
- **Client Messages**: User-friendly, non-technical messages

#### Global Error Handler
- **Catch-All**: Handles uncaught errors
- **Logging**: Console error with stack trace
- **Response**: Generic 500 error to client

#### Unhandled Rejections
- **Process Handler**: Logs unhandled promise rejections
- **Prevents Crashes**: Keeps server running

### 9. Business Logic Security

#### 7-Day Booking Window
- **Validation**: Server-side date range checking
- **Past Date Prevention**: Cannot book past dates
- **Future Limit**: Maximum 7 days in advance
- **Clear Messages**: Explains booking window to users

#### Seat Limit
- **Max Seats**: 10 seats per booking
- **Validation**: Server-side enforcement
- **Purpose**: Prevents bulk booking abuse

#### 24-Hour Auto-Refresh
- **Cron Job**: Runs every hour
- **Logic**: Frees seats 24 hours after travel date
- **Cleanup**: Removes old cancelled bookings daily

## 🛡️ Security Best Practices Applied

### 1. Defense in Depth
- Multiple layers of security (validation, sanitization, rate limiting)
- Client-side and server-side validation
- Database-level constraints

### 2. Principle of Least Privilege
- Role-based access control (user vs admin)
- Strict ownership checks
- Admin-only routes properly protected

### 3. Fail Securely
- Account locks on failed attempts
- Generic error messages
- Graceful degradation

### 4. Don't Trust User Input
- All inputs validated and sanitized
- Type checking and length limits
- Format validation (email, phone, ObjectId)

### 5. Security by Default
- Secure defaults in all configurations
- Opt-in for sensitive operations
- Automatic security headers

## 🔍 Testing Security Features

### Test Account Locking
```bash
# Make 5 failed login attempts
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}'

# 6th attempt should return 423 Locked
```

### Test Rate Limiting
```bash
# Make rapid requests to trigger rate limiter
for i in {1..10}; do
  curl http://localhost:5000/api/buses
done
```

### Test Input Sanitization
```bash
# Try XSS injection
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"test@test.com","password":"Test1234","phone":"1234567890"}'
```

### Test ObjectId Validation
```bash
# Try invalid ObjectId
curl http://localhost:5000/api/buses/invalid-id
# Should return 400 Bad Request
```

### Test Booking Window
```bash
# Try booking 8 days in advance
curl -X POST http://localhost:5000/api/bookings/book-ticket \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"busId":"VALID_ID","seats":["A1"],"travelDate":"2026-05-11"}'
# Should return error about 7-day limit
```

## 📋 Security Checklist

- [x] Password hashing with bcrypt
- [x] JWT token authentication
- [x] Account locking after failed attempts
- [x] Rate limiting on all routes
- [x] Input validation and sanitization
- [x] XSS prevention
- [x] CSRF protection via SameSite cookies
- [x] SQL/NoSQL injection prevention
- [x] Security headers (helmet)
- [x] CORS configuration
- [x] Request size limiting
- [x] Parameter pollution prevention
- [x] ObjectId validation
- [x] Atomic database operations
- [x] Ownership verification
- [x] Error message sanitization
- [x] Logging and monitoring
- [x] Business logic validation

## 🚀 Deployment Security

### Environment Variables
Ensure these are set securely:
- `JWT_SECRET`: Strong random string (min 32 characters)
- `MONGODB_URI`: Connection string with authentication
- `NODE_ENV`: Set to `production`
- `FRONTEND_URL`: Your production frontend URL

### Production Checklist
- [ ] Use HTTPS only
- [ ] Set secure environment variables
- [ ] Enable MongoDB authentication
- [ ] Use connection pooling
- [ ] Set up monitoring and alerts
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Rate limit tuning based on traffic
- [ ] Log rotation configured

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🔄 Maintenance

### Regular Tasks
1. **Weekly**: Review security logs for suspicious activity
2. **Monthly**: Update dependencies (`npm audit fix`)
3. **Quarterly**: Security audit and penetration testing
4. **Yearly**: Review and update security policies

### Monitoring
- Failed login attempts
- Rate limit hits
- Unusual booking patterns
- Error rates
- Response times

---

**Last Updated**: May 3, 2026
**Version**: 1.0.0
**Status**: ✅ Fully Implemented
