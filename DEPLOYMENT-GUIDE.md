# 🚀 Deployment Guide - Bus Booking System with Sleeper Layout

## ✅ Current Status

### Build Status
- **Frontend**: ✅ Compiled successfully (96.62 kB)
- **Backend**: ✅ Running on port 5000
- **Database**: ✅ Connected to MongoDB
- **Feature**: ✅ Hybrid sleeper layout implemented

### Servers Running
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Network**: http://192.168.1.36:3000

---

## 📋 Quick Deployment Options

### Option 1: Local/Single Server Deployment

**Using PowerShell (Windows):**
```powershell
cd bus-booking
.\deploy.ps1
cd backend
npm start
```

**Using Bash (Linux/Mac):**
```bash
cd bus-booking
chmod +x deploy.sh
./deploy.sh
cd backend
npm start
```

**Manual Steps:**
```bash
# 1. Build frontend
cd bus-booking/frontend
npm run build

# 2. Copy to backend (optional)
cp -r build/* ../backend/public/

# 3. Start backend
cd ../backend
npm start
```

The app will be available at: http://localhost:5000

---

### Option 2: Vercel (Frontend) + Render (Backend)

#### Deploy Frontend to Vercel

**Method 1: Vercel CLI**
```bash
cd bus-booking/frontend
npm install -g vercel
vercel --prod
```

**Method 2: Vercel Dashboard**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Set root directory to `bus-booking/frontend`
4. Deploy

**Environment Variables (Vercel):**
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

#### Deploy Backend to Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect your GitHub repository
5. Set root directory to `bus-booking/backend`
6. Render will use `render.yaml` for configuration

**Environment Variables (Render):**
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
PORT=5000
```

---

### Option 3: Netlify (Frontend) + Railway (Backend)

#### Deploy Frontend to Netlify

```bash
cd bus-booking/frontend
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

**Environment Variables (Netlify):**
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

#### Deploy Backend to Railway

1. Go to https://railway.app
2. Create new project from GitHub
3. Select `bus-booking/backend` directory
4. Add environment variables
5. Deploy

---

### Option 4: Docker Deployment

**Create docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

**Deploy:**
```bash
cd bus-booking
docker-compose up -d
```

---

## 🔧 Environment Configuration

### Frontend Environment Variables

**Development (.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Production (.env.production):**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### Backend Environment Variables

**Required (.env):**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/bus-booking
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bus-booking

# Authentication
JWT_SECRET=your_very_secure_random_string_here

# Server
PORT=5000
NODE_ENV=production

# Optional
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## 🧪 Pre-Deployment Testing

### Test Locally Before Deploying

```bash
# 1. Start backend
cd bus-booking/backend
npm start

# 2. In another terminal, start frontend
cd bus-booking/frontend
npm start

# 3. Test the following:
```

**Test Checklist:**
- [ ] Admin login works
- [ ] Create bus with sleeper enabled
- [ ] Verify last row shows 4 sleeper berths
- [ ] Verify other rows show regular seats
- [ ] Book a sleeper berth (Lower/Upper)
- [ ] Book a regular seat
- [ ] Check booking confirmation
- [ ] View "My Bookings"
- [ ] Cancel a booking
- [ ] Test on mobile browser

---

## 📊 Database Setup

### MongoDB Atlas (Recommended for Production)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user
4. Whitelist IP addresses (or allow from anywhere: 0.0.0.0/0)
5. Get connection string
6. Update `MONGODB_URI` in backend .env

**Connection String Format:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bus-booking?retryWrites=true&w=majority
```

### Local MongoDB

```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# Connection string:
MONGODB_URI=mongodb://localhost:27017/bus-booking
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable CORS only for your frontend domain
- [ ] Use HTTPS for both frontend and backend
- [ ] Set secure MongoDB credentials
- [ ] Enable MongoDB authentication
- [ ] Set up rate limiting
- [ ] Enable helmet.js security headers
- [ ] Validate all user inputs
- [ ] Use environment variables (never commit .env)

---

## 📱 Mobile & Browser Testing

Test on:
- [ ] Chrome (Desktop & Mobile)
- [ ] Firefox
- [ ] Safari (Desktop & Mobile)
- [ ] Edge
- [ ] Mobile devices (iOS & Android)

---

## 🐛 Troubleshooting

### Frontend Issues

**Build fails:**
```bash
# Clear cache and rebuild
cd bus-booking/frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API calls fail:**
- Check `REACT_APP_API_URL` in .env
- Verify backend is running
- Check CORS settings in backend

### Backend Issues

**MongoDB connection fails:**
- Verify `MONGODB_URI` is correct
- Check MongoDB service is running
- Verify network access (firewall/security groups)

**Port already in use:**
```bash
# Change PORT in .env
PORT=5001
```

---

## 📈 Monitoring & Logs

### View Backend Logs

**Local:**
```bash
cd bus-booking/backend
npm start
# Logs appear in terminal
```

**Render:**
- Go to Render dashboard
- Select your service
- Click "Logs" tab

**Railway:**
- Go to Railway dashboard
- Select your project
- View deployment logs

---

## 🔄 Updating After Deployment

### Update Frontend

```bash
cd bus-booking/frontend
# Make changes
npm run build
# Deploy new build
```

### Update Backend

```bash
cd bus-booking/backend
# Make changes
git push
# Render/Railway will auto-deploy
```

---

## 📞 Support & Resources

### Documentation
- React: https://react.dev
- Express: https://expressjs.com
- MongoDB: https://www.mongodb.com/docs
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs

### Common Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## ✅ Deployment Complete!

Once deployed, your bus booking system with hybrid sleeper layout will be live and ready to use!

**Features Available:**
- ✅ User registration and login
- ✅ Browse available buses
- ✅ Book regular seats
- ✅ Book sleeper berths (4 at last row)
- ✅ View booking history
- ✅ Cancel bookings
- ✅ Admin panel for bus management
- ✅ Hybrid seat layout (regular + sleeper)

---

**Last Updated**: 2026-05-01
**Version**: 1.0.0 (Hybrid Sleeper Layout)
