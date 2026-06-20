import { useState } from 'react';

const feedbackData = [
  { client: 'Deb Hastings', location: 'Kenya', feedback: 'The day in Nairobi was truly wonderful and I...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Patrick + Cristin McGarey', location: 'Scotland', feedback: 'What did you love most about your trip? Pitl...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: "O'Brien", location: 'Palm Heights', feedback: 'The Palm Heights hotel was perfect for our R&R...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Kim Jones', location: 'Italy', feedback: '1. What did you love most about your trip? Honestly, this trip wa...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Michael Hokenson', location: 'Italy', feedback: 'Very sophisticated/well-traveled people there...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Hillebrand/Hancock', location: 'Italy', feedback: 'What we loved most: the hotels (all so chic, boutique, pretty...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Stern/Gross', location: 'Spain', feedback: 'Things we loved: Your hotel recommendatio...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Bingham', location: 'Amsterdam/Belgium', feedback: 'We enjoyed Zwaantje, the low key, tradition...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Killian', location: 'Kenya', feedback: '1. Amazing trip. Forgetting that we were at a...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Vishal Amin', location: 'Maroma (Mexico)', feedback: 'Belmond Maroma has been fantastic. We w...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Michael & Doug Petry', location: 'Italy', feedback: 'Our trip was wonderful. The house was exac...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Susan Kelleher', location: 'Italy', feedback: 'Anna our first day guide was amazing. She k...', sentiment: 'Loved it!', sentimentEmoji: '\u{1F60D}', rating: 4 },
  { client: 'Michael Hokenson (SB)', location: 'California', feedback: 'What did you love about your trip? Sitt...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Sarah Barker', location: 'Bhutan', feedback: 'Everything was wonderful in Bhutan. The pe...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Julia Lewis', location: 'NYC Hotels', feedback: 'The Carlyle. I love an old school iconic hotel...', sentiment: 'Positive', sentimentEmoji: '\u{1F929}', rating: 5 },
  { client: 'Christian Mudgett', location: 'Puerto Rico', feedback: 'PR was great. Hotel (no fault of yours as I told you to book it)...', sentiment: 'Neutral', sentimentEmoji: '\u{1F610}', rating: 4 },
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
  if (sentiment === 'Neutral') return 'b-og';
  if (sentiment === 'Loved it!') return 'b-ch';
  return 'b-mu';
}

function Stars({ count }: { count: number }) {
  return (
    <span style={{ fontSize: 12, letterSpacing: 2 }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ color: 'var(--champagne)' }}>{'⭐'}</span>
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

export default function ClientFeedback() {
  const [view, setView] = useState<'table' | 'board'>('table');

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Client Feedback</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4, letterSpacing: 0.5 }}>
            Post-trip insights &middot; 16 responses &middot; Avg 4.8 &#9733;
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
                borderRight: '1px solid var(--border)',
                border: 'none',
                borderRightStyle: 'solid',
                borderRightWidth: 1,
                borderRightColor: 'var(--border)',
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
          <button className="btn btn-champ">+ Add Feedback</button>
        </div>
      </div>

      {/* Table View */}
      {view === 'table' && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                {['Client', 'Location', 'Feedback Details', 'Sentiment', 'Rating'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feedbackData.map((f, i) => {
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
                    <td style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ivory-dim)', fontSize: 11 }}>
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
    </div>
  );
}
