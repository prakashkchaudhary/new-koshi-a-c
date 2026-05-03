import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    api.get('/bookings/my-bookings')
      .then(res => setBookings(res.data.bookings))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black mb-1">My Bookings</h1>
          <p className="text-blue-200">Your travel history and upcoming trips</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">Start your journey by booking a ticket</p>
            <Link to="/buses" className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
              Browse Buses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => {
              const bus = booking.busId;
              const isPast = new Date(booking.travelDate) < new Date();
              return (
                <div key={booking._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                  <div className="flex flex-col md:flex-row">
                    {/* Status bar */}
                    <div className={`md:w-2 ${
                      booking.status === 'confirmed' ? 'bg-green-500' :
                      booking.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>

                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Bus & Route Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="font-bold text-gray-900 text-lg">{bus?.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="font-medium">{bus?.route?.from}</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <span className="font-medium">{bus?.route?.to}</span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>📅 {new Date(booking.travelDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            <span>🕐 {bus?.departureTime}</span>
                            <span className="flex items-center gap-1">
                              {bus?.isSleeper ? '🛏️' : '💺'} Seats: 
                              {booking.seats.map((seat, idx) => {
                                const isLower = seat.endsWith('L');
                                const isUpper = seat.endsWith('U');
                                const isSleeper = isLower || isUpper;
                                return (
                                  <span key={seat} className="inline-flex items-center">
                                    {idx > 0 && ', '}
                                    {isSleeper && <span className="text-xs mx-0.5">{isLower ? '▼' : '▲'}</span>}
                                    <span className="font-medium">{seat}</span>
                                  </span>
                                );
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex flex-col items-end space-y-3">
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Ticket ID</p>
                            <p className="font-mono font-bold text-gray-700 text-sm">{booking.ticketId}</p>
                          </div>
                          <p className="text-2xl font-black text-blue-700">रू {booking.totalPrice}</p>
                          <div className="flex space-x-2">
                            <Link
                              to={`/booking-confirmation/${booking._id}`}
                              className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
                            >
                              View Ticket
                            </Link>
                            {booking.status === 'confirmed' && !isPast && (
                              <button
                                onClick={() => handleCancel(booking._id)}
                                className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
