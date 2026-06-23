import { useState } from 'react';

/* ─── Stage status types ─── */
type StageStatus = 'Booked' | 'Done' | 'Confirmed' | 'In Progress' | 'In Review' | 'Quoted' | 'Sent' | 'N/A' | 'Pending' | 'Missing' | 'Did Not Send' | '—' | '';

/* ─── Trip type ─── */
interface Trip {
  id: string;
  name: string;
  lead: string;
  start: string;
  end: string;
  client: string;
  flights: StageStatus;
  hotels: StageStatus;
  touring: StageStatus;
  transfers: StageStatus;
  insurance: StageStatus;
  concierge: StageStatus;
  axusReview: StageStatus;
  bonVoyage: StageStatus;
  preArrival: StageStatus;
  welcomeHome: StageStatus;
}

/* ─── Stage detail type ─── */
interface StageDetail {
  name: string;
  status: StageStatus;
  details: string[];
  checklist: { label: string; done: boolean }[];
  updated: string;
  assignee: string;
}

/* ─── Data ─── */
const juneTrips: Trip[] = [
  { id: 'dc-diaz', name: 'DC | Business [Diaz]', lead: 'Halie M.', start: 'Jun 22', end: 'Jun 28', client: 'Diaz', flights: 'Booked', hotels: 'Booked', touring: 'N/A', transfers: 'Pending', insurance: 'N/A', concierge: 'Done', axusReview: 'Done', bonVoyage: 'N/A', preArrival: 'N/A', welcomeHome: '—' },
  { id: 'capri-holland', name: 'Capri [Augusta Holland]', lead: 'Halie M.', start: 'Jul 5', end: 'Jul 14', client: 'Augusta Holland', flights: 'Booked', hotels: 'Booked', touring: 'Booked', transfers: 'Pending', insurance: 'Quoted', concierge: 'N/A', axusReview: 'In Review', bonVoyage: '—', preArrival: '—', welcomeHome: '—' },
  { id: 'westlake-baker', name: 'Westlake Business [Sean Baker]', lead: 'Halie M.', start: 'Jul 20', end: 'Jul 25', client: 'Sean Baker', flights: 'Pending', hotels: 'Booked', touring: 'N/A', transfers: '—', insurance: '—', concierge: '—', axusReview: '—', bonVoyage: '—', preArrival: '—', welcomeHome: '—' },
];

const julyTrips: Trip[] = [
  { id: 'kenya-hastings', name: 'Kenya Safari [Deb Hastings]', lead: 'Emily S.', start: 'Aug 15', end: 'Aug 25', client: 'Deb Hastings', flights: 'Booked', hotels: 'Booked', touring: 'Booked', transfers: 'Booked', insurance: 'Done', concierge: 'In Progress', axusReview: '—', bonVoyage: '—', preArrival: '—', welcomeHome: '—' },
  { id: 'spain-stern', name: 'Spain [Stern/Gross]', lead: 'Halie M.', start: 'Sep 1', end: 'Sep 10', client: 'Stern/Gross', flights: '—', hotels: 'Quoted', touring: '—', transfers: '—', insurance: '—', concierge: '—', axusReview: '—', bonVoyage: '—', preArrival: '—', welcomeHome: '—' },
];

const completedTrips: Trip[] = [
  { id: 'scotland-mcgarey', name: 'Scotland [McGarey]', lead: 'Halie M.', start: 'May 10', end: 'May 20', client: 'McGarey', flights: 'Done', hotels: 'Done', touring: 'Done', transfers: 'Done', insurance: 'Done', concierge: 'Done', axusReview: 'Done', bonVoyage: 'Sent', preArrival: 'Sent', welcomeHome: 'Pending' },
];

