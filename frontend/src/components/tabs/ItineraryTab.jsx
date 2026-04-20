import { useState } from 'react';

const CATEGORY_CONFIG = {
  sightseeing: { icon: '🏛️', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  museum:      { icon: '🏺', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  food:        { icon: '🍽️', color: '#f97316', bg: 'rgba(249,115,22,0.1)'  },
  breakfast:   { icon: '☕', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  lunch:       { icon: '🥗', color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  dinner:      { icon: '🍷', color: '#ec4899', bg: 'rgba(236,72,153,0.1)'  },
  leisure:     { icon: '🌿', color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  shopping:    { icon: '🛍️', color: '#ec4899', bg: 'rgba(236,72,153,0.1)'  },
  adventure:   { icon: '🧗', color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
  culture:     { icon: '🎭', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
  transport:   { icon: '🚌', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)'   },
  hotel:       { icon: '🏨', color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  beach:       { icon: '🏖️', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)'   },
  default:     { icon: '📍', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

function getCategoryConfig(category, activityName) {
  if (!category) {
    const name = (activityName || '').toLowerCase();
    if (name.includes('breakfast') || name.includes('coffee')) return CATEGORY_CONFIG.breakfast;
    if (name.includes('lunch'))  return CATEGORY_CONFIG.lunch;
    if (name.includes('dinner')) return CATEGORY_CONFIG.dinner;
    return CATEGORY_CONFIG.default;
  }
  const key = category.toLowerCase();
  // auto-detect meal type from category "food"
  return CATEGORY_CONFIG[key] || CATEGORY_CONFIG.default;
}

// Legacy support: convert old morning/afternoon/evening format to activities array
function normalizeDay(day) {
  if (day.activities && day.activities.length > 0) return day.activities;
  const legacy = [];
  if (day.morning)   legacy.push({ time: '09:00', ...day.morning,   category: 'sightseeing' });
  if (day.afternoon) legacy.push({ time: '13:00', ...day.afternoon, category: 'sightseeing' });
  if (day.evening)   legacy.push({ time: '19:00', ...day.evening,   category: 'food' });
  return legacy;
}

export default function ItineraryTab({ itinerary, tripId, destination }) {
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`roamly:${tripId}:notes`) || '{}'); } catch { return {}; }
  });
  const [openNote, setOpenNote] = useState(null);
  const [expanded, setExpanded] = useState({});

  function updateNote(day, value) {
    setNotes(prev => {
      const next = { ...prev, [day]: value };
      localStorage.setItem(`roamly:${tripId}:notes`, JSON.stringify(next));
      return next;
    });
  }

  function toggleExpand(dayNum) {
    setExpanded(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  }

  function mapsUrl(location) {
    const q = encodeURIComponent(location + (destination ? ', ' + destination : ''));
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }

  function foodUrl(location) {
    const q = encodeURIComponent('restaurants near ' + location + (destination ? ', ' + destination : ''));
    return `https://www.google.com/maps/search/${q}/`;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {itinerary.dailyItinerary?.map(day => {
        const activities = normalizeDay(day);
        const isOpen = expanded[day.day] !== false; // default open

        return (
          <div key={day.day} className="glass-card rounded-2xl overflow-hidden">
            {/* Day header */}
            <button
              onClick={() => toggleExpand(day.day)}
              className="w-full px-6 py-4 flex items-center justify-between flex-wrap gap-2 text-left"
              style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))', borderBottom: isOpen ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                  {day.day}
                </span>
                <div>
                  <div className="font-bold text-white">{day.theme}</div>
                  <div className="text-white/30 text-xs mt-0.5">{activities.length} activities · {day.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={e => { e.stopPropagation(); setOpenNote(openNote === day.day ? null : day.day); }}
                  className="text-xs px-3 py-1 rounded-full transition-all"
                  style={notes[day.day]
                    ? { background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }
                  }>
                  {notes[day.day] ? '📝 Note' : '+ Note'}
                </button>
                <span className="text-white/30 text-sm">{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Timeline */}
            {isOpen && (
              <div className="px-4 py-4">
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[44px] top-3 bottom-3 w-0.5 rounded-full"
                    style={{ background: 'linear-gradient(to bottom, rgba(124,58,237,0.4), rgba(6,182,212,0.2))' }} />

                  <div className="space-y-3">
                    {activities.map((act, idx) => {
                      const cfg = getCategoryConfig(act.category, act.activity);
                      const isLast = idx === activities.length - 1;
                      return (
                        <div key={idx} className="flex gap-4 items-start group">
                          {/* Time column */}
                          <div className="flex flex-col items-center flex-shrink-0 w-20">
                            <div className="text-xs font-bold text-white/50 tabular-nums">{act.time || ''}</div>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-base mt-1 z-10 relative transition-transform group-hover:scale-110"
                              style={{ background: cfg.bg, border: `2px solid ${cfg.color}40` }}>
                              {cfg.icon}
                            </div>
                            {!isLast && act.duration && (
                              <div className="text-xs text-white/20 mt-1 text-center leading-tight">{act.duration}</div>
                            )}
                          </div>

                          {/* Content card */}
                          <div className="flex-1 min-w-0 pb-2 rounded-xl p-4 transition-all group-hover:bg-white/3"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <div className="flex items-start justify-between gap-3 flex-wrap mb-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-white text-sm">{act.activity}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                                  style={{ background: cfg.bg, color: cfg.color }}>
                                  {act.category || 'activity'}
                                </span>
                              </div>
                              {act.estimatedCost && (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                                  style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                                  {act.estimatedCost}
                                </span>
                              )}
                            </div>

                            <p className="text-white/40 text-xs leading-relaxed mb-2">{act.description}</p>

                            {/* Location + quick links */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs flex items-center gap-1" style={{ color: '#6366f1' }}>
                                📍 {act.location}
                              </span>
                              <a href={mapsUrl(act.location)} target="_blank" rel="noopener noreferrer"
                                className="text-xs px-2 py-0.5 rounded-full transition-all hover:scale-105"
                                style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)' }}>
                                🗺️ Directions
                              </a>
                              {act.category !== 'transport' && (
                                <a href={foodUrl(act.location)} target="_blank" rel="noopener noreferrer"
                                  className="text-xs px-2 py-0.5 rounded-full transition-all hover:scale-105"
                                  style={{ background: 'rgba(249,115,22,0.1)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' }}>
                                  🍽️ Nearby Food
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                {openNote === day.day && (
                  <div className="mt-4 animate-fade-in">
                    <textarea
                      value={notes[day.day] || ''}
                      onChange={e => updateNote(day.day, e.target.value)}
                      placeholder="Add personal notes for this day — reservations, reminders, things to bring…"
                      rows={3}
                      className="input-glass w-full px-4 py-3 rounded-xl text-sm resize-none"
                      style={{ fontFamily: 'inherit' }}
                    />
                    <p className="text-white/20 text-xs mt-1.5">Saved automatically to your browser.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
