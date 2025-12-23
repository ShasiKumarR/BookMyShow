const db = require('../config/db');

class Show {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM shows');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM shows WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(showData) {
    const { name, start_time, end_time, total_seats } = showData;
    const [result] = await db.query(
      'INSERT INTO shows (name, start_time, end_time, total_seats) VALUES (?, ?, ?, ?)',
      [name, start_time, end_time, total_seats]
    );
    return result.insertId;
  }
}

module.exports = Show;