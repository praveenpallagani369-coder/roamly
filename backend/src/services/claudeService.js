const Groq = require('groq-sdk');

const SYSTEM_PROMPT = `You are an expert travel planner and destination guide with deep knowledge of countries worldwide.
Always respond with valid JSON only — no markdown, no code fences, no extra text whatsoever.
Make itineraries practical, budget-conscious, accurate, and tailored to the traveler's needs.`;

function buildDemoActivities(destination, dayNum) {
  const schedule = [
    { time: '08:30', activity: 'Breakfast at local café',          description: 'Start the day with a traditional local breakfast and strong coffee.',                 location: `${destination} City Center`,    estimatedCost: '$12', duration: '45 mins',  category: 'food'        },
    { time: '09:30', activity: 'Explore the historic old town',    description: `Walk through ${destination}'s iconic historic quarter, admire the architecture.`,   location: `${destination} Old Town`,       estimatedCost: 'Free', duration: '1.5 hours', category: 'sightseeing' },
    { time: '11:15', activity: 'Visit the national museum',        description: 'Explore the main galleries covering local history, art, and culture.',               location: 'National Museum',               estimatedCost: '$18', duration: '2 hours',   category: 'museum'      },
    { time: '13:30', activity: 'Lunch at the market',              description: 'Grab lunch at the famous central market — try the local specialties.',               location: 'Central Market',                estimatedCost: '$15', duration: '1 hour',    category: 'food'        },
    { time: '14:45', activity: 'City park & botanical gardens',    description: 'Relax and stroll through the beautifully landscaped city park.',                    location: 'City Park',                     estimatedCost: 'Free', duration: '1.5 hours', category: 'leisure'     },
    { time: '16:30', activity: 'Shopping & souvenirs',             description: 'Browse local boutiques and pick up gifts and souvenirs.',                           location: 'Shopping District',             estimatedCost: '$30', duration: '1.5 hours', category: 'shopping'    },
    { time: '19:00', activity: 'Dinner at a top-rated restaurant', description: 'End the day at a highly-rated local restaurant. Try the house specialty dish.',    location: 'Restaurant Row',                estimatedCost: '$45', duration: '1.5 hours', category: 'food'        },
  ];
  // vary slightly per day
  return schedule.map(a => ({ ...a }));
}

