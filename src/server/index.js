import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
import filesRoutes from './routes/files.js';
import sharesRoutes from './routes/shares.js';
import aiRoutes from './routes/ai.js';
import searchRoutes from './routes/search.js';
import versionsRoutes from './routes/versions.js';
import { initializeDatabase } from './config/database.js';

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
  app.use('/api', aiRoutes);
  app.use('/api', searchRoutes);
  app.use('/api', versionsRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../../dist/client')));

  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
  });

  // Always listen for requests
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Check if the module is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
} else {
  // When required in tests, ensure database is initialized for route handlers
  startServer();
}

export default app;