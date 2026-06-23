import { useState, useMemo } from 'react';

type FeedbackRow = {
  client: string;
  location: string;
  feedback: string;
  sentiment: string;
  sentimentEmoji: string;
  rating: number;
  source: 'Client Portal' | 'Manual Entry';
  date: string;
};

const feedbackData: FeedbackRow[] = [
  { client: 'Deb Hastings', location: 'Kenya', feedback: 'The day in Nairobi was truly wonderful and I...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-12-10' },
  { client: 'Patrick + Cristin McGarey', location: 'Scotland', feedback: 'What did you love most about your trip? Pitl...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-11-22' },
  { client: "O'Brien", location: 'Palm Heights', feedback: 'The Palm Heights hotel was perfect for our R&R...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-11-15' },
  { client: 'Kim Jones', location: 'Italy', feedback: '1. What did you love most about your trip? Honestly, this trip wa...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-10-30' },
  { client: 'Michael Hokenson', location: 'Italy', feedback: 'Very sophisticated/well-traveled people there...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-10-18' },
  { client: 'Hillebrand/Hancock', location: 'Italy', feedback: 'What we loved most: the hotels (all so chic, boutique, pretty...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-10-05' },
  { client: 'Stern/Gross', location: 'Spain', feedback: 'Things we loved: Your hotel recommendatio...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-09-20' },
  { client: 'Bingham', location: 'Amsterdam/Belgium', feedback: 'We enjoyed Zwaantje, the low key, tradition...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Manual Entry', date: '2025-09-12' },
  { client: 'Killian', location: 'Kenya', feedback: '1. Amazing trip. Forgetting that we were at a...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-09-01' },
  { client: 'Vishal Amin', location: 'Maroma (Mexico)', feedback: 'Belmond Maroma has been fantastic. We w...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-08-25' },
  { client: 'Michael & Doug Petry', location: 'Italy', feedback: 'Our trip was wonderful. The house was exac...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-08-14' },
  { client: 'Susan Kelleher', location: 'Italy', feedback: 'Anna our first day guide was amazing. She k...', sentiment: 'Loved It', sentimentEmoji: '\u{1F60D}', rating: 4, source: 'Client Portal', date: '2025-08-02' },
  { client: 'Michael Hokenson (SB)', location: 'California', feedback: 'What did you love about your trip? Sitt...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-07-20' },
  { client: 'Sarah Barker', location: 'Bhutan', feedback: 'Everything was wonderful in Bhutan. The pe...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Manual Entry', date: '2025-07-10' },
  { client: 'Julia Lewis', location: 'NYC Hotels', feedback: 'The Carlyle. I love an old school iconic hotel...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5, source: 'Client Portal', date: '2025-06-28' },
  { client: 'Christian Mudgett', location: 'Puerto Rico', feedback: 'PR was great. Hotel (no fault of yours as I told you to book it)...', sentiment: 'Mixed', sentimentEmoji: '\u{1F610}', rating: 4, source: 'Client Portal', date: '2025-06-15' },
];

const locationColors: Record<string, { bg: string; color: string }> = {
  'Kenya': { bg: 'rgba(61,139,110,0.22)', color: 'var(--emerald-lt)' },
  'Scotland': { bg: 'rgba(46,95,158,0.22)', color: 'var(--sapphire-lt)' },
  'Palm Heights': { bg: 'rgba(181,96,30,0.22)', color: 'var(--cognac-lt)' },
  'Italy': { bg: 'rgba(155,58,58,0.22)', color: 'var(--ruby-lt)' },
  'Spain': { bg: 'rgba(181,96,30,0.22)', color: 'var(--cognac-lt)' },
  'Amsterdam/Belgium': { bg: 'rgba(107,61,155,0.22)', color: 'var(--amethyst)' },
  'Maroma (Mexico)': { bg: 'rgba(181,96,30,0.22)', color: 'var(--cognac-lt)' },
  'California': { bg: 'rgba(181,96,30,0.22)', color: 'var(--cognac-lt)' },
  'Bhutan': { bg: 'rgba(181,96,30,0.22)', color: 'var(--cognac-lt)' },
  'NYC Hotels': { bg: 'rgba(58,69,84,0.4)', color: 'var(--slate)' },
  'Puerto Rico': { bg: 'rgba(192,80,80,0.18)', color: '#d48a8a' },
  'Florida': { bg: 'rgba(192,80,80,0.18)', color: '#d48a8a' },
  'Grand Canyon/Sedona': { bg: 'rgba(155,58,58,0.22)', color: 'var(--ruby-lt)' },
};

function sentimentBadgeClass(sentiment: string) {
  if (sentiment === 'Positive') return 'b-em';
  if (sentiment === 'Mixed') return 'b-og';
  if (sentiment === 'Loved It') return 'b-ch';
  return 'b-mu';
}

function Stars({ count }: { count: number }) {
  return (
    <span style={{ fontSize: 12, letterSpacing: 2 }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ color: 'var(--champagne)' }}>{'*'}</span>
      ))}
    </span>
  );
}

