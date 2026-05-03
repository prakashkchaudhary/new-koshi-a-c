import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    totalBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    availableSeats: 0,
    bookedSeats: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [topBuses, setTopBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [busesRes, bookingsRes] = await Promise.all([
        api.get('/buses/admin/all'),
        api.get('/bookings?limit=100')
      ]);

      const buses = busesRes.data.buses || [];
      const bookings = bookingsRes.data.bookings || [];

      // Calculate statistics
      const activeBuses = buses.filter(b => b.isActive).length;
      const totalSeats = buses.reduce((sum, b) => sum + b.totalSeats, 0);
      const bookedSeatsCount = buses.reduce((sum, b) => sum + (b.bookedSeats?.length || 0), 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
      const todayBookings = confirmedBookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime();
      });

      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      const todayRevenue = todayBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      // Get recent bookings (last 5)
      const recent = bookings.slice(0, 5);

      // Calculate top buses by bookings
      const busBookingCount = {};
      confirmedBookings.forEach(booking => {
        const busId = booking.busId?._id || booking.busId;
        if (busId) {
          busBookingCount[busId] = (busBookingCount[busId] || 0) + 1;
        }
      });

      const topBusesData = buses
        .map(bus => ({
          ...bus,
          bookingCount: busBookingCount[bus._id] || 0
        }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 5);

      setStats({
        totalBuses: buses.length,
        activeBuses,
        totalBookings: confirmedBookings.length,
        todayBookings: todayBookings.length,
        totalRevenue,
        todayRevenue,
        availableSeats: totalSeats - bookedSeatsCount,
        bookedSeats: bookedSeatsCount
      });

      setRecentBookings(recent);
      setTopBuses(topBusesData);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-lg text-white`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-black mt-2">{value}</h3>
          {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-white/90">{trend}</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Buses"
            value={stats.totalBuses}
            subtitle={`${stats.activeBuses} active`}
            icon="🚌"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            subtitle={`${stats.todayBookings} today`}
            icon="🎫"
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Total Revenue"
            value={`रू ${stats.totalRevenue.toLocaleString()}`}
            subtitle={`रू ${stats.todayRevenue.toLocaleString()} today`}
            icon="💰"
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Seat Occupancy"
            value={`${Math.round((stats.bookedSeats / (stats.bookedSeats + stats.availableSeats)) * 100) || 0}%`}
            subtitle={`${stats.bookedSeats} / ${stats.bookedSeats + stats.availableSeats} seats`}
            icon="💺"
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-blue-600 text-sm font-semibold hover:text-blue-700">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentBookings.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No bookings yet</p>
              ) : (
                recentBookings.map(booking => (
                  <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{booking.ticketId}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {booking.busId?.name || 'N/A'} • {booking.seats?.length || 0} seat(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-700 text-sm">रू {booking.totalPrice}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Buses */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Performing Buses</h2>
              <Link to="/admin/buses" className="text-blue-600 text-sm font-semibold hover:text-blue-700">
                Manage →
              </Link>
            </div>
            <div className="space-y-4">
              {topBuses.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No data available</p>
              ) : (
                topBuses.map((bus, index) => (
                  <div key={bus._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{bus.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {bus.route?.from} → {bus.route?.to}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-700 text-sm">{bus.bookingCount}</p>
                      <p className="text-xs text-gray-500">bookings</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/buses" className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <span className="text-3xl mb-2">🚌</span>
              <span className="text-sm font-semibold text-blue-900">Add Bus</span>
            </Link>
            <Link to="/admin/bookings" className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <span className="text-3xl mb-2">🎫</span>
              <span className="text-sm font-semibold text-green-900">View Bookings</span>
            </Link>
            <Link to="/admin/company" className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <span className="text-3xl mb-2">🏢</span>
              <span className="text-sm font-semibold text-purple-900">Company Info</span>
            </Link>
            <Link to="/admin/contact" className="flex flex-col items-center justify-center p-6 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
              <span className="text-3xl mb-2">📧</span>
              <span className="text-sm font-semibold text-orange-900">Messages</span>
            </Link>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">🔄 Auto-Refresh System Active</h3>
              <p className="text-blue-100 text-sm">
                Seats automatically refresh every 24 hours after travel date. Bookings available for next 7 days only.
              </p>
            </div>
            <div className="text-5xl opacity-20">⚙️</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
