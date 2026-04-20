import { useState } from 'react';

const CATEGORY_META = {
  documents:   { icon: '📄', label: 'Documents & ID',    color: '#6366f1', bg: 'rgba(99,102,241,0.08)'  },
  clothing:    { icon: '👕', label: 'Clothing & Shoes',  color: '#ec4899', bg: 'rgba(236,72,153,0.08)'  },
  electronics: { icon: '🔋', label: 'Electronics',       color: '#06b6d4', bg: 'rgba(6,182,212,0.08)'   },
  health:      { icon: '💊', label: 'Health & Wellness', color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
  misc:        { icon: '🎒', label: 'Miscellaneous',     color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
};

export default function PackingTab({ itinerary, tripId }) {
  const pl = itinerary.packingList || {};

  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`roamly:${tripId}:packing`) || '{}'); } catch { return {}; }
  });

  // Custom items added by user: { documents: ['My item'], clothing: [] }
  const [custom, setCustom] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`roamly:${tripId}:packing_custom`) || '{}'); } catch { return {}; }
  });

  const [addingTo, setAddingTo]   = useState(null); // which category is open
  const [inputVal, setInputVal]   = useState('');

  function saveChecked(next) {
    setChecked(next);
    localStorage.setItem(`roamly:${tripId}:packing`, JSON.stringify(next));
  }

  function saveCustom(next) {
    setCustom(next);
    localStorage.setItem(`roamly:${tripId}:packing_custom`, JSON.stringify(next));
  }

  function toggleItem(cat, idx, item, isCustom) {
    const key = `${isCustom ? 'c' : 'a'}:${cat}:${idx}:${item}`;
    saveChecked({ ...checked, [key]: !checked[key] });
  }

  function isChecked(cat, idx, item, isCustom) {
    return !!checked[`${isCustom ? 'c' : 'a'}:${cat}:${idx}:${item}`];
  }

  function addCustomItem(cat) {
    const val = inputVal.trim();
    if (!val) return;
    const next = { ...custom, [cat]: [...(custom[cat] || []), val] };
    saveCustom(next);
    setInputVal('');
    setAddingTo(null);
  }

  function removeCustomItem(cat, idx) {
    const next = { ...custom, [cat]: (custom[cat] || []).filter((_, i) => i !== idx) };
    saveCustom(next);
    // also uncheck it
    const item = (custom[cat] || [])[idx];
    const key  = `c:${cat}:${idx}:${item}`;
    const nc   = { ...checked };
    delete nc[key];
    saveChecked(nc);
  }

  // Count totals
  let totalItems = 0, packedItems = 0;
  Object.keys({ ...pl, ...custom }).forEach(cat => {
    (pl[cat] || []).forEach((item, idx) => { totalItems++; if (isChecked(cat, idx, item, false)) packedItems++; });
    (custom[cat] || []).forEach((item, idx) => { totalItems++; if (isChecked(cat, idx, item, true)) packedItems++; });
  });
  const pct = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const allCats = [...new Set([...Object.keys(pl), ...Object.keys(custom)])];

  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div className="glass-card rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-white text-sm">Packing Progress</span>
          <span className="text-sm font-bold" style={{ color: pct === 100 ? '#10b981' : '#a78bfa' }}>
            {packedItems}/{totalItems} {pct === 100 ? '✅ All packed!' : 'items'}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : 'linear-gradient(90deg,#7c3aed,#06b6d4)' }} />
        </div>
        <p className="text-white/25 text-xs mt-2">Check off items as you pack. Add your own items with the + button.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {allCats.map(cat => {
          const meta        = CATEGORY_META[cat] || { icon: '📦', label: cat, color: '#94a3b8', bg: 'rgba(148,163,184,0.08)' };
          const aiItems     = pl[cat]     || [];
          const customItems = custom[cat] || [];
          const catTotal    = aiItems.length + customItems.length;
          const catPacked   =
            aiItems.filter((item, idx) => isChecked(cat, idx, item, false)).length +
            customItems.filter((item, idx) => isChecked(cat, idx, item, true)).length;

          return (
            <div key={cat} className="glass-card rounded-2xl overflow-hidden">
              {/* Category header */}
              <div className="px-5 py-4 flex items-center justify-between"
                style={{ background: meta.bg, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{meta.icon}</span>
                  <span className="font-bold text-white text-sm">{meta.label}</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${meta.color}20`, color: meta.color }}>
                  {catPacked}/{catTotal}
                </span>
              </div>

              <div className="p-4 space-y-1">
                {/* AI-generated items */}
                {aiItems.map((item, idx) => {
                  const done = isChecked(cat, idx, item, false);
                  return (
                    <button key={`a-${idx}`} onClick={() => toggleItem(cat, idx, item, false)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all hover:bg-white/5 group">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${done ? 'border-transparent' : 'border-white/20 group-hover:border-white/40'}`}
                        style={done ? { background: meta.color } : {}}>
                        {done && <span className="text-white text-xs font-black">✓</span>}
                      </div>
                      <span className={`text-sm transition-all ${done ? 'line-through text-white/25' : 'text-white/60 group-hover:text-white/80'}`}>{item}</span>
                    </button>
                  );
                })}

                {/* Custom items */}
                {customItems.map((item, idx) => {
                  const done = isChecked(cat, idx, item, true);
                  return (
                    <div key={`c-${idx}`} className="flex items-center gap-1 group">
                      <button onClick={() => toggleItem(cat, idx, item, true)}
                        className="flex-1 flex items-center gap-3 p-2.5 rounded-xl text-left transition-all hover:bg-white/5">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${done ? 'border-transparent' : 'border-white/20'}`}
                          style={done ? { background: meta.color } : {}}>
                          {done && <span className="text-white text-xs font-black">✓</span>}
                        </div>
                        <span className={`text-sm transition-all flex-1 ${done ? 'line-through text-white/25' : 'text-white/70'}`}>{item}</span>
                      </button>
                      {/* Custom label + delete */}
                      <span className="text-xs px-1.5 py-0.5 rounded-full mr-1 flex-shrink-0"
                        style={{ background: `${meta.color}15`, color: meta.color }}>custom</span>
                      <button onClick={() => removeCustomItem(cat, idx)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0 text-xs mr-1">
                        ✕
                      </button>
                    </div>
                  );
                })}

                {/* Add item input */}
                {addingTo === cat ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      autoFocus
                      type="text"
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addCustomItem(cat); if (e.key === 'Escape') { setAddingTo(null); setInputVal(''); } }}
                      placeholder="Type item and press Enter…"
                      className="input-glass flex-1 px-3 py-2 rounded-xl text-xs"
                    />
                    <button onClick={() => addCustomItem(cat)}
                      className="px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                      style={{ background: `${meta.color}20`, color: meta.color }}>
                      Add
                    </button>
                    <button onClick={() => { setAddingTo(null); setInputVal(''); }}
                      className="px-2 py-2 rounded-xl text-xs text-white/30 hover:text-white/60 transition-all">
                      ✕
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setAddingTo(cat); setInputVal(''); }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-xl text-left mt-1 transition-all hover:bg-white/5"
                    style={{ color: meta.color }}>
                    <span className="w-5 h-5 rounded-md border-2 border-dashed flex items-center justify-center text-xs flex-shrink-0"
                      style={{ borderColor: `${meta.color}50` }}>+</span>
                    <span className="text-xs font-medium opacity-60">Add your own item</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