const kanbanColumns = [
  { destination: 'Palm Heights', headerColor: 'var(--cognac)', headerBg: 'rgba(181,96,30,0.25)' },
  { destination: 'Scotland', headerColor: 'var(--sapphire-lt)', headerBg: 'rgba(46,95,158,0.25)' },
  { destination: 'Italy', headerColor: 'var(--ruby-lt)', headerBg: 'rgba(155,58,58,0.25)' },
  { destination: 'NYC Hotels', headerColor: 'var(--slate)', headerBg: 'rgba(58,69,84,0.35)' },
  { destination: 'Puerto Rico', headerColor: '#d48a8a', headerBg: 'rgba(192,80,80,0.2)' },
  { destination: 'Kenya', headerColor: 'var(--emerald-lt)', headerBg: 'rgba(61,139,110,0.25)' },
];

const destinationFilterOptions = ['All', 'Italy', 'Scotland', 'Palm Heights', 'NYC Hotels', 'Puerto Rico', 'Kenya'];
const sentimentFilterOptions = ['All', 'Positive', 'Loved It', 'Mixed'];
const ratingFilterOptions = ['All', '5', '4', '3'];
const sortOptions = ['Client Name', 'Rating', 'Date'] as const;

type SortKey = 'client' | 'rating' | 'date';
type SortDir = 'asc' | 'desc';

const clientList = ['Deb Hastings', 'Patrick + Cristin McGarey', "O'Brien", 'Kim Jones', 'Michael Hokenson', 'Hillebrand/Hancock', 'Stern/Gross', 'Bingham', 'Killian', 'Vishal Amin', 'Michael & Doug Petry', 'Susan Kelleher', 'Sarah Barker', 'Julia Lewis', 'Christian Mudgett'];
const tripList = ['Kenya Safari 2025', 'Scotland Highlands Tour', 'Palm Heights Getaway', 'Italy Grand Tour', 'NYC Hotel Circuit', 'Puerto Rico Escape', 'Bhutan Adventure', 'California Coast'];

