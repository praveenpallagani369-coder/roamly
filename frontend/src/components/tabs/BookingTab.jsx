import TiltCard from '../TiltCard';

function buildLinks(destination, startDate, endDate) {
  const dest     = encodeURIComponent(destination);
  const destRaw  = destination;
  const cin      = startDate;
  const cout     = endDate;

  return {
    flights: [
      { name: 'Google Flights', icon: '✈️', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',    url: `https://www.google.com/travel/flights?q=flights+to+${dest}` },
      { name: 'Skyscanner',     icon: '🔍', color: '#00a6e8', bg: 'rgba(0,166,232,0.1)',    url: `https://www.skyscanner.com/transport/flights/anywhere/anywhere/?query=${dest}` },
      { name: 'Kayak',          icon: '🛫', color: '#ff690f', bg: 'rgba(255,105,15,0.1)',   url: `https://www.kayak.com/flights/anywhere-${dest}/${cin}/${cout}` },
      { name: 'Expedia',        icon: '🌐', color: '#f9c23c', bg: 'rgba(249,194,60,0.1)',   url: `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:Anywhere,to:${dest},departure:${cin}` },
    ],
    hotels: [
      { name: 'Booking.com',    icon: '🏨', color: '#003580', bg: 'rgba(0,53,128,0.15)',    url: `https://www.booking.com/search.html?ss=${dest}&checkin=${cin}&checkout=${cout}` },
      { name: 'Hotels.com',     icon: '🛏️', color: '#e8272a', bg: 'rgba(232,39,42,0.1)',   url: `https://www.hotels.com/search.do?destination=${dest}&startDate=${cin}&endDate=${cout}` },
      { name: 'Airbnb',         icon: '🏠', color: '#ff5a5f', bg: 'rgba(255,90,95,0.1)',    url: `https://www.airbnb.com/s/${dest}/homes?checkin=${cin}&checkout=${cout}` },
      { name: 'Hostelworld',    icon: '🛖', color: '#f60', bg: 'rgba(255,102,0,0.1)',       url: `https://www.hostelworld.com/search?search_keywords=${dest}&dateFrom=${cin}&dateTo=${cout}` },
    ],
    carRental: [
      { name: 'Rentalcars',     icon: '🚗', color: '#e63946', bg: 'rgba(230,57,70,0.1)',    url: `https://www.rentalcars.com/en/pickupplace/${dest}/?adplat=google` },
      { name: 'Kayak Cars',     icon: '🔑', color: '#ff690f', bg: 'rgba(255,105,15,0.1)',   url: `https://www.kayak.com/cars/${dest}/${cin}/${cout}` },
      { name: 'Enterprise',     icon: '🏢', color: '#006747', bg: 'rgba(0,103,71,0.12)',    url: `https://www.enterprise.com/en/car-rental/locations.html?googleq=${dest}` },
      { name: 'Hertz',          icon: '🟡', color: '#f7b500', bg: 'rgba(247,181,0,0.1)',    url: `https://www.hertz.com/rentacar/reservation/?targetPage=reservationStart&formAction=insertReservation&from=${dest}` },
    ],
    tours: [
      { name: 'Viator',         icon: '🎯', color: '#139246', bg: 'rgba(19,146,70,0.1)',    url: `https://www.viator.com/search/${dest}` },
      { name: 'GetYourGuide',   icon: '🗺️', color: '#ff5533', bg: 'rgba(255,85,51,0.1)',    url: `https://www.getyourguide.com/s/?q=${dest}` },
      { name: 'Klook',          icon: '🎪', color: '#ff5722', bg: 'rgba(255,87,34,0.1)',    url: `https://www.klook.com/en-US/search/?query=${dest}` },
      { name: 'Airbnb Exp.',    icon: '🌟', color: '#ff5a5f', bg: 'rgba(255,90,95,0.1)',    url: `https://www.airbnb.com/s/${dest}/experiences` },
    ],
    boats: [
      { name: 'Viator Boats',   icon: '⛵', color: '#0077b6', bg: 'rgba(0,119,182,0.1)',    url: `https://www.viator.com/search/${dest}+boat+tours` },
      { name: 'GetYourGuide',   icon: '🚤', color: '#ff5533', bg: 'rgba(255,85,51,0.1)',    url: `https://www.getyourguide.com/s/?q=${dest}+boat+tour` },
      { name: 'Airbnb Water',   icon: '🌊', color: '#48cae4', bg: 'rgba(72,202,228,0.1)',   url: `https://www.airbnb.com/s/${dest}/experiences?refinement_paths%5B%5D=%2Fexperiences%2Fwater` },
    ],
    tickets: [
      { name: 'Tiqets',         icon: '🎟️', color: '#8338ec', bg: 'rgba(131,56,236,0.1)',  url: `https://www.tiqets.com/en/search/#q=${dest}` },
      { name: 'Viator Tickets', icon: '🏛️', color: '#139246', bg: 'rgba(19,146,70,0.1)',   url: `https://www.viator.com/search/${dest}+museum+tickets` },
      { name: 'Headout',        icon: '🎫', color: '#f6511d', bg: 'rgba(246,81,29,0.1)',    url: `https://www.headout.com/tour/#searchQuery=${dest}` },
    ],
  };
}

const SECTIONS = [
  { key: 'flights',   icon: '✈️', title: 'Flights',              desc: 'Find the best fares to get there'                   },
  { key: 'hotels',    icon: '🏨', title: 'Hotels & Motels',       desc: 'Compare accommodation options'                     },
  { key: 'carRental', icon: '🚗', title: 'Car Rental',            desc: 'Explore at your own pace'                          },
  { key: 'tours',     icon: '🎯', title: 'Tours & Activities',    desc: 'Guided experiences and day trips'                  },
  { key: 'boats',     icon: '⛵', title: 'Boat Tours & Water',    desc: 'Water activities and cruises'                      },
  { key: 'tickets',   icon: '🎟️', title: 'Museum & Attraction Tickets', desc: 'Pre-book to skip the queues'               },
];

export default function BookingTab({ itinerary, trip }) {
  const destination = trip.destination || itinerary.destination;
  const links = buildLinks(destination, trip.startDate, trip.endDate);

  // Places that likely need advance booking
  const bookablePlaces = (itinerary.topPlaces || []).filter(p =>
    ['museum', 'history', 'culture', 'architecture'].includes(p.category?.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header note */}
      <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div>
          <p className="text-white/70 text-sm leading-relaxed">
            All links open pre-filled with <strong className="text-white">{destination}</strong> and your travel dates. These are trusted third-party booking sites — always compare prices before booking.
          </p>
        </div>
      </div>

      {/* Booking sections */}
      {SECTIONS.map(section => (
        <div key={section.key} className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.1), transparent)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-2xl">{section.icon}</span>
            <div>
              <h3 className="font-bold text-white text-base">{section.title}</h3>
              <p className="text-white/30 text-xs">{section.desc}</p>
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {links[section.key].map(link => (
              <TiltCard key={link.name} intensity={8}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-center transition-all hover:scale-105 group"
                  style={{ background: link.bg, border: `1px solid ${link.color}25` }}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                  <span className="text-xs font-bold leading-tight" style={{ color: link.color }}>{link.name}</span>
                  <span className="text-white/20 text-xs">Open →</span>
                </a>
              </TiltCard>
            ))}
          </div>
        </div>
      ))}

      {/* Places needing advance booking */}
      {bookablePlaces.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.1), transparent)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-white text-base">Book These in Advance</h3>
              <p className="text-white/30 text-xs">These places in your itinerary often sell out — book ahead</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {bookablePlaces.map((place, i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-xl flex-wrap"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}>
                <div>
                  <div className="font-semibold text-white text-sm">{place.name}</div>
                  <div className="text-white/30 text-xs capitalize mt-0.5">{place.category} · {place.estimatedCost}</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <a href={`https://www.tiqets.com/en/search/#q=${encodeURIComponent(place.name + ' ' + destination)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105"
                    style={{ background: 'rgba(131,56,236,0.2)', color: '#a78bfa', border: '1px solid rgba(131,56,236,0.3)' }}>
                    🎟️ Tiqets
                  </a>
                  <a href={`https://www.google.com/search?q=book+tickets+${encodeURIComponent(place.name + ' ' + destination)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105"
                    style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.25)' }}>
                    🔍 Search
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-white/20 text-xs pb-4">
        Links open in a new tab. Roamly is not affiliated with any booking platform.
      </p>
    </div>
  );
}
