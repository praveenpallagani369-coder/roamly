const express = require('express');
const { createTrip, getTripById, listRecentTrips } = require('../services/tripService');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { destination, startDate, endDate, budget, interests } = req.body;
    const trip = await createTrip({ destination, startDate, endDate, budget, interests, userId: req.user.id });
    res.status(201).json({ data: trip });
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth, (req, res, next) => {
  try {
    const trips = listRecentTrips(10, req.user.id);
    res.json({ data: trips, meta: { count: trips.length } });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireAuth, (req, res, next) => {
  try {
    const trip = getTripById(req.params.id);
    if (!trip) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found.' } });
    if (trip.userId !== req.user.id) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied.' } });
    res.json({ data: trip });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
