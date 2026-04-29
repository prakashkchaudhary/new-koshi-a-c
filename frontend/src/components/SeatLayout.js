import React from 'react';

const SeatLayout = ({ totalSeats, bookedSeats, selectedSeats, onSeatClick }) => {
  // Generate seat IDs: rows A-J (10 rows), 4 seats per row = 40 seats
  const rows = [];
  const rowLabels = 'ABCDEFGHIJ'.split('');
  const seatsPerRow = 4;
  const numRows = Math.ceil(totalSeats / seatsPerRow);

  for (let i = 0; i < numRows; i++) {
    const rowLabel = rowLabels[i] || String.fromCharCode(65 + i);
    const rowSeats = [];
    for (let j = 1; j <= seatsPerRow; j++) {
      const seatId = `${rowLabel}${j}`;
      rowSeats.push(seatId);
    }
    rows.push({ label: rowLabel, seats: rowSeats });
  }

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const getSeatClass = (status) => {
    switch (status) {
      case 'booked': return 'seat seat-booked';
      case 'selected': return 'seat seat-selected';
      default: return 'seat seat-available';
    }
  };

  const handleSeatClick = (seatId) => {
    const status = getSeatStatus(seatId);
    if (status === 'booked') return;
    onSeatClick(seatId);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      {/* Bus front indicator */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 text-white text-xs px-6 py-2 rounded-t-3xl font-medium flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span>DRIVER</span>
        </div>
      </div>

      {/* Bus body */}
      <div className="border-2 border-gray-300 rounded-2xl p-4 bg-gray-50">
        {/* Column headers */}
        <div className="flex items-center mb-3">
          <div className="w-8"></div>
          <div className="flex-1 grid grid-cols-2 gap-1 mr-4">
            <div className="text-center text-xs text-gray-400 font-medium">Window</div>
            <div className="text-center text-xs text-gray-400 font-medium">Aisle</div>
          </div>
          <div className="w-8 text-center text-xs text-gray-300">|</div>
          <div className="flex-1 grid grid-cols-2 gap-1 ml-4">
            <div className="text-center text-xs text-gray-400 font-medium">Aisle</div>
            <div className="text-center text-xs text-gray-400 font-medium">Window</div>
          </div>
        </div>

        {/* Seat rows */}
        <div className="space-y-2">
          {rows.map(({ label, seats }) => (
            <div key={label} className="flex items-center">
              {/* Row label */}
              <div className="w-8 text-center text-xs font-bold text-gray-500">{label}</div>

              {/* Left side seats (1, 2) */}
              <div className="flex-1 flex justify-end space-x-1 mr-4">
                {seats.slice(0, 2).map(seatId => {
                  const status = getSeatStatus(seatId);
                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={status === 'booked'}
                      className={getSeatClass(status)}
                      title={`Seat ${seatId} - ${status}`}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>

              {/* Aisle */}
              <div className="w-8 flex items-center justify-center">
                <div className="w-0.5 h-8 bg-gray-300 rounded"></div>
              </div>

              {/* Right side seats (3, 4) */}
              <div className="flex-1 flex justify-start space-x-1 ml-4">
                {seats.slice(2, 4).map(seatId => {
                  const status = getSeatStatus(seatId);
                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={status === 'booked'}
                      className={getSeatClass(status)}
                      title={`Seat ${seatId} - ${status}`}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-t-xl bg-green-100 border-2 border-green-400"></div>
          <span className="text-xs text-gray-600 font-medium">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-t-xl bg-blue-500 border-2 border-blue-600"></div>
          <span className="text-xs text-gray-600 font-medium">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-t-xl bg-red-100 border-2 border-red-400 opacity-70"></div>
          <span className="text-xs text-gray-600 font-medium">Booked</span>
        </div>
      </div>

      {/* Selected seats summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm font-medium text-blue-800">
            Selected: {selectedSeats.join(', ')}
          </p>
          <p className="text-xs text-blue-600 mt-1">{selectedSeats.length} seat(s) selected</p>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;
