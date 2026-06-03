# 🔧 Troubleshooting Email Verification

## Common Issues & Solutions

### Issue 1: Existing Users Can't Login

**Error**: "Please verify your email before logging in"

**Cause**: Auto-verification didn't run or failed

**Check**:
1. Go to Render Dashboard → Logs
2. Look for: `✅ Auto-verified X existing users`
3. If missing, auto-verification failed

**Solutions**:

#### Quick Fix: Disable Email Verification Temporarily
Edit `backend/routes/auth.js` - Comment out the email check:

```javascript
// TEMPORARY: Comment this out to allow login
/*
if (!user.isEmailVerified) {
  return res.status(403).json({ 
    success: false, 
    message: 'Please verify your email before logging in.',
    needsVerification: true
  });
}
*/
```

#### Better Fix: Run Via Render Shell
1. Render Dashboard → Your Service → Shell
2. Run: `npm run verify-all-users`
3. Wait for success message

---

### Issue 2: Not Receiving Verification Emails

**Cause**: Email not configured or wrong credentials

**Check Render Environment Variables**:
```
EMAIL_HOST = smtp.gmail.com ✅
EMAIL_PORT = 587 ✅
EMAIL_USER = your-email@gmail.com ✅
EMAIL_PASSWORD = [16-char app password] ✅
EMAIL_FROM = noreply@newkoshi.com ✅
EMAIL_FROM_NAME = New Koshi A/C Yatayat ✅
```

**Check Render Logs**:
- Look for: `❌ Email send error`
- Look for: `📧 Email sent`

**Solutions**:

#### 1. Verify Gmail App Password:
- Must be 16 characters
- Format: `xxxx xxxx xxxx xxxx`
- No spaces when entering in Render
- Get new one: https://myaccount.google.com/security

#### 2. Test Email Manually:
Use Render Shell:
```bash
node -e "
require('dotenv').config();
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
transport.sendMail({
  from: process.env.EMAIL_FROM,
  to: 'prakashchaudhary92290@gmail.com',
  subject: 'Test Email',
  text: 'If you see this, email is working!'
}).then(() => console.log('✅ Email sent')).catch(err => console.error('❌', err.message));
"
```

#### 3. Use SendGrid Instead:
```
EMAIL_HOST = smtp.sendgrid.net
EMAIL_PORT = 587
EMAIL_USER = apikey
EMAIL_PASSWORD = [Your SendGrid API Key]
```

---

### Issue 3: Email Configuration Not Set

**If you haven't added email variables yet**:

