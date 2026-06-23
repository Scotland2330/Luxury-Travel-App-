import { useState } from 'react';

/* ───── Types ───── */
type TabKey = 'builder' | 'traveler' | 'documents' | 'collaboration' | 'preview';
type SegmentType = 'flight' | 'hotel' | 'activity' | 'transfer' | 'dining' | 'note';

interface ItinerarySegment {
  id: number;
  type: SegmentType;
  time?: string;
  title: string;
  subtitle?: string;
  details?: string;
  confirmed: boolean;
  image?: string;
}

interface ItineraryDay {
  day: number;
  date: string;
  location: string;
  segments: ItinerarySegment[];
}

interface TravelerPref {
  label: string;
  value: string;
}

interface DocItem {
  name: string;
  type: string;
  status: 'Uploaded' | 'Pending' | 'Missing';
  icon: string;
}

interface CollabMessage {
  from: string;
  role: string;
  time: string;
  text: string;
}

/* ───── Constants ───── */
const segmentIcons: Record<SegmentType, string> = {
  flight: '✈',
  hotel: '◆',
  activity: '✦',
  transfer: '⬡',
  dining: '◈',
  note: '◫',
};

const segmentColors: Record<SegmentType, string> = {
  flight: 'var(--sapphire-lt)',
  hotel: 'var(--champagne)',
  activity: 'var(--emerald-lt)',
  transfer: 'var(--amethyst)',
  dining: 'var(--cognac-lt)',
  note: 'var(--slate)',
};

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'builder', label: 'Itinerary Builder', icon: '◫' },
  { key: 'traveler', label: 'Traveler Profile', icon: '✧' },
  { key: 'documents', label: 'Documents & Vouchers', icon: '◩' },
  { key: 'collaboration', label: 'Collaboration', icon: '⬡' },
  { key: 'preview', label: 'Client Preview', icon: '◈' },
];

/* ───── Seed Data ───── */
const tripOptions = [
  { id: 'holland-capri', client: 'Holland, Augusta', trip: 'Capri — Amalfi Coast', dates: 'Jul 5-14, 2026', status: 'Building' },
  { id: 'mcgarey-scotland', client: 'McGarey, Patrick & Cristin', trip: 'Scotland Highlands', dates: 'Aug 12-22, 2026', status: 'Sent to Client' },
  { id: 'baker-westlake', client: 'Baker, Sean', trip: 'Westlake Resort', dates: 'Jul 20-25, 2026', status: 'Confirmed' },
  { id: 'diaz-dc', client: 'Diaz, Maria', trip: 'DC Business & Leisure', dates: 'Jun 28-Jul 2, 2026', status: 'Draft' },
];

