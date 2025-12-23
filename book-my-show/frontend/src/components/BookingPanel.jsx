import { holdSeat } from "../services/api";

export default function BookingPanel({ showId, selectedSeat }) {
  const handleHold = async () => {
    if (!selectedSeat) {
      alert("Please select a seat");
      return;
    }

    await holdSeat({
      showId,
      seatId: selectedSeat,
      userName: "Shivani",
    });

    alert(`Seat ${selectedSeat} held successfully`);
  };

  return (
    <div className="booking-panel">
      <h3>Booking Panel</h3>

      <p>
        Selected Seat:
        <span className="seat-badge">
          {selectedSeat || "None"}
        </span>
      </p>

      <button onClick={handleHold} disabled={!selectedSeat}>
        Hold Seat
      </button>
    </div>
  );
}