#### Option A: Add Email Config (Recommended)
Add to Render → Environment:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=prakashchaudhary92290@gmail.com
EMAIL_PASSWORD=[GET APP PASSWORD]
EMAIL_FROM=noreply@newkoshi.com
EMAIL_FROM_NAME=New Koshi A/C Yatayat
```

#### Option B: Temporarily Disable Email Verification
For immediate access, disable email verification:

**In `backend/routes/auth.js`**:
```javascript
// Line ~155 - Comment out this block:
/*
if (!user.isEmailVerified) {
  return res.status(403).json({ 
    success: false, 
    message: 'Please verify your email before logging in.',
    needsVerification: true
  });
}
*/
```

**Commit and push**:
```bash
git add backend/routes/auth.js
git commit -m "Temporarily disable email verification"
git push origin master
```

**Re-enable later** after email is configured.

---

### Issue 4: Verification Link Not Working

**Error**: "Invalid or expired verification link"

**Causes**:
- Token expired (24 hours)
- Token used already
- Wrong FRONTEND_URL in Render

**Check FRONTEND_URL**:
```
FRONTEND_URL = https://your-vercel-app.vercel.app
```
Must match your actual Vercel URL!

**Solution**:
1. Use "Resend Verification" button
2. Or register again with same email
3. Check Render logs for actual link

---

### Issue 5: Auto-Verification Not Running

**Check Render Logs**:
Should see:
```
✅ Connected to MongoDB
🔄 Auto-verifying X existing users...
✅ Auto-verified X existing users
```

**If missing**:

#### Solution 1: Restart Render Service
Render Dashboard → Service → Manual Deploy → Deploy Latest Commit

#### Solution 2: Check Code Deployed
Verify `backend/server.js` has:
```javascript
await autoVerifyExistingUsers();
```

#### Solution 3: Run Manually
Render Shell:
```bash
npm run verify-all-users
```

---

## 🚨 Emergency: Disable Email Verification

**If you need immediate access**:

### Method 1: Environment Variable (Best)
Add to Render Environment:
```
DISABLE_EMAIL_VERIFICATION=true
```

Then update `backend/routes/auth.js`:
```javascript
// After password check, before email check:
if (process.env.DISABLE_EMAIL_VERIFICATION === 'true') {
  // Skip email verification
} else if (!user.isEmailVerified) {
  return res.status(403).json({ 
    success: false, 
    message: 'Please verify your email...'
  });
}
```

### Method 2: Quick Code Change
Comment out email verification check in `backend/routes/auth.js`

---

## 📊 Diagnostic Checklist

Run through this checklist:

### Backend Deployment:
- [ ] Render shows "Live" status
- [ ] Latest commit deployed
- [ ] No errors in Render logs

### Email Configuration:
- [ ] 6 email environment variables added to Render
- [ ] Gmail App Password correct (16 chars)
- [ ] Or SendGrid configured
- [ ] Render redeployed after adding variables

### Auto-Verification:
- [ ] Render logs show: `✅ Auto-verified X users`
- [ ] If not, run: `npm run verify-all-users` in Shell

### Frontend:
- [ ] Vercel deployed successfully
- [ ] REACT_APP_API_URL points to Render URL
- [ ] No console errors

### Database:
- [ ] MongoDB connection working
- [ ] Users collection accessible
- [ ] Check user: `isEmailVerified` field

---

## 🔍 Debug Commands

### Check Render Logs:
```bash
# In Render Dashboard → Logs tab
# Look for:
- "✅ Auto-verified X existing users"
- "📧 Email sent"
- "❌ Email send error"
```

### Test Email in Render Shell:
```bash
node -e "console.log('Email config:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  from: process.env.EMAIL_FROM
})"
```

### Verify Users in MongoDB:
```javascript
// In MongoDB Atlas or Compass:
db.users.find({}, { email: 1, isEmailVerified: 1 })
```

### Check Specific User:
```javascript
db.users.findOne({ email: "prakashchaudhary92290@gmail.com" })
// Should show: isEmailVerified: true
```

---

## 🎯 Quick Solutions

### Can't Login Right Now?

**Option 1**: Disable email verification temporarily (see above)

**Option 2**: Run manual verification:
```bash
# Render Shell:
npm run verify-all-users
```

**Option 3**: Update user directly in MongoDB:
```javascript
db.users.updateOne(
  { email: "your-email@gmail.com" },
  { $set: { isEmailVerified: true } }
)
```

### Emails Not Sending?

**Option 1**: Fix Gmail App Password

**Option 2**: Use SendGrid (more reliable)

**Option 3**: Disable email verification for now

---

## 📞 Get More Help

**Send me**:
1. Render logs (last 50 lines)
2. Specific error message
3. What you're trying to do (login? register?)
4. Whether you've added email config

**I'll help you**:
- Diagnose the exact issue
- Provide specific fix
- Get you working quickly

---

## ✅ Expected Working State

**When everything works**:

**Render Logs**:
```
✅ Connected to MongoDB
🔄 Auto-verifying 5 existing users...
✅ Auto-verified 5 existing users
🚀 Server running on port 5000
```

**Existing User Login**:
- Enter email/password
- Click "Sign In"
- ✅ Success! Logged in

**New User Registration**:
- Register account
- See "Check Your Email" message
- Receive email (check spam!)
- Click verification link
- See "Email Verified! 🎉"
- Can now login

---

**Tell me specifically what's not working and I'll give you the exact fix!**
