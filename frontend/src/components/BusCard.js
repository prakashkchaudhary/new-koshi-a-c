import React from 'react';
import { Link } from 'react-router-dom';

const BusCard = ({ bus }) => {
  const available = bus.totalSeats - bus.bookedSeats.length;
  const pct = Math.round((bus.bookedSeats.length / bus.totalSeats) * 100);
  const isFull = available === 0;
  const isAlmostFull = pct >= 70 && !isFull;

  const API_BASE = (process.env.REACT_APP_API_URL || '').replace('/api', '');

  return (
    <div className="bg-white rounded-2xl shadow-card card-hover overflow-hidden border border-gray-100 flex flex-col">

      {/* ── Image / Banner ── */}
      <div className="relative h-44 bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800 overflow-hidden">
        {bus.image ? (
          <img
            src={
              bus.image.startsWith('http')
                ? bus.image
                : bus.image.startsWith('/images/')
                  ? bus.image
                  : `${API_BASE}${bus.image}`
            }
            alt={bus.name}
            className="w-full h-full object-cover object-center"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : null}
        {/* Fallback emoji — shown when no image or image fails */}
        <div className={`w-full h-full flex flex-col items-center justify-center absolute inset-0 ${bus.image ? 'opacity-0' : 'opacity-100'}`}
             id={`fallback-${bus._id}`}>
          <span className="text-6xl mb-2 animate-float">🚌</span>
          <span className="text-blue-200 text-xs font-medium tracking-wide uppercase">{bus.busType}</span>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Bus type badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-amber-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow">
            {bus.busType}
          </span>
        </div>

        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          {isFull ? (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">FULL</span>
          ) : isAlmostFull ? (
            <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {available} left
            </span>
          ) : (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {available} seats
            </span>
          )}
        </div>

        {/* Bus name on image */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold text-sm truncate drop-shadow">{bus.name}</p>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-5 flex flex-col flex-1">

        {/* Route */}
        <div className="flex items-center justify-between bg-blue-50 rounded-xl p-3.5 mb-4">
          <div className="text-center min-w-0">
            <p className="text-xs text-gray-400 font-medium mb-0.5">FROM</p>
            <p className="font-black text-blue-900 text-sm truncate">{bus.route.from}</p>
            <p className="text-xs text-gray-500 mt-0.5">{bus.departureTime}</p>
          </div>

          <div className="flex flex-col items-center px-2 flex-shrink-0">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <div className="w-8 h-px bg-blue-300" />
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-gray-400 mt-1">Direct</span>
          </div>

          <div className="text-center min-w-0">
            <p className="text-xs text-gray-400 font-medium mb-0.5">TO</p>
            <p className="font-black text-blue-900 text-sm truncate">{bus.route.to}</p>
            <p className="text-xs text-gray-500 mt-0.5">{bus.arrivalTime}</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bus.amenities.slice(0, 4).map((a, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {a}
            </span>
          ))}
          {bus.amenities.length > 4 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
              +{bus.amenities.length - 4}
            </span>
          )}
        </div>

        {/* Seat bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-medium">{available} of {bus.totalSeats} seats available</span>
            <span>{pct}% booked</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all ${
              pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-orange-400' : 'bg-emerald-500'
            }`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400 font-medium">Price per seat</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-blue-700">Rs. {bus.price.toLocaleString()}</span>
            </div>
          </div>
          <Link to={`/book/${bus._id}`}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              isFull
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5'
            }`}>
            {isFull ? 'Sold Out' : 'Book Now →'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
