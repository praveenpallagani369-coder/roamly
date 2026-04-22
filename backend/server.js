require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required but not set.');
  process.exit(1);
}

const DEMO_MODE = !process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here';

if (DEMO_MODE) {
  console.log('');
  console.log('  ⚠️  No GROQ_API_KEY found — running in DEMO MODE');
  console.log('  Get a free key at console.groq.com → API Keys');
  console.log('');
}

process.env.DEMO_MODE = DEMO_MODE ? 'true' : 'false';

const app = require('./src/app');
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Travel App Backend running at http://localhost:${PORT}`);
});

function shutdown() {
  server.close(() => {
    try { require('./src/db').getDb().close(); } catch (_) {}
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
