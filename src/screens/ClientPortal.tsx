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
  { name: 'Flight Confirmation', file: 'AA_Tickets_Holland.pdf', icon: '✈', secure: false },
  { name: 'Hotel Confirmation', file: 'CaesarAugustus_Conf.pdf', icon: '\u{1F3E8}', secure: false },
  { name: 'Insurance Quote', file: 'Insurance_Quote_Arch.pdf', icon: '\u{1F6E1}', secure: false },
  { name: 'Travel Insurance Info', file: 'Policy_Details.pdf', icon: '\u{1F4CB}', secure: false },
];

const secureDocuments = [
  { name: 'Passport — Augusta Holland', file: 'Passport_AHolland.jpg', icon: '◩', shared: ['Italia Luxury Travel'], expiry: 'Dec 2028' },
  { name: 'Passport — David Holland', file: 'Passport_DHolland.jpg', icon: '◩', shared: [], expiry: 'Mar 2027' },
  { name: 'CC Authorization Form', file: 'CC_Auth_Holland.pdf', icon: '◆', shared: ['Hotel Caesar Augustus'], expiry: '' },
  { name: 'Photo ID — Augusta Holland', file: 'ID_AHolland.jpg', icon: '◩', shared: ['Rolzo Transfers'], expiry: '' },
];

const budgetItems = [
  { category: 'Flights', budgeted: 4200, actual: 3980, status: 'booked' as const },
  { category: 'Hotels', budgeted: 6800, actual: 6800, status: 'booked' as const },
  { category: 'Activities', budgeted: 2200, actual: 1450, status: 'partial' as const },
  { category: 'Transfers', budgeted: 1200, actual: 980, status: 'booked' as const },
  { category: 'Dining', budgeted: 1800, actual: 600, status: 'partial' as const },
  { category: 'Insurance', budgeted: 600, actual: 0, status: 'pending' as const },
];

const clientPreferences = [
  { key: 'dietary', label: 'Dietary Restrictions', value: 'Gluten-free (Augusta)' },
  { key: 'room', label: 'Room Preferences', value: 'High floor, sea view, king bed, quiet room' },
  { key: 'airline', label: 'Airline Preferences', value: 'American Airlines, Business Class' },
  { key: 'activity', label: 'Activity Level', value: 'Moderate — walking tours, no strenuous hikes' },
  { key: 'communication', label: 'Communication', value: 'Email preferred. Text for urgent only.' },
  { key: 'special', label: 'Special Notes', value: '15th wedding anniversary Jul 10' },
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
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button className="btn btn-champ" onClick={() => navigator.clipboard?.writeText(portalUrl)}>Copy Portal Link</button>
        <button className="btn btn-ghost">Customize Portal</button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-h"><span className="card-t">Client Preview</span></div>
        <div className="card-b">
          <label style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 6, display: 'block' }}>Select client portal to preview</label>
          <select className="td-input" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
            {clients.map((c) => (<option key={c.code} value={c.code}>{c.name} — {c.trip}</option>))}
          </select>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-h"><span className="card-t">Portal Sections</span></div>
        <div className="card-b" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {portalSections.map((s) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--ivory)' }}>{s.label}</span>
              <div className={`toggle${sections[s.key] ? ' on' : ''}`} onClick={() => toggleSection(s.key)} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Client Sign-In Screen                                              */
/* ------------------------------------------------------------------ */

function ClientSignIn({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '60px 0' }}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16,
        overflow: 'hidden', boxShadow: '0 12px 48px rgba(59,154,156,0.08), 0 4px 20px rgba(0,0,0,0.2)',
      }}>
        <div style={{ textAlign: 'center', padding: '36px 32px 28px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, color: 'var(--bg)', fontWeight: 600,
          }}>✦</div>
          <div className="playfair" style={{
            fontSize: 22, letterSpacing: 2, color: 'var(--ivory)',
          }}>Your Travel Portal</div>
          <div style={{ width: 50, height: 1, background: 'var(--champagne)', opacity: 0.35, margin: '14px auto' }} />
          <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 300 }}>Sign in to view your trips, documents & more</div>
        </div>

        <div style={{ padding: '0 32px 36px' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Email Address</div>
            <input className="td-input" placeholder="augusta@email.com" style={{ fontSize: 12, padding: '10px 14px' }} defaultValue="augusta@email.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Portal Access Code</div>
            <input className="td-input" type="password" placeholder="Enter your access code" style={{ fontSize: 12, padding: '10px 14px' }} defaultValue="••••••••" />
          </div>
          <button className="btn btn-champ" style={{ width: '100%', padding: 12, fontSize: 11, letterSpacing: 1 }} onClick={onSignIn}>
            Sign In
          </button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 10, color: 'var(--slate)' }}>
              Forgot your access code? <span style={{ color: 'var(--champagne)', cursor: 'pointer' }}>Contact your advisor</span>
            </span>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 9, color: 'var(--slate-dim)', marginTop: 24, letterSpacing: 0.5 }}>
        Powered by Voyance &middot; Secure Client Portal
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Client View (authenticated client experience)                      */
/* ------------------------------------------------------------------ */

