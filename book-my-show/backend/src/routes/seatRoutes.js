// backend/src/routes/seatRoutes.js
const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// Get all shows
router.get('/shows', async (req, res) => {
  try {
    const [shows] = await req.db.query('SELECT * FROM shows');
    res.json(shows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ message: 'Failed to load shows' });
  }
});

// Get all seats for a show
router.get('/shows/:showId/seats', seatController.getSeats);

// Hold a seat
router.post('/shows/:showId/seats/:seatId/hold', seatController.holdSeat);

// Book a seat
router.post('/shows/:showId/seats/:seatId/book', seatController.bookSeat);

module.exports = router;