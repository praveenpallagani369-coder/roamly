import TiltCard from '../TiltCard';

const OUTLET_EMOJI = { A: '🔌', B: '🔌', C: '🔌', E: '🔌', G: '🔌' };

export default function OverviewTab({ itinerary }) {
  const ci = itinerary.countryInfo;
  const we = itinerary.weatherExpectation;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Country Info */}
      {ci && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-white text-base mb-5 flex items-center gap-2">🌍 Country at a Glance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { icon: '💱', label: 'Currency',    value: ci.currency },
              { icon: '📈', label: 'Exchange',    value: ci.exchangeRate },
              { icon: '🗣️', label: 'Language',    value: ci.officialLanguage },
              { icon: '🕐', label: 'Timezone',    value: ci.timezone },
              { icon: '🔌', label: 'Power',       value: ci.powerOutlet },
              { icon: '🚗', label: 'Drive On',    value: ci.drivingSide === 'left' ? 'Left side' : 'Right side' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-xl mb-1.5">{icon}</div>
                <div className="text-xs text-white/30 font-medium mb-0.5">{label}</div>
                <div className="text-white text-xs font-semibold leading-snug">{value}</div>
              </div>
            ))}
          </div>
          {ci.tippingCustoms && (
            <div className="mt-4 p-4 rounded-xl text-sm" style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.15)', color: '#fbbf24' }}>
              💡 <strong>Tipping:</strong> {ci.tippingCustoms}
            </div>
          )}
        </div>
      )}

      {/* Weather */}
      {we && (
        <TiltCard intensity={4}>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">🌤️ Expected Weather During Your Trip</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { icon: '🌡️', label: 'Temperature', value: we.tempRangeC },
                { icon: '☁️', label: 'Condition',   value: we.condition  },
                { icon: '💧', label: 'Humidity',    value: we.humidity   },
                { icon: '🌧️', label: 'Rainfall',    value: we.rainfall   },
              ].map(({ icon, label, value }) => (
                <div key={label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.12)' }}>
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-xs text-white/30 mb-1">{label}</div>
                  <div className="text-white text-xs font-semibold">{value}</div>
                </div>
              ))}
            </div>
            {we.advice && (
              <p className="text-white/50 text-sm leading-relaxed">👕 <strong className="text-white/70">What to wear:</strong> {we.advice}</p>
            )}
          </div>
        </TiltCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TiltCard intensity={4}>
          <div className="glass-card rounded-2xl p-6 h-full">
            <h3 className="font-bold text-white text-base mb-3">🚌 Getting Around</h3>
            <p className="text-white/50 text-sm leading-relaxed">{itinerary.gettingAround}</p>
          </div>
        </TiltCard>
        <TiltCard intensity={4}>
          <div className="glass-card rounded-2xl p-6 h-full">
            <h3 className="font-bold text-white text-base mb-3">📅 Best Time to Visit</h3>
            <p className="text-white/50 text-sm leading-relaxed">{itinerary.bestTimeToVisit}</p>
          </div>
        </TiltCard>
      </div>

      {/* Local cuisine */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-4">🍽️ Local Cuisine to Try</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {itinerary.localCuisine?.map((item, i) => (
            <TiltCard key={i} intensity={5}>
              <div className="rounded-xl p-4 h-full" style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.15)' }}>
                <div className="text-2xl mb-2">🍜</div>
                <div className="font-semibold text-white text-sm">{typeof item === 'string' ? item : item.name}</div>
                {item.description && <div className="text-white/40 text-xs mt-1 leading-relaxed">{item.description}</div>}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
