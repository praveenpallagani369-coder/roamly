import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon path issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DAY_COLORS = [
  '#7c3aed', '#06b6d4', '#10b981', '#f59e0b',
  '#ec4899', '#ef4444', '#8b5cf6', '#3b82f6',
  '#84cc16', '#f97316',
];

function createDayIcon(color, label) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};color:#fff;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid rgba(255,255,255,0.85);box-shadow:0 2px 10px rgba(0,0,0,0.5);cursor:pointer">${label}</div>`,
    iconSize:   [30, 30],
    iconAnchor: [15, 15],
    popupAnchor:[0, -18],
  });
}

// Fit map bounds whenever the visible points change
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [map, points]);
  return null;
}

export default function MapTab({ itinerary }) {
  const [selectedDay, setSelectedDay] = useState(0); // 0 = all days

  const allPoints = useMemo(() => {
    if (!itinerary?.dailyItinerary) return [];
    return itinerary.dailyItinerary.flatMap((day, dayIdx) =>
      (day.activities || [])
        .filter(act => act.lat && act.lng && act.category !== 'transport')
        .map(act => ({
          ...act,
          dayNum:  day.day,
          dayIdx,
          color:   DAY_COLORS[dayIdx % DAY_COLORS.length],
        }))
    );
  }, [itinerary]);

  const visiblePoints = selectedDay === 0
    ? allPoints
    : allPoints.filter(p => p.dayNum === selectedDay);

  const days = itinerary?.dailyItinerary || [];

  if (allPoints.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center animate-fade-in">
        <div className="text-5xl mb-4">🗺️</div>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          Map view is available for trips generated with the new AI engine.
          Plan a new trip to see your itinerary plotted on an interactive map.
        </p>
      </div>
    );
  }

  const defaultCenter = [allPoints[0].lat, allPoints[0].lng];

  return (
    <div className="animate-fade-in space-y-4">

      {/* Day filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSelectedDay(0)}
          className="px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-all"
          style={selectedDay === 0
            ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff' }
            : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
          All Days
        </button>
        {days.map((day, i) => {
          const color  = DAY_COLORS[i % DAY_COLORS.length];
          const active = selectedDay === day.day;
          const count  = allPoints.filter(p => p.dayNum === day.day).length;
          if (count === 0) return null;
          return (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day.day)}
              className="px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-all"
              style={active
                ? { background: color, color: '#fff' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
              Day {day.day}
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <MapContainer
          center={defaultCenter}
          zoom={12}
          style={{ height: 520, width: '100%' }}
          scrollWheelZoom>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <FitBounds points={visiblePoints} />
          {visiblePoints.map((pt, idx) => (
            <Marker
              key={`${pt.dayNum}-${idx}`}
              position={[pt.lat, pt.lng]}
              icon={createDayIcon(pt.color, pt.dayNum)}>
              <Popup>
                <div style={{ minWidth: 200, fontFamily: 'system-ui, sans-serif' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: pt.color }}>
                    Day {pt.dayNum}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{pt.activity}</div>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>📍 {pt.location}</div>
                  {pt.time         && <div style={{ fontSize: 12 }}>⏰ {pt.time}</div>}
                  {pt.duration     && <div style={{ fontSize: 12 }}>⏱ {pt.duration}</div>}
                  {pt.estimatedCost && <div style={{ fontSize: 12 }}>💰 {pt.estimatedCost}</div>}
                  {pt.description  && <div style={{ fontSize: 11, color: '#777', marginTop: 6, lineHeight: 1.4 }}>{pt.description}</div>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {days.map((day, i) => {
          const color = DAY_COLORS[i % DAY_COLORS.length];
          const count = allPoints.filter(p => p.dayNum === day.day).length;
          if (count === 0) return null;
          return (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day.day === selectedDay ? 0 : day.day)}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${day.day === selectedDay ? color : 'rgba(255,255,255,0.08)'}`, color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
              Day {day.day} — {day.theme} · {count} stop{count !== 1 ? 's' : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
}
