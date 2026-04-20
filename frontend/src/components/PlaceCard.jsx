import TiltCard from './TiltCard';

const CATEGORY = {
  museum:       { emoji: '🏛️', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  nature:       { emoji: '🌿', color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  food:         { emoji: '🍜', color: '#f97316', bg: 'rgba(249,115,22,0.1)'  },
  shopping:     { emoji: '🛍️', color: '#ec4899', bg: 'rgba(236,72,153,0.1)'  },
  adventure:    { emoji: '🧗', color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
  culture:      { emoji: '🎭', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
  beach:        { emoji: '🏖️', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)'   },
  history:      { emoji: '📜', color: '#d97706', bg: 'rgba(217,119,6,0.1)'   },
  architecture: { emoji: '🏰', color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  default:      { emoji: '📍', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

const BOOKABLE = ['museum', 'history', 'culture', 'architecture'];
const WATER    = ['beach', 'nature', 'adventure'];

export default function PlaceCard({ place, checked = false, onToggle, destination = '' }) {
  const cat   = CATEGORY[place.category?.toLowerCase()] || CATEGORY.default;
  const dest  = encodeURIComponent(destination || place.name);
  const query = encodeURIComponent(place.name + (destination ? ' ' + destination : ''));

  const actions = [
    {
      icon: '🗺️', label: 'Directions',
      url: `https://www.google.com/maps/dir/?api=1&destination=${query}`,
      color: '#06b6d4', bg: 'rgba(6,182,212,0.12)'
    },
    {
      icon: '🍽️', label: 'Restaurants',
      url: `https://www.google.com/maps/search/restaurants+near+${query}/`,
      color: '#f97316', bg: 'rgba(249,115,22,0.12)'
    },
    ...(BOOKABLE.includes(place.category?.toLowerCase()) ? [{
      icon: '🎟️', label: 'Book Tickets',
      url: `https://www.tiqets.com/en/search/#q=${query}`,
      color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)'
    }] : []),
    ...(WATER.includes(place.category?.toLowerCase()) ? [{
      icon: '⛵', label: 'Book Tours',
      url: `https://www.viator.com/search/${encodeURIComponent(place.name + ' tours')}`,
      color: '#0077b6', bg: 'rgba(0,119,182,0.12)'
    }] : []),
  ];

  return (
    <TiltCard intensity={7}>
      <div className={`glass-card rounded-2xl p-6 h-full group transition-all duration-300 relative flex flex-col ${checked ? 'opacity-70' : ''}`}
        style={checked ? { borderColor: 'rgba(16,185,129,0.3)' } : {}}>

        {/* Visit checkbox */}
        {onToggle && (
          <button onClick={onToggle}
            className="absolute top-4 right-4 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all z-10"
            style={checked ? { background: '#10b981', borderColor: '#10b981' } : { background: 'transparent', borderColor: 'rgba(255,255,255,0.2)' }}
            title={checked ? 'Mark as not visited' : 'Mark as visited'}>
            {checked && <span className="text-white text-xs font-black">✓</span>}
          </button>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: cat.bg, border: `1px solid ${cat.color}25` }}>
            {cat.emoji}
          </div>
          <div className={`flex-1 min-w-0 ${onToggle ? 'pr-8' : ''}`}>
            <h3 className={`font-bold text-base leading-snug ${checked ? 'line-through text-white/40' : 'text-white'}`}>
              {place.name}
            </h3>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
              style={{ background: cat.bg, color: cat.color }}>
              {place.category}
            </span>
          </div>
        </div>

        <p className="text-white/50 text-sm leading-relaxed mb-4 flex-1">{place.description}</p>

        <div className="flex items-center gap-3 text-xs flex-wrap mb-4">
          <span className="flex items-center gap-1.5 font-semibold" style={{ color: '#10b981' }}>💵 {place.estimatedCost}</span>
          <span className="text-white/20">·</span>
          <span className="text-white/40">⏱ {place.duration}</span>
        </div>

        {place.tips && (
          <div className="rounded-xl p-3 text-xs leading-relaxed mb-4"
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', color: '#fbbf24' }}>
            💡 {place.tips}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
          {actions.map(action => (
            <a key={action.label}
              href={action.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
              style={{ background: action.bg, color: action.color, border: `1px solid ${action.color}25` }}>
              {action.icon} {action.label}
            </a>
          ))}
        </div>

        {checked && (
          <div className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none"
            style={{ background: 'rgba(16,185,129,0.04)' }}>
            <span className="text-5xl opacity-20">✅</span>
          </div>
        )}
      </div>
    </TiltCard>
  );
}
