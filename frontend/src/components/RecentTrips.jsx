import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripsApi } from '../api/client';
import TiltCard from './TiltCard';

export default function RecentTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsApi.list()
      .then(res => setTrips(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || trips.length === 0) return null;

  return (
    <div className="mt-16 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40">Recent Trips</h3>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {trips.map((trip, i) => (
          <TiltCard key={trip.id} intensity={6}>
            <Link
              to={`/trip/${trip.id}`}
              className="block glass-card rounded-2xl p-5 group transition-all duration-300"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="text-3xl mb-3">🗺️</div>
              <h4 className="font-bold text-white group-hover:text-violet-300 transition-colors truncate">{trip.destination}</h4>
              <p className="text-xs text-white/40 mt-1.5">{trip.startDate} → {trip.endDate}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}>
                  ${trip.budget}
                </span>
                <span className="text-white/20 text-xs group-hover:text-violet-400 transition-colors">→</span>
              </div>
            </Link>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