export default function ClientFeedback() {
  const [view, setView] = useState<'table' | 'board'>('table');
  const [filterDest, setFilterDest] = useState('All');
  const [filterSentiment, setFilterSentiment] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [sortBy, setSortBy] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqClient, setReqClient] = useState('');
  const [reqTrip, setReqTrip] = useState('');

  const filteredAndSorted = useMemo(() => {
    let rows = [...feedbackData];

    if (filterDest !== 'All') rows = rows.filter(r => r.location === filterDest);
    if (filterSentiment !== 'All') rows = rows.filter(r => r.sentiment === filterSentiment);
    if (filterRating !== 'All') rows = rows.filter(r => r.rating === Number(filterRating));

    rows.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'client') cmp = a.client.localeCompare(b.client);
      else if (sortBy === 'rating') cmp = a.rating - b.rating;
      else if (sortBy === 'date') cmp = a.date.localeCompare(b.date);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return rows;
  }, [filterDest, filterSentiment, filterRating, sortBy, sortDir]);

  function handleColumnSort(key: SortKey) {
    if (sortBy === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  }

  function sortArrow(key: SortKey) {
    if (sortBy !== key) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  }

  function handleSortDropdown(val: string) {
    if (val === 'Client Name') { setSortBy('client'); setSortDir('asc'); }
    else if (val === 'Rating') { setSortBy('rating'); setSortDir('desc'); }
    else if (val === 'Date') { setSortBy('date'); setSortDir('desc'); }
  }

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Client Feedback</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4, letterSpacing: 0.5 }}>
            Post-trip insights &middot; {feedbackData.length} responses &middot; Avg {(feedbackData.reduce((s, f) => s + f.rating, 0) / feedbackData.length).toFixed(1)} &#9733;
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <button
              className="btn btn-xs"
              onClick={() => setView('table')}
              style={{
                borderRadius: 0,
                background: view === 'table' ? 'var(--bg5)' : 'transparent',
                color: view === 'table' ? 'var(--champagne)' : 'var(--slate)',
                border: 'none',
                borderRight: '1px solid var(--border)',
              }}
            >
              Table
            </button>
            <button
              className="btn btn-xs"
              onClick={() => setView('board')}
              style={{
                borderRadius: 0,
                background: view === 'board' ? 'var(--bg5)' : 'transparent',
                color: view === 'board' ? 'var(--champagne)' : 'var(--slate)',
                border: 'none',
              }}
            >
              Board
            </button>
          </div>
          <button className="btn btn-ghost" onClick={() => setShowRequestModal(true)}>Request Feedback</button>
          <button className="btn btn-champ">+ Add Feedback</button>
        </div>
      </div>

      {/* Filters (table view only) */}
      {view === 'table' && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginRight: 6 }}>Destination</label>
            <select className="td-input" value={filterDest} onChange={e => setFilterDest(e.target.value)} style={{ width: 140, padding: '6px 10px', fontSize: 11 }}>
              {destinationFilterOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginRight: 6 }}>Sentiment</label>
            <select className="td-input" value={filterSentiment} onChange={e => setFilterSentiment(e.target.value)} style={{ width: 120, padding: '6px 10px', fontSize: 11 }}>
              {sentimentFilterOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginRight: 6 }}>Rating</label>
            <select className="td-input" value={filterRating} onChange={e => setFilterRating(e.target.value)} style={{ width: 100, padding: '6px 10px', fontSize: 11 }}>
              {ratingFilterOptions.map(o => <option key={o} value={o}>{o === 'All' ? 'All' : `${o} stars`}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginRight: 6 }}>Sort by</label>
            <select className="td-input" value={sortOptions.find((_, i) => (['client', 'rating', 'date'] as SortKey[])[i] === sortBy) || 'Date'} onChange={e => handleSortDropdown(e.target.value)} style={{ width: 130, padding: '6px 10px', fontSize: 11 }}>
              {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <span style={{ fontSize: 10, color: 'var(--slate-dim)', marginLeft: 4 }}>
            {filteredAndSorted.length} of {feedbackData.length} shown
          </span>
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleColumnSort('client')}>Client{sortArrow('client')}</th>
                <th>Location</th>
                <th>Feedback Details</th>
                <th>Sentiment</th>
                <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleColumnSort('rating')}>Rating{sortArrow('rating')}</th>
                <th>Source</th>
                <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleColumnSort('date')}>Date{sortArrow('date')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((f, i) => {
                const loc = locationColors[f.location] || { bg: 'rgba(58,69,84,0.3)', color: 'var(--slate)' };
                return (
                  <tr key={i}>
                    <td className="td-main">{f.client}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 500,
                          letterSpacing: 0.5,
                          background: loc.bg,
                          color: loc.color,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {f.location}
                      </span>
                    </td>
                    <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ivory-dim)', fontSize: 11 }}>
                      &ldquo;{f.feedback}&rdquo;
                    </td>
                    <td>
                      <span className={`badge ${sentimentBadgeClass(f.sentiment)}`}>
                        {f.sentimentEmoji} {f.sentiment}
                      </span>
                    </td>
                    <td>
                      <Stars count={f.rating} />
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: 5,
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: 0.5,
                        background: f.source === 'Client Portal' ? 'rgba(61,139,110,0.15)' : 'rgba(58,69,84,0.3)',
                        color: f.source === 'Client Portal' ? 'var(--emerald-lt)' : 'var(--slate)',
                      }}>
                        {f.source}
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--slate)', whiteSpace: 'nowrap' }}>
                      {new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Board View (Kanban by Destination) */}
      {view === 'board' && (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
          {kanbanColumns.map(col => {
            const cards = feedbackData.filter(f => f.location === col.destination);
            return (
              <div
                key={col.destination}
                style={{
                  minWidth: 280,
                  maxWidth: 300,
                  flexShrink: 0,
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                {/* Column header */}
                <div
                  style={{
                    padding: '10px 16px',
                    background: col.headerBg,
                    borderBottom: `2px solid ${col.headerColor}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 500, color: col.headerColor, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    {col.destination}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--slate)', background: 'var(--bg4)', padding: '2px 7px', borderRadius: 4 }}>
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cards.map((card, ci) => (
                    <div
                      key={ci}
                      style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        padding: 14,
                        cursor: 'pointer',
                        transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--champagne)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                    >
                      <div style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 500, marginBottom: 6 }}>
                        {card.client}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 9,
                            fontWeight: 500,
                            letterSpacing: 0.6,
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: 4,
                            borderLeft: '3px solid var(--emerald)',
                            background: 'rgba(61,139,110,0.12)',
                            color: 'var(--emerald-lt)',
                          }}
                        >
                          {card.sentimentEmoji} {card.sentiment}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--ivory-dim)',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginBottom: 10,
                        }}
                      >
                        &ldquo;{card.feedback}&rdquo;
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 9, color: 'var(--slate)' }}>
                        <span style={{ cursor: 'pointer' }} title="Comment">&#128172; Comment</span>
                        <span style={{ cursor: 'pointer' }} title="Share">&#8599; Share</span>
                      </div>
                    </div>
                  ))}

                  {/* Add client button */}
                  <button
                    style={{
                      background: 'transparent',
                      border: '1px dashed var(--border)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: 'var(--slate)',
                      fontSize: 10,
                      cursor: 'pointer',
                      fontFamily: 'Jost',
                      transition: 'color 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--champagne)'; e.currentTarget.style.borderColor = 'var(--champagne)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--slate)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    + Add client
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Request Feedback Modal */}
      {showRequestModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
          }}
          onClick={() => setShowRequestModal(false)}
        >
          <div
            style={{
              background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
              padding: 28, width: 400, boxShadow: 'var(--shadow)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ivory)', marginBottom: 4 }}>Request Feedback</div>
            <div style={{ fontSize: 10, color: 'var(--slate)', marginBottom: 20 }}>
              Send a feedback request via the Client Portal
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Client</div>
              <select className="td-input" value={reqClient} onChange={e => setReqClient(e.target.value)}>
                <option value="">Select a client...</option>
                {clientList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Trip</div>
              <select className="td-input" value={reqTrip} onChange={e => setReqTrip(e.target.value)}>
                <option value="">Select a trip...</option>
                {tripList.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ fontSize: 10, color: 'var(--slate-dim)', marginBottom: 20, padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border2)', lineHeight: 1.5 }}>
              Automated feedback requests are sent 1 week after trip end date
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowRequestModal(false)}>Cancel</button>
              <button className="btn btn-champ btn-sm" onClick={() => setShowRequestModal(false)}>Send via Client Portal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
