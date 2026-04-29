import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchBookings = () => {
    api.get('/bookings')
      .then(res => setBookings(res.data.bookings))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">All Bookings</h1>
          <p className="text-gray-500 mt-1">{bookings.length} total bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          {['all', 'confirmed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors capitalize ${
                filter === f ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f} ({f === 'all' ? bookings.length : bookings.filter(b => b.status === f).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading bookings...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Ticket ID</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Passenger</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Bus & Route</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Travel Date</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Seats</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Amount</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(booking => (
                    <tr key={booking._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 px-6 font-mono text-xs text-gray-600">{booking.ticketId}</td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900">{booking.userId?.name}</p>
                        <p className="text-gray-400 text-xs">{booking.userId?.phone}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900">{booking.busId?.name}</p>
                        <p className="text-gray-400 text-xs">{booking.busId?.route?.from} → {booking.busId?.route?.to}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(booking.travelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-gray-600">{booking.seats?.join(', ')}</td>
                      <td className="py-4 px-6 font-bold text-blue-700">৳{booking.totalPrice}</td>
                      <td className="py-4 px-6">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="text-red-600 text-xs bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400">No bookings found</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookings;
