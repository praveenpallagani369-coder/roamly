import { useState } from 'react';

const INTERESTS = [
  { label: 'History & Culture', emoji: '🏛️' },
  { label: 'Food & Cuisine',    emoji: '🍜' },
  { label: 'Nature & Outdoors', emoji: '🌿' },
  { label: 'Adventure Sports',  emoji: '🧗' },
  { label: 'Art & Museums',     emoji: '🎨' },
  { label: 'Shopping',          emoji: '🛍️' },
  { label: 'Nightlife',         emoji: '🌙' },
  { label: 'Beaches',           emoji: '🏖️' },
  { label: 'Architecture',      emoji: '🏰' },
  { label: 'Photography',       emoji: '📸' },
];

export default function TripForm({ onSubmit, loading, fieldErrors = {} }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ destination: '', startDate: '', endDate: '', budget: '', interests: [] });

  function set(field, value) { setForm(p => ({ ...p, [field]: value })); }

  function toggleInterest(label) {
    setForm(p => ({
      ...p,
      interests: p.interests.includes(label) ? p.interests.filter(i => i !== label) : [...p.interests, label]
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, interests: form.interests.length > 0 ? form.interests.join(', ') : null });
  }

  const labelCls = 'block text-xs font-semibold uppercase tracking-widest mb-2 text-violet-300';
  const inputCls = (field) => `input-glass w-full px-4 py-3.5 rounded-xl text-sm ${fieldErrors[field] ? 'error' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-8 text-left shadow-2xl animate-slide-up">

      {/* Row 1: Destination */}
      <div className="mb-6">
        <label className={labelCls}>
          <span className="mr-2">📍</span>Destination <span className="text-red-400 ml-1">*</span>
        </label>
        <input
          type="text"
          value={form.destination}
          onChange={e => set('destination', e.target.value)}
          placeholder="Paris, France  ·  Tokyo, Japan  ·  Bali, Indonesia"
          className={inputCls('destination')}
          required
        />
        {fieldErrors.destination && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.destination}</p>}
      </div>

      {/* Row 2: Dates */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className={labelCls}><span className="mr-2">🛫</span>Departure <span className="text-red-400">*</span></label>
          <input
            type="date"
            value={form.startDate}
            onChange={e => set('startDate', e.target.value)}
            min={today}
            className={inputCls('startDate')}
            required
          />
          {fieldErrors.startDate && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.startDate}</p>}
        </div>
        <div>
          <label className={labelCls}><span className="mr-2">🛬</span>Return <span className="text-red-400">*</span></label>
          <input
            type="date"
            value={form.endDate}
            onChange={e => set('endDate', e.target.value)}
            min={form.startDate || today}
            className={inputCls('endDate')}
            required
          />
          {fieldErrors.endDate && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.endDate}</p>}
        </div>
      </div>

      {/* Row 3: Budget */}
      <div className="mb-6">
        <label className={labelCls}><span className="mr-2">💰</span>Total Budget (USD) <span className="text-red-400">*</span></label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 font-bold text-base select-none">$</span>
          <input
            type="number"
            value={form.budget}
            onChange={e => set('budget', e.target.value)}
            placeholder="2000"
            min="1"
            className={`${inputCls('budget')} pl-8`}
            required
          />
        </div>
        {fieldErrors.budget && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.budget}</p>}
      </div>

      {/* Row 4: Interests */}
      <div className="mb-8">
        <label className={labelCls}>
          <span className="mr-2">✨</span>Your Interests
          <span className="ml-2 normal-case font-normal text-white/30 tracking-normal">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(({ label, emoji }) => {
            const active = form.interests.includes(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleInterest(label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg scale-105'
                    : 'bg-white/5 text-white/50 border border-white/10 hover:border-violet-400/50 hover:text-white/80'
                }`}
              >
                <span>{emoji}</span> {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-50 disabled:cursor-not-allowed">
        <span className="flex items-center justify-center gap-3">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Crafting your itinerary… (10–20s)
            </>
          ) : (
            <>✈️ &nbsp; Generate My Itinerary</>
          )}
        </span>
      </button>
    </form>
  );
}
