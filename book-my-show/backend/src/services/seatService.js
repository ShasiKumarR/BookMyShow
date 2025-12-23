const db = require("../config/db");

exports.getSeatsByShow = async (showId) => {
  const [rows] = await db.query(
    "SELECT seat_id, status FROM seats WHERE show_id = ?",
    [showId]
  );
  return rows;
};
