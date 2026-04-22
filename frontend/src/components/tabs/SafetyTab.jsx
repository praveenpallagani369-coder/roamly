import TiltCard from '../TiltCard';

const RATING_CONFIG = {
  5: { label: 'Very Safe',       color: '#10b981', bg: 'rgba(16,185,129,0.12)',  bar: '#10b981' },
  4: { label: 'Safe',            color: '#10b981', bg: 'rgba(16,185,129,0.12)',  bar: '#10b981' },
  3: { label: 'Moderate',        color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  bar: '#f59e0b' },
  2: { label: 'Exercise Caution',color: '#f97316', bg: 'rgba(249,115,22,0.12)',  bar: '#f97316' },
  1: { label: 'High Risk',       color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   bar: '#ef4444' },
};

export default function SafetyTab({ itinerary }) {
  const hs  = itinerary.healthSafety     || {};
  const ec  = itinerary.emergencyContacts || {};
  const vi  = itinerary.visaInfo         || {};
  const rating = Math.min(5, Math.max(1, parseInt(hs.safetyRating) || 4));
  const vaccinations = Array.isArray(hs.vaccinations) ? hs.vaccinations : [];
  const commonScams  = Array.isArray(hs.commonScams)  ? hs.commonScams  : [];
  const safetyTips   = Array.isArray(hs.safetyTips)   ? hs.safetyTips   : [];
  const rcfg = RATING_CONFIG[rating] || RATING_CONFIG[4];

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Safety rating */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-4">🛡️ Safety Overview</h3>
        <div className="flex items-center gap-5 mb-5">
          <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
            style={{ background: rcfg.bg, border: `1px solid ${rcfg.color}30` }}>
            <span className="text-3xl font-black" style={{ color: rcfg.color }}>{rating}</span>
            <span className="text-xs font-bold" style={{ color: rcfg.color }}>/5</span>
          </div>
          <div>
            <div className="font-bold text-white text-lg">{rcfg.label}</div>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4,5].map(n => (
                <div key={n} className="h-2 w-8 rounded-full transition-all"
                  style={{ background: n <= rating ? rcfg.bar : 'rgba(255,255,255,0.08)' }} />
              ))}
            </div>
          </div>
        </div>
        {hs.healthcareNote && (
          <p className="text-white/50 text-sm leading-relaxed p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            🏥 {hs.healthcareNote}
          </p>
        )}
      </div>

      {/* Emergency contacts */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-4">🆘 Emergency Contacts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: '🔴', label: 'General',   value: ec.general   || '112' },
            { icon: '👮', label: 'Police',    value: ec.police    || 'N/A' },
            { icon: '🚑', label: 'Ambulance', value: ec.ambulance || 'N/A' },
            { icon: '🚒', label: 'Fire',      value: ec.fire      || 'N/A' },
            ...(ec.touristHelpline ? [{ icon: '🌐', label: 'Tourist Helpline', value: ec.touristHelpline }] : []),
          ].map(({ icon, label, value }) => (
            <div key={label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-white font-black text-lg leading-none">{value}</div>
              <div className="text-white/30 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-white/20 text-xs mt-4">Save these numbers in your phone before travelling. 112 works in most countries.</p>
      </div>

      {/* Health grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Vaccinations */}
        {vaccinations.length > 0 && (
          <TiltCard intensity={4}>
            <div className="glass-card rounded-2xl p-6 h-full">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">💉 Recommended Vaccinations</h3>
              <div className="space-y-2">
                {vaccinations.map((v, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-white/50">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span> {v}
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        )}

        {/* Water safety */}
        <TiltCard intensity={4}>
          <div className="glass-card rounded-2xl p-6 h-full">
            <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">💧 Water Safety</h3>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-3 ${hs.waterSafe ? 'text-emerald-300' : 'text-red-300'}`}
              style={{ background: hs.waterSafe ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${hs.waterSafe ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              {hs.waterSafe ? '✅ Tap water is safe' : '⚠️ Avoid tap water'}
            </div>
            {!hs.waterSafe && <p className="text-white/40 text-xs">Stick to bottled or filtered water. Avoid ice in drinks at local restaurants.</p>}
          </div>
        </TiltCard>
      </div>

      {/* Common scams */}
      {commonScams.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">⚠️ Common Scams to Watch Out For</h3>
          <div className="space-y-3">
            {commonScams.map((scam, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}>
                <span className="text-yellow-400 flex-shrink-0 mt-0.5">⚠️</span>
                <span className="text-white/60">{scam}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety tips */}
      {safetyTips.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">✅ Safety Tips</h3>
          <div className="space-y-2.5">
            {safetyTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                <span className="text-white/60 leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visa info */}
      {vi.type && (
        <TiltCard intensity={3}>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">🛂 Visa Information</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <div className="text-white/30 text-xs mb-1">Visa Required</div>
                <span className={`font-bold text-sm px-3 py-1 rounded-full ${vi.required ? 'text-red-300' : 'text-emerald-300'}`}
                  style={{ background: vi.required ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)' }}>
                  {vi.required ? 'Yes' : 'Not Required'}
                </span>
              </div>
              <div>
                <div className="text-white/30 text-xs mb-1">Type</div>
                <span className="font-semibold text-white/80 text-sm">{vi.type}</span>
              </div>
              <div>
                <div className="text-white/30 text-xs mb-1">Duration</div>
                <span className="font-semibold text-white/80 text-sm">{vi.duration}</span>
              </div>
              <div>
                <div className="text-white/30 text-xs mb-1">Cost</div>
                <span className="font-semibold text-emerald-400 text-sm">{vi.cost}</span>
              </div>
            </div>
            {vi.notes && <p className="text-white/40 text-xs leading-relaxed p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>📌 {vi.notes}</p>}
          </div>
        </TiltCard>
      )}
    </div>
  );
}
