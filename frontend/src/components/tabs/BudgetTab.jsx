import { useState, useEffect, useRef } from 'react';

const META = {
  accommodation: { icon: '🏨', color: '#6366f1' },
  food:          { icon: '🍽️', color: '#f97316' },
  activities:    { icon: '🎯', color: '#10b981' },
  transport:     { icon: '🚌', color: '#06b6d4' },
  miscellaneous: { icon: '🎒', color: '#8b5cf6' },
};

function parseNum(val) {
  if (typeof val === 'number') return Math.round(val);
  return parseInt((String(val || '')).replace(/[^0-9.]/g, '')) || 0;
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    clearInterval(ref.current);
    const start = display;
    const diff  = value - start;
    const steps = 30;
    let i = 0;
    ref.current = setInterval(() => {
      i++;
      setDisplay(Math.round(start + diff * (i / steps)));
      if (i >= steps) clearInterval(ref.current);
    }, 16);
    return () => clearInterval(ref.current);
  }, [value]);

  return <>${display.toLocaleString()}</>;
}

export default function BudgetTab({ itinerary, budget }) {
  const [groupSize, setGroupSize] = useState(1);
  const bd = itinerary.budgetBreakdown || {};
  const totalNum = parseNum(bd.total) || budget;

  const entries = Object.entries(bd).filter(([k]) => k !== 'total');

  return (
    <div className="animate-fade-in max-w-xl">
      {/* Group size selector */}
      <div className="glass-card rounded-2xl p-5 mb-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-bold text-white text-sm">Travelling as a group?</div>
          <div className="text-white/30 text-xs mt-0.5">Divide costs per person</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGroupSize(g => Math.max(1, g - 1))}
            className="w-8 h-8 rounded-full font-bold text-white transition hover:scale-110 flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
          >−</button>
          <div className="text-center w-24">
            <span className="text-2xl font-black text-white">{groupSize}</span>
            <span className="text-white/30 text-xs ml-1">{groupSize === 1 ? 'person' : 'people'}</span>
          </div>
          <button
            onClick={() => setGroupSize(g => Math.min(20, g + 1))}
            className="w-8 h-8 rounded-full font-bold text-white transition hover:scale-110 flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
          >+</button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-white text-lg mb-6">
          Budget Breakdown
          {groupSize > 1 && <span className="ml-2 text-sm font-normal text-violet-300">· per person</span>}
        </h3>

        <div className="space-y-4">
          {entries.map(([key, value]) => {
            const meta    = META[key];
            const rawVal  = parseNum(value);
            const perHead = Math.round(rawVal / groupSize);
            const pct     = totalNum > 0 ? Math.round((rawVal / totalNum) * 100) : 0;
            return (
              <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{meta?.icon || '💸'}</span>
                    <span className="text-white/70 text-sm font-medium capitalize">{key}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white text-sm">
                      <AnimatedNumber value={perHead} />
                    </span>
                    {groupSize > 1 && <div className="text-white/25 text-xs">(total ${rawVal.toLocaleString()})</div>}
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: meta?.color || '#6366f1' }} />
                </div>
                <span className="text-xs text-white/20 mt-1 block">{pct}% of total budget</span>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between p-5 rounded-2xl mt-5"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))', border: '1px solid rgba(139,92,246,0.25)' }}>
          <div className="font-bold text-white flex items-center gap-2">
            💰 {groupSize > 1 ? 'Per Person' : 'Total'}
          </div>
          <div className="font-black text-2xl" style={{ background: 'linear-gradient(135deg,#a78bfa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <AnimatedNumber value={Math.round(totalNum / groupSize)} />
          </div>
        </div>
        <p className="text-white/20 text-xs mt-4">* Approximate estimates. Actual costs vary by season and availability.</p>
      </div>
    </div>
  );
}