function ClientView() {
  const [signedIn, setSignedIn] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [showTripRequest, setShowTripRequest] = useState(false);
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [prefs, setPrefs] = useState(clientPreferences);

  const sectionTitle = (label: string) => (
    <div style={{
      fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase' as const,
      color: 'var(--slate)', marginBottom: 14, marginTop: 28,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      {label}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );

  if (!signedIn) {
    return <ClientSignIn onSignIn={() => setSignedIn(true)} />;
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 0' }}>
      {/* Client portal header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, padding: '16px 20px',
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: 'var(--bg)', fontWeight: 600,
          }}>AH</div>
          <div>
            <div style={{ fontSize: 14, color: 'var(--ivory)', fontWeight: 400 }}>Augusta Holland</div>
            <div style={{ fontSize: 10, color: 'var(--slate)' }}>Capri · Jul 5–14</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn-ghost" style={{ fontSize: 9, padding: '5px 12px' }}>Messages</button>
          <button className="btn btn-ghost" style={{ fontSize: 9, padding: '5px 12px' }}>Sign Out</button>
        </div>
      </div>

      {/* ======== TRIP OVERVIEW ======== */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div className="playfair" style={{ fontSize: 24, color: 'var(--ivory)' }}>Capri</div>
            <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 3 }}>Jul 5-14 &middot; 9 nights</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="playfair" style={{ fontSize: 32, color: 'var(--champagne)', lineHeight: 1 }}>15</div>
            <div style={{ fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)' }}>days away</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 12 }}>
          Your Advisor: <span style={{ color: 'var(--ivory-dim)' }}>Halie M.</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge b-em">Flights: Booked</span>
          <span className="badge b-em">Hotels: Booked</span>
          <span className="badge b-sa">Insurance: Quoted</span>
        </div>
      </div>

      {/* ======== YOUR ADVISOR ======== */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20,
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: 'var(--bg)', fontWeight: 600, flexShrink: 0,
        }}>HM</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: 'var(--ivory)', fontWeight: 400 }}>Halie M.</div>
          <div style={{ fontSize: 11, color: 'var(--slate)' }}>halie@meridiantravel.co &middot; (555) 234-5678</div>
        </div>
        <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 10 }}>Message</button>
      </div>

      {/* ======== ITINERARY ======== */}
      {sectionTitle('Your Itinerary')}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {itinerary.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '15px 20px',
            borderBottom: i < itinerary.length - 1 ? '1px solid var(--border2)' : 'none',
          }}>
            <div style={{ minWidth: 50, textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)' }}>Day {item.day}</div>
              <div style={{ fontSize: 12, color: 'var(--champagne)', fontWeight: 500, marginTop: 2 }}>{item.date}</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ivory-dim)', lineHeight: 1.5 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* ======== DOCUMENTS ======== */}
      {sectionTitle('Trip Documents')}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
        {documents.map((doc, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 18px', borderBottom: i < documents.length - 1 ? '1px solid var(--border2)' : 'none',
            cursor: 'pointer', transition: 'background 0.1s',
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
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
        ))}
      </div>

      {sectionTitle('Secure Documents')}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{
          padding: '10px 18px', background: 'rgba(59,154,156,0.06)',
          borderBottom: '1px solid var(--border2)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 11, color: 'var(--emerald-lt)' }}>◆</span>
          <span style={{ fontSize: 9, color: 'var(--emerald-lt)', letterSpacing: 1, textTransform: 'uppercase' }}>End-to-End Encrypted</span>
          <span style={{ fontSize: 9, color: 'var(--slate)', marginLeft: 'auto' }}>Only shared with authorized partners</span>
        </div>
        {secureDocuments.map((doc, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 18px', borderBottom: i < secureDocuments.length - 1 ? '1px solid var(--border2)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <span style={{ fontSize: 13 }}>{doc.icon}</span>
              <div>
                <div style={{ fontSize: 12, color: 'var(--ivory)' }}>{doc.name}</div>
                <div style={{ fontSize: 9, color: 'var(--slate)', marginTop: 2 }}>
                  {doc.shared.length > 0
                    ? <>Shared with: <span style={{ color: 'var(--champagne)' }}>{doc.shared.join(', ')}</span></>
                    : <span style={{ color: 'var(--cognac-lt)' }}>Not yet shared</span>}
                  {doc.expiry && <span style={{ marginLeft: 8 }}>&middot; Exp: {doc.expiry}</span>}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-ghost" style={{ fontSize: 9, padding: '3px 8px', borderRadius: 6 }}>View</button>
              <button className="btn btn-ghost" style={{ fontSize: 9, padding: '3px 8px', borderRadius: 6 }}>Replace</button>
            </div>
          </div>
        ))}
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border2)', textAlign: 'center' }}>
          <button className="btn btn-ghost" style={{ fontSize: 10, padding: '6px 16px' }}>+ Upload Secure Document</button>
        </div>
      </div>

      {/* ======== BUDGET & PAYMENTS ======== */}
      {sectionTitle('Budget & Payments')}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 12 }}>Budget vs. Actual</div>
          {budgetItems.map((item, i) => {
            const pct = item.budgeted > 0 ? Math.round((item.actual / item.budgeted) * 100) : 0;
            return (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: 'var(--ivory-dim)' }}>{item.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 9, color: 'var(--slate)' }}>${item.actual.toLocaleString()} / ${item.budgeted.toLocaleString()}</span>
                    <span className={`badge ${item.status === 'booked' ? 'b-em' : item.status === 'partial' ? 'b-sa' : 'b-og'}`} style={{ fontSize: 6, padding: '1px 5px' }}>
                      {item.status === 'booked' ? 'Booked' : item.status === 'partial' ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: pct > 95 ? 'var(--cognac-lt)' : 'var(--champagne)', borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 10 }}>
            <span style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Total</span>
            <div>
              <span style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>${budgetItems.reduce((s, b) => s + b.actual, 0).toLocaleString()}</span>
              <span style={{ fontSize: 9, color: 'var(--slate)', margin: '0 4px' }}>of</span>
              <span className="playfair" style={{ fontSize: 16, color: 'var(--champagne)' }}>${budgetItems.reduce((s, b) => s + b.budgeted, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 12 }}>Payments</div>
          {payments.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border2)', marginBottom: 8,
            }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--ivory)' }}>{p.label}</div>
                <div className="playfair" style={{ fontSize: 16, color: 'var(--champagne)', marginTop: 2 }}>{p.amount}</div>
              </div>
              <span className={`badge ${p.badge}`} style={{ fontSize: 7 }}>{p.status}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4, marginBottom: 10 }}>
            <span style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Total Trip Cost</span>
            <span className="playfair" style={{ fontSize: 18, color: 'var(--champagne)' }}>$16,800</span>
          </div>
          <button className="btn btn-champ" style={{ width: '100%', padding: 10, fontSize: 10 }}>Pay Now &mdash; $8,400 Due Jun 25</button>
        </div>
      </div>

      {/* ======== PREFERENCES ======== */}
      {sectionTitle('My Travel Preferences')}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 10, color: 'var(--slate)' }}>Keep your preferences up to date for personalized trip planning</span>
          <button className="btn btn-ghost" style={{ fontSize: 9, padding: '3px 10px', borderRadius: 6 }} onClick={() => setEditingPrefs(!editingPrefs)}>
            {editingPrefs ? 'Save' : 'Edit'}
          </button>
        </div>
        {prefs.map((pref, i) => (
          <div key={pref.key} style={{ padding: '10px 0', borderBottom: i < prefs.length - 1 ? '1px solid var(--border2)' : 'none' }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--champagne)', marginBottom: 4 }}>{pref.label}</div>
            {editingPrefs ? (
              <input className="td-input" value={pref.value} onChange={(e) => setPrefs(prev => prev.map(p => p.key === pref.key ? { ...p, value: e.target.value } : p))} style={{ fontSize: 11 }} />
            ) : (
              <div style={{ fontSize: 11, color: 'var(--ivory-dim)', lineHeight: 1.5 }}>{pref.value}</div>
            )}
          </div>
        ))}
      </div>

      {/* ======== FEEDBACK ======== */}
      {sectionTitle('Feedback')}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: 'var(--ivory)', marginBottom: 14, fontWeight: 400 }}>How was your trip?</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} onClick={() => setStarRating(star)} onMouseEnter={() => setHoverStar(star)} onMouseLeave={() => setHoverStar(0)}
              style={{
                width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 18,
                background: star <= (hoverStar || starRating) ? 'var(--champ-dim)' : 'var(--bg4)',
                border: `1px solid ${star <= (hoverStar || starRating) ? 'var(--champagne)' : 'var(--border)'}`,
                color: star <= (hoverStar || starRating) ? 'var(--champagne)' : 'var(--slate-dim)',
                transition: 'all 0.15s',
              }}>
              {star <= (hoverStar || starRating) ? '★' : '☆'}
            </div>
          ))}
        </div>
        <textarea className="td-input" placeholder="Share your experience..." value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} rows={3} style={{ resize: 'vertical', marginBottom: 12 }} />
        <button className="btn btn-champ" style={{ width: '100%', padding: 10 }}>Submit Feedback</button>
      </div>

      {/* ======== NEW TRIP REQUEST ======== */}
      {sectionTitle('Plan Your Next Trip')}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        {!showTripRequest ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--ivory)', marginBottom: 6, fontWeight: 400 }}>Ready for your next adventure?</div>
            <div style={{ fontSize: 10, color: 'var(--slate)', marginBottom: 16, lineHeight: 1.5 }}>Submit a trip request and your advisor will start curating your perfect itinerary.</div>
            <button className="btn btn-champ" style={{ padding: '10px 28px' }} onClick={() => setShowTripRequest(true)}>Request a New Trip</button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 12, color: 'var(--ivory)', marginBottom: 14, fontWeight: 400 }}>New Trip Request</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Destination(s)</div>
                <input className="td-input" placeholder="Where would you like to go?" style={{ fontSize: 11 }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Travel Dates</div>
                  <input className="td-input" placeholder="Approximate dates" style={{ fontSize: 11 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Travelers</div>
                  <input className="td-input" placeholder="Number of travelers" style={{ fontSize: 11 }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Budget Range</div>
                <input className="td-input" placeholder="Approximate budget per person" style={{ fontSize: 11 }} />
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Trip Vision</div>
                <textarea className="td-input" placeholder="Tell us about your dream trip..." rows={3} style={{ fontSize: 11, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button className="btn btn-champ" style={{ flex: 1, padding: 10 }}>Submit Request</button>
                <button className="btn btn-ghost" style={{ padding: '10px 16px' }} onClick={() => setShowTripRequest(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', fontSize: 9, color: 'var(--slate-dim)', marginTop: 24, letterSpacing: 0.5, paddingBottom: 20 }}>
        Powered by Voyance &middot; Luxury Travel, Curated for You
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
    for (const s of portalSections) init[s.key] = s.default;
    return init;
  });

  const toggleSection = (key: string) => setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Client Portal</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>Client-facing portal &middot; Manage what your clients see</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <button className="btn" onClick={() => setView('advisor')} style={{
            borderRadius: 0, border: 'none', padding: '8px 18px', fontSize: 10,
            background: view === 'advisor' ? 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))' : 'transparent',
            color: view === 'advisor' ? 'var(--bg)' : 'var(--slate)',
          }}>Advisor View</button>
          <button className="btn" onClick={() => setView('client')} style={{
            borderRadius: 0, border: 'none', padding: '8px 18px', fontSize: 10,
            background: view === 'client' ? 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))' : 'transparent',
            color: view === 'client' ? 'var(--bg)' : 'var(--slate)',
          }}>Client View</button>
        </div>
      </div>

      {view === 'advisor' ? (
        <AdvisorView selectedClient={selectedClient} setSelectedClient={setSelectedClient} sections={sections} toggleSection={toggleSection} />
      ) : (
        <ClientView />
      )}
    </div>
  );
}
