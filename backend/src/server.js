import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool, { query } from './config/db.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
// Allow the Vite frontend to call the API from the local dev ports.
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
    credentials: true,
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', async (req, res, next) => {
  // Create a new user account and hash the password before storing it.
  try {
    const { email, password, display_name } = req.body || {};

    if (!email || !password || !display_name) {
      return res.status(400).json({ error: 'email, password, and display_name are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [existingRows] = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);

    if (existingRows.length > 0) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await query(
      'INSERT INTO users (email, password_hash, display_name, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [normalizedEmail, passwordHash, display_name.trim()]
    );

    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: result.insertId,
        email: normalizedEmail,
        display_name: display_name.trim()
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  // Check the email and password, then issue a JWT when the credentials are valid.
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [rows] = await query('SELECT id, email, password_hash, display_name FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res, next) => {
  // Return the current user from the JWT so the frontend can restore the session.
  try {
    const [rows] = await query('SELECT id, email, display_name FROM users WHERE id = ? LIMIT 1', [req.user.user_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'An unexpected error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`TORQ backend listening on port ${PORT}`);
});
