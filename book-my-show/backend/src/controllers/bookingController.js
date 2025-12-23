const service = require("../services/bookingService");

exports.holdSeat = async (req, res) => {
  try {
    const { showId, seatId, userName } = req.body;
    const bookingId = await service.holdSeat(showId, seatId, userName);
    res.json({ status: "HELD", bookingId });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
