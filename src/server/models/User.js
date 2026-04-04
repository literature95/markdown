import bcrypt from 'bcrypt';
import { getDatabase, saveDatabase } from '../config/database.js';

class User {
  static async create(username, password, email) {
    const db = getDatabase();
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        db.run(
          'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
          [username, hashedPassword, email || null]
        );

        saveDatabase();

      const result = db.exec('SELECT last_insert_rowid() as id');
      const id = result[0]?.values[0]?.[0];

      return { id, username, email };
    } catch (err) {
      throw err;
    }
  }

  static async findByUsername(username) {
    const db = getDatabase();
    const result = db.exec('SELECT * FROM users WHERE username = ?', [username]);

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const columns = result[0].columns;
    const values = result[0].values[0];
    const row = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });

    return row;
  }

  static async findById(id) {
    const db = getDatabase();
    const result = db.exec(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [id]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const columns = result[0].columns;
    const values = result[0].values[0];
    const row = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });

    return row;
  }

  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

export default User;