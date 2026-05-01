import React, { useEffect, useState } from 'react';
import { LOGO_URL } from '../utils/constants';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingConfirmation = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bookings/${id}`)
      .then(res => setBooking(res.data.booking))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!booking) return <div className="text-center py-20 text-gray-500">Booking not found</div>;

  const bus = booking.busId;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500">Your ticket has been booked successfully</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow">
                  <img src={LOGO_URL} alt="Logo"
                       className="w-full h-full object-cover"
                       onError={e => { e.target.onerror=null; e.target.parentNode.innerHTML='<div class="w-full h-full bg-amber-400 rounded-lg flex items-center justify-center"><span class="text-white font-black text-xs">NK</span></div>'; }} />
                </div>
                <div>
                  <span className="font-bold text-base text-white block">न्यू कोशी सुपर यातायात</span>
                  <span className="text-blue-200 text-xs">प्रा. लि. · Dharan-8</span>
                </div>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {booking.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-xs mb-1">FROM</p>
                <p className="text-2xl font-black">{bus?.route?.from}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl">✈</div>
                <div className="w-16 h-0.5 bg-white/40 mx-auto mt-1"></div>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs mb-1">TO</p>
                <p className="text-2xl font-black">{bus?.route?.to}</p>
              </div>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="relative">
            <div className="absolute left-0 -top-4 w-8 h-8 bg-gray-50 rounded-full -ml-4"></div>
            <div className="absolute right-0 -top-4 w-8 h-8 bg-gray-50 rounded-full -mr-4"></div>
            <div className="border-t-2 border-dashed border-gray-200 mx-4"></div>
          </div>

          {/* Ticket Body */}
          <div className="p-6">
            {/* Ticket ID */}
            <div className="text-center mb-6">
              <p className="text-xs text-gray-400 mb-1">TICKET ID</p>
              <p className="text-xl font-black text-gray-900 tracking-wider">{booking.ticketId}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">BUS</p>
                <p className="font-bold text-gray-900 text-sm">{bus?.name}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">TRAVEL DATE</p>
                <p className="font-bold text-gray-900 text-sm">
                  {new Date(booking.travelDate).toLocaleDateString('en-US', {
                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">DEPARTURE</p>
                <p className="font-bold text-gray-900 text-sm">{bus?.departureTime}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">ARRIVAL</p>
                <p className="font-bold text-gray-900 text-sm">{bus?.arrivalTime}</p>
              </div>
            </div>

            {/* Seats */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-400 mb-2">SELECTED SEATS</p>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map(seat => (
                  <span key={seat} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {/* Passenger */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-400 mb-2">PASSENGER</p>
              <p className="font-bold text-gray-900">{booking.passengerDetails?.name}</p>
              <p className="text-gray-500 text-sm">{booking.passengerDetails?.email}</p>
              <p className="text-gray-500 text-sm">{booking.passengerDetails?.phone}</p>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center bg-blue-900 text-white rounded-xl p-4">
              <div>
                <p className="text-blue-200 text-xs">TOTAL AMOUNT</p>
                <p className="text-2xl font-black">रू {booking.totalPrice}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs">{booking.seats.length} seat(s)</p>
                <p className="text-sm">रू {bus?.price} × {booking.seats.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <Link
            to="/my-bookings"
            className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-bold text-center hover:bg-blue-800 transition-colors"
          >
            My Bookings
          </Link>
          <Link
            to="/buses"
            className="flex-1 bg-white text-blue-700 py-3 rounded-xl font-bold text-center border-2 border-blue-700 hover:bg-blue-50 transition-colors"
          >
            Book Another
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;



