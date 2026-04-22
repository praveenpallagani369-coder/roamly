const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const { generateItinerary } = require('./aiService');

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validate({ destination, startDate, endDate, budget, interests }) {
  const fields = {};

  if (!destination || destination.trim().length < 2)
    fields.destination = 'Destination must be at least 2 characters.';
  else if (destination.trim().length > 100)
    fields.destination = 'Destination must be 100 characters or fewer.';

  if (!startDate)
    fields.startDate = 'Start date is required.';
  else if (!ISO_DATE_RE.test(startDate) || isNaN(new Date(startDate)))
    fields.startDate = 'Start date must be a valid date (YYYY-MM-DD).';

  if (!endDate)
    fields.endDate = 'End date is required.';
  else if (!ISO_DATE_RE.test(endDate) || isNaN(new Date(endDate)))
    fields.endDate = 'End date must be a valid date (YYYY-MM-DD).';

  if (startDate && endDate && !fields.startDate && !fields.endDate && new Date(startDate) > new Date(endDate))
    fields.endDate = 'End date must be after start date.';

  if (!budget || isNaN(budget) || Number(budget) <= 0)
    fields.budget = 'Budget must be a positive number.';

  if (interests && interests.trim().length > 500)
    fields.interests = 'Interests must be 500 characters or fewer.';

  return fields;
}

async function createTrip({ destination, startDate, endDate, budget, interests, userId }) {
  const fields = validate({ destination, startDate, endDate, budget, interests });
  if (Object.keys(fields).length > 0) {
    const err = new Error('Validation failed');
    err.status = 422;
    err.code = 'VALIDATION_ERROR';
    err.fields = fields;
    throw err;
  }

  const itinerary = await generateItinerary({
    destination: destination.trim(),
    startDate,
    endDate,
    budget: parseFloat(budget),
    interests: interests ? interests.trim() : null
  });

  const db = getDb();
  const id = uuidv4();

  db.prepare(`
    INSERT INTO trips (id, user_id, destination, start_date, end_date, budget, interests, itinerary_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(id, userId || null, destination.trim(), startDate, endDate, parseFloat(budget), interests || null, JSON.stringify(itinerary));

  return { id, destination: destination.trim(), startDate, endDate, budget: parseFloat(budget), interests: interests || null, itinerary };
}

function getTripById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM trips WHERE id = ?').get(id);
  if (!row) return null;
  let itinerary;
  try {
    itinerary = JSON.parse(row.itinerary_json);
  } catch {
    const err = new Error('Trip data is corrupt.');
    err.status = 500;
    err.code = 'DATA_ERROR';
    throw err;
  }
  return {
    id: row.id,
    userId: row.user_id,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    budget: row.budget,
    interests: row.interests,
    itinerary,
    createdAt: row.created_at
  };
}

function listRecentTrips(limit = 10, userId) {
  if (!userId) throw new Error('userId is required for listRecentTrips');
  const db = getDb();
  const rows = db.prepare('SELECT id, destination, start_date, end_date, budget, interests, created_at FROM trips WHERE user_id = ? ORDER BY created_at DESC LIMIT ?').all(userId, limit);

  return rows.map(row => ({
    id: row.id,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    budget: row.budget,
    interests: row.interests,
    createdAt: row.created_at
  }));
}

module.exports = { createTrip, getTripById, listRecentTrips };
