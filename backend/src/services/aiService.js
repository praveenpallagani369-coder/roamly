const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_INSTRUCTION = `You are an expert travel planner and destination guide with deep knowledge of countries worldwide.
Always respond with valid JSON only — no markdown, no code fences, no extra text whatsoever.
Make itineraries practical, budget-conscious, accurate, and tailored to the traveler's needs.`;

// ─── Demo mode ────────────────────────────────────────────────────────────────

function buildDemoActivities(destination) {
  return [
    { time: '08:30', activity: 'Breakfast at local café',          description: 'Start the day with a traditional local breakfast.',                       location: `${destination} City Center`,  estimatedCost: '$12',  duration: '45 mins',   category: 'food',        lat: null, lng: null },
    { time: '09:30', activity: 'Explore the historic old town',    description: `Walk through ${destination}'s iconic historic quarter.`,                  location: `${destination} Old Town`,     estimatedCost: 'Free', duration: '1.5 hours', category: 'sightseeing', lat: null, lng: null },
    { time: '11:15', activity: 'Visit the national museum',        description: 'Explore the main galleries covering local history, art, and culture.',    location: 'National Museum',             estimatedCost: '$18',  duration: '2 hours',   category: 'museum',      lat: null, lng: null },
    { time: '13:30', activity: 'Lunch at the market',              description: 'Grab lunch at the famous central market — try the local specialties.',    location: 'Central Market',              estimatedCost: '$15',  duration: '1 hour',    category: 'food',        lat: null, lng: null },
    { time: '14:45', activity: 'City park & botanical gardens',    description: 'Relax and stroll through the beautifully landscaped city park.',          location: 'City Park',                   estimatedCost: 'Free', duration: '1.5 hours', category: 'leisure',     lat: null, lng: null },
    { time: '16:30', activity: 'Shopping & souvenirs',             description: 'Browse local boutiques and pick up gifts and souvenirs.',                 location: 'Shopping District',           estimatedCost: '$30',  duration: '1.5 hours', category: 'shopping',    lat: null, lng: null },
    { time: '19:00', activity: 'Dinner at a top-rated restaurant', description: 'End the day at a highly-rated local restaurant.',                         location: 'Restaurant Row',              estimatedCost: '$45',  duration: '1.5 hours', category: 'food',        lat: null, lng: null },
  ];
}

