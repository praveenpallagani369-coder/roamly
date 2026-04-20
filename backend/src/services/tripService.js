const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const { generateItinerary } = require('./claudeService');

function validate({ destination, startDate, endDate, budget }) {
  const fields = {};

  if (!destination || destination.trim().length < 2)
    fields.destination = 'Destination must be at least 2 characters.';

  if (!startDate)
    fields.startDate = 'Start date is required.';

  if (!endDate)
    fields.endDate = 'End date is required.';

  if (startDate && endDate && new Date(startDate) > new Date(endDate))
    fields.endDate = 'End date must be after start date.';

  if (!budget || isNaN(budget) || Number(budget) <= 0)
    fields.budget = 'Budget must be a positive number.';

  return fields;
}

async function createTrip({ destination, startDate, endDate, budget, interests }) {
  const fields = validate({ destination, startDate, endDate, budget });
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
    INSERT INTO trips (id, destination, start_date, end_date, budget, interests, itinerary_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(id, destination.trim(), startDate, endDate, parseFloat(budget), interests || null, JSON.stringify(itinerary));

  return { id, destination: destination.trim(), startDate, endDate, budget: parseFloat(budget), interests: interests || null, itinerary };
}

function getTripById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM trips WHERE id = ?').get(id);
  if (!row) return null;
  return {
    id: row.id,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    budget: row.budget,
    interests: row.interests,
    itinerary: JSON.parse(row.itinerary_json),
    createdAt: row.created_at
  };
}

function listRecentTrips(limit = 10) {
  const db = getDb();
  return db
    .prepare('SELECT id, destination, start_date, end_date, budget, interests, created_at FROM trips ORDER BY created_at DESC LIMIT ?')
    .all(limit)
    .map(row => ({
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
