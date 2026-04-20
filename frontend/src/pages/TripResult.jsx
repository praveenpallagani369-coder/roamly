import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tripsApi } from '../api/client';
import ItineraryDisplay from '../components/ItineraryDisplay';

export default function TripResult() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    tripsApi.getById(id)
      .then(res => setTrip(res.data))
      .catch(err => setError(err.message || 'Failed to load trip.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080812' }}>
      <div className="text-center animate-fade-in">
        <div className="text-7xl mb-5 animate-float">✈️</div>
        <p className="text-white/50 text-lg font-medium">Loading your itinerary…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#080812' }}>
      <div className="glass-card rounded-3xl p-10 text-center max-w-sm w-full animate-slide-up">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-white/60 text-sm mb-6">{error}</p>
        <Link to="/" className="btn-primary inline-block px-7 py-3 rounded-xl text-sm">
          <span>← Plan a New Trip</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #080812 0%, #12082a 50%, #080d1e 100%)' }}>
      {/* Background orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)', filter: 'blur(60px)' }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06), transparent 70%)', filter: 'blur(60px)' }} />

      {/* Header */}
      <header className="glass sticky top-0 z-20" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium group">
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
            New Trip
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌍</span>
            <span className="font-black text-white tracking-tight">Roamly</span>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {trip && <ItineraryDisplay trip={trip} />}
      </div>
    </div>
  );
}
