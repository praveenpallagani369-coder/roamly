const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const tripsRouter = require('./routes/trips');
const authRouter = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: { code: 'RATE_LIMIT', message: 'Too many requests, please slow down.' } }
});

// Two AI calls per trip generation, so max 4 trips per 60s keeps us under 8 API calls/min
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 4,
  message: { error: { code: 'RATE_LIMIT', message: 'Too many itinerary requests. Please wait a moment.' } }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: { code: 'RATE_LIMIT', message: 'Too many authentication attempts. Please try again later.' } }
});

app.use('/api/', generalLimiter);
app.use('/api/v1/trips', (req, res, next) => {
  if (req.method === 'POST') return aiLimiter(req, res, next);
  next();
});
app.use('/api/v1/auth', authLimiter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/trips', tripsRouter);

app.use(errorHandler);

module.exports = app;
