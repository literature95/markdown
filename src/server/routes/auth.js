import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRegister, validateLogin } from '../utils/validators.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/register', async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password, email } = req.body;
    const user = await User.create(username, password, email);

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (_err) {
    if (_err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;
    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await User.verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (_err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;