const sampleDays: ItineraryDay[] = [
  {
    day: 1, date: 'Jul 5, Sat', location: 'Naples → Capri',
    segments: [
      { id: 1, type: 'flight', time: '06:45', title: 'AA 114 — JFK to Naples (NAP)', subtitle: 'Business Class · Seats 4A/4B · 8h 40m', details: 'Terminal 8, Gate B42. Lounge access: Admirals Club. Meal: pre-ordered gluten-free for Mrs. Holland.', confirmed: true },
      { id: 2, type: 'transfer', time: '16:30', title: 'Private Transfer — Naples Airport to Marina Grande', subtitle: 'Rolzo · Mercedes S-Class · Driver: Marco', details: 'Meet at arrivals with name sign. Estimated 45 min to port. Water and refreshments provided.', confirmed: true },
      { id: 3, type: 'transfer', time: '17:30', title: 'Private Boat — Marina Grande to Hotel Pier', subtitle: 'Luxury Gozzo · 20 min crossing', details: 'Luggage handled separately. Champagne welcome aboard.', confirmed: true },
      { id: 4, type: 'hotel', time: '18:15', title: 'Check-in: Hotel Caesar Augustus', subtitle: 'Infinity Suite · Sea View · 9 Nights', details: 'VIP amenities arranged: welcome fruit basket, Prosecco, handwritten note. Early check-in confirmed. Virtuoso: complimentary breakfast, $100 spa credit, room upgrade (subject to availability).', confirmed: true },
      { id: 5, type: 'dining', time: '20:30', title: 'Welcome Dinner — Il Riccio Beach Club', subtitle: 'Reservation for 2 · Terrace Table', details: 'Michelin-starred seafood. Reservation under "Holland / Meridian Travel." Dress code: resort elegant.', confirmed: true },
    ],
  },
  {
    day: 2, date: 'Jul 6, Sun', location: 'Capri',
    segments: [
      { id: 6, type: 'activity', time: '09:00', title: 'Private Blue Grotto Tour', subtitle: 'Private guide · 3 hours · Includes small boat entry', details: 'Guide: Alessandro. Meet at hotel lobby. Tour includes Faraglioni rocks and natural arch. Life jackets provided. Bring sunscreen and hat.', confirmed: true },
      { id: 7, type: 'dining', time: '13:00', title: 'Lunch — Lo Smeraldo', subtitle: 'Piazzetta location · Reserved window table', details: 'Casual Italian, excellent for people-watching. No dress code. Known for lemon risotto.', confirmed: false },
      { id: 8, type: 'note', title: 'Afternoon at leisure', details: 'Suggested: Pool and spa at hotel, or walk the Gardens of Augustus (10 min from Piazzetta). Spa booking available — Mrs. Holland mentioned interest in a facial.', confirmed: true },
    ],
  },
  {
    day: 3, date: 'Jul 7, Mon', location: 'Anacapri',
    segments: [
      { id: 9, type: 'transfer', time: '09:30', title: 'Convertible Car to Anacapri', subtitle: 'Vintage Fiat 500 · Self-drive experience', details: 'Pick up at hotel. Route via scenic road with photo stops. Return by 16:00.', confirmed: true },
      { id: 10, type: 'activity', time: '10:30', title: 'Villa San Michele & Gardens', subtitle: 'Private docent tour · 90 min', details: 'Axel Munthe\'s villa. Spectacular views. Gift shop has excellent ceramics.', confirmed: true },
      { id: 11, type: 'dining', time: '12:30', title: 'Lunch — Da Gelsomina', subtitle: 'Hillside terrace · Farm-to-table', details: 'Family-run, spectacular cliff views. Their own wine and olive oil. Reservations essential.', confirmed: true },
      { id: 12, type: 'activity', time: '15:00', title: 'Anacapri Artisan Walk', subtitle: 'Sandal-making workshop + Limoncello tasting', details: 'Visit Canfora (famous Capri sandals — custom pair takes ~2 hours, pickup next day). Then limoncello tasting at family distillery.', confirmed: false },
    ],
  },
  {
    day: 4, date: 'Jul 8, Tue', location: 'Capri',
    segments: [
      { id: 13, type: 'note', title: 'Morning at leisure', details: 'Suggested: breakfast on the terrace, then spa morning. The hotel infinity pool is typically quietest before 10am.', confirmed: true },
      { id: 14, type: 'activity', time: '14:00', title: 'Private Yacht Half-Day', subtitle: 'Itama 40 · Captain + Steward · 4 hours', details: 'Circumnavigation of Capri with swim stops. Snorkeling gear, paddleboard, and kayak on board. Aperitivo service included. Departs from hotel pier.', confirmed: true },
      { id: 15, type: 'dining', time: '20:00', title: 'Da Paolino — Lemon Tree Dinner', subtitle: 'Iconic outdoor dining · Reservation for 2', details: 'The famous lemon tree restaurant. Dress: smart casual. Known for their lemon pasta and lemon cake. Very popular with celebrities — one of Capri\'s bucket-list dinners. Confirmed under "Meridian Travel / Holland."', confirmed: true },
    ],
  },
];

const travelerPrefs: TravelerPref[] = [
  { label: 'Dietary Restrictions', value: 'Gluten-free (Mrs. Holland), No shellfish allergies' },
  { label: 'Room Preferences', value: 'High floor, sea view, king bed, extra pillows, quiet room away from elevator' },
  { label: 'Airline Preferences', value: 'American Airlines, Business Class, aisle + window pairing' },
  { label: 'Hotel Loyalty', value: 'Virtuoso preferred. No Marriott properties (bad experience 2024)' },
  { label: 'Activity Level', value: 'Moderate — enjoys walking tours but prefers not to hike. Mr. Holland has mild knee issue.' },
  { label: 'Special Occasions', value: '15th wedding anniversary during trip (Jul 10). Arrange surprise: flowers + champagne in room.' },
  { label: 'Communication Style', value: 'Mrs. Holland handles all planning. Email preferred. Text for urgent only. No calls before 9am EST.' },
  { label: 'Budget Guidance', value: '$16,800 total approved. Flexible on dining add-ons up to $2K. No casino or nightclub interest.' },
  { label: 'Past Trip Notes', value: 'Loved: Santorini 2024 (sunset sail was highlight). Disliked: overcrowded Positano day-trip 2023.' },
  { label: 'Insurance Status', value: 'Quote sent via Arch Insurance. CFAR add-on recommended — awaiting client decision.' },
];

const tippingGuidelines = [
  { category: 'Hotel Staff', items: [
    { role: 'Porters / Bellhops', amount: '€2-5 per bag' },
    { role: 'Housekeeping', amount: '€3-5 per day' },
    { role: 'Concierge', amount: '€5-20 for special arrangements' },
    { role: 'Room Service', amount: '€2-5 per delivery (check if included)' },
  ]},
  { category: 'Dining', items: [
    { role: 'Restaurants', amount: '10% typical in Italy (service often included — check bill)' },
    { role: 'Bars & Cafés', amount: '€1-2 per round, or round up' },
    { role: 'Private Chef', amount: '€20-50 per event' },
  ]},
  { category: 'Transport & Tours', items: [
    { role: 'Private Driver (full day)', amount: '€20-40' },
    { role: 'Private Guide (full day)', amount: '€30-50' },
    { role: 'Boat Captain', amount: '€20-30 for half day' },
    { role: 'Boat Steward', amount: '€10-20 for half day' },
    { role: 'Transfer Driver', amount: '€5-10 per ride' },
  ]},
];

