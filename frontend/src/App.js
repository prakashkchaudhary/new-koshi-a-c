import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import BusDetails from './pages/BusDetails';
import BookTicket from './pages/BookTicket';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import BookingConfirmation from './pages/BookingConfirmation';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminBuses from './pages/admin/Buses';
import AdminBookings from './pages/admin/Bookings';
import AdminCompany from './pages/admin/Company';
import AdminContact from './pages/admin/ContactInfo';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/buses" element={<BusDetails />} />
              <Route path="/book/:busId" element={<ProtectedRoute><BookTicket /></ProtectedRoute>} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/booking-confirmation/:id" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/buses" element={<AdminRoute><AdminBuses /></AdminRoute>} />
              <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
              <Route path="/admin/company" element={<AdminRoute><AdminCompany /></AdminRoute>} />
              <Route path="/admin/contact" element={<AdminRoute><AdminContact /></AdminRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#1e293b', color: '#fff', borderRadius: '8px' }
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