function buildDemoItinerary({ destination, startDate, endDate, budget }) {
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const days  = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const themes = ['Arrival & City Orientation', 'Art, History & Culture', 'Local Food & Markets', 'Day Trip & Nature', 'Shopping & Farewell'];

  const dailyItinerary = Array.from({ length: days }, (_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    return {
      day: i + 1,
      date: date.toISOString().split('T')[0],
      theme: themes[i % themes.length],
      activities: buildDemoActivities(destination, i + 1)
    };
  });

  return {
    destination: `${destination} (Demo Mode)`,
    overview: `${destination} is a remarkable destination. ⚠️ This is DEMO — add your Groq API key in backend/.env for real AI-generated plans.`,
    topPlaces: [
      { name: 'City Center',        description: 'The heart of the city.',              category: 'culture',  estimatedCost: 'Free',   duration: '2–3 hours', tips: 'Visit early morning.' },
      { name: 'National Museum',    description: 'World-class historical collection.',  category: 'museum',   estimatedCost: '$15–20', duration: '2–3 hours', tips: 'Book tickets online.' },
      { name: 'Food Market',        description: 'Local produce and street food.',      category: 'food',     estimatedCost: '$10–20', duration: '1–2 hours', tips: 'Go on weekday mornings.' },
      { name: 'City Park',          description: 'Green oasis for a peaceful stroll.',  category: 'nature',   estimatedCost: 'Free',   duration: '1–2 hours', tips: 'Rent a bike.' },
      { name: 'Historic Cathedral', description: 'Stunning centuries-old cathedral.',   category: 'history',  estimatedCost: '$8',     duration: '1 hour',    tips: 'Climb tower at sunset.' },
      { name: 'Waterfront',         description: 'Scenic walkway with cafés.',          category: 'nature',   estimatedCost: 'Free',   duration: '1–2 hours', tips: 'Best at sunset.' },
    ],
    dailyItinerary,
    budgetBreakdown: {
      accommodation: `$${Math.round(budget*0.35)}`, food: `$${Math.round(budget*0.25)}`,
      activities:    `$${Math.round(budget*0.20)}`, transport: `$${Math.round(budget*0.12)}`,
      miscellaneous: `$${Math.round(budget*0.08)}`, total: `$${budget}`
    },
    practicalTips: ['⚠️ DEMO — add Groq API key for real plans.', 'Book 4–6 weeks in advance.', 'Get a local SIM card.', 'Carry local cash.', 'Download offline maps.'],
    bestTimeToVisit: 'Spring and autumn offer the best weather.',
    localCuisine: [{ name: 'Local Specialty', description: 'Must-try regional dish.' }, { name: 'Street Food', description: 'Affordable local bites.' }, { name: 'Traditional Dessert', description: 'Sweet local treat.' }],
    gettingAround: 'Use metro and bus — affordable and efficient.',
    countryInfo: { currency: 'Local Currency', exchangeRate: '1 USD ≈ 1.00 LC (demo)', officialLanguage: 'Local Language', timezone: 'UTC+0 (demo)', powerOutlet: 'Type A/B — demo', tippingCustoms: '10–15% appreciated.', drivingSide: 'right' },
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
      documents: ['Passport', 'Travel insurance', 'Hotel confirmations', 'Emergency contacts', 'Cloud backup'],
      clothing:  ['Light layers', 'Evening layer', 'Walking shoes', 'Sandals', 'Rain jacket', 'Smart outfit'],
      electronics: ['Power adapter', 'Portable charger', 'Phone + cable', 'Camera'],
      health:    ['Medications', 'First-aid kit', 'Sunscreen', 'Insect repellent', 'Hand sanitizer'],
      misc:      ['Water bottle', 'Day backpack', 'Padlock', 'Travel pillow', 'Local cash'],
    },
    healthSafety: {
      safetyRating: '4', vaccinations: ['Routine vaccines', 'Hepatitis A recommended'], waterSafe: true,
      commonScams: ['Taxi overcharging', 'Fake tour guides', 'Distraction pickpocketing'],
      safetyTips: ['Use hotel safe', 'Money belt in crowds', 'Share itinerary', 'Save emergency numbers'],
      healthcareNote: 'Travel insurance strongly recommended.'
    },
    visaInfo: { required: false, type: 'Visa-free (demo)', duration: '90 days', cost: 'Free', notes: 'Verify with official embassy website.' },
    weatherExpectation: { tempRangeC: '18–26°C (64–79°F)', condition: 'Partly sunny', humidity: 'Moderate', rainfall: 'Low', advice: 'Pack light layers and sunscreen.' }
  };
}

