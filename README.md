# 🚌 New Koshi A/C Yatayat - Bus Booking System

Modern bus ticket booking system for New Koshi A/C Yatayat with real-time seat selection, email verification, and secure payment processing.

---

## 🚀 Features

- 🎫 **Real-time Seat Booking** - Interactive seat selection with live availability
- 📧 **Email Verification** - Secure user registration with email confirmation
- 🔒 **Secure Authentication** - JWT-based auth with account locking after failed attempts
- 🗺️ **Interactive Route Map** - Leaflet map showing bus routes across Nepal
- 💳 **eSewa Integration** - Secure online payment processing
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔄 **Auto Seat Refresh** - Seats auto-reset 24 hours after travel date
- ⏰ **Booking Limits** - Maximum 7 days advance booking
- 🛡️ **Security Features** - Rate limiting, input sanitization, XSS protection

---

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Leaflet Maps
- Axios
- React Hot Toast

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (Email)
- Helmet (Security)
- Express Rate Limit
- Node-Cron (Scheduled Jobs)

---

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account or local MongoDB
- Gmail account (for email) or SendGrid API key
- eSewa Merchant account (for payments)

---

## ⚙️ Installation

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd bus-booking
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Environment Configuration

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-min-32-chars>
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email@gmail.com>
EMAIL_PASSWORD=<your-gmail-app-password>
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=New Koshi A/C Yatayat

# Admin Account
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<secure-admin-password>

# Optional: Skip email verification for testing
# SKIP_EMAIL_VERIFICATION=true
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**⚠️ SECURITY: Never commit `.env` files to Git!**

---

## 🚀 Running Locally

### Start Backend:
```bash
cd backend
npm start
# or for development:
npm run dev
```
Server runs on: http://localhost:5000

### Start Frontend:
```bash
cd frontend
npm start
```
App runs on: http://localhost:3000

---

## 📦 Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect to GitHub repository
4. Set environment variables in Render dashboard
5. Deploy automatically on git push

### Frontend (Vercel)
1. Push code to GitHub
2. Import project on Vercel
3. Connect to GitHub repository
4. Set environment variables
5. Deploy automatically on git push

---

## 🔒 Security Best Practices

### Credentials Management:
- ✅ Store all secrets in environment variables
- ✅ Use `.gitignore` to exclude `.env` files
- ✅ Never commit passwords or API keys
- ✅ Rotate credentials regularly (every 90 days)
- ✅ Use different credentials per environment

### Database Security:
- ✅ Enable MongoDB Atlas IP whitelist
- ✅ Use strong, unique passwords
- ✅ Enable database encryption at rest
- ✅ Regular backups
- ✅ Monitor access logs

### Application Security:
- ✅ Rate limiting enabled
- ✅ Input sanitization
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure headers (Helmet)
- ✅ Account locking after failed logins

---

## 📧 Email Configuration

### Gmail Setup:
1. Enable 2-Step Verification on Gmail
2. Generate App Password:
   - Google Account → Security → App Passwords
   - Select "Mail" and generate
   - Use 16-character password in `EMAIL_PASSWORD`

### SendGrid (Recommended for Production):
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=<your-sendgrid-api-key>
```

---

## 🗺️ Routes

### Public Routes:
- `/` - Home page with route map
- `/buses` - Browse available buses
- `/about` - About company
- `/contact` - Contact form
- `/login` - User login
- `/register` - User registration
- `/verify-email/:token` - Email verification

### Protected Routes:
- `/my-bookings` - User's booking history
- `/book/:busId` - Book bus tickets
- `/booking-confirmation/:id` - Booking confirmation

### Admin Routes:
- `/admin` - Admin dashboard
- `/admin/buses` - Manage buses
- `/admin/bookings` - View all bookings
- `/admin/company` - Company settings
- `/admin/contact` - Contact inquiries

---

## 🛠️ Scripts

### Backend:
```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run seed           # Seed database with initial data
npm run verify-all-users        # Verify all existing users
npm run verify-user <email>     # Verify specific user by email
```

### Frontend:
```bash
npm start              # Start development server
npm run build          # Build for production
```

---

## 🔧 Troubleshooting

### Email Verification Not Working:
1. Check email credentials in Render
2. Verify Gmail App Password is correct
3. Check Render logs for email errors
4. Temporarily disable: `SKIP_EMAIL_VERIFICATION=true`

### Can't Login:
1. Verify email is confirmed
2. Check account isn't locked (5 failed attempts = 2hr lock)
3. Clear browser cache and try incognito
4. Check backend logs for specific error

### Database Connection Issues:
1. Verify MongoDB URI is correct
2. Check IP whitelist in MongoDB Atlas
3. Ensure network allows MongoDB ports
4. Check MongoDB Atlas status

---

## 📊 Database Schema

### Users
- name, email, password (hashed)
- phone, role (user/admin)
- isEmailVerified, emailVerificationToken
- loginAttempts, lockUntil
- isActive

### Buses
- name, busNumber, type (AC/Non-AC)
- route (from, to, via)
- timings (departure, arrival, duration)
- seats (total, layout, booked, blocked)
- pricing, amenities, images

### Bookings
- user, bus, travelDate
- seats, passengers
- totalAmount, paymentStatus
- paymentMethod, bookingStatus

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is proprietary software for New Koshi A/C Yatayat Pvt. Ltd.

---

## 📞 Support

For issues or questions:
- Email: support@newkoshi.com
- Phone: +977 XXXX-XXXXXX

---

## ⚠️ Important Security Note

**If you've accidentally exposed credentials:**
1. See `SECURITY-CLEANUP.md` for immediate actions
2. Rotate all exposed credentials immediately
3. Update environment variables in all deployments
4. Monitor for suspicious activity

---

## 🎯 Production Checklist

Before going live:
- [ ] Changed default admin password
- [ ] Configured production email service
- [ ] Enabled MongoDB IP whitelist
- [ ] Set up SSL/HTTPS
- [ ] Configured proper CORS origins
- [ ] Set `NODE_ENV=production`
- [ ] Tested all user flows
- [ ] Set up monitoring and logging
- [ ] Backed up database
- [ ] Reviewed security settings

---

**Version**: 1.0.0  
**Last Updated**: June 3, 2026  
**Company**: New Koshi A/C Yatayat Pvt. Ltd.  
**Location**: Dharan-8, Sunsari, Nepal
