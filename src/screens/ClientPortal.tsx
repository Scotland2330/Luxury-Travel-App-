import { useState } from 'react';

const portalSections = [
  { key: 'tripDetails', label: 'Trip Details', default: true },
  { key: 'documents', label: 'Documents', default: true },
  { key: 'payments', label: 'Payments', default: true },
  { key: 'feedback', label: 'Feedback Form', default: true },
  { key: 'itinerary', label: 'Itinerary', default: true },
  { key: 'travelDocs', label: 'Travel Documents', default: true },
  { key: 'communications', label: 'Communications', default: false },
];

const clients = [
  { name: 'Holland, Augusta', trip: 'Capri', code: 'holland-augusta-capri' },
  { name: 'Diaz, Maria', trip: 'DC Business', code: 'diaz-maria-dc' },
  { name: 'Baker, Sean', trip: 'Westlake', code: 'baker-sean-westlake' },
  { name: 'McGarey, Patrick & Cristin', trip: 'Scotland', code: 'mcgarey-scotland' },
];

const itinerary = [
  { day: 1, date: 'Jul 5', label: 'Arrive Naples, private transfer to Capri, check-in Hotel Caesar Augustus' },
  { day: 2, date: 'Jul 6', label: 'Blue Grotto morning tour' },
  { day: 3, date: 'Jul 7', label: 'Anacapri & Villa San Michele' },
  { day: 4, date: 'Jul 8', label: 'Da Paolino dinner reservation (lemon tree)' },
  { day: '5-8', date: 'Jul 9-12', label: 'Free days / beach / optional activities' },
  { day: 9, date: 'Jul 14', label: 'Check-out, transfer to Naples, flight home' },
];

const documents = [
  { name: 'Flight Confirmation', file: 'AA_Tickets_Holland.pdf', icon: '✈' },
  { name: 'Hotel Confirmation', file: 'CaesarAugustus_Conf.pdf', icon: '\u{1F3E8}' },
  { name: 'Insurance Quote', file: 'Insurance_Quote_Arch.pdf', icon: '\u{1F6E1}' },
  { name: 'Travel Insurance Info', file: 'Policy_Details.pdf', icon: '\u{1F4CB}' },
];

const payments = [
  { label: 'Deposit 25%', amount: '$4,200', status: 'PAID', badge: 'b-em' },
  { label: '2nd Payment 50%', amount: '$8,400', status: 'DUE JUN 25', badge: 'b-og' },
  { label: 'Final Balance 25%', amount: '$4,200', status: 'PENDING', badge: 'b-mu' },
];

/* ------------------------------------------------------------------ */
/*  Advisor View                                                       */
/* ------------------------------------------------------------------ */

