import React from 'react';

// ── Helpers ───────────────────────────────────────────────
const rowLabels = 'ABCDEFGHIJKLMNOP'.split('');

const generateSeats = (totalSeats, isSleeper) => {
  // Sleeper: each "row" has 4 berths — L (lower) and U (upper) per side
  // e.g. A1L, A1U, A2L, A2U  (left side) | A3L, A3U, A4L, A4U (right side)
  // Regular: A1, A2 | A3, A4
  const seatsPerRow = 4;
  const numRows = Math.ceil(totalSeats / seatsPerRow);
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    const label = rowLabels[i] || String.fromCharCode(65 + i);
    if (isSleeper) {
      rows.push({
        label,
        left:  [{ id: `${label}1L`, berth: 'L' }, { id: `${label}1U`, berth: 'U' }],
        right: [{ id: `${label}2L`, berth: 'L' }, { id: `${label}2U`, berth: 'U' }],
      });
    } else {
      rows.push({
        label,
        left:  [{ id: `${label}1` }, { id: `${label}2` }],
        right: [{ id: `${label}3` }, { id: `${label}4` }],
      });
    }
  }
  return rows;
};

// ── Seat Button ───────────────────────────────────────────
const SeatBtn = ({ seatId, status, berth, isSleeper, onClick }) => {
  const base = 'transition-all duration-150 flex flex-col items-center justify-center font-bold select-none';

  const colorClass =
    status === 'booked'   ? 'bg-red-50 border-red-300 text-red-400 cursor-not-allowed opacity-70' :
    status === 'selected' ? 'bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-200 scale-105' :
                            'bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100 hover:scale-105 cursor-pointer';

  if (isSleeper) {
    // Sleeper berth — wider, shows L/U label
    return (
      <button
        onClick={() => status !== 'booked' && onClick(seatId)}
        disabled={status === 'booked'}
        title={`${seatId} — ${berth === 'L' ? 'Lower' : 'Upper'} berth — ${status}`}
        className={`${base} ${colorClass} w-14 h-10 rounded-lg border-2 text-xs`}
      >
        <span className="text-[10px] leading-none opacity-70">{berth === 'L' ? '▼ Lower' : '▲ Upper'}</span>
        <span className="text-xs leading-none mt-0.5">{seatId}</span>
      </button>
    );
  }

  // Regular seat — chair shape (rounded top)
  return (
    <button
      onClick={() => status !== 'booked' && onClick(seatId)}
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
          <div className="flex-1 flex justify-end gap-1 mr-3">
            {isSleeper ? (
              <><span className="w-14 text-center">Left</span></>
            ) : (
              <><span className="w-10 text-center">Win</span><span className="w-10 text-center">Aisle</span></>
            )}
          </div>
          <div className="w-6 text-center text-gray-200 text-base">|</div>
          <div className="flex-1 flex justify-start gap-1 ml-3">
            {isSleeper ? (
              <><span className="w-14 text-center">Right</span></>
            ) : (
              <><span className="w-10 text-center">Aisle</span><span className="w-10 text-center">Win</span></>
            )}
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map(({ label, left, right }) => (
            <div key={label} className="flex items-center">
              {/* Row label */}
              <div className="w-8 text-center text-xs font-bold text-gray-500">{label}</div>

              {/* Left seats */}
              <div className="flex-1 flex justify-end gap-1 mr-3">
                {isSleeper ? (
                  <div className="flex flex-col gap-1">
                    {left.map(({ id, berth }) => (
                      <SeatBtn key={id} seatId={id} berth={berth}
                        status={getStatus(id)} isSleeper onClick={onSeatClick} />
                    ))}
                  </div>
                ) : (
                  left.map(({ id }) => (
                    <SeatBtn key={id} seatId={id}
                      status={getStatus(id)} isSleeper={false} onClick={onSeatClick} />
                  ))
                )}
              </div>

              {/* Aisle */}
              <div className="w-6 flex items-center justify-center">
                <div className={`w-0.5 bg-gray-300 rounded ${isSleeper ? 'h-20' : 'h-10'}`} />
              </div>

              {/* Right seats */}
              <div className="flex-1 flex justify-start gap-1 ml-3">
                {isSleeper ? (
                  <div className="flex flex-col gap-1">
                    {right.map(({ id, berth }) => (
                      <SeatBtn key={id} seatId={id} berth={berth}
                        status={getStatus(id)} isSleeper onClick={onSeatClick} />
                    ))}
                  </div>
                ) : (
                  right.map(({ id }) => (
                    <SeatBtn key={id} seatId={id}
                      status={getStatus(id)} isSleeper={false} onClick={onSeatClick} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-5 mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className={`border-2 border-emerald-400 bg-emerald-50 ${isSleeper ? 'w-10 h-7 rounded-lg' : 'w-8 h-8 rounded-t-xl'}`} />
          <span className="text-xs text-gray-600 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`border-2 border-blue-600 bg-blue-600 ${isSleeper ? 'w-10 h-7 rounded-lg' : 'w-8 h-8 rounded-t-xl'}`} />
          <span className="text-xs text-gray-600 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`border-2 border-red-300 bg-red-50 opacity-70 ${isSleeper ? 'w-10 h-7 rounded-lg' : 'w-8 h-8 rounded-t-xl'}`} />
          <span className="text-xs text-gray-600 font-medium">Booked</span>
        </div>
        {isSleeper && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">▼ Lower</span>
              <span className="text-xs text-gray-600">Lower berth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">▲ Upper</span>
              <span className="text-xs text-gray-600">Upper berth</span>
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
