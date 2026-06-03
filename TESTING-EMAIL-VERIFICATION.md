# 🧪 Testing Email Verification - Quick Guide

## ⚡ Quick Start

### 1. Start Backend
```bash
cd backend
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm start
```

### 3. Test Registration Flow

1. **Register New Account**: http://localhost:3000/register
   - Fill in: Name, Email, Password, Phone
   - Click "Create Account"
   - You should see "Check Your Email" message

2. **Check Backend Console**:
   - Look for: `📧 Email sent: <message-id>`
   - Look for: `📧 Preview URL: https://ethereal.email/message/...`
   - Copy the preview URL

3. **View Email**:
   - Open the Ethereal preview URL in browser
   - OR check your real email if you configured Gmail/SendGrid
   - Click "✅ Verify Email Address" button

4. **Verify Email**:
   - Should redirect to verification page
   - Shows "Email Verified! 🎉"
   - Auto-redirects to login after 3 seconds

5. **Login**:
   - Use the email and password you registered with
   - Should log in successfully

## 🔍 What to Test

### ✅ Success Cases:
- [ ] Register with valid details → Email sent message appears
- [ ] Click verification link → Email verified successfully
- [ ] Login with verified account → Successful login
- [ ] Resend verification email → New email sent

### ❌ Error Cases:
- [ ] Try to login before verifying → "Please verify your email" error
- [ ] Click expired verification link → Error + resend option
- [ ] Register with same email twice → "Email already registered" error
- [ ] Click verification link twice → "Already verified" message

## 📧 Email Configuration Options

### Option 1: Development (Default - Ethereal)
**No setup required!** Already configured in .env
- Emails appear in console with preview URLs
- Click preview URL to see the email
- Perfect for testing

### Option 2: Use Your Gmail
Edit `backend/.env`:
```env
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=New Koshi A/C Yatayat
```

**Get Gmail App Password**:
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search "App passwords"
4. Generate password for "Mail"
5. Copy 16-character password to .env

## 🐛 Common Issues

### Issue: No email in console
**Check**: Backend console should show email logs
**Fix**: Restart backend server

### Issue: "Failed to send email"
**Check**: Email credentials in .env
**Fix**: Verify EMAIL_USER and EMAIL_PASSWORD are correct

### Issue: Verification link doesn't work
**Check**: Token might be expired (24 hours)
**Fix**: Use "Resend Verification Email" button

### Issue: Still can't login after verifying
**Check**: Database connection
**Fix**: Check MongoDB connection, verify user.isEmailVerified = true

## 📊 Check Database

To verify user status in MongoDB:
```javascript
// Find unverified users
db.users.find({ isEmailVerified: false })

// Find verified users
db.users.find({ isEmailVerified: true })

// Manually verify a user (if needed)
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { isEmailVerified: true } }
)
```

## 🎯 Expected Behavior

### After Registration:
- ✅ User created in database with `isEmailVerified: false`
- ✅ Verification email sent
- ✅ Frontend shows "Check Your Email" message
- ✅ Console logs email preview URL

### After Clicking Verification Link:
- ✅ Token validated
- ✅ User updated: `isEmailVerified: true`
- ✅ Welcome email sent
- ✅ Frontend shows success message
- ✅ Auto-redirect to login

### After Login Attempt (Unverified):
- ❌ Login blocked
- ❌ Error: "Please verify your email before logging in"

### After Login Attempt (Verified):
- ✅ Login successful
- ✅ JWT token issued
- ✅ Redirect to home/dashboard

## 🔗 Test URLs

- Registration: http://localhost:3000/register
- Login: http://localhost:3000/login
- Verification: http://localhost:3000/verify-email/:token
- Backend API: http://localhost:5000/api/auth/

## 📝 Test Accounts

Create these test accounts:
1. **Verified User**: Register → Verify → Can login
2. **Unverified User**: Register → Don't verify → Cannot login
3. **Expired Token**: Register → Wait 24h → Token expired

## ✨ Success Indicators

**Backend Console**:
```
📧 Email sent: <message-id>
📧 Preview URL: https://ethereal.email/message/xxxxx
```

**Frontend**:
- Registration → "Check Your Email" page
- Verification → Green checkmark + success message
- Login (verified) → Dashboard/Home
- Login (unverified) → Error toast

## 🚀 Ready for Production

Before deploying:
- [ ] Configure real email service (Gmail/SendGrid/Mailgun)
- [ ] Update FRONTEND_URL in backend .env to Vercel URL
- [ ] Test with real email addresses
- [ ] Verify emails land in inbox (not spam)
- [ ] Test complete flow in production environment

---

**Quick Test**: Register → Check Console → Click Preview URL → Verify → Login ✅
