import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-md border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ buses: 0, bookings: 0, revenue: 0, users: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busesRes, bookingsRes] = await Promise.all([
          api.get('/buses/admin/all'),
          api.get('/bookings')
        ]);

        const buses = busesRes.data.buses;
        const bookings = bookingsRes.data.bookings;
        const revenue = bookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + b.totalPrice, 0);

        setStats({
          buses: buses.length,
          bookings: bookings.length,
          revenue,
          confirmed: bookings.filter(b => b.status === 'confirmed').length
        });
        setRecentBookings(bookings.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to New Koshi A/C Yatayat Admin Panel</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Buses" value={stats.buses} icon="🚌" color="border-blue-500" />
          <StatCard title="Total Bookings" value={stats.bookings} icon="🎫" color="border-green-500" />
          <StatCard title="Confirmed" value={stats.confirmed || 0} icon="✅" color="border-yellow-500" />
          <StatCard title="Revenue (৳)" value={`৳${(stats.revenue || 0).toLocaleString()}`} icon="💰" color="border-purple-500" />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No bookings yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Ticket ID</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Passenger</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Route</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Seats</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(booking => (
                    <tr key={booking._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-xs text-gray-600">{booking.ticketId}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{booking.userId?.name}</p>
                        <p className="text-gray-400 text-xs">{booking.userId?.email}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {booking.busId?.route?.from} → {booking.busId?.route?.to}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{booking.seats?.join(', ')}</td>
                      <td className="py-3 px-4 font-bold text-blue-700">৳{booking.totalPrice}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
