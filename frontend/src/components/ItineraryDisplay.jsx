import { useState, useEffect } from 'react';
import OverviewTab   from './tabs/OverviewTab';
import PlacesTab     from './tabs/PlacesTab';
import ItineraryTab  from './tabs/ItineraryTab';
import BudgetTab     from './tabs/BudgetTab';
import PackingTab    from './tabs/PackingTab';
import PhrasesTab    from './tabs/PhrasesTab';
import SafetyTab     from './tabs/SafetyTab';
import BookingTab    from './tabs/BookingTab';
import MapTab        from './tabs/MapTab';
import { exportItineraryPDF } from '../utils/exportPDF';

const TABS = [
  { id: 'overview',  label: 'Overview',    icon: '🗺️' },
  { id: 'map',       label: 'Map',         icon: '📌' },
  { id: 'places',    label: 'Top Places',  icon: '📍' },
  { id: 'itinerary', label: 'Day by Day',  icon: '📅' },
  { id: 'budget',    label: 'Budget',      icon: '💰' },
  { id: 'booking',   label: 'Book & Plan', icon: '🎫' },
  { id: 'packing',   label: 'Packing',     icon: '🎒' },
  { id: 'phrases',   label: 'Phrases',     icon: '🗣️' },
  { id: 'safety',    label: 'Safety',      icon: '🛡️' },
];

export default function ItineraryDisplay({ trip }) {
  const [activeTab, setActiveTab]   = useState('overview');
  const [scrollPct, setScrollPct]   = useState(0);
  const [showTop, setShowTop]       = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const { itinerary, startDate, endDate, budget, interests, id: tripId } = trip;
  const numDays     = itinerary.dailyItinerary?.length ?? 0;
  const destination = trip.destination || itinerary.destination;

  useEffect(() => {
    function onScroll() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0);
      setShowTop(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    } catch {}
  }

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50 pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div className="h-full transition-all duration-150"
          style={{ width: `${scrollPct}%`, background: 'linear-gradient(90deg,#7c3aed,#06b6d4,#ec4899)' }} />
      </div>

      {/* Share toast */}
      {shareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-2xl animate-slide-up"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', boxShadow: '0 10px 40px rgba(124,58,237,0.4)' }}>
          🔗 Link copied to clipboard!
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Hero card */}
        <div className="relative rounded-3xl overflow-hidden mb-8 animate-slide-up"
          style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0c1635 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 left-1/4 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)', filter: 'blur(40px)' }} />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-wrap gap-6 justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold text-emerald-300"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  ✅ Itinerary Ready
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">{itinerary.destination}</h1>
                <p className="text-white/50 text-base leading-relaxed max-w-2xl">{itinerary.overview}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-4xl font-black gradient-text">${budget.toLocaleString()}</div>
                <div className="text-white/30 text-xs mt-1 font-medium uppercase tracking-wider">Total Budget</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-7">
              {[
                { icon: '📅', text: `${startDate} → ${endDate}` },
                { icon: '🌟', text: `${numDays} day${numDays !== 1 ? 's' : ''}` },
                ...(interests ? [{ icon: '❤️', text: interests }] : []),
                ...(itinerary.countryInfo?.currency ? [{ icon: '💱', text: itinerary.countryInfo.currency }] : []),
                ...(itinerary.visaInfo?.type ? [{ icon: '🛂', text: itinerary.visaInfo.type }] : []),
              ].map(({ icon, text }) => (
                <span key={text} className="flex items-center gap-2 text-sm text-white/50 px-4 py-2 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {icon} {text}
                </span>
              ))}
            </div>

            <div className="flex gap-3 mt-5 flex-wrap">
              <button onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
                🔗 Share Trip
              </button>
              <button onClick={() => { try { exportItineraryPDF(trip); } catch(e) { alert('PDF export failed: ' + e.message); } }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', color: '#67e8f9' }}>
                📄 Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-fade-in" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`tab-pill flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm flex-shrink-0 ${activeTab === tab.id ? 'active' : ''}`}>
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview'  && <OverviewTab   itinerary={itinerary} />}
        {activeTab === 'map'       && <MapTab        itinerary={itinerary} />}
        {activeTab === 'places'    && <PlacesTab     itinerary={itinerary} tripId={tripId} destination={destination} />}
        {activeTab === 'itinerary' && <ItineraryTab  itinerary={itinerary} tripId={tripId} destination={destination} />}
        {activeTab === 'budget'    && <BudgetTab     itinerary={itinerary} budget={budget} />}
        {activeTab === 'booking'   && <BookingTab    itinerary={itinerary} trip={trip} />}
        {activeTab === 'packing'   && <PackingTab    itinerary={itinerary} tripId={tripId} />}
        {activeTab === 'phrases'   && <PhrasesTab    itinerary={itinerary} />}
        {activeTab === 'safety'    && <SafetyTab     itinerary={itinerary} />}
      </div>

      {/* Back to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-2xl transition-all hover:scale-110 animate-fade-in z-40"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}>
          ↑
        </button>
      )}
    </>
  );
}
