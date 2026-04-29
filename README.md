# SwiftRide Bus Ticket Booking System

A full-stack bus ticket booking web application with real-time seat selection, admin management, and JWT authentication.

## Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Auth**: JWT + bcrypt

---

## Project Structure

```
bus-booking/
├── backend/
│   ├── middleware/       # auth.js, upload.js
│   ├── models/           # User, Bus, Booking, Company, Contact
│   ├── routes/           # auth, buses, bookings, company, contact
│   ├── scripts/          # seed.js
│   ├── uploads/          # uploaded images (auto-created)
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/   # Navbar, Footer, BusCard, SeatLayout, etc.
    │   ├── context/      # AuthContext
    │   ├── pages/        # Home, About, BusDetails, BookTicket, etc.
    │   │   └── admin/    # Dashboard, Buses, Bookings, Company, Contact
    │   └── utils/        # api.js (axios instance)
    ├── .env.example
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone & Install

```bash
# Backend
cd bus-booking/backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 2. Configure Environment

**Backend** — copy `.env.example` to `.env`:
```bash
cd bus-booking/backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bus-booking
JWT_SECRET=your_super_secret_key_change_this
ADMIN_EMAIL=admin@busservice.com
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

**Frontend** — copy `.env.example` to `.env`:
```bash
cd bus-booking/frontend
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 3. Seed the Database

```bash
cd bus-booking/backend
npm run seed
```

This creates:
- Admin user: `admin@busservice.com` / `admin123`
- Sample user: `user@example.com` / `user123`
- 5 sample buses
- Company & contact info

---

### 4. Run the Application

**Terminal 1 — Backend:**
```bash
cd bus-booking/backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd bus-booking/frontend
npm start
# App runs on http://localhost:3000
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Buses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/buses` | Public | Get all active buses |
| GET | `/api/buses/:id` | Public | Get single bus |
| GET | `/api/buses/admin/all` | Admin | Get all buses |
| POST | `/api/buses` | Admin | Add bus |
| PUT | `/api/buses/:id` | Admin | Update bus |
| DELETE | `/api/buses/:id` | Admin | Delete bus |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings/book-ticket` | User | Book a ticket |
| GET | `/api/bookings/my-bookings` | User | Get user's bookings |
| GET | `/api/bookings` | Admin | Get all bookings |
| GET | `/api/bookings/:id` | User/Admin | Get single booking |
| PUT | `/api/bookings/:id/cancel` | User/Admin | Cancel booking |

### Company & Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/company` | Public | Get company info |
| PUT | `/api/company` | Admin | Update company info |
| GET | `/api/contact` | Public | Get contact info |
| PUT | `/api/contact` | Admin | Update contact info |

---

## Features

### User Features
- Register & login with JWT
- Browse available buses with search/filter
- Real-time 2+2 AC coach seat selection (green/blue/red)
- Book tickets with date selection
- View booking confirmation with ticket ID
- Cancel bookings
- Booking history

### Admin Features
- Dashboard with stats (buses, bookings, revenue)
- Add/Edit/Delete buses with image upload
- View and manage all bookings
- Update company information
- Update contact/representative info

### Seat Layout
- 2+2 AC coach layout (rows A-J, 40 seats)
- Green = Available, Blue = Selected, Red = Booked
- Visual aisle separator
- Driver/front indicator

---

## Deployment

### Backend → Render
1. Push to GitHub
2. Create new Web Service on Render
3. Set root directory to `bus-booking/backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `.env`

### Frontend → Vercel
1. Push to GitHub
2. Import project on Vercel
3. Set root directory to `bus-booking/frontend`
4. Add `REACT_APP_API_URL=https://your-render-url.onrender.com/api`
5. Deploy

---

## Sample Test Data

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@busservice.com | admin123 |
| User | user@example.com | user123 |

Sample buses include routes: Dhaka→Chittagong, Dhaka→Sylhet, Dhaka→Rajshahi, Dhaka→Cox's Bazar
