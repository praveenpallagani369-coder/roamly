const express = require('express');
const { createTrip, getTripById, listRecentTrips } = require('../services/tripService');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { destination, startDate, endDate, budget, interests } = req.body;
    const trip = await createTrip({ destination, startDate, endDate, budget, interests });
    res.status(201).json({ data: trip });
  } catch (err) {
    next(err);
  }
});

router.get('/', (req, res, next) => {
  try {
    const trips = listRecentTrips(10);
    res.json({ data: trips, meta: { count: trips.length } });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const trip = getTripById(req.params.id);
    if (!trip) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found.' } });
    res.json({ data: trip });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