async function generateItinerary({ destination, startDate, endDate, budget, interests }) {
  if (process.env.DEMO_MODE === 'true') {
    await new Promise(r => setTimeout(r, 1500));
    return buildDemoItinerary({ destination, startDate, endDate, budget });
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const start = new Date(startDate);
  const end   = new Date(endDate);
  const days  = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const topPlacesCount = Math.min(days * 2, 10);
  const interestsLine  = interests ? `Traveler interests: ${interests}` : 'No specific interests — suggest a well-rounded mix.';

  const prompt = `Generate a comprehensive travel guide for:

Destination: ${destination}
Dates: ${startDate} to ${endDate} (${days} days)
Total Budget: $${budget} USD
${interestsLine}

Return ONLY a valid JSON object with these exact fields:
{
  "destination": "Full name with country",
  "overview": "2-3 sentences about the destination",
  "topPlaces": [
    { "name": "", "description": "", "category": "museum|nature|food|shopping|adventure|culture|beach|history|architecture", "estimatedCost": "$XX", "duration": "X-Y hours", "tips": "" }
  ],
  "dailyItinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "theme": "Descriptive day theme",
      "activities": [
        {
          "time": "09:00",
          "activity": "Activity name",
          "description": "What to do and experience here",
          "location": "Specific venue or area name",
          "estimatedCost": "$XX or Free",
          "duration": "X hours / X mins",
          "category": "sightseeing|museum|food|leisure|shopping|adventure|culture|transport"
        }
      ]
    }
  ],
  "budgetBreakdown": { "accommodation": "$XXX", "food": "$XXX", "activities": "$XXX", "transport": "$XXX", "miscellaneous": "$XXX", "total": "$XXX" },
  "practicalTips": ["tip1","tip2","tip3","tip4","tip5"],
  "bestTimeToVisit": "",
  "localCuisine": [{ "name": "", "description": "" }],
  "gettingAround": "",
  "countryInfo": { "currency": "", "exchangeRate": "1 USD ≈ X", "officialLanguage": "", "timezone": "", "powerOutlet": "", "tippingCustoms": "", "drivingSide": "right" },
  "emergencyContacts": { "general": "911", "police": "", "ambulance": "", "fire": "", "touristHelpline": null },
  "keyPhrases": [
    { "english": "Hello",                  "local": "", "pronunciation": "", "category": "greeting"  },
    { "english": "Thank you",              "local": "", "pronunciation": "", "category": "greeting"  },
    { "english": "Please",                 "local": "", "pronunciation": "", "category": "greeting"  },
    { "english": "Excuse me",              "local": "", "pronunciation": "", "category": "greeting"  },
    { "english": "Where is...?",           "local": "", "pronunciation": "", "category": "transport" },
    { "english": "How much does this cost?","local": "","pronunciation": "", "category": "shopping"  },
    { "english": "I need a doctor",        "local": "", "pronunciation": "", "category": "emergency" },
    { "english": "Help!",                  "local": "", "pronunciation": "", "category": "emergency" },
    { "english": "The bill, please",       "local": "", "pronunciation": "", "category": "food"      },
    { "english": "Do you speak English?",  "local": "", "pronunciation": "", "category": "greeting"  }
  ],
  "packingList": { "documents": [], "clothing": [], "electronics": [], "health": [], "misc": [] },
  "healthSafety": { "safetyRating": "4", "vaccinations": [], "waterSafe": true, "commonScams": [], "safetyTips": [], "healthcareNote": "" },
  "visaInfo": { "required": false, "type": "", "duration": "", "cost": "", "notes": "" },
  "weatherExpectation": { "tempRangeC": "", "condition": "", "humidity": "Low|Moderate|High", "rainfall": "Low|Moderate|High", "advice": "" }
}

CRITICAL RULES for dailyItinerary:
- Each day must have 6-8 activities in the "activities" array
- Schedule activities from ~08:30 to ~21:00 filling the FULL day realistically
- Include breakfast, lunch, and dinner as separate activities with real local restaurant/food options
- Include travel/transit time between distant locations as a short activity
- Each activity time must account for the previous activity's duration (no overlaps)
- Vary activity types across the day — don't cluster all museums together
- On Day 1 include airport/station arrival and hotel check-in as first activities
- On the last day account for check-out and departure time
- Make it feel like a real day a person would actually have — not too rushed, not too empty

Other rules: exactly ${topPlacesCount} topPlaces, exactly ${days} days, exactly 10 keyPhrases, budget total ≈ $${budget}.`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 8192,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: prompt }
    ]
  });

  const text = completion.choices[0].message.content;

  try {
    return JSON.parse(text);
  } catch {
    const err = new Error('AI returned an invalid response. Please try again.');
    err.status = 500;
    err.code = 'AI_PARSE_ERROR';
    throw err;
  }
}

module.exports = { generateItinerary };