const docItems: DocItem[] = [
  { name: 'Flight Confirmation — AA 114', type: 'PDF', status: 'Uploaded', icon: '✈' },
  { name: 'Hotel Caesar Augustus Voucher', type: 'PDF', status: 'Uploaded', icon: '◆' },
  { name: 'Travel Insurance Policy', type: 'PDF', status: 'Pending', icon: '☑' },
  { name: 'Passport — Augusta Holland', type: 'JPG', status: 'Uploaded', icon: '◩' },
  { name: 'Passport — David Holland', type: 'JPG', status: 'Missing', icon: '◩' },
  { name: 'Blue Grotto Private Tour Voucher', type: 'PDF', status: 'Uploaded', icon: '✦' },
  { name: 'Yacht Charter Agreement', type: 'PDF', status: 'Uploaded', icon: '⬡' },
  { name: 'Da Paolino Reservation Conf.', type: 'PDF', status: 'Pending', icon: '◈' },
  { name: 'Rolzo Transfer Confirmation', type: 'PDF', status: 'Uploaded', icon: '⬡' },
  { name: 'Visa / Entry Requirements', type: 'PDF', status: 'Uploaded', icon: '◫' },
  { name: 'Emergency Contact Card', type: 'PDF', status: 'Uploaded', icon: '❖' },
  { name: 'Trip Budget Breakdown', type: 'XLSX', status: 'Uploaded', icon: '◩' },
];

const collabMessages: CollabMessage[] = [
  { from: 'Halie M.', role: 'Lead Advisor', time: 'Jun 20, 3:15 PM', text: 'Marco from Italia Luxury Travel confirmed the Blue Grotto tour for Jul 6. Private guide Alessandro is their best — he speaks fluent English and has 15 years experience.' },
  { from: 'Marco Benedetti', role: 'DMC Partner — Italia Luxury Travel', time: 'Jun 20, 11:42 AM', text: 'Confirmed all Capri arrangements. I\'ve added the vintage Fiat rental for Anacapri day — it\'s a favorite with American clients. Also upgraded the yacht to the Itama 40 at no extra charge as a VIP courtesy.' },
  { from: 'Halie M.', role: 'Lead Advisor', time: 'Jun 19, 4:30 PM', text: 'Can we get the lemon tree dinner at Da Paolino moved to 8pm instead of 8:30? Client prefers earlier dining. Also — any chance of the corner terrace table?' },
  { from: 'Marco Benedetti', role: 'DMC Partner — Italia Luxury Travel', time: 'Jun 19, 2:15 PM', text: 'Working on the Da Paolino reservation. Jul 8 is very busy but I have a contact there. Will confirm by end of day tomorrow.' },
  { from: 'Sarah Chen', role: 'Insurance — Arch Insurance', time: 'Jun 18, 10:00 AM', text: 'Insurance quote sent to client email. CFAR add-on is $340 extra — recommend it for the Jul 5 departure. Policy covers trip cancellation up to $16,800 plus $100K medical.' },
  { from: 'Halie M.', role: 'Lead Advisor', time: 'Jun 17, 5:45 PM', text: '@Marco — please send over the final transfer schedule for arrival day. Need Mercedes S-Class confirmed, and the private boat from Marina Grande. Client lands at 4:15pm local.' },
];

const collabPartners = [
  { name: 'Marco Benedetti', company: 'Italia Luxury Travel', role: 'DMC Partner', status: 'Active', avatar: 'MB' },
  { name: 'Sarah Chen', company: 'Arch Insurance', role: 'Insurance Partner', status: 'Active', avatar: 'SC' },
  { name: 'Alex Dumas', company: 'Rolzo', role: 'Transfer Partner', status: 'Invited', avatar: 'AD' },
  { name: 'Concierge Desk', company: 'Hotel Caesar Augustus', role: 'Property', status: 'Pending', avatar: 'CA' },
];

/* ═══════════════════════════════════ Component ═══════════════════════════════════ */

