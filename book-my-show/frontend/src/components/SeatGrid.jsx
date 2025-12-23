import SeatCard from "./SeatCard";

export default function SeatGrid({ seats, selectedSeat, onSelect }) {
  return (
    <div className="seat-grid">
      {seats.map((seat) => (
        <SeatCard
          key={seat.seat_id}
          seat={seat}
          isSelected={selectedSeat === seat.seat_id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
