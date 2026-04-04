import express from 'express';
import { getDatabase, saveDatabase } from '../config/database.js';
import { authenticateToken } from '../middlewares/auth.js';
import { validateFile } from '../utils/validators.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', (req, res) => {
  const db = getDatabase();
  const result = db.exec(
    'SELECT id, title, created_at, updated_at FROM files WHERE user_id = ?',
    [req.user.id]
  );

  if (result.length === 0) {
    return res.json([]);
  }

  const columns = result[0].columns;
  const rows = result[0].values.map(values => {
    const row = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    return row;
  });

  res.json(rows);
});

router.get('/:id', (req, res) => {
  const db = getDatabase();
  const result = db.exec(
    'SELECT * FROM files WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );

  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(404).json({ error: 'File not found' });
  }

  const columns = result[0].columns;
  const values = result[0].values[0];
  const row = {};
  columns.forEach((col, i) => {
    row[col] = values[i];
  });

  res.json(row);
});

router.post('/', async (req, res) => {
  try {
    const { error } = validateFile(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, content } = req.body;
    const db = getDatabase();

    db.run(
      'INSERT INTO files (user_id, title, content) VALUES (?, ?, ?)',
      [req.user.id, title, content || '']
    );

    saveDatabase();

    const result = db.exec('SELECT last_insert_rowid() as id');
    const id = result[0]?.values[0]?.[0];

    res.status(201).json({
      id,
      title,
      content: content || '',
      created_at: new Date().toISOString()
    });
  } catch (_err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { error } = validateFile(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, content } = req.body;
    const db = getDatabase();

    const result = db.run(
      'UPDATE files SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [title, content, req.params.id, req.user.id]
    );

    saveDatabase();

    if (result.changes === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File updated successfully' });
  } catch (_err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', (req, res) => {
  const db = getDatabase();
  const result = db.run(
    'DELETE FROM files WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );

  const { saveDatabase } = require('../config/database');
  saveDatabase();

  if (result.changes === 0) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.json({ message: 'File deleted successfully' });
});

export default router;