const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const { signToken } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const fields = {};
    if (!firstName?.trim()) fields.firstName = 'First name is required.';
    if (!lastName?.trim()) fields.lastName = 'Last name is required.';
    if (!email?.trim()) fields.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = 'Enter a valid email.';
    if (!password) fields.password = 'Password is required.';
    else if (password.length < 8) fields.password = 'Password must be at least 8 characters.';

    if (Object.keys(fields).length) {
      return res.status(422).json({ error: { code: 'VALIDATION', message: 'Please fix the errors below.', fields } });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: { code: 'EMAIL_TAKEN', message: 'An account with this email already exists.', fields: { email: 'Email already in use.' } } });
    }

    const hashed = await bcrypt.hash(password, 12);
    const id = uuidv4();
    db.prepare('INSERT INTO users (id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)')
      .run(id, firstName.trim(), lastName.trim(), email.toLowerCase().trim(), hashed);

    const user = { id, firstName: firstName.trim(), lastName: lastName.trim(), email: email.toLowerCase().trim() };
    const token = signToken({ id, email: user.email });

    res.status(201).json({ data: { user, token } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const fields = {};
    if (!email?.trim()) fields.email = 'Email is required.';
    if (!password) fields.password = 'Password is required.';
    if (Object.keys(fields).length) {
      return res.status(422).json({ error: { code: 'VALIDATION', message: 'Please fix the errors below.', fields } });
    }

    const db = getDb();
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    const match = row ? await bcrypt.compare(password, row.password) : false;
    if (!row || !match) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } });
    }

    const user = { id: row.id, firstName: row.first_name, lastName: row.last_name, email: row.email };
    const token = signToken({ id: row.id, email: row.email });

    res.json({ data: { user, token } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
