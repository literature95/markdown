import { getDatabase, saveDatabase } from '../config/database.js';

class FileVersion {
  static async create(fileId, userId, content, message = '') {
    const db = getDatabase();
    
    try {
      db.run(
        'INSERT INTO file_versions (file_id, user_id, content, message) VALUES (?, ?, ?, ?)',
        [fileId, userId, content, message]
      );
      
      saveDatabase();
      
      const result = db.exec('SELECT last_insert_rowid() as id');
      const id = result[0]?.values[0]?.[0];
      
      return id;
    } catch (err) {
      throw err;
    }
  }

  static async getVersions(fileId) {
    const db = getDatabase();
    
    const result = db.exec(
      'SELECT v.id, v.user_id, v.content, v.message, v.created_at, u.username ' +
      'FROM file_versions v ' +
      'JOIN users u ON v.user_id = u.id ' +
      'WHERE v.file_id = ? ' +
      'ORDER BY v.created_at DESC',
      [fileId]
    );
    
    if (result.length === 0) {
      return [];
    }
    
    const columns = result[0].columns;
    return result[0].values.map(values => {
      const row = {};
      columns.forEach((col, i) => {
        row[col] = values[i];
      });
      return row;
    });
  }

  static async getVersion(versionId) {
    const db = getDatabase();
    
    const result = db.exec(
      'SELECT v.id, v.file_id, v.user_id, v.content, v.message, v.created_at, u.username ' +
      'FROM file_versions v ' +
      'JOIN users u ON v.user_id = u.id ' +
      'WHERE v.id = ?',
      [versionId]
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

  static async rollback(fileId, versionId, userId) {
    const db = getDatabase();
    
    try {
      const version = await this.getVersion(versionId);
      if (!version || version.file_id !== fileId) {
        throw new Error('Version not found');
      }
      
      db.run(
        'UPDATE files SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [version.content, fileId]
      );
      
      saveDatabase();
      
      return { success: true, message: 'Rollback successful' };
    } catch (err) {
      throw err;
    }
  }
}

export default FileVersion;