function AdvisorView({
  selectedClient,
  setSelectedClient,
  sections,
  toggleSection,
}: {
  selectedClient: string;
  setSelectedClient: (v: string) => void;
  sections: Record<string, boolean>;
  toggleSection: (key: string) => void;
}) {
  const portalUrl = `https://portal.meridiantravel.co/${selectedClient}`;

  return (
    <>
      {/* Actions row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button
          className="btn btn-champ"
          onClick={() => navigator.clipboard?.writeText(portalUrl)}
        >
          Copy Portal Link
        </button>
        <button className="btn btn-ghost">Customize Portal</button>
      </div>

      {/* Client selector */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-h">
          <span className="card-t">Client Preview</span>
        </div>
        <div className="card-b">
          <label style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 6, display: 'block' }}>
            Select client portal to preview
          </label>
          <select
            className="td-input"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            {clients.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} — {c.trip}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two-column layout: sections + branding */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Portal Sections */}
        <div className="card">
          <div className="card-h">
            <span className="card-t">Portal Sections</span>
          </div>
          <div className="card-b" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {portalSections.map((s) => (
              <div
                key={s.key}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span style={{ fontSize: 12, color: 'var(--ivory)' }}>{s.label}</span>
                <div
                  className={`toggle${sections[s.key] ? ' on' : ''}`}
                  onClick={() => toggleSection(s.key)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Branding */}
        <div className="card">
          <div className="card-h">
            <span className="card-t">Branding</span>
          </div>
          <div className="card-b" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Logo placeholder */}
            <div>
              <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                Agency Logo
              </div>
              <div
                style={{
                  width: '100%',
                  height: 64,
                  background: 'var(--bg4)',
                  border: '1px dashed var(--border)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  color: 'var(--slate)',
                }}
              >
                MERIDIAN TRAVEL (Logo Placeholder)
              </div>
            </div>

            {/* Accent color */}
            <div>
              <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                Accent Color
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))',
                    border: '2px solid var(--champagne)',
                  }}
                />
                <span style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>Champagne / Cognac</span>
              </div>
            </div>

            {/* Portal link */}
            <div>
              <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                Portal Link
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--bg4)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 12px',
                }}
              >
                <span
                  style={{
                    flex: 1,
                    fontSize: 10,
                    color: 'var(--champagne)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {portalUrl}
                </span>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => navigator.clipboard?.writeText(portalUrl)}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Client View (branded portal preview)                               */
/* ------------------------------------------------------------------ */

function ClientView() {
  const [starRating, setStarRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const sectionTitle = (label: string) => (
    <div
      style={{
        fontSize: 9,
        letterSpacing: 2.5,
        textTransform: 'uppercase' as const,
        color: 'var(--slate)',
        marginBottom: 14,
        marginTop: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      {label}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );

  return (
    /* Browser mockup frame */
    <div
      style={{
        maxWidth: 660,
        margin: '0 auto',
        border: '1px solid var(--champagne)',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 12px 48px rgba(59,154,156,0.08), 0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      {/* Browser bar */}
      <div
        style={{
          background: 'var(--bg4)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ruby-lt)', opacity: 0.6 }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cognac-lt)', opacity: 0.6 }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-lt)', opacity: 0.6 }} />
        <div
          style={{
            flex: 1,
            marginLeft: 8,
            background: 'var(--bg3)',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 9,
            color: 'var(--slate)',
            letterSpacing: 0.3,
          }}
        >
          portal.meridiantravel.co/holland-augusta-capri
        </div>
      </div>

      {/* Portal content */}
      <div style={{ background: 'var(--bg2)', padding: 32 }}>
        {/* Agency header */}
        <div style={{ textAlign: 'center', paddingBottom: 24, borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
          <div
            className="playfair"
            style={{
              fontSize: 24,
              letterSpacing: 4,
              background: 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            MERIDIAN TRAVEL
          </div>
          <div style={{ width: 50, height: 1, background: 'var(--champagne)', opacity: 0.35, margin: '12px auto' }} />
          <div style={{ fontSize: 13, color: 'var(--ivory-dim)', fontWeight: 300 }}>
            Welcome back, <span style={{ color: 'var(--ivory)' }}>Augusta</span>
          </div>
        </div>

        {/* -------- TRIP SUMMARY -------- */}
        {sectionTitle('Your Trip')}
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 4,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div className="playfair" style={{ fontSize: 22, color: 'var(--ivory)' }}>Capri</div>
              <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 3 }}>Jul 5-14 &middot; 9 nights</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="playfair" style={{ fontSize: 28, color: 'var(--champagne)', lineHeight: 1 }}>15</div>
              <div style={{ fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)' }}>days away</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 12 }}>
            Trip Lead: <span style={{ color: 'var(--ivory-dim)' }}>Halie M.</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="badge b-em">Flights: Booked</span>
            <span className="badge b-em">Hotels: Booked</span>
            <span className="badge b-sa">Insurance: Quoted</span>
          </div>
        </div>

        {/* -------- ITINERARY -------- */}
        {sectionTitle('Itinerary')}
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 4,
          }}
        >
          {itinerary.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '13px 18px',
                borderBottom: i < itinerary.length - 1 ? '1px solid var(--border2)' : 'none',
              }}
            >
              <div
                style={{
                  minWidth: 44,
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)' }}>
                  Day {item.day}
                </div>
                <div style={{ fontSize: 11, color: 'var(--champagne)', fontWeight: 500, marginTop: 2 }}>
                  {item.date}
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ivory-dim)', lineHeight: 1.5 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* -------- DOCUMENTS -------- */}
        {sectionTitle('Documents')}
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 4,
          }}
        >
          {documents.map((doc, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: i < documents.length - 1 ? '1px solid var(--border2)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--champ-glow)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16 }}>{doc.icon}</span>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ivory)' }}>{doc.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 2 }}>{doc.file}</div>
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--champagne)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
          ))}
        </div>

        {/* -------- PAYMENTS -------- */}
        {sectionTitle('Payments')}
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 18,
            marginBottom: 4,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {payments.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'var(--bg4)',
                  borderRadius: 8,
                  border: '1px solid var(--border2)',
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ivory)' }}>{p.label}</div>
                  <div className="playfair" style={{ fontSize: 18, color: 'var(--champagne)', marginTop: 2 }}>
                    {p.amount}
                  </div>
                </div>
                <span className={`badge ${p.badge}`}>{p.status}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border)',
              paddingTop: 14,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Total Trip Cost
            </span>
            <span className="playfair" style={{ fontSize: 22, color: 'var(--champagne)' }}>$16,800</span>
          </div>

          <button className="btn btn-champ" style={{ width: '100%', padding: 11 }}>
            Pay Now &mdash; $8,400 Due Jun 25
          </button>
        </div>

        {/* -------- FEEDBACK -------- */}
        {sectionTitle('Feedback')}
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 4,
          }}
        >
          <div style={{ fontSize: 13, color: 'var(--ivory)', marginBottom: 14, fontWeight: 400 }}>
            How was your trip?
          </div>

          {/* Star rating */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                onClick={() => setStarRating(star)}
                onMouseEnter={() => setHoverStar(star)}
                onMouseLeave={() => setHoverStar(0)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 18,
                  background: star <= (hoverStar || starRating) ? 'var(--champ-dim)' : 'var(--bg4)',
                  border: `1px solid ${star <= (hoverStar || starRating) ? 'var(--champagne)' : 'var(--border)'}`,
                  color: star <= (hoverStar || starRating) ? 'var(--champagne)' : 'var(--slate-dim)',
                  transition: 'all 0.15s',
                }}
              >
                {star <= (hoverStar || starRating) ? '★' : '☆'}
              </div>
            ))}
          </div>

          <textarea
            className="td-input"
            placeholder="Share your experience..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={3}
            style={{ resize: 'vertical', marginBottom: 12 }}
          />

          <button className="btn btn-champ" style={{ width: '100%', padding: 10 }}>
            Submit Feedback
          </button>

          <div style={{ fontSize: 10, color: 'var(--slate)', textAlign: 'center', marginTop: 10 }}>
            Your feedback helps us create even better experiences
          </div>
        </div>

        {/* -------- CONTACT -------- */}
        {sectionTitle('Your Advisor')}
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
          }}
        >
          {/* Avatar placeholder */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: 18,
              color: 'var(--bg)',
              fontWeight: 600,
            }}
          >
            HM
          </div>
          <div style={{ fontSize: 14, color: 'var(--ivory)', fontWeight: 400, marginBottom: 4 }}>Halie M.</div>
          <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 2 }}>halie@meridiantravel.co</div>
          <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 14 }}>(555) 234-5678</div>
          <button className="btn btn-ghost" style={{ width: '100%', padding: 10 }}>
            Message Your Advisor
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: 9, color: 'var(--slate-dim)', marginTop: 24, letterSpacing: 0.5 }}>
          Powered by Meridian Travel &middot; Luxury Travel, Curated for You
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ClientPortal() {
  const [view, setView] = useState<'advisor' | 'client'>('advisor');
  const [selectedClient, setSelectedClient] = useState(clients[0].code);
  const [sections, setSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const s of portalSections) {
      init[s.key] = s.default;
    }
    return init;
  });

  const toggleSection = (key: string) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>
            Client Portal
          </h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>
            Branded client-facing view &middot; Manage what your clients see
          </p>
        </div>

        {/* Segmented control */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <button
            className="btn"
            onClick={() => setView('advisor')}
            style={{
              borderRadius: 0,
              border: 'none',
              background: view === 'advisor'
                ? 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))'
                : 'transparent',
              color: view === 'advisor' ? 'var(--bg)' : 'var(--slate)',
              padding: '8px 18px',
              fontSize: 10,
            }}
          >
            Advisor View
          </button>
          <button
            className="btn"
            onClick={() => setView('client')}
            style={{
              borderRadius: 0,
              border: 'none',
              background: view === 'client'
                ? 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))'
                : 'transparent',
              color: view === 'client' ? 'var(--bg)' : 'var(--slate)',
              padding: '8px 18px',
              fontSize: 10,
            }}
          >
            Client View
          </button>
        </div>
      </div>

      {/* View content */}
      {view === 'advisor' ? (
        <AdvisorView
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          sections={sections}
          toggleSection={toggleSection}
        />
      ) : (
        <ClientView />
      )}
    </div>
  );
}