function buildDemoItinerary({ destination, startDate, endDate, budget }) {
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const days  = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const themes = ['Arrival & City Orientation', 'Art, History & Culture', 'Local Food & Markets', 'Day Trip & Nature', 'Shopping & Farewell'];

  return {
    destination: `${destination} (Demo Mode)`,
    overview: `${destination} is a remarkable destination. ⚠️ This is DEMO — add your Google Gemini API key in backend/.env for real AI-generated plans.`,
    topPlaces: [
      { name: 'City Center',        description: 'The heart of the city.',              category: 'culture',  estimatedCost: 'Free',   duration: '2–3 hours', tips: 'Visit early morning.' },
      { name: 'National Museum',    description: 'World-class historical collection.',  category: 'museum',   estimatedCost: '$15–20', duration: '2–3 hours', tips: 'Book tickets online.' },
      { name: 'Food Market',        description: 'Local produce and street food.',      category: 'food',     estimatedCost: '$10–20', duration: '1–2 hours', tips: 'Go on weekday mornings.' },
      { name: 'City Park',          description: 'Green oasis for a peaceful stroll.',  category: 'nature',   estimatedCost: 'Free',   duration: '1–2 hours', tips: 'Rent a bike.' },
      { name: 'Historic Cathedral', description: 'Stunning centuries-old cathedral.',   category: 'history',  estimatedCost: '$8',     duration: '1 hour',    tips: 'Climb tower at sunset.' },
      { name: 'Waterfront',         description: 'Scenic walkway with cafés.',          category: 'nature',   estimatedCost: 'Free',   duration: '1–2 hours', tips: 'Best at sunset.' },
    ],
    dailyItinerary: Array.from({ length: days }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return { day: i + 1, date: date.toISOString().split('T')[0], theme: themes[i % themes.length], activities: buildDemoActivities(destination) };
    }),
    budgetBreakdown: {
      accommodation: `$${Math.round(budget * 0.35)}`, food: `$${Math.round(budget * 0.25)}`,
      activities:    `$${Math.round(budget * 0.20)}`, transport: `$${Math.round(budget * 0.12)}`,
      miscellaneous: `$${Math.round(budget * 0.08)}`, total: `$${budget}`
    },
    practicalTips: ['⚠️ DEMO — add Gemini API key for real plans.', 'Book 4–6 weeks in advance.', 'Get a local SIM card.', 'Carry local cash.', 'Download offline maps.'],
    bestTimeToVisit: 'Spring and autumn offer the best weather.',
    localCuisine: [{ name: 'Local Specialty', description: 'Must-try regional dish.' }, { name: 'Street Food', description: 'Affordable local bites.' }],
    gettingAround: 'Use metro and bus — affordable and efficient.',
    countryInfo: { currency: 'Local Currency', exchangeRate: '1 USD ≈ 1.00 LC (demo)', officialLanguage: 'Local Language', timezone: 'UTC+0 (demo)', powerOutlet: 'Type A/B', tippingCustoms: '10–15% appreciated.', drivingSide: 'right' },
    emergencyContacts: { general: '112', police: '110', ambulance: '911', fire: '999', touristHelpline: null },
    keyPhrases: [
      { english: 'Hello',                 local: 'Demo', pronunciation: 'demo', category: 'greeting'  },
      { english: 'Thank you',             local: 'Demo', pronunciation: 'demo', category: 'greeting'  },
      { english: 'Please',                local: 'Demo', pronunciation: 'demo', category: 'greeting'  },
      { english: 'Excuse me',             local: 'Demo', pronunciation: 'demo', category: 'greeting'  },
      { english: 'Where is...?',          local: 'Demo', pronunciation: 'demo', category: 'transport' },
      { english: 'How much?',             local: 'Demo', pronunciation: 'demo', category: 'shopping'  },
      { english: 'I need a doctor',       local: 'Demo', pronunciation: 'demo', category: 'emergency' },
      { english: 'Help!',                 local: 'Demo', pronunciation: 'demo', category: 'emergency' },
      { english: 'The bill, please',      local: 'Demo', pronunciation: 'demo', category: 'food'      },
      { english: 'Do you speak English?', local: 'Demo', pronunciation: 'demo', category: 'greeting'  },
    ],
    packingList: {
      documents:   ['Passport', 'Travel insurance', 'Hotel confirmations', 'Emergency contacts'],
      clothing:    ['Light layers', 'Evening layer', 'Walking shoes', 'Rain jacket', 'Smart outfit'],
      electronics: ['Power adapter', 'Portable charger', 'Phone + cable', 'Camera'],
      health:      ['Medications', 'First-aid kit', 'Sunscreen', 'Insect repellent'],
      misc:        ['Water bottle', 'Day backpack', 'Local cash'],
    },
    healthSafety: {
      safetyRating: '4', vaccinations: ['Routine vaccines'], waterSafe: true,
      commonScams: ['Taxi overcharging', 'Fake tour guides'],
      safetyTips: ['Use hotel safe', 'Money belt in crowds'],
      healthcareNote: 'Travel insurance strongly recommended.'
    },
    visaInfo: { required: false, type: 'Visa-free (demo)', duration: '90 days', cost: 'Free', notes: 'Verify with official embassy website.' },
    weatherExpectation: { tempRangeC: '18–26°C (64–79°F)', condition: 'Partly sunny', humidity: 'Moderate', rainfall: 'Low', advice: 'Pack light layers and sunscreen.' }
  };
}

// ─── Pass 1: Generate committed day-plan manifest with coordinates ─────────────

