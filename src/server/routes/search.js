const express = require('express');
const { getDatabase } = require('../config/database');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/search', (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const db = getDatabase();
  
  const searchTerm = `%${query}%`;
  
  const result = db.exec(
    'SELECT id, title, content, created_at, updated_at FROM files WHERE user_id = ? AND (title LIKE ? OR content LIKE ?)',
    [req.user.id, searchTerm, searchTerm]
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

module.exports = router;