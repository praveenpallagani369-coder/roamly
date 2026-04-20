require('dotenv').config();

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

app.listen(PORT, () => {
  console.log(`Travel App Backend running at http://localhost:${PORT}`);
});
