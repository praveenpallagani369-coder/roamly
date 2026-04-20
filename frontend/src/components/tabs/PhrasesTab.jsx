import { useState } from 'react';

const CATEGORY_META = {
  greeting:  { icon: '👋', label: 'Greetings',     color: '#06b6d4' },
  transport: { icon: '🚌', label: 'Getting Around', color: '#8b5cf6' },
  food:      { icon: '🍜', label: 'Food & Dining',  color: '#f97316' },
  shopping:  { icon: '🛍️', label: 'Shopping',       color: '#ec4899' },
  emergency: { icon: '🆘', label: 'Emergency',       color: '#ef4444' },
};

export default function PhrasesTab({ itinerary }) {
  const [copied, setCopied] = useState(null);
  const phrases = itinerary.keyPhrases ?? [];

  async function copyPhrase(text, id) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  }

  const grouped = phrases.reduce((acc, p) => {
    const cat = p.category || 'greeting';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  if (!phrases.length) return (
    <div className="text-center py-16 text-white/30 animate-fade-in">
      <div className="text-4xl mb-3">🗣️</div>
      <p>Language phrases not available for this trip.</p>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-5">
      <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
        <span className="text-2xl">💬</span>
        <p className="text-white/50 text-sm leading-relaxed">
          Tap any phrase to copy it to your clipboard. Use them offline — no internet needed!
        </p>
      </div>

      {Object.entries(grouped).map(([cat, items]) => {
        const meta = CATEGORY_META[cat] || { icon: '💬', label: cat, color: '#94a3b8' };
        return (
          <div key={cat} className="glass-card rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 flex items-center gap-2.5"
              style={{ background: `${meta.color}12`, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-lg">{meta.icon}</span>
              <span className="font-bold text-white text-sm">{meta.label}</span>
            </div>
            <div className="divide-y divide-white/5">
              {items.map((phrase, i) => {
                const id = `${cat}:${i}`;
                const isCopied = copied === id;
                return (
                  <button
                    key={i}
                    onClick={() => copyPhrase(phrase.local, id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/3 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-white/40 text-xs mb-1">{phrase.english}</div>
                      <div className="text-white font-semibold text-base">{phrase.local}</div>
                      {phrase.pronunciation && (
                        <div className="text-xs mt-0.5 italic" style={{ color: meta.color }}>
                          /{phrase.pronunciation}/
                        </div>
                      )}
                    </div>
                    <div className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      isCopied ? 'text-white' : 'text-white/30 group-hover:text-white/60'
                    }`}
                      style={isCopied ? { background: `${meta.color}30`, color: meta.color } : { background: 'rgba(255,255,255,0.05)' }}>
                      {isCopied ? '✅ Copied!' : '📋 Copy'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