const capriStages: StageDetail[] = [
  { name: 'Flights', status: 'Booked', details: ['AA 245 JFK→NAP · Jul 5', 'Return: AA 246 NAP→JFK · Jul 14'], checklist: [{ label: 'Confirmed', done: true }], updated: 'Jun 18, 2026', assignee: 'Halie M.' },
  { name: 'Hotels', status: 'Booked', details: ['Hotel Caesar Augustus · Jul 5–14', 'CONF: CA-2026-881'], checklist: [{ label: 'Confirmed', done: true }], updated: 'Jun 16, 2026', assignee: 'Halie M.' },
  { name: 'Touring', status: 'Booked', details: ['Local DMC: Capri Tours Ltd', 'Blue Grotto, Anacapri, Villa San Michele'], checklist: [{ label: 'Confirmed', done: true }], updated: 'Jun 15, 2026', assignee: 'Halie M.' },
  { name: 'Transfers', status: 'Pending', details: ['Airport → Hotel: need to book'], checklist: [{ label: 'Contact Rolzo for quote', done: false }], updated: 'Jun 14, 2026', assignee: 'Halie M.' },
  { name: 'Insurance', status: 'Quoted', details: ['Arch Insurance · Quote sent Jun 13', '7-day follow-up: Jun 20'], checklist: [{ label: 'Client response needed', done: false }], updated: 'Jun 13, 2026', assignee: 'Halie M.' },
  { name: 'Concierge', status: 'N/A', details: ['Trigger: 3 months pre-departure (Apr 5)', 'Dining reservations, spa'], checklist: [], updated: '—', assignee: 'Halie M.' },
  { name: 'AXUS Review', status: 'In Review', details: ['Itinerary uploaded Jun 18', 'Review by Jun 21'], checklist: [], updated: 'Jun 18, 2026', assignee: 'Halie M.' },
  { name: 'Bon Voyage', status: '—' as StageStatus, details: ['Auto-trigger: 2 days before departure (Jul 3)'], checklist: [], updated: '—', assignee: 'Halie M.' },
  { name: 'Pre-Arrival', status: '—' as StageStatus, details: ['Auto-trigger: 2 days before departure (Jul 3)', 'Template: Pre-Arrival Standard'], checklist: [], updated: '—', assignee: 'Halie M.' },
  { name: 'Welcome Home', status: '—' as StageStatus, details: ['Auto-trigger: 1 week after return (Jul 21)'], checklist: [], updated: '—', assignee: 'Halie M.' },
];

/* ─── Helpers ─── */
function statusStyle(s: StageStatus): React.CSSProperties {
  switch (s) {
    case 'Booked': case 'Done': case 'Confirmed':
      return { background: 'rgba(61,139,110,0.25)', color: 'var(--emerald-lt)' };
    case 'In Progress': case 'In Review':
      return { background: 'rgba(46,95,158,0.25)', color: 'var(--sapphire-lt)' };
    case 'Quoted': case 'Sent':
      return { background: 'rgba(181,96,30,0.25)', color: 'var(--cognac-lt)' };
    case 'N/A':
      return { background: 'rgba(58,69,84,0.3)', color: 'var(--slate)' };
    case 'Missing': case 'Did Not Send':
      return { background: 'rgba(155,58,58,0.25)', color: 'var(--ruby-lt)' };
    case 'Pending':
      return { background: 'rgba(181,96,30,0.25)', color: 'var(--cognac-lt)' };
    case '—': case '':
    default:
      return { background: 'var(--bg3)' };
  }
}

function stageDotColor(s: StageStatus): string {
  switch (s) {
    case 'Booked': case 'Done': case 'Confirmed': case 'Sent':
      return 'var(--emerald)';
    case 'In Progress': case 'In Review':
      return 'var(--sapphire)';
    case 'Quoted':
      return 'var(--cognac)';
    default:
      return 'var(--slate-dim)';
  }
}

const stageKeys: (keyof Trip)[] = ['flights', 'hotels', 'touring', 'transfers', 'insurance', 'concierge', 'axusReview', 'bonVoyage', 'preArrival', 'welcomeHome'];
const stageLabels: string[] = ['Flights', 'Hotels', 'Touring', 'Transfers', 'Insurance', 'Concierge', 'AXUS Review', 'Bon Voyage', 'Pre-Arrival', 'Welcome Home'];
const columnHeaders = ['Trip Name', 'Lead', 'Start', 'End', ...stageLabels];

