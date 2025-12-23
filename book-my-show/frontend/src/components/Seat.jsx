export default function Seat({ seat, isSelected, onSelect }) {
  const disabled = seat.status !== "AVAILABLE";

  return (
    <div
      className={`seat 
        ${seat.status.toLowerCase()} 
        ${isSelected ? "selected" : ""}
      `}
      onClick={() => !disabled && onSelect(seat.seat_id)}
    >
      {seat.number}
    </div>
  );
}
