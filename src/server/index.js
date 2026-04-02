const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const filesRoutes = require('./routes/files');
const sharesRoutes = require('./routes/shares');
const { initializeDatabase } = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function startServer() {
  await initializeDatabase();

  app.use('/api/auth', authRoutes);
  app.use('/api/files', filesRoutes);
  app.use('/api/shares', sharesRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

if (require.main === module) {
  startServer();
} else {
  // When required in tests, ensure database is initialized for route handlers
  startServer();
}

module.exports = app;