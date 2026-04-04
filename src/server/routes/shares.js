import express from 'express';
import crypto from 'crypto';
import { getDatabase, saveDatabase } from '../config/database.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// 需要登录才能创建分享链接
router.post('/', authenticateToken, (req, res) => {
  const { fileId, expiresInHours } = req.body;
  if (!fileId) {
    return res.status(400).json({ error: 'fileId is required' });
  }

  const db = getDatabase();
  const result = db.exec('SELECT * FROM files WHERE id = ? AND user_id = ?', [fileId, req.user.id]);

  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(404).json({ error: 'File not found or unauthorized' });
  }

  const token = crypto.randomBytes(12).toString('hex');
  const expiresAt = expiresInHours
    ? new Date(Date.now() + (Number(expiresInHours) || 24) * 60 * 60 * 1000).toISOString()
    : null;

  db.run(
    'INSERT INTO shares (file_id, share_token, expires_at) VALUES (?, ?, ?)',
    [fileId, token, expiresAt]
  );
  saveDatabase();

  res.status(201).json({
    shareToken: token,
    expiresAt,
    link: `${process.env.APP_URL || 'http://localhost:3001'}/api/shares/${token}`,
  });
});

router.get('/:token', (req, res) => {
  const db = getDatabase();
  const result = db.exec('SELECT * FROM shares WHERE share_token = ?', [req.params.token]);

  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(404).json({ error: 'Share link not found' });
  }

  const [, fileId, , expiresAt] = result[0].values[0];

  if (expiresAt && new Date(expiresAt) < new Date()) {
    return res.status(410).json({ error: 'Share link has expired' });
  }

  const fileResult = db.exec('SELECT id, title, content, created_at, updated_at FROM files WHERE id = ?', [fileId]);
  if (fileResult.length === 0 || fileResult[0].values.length === 0) {
    return res.status(404).json({ error: 'Shared file not found' });
  }

  const fileRow = fileResult[0].values[0];
  const fileColumns = fileResult[0].columns;
  const fileData = {};
  fileColumns.forEach((col, i) => {
    fileData[col] = fileRow[i];
  });

  res.json({ file: fileData, expiresAt });
});

export default router;
