const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const FileVersion = require('../models/FileVersion');

const router = express.Router();

router.use(authenticateToken);

router.get('/:fileId/versions', async (req, res) => {
  try {
    const versions = await FileVersion.getVersions(req.params.fileId);
    res.json(versions);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/versions/:versionId', async (req, res) => {
  try {
    const version = await FileVersion.getVersion(req.params.versionId);
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    res.json(version);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:fileId/versions/rollback/:versionId', async (req, res) => {
  try {
    const result = await FileVersion.rollback(
      req.params.fileId,
      req.params.versionId,
      req.user.id
    );
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message || 'Rollback failed' });
  }
});

module.exports = router;