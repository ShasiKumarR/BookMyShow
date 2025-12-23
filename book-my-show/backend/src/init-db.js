const db = require('./config/db');

async function initializeDatabase() {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Clear existing seats
    await connection.query('DELETE FROM seats');

    // Generate seats A1-H10
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seats = [];
    
    for (const row of rows) {
      for (let i = 1; i <= 10; i++) {
        seats.push([`${row}${i}`, 'show-1', 'AVAILABLE', null, null]);
      }
    }

    // Insert all seats
    await connection.query(
      'INSERT INTO seats (seat_id, show_id, status, user_id, held_until) VALUES ?',
      [seats]
    );

    await connection.commit();
    console.log('Successfully initialized database with all seats');
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error initializing database:', error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

initializeDatabase();
