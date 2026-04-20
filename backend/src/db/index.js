const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../../data/travel.db');
let db;

function getDb() {
  if (db) return db;

  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode=WAL');
  db.exec('PRAGMA foreign_keys=ON');
  initSchema();
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS trips (
      id             TEXT PRIMARY KEY,
      destination    TEXT NOT NULL,
      start_date     TEXT NOT NULL,
      end_date       TEXT NOT NULL,
      budget         REAL NOT NULL,
      interests      TEXT,
      itinerary_json TEXT NOT NULL,
      created_at     TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_trips_destination ON trips(destination);
    CREATE INDEX IF NOT EXISTS idx_trips_created_at  ON trips(created_at);
  `);
}

module.exports = { getDb };