async function generateDayPlan(genAI, { destination, startDate, endDate, budget, interests, days }) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: { responseMimeType: 'application/json', temperature: 0.6 },
  });

  const interestsLine = interests
    ? `Traveler interests: ${interests}`
    : 'No specific interests — suggest a well-rounded mix.';

  const prompt = `Plan a ${days}-day trip to ${destination} (${startDate} to ${endDate}), budget $${budget} USD.
${interestsLine}

Assign real, named attractions and restaurants to each day. Include accurate GPS coordinates for each attraction.

Return ONLY this exact JSON structure:
{
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "Short descriptive theme",
      "attractions": [
        {
          "name": "Exact real venue name",
          "durationHours": 2.5,
          "tier": "full-day|half-day|standard|short",
          "category": "sightseeing|museum|shopping|nature|adventure|culture|leisure|transport",
          "lat": 17.3616,
          "lng": 78.4747
        }
      ],
      "meals": {
        "breakfast": "Exact real restaurant name",
        "lunch": "Exact real restaurant name",
        "dinner": "Exact real restaurant name"
      }
    }
  ]
}

STRICT RULES — violations make this plan unusable:
1. Every attraction name must be globally unique across ALL ${days} days — never repeat any venue.
2. Every meal venue must be globally unique across ALL ${days} days — you need ${days * 3} different named food venues total.
3. Tier rules for scheduling:
   - "full-day" (7–10 hrs): theme parks, major film studios, large safari/resort. ONE attraction only — fills the entire day.
   - "half-day" (3–5 hrs): major forts, flagship museums, large palaces, big national parks. Max 1 standard attraction alongside.
   - "standard" (1.5–2.5 hrs): temples, monuments, smaller museums, markets, lakes. Up to 3 per day.
   - "short" (0.5–1 hr): viewpoints, small shrines, snack spots. Supplement only.
4. Day 1: airport arrival + hotel check-in must be the first two attractions (tier "short"). Only 1 light standard attraction max.
5. Day ${days} (last day): light day only — check-out and departure. No major sightseeing.
6. Use accurate real GPS coordinates (lat/lng) for every attraction.
7. Generate exactly ${days} days.`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

// ─── Deduplication ────────────────────────────────────────────────────────────

function deduplicateManifest(manifest) {
  const seenAttractions = new Set();
  const seenMeals       = new Set();

  for (const day of manifest.days) {
    day.attractions = (day.attractions || []).filter(a => {
      const key = a.name.toLowerCase().trim();
      if (seenAttractions.has(key)) return false;
      seenAttractions.add(key);
      return true;
    });

    for (const mealType of ['breakfast', 'lunch', 'dinner']) {
      const venue = day.meals?.[mealType];
      if (!venue) continue;
      const key = venue.toLowerCase().trim();
      if (seenMeals.has(key)) {
        day.meals[mealType] = null;
      } else {
        seenMeals.add(key);
      }
    }
  }

  return manifest;
}

// ─── Pass 2: Build full guide from locked manifest ────────────────────────────

function compactManifest(daysArr) {
  return daysArr.map(d => {
    const attractions = (d.attractions || [])
      .map(a => `${a.name}[${a.tier},${a.durationHours}h,${a.lat ?? ''},${a.lng ?? ''}]`)
      .join('; ');
    const b  = d.meals?.breakfast || 'null';
    const l  = d.meals?.lunch     || 'null';
    const dn = d.meals?.dinner    || 'null';
    return `Day${d.day}(${d.date})|${d.theme}\n  A:${attractions}\n  M:B=${b},L=${l},D=${dn}`;
  }).join('\n');
}