/* ─── Component ─── */
export default function MasterTripBoard() {
  const [view, setView] = useState<'table' | 'cards' | 'detail'>('table');
  const currentView = view; // prevent TS control-flow narrowing in JSX
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [activeTab, setActiveTab] = useState('stages');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ completed: true });
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackSentiment, setFeedbackSentiment] = useState('Positive');
  const [feedbackText, setFeedbackText] = useState('');

  const toggleCollapse = (key: string) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

  const openTrip = (trip: Trip) => {
    setActiveTrip(trip);
    setActiveTab('stages');
    setView('detail');
  };

  const activeStages: StageDetail[] = activeTrip?.id === 'capri-holland'
    ? capriStages
    : stageLabels.map((name, i) => {
        const key = stageKeys[i];
        const status = (activeTrip?.[key] as StageStatus) || '—';
        return { name, status, details: [], checklist: [], updated: '—', assignee: activeTrip?.lead || '' };
      });

  /* ─── Cell renderer ─── */
  const renderStatusCell = (status: StageStatus, key: string) => {
    const st = statusStyle(status);
    const label = status === '' ? '' : status;
    return (
      <td key={key} style={{ padding: '6px 4px', textAlign: 'center' }}>
        {label && label !== '—' ? (
          <span style={{ ...st, fontSize: 10, padding: '3px 8px', borderRadius: 5, display: 'inline-block', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>
        ) : label === '—' ? (
          <span style={{ fontSize: 11, color: 'var(--slate-dim)' }}>{'—'}</span>
        ) : (
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--bg5)' }} />
        )}
      </td>
    );
  };

  /* ─── Row renderer ─── */
  const renderRow = (trip: Trip) => (
    <tr key={trip.id} onClick={() => openTrip(trip)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border2)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--ivory)', fontWeight: 500, whiteSpace: 'nowrap' }}>{trip.name}</td>
      <td style={{ padding: '10px 8px', fontSize: 11, color: 'var(--slate)' }}>{trip.lead}</td>
      <td style={{ padding: '10px 8px', fontSize: 11, color: 'var(--ivory-dim)' }}>{trip.start}</td>
      <td style={{ padding: '10px 8px', fontSize: 11, color: 'var(--ivory-dim)' }}>{trip.end}</td>
      {stageKeys.map(k => renderStatusCell(trip[k] as StageStatus, `${trip.id}-${k}`))}
    </tr>
  );

  /* ─── Month group renderer ─── */
  const renderMonthGroup = (label: string, key: string, trips: Trip[]) => (
    <div key={key} style={{ marginBottom: 16 }}>
      <div
        onClick={() => toggleCollapse(key)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: collapsed[key] ? 8 : '8px 8px 0 0', cursor: 'pointer' }}>
        <span style={{ fontSize: 11, color: 'var(--champagne)', transition: 'transform 0.2s', display: 'inline-block', transform: collapsed[key] ? 'rotate(-90deg)' : 'rotate(0deg)' }}>{'▼'}</span>
        <span style={{ fontSize: 13, color: 'var(--champagne)', fontWeight: 500, letterSpacing: 0.5 }}>{label}</span>
        <span style={{ fontSize: 10, color: 'var(--slate)', marginLeft: 4 }}>{trips.length} trip{trips.length !== 1 ? 's' : ''}</span>
      </div>
      {!collapsed[key] && (
        <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {columnHeaders.map(h => (
                  <th key={h} style={{ padding: '8px 8px', fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--slate)', textAlign: h === 'Trip Name' || h === 'Lead' ? 'left' : 'center', fontWeight: 500, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap', background: 'var(--bg3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trips.map(t => renderRow(t))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* ════════════════════════ TABLE / CARDS VIEW ════════════════════════ */}
      {(view === 'table' || view === 'cards') && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Master Trip Board</h1>
              <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>12 active trips &middot; Organized by departure month</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <button onClick={() => setView('table')}
                  style={{ padding: '7px 14px', fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', background: view === 'table' ? 'var(--champ-dim)' : 'var(--bg3)', color: view === 'table' ? 'var(--champagne)' : 'var(--slate)', border: 'none', cursor: 'pointer', fontWeight: view === 'table' ? 500 : 400 }}>
                  Table
                </button>
                <button onClick={() => setView('cards')}
                  style={{ padding: '7px 14px', fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', background: currentView === 'cards' ? 'var(--champ-dim)' : 'var(--bg3)', color: currentView === 'cards' ? 'var(--champagne)' : 'var(--slate)', border: 'none', borderLeft: '1px solid var(--border)', cursor: 'pointer', fontWeight: currentView === 'cards' ? 500 : 400 }}>
                  Cards
                </button>
              </div>
              <button className="btn btn-champ">+ Add Trip</button>
            </div>
          </div>

          {/* Table View */}
          {view === 'table' && (
            <>
              {renderMonthGroup('June 2026', 'june', juneTrips)}
              {renderMonthGroup('July 2026', 'july', julyTrips)}
              {renderMonthGroup('Completed Trips', 'completed', completedTrips)}
            </>
          )}

          {/* Cards View */}
          {view === 'cards' && (
            <>
              {[
                { label: 'June 2026', trips: juneTrips },
                { label: 'July 2026', trips: julyTrips },
                { label: 'Completed Trips', trips: completedTrips },
              ].map(group => (
                <div key={group.label} style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, color: 'var(--champagne)', fontWeight: 500, letterSpacing: 0.5, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {group.label}
                    <span style={{ fontSize: 10, color: 'var(--slate)' }}>{group.trips.length} trip{group.trips.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                    {group.trips.map(trip => {
                      const completedCount = stageKeys.filter(k => {
                        const s = trip[k] as StageStatus;
                        return s === 'Done' || s === 'Booked' || s === 'Confirmed' || s === 'Sent';
                      }).length;
                      const totalStages = stageKeys.length;
                      const pct = Math.round((completedCount / totalStages) * 100);
                      return (
                        <div key={trip.id} onClick={() => openTrip(trip)}
                          style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, cursor: 'pointer', transition: 'all 0.15s', position: 'relative', overflow: 'hidden' }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--champagne)')}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                          <div style={{ position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: '50%', background: 'var(--champ-glow)' }} />
                          <div style={{ fontSize: 14, color: 'var(--ivory)', fontWeight: 500, marginBottom: 4 }}>{trip.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 12 }}>{trip.lead} &middot; {trip.start} – {trip.end}</div>
                          <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
                            {stageKeys.map((k, i) => {
                              const s = trip[k] as StageStatus;
                              const st = statusStyle(s);
                              if (s === '—' || s === '') return null;
                              return (
                                <span key={k} style={{ ...st, fontSize: 8, padding: '2px 6px', borderRadius: 4, fontWeight: 500, whiteSpace: 'nowrap' }}>
                                  {stageLabels[i]}: {s}
                                </span>
                              );
                            })}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ flex: 1, height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? 'var(--emerald)' : 'var(--champagne)', borderRadius: 2, transition: 'width 0.3s' }} />
                            </div>
                            <span style={{ fontSize: 10, color: 'var(--slate)', whiteSpace: 'nowrap' }}>{completedCount}/{totalStages}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ════════════════════════ DETAIL VIEW ════════════════════════ */}
      {view === 'detail' && activeTrip && (
        <div>
          {/* Back + Title */}
          <div style={{ marginBottom: 20 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setView('table'); setActiveTrip(null); }} style={{ marginBottom: 12 }}>{'←'} Back to Board</button>
            <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>{activeTrip.name}</h1>
            <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>{activeTrip.client}</p>
          </div>

          {/* Status bar chips */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { l: 'Status', v: <span className="badge b-em">Active</span> },
              { l: 'Trip Lead', v: <span style={{ fontSize: 13, color: 'var(--ivory)' }}>{activeTrip.lead}</span> },
              { l: 'Departure', v: <span style={{ fontSize: 14, color: 'var(--ivory)' }}>{activeTrip.start}</span> },
              { l: 'Return', v: <span style={{ fontSize: 14, color: 'var(--ivory)' }}>{activeTrip.end}</span> },
              { l: 'Days Away', v: <span className="playfair" style={{ fontSize: 20, color: 'var(--champagne)' }}>15</span> },
            ].map((c, i) => (
              <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 18px' }}>
                <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>{c.l}</div>
                {c.v}
              </div>
            ))}
          </div>

          {/* Stage Progress Row */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px', marginBottom: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 12 }}>Stage Progress</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {stageLabels.map((lbl, i) => {
                const status = activeTrip[stageKeys[i]] as StageStatus;
                const dotColor = stageDotColor(status);
                return (
                  <div key={lbl} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: dotColor, border: `2px solid ${dotColor}`, boxShadow: status === 'Done' || status === 'Booked' || status === 'Confirmed' ? `0 0 6px ${dotColor}` : 'none' }} />
                      <span style={{ fontSize: 7, color: 'var(--slate)', textAlign: 'center', whiteSpace: 'nowrap', maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>{lbl}</span>
                    </div>
                    {i < stageLabels.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: 'var(--border)', marginTop: -14, marginLeft: 2, marginRight: 2 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tab strip */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
            {[
              { id: 'stages', l: 'Stages' },
              { id: 'tasks', l: 'Tasks' },
              { id: 'payments', l: 'Payments' },
              { id: 'docs', l: 'Documents' },
              { id: 'notes', l: 'Notes' },
              { id: 'feedback', l: 'Feedback' },
            ].map(t => (
              <div key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '11px 18px', fontSize: 11, fontWeight: activeTab === t.id ? 500 : 400, color: activeTab === t.id ? 'var(--champagne)' : 'var(--slate)', borderBottom: activeTab === t.id ? '2px solid var(--champagne)' : '2px solid transparent', cursor: 'pointer', letterSpacing: 0.8, textTransform: 'uppercase' }}>{t.l}</div>
            ))}
          </div>

          {/* ── STAGES TAB ── */}
          {activeTab === 'stages' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {activeStages.map((stage, i) => {
                const st = statusStyle(stage.status);
                return (
                  <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--slate)', fontWeight: 500 }}>{stage.name}</span>
                      <span style={{ ...st, fontSize: 10, padding: '3px 10px', borderRadius: 5, fontWeight: 500 }}>{stage.status}</span>
                    </div>
                    {stage.details.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        {stage.details.map((d, di) => (
                          <div key={di} style={{ fontSize: 11, color: 'var(--ivory-dim)', lineHeight: 1.7 }}>{d}</div>
                        ))}
                      </div>
                    )}
                    {stage.checklist.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        {stage.checklist.map((cl, ci) => (
                          <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: cl.done ? 'var(--emerald-lt)' : 'var(--ivory-dim)', marginBottom: 4 }}>
                            <span>{cl.done ? '✓' : '☐'}</span>
                            <span>{cl.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border2)' }}>
                      <span style={{ fontSize: 9, color: 'var(--slate)' }}>Updated: {stage.updated}</span>
                      <span style={{ fontSize: 9, color: 'var(--slate)' }}>{stage.assignee}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── TASKS TAB ── */}
          {activeTab === 'tasks' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}><button className="btn btn-champ btn-sm">+ Add Task</button></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { done: true, title: 'Book flights JFK → NAP', sub: 'Halie M. · Done Jun 10', badge: 'b-em', badgeText: 'Done' },
                  { done: true, title: 'Reserve Hotel Caesar Augustus', sub: 'Halie M. · Done Jun 12', badge: 'b-em', badgeText: 'Done' },
                  { done: false, title: 'Confirm airport transfers with Rolzo', sub: 'Halie M. · Due Jun 25', badge: 'b-og', badgeText: 'Due Soon' },
                  { done: false, title: 'Follow up on insurance quote', sub: 'Halie M. · Due Jun 20', badge: 'b-rb', badgeText: 'Today' },
                  { done: false, title: 'Complete AXUS itinerary review', sub: 'Halie M. · Due Jun 21', badge: 'b-sa', badgeText: 'Jun 21' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 9, cursor: 'pointer' }}>
                    <div className={`cl-check${t.done ? ' done' : ''}`}>{t.done && <span style={{ fontSize: 9, color: 'white' }}>{'✓'}</span>}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 400 }}>{t.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--slate)' }}>{t.sub}</div>
                    </div>
                    <span className={`badge ${t.badge}`}>{t.badgeText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PAYMENTS TAB ── */}
          {activeTab === 'payments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}><button className="btn btn-champ btn-sm">+ Add Milestone</button></div>
              <div className="card">
                {[
                  { name: 'Deposit (25%)', sub: 'Paid May 20, 2026', subColor: 'var(--slate)', amount: '$4,200', badge: 'b-em', badgeText: 'Paid' },
                  { name: '2nd Payment (50%)', sub: 'Due Jun 25 · Auto-reminder Jun 20 & 24', subColor: 'var(--cognac-lt)', amount: '$8,400', badge: 'b-og', badgeText: 'Due Soon' },
                  { name: 'Final Balance (25%)', sub: 'Due Jul 1 · Auto-reminder Jun 25 & 30', subColor: 'var(--slate)', amount: '$4,200', badge: 'b-mu', badgeText: 'Pending' },
                ].map((p, i, arr) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < arr.length - 1 ? '1px solid var(--border2)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--ivory)', fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: p.subColor, marginTop: 2 }}>{p.sub}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="playfair" style={{ fontSize: 20, color: 'var(--champagne)' }}>{p.amount}</div>
                      <span className={`badge ${p.badge}`} style={{ marginTop: 4, display: 'inline-block' }}>{p.badgeText}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DOCUMENTS TAB ── */}
          {activeTab === 'docs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}><button className="btn btn-champ btn-sm">Upload</button></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { icon: '✈', name: 'AA_Tickets_Holland.pdf', size: '310 KB · Jun 10', badge: 'b-em', badgeText: 'Confirmed' },
                  { icon: '🏨', name: 'CaesarAugustus_Conf.pdf', size: '225 KB · Jun 12', badge: 'b-em', badgeText: 'Confirmed' },
                  { icon: '📋', name: 'Insurance_Quote_Arch.pdf', size: '180 KB · Jun 13', badge: 'b-og', badgeText: 'Quoted' },
                  { icon: '📋', name: 'Capri_Tours_Itinerary.pdf', size: '420 KB · Jun 15', badge: 'b-em', badgeText: 'Confirmed' },
                ].map((d, i) => (
                  <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, cursor: 'pointer' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{d.icon}</div>
                    <div style={{ fontSize: 11, color: 'var(--ivory)' }}>{d.name}</div>
                    <div style={{ fontSize: 9, color: 'var(--slate)', marginTop: 3 }}>{d.size}</div>
                    <span className={`badge ${d.badge}`} style={{ marginTop: 8, display: 'inline-block' }}>{d.badgeText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NOTES TAB ── */}
          {activeTab === 'notes' && (
            <div className="card">
              <div className="card-b">
                <textarea style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Jost', fontSize: 12, color: 'var(--ivory-dim)', fontWeight: 300, minHeight: 200, resize: 'none', lineHeight: 1.7 }} defaultValue={'Client prefers aisle seats on flights.\nHotel Caesar Augustus: request room with Faraglioni view.\nDining: Reserve Da Paolino (lemon tree restaurant) for Jul 8.\nBlue Grotto tour: early morning slot preferred (less crowded).\nClient anniversary Jul 10 — arrange champagne & flowers at hotel.'} />
              </div>
            </div>
          )}

          {/* ── FEEDBACK TAB ── */}
          {activeTab === 'feedback' && (
            <div>
              <div className="card" style={{ padding: 24 }}>
                <h3 className="playfair" style={{ fontSize: 18, fontWeight: 400, color: 'var(--ivory)', marginBottom: 20 }}>Post-Trip Client Feedback</h3>

                {/* Rating */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8 }}>Rating</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} onClick={() => setFeedbackRating(star)} style={{ fontSize: 24, cursor: 'pointer', color: star <= feedbackRating ? 'var(--champagne)' : 'var(--slate-dim)', transition: 'color 0.15s' }}>{'★'}</span>
                    ))}
                  </div>
                </div>

                {/* Sentiment */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8 }}>Sentiment</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Positive', 'Neutral', 'Negative'].map(s => {
                      const selected = feedbackSentiment === s;
                      const bgMap: Record<string, string> = { Positive: 'rgba(61,139,110,0.25)', Neutral: 'rgba(46,95,158,0.25)', Negative: 'rgba(155,58,58,0.25)' };
                      const colorMap: Record<string, string> = { Positive: 'var(--emerald-lt)', Neutral: 'var(--sapphire-lt)', Negative: 'var(--ruby-lt)' };
                      return (
                        <button key={s} onClick={() => setFeedbackSentiment(s)} style={{ padding: '6px 16px', fontSize: 11, borderRadius: 6, border: selected ? 'none' : '1px solid var(--border)', background: selected ? bgMap[s] : 'var(--bg3)', color: selected ? colorMap[s] : 'var(--slate)', cursor: 'pointer', fontWeight: selected ? 500 : 400 }}>{s}</button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback text */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8 }}>Feedback</div>
                  <textarea className="td-input" value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Enter client feedback..." style={{ width: '100%', minHeight: 120, resize: 'vertical', fontFamily: 'Jost', fontSize: 12, lineHeight: 1.7, color: 'var(--ivory-dim)', fontWeight: 300 }} />
                </div>

                {/* Save button */}
                <button className="btn btn-champ">Save to Feedback Board</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
