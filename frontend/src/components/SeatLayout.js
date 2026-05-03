import React from 'react';

// ── Helpers ───────────────────────────────────────────────
const generateSeats = (totalSeats, isSleeper) => {
  // Custom layout: 1 + 1 | 2 configuration
  // Left side: single seat, Middle: single seat, Right side: 2 seats
  // Last 2 rows are sleeper berths if enabled
  
  const rows = [];
  
  // Special first row
  rows.push({
    label: '',
    left: [{ id: 'C1' }],
    middle: [],
    right: [{ id: 'J1' }, { id: 'J2' }],
    isSpecial: true
  });
  
  // Second row
  rows.push({
    label: '',
    left: [{ id: 'A' }],
    middle: [{ id: 'B' }],
    right: [{ id: 'KA' }, { id: 'Kha' }],
  });
  
  // Third row
  rows.push({
    label: '',
    left: [{ id: 'C' }],
    middle: [{ id: 'D' }],
    right: [{ id: 'GA' }, { id: 'GHA' }],
  });
  
  // Regular numbered rows (A1-A14 on left, B1-B14 on right)
  const regularRowCount = isSleeper ? 10 : 12; // 10 regular + 2 sleeper OR 12 regular
  
  for (let i = 1; i <= regularRowCount; i++) {
    rows.push({
      label: '',
      left: [{ id: `A${i}` }],
      middle: [{ id: `A${i + 1}` }],
      right: [{ id: `B${i}` }, { id: `B${i + 1}` }],
    });
    i++; // Skip next number since we use it in middle
  }
  
  // Add sleeper berth rows at the end if enabled
  if (isSleeper) {
    rows.push({
      label: '',
      left: [{ id: 'A13L', berth: 'L', label: 'berth' }],
      middle: [{ id: 'A14L', berth: 'L', label: 'berth' }],
      right: [{ id: 'B13L', berth: 'L', label: 'berth' }, { id: 'B14L', berth: 'L', label: 'berth' }],
      isSleeper: true
    });
    
    rows.push({
      label: '',
      left: [{ id: 'A13U', berth: 'U', label: 'seep' }],
      middle: [{ id: 'A14U', berth: 'U', label: 'seep' }],
      right: [{ id: 'B13U', berth: 'U', label: 'seep' }, { id: 'B14U', berth: 'U', label: 'seep' }],
      isSleeper: true
    });
  }

  return rows;
};

// ── Seat Button ───────────────────────────────────────────
const SeatBtn = ({ seatId, status, berth, isSleeper, onClick }) => {
  const base = 'transition-all duration-150 flex items-center justify-center font-bold select-none';

  const colorClass =
    status === 'booked'   ? 'bg-red-50 border-red-300 text-red-400 cursor-not-allowed opacity-70' :
    status === 'selected' ? 'bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-200 scale-105' :
                            'bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100 hover:scale-105 cursor-pointer';

  if (isSleeper) {
    // Sleeper berth — shows "berth" or "seep" label
    return (
      <button
        onClick={() => status !== 'booked' && onClick()}
        disabled={status === 'booked'}
        title={`${seatId} — ${berth === 'L' ? 'Lower berth' : 'Upper berth (seep)'} — ${status}`}
        className={`${base} ${colorClass} w-10 h-10 rounded-lg border-2 text-[9px]`}
      >
        {seatId}
      </button>
    );
  }

  // Regular seat — chair shape (rounded top)
  return (
    <button
      onClick={() => status !== 'booked' && onClick()}
      disabled={status === 'booked'}
      title={`Seat ${seatId} — ${status}`}
      className={`${base} ${colorClass} w-10 h-10 rounded-t-xl border-2 text-xs`}
    >
      {seatId}
    </button>
  );
};

// ── Main SeatLayout Component ─────────────────────────────
const SeatLayout = ({ totalSeats, bookedSeats, selectedSeats, onSeatClick, isSleeper = false }) => {
  const rows = generateSeats(totalSeats, isSleeper);

  const getStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md">

      {/* Bus front */}
      <div className="flex justify-center mb-5">
        <div className="bg-gray-800 text-white text-xs px-8 py-2 rounded-t-3xl font-medium flex items-center gap-2">
          <span>🚌</span>
          <span>DRIVER / FRONT</span>
        </div>
      </div>

      {/* Bus body */}
      <div className="border-2 border-gray-300 rounded-2xl p-4 bg-gray-50">

        {/* Column headers */}
        <div className="flex items-center mb-3 text-xs text-gray-400 font-medium">
          <div className="w-8" />
          <div className="flex-1 flex justify-end gap-1 mr-2">
            <span className="w-10 text-center">Left</span>
            <span className="w-10 text-center">Mid</span>
          </div>
          <div className="w-6 text-center text-gray-200 text-base">|</div>
          <div className="flex-1 flex justify-start gap-1 ml-2">
            <span className="w-10 text-center">Right</span>
            <span className="w-10 text-center"></span>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map((row, idx) => {
            const { label, left, middle, right, isSleeper: isSleeperRow } = row;
            return (
              <div key={idx} className="flex items-center">
                {/* Row label */}
                <div className="w-8 text-center text-xs font-bold text-gray-500">{label}</div>

                {/* Left + Middle seats */}
                <div className="flex-1 flex justify-end gap-1 mr-2">
                  {left.map(({ id, berth, label: seatLabel }) => (
                    <SeatBtn key={id} seatId={seatLabel || id} berth={berth}
                      status={getStatus(id)} isSleeper={isSleeperRow} onClick={() => onSeatClick(id)} />
                  ))}
                  {middle && middle.map(({ id, berth, label: seatLabel }) => (
                    <SeatBtn key={id} seatId={seatLabel || id} berth={berth}
                      status={getStatus(id)} isSleeper={isSleeperRow} onClick={() => onSeatClick(id)} />
                  ))}
                </div>

                {/* Aisle */}
                <div className="w-6 flex items-center justify-center">
                  <div className={`w-0.5 bg-gray-300 rounded ${isSleeperRow ? 'h-10' : 'h-10'}`} />
                </div>

                {/* Right seats */}
                <div className="flex-1 flex justify-start gap-1 ml-2">
                  {right.map(({ id, berth, label: seatLabel }) => (
                    <SeatBtn key={id} seatId={seatLabel || id} berth={berth}
                      status={getStatus(id)} isSleeper={isSleeperRow} onClick={() => onSeatClick(id)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-5 mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className={`border-2 border-emerald-400 bg-emerald-50 ${isSleeper ? 'w-12 h-7 rounded-lg' : 'w-8 h-8 rounded-t-xl'}`} />
          <span className="text-xs text-gray-600 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`border-2 border-blue-600 bg-blue-600 ${isSleeper ? 'w-12 h-7 rounded-lg' : 'w-8 h-8 rounded-t-xl'}`} />
          <span className="text-xs text-gray-600 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`border-2 border-red-300 bg-red-50 opacity-70 ${isSleeper ? 'w-12 h-7 rounded-lg' : 'w-8 h-8 rounded-t-xl'}`} />
          <span className="text-xs text-gray-600 font-medium">Booked</span>
        </div>
        {isSleeper && (
          <>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-50 border border-amber-200 px-2 py-1 rounded font-medium text-amber-700">▼ Lower Berth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-50 border border-amber-200 px-2 py-1 rounded font-medium text-amber-700">▲ Upper Berth</span>
            </div>
          </>
        )}
      </div>

      {/* Selected summary */}
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
