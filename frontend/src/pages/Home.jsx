import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import TripForm from '../components/TripForm';
import RecentTrips from '../components/RecentTrips';

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(formData) {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const result = await tripsApi.create(formData);
      navigate(`/trip/${result.data.id}`);
    } catch (err) {
      if (err.fields) setFieldErrors(err.fields);
      else setError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #080812 0%, #12082a 50%, #080d1e 100%)' }}>

      {/* Animated background orbs */}
      <div className="orb animate-float-slow" style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)', top: -200, left: -200 }} />
      <div className="orb animate-float" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)', top: '40%', right: -150, animationDelay: '-3s' }} />
      <div className="orb animate-float-slow" style={{ width: 350, height: 350, background: 'radial-gradient(circle, rgba(236,72,153,0.10), transparent 70%)', bottom: -100, left: '35%', animationDelay: '-6s' }} />

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(8,8,18,0.85)', backdropFilter: 'blur(16px)' }}>
          <div className="glass-card rounded-3xl p-12 text-center max-w-sm mx-4 animate-fade-in">
            <div className="text-7xl mb-5 animate-float">✈️</div>
            <h3 className="text-2xl font-bold text-white mb-3">Planning your trip…</h3>
            <p className="text-white/50 text-sm leading-relaxed">Our AI is crafting a personalized itinerary just for you. This takes about 10–20 seconds.</p>
            <div className="mt-8 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full animate-pulse" style={{ width: '70%', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 glass" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-pulse-glow" />
              <span className="text-3xl relative">🌍</span>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">Roamly</span>
              <span className="ml-3 text-xs text-white/30 font-medium">AI Travel Planner</span>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-white">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-white/40">{user.email}</div>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <button onClick={() => { logout(); navigate('/login'); }}
                className="text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-semibold text-cyan-300 animate-fade-in"
          style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          AI-powered itineraries in seconds
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 animate-slide-up">
          <span className="text-white">Your Dream</span>
          <br />
          <span className="gradient-text">Trip Awaits</span>
        </h1>

        <p className="text-white/50 text-lg mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Tell us where you want to go and your budget —<br className="hidden md:block" />
          we'll craft a perfect day-by-day itinerary using AI.
        </p>

        {/* Form */}
        <TripForm onSubmit={handleSubmit} loading={loading} fieldErrors={fieldErrors} />

        {error && (
          <div className="mt-5 p-4 rounded-2xl text-red-300 text-sm text-left animate-fade-in"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-16">
          {[
            { value: '50+', label: 'Destinations' },
            { value: 'AI', label: 'Powered' },
            { value: '∞', label: 'Adventures' },
          ].map(({ value, label }) => (
            <div key={label} className="glass rounded-2xl py-5 px-3">
              <div className="text-2xl font-black gradient-text">{value}</div>
              <div className="text-xs text-white/40 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent trips */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <RecentTrips />
      </div>
    </div>
  );
}
