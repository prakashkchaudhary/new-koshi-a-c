import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import SeatLayout from '../components/SeatLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const BookTicket = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [travelDate, setTravelDate] = useState('');
  const [booking, setBooking] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.get(`/buses/${busId}`)
      .then(res => setBus(res.data.bus))
      .catch(() => {
        toast.error('Bus not found');
        navigate('/buses');
      })
      .finally(() => setLoading(false));
  }, [busId, navigate]);

  const handleSeatClick = (seatId) => {
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (!travelDate) {
      toast.error('Please select a travel date');
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setBooking(true);
    try {
      const res = await api.post('/bookings/book-ticket', {
        busId,
        seats: selectedSeats,
        travelDate
      });
      toast.success('Ticket booked successfully!');
      navigate(`/booking-confirmation/${res.data.booking._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!bus) return null;

  const totalPrice = selectedSeats.length * bus.price;
  const availableSeats = bus.totalSeats - bus.bookedSeats.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black mb-1">Book Your Ticket</h1>
          <p className="text-blue-200">{bus.name} · {bus.route.from} → {bus.route.to}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Seat Layout */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Travel Date</h2>
              <input
                type="date"
                min={today}
                value={travelDate}
                onChange={e => setTravelDate(e.target.value)}
                className="w-full md:w-64 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Seats</h2>
              <p className="text-sm text-gray-500 mb-4">
                {availableSeats} seats available · Click to select/deselect
              </p>
              <SeatLayout
                totalSeats={bus.totalSeats}
                bookedSeats={bus.bookedSeats}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
              />
            </div>
          </div>

          {/* Right: Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>

              {/* Bus Info */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-3">{bus.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Route</span>
                    <span className="font-medium text-gray-700">{bus.route.from} → {bus.route.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Departure</span>
                    <span className="font-medium text-gray-700">{bus.departureTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Arrival</span>
                    <span className="font-medium text-gray-700">{bus.arrivalTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium text-gray-700">{bus.busType}</span>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Passenger</h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500">{user?.email}</p>
                  <p className="text-gray-500">{user?.phone}</p>
                </div>
              </div>

              {/* Selected Seats */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Travel Date</span>
                  <span className="font-medium text-gray-700">{travelDate || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Selected Seats</span>
                  <span className="font-medium text-gray-700">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Price per seat</span>
                  <span className="font-medium text-gray-700">रू {bus.price}</span>
                </div>
              </div>

              <hr className="mb-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-black text-2xl text-blue-700">रू {totalPrice}</span>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={booking || selectedSeats.length === 0 || !travelDate}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  booking || selectedSeats.length === 0 || !travelDate
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-700 text-white hover:bg-blue-800 hover:shadow-lg'
                }`}
              >
                {booking ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="spinner w-5 h-5 border-2 border-white border-t-transparent"></div>
                    <span>Booking...</span>
                  </span>
                ) : (
                  `Confirm Booking${selectedSeats.length > 0 ? ` (${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})` : ''}`
                )}
              </button>

              {selectedSeats.length === 0 && (
                <p className="text-center text-xs text-gray-400 mt-3">Select at least one seat to continue</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;
