const db = require("../config/db");
const { v4: uuid } = require("uuid");

exports.holdSeat = async (showId, seatId, userName) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT status FROM seats WHERE show_id=? AND seat_id=? FOR UPDATE",
      [showId, seatId]
    );

    if (rows.length === 0 || rows[0].status !== "AVAILABLE") {
      throw new Error("Seat not available");
    }

    await conn.query(
      `UPDATE seats
       SET status='HELD', hold_expires_at=NOW() + INTERVAL 5 MINUTE
       WHERE show_id=? AND seat_id=?`,
      [showId, seatId]
    );

    await conn.query(
      `INSERT INTO bookings VALUES (?,?,?,?,?,NOW())`,
      [uuid(), showId, seatId, userName, "HELD"]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
