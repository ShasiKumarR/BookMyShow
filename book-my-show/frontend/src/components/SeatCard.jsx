export default function SeatCard({ seat, isSelected, onSelect }) {
  return (
    <div
      className={`seat 
        ${seat.status.toLowerCase()} 
        ${isSelected ? "selected" : ""}
      `}
      onClick={() =>
        seat.status === "AVAILABLE" && onSelect(seat.seat_id)
      }
    >
      {seat.seat_id}
    </div>
  );
}