async function generateFullGuide(genAI, { destination, startDate, endDate, budget, interests, days, manifest, topPlacesCount }) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
  });

  const interestsLine = interests ? `Interests: ${interests}` : 'No specific interests.';
  const manifestText  = compactManifest(manifest.days);

  const prompt = `Build a complete travel guide JSON for:
Destination: ${destination} | Dates: ${startDate}→${endDate} (${days}d) | Budget: $${budget} USD | ${interestsLine}

LOCKED PLAN (FIXED — do not change any venue name, add/remove attractions, or swap meals):
${manifestText}

Format note: each attraction in the locked plan is: Name[tier,durationH,lat,lng]

YOUR ONLY TASKS for dailyItinerary:
1. Assign times using chain rule: next_start = prev_start + prev_duration. Day 1 starts 09:00, others 08:30.
2. Tier durations: full-day[9h,09:30–17:30,no other sightseeing], half-day[3–5h], standard[1.5–2.5h], short[0.5–1h].
3. Write a 1–2 sentence description per activity.
4. Add estimatedCost for each activity.
5. Insert a "Transport" activity (30–60 min) between locations that are >5 km apart.
6. Replace any null meal with "Local eatery near [area]".
7. Copy lat and lng from the locked plan into each activity (use 0 for transport/meal activities without coords).

Return ONLY a valid JSON object with ALL of these top-level keys:
- destination (string, full name with country)
- overview (2–3 sentences)
- topPlaces (array of ${topPlacesCount} objects: name, description, category, estimatedCost, duration, tips)
- dailyItinerary (array of ${days} objects: day, date, theme, activities)
  Each activity: time, activity, description, location, lat, lng, estimatedCost, duration, category
- budgetBreakdown (accommodation, food, activities, transport, miscellaneous, total≈$${budget})
- practicalTips (array of 5 strings)
- bestTimeToVisit (string)
- localCuisine (array of 3 objects: name, description)
- gettingAround (string)
- countryInfo (currency, exchangeRate, officialLanguage, timezone, powerOutlet, tippingCustoms, drivingSide)
- emergencyContacts (general, police, ambulance, fire, touristHelpline)
- keyPhrases (exactly 10 objects: english, local, pronunciation, category — categories: greeting/transport/shopping/food/emergency)
- packingList (documents, clothing, electronics, health, misc — each an array of strings)
- healthSafety (safetyRating, vaccinations, waterSafe, commonScams, safetyTips, healthcareNote)
- visaInfo (required, type, duration, cost, notes)
- weatherExpectation (tempRangeC, condition, humidity, rainfall, advice)`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

// ─── Public API ───────────────────────────────────────────────────────────────

async function generateItinerary({ destination, startDate, endDate, budget, interests }) {
  if (process.env.DEMO_MODE === 'true' || !process.env.GOOGLE_GEMINI_API_KEY) {
    await new Promise(r => setTimeout(r, 1500));
    return buildDemoItinerary({ destination, startDate, endDate, budget });
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

  const start = new Date(startDate);
  const end   = new Date(endDate);
  const days  = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const topPlacesCount = Math.min(Math.max(days * 2, 12), 20);
  const params = { destination, startDate, endDate, budget, interests, days };

  // ── Pass 1: committed venue manifest ──
  let manifest;
  try {
    const raw = await generateDayPlan(genAI, params);
    manifest = deduplicateManifest(raw);
  } catch (cause) {
    console.error('[Pass 1 error]', cause);
    if (isRateLimitError(cause)) throw buildRateLimitError();
    const err = new Error('Failed to generate the trip plan. Please try again.');
    err.status = 500;
    err.code = 'AI_PLAN_ERROR';
    throw err;
  }

  // ── Pass 2: full guide locked to manifest ──
  try {
    return await generateFullGuide(genAI, { ...params, manifest, topPlacesCount });
  } catch (cause) {
    console.error('[Pass 2 error]', cause);
    if (isRateLimitError(cause)) throw buildRateLimitError();
    const err = new Error('Failed to build the itinerary details. Please try again.');
    err.status = 500;
    err.code = 'AI_GUIDE_ERROR';
    throw err;
  }
}

function isRateLimitError(err) {
  const msg = (err?.message || '').toLowerCase();
  return err?.status === 429 ||
    msg.includes('429') ||
    msg.includes('resource exhausted') ||
    msg.includes('quota') ||
    msg.includes('rate limit');
}

function buildRateLimitError() {
  const err = new Error('AI service rate limit reached. Please wait a minute and try again.');
  err.status = 429;
  err.code = 'RATE_LIMIT';
  return err;
}

module.exports = { generateItinerary };
