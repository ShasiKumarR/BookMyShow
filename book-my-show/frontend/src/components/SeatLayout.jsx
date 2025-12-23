import { useEffect, useState } from 'react';
import { joinShow } from '../services/socket';
import './SeatLayout.css';

const SeatLayout = ({ showId, seats = [], selectedSeats = [], onSelect }) => {
  const [showSeats, setShowSeats] = useState(seats);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  // Update seats when they change
  useEffect(() => {
    setShowSeats(seats);
  }, [seats]);

  // Set up WebSocket connection
  useEffect(() => {
    if (!showId) return;

    const handleSeatUpdate = (updatedSeat) => {
      setShowSeats(prevSeats => 
        prevSeats.map(seat => 
          seat.seat_id === updatedSeat.seat_id ? updatedSeat : seat
        )
      );
    };

    const cleanup = joinShow(showId, handleSeatUpdate);

    return () => {
      cleanup();
    };
  }, [showId]);

  // Generate seat structure
  const generateSeatStructure = () => {
    const structure = [];

    rows.forEach(row => {
      const rowSeats = [];
      for (let i = 1; i <= 10; i++) {
        const seatId = `${row}${i}`;
        const seat = showSeats.find(s => s.seat_id === seatId) || {
          seat_id: seatId,
          status: 'AVAILABLE'
        };
        rowSeats.push(seat);
      }
      structure.push({ row, seats: rowSeats });
    });

    return structure;
  };

  const seatStructure = generateSeatStructure();

  const handleSeatClick = (seatId, status) => {
    if (status === 'AVAILABLE' || status === 'HELD') {
      onSelect(seatId);
    }
  };

  return (
    <div className="seat-layout">
      <div className="screen">🎬 SCREEN THIS WAY 🎬</div>
      <div className="show-info">
        <h2>Show: {showId}</h2>
        <div className="status-indicator">
          <span className="status-dot online"></span>
          <span>Live Updates</span>
        </div>
      </div>
      
      <div className="seat-sections">
        {seatStructure.map(({ row, seats }) => (
          <div key={row} className="seat-section">
            <div className="row-label">Row {row}</div>
            <div className="seats-row">
              {seats.map((seat) => (
                <div
                  key={seat.seat_id}
                  className={`seat ${seat.status.toLowerCase()} ${
                    selectedSeats.includes(seat.seat_id) ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatClick(seat.seat_id, seat.status)}
                  title={`${seat.seat_id} - ${seat.status}`}
                >
                  {seat.seat_id}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color held"></div>
          <span>Held</span>
        </div>
        <div className="legend-item">
          <div className="legend-color booked"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;