export default function ItineraryBuilder() {
  const [activeTab, setActiveTab] = useState<TabKey>('builder');
  const [selectedTrip, setSelectedTrip] = useState(tripOptions[0].id);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1, 2]));
  const [expandedSegments, setExpandedSegments] = useState<Set<number>>(new Set([1, 4]));
  const [deliveryFormat, setDeliveryFormat] = useState<'app' | 'web' | 'pdf'>('app');
  const [collabInput, setCollabInput] = useState('');

  const trip = tripOptions.find(t => t.id === selectedTrip) || tripOptions[0];
  const statusColor = trip.status === 'Confirmed' ? 'var(--emerald-lt)' : trip.status === 'Sent to Client' ? 'var(--sapphire-lt)' : trip.status === 'Building' ? 'var(--champagne)' : 'var(--slate)';

  const toggleDay = (day: number) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  };

  const toggleSegment = (id: number) => {
    setExpandedSegments(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ═══════════════════════════════════ Render ═══════════════════════════════════ */
  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>

      {/* ─── Phase II Banner ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,154,156,0.08), rgba(27,75,90,0.12))',
        border: '1px solid rgba(59,154,156,0.25)',
        borderRadius: 10,
        padding: '10px 18px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14 }}>◈</span>
          <span style={{ fontSize: 11, color: 'var(--champagne)', letterSpacing: 0.5 }}>
            Phase II Feature — Itinerary Builder & Client Delivery Platform
          </span>
        </div>
        <span style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: 0.5 }}>PROTOTYPE PREVIEW</span>
      </div>

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Itinerary Builder</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>
            Day-by-day trip design &middot; Client delivery &middot; Partner collaboration
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Trip Selector */}
          <select
            className="td-input"
            value={selectedTrip}
            onChange={e => setSelectedTrip(e.target.value)}
            style={{ width: 260, fontSize: 11 }}
          >
            {tripOptions.map(t => (
              <option key={t.id} value={t.id}>{t.client} — {t.trip}</option>
            ))}
          </select>
          <button className="btn btn-champ">+ New Itinerary</button>
        </div>
      </div>

      {/* ─── Trip Summary Bar ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '12px 18px',
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        marginBottom: 20,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: 'var(--ivory)', fontWeight: 400 }}>{trip.trip}</div>
          <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 2 }}>{trip.client} &middot; {trip.dates}</div>
        </div>
        <span style={{ fontSize: 10, padding: '4px 12px', borderRadius: 12, border: `1px solid ${statusColor}`, color: statusColor, letterSpacing: 0.5 }}>{trip.status}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm">Duplicate</button>
          <button className="btn btn-ghost btn-sm">E-Page</button>
          <button className="btn btn-champ btn-sm">Send to Client</button>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 22 }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: activeTab === t.key ? '1px solid rgba(59,154,156,0.18)' : '1px solid var(--border)',
              background: activeTab === t.key ? 'var(--champ-dim)' : 'transparent',
              color: activeTab === t.key ? 'var(--champagne)' : 'var(--slate)',
              fontSize: 10,
              letterSpacing: 0.5,
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 11 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════ BUILDER TAB ═══════ */}
      {activeTab === 'builder' && (
        <div style={{ display: 'flex', gap: 20 }}>
          {/* Main Column - Day Builder */}
          <div style={{ flex: 1 }}>
            {/* Add segment toolbar */}
            <div style={{
              display: 'flex',
              gap: 6,
              marginBottom: 18,
              padding: '10px 14px',
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}>
              <span style={{ fontSize: 10, color: 'var(--slate)', lineHeight: '28px', marginRight: 8 }}>Add:</span>
              {(['flight', 'hotel', 'activity', 'transfer', 'dining', 'note'] as SegmentType[]).map(type => (
                <button
                  key={type}
                  className="btn btn-ghost btn-xs"
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span style={{ color: segmentColors[type] }}>{segmentIcons[type]}</span>
                  <span style={{ textTransform: 'capitalize' }}>{type}</span>
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <button className="btn btn-ghost btn-xs">+ Add Day</button>
              <button className="btn btn-ghost btn-xs">Reorder</button>
            </div>

            {/* Days */}
            {sampleDays.map(day => (
              <div key={day.day} style={{ marginBottom: 14 }}>
                {/* Day Header */}
                <div
                  onClick={() => toggleDay(day.day)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 16px',
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: expandedDays.has(day.day) ? '10px 10px 0 0' : 10,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: 'var(--champ-dim)',
                    border: '1px solid rgba(59,154,156,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 14, color: 'var(--champagne)', fontWeight: 500, lineHeight: 1 }}>{day.day}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 400 }}>Day {day.day} — {day.location}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 1 }}>{day.date} &middot; {day.segments.length} items</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {day.segments.some(s => !s.confirmed) && (
                      <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: 'rgba(194,120,73,0.15)', color: 'var(--cognac-lt)', border: '1px solid rgba(194,120,73,0.2)' }}>
                        {day.segments.filter(s => !s.confirmed).length} unconfirmed
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: 'var(--slate)', transition: 'transform 0.2s', transform: expandedDays.has(day.day) ? 'rotate(90deg)' : 'none' }}>▸</span>
                  </div>
                </div>

                {/* Day Segments */}
                {expandedDays.has(day.day) && (
                  <div style={{
                    border: '1px solid var(--border)',
                    borderTop: 'none',
                    borderRadius: '0 0 10px 10px',
                    overflow: 'hidden',
                  }}>
                    {day.segments.map((seg, idx) => (
                      <div key={seg.id}>
                        <div
                          onClick={() => toggleSegment(seg.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 16px 10px 20px',
                            background: expandedSegments.has(seg.id) ? 'var(--bg3)' : 'var(--bg2)',
                            borderBottom: idx < day.segments.length - 1 || expandedSegments.has(seg.id) ? '1px solid var(--border2)' : 'none',
                            cursor: 'pointer',
                            transition: 'background 0.1s',
                          }}
                        >
                          {/* Timeline dot */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                            <div style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: segmentColors[seg.type],
                              border: `2px solid ${segmentColors[seg.type]}`,
                              opacity: seg.confirmed ? 1 : 0.5,
                            }} />
                            {idx < day.segments.length - 1 && (
                              <div style={{ width: 1, height: 16, background: 'var(--border)', marginTop: 2 }} />
                            )}
                          </div>
                          {/* Time */}
                          <div style={{ width: 42, flexShrink: 0, fontSize: 11, color: 'var(--champagne)', fontWeight: 500 }}>
                            {seg.time || ''}
                          </div>
                          {/* Type icon */}
                          <span style={{ fontSize: 12, color: segmentColors[seg.type], width: 18, textAlign: 'center', flexShrink: 0 }}>
                            {segmentIcons[seg.type]}
                          </span>
                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {seg.title}
                            </div>
                            {seg.subtitle && (
                              <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {seg.subtitle}
                              </div>
                            )}
                          </div>
                          {/* Status */}
                          <span style={{
                            fontSize: 8,
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: 6,
                            background: seg.confirmed ? 'rgba(59,154,156,0.1)' : 'rgba(194,120,73,0.1)',
                            color: seg.confirmed ? 'var(--emerald-lt)' : 'var(--cognac-lt)',
                            border: `1px solid ${seg.confirmed ? 'rgba(59,154,156,0.2)' : 'rgba(194,120,73,0.2)'}`,
                            flexShrink: 0,
                          }}>
                            {seg.confirmed ? 'Confirmed' : 'Pending'}
                          </span>
                          <button className="btn btn-ghost btn-xs" style={{ flexShrink: 0, padding: '2px 6px' }} onClick={e => e.stopPropagation()}>⋮</button>
                        </div>

                        {/* Expanded Details */}
                        {expandedSegments.has(seg.id) && seg.details && (
                          <div style={{
                            padding: '12px 20px 14px 68px',
                            background: 'var(--bg3)',
                            borderBottom: '1px solid var(--border2)',
                            fontSize: 11,
                            color: 'var(--slate)',
                            lineHeight: 1.7,
                          }}>
                            {seg.details}
                            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                              <button className="btn btn-ghost btn-xs">Edit</button>
                              <button className="btn btn-ghost btn-xs">Attach Doc</button>
                              <button className="btn btn-ghost btn-xs">Add Note</button>
                              {!seg.confirmed && <button className="btn btn-champ btn-xs">Mark Confirmed</button>}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Remaining days placeholder */}
            <div style={{
              padding: '16px 18px',
              background: 'var(--bg2)',
              border: '1px dashed var(--border)',
              borderRadius: 10,
              textAlign: 'center',
              color: 'var(--slate)',
              fontSize: 11,
            }}>
              Days 5-9 &middot; Click + Add Day or drag segments to continue building
            </div>
          </div>

          {/* Right Sidebar - Quick Info */}
          <div style={{ width: 260, flexShrink: 0 }}>
            {/* Itinerary Stats */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-h"><span className="card-t">Itinerary Overview</span></div>
              <div className="card-b" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Total Days', value: '9 nights / 10 days' },
                  { label: 'Flights', value: '2 segments' },
                  { label: 'Hotels', value: '1 property' },
                  { label: 'Activities', value: '4 booked' },
                  { label: 'Transfers', value: '3 arranged' },
                  { label: 'Dining', value: '4 reservations' },
                  { label: 'Confirmed', value: '12 of 15 (80%)' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                    <span style={{ color: 'var(--slate)' }}>{item.label}</span>
                    <span style={{ color: 'var(--ivory-dim)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Format */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-h"><span className="card-t">Delivery Format</span></div>
              <div className="card-b" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {([
                  { key: 'app' as const, label: 'Mobile App', desc: 'Push notifications, offline access' },
                  { key: 'web' as const, label: 'Web Link', desc: 'Shareable URL, real-time updates' },
                  { key: 'pdf' as const, label: 'Branded PDF', desc: 'Print-ready, agency-branded' },
                ]).map(fmt => (
                  <div
                    key={fmt.key}
                    onClick={() => setDeliveryFormat(fmt.key)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: deliveryFormat === fmt.key ? '1px solid rgba(59,154,156,0.25)' : '1px solid var(--border)',
                      background: deliveryFormat === fmt.key ? 'var(--champ-dim)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 11, color: deliveryFormat === fmt.key ? 'var(--champagne)' : 'var(--ivory-dim)' }}>{fmt.label}</div>
                    <div style={{ fontSize: 9, color: 'var(--slate)', marginTop: 1 }}>{fmt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Images */}
            <div className="card">
              <div className="card-h"><span className="card-t">Destination Images</span></div>
              <div className="card-b">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {['Faraglioni Rocks', 'Blue Grotto', 'Piazzetta', 'Marina Grande'].map(place => (
                    <div key={place} style={{
                      aspectRatio: '1',
                      background: 'linear-gradient(135deg, var(--bg4), var(--bg3))',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      color: 'var(--slate)',
                      textAlign: 'center',
                      padding: 8,
                      cursor: 'pointer',
                    }}>
                      {place}
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost btn-xs" style={{ width: '100%', marginTop: 8 }}>Browse Image Library</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ TRAVELER PROFILE TAB ═══════ */}
      {activeTab === 'traveler' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Client Preferences */}
          <div className="card">
            <div className="card-h">
              <span className="card-t">Client Preferences & Notes</span>
              <button className="btn btn-ghost btn-xs">Edit All</button>
            </div>
            <div className="card-b" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {travelerPrefs.map(pref => (
                <div key={pref.label}>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--champagne)', marginBottom: 4 }}>{pref.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--ivory-dim)', lineHeight: 1.6 }}>{pref.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Tipping Guidelines */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-h">
                <span className="card-t">Tipping Guidelines — Italy</span>
                <button className="btn btn-ghost btn-xs">Customize</button>
              </div>
              <div className="card-b">
                {tippingGuidelines.map(cat => (
                  <div key={cat.category} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8 }}>{cat.category}</div>
                    {cat.items.map(item => (
                      <div key={item.role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid var(--border2)' }}>
                        <span style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>{item.role}</span>
                        <span style={{ fontSize: 10, color: 'var(--champagne)' }}>{item.amount}</span>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ fontSize: 9, color: 'var(--slate)', fontStyle: 'italic', marginTop: 8, lineHeight: 1.5 }}>
                  Note: Tipping is appreciated but not obligatory in Italy. Service charge (coperto) is often included in restaurant bills.
                </div>
              </div>
            </div>

            {/* Traveler Quick Info */}
            <div className="card">
              <div className="card-h"><span className="card-t">Traveler Information</span></div>
              <div className="card-b">
                {[
                  { label: 'Traveler 1', name: 'Augusta Holland', passport: 'US · Exp Dec 2028', dob: 'Mar 15, 1978' },
                  { label: 'Traveler 2', name: 'David Holland', passport: 'US · Exp needed', dob: 'Jul 22, 1976' },
                ].map(t => (
                  <div key={t.label} style={{ padding: '12px 0', borderBottom: '1px solid var(--border2)' }}>
                    <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--ivory)', marginBottom: 2 }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)' }}>Passport: {t.passport} &middot; DOB: {t.dob}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                  <button className="btn btn-ghost btn-xs">Edit Travelers</button>
                  <button className="btn btn-ghost btn-xs">Add Traveler</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ DOCUMENTS TAB ═══════ */}
      {activeTab === 'documents' && (
        <div>
          {/* Upload Area */}
          <div style={{
            border: '2px dashed var(--border)',
            borderRadius: 12,
            padding: '24px 0',
            textAlign: 'center',
            marginBottom: 20,
            background: 'var(--bg2)',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}>
            <div style={{ fontSize: 24, color: 'var(--slate)', marginBottom: 8 }}>+</div>
            <div style={{ fontSize: 12, color: 'var(--ivory-dim)', marginBottom: 4 }}>Drop files here or click to upload</div>
            <div style={{ fontSize: 10, color: 'var(--slate)' }}>PDF, JPG, PNG, GIF &middot; Max 25 MB per file</div>
          </div>

          {/* Status Summary */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Uploaded', count: docItems.filter(d => d.status === 'Uploaded').length, color: 'var(--emerald-lt)' },
              { label: 'Pending', count: docItems.filter(d => d.status === 'Pending').length, color: 'var(--champagne)' },
              { label: 'Missing', count: docItems.filter(d => d.status === 'Missing').length, color: 'var(--ruby-lt)' },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1,
                padding: '12px 16px',
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 11, color: 'var(--slate)' }}>{s.label}</span>
                <span style={{ fontSize: 18, color: s.color, fontWeight: 500 }}>{s.count}</span>
              </div>
            ))}
          </div>

          {/* Document List */}
          <div className="card">
            <div className="card-h">
              <span className="card-t">Trip Documents & Vouchers</span>
              <span style={{ fontSize: 9, color: 'var(--slate)' }}>{docItems.length} items</span>
            </div>
            <div className="card-b" style={{ padding: 0 }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 30 }}></th>
                    <th>Document</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {docItems.map((doc, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 13, textAlign: 'center' }}>{doc.icon}</td>
                      <td className="td-main">{doc.name}</td>
                      <td>{doc.type}</td>
                      <td>
                        <span className={`badge ${doc.status === 'Uploaded' ? 'b-em' : doc.status === 'Pending' ? 'b-og' : 'b-ru'}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {doc.status === 'Uploaded' && <button className="btn btn-ghost btn-xs">View</button>}
                          {doc.status === 'Uploaded' && <button className="btn btn-ghost btn-xs">Share</button>}
                          {doc.status !== 'Uploaded' && <button className="btn btn-champ btn-xs">Upload</button>}
                          <button className="btn btn-ghost btn-xs">⋮</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ COLLABORATION TAB ═══════ */}
      {activeTab === 'collaboration' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
          {/* Message Thread */}
          <div className="card">
            <div className="card-h">
              <span className="card-t">Collaboration Thread</span>
              <span style={{ fontSize: 9, color: 'var(--slate)' }}>{collabMessages.length} messages</span>
            </div>
            <div className="card-b" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {collabMessages.map((msg, i) => (
                <div key={i} style={{
                  padding: '14px 0',
                  borderBottom: i < collabMessages.length - 1 ? '1px solid var(--border2)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: msg.from === 'Halie M.' ? 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))' : 'var(--bg4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      color: msg.from === 'Halie M.' ? 'var(--bg)' : 'var(--champagne)',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}>
                      {msg.from.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 11, color: 'var(--ivory)', fontWeight: 500 }}>{msg.from}</span>
                      <span style={{ fontSize: 9, color: 'var(--slate)', marginLeft: 8 }}>{msg.role}</span>
                    </div>
                    <span style={{ fontSize: 9, color: 'var(--slate-dim)' }}>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ivory-dim)', lineHeight: 1.7, paddingLeft: 38 }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Input */}
              <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                <input
                  className="td-input"
                  placeholder="Message partners and team..."
                  value={collabInput}
                  onChange={e => setCollabInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-champ btn-sm">Send</button>
              </div>
            </div>
          </div>

          {/* Partners Panel */}
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-h">
                <span className="card-t">Trip Partners</span>
                <button className="btn btn-ghost btn-xs">+ Invite</button>
              </div>
              <div className="card-b" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {collabPartners.map(p => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: p.status === 'Active' ? 'var(--bg4)' : 'var(--bg3)',
                      border: `1px solid ${p.status === 'Active' ? 'var(--champagne)' : 'var(--border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      color: p.status === 'Active' ? 'var(--champagne)' : 'var(--slate)',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}>
                      {p.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: 'var(--ivory)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: 9, color: 'var(--slate)' }}>{p.role}</div>
                    </div>
                    <span style={{
                      fontSize: 8,
                      letterSpacing: 0.8,
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: p.status === 'Active' ? 'rgba(59,154,156,0.1)' : p.status === 'Invited' ? 'rgba(194,120,73,0.1)' : 'var(--bg4)',
                      color: p.status === 'Active' ? 'var(--emerald-lt)' : p.status === 'Invited' ? 'var(--cognac-lt)' : 'var(--slate)',
                    }}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Controls */}
            <div className="card">
              <div className="card-h"><span className="card-t">Access Controls</span></div>
              <div className="card-b" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Partners can edit segments', value: true },
                  { label: 'Partners can upload docs', value: true },
                  { label: 'Partners see pricing', value: false },
                  { label: 'Client can comment', value: true },
                  { label: 'Client can request changes', value: true },
                ].map(ctrl => (
                  <div key={ctrl.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: 'var(--ivory-dim)' }}>{ctrl.label}</span>
                    <div className={`toggle${ctrl.value ? ' on' : ''}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ CLIENT PREVIEW TAB ═══════ */}
      {activeTab === 'preview' && (
        <div>
          {/* Format Selector */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {([
              { key: 'app' as const, label: 'Mobile App Preview' },
              { key: 'web' as const, label: 'Web View' },
              { key: 'pdf' as const, label: 'PDF Export' },
            ]).map(fmt => (
              <button
                key={fmt.key}
                onClick={() => setDeliveryFormat(fmt.key)}
                className={deliveryFormat === fmt.key ? 'btn btn-champ btn-sm' : 'btn btn-ghost btn-sm'}
              >
                {fmt.label}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button className="btn btn-champ btn-sm">Generate & Send</button>
          </div>

          {/* Mobile App Preview */}
          {deliveryFormat === 'app' && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 375,
                minHeight: 700,
                background: 'var(--bg)',
                border: '3px solid var(--slate-dim)',
                borderRadius: 36,
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}>
                {/* Phone status bar */}
                <div style={{
                  height: 44,
                  background: 'var(--bg2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  color: 'var(--ivory)',
                  fontWeight: 500,
                }}>
                  9:41
                </div>

                {/* App header */}
                <div style={{
                  background: 'var(--bg2)',
                  padding: '0 20px 16px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>MERIDIAN TRAVEL</div>
                  <div className="playfair" style={{ fontSize: 20, color: 'var(--ivory)' }}>Capri</div>
                  <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 2 }}>Jul 5-14, 2026 &middot; 9 Nights</div>
                </div>

                {/* Day cards */}
                <div style={{ padding: 16 }}>
                  {sampleDays.slice(0, 2).map(day => (
                    <div key={day.day} style={{
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 10,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 500 }}>Day {day.day}</div>
                          <div style={{ fontSize: 9, color: 'var(--slate)' }}>{day.date} &middot; {day.location}</div>
                        </div>
                        <span style={{ fontSize: 10, color: 'var(--champagne)' }}>{day.segments.length} items</span>
                      </div>
                      {day.segments.slice(0, 3).map(seg => (
                        <div key={seg.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '6px 0',
                          borderTop: '1px solid var(--border2)',
                          fontSize: 10,
                        }}>
                          <span style={{ color: segmentColors[seg.type], fontSize: 10 }}>{segmentIcons[seg.type]}</span>
                          <span style={{ color: 'var(--champagne)', width: 32, flexShrink: 0 }}>{seg.time || ''}</span>
                          <span style={{ color: 'var(--ivory-dim)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seg.title}</span>
                        </div>
                      ))}
                      {day.segments.length > 3 && (
                        <div style={{ fontSize: 9, color: 'var(--slate)', textAlign: 'center', paddingTop: 6 }}>
                          +{day.segments.length - 3} more
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Quick links */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
                    {['Documents', 'Tipping Guide', 'Emergency Info', 'Message Advisor'].map(link => (
                      <div key={link} style={{
                        padding: '12px',
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        textAlign: 'center',
                        fontSize: 10,
                        color: 'var(--champagne)',
                        cursor: 'pointer',
                      }}>
                        {link}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom nav */}
                <div style={{
                  position: 'sticky',
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '10px 0',
                  background: 'var(--bg2)',
                  borderTop: '1px solid var(--border)',
                }}>
                  {['Itinerary', 'Docs', 'Chat', 'Profile'].map((tab, i) => (
                    <div key={tab} style={{
                      fontSize: 9,
                      color: i === 0 ? 'var(--champagne)' : 'var(--slate)',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 16, marginBottom: 2 }}>
                        {['◫', '◩', '⬡', '✧'][i]}
                      </div>
                      {tab}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Web View Preview */}
          {deliveryFormat === 'web' && (
            <div style={{
              maxWidth: 700,
              margin: '0 auto',
              border: '1px solid var(--champagne)',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 12px 48px rgba(59,154,156,0.08), 0 4px 20px rgba(0,0,0,0.2)',
            }}>
              {/* Browser bar */}
              <div style={{
                background: 'var(--bg4)',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ruby-lt)', opacity: 0.6 }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cognac-lt)', opacity: 0.6 }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-lt)', opacity: 0.6 }} />
                <div style={{ flex: 1, marginLeft: 8, background: 'var(--bg3)', borderRadius: 6, padding: '4px 10px', fontSize: 9, color: 'var(--slate)', letterSpacing: 0.3 }}>
                  trip.meridiantravel.co/holland-capri-2026
                </div>
              </div>

              <div style={{ background: 'var(--bg2)', padding: 32 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>MERIDIAN TRAVEL PRESENTS</div>
                  <div className="playfair" style={{ fontSize: 32, color: 'var(--ivory)', letterSpacing: 1 }}>Capri — Amalfi Coast</div>
                  <div style={{ width: 50, height: 1, background: 'var(--champagne)', opacity: 0.35, margin: '14px auto' }} />
                  <div style={{ fontSize: 12, color: 'var(--slate)' }}>July 5-14, 2026 &middot; Prepared for Augusta & David Holland</div>
                </div>

                {/* Day summary */}
                {sampleDays.slice(0, 2).map(day => (
                  <div key={day.day} style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'var(--champ-dim)',
                        border: '1px solid rgba(59,154,156,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, color: 'var(--champagne)', fontWeight: 500,
                      }}>{day.day}</div>
                      <div>
                        <div style={{ fontSize: 14, color: 'var(--ivory)' }}>{day.location}</div>
                        <div style={{ fontSize: 10, color: 'var(--slate)' }}>{day.date}</div>
                      </div>
                    </div>
                    {day.segments.map(seg => (
                      <div key={seg.id} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '10px 14px', marginLeft: 20,
                        borderLeft: `2px solid ${segmentColors[seg.type]}`,
                        marginBottom: 4,
                      }}>
                        <span style={{ fontSize: 11, color: 'var(--champagne)', width: 36, flexShrink: 0, fontWeight: 500 }}>{seg.time || ''}</span>
                        <div>
                          <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>{seg.title}</div>
                          {seg.subtitle && <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 2 }}>{seg.subtitle}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--slate)', padding: 20, borderTop: '1px solid var(--border)' }}>
                  Days 3-9 continue below &middot; Scroll to explore your full itinerary
                </div>
              </div>
            </div>
          )}

          {/* PDF Preview */}
          {deliveryFormat === 'pdf' && (
            <div style={{
              maxWidth: 600,
              margin: '0 auto',
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}>
              {/* PDF page mockup */}
              <div style={{ padding: '40px 48px', color: '#1a1a1a' }}>
                {/* Branded header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <div style={{ fontSize: 10, letterSpacing: 6, textTransform: 'uppercase', color: '#999', marginBottom: 8 }}>MERIDIAN TRAVEL</div>
                  <div style={{ fontSize: 28, fontWeight: 300, letterSpacing: 2, color: '#1B4B5A' }}>Capri — Amalfi Coast</div>
                  <div style={{ width: 60, height: 2, background: '#3B9A9C', margin: '12px auto' }} />
                  <div style={{ fontSize: 11, color: '#666', marginTop: 8 }}>July 5-14, 2026</div>
                  <div style={{ fontSize: 11, color: '#666' }}>Prepared for Augusta & David Holland</div>
                </div>

                {/* Day blocks */}
                {sampleDays.slice(0, 2).map(day => (
                  <div key={day.day} style={{ marginBottom: 24 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '8px 0', borderBottom: '1px solid #e5e5e5', marginBottom: 10,
                    }}>
                      <div style={{ fontSize: 18, fontWeight: 600, color: '#3B9A9C' }}>Day {day.day}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{day.date} &middot; {day.location}</div>
                    </div>
                    {day.segments.map(seg => (
                      <div key={seg.id} style={{
                        display: 'flex', gap: 10, padding: '6px 0 6px 12px', fontSize: 11,
                      }}>
                        <span style={{ color: '#3B9A9C', width: 36, fontWeight: 500 }}>{seg.time || ''}</span>
                        <span style={{ color: '#333' }}>{seg.title}</span>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Footer */}
                <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 16, marginTop: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: '#999', letterSpacing: 1 }}>MERIDIAN TRAVEL &middot; Luxury Travel, Curated for You</div>
                  <div style={{ fontSize: 9, color: '#bbb', marginTop: 4 }}>Page 1 of 8 &middot; Generated Jun 23, 2026</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
