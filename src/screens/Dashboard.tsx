const kpis = [
  { label: 'Active Trips', value: '12', sub: '3 departing this month', subColor: 'var(--emerald-lt)', navTarget: 'master' },
  { label: 'Pending Commissions', value: '$4,280', sub: '2 awaiting supplier payment', subColor: 'var(--cognac-lt)', gold: true, navTarget: 'commissions' },
  { label: 'Hours This Week', value: '18.5', sub: '$2,775 retainer · 6.5h unbilled', subColor: 'var(--slate)', navTarget: 'time' },
  { label: 'Automation Alerts', value: '7', sub: '3 overdue · 4 upcoming', subColor: 'var(--slate)', navTarget: 'admin' },
];

const priorities = [
  { done: false, title: 'Send Pre-Arrival — Diaz DC Trip', sub: 'Departs Jun 22 · 2 days away', badge: 'b-rb', status: 'Urgent' },
  { done: false, title: 'Follow up insurance quote — Holland Capri', sub: 'Quote sent Jun 13 · 7-day reminder', badge: 'b-og', status: 'Due Today' },
  { done: false, title: 'Confirm transfer details — Baker Westlake', sub: 'Contact info missing · Departs Jun 28', badge: 'b-og', status: 'Due Today' },
  { done: true, title: 'Flight check — Diaz departing flights', sub: 'AA 1842 confirmed · 48hr check complete', badge: 'b-em', status: 'Done' },
  { done: false, title: 'Concierge follow-up — Holland dining res', sub: '3 months pre-departure trigger', badge: 'b-sa', status: 'Scheduled' },
];

const departures = [
  { dot: 'var(--sapphire-lt)', dest: 'DC | Business — Diaz', sub: 'Jun 22–28 · Flights ✓ · Pre-Arrival pending', badge: 'b-rb', countdown: '2 days' },
  { dot: 'var(--emerald-lt)', dest: 'Capri — Augusta Holland', sub: 'Jul 5–14 · Hotels ✓ · Insurance quoted', badge: 'b-sa', countdown: '15 days' },
  { dot: 'var(--cognac-lt)', dest: 'Westlake Business — Sean Baker', sub: 'Jul 20–25 · Flights pending · Transfer TBD', badge: 'b-og', countdown: '30 days' },
];

const alerts = [
  { dot: 'var(--ruby-lt)', text: 'Bon Voyage not sent — Diaz departs in 2 days', sub: 'Auto-triggered · Action needed', time: '1 hour ago' },
  { dot: 'var(--cognac-lt)', text: 'Insurance reminder — Holland · 7-day follow-up due', sub: 'Quote sent Jun 13', time: 'Today' },
  { dot: 'var(--emerald-lt)', text: 'Welcome Home — McGarey Scotland trip ended', sub: '1 week post-return · Send feedback request', time: 'Yesterday' },
  { dot: 'var(--sapphire-lt)', text: 'Concierge trigger — Baker trip in 3 months', sub: 'Dining, spa services', time: 'Yesterday' },
  { dot: 'var(--amethyst)', text: 'AXUS Review needed — Holland Capri itinerary', sub: '2 weeks pre-departure', time: 'Jun 18' },
];

const feedback = [
  { client: 'Kim Jones — Italy', rating: '⭐⭐⭐⭐⭐', sentiment: 'Positive', snippet: '"Halie made every detail seamless — from the private transfers to the last-minute restaurant change..."' },
  { client: "O'Brien — Palm Heights", rating: '⭐⭐⭐⭐⭐', sentiment: 'Positive', snippet: '"We felt so taken care of. The welcome amenities were a beautiful touch and the kids loved the..."' },
  { client: 'McGarey — Scotland', rating: '⭐⭐⭐⭐⭐', sentiment: 'Positive', snippet: '"Best trip we\'ve ever taken. The highland tour was breathtaking and perfectly paced for our group..."' },
];

import { useAgency } from '../AgencyContext';

export default function Dashboard({ onNav }: { onNav?: (id: string) => void }) {
  const { agency } = useAgency();
  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Good morning, {agency.advisor}</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4, letterSpacing: 0.5 }}>
            Friday, June 20 · 3 departures this month · 7 automation alerts pending
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost">Quick Log Time</button>
          <button className="btn btn-champ">+ New Trip Request</button>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} onClick={() => onNav?.(k.navTarget)} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 80, height: 80, borderRadius: '50%', background: 'var(--champ-glow)' }} />
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 12 }}>{k.label}</div>
            <div className="playfair" style={{ fontSize: 34, fontWeight: 400, color: k.gold ? 'var(--champagne)' : 'var(--ivory)', lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 10, color: k.subColor, marginTop: 8 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Main 2/3 + 1/3 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Left column */}
        <div>
          {/* Today's Priority Tasks */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-h">
              <span className="card-t">Today's Priorities</span>
              <span className="badge b-ch">7 items</span>
            </div>
            <div>
              {priorities.map((t, i) => (
                <div key={i} className="trip-mini">
                  <div
                    className={`cl-check${t.done ? ' done' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {t.done && <span style={{ fontSize: 9, color: 'white' }}>✓</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--ivory)', textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.5 : 1 }}>{t.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)' }}>{t.sub}</div>
                  </div>
                  <span className={`badge ${t.badge}`}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Departures */}
          <div className="card">
            <div className="card-h">
              <span className="card-t">Upcoming Departures</span>
              <span style={{ fontSize: 11, color: 'var(--champagne)', cursor: 'pointer' }}>View Calendar →</span>
            </div>
            <div>
              {departures.map((d, i) => (
                <div key={i} className="trip-mini">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.dot, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--ivory)' }}>{d.dest}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)' }}>{d.sub}</div>
                  </div>
                  <span className={`badge ${d.badge}`}>{d.countdown}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Automation Alerts */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-h">
              <span className="card-t">Automation Alerts</span>
              <span style={{ fontSize: 11, color: 'var(--champagne)', cursor: 'pointer' }}>View All</span>
            </div>
            <div className="card-b">
              {alerts.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < alerts.length - 1 ? '1px solid var(--border2)' : 'none' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.dot, marginTop: 4, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--ivory-dim)', lineHeight: 1.5 }}>{a.text}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate-dim)', marginTop: 1 }}>{a.sub}</div>
                    <div style={{ fontSize: 9, color: 'var(--slate)', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Client Feedback */}
          <div className="card">
            <div className="card-h">
              <span className="card-t">Recent Feedback</span>
              <span style={{ fontSize: 11, color: 'var(--champagne)', cursor: 'pointer' }}>View All →</span>
            </div>
            <div className="card-b">
              {feedback.map((f, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < feedback.length - 1 ? '1px solid var(--border2)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--ivory)' }}>{f.client}</span>
                    <span style={{ fontSize: 10, color: 'var(--emerald-lt)' }}>{f.rating} {f.sentiment}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--slate-dim)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.snippet}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
