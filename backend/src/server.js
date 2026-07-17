import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './config/db.js';
import { authenticateToken } from './middleware/auth.js';
import bikesRouter from './routes/bikes.js';
import motorcyclesRouter from './routes/motorcycles.js';
import weatherRouter from './routes/weather.js';
import eventsRouter from './routes/events.js';
import hotspotsRouter from './routes/hotspots.js';

dotenv.config();

const app = express();
// Checks ENV for dedicated port, or defaults to 4000.
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

// Plugs the route files in routes/ into the app, keeping this file from turning into one giant list of every single route.
app.use('/api/motorcycles', motorcyclesRouter);
app.use('/api/bikes', bikesRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/events', eventsRouter);
app.use('/api/hotspots', hotspotsRouter);

app.post('/api/auth/register', async (req, res, next) => {
  // Create a new user account and hash the password before storing it.
  try {
    const { email, password, display_name, postcode } = req.body || {};

    //If theres no email, password or display name, return a 400 error
    if (!email || !password || !display_name) {
      return res.status(400).json({ error: 'email, password, and display_name are required.' });
    }

    // trim down the email whitespace and make it lowercase to avoid duplicates
    const normalisedEmail = email.trim().toLowerCase();
    const [existingRows] = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [normalisedEmail]);

    // checks if there is already an email in the database, if so return a 409 error
    if (existingRows.length > 0) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    // hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    // Postcode is saved as-is, no lookup here, it's turned into latitude/longitude lazily on first weather check instead (weather.js).
    const [result] = await query(
      'INSERT INTO users (email, password_hash, display_name, postcode, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [normalisedEmail, passwordHash, display_name.trim(), postcode ? postcode.trim() : null]
    );

    // Return the new user data (excluding the password hash)
    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: result.insertId,
        email: normalisedEmail,
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

    // Normalize the email to avoid case sensitivity issues and trim whitespace
    const normalisedEmail = email.trim().toLowerCase();
    const [rows] = await query('SELECT id, email, password_hash, display_name FROM users WHERE email = ? LIMIT 1', [normalisedEmail]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    // If the password doesn't match, shows an error but doesn't specify what was wrong
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    // If the password matches, create a JWT and return it to the client
    const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Return the token and user info (excluding the password hash) to the client
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

// Global error handle just tostop the server from crashing and leaving the user hanging
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'An unexpected error occurred.'
  });
});

// When the server starts the console will log the port (and just to tell me its working)
app.listen(PORT, () => {
  console.log(`TORQ backend listening on port ${PORT}`);
});
