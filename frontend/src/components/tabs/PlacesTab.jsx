import { useState } from 'react';
import PlaceCard from '../PlaceCard';

export default function PlacesTab({ itinerary, tripId, destination }) {
  const [search, setSearch] = useState('');
  const [visited, setVisited] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`roamly:${tripId}:visited`) || '{}'); }
    catch { return {}; }
  });

  function toggleVisited(name) {
    setVisited(prev => {
      const next = { ...prev, [name]: !prev[name] };
      localStorage.setItem(`roamly:${tripId}:visited`, JSON.stringify(next));
      return next;
    });
  }

  const places = itinerary.topPlaces ?? [];
  const filtered = places.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );
  const visitedCount = places.filter(p => visited[p.name]).length;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or category…"
            className="input-glass w-full pl-10 pr-4 py-3 rounded-xl text-sm"
          />
        </div>
        {visitedCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold flex-shrink-0"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>
            ✅ {visitedCount}/{places.length} visited
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <div className="text-4xl mb-3">🔍</div>
          <p>No places match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtered.map((place, i) => (
            <PlaceCard
              key={i}
              place={place}
              destination={destination}
              checked={!!visited[place.name]}
              onToggle={() => toggleVisited(place.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
