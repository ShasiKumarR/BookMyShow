// backend/src/controllers/seatController.js
// Get all seats for a show
exports.getSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const [seats] = await req.db.query(
      'SELECT * FROM seats WHERE show_id = ?',
      [showId]
    );
    res.json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ message: 'Error fetching seats' });
  }
};

// Hold a seat
exports.holdSeat = async (req, res) => {
  const { showId, seatId } = req.params;
  const { userId } = req.body;
  const io = req.app.get('io');
  
  try {
    const [seats] = await req.db.query(
      'SELECT * FROM seats WHERE show_id = ? AND seat_id = ?',
      [showId, seatId]
    );
    
    if (seats.length === 0) {
      return res.status(404).json({ message: 'Seat not found' });
    }
    
    const seat = seats[0];
    
    if (seat.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'Seat is not available' });
    }
    
    await req.db.query(
      'UPDATE seats SET status = "HELD", user_id = ?, held_until = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE show_id = ? AND seat_id = ?',
      [userId, showId, seatId]
    );
    
    const [updatedSeat] = await req.db.query(
      'SELECT * FROM seats WHERE show_id = ? AND seat_id = ?',
      [showId, seatId]
    );
    
    io.to(`show_${showId}`).emit('seat_updated', updatedSeat[0]);
    res.json(updatedSeat[0]);
  } catch (error) {
    console.error('Error holding seat:', error);
    res.status(500).json({ message: 'Error holding seat' });
  }
};

// Book a seat
exports.bookSeat = async (req, res) => {
  const { showId, seatId } = req.params;
  const { userId } = req.body;
  const io = req.app.get('io');
  
  try {
    const [seats] = await req.db.query(
      'SELECT * FROM seats WHERE show_id = ? AND seat_id = ? AND user_id = ? AND status = "HELD"',
      [showId, seatId, userId]
    );
    
    if (seats.length === 0) {
      return res.status(400).json({ message: 'Seat is not held by user or already booked' });
    }
    
    await req.db.query(
      'UPDATE seats SET status = "BOOKED", held_until = NULL WHERE show_id = ? AND seat_id = ?',
      [showId, seatId]
    );
    
    const [updatedSeat] = await req.db.query(
      'SELECT * FROM seats WHERE show_id = ? AND seat_id = ?',
      [showId, seatId]
    );
    
    io.to(`show_${showId}`).emit('seat_updated', updatedSeat[0]);
    res.json(updatedSeat[0]);
  } catch (error) {
    console.error('Error booking seat:', error);
    res.status(500).json({ message: 'Error booking seat' });
  }
};