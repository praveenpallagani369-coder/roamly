const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const tripsRouter = require('./routes/trips');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: { code: 'RATE_LIMIT', message: 'Too many requests, please slow down.' } }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  message: { error: { code: 'RATE_LIMIT', message: 'Too many itinerary requests. Please wait a moment.' } }
});

app.use('/api/', generalLimiter);
app.use('/api/v1/trips', (req, res, next) => {
  if (req.method === 'POST') return aiLimiter(req, res, next);
  next();
});

app.use('/api/v1/trips', tripsRouter);

app.use(errorHandler);

module.exports = app;
