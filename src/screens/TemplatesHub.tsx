import { useState, useRef } from 'react';

/* ───── Types ───── */
type TemplateCategory = 'Email Templates' | 'Workflows' | 'Supplier Info' | 'Destinations' | 'Internal Docs';
type TabKey = 'All' | TemplateCategory | 'Communications';

interface Template {
  id: number;
  category: TemplateCategory;
  title: string;
  content: string;
  updated: string;
  used: number;
}

type CommStatus = 'Draft' | 'Scheduled' | 'Sent';
interface Communication {
  id: number;
  recipient: string;
  subject: string;
  templateUsed: string;
  status: CommStatus;
  scheduledDate?: string;
  date: string;
}

/* ───── Constants ───── */
const categoryColors: Record<TemplateCategory, string> = {
  'Email Templates': 'var(--champagne)',
  'Workflows': 'var(--sapphire-lt)',
  'Supplier Info': 'var(--emerald-lt)',
  'Destinations': 'var(--amethyst)',
  'Internal Docs': 'var(--cognac-lt)',
};

const categoryDescriptions: Record<TemplateCategory, string> = {
  'Email Templates': 'Pre-written client communications for every stage of the trip lifecycle. Customize with merge fields before sending.',
  'Workflows': 'Step-by-step process guides for common agency operations and booking procedures.',
  'Supplier Info': 'Contact details, booking processes, and partnership notes for preferred suppliers.',
  'Destinations': 'Destination-specific templates, visa requirements, and travel advisories.',
  'Internal Docs': 'Agency SOPs, training materials, and team reference documents.',
};

const allTabs: TabKey[] = ['All', 'Email Templates', 'Workflows', 'Supplier Info', 'Destinations', 'Internal Docs', 'Communications'];
const templateCategories: TemplateCategory[] = ['Email Templates', 'Workflows', 'Supplier Info', 'Destinations', 'Internal Docs'];

const mergeFields = [
  '{first_name}', '{last_name}', '{trip_name}', '{destination}',
  '{departure_date}', '{return_date}', '{hotel_name}', '{advisor_name}', '{agency_name}',
];

/* ───── Seed Data: Templates ───── */
const seedTemplates: Template[] = [
  // Email Templates
  { id: 1, category: 'Email Templates', title: 'Pre-Arrival Template', content: 'Dear {first_name},\n\nWe\'re thrilled to share details for your upcoming trip to {destination}! Your departure on {departure_date} is just around the corner.\n\nYour advisor {advisor_name} at {agency_name} has prepared everything for an unforgettable experience at {hotel_name}.\n\nPlease review the attached itinerary and let us know if you have any dietary restrictions, allergies, or special preferences we should communicate to the property.\n\nWe look forward to making this trip truly extraordinary.\n\nWarm regards,\n{advisor_name}', updated: 'Jun 10', used: 34 },
  { id: 2, category: 'Email Templates', title: 'Bon Voyage Template', content: 'Dear {first_name},\n\nThe moment has arrived! Your trip to {destination} begins on {departure_date}.\n\nHere are your key contacts and first-day details. Your ground transfer has been confirmed and your driver will meet you at arrivals.\n\nHave an extraordinary journey, {first_name}. We are always just a call away.\n\nBon voyage,\n{advisor_name}\n{agency_name}', updated: 'Jun 5', used: 28 },
  { id: 3, category: 'Email Templates', title: 'Welcome Home Template', content: 'Dear {first_name},\n\nWelcome home from {destination}! We hope your stay at {hotel_name} exceeded every expectation.\n\nWe would love to hear about your experience. Your feedback helps us continue to curate the perfect travel experience.\n\nWould you be open to sharing a brief review? We truly value your perspective.\n\nWarmly,\n{advisor_name}\n{agency_name}', updated: 'May 28', used: 22 },
  { id: 4, category: 'Email Templates', title: 'Insurance Quote Follow-up', content: 'Dear {first_name},\n\nFollowing up on the travel insurance quote we sent for your {trip_name} trip. The policy covers trip cancellation, medical emergencies, and baggage protection for your {departure_date} departure.\n\nPlease let us know if you\'d like to move forward or if you have any questions about the coverage.\n\nBest regards,\n{advisor_name}', updated: 'Jun 1', used: 18 },
  { id: 5, category: 'Email Templates', title: 'Retainer Renewal Messaging', content: 'Dear {first_name} {last_name},\n\nAs we approach the anniversary of our partnership, I wanted to reach out regarding your annual travel advisory retainer renewal.\n\nOver the past year, we have been honored to plan your journeys and look forward to continuing this relationship. Your renewal ensures priority access to our concierge services and preferred partner rates.\n\nShall we schedule a call to discuss next year\'s travel aspirations?\n\nWith appreciation,\n{advisor_name}', updated: 'Apr 15', used: 8 },
  { id: 6, category: 'Email Templates', title: 'Trip Confirmation Template', content: 'Dear {first_name},\n\nWonderful news! Your {trip_name} trip is now fully confirmed. Here is a summary:\n\nDestination: {destination}\nDeparture: {departure_date}\nReturn: {return_date}\nAccommodation: {hotel_name}\n\nYour detailed itinerary will follow shortly. Please ensure all traveler passports are valid for at least six months beyond your return date.\n\nExciting times ahead!\n{advisor_name}\n{agency_name}', updated: 'Jun 14', used: 26 },
  // Workflows
  { id: 7, category: 'Workflows', title: 'Insurance Workflow (Multi-Stage)', content: 'Stage 1 — Generate Quote: Pull client travel details, run quote through Arch Insurance portal.\n\nStage 2 — Send to Client: Email quote using Insurance Quote template with coverage summary.\n\nStage 3 — Follow-up (7 days): If no response, send first follow-up.\n\nStage 4 — Follow-up (14 days): Second follow-up with deadline reminder.\n\nStage 5 — Confirm or Close: Mark policy as confirmed or close the request.', updated: 'Jun 12', used: 15 },
  { id: 8, category: 'Workflows', title: 'How We Work Overview', content: 'Client Onboarding Process:\n\n1. Initial discovery call — understand travel style, budget, and preferences.\n2. Send "How We Work" document explaining fees, planning process, and timelines.\n3. Collect signed advisory agreement and retainer deposit.\n4. Schedule detailed planning session.\n5. Begin itinerary research and supplier outreach.\n6. Present draft itinerary via AXUS.\n7. Refine based on client feedback.\n8. Confirm all bookings and send final documents.', updated: 'May 1', used: 12 },
  { id: 9, category: 'Workflows', title: 'Client Intake Form', content: 'New Client Questionnaire:\n\n- Full legal names (as on passport)\n- Date of birth for each traveler\n- Passport numbers and expiration dates\n- Preferred travel dates and flexibility\n- Budget range per person\n- Travel style: adventure, relaxation, cultural, culinary\n- Dietary restrictions and allergies\n- Mobility considerations\n- Past destinations loved / disliked\n- Must-have experiences for this trip', updated: 'Jun 8', used: 20 },
  { id: 10, category: 'Workflows', title: 'DMC Vetting Process', content: 'DMC Evaluation Checklist:\n\n1. Request company profile, insurance certificates, and references.\n2. Verify local licenses and safety certifications.\n3. Conduct test booking or FAM trip.\n4. Review cancellation and refund policies.\n5. Assess communication responsiveness (24h benchmark).\n6. Compare pricing against two alternative DMCs.\n7. Confirm English-speaking guide availability.\n8. Add to approved partner list or decline with notes.', updated: 'Mar 20', used: 6 },
  // Supplier Info
  { id: 11, category: 'Supplier Info', title: 'Preferred Partners — Hotels', content: 'Preferred Hotel Partners by Region:\n\nEurope: Belmond, Aman, Four Seasons, Rosewood, Mandarin Oriental\nCaribbean: Sandy Lane, Eden Rock, Jumby Bay, Sugar Beach\nAsia: Amanpuri, Soneva, Capella, Regent\nAfrica: Singita, andBeyond, Great Plains Conservation\n\nVirtuoso / Internova amenities apply at most properties. Always verify current offers before quoting.', updated: 'Jun 15', used: 40 },
  { id: 12, category: 'Supplier Info', title: 'Preferred Partners — DMCs', content: 'Vetted DMC Contacts:\n\nItaly: Italia Luxury Travel — Marco B. (marco@ilt.it)\nJapan: Artisans of Leisure Tokyo — Yuki M.\nKenya: Micato Safaris — Dennis P.\nPeru: Kuoda Travel — Gerson V.\nGreece: Hellenic Luxury — Nikos A.\n\nAll partners have completed our vetting process and carry appropriate liability insurance.', updated: 'Jun 10', used: 25 },
  { id: 13, category: 'Supplier Info', title: 'Arch Insurance Sales Team', content: 'Arch Insurance — Travel Protection:\n\nPrimary Contact: Sarah Chen, Senior Account Manager\nEmail: schen@archinsurance.com | Phone: (212) 555-0147\n\nSubmission Process:\n1. Complete Arch online quote form (portal login required)\n2. Attach trip summary with dates, costs, and traveler DOBs\n3. Quote turnaround: 24-48 hours\n4. Policy binds upon client signature and premium payment\n\nCancel For Any Reason (CFAR) add-on available within 14 days of initial deposit.', updated: 'May 5', used: 12 },
  { id: 14, category: 'Supplier Info', title: 'Rolzo Transfer Notes', content: 'Rolzo Private Transfers:\n\nBooking: Via Rolzo portal or concierge@rolzo.com\nLead Time: 48 hours minimum, 72 hours for peak season\n\nVehicle Classes: Business Sedan, Business Van, First Class, Sprinter\nAirport Meet & Greet: Included on all bookings\n\nCancellation: Free up to 24 hours before pickup\nPayment: Invoice monthly, net-30 terms\n\nKey Contact: Alex Dumas, Partner Success — alex@rolzo.com', updated: 'Jun 3', used: 16 },
  // Destinations
  { id: 15, category: 'Destinations', title: 'Japan Requests Template', content: 'Japan Trip Inquiry — Key Planning Notes:\n\nBest seasons: Cherry blossom (late Mar-mid Apr), Autumn foliage (Nov)\nPopular routes: Tokyo > Hakone > Kyoto > Osaka\nVisa: US citizens exempt for stays under 90 days\n\nMust-book in advance:\n- Ryokan stays (3+ months ahead in peak)\n- Teamlab exhibits\n- Michelin-star restaurants\n\nRecommended DMC: Artisans of Leisure Tokyo\nBudget benchmark: $1,200-2,500 per person per day (luxury tier)', updated: 'Apr 10', used: 4 },
  { id: 16, category: 'Destinations', title: 'Visa & ETA Tracking by Country', content: 'Visa Requirements — US Passport Holders:\n\nEU/Schengen: No visa, 90 days in 180-day period. ETIAS required from 2025.\nUK: No visa for stays under 6 months. ETA required.\nJapan: No visa, 90 days.\nAustralia: ETA required (apply online, usually instant).\nKenya: eVisa required — apply at evisa.go.ke, allow 7 business days.\nBrazil: eVisa required — apply via VFS Global.\nIndia: eVisa required — apply at indianvisaonline.gov.in, allow 5 days.\n\nAlways verify 6-month passport validity rule.', updated: 'Jun 18', used: 30 },
  { id: 17, category: 'Destinations', title: 'Italy Destination Guide', content: 'Italy Planning Essentials:\n\nRegions: Amalfi Coast, Tuscany, Lake Como, Sicily, Dolomites, Rome, Venice\nBest time: Apr-Jun, Sep-Oct (shoulder season)\nKey suppliers: Italia Luxury Travel (DMC), Belmond (hotels), Rolzo (transfers)\n\nNotes:\n- Book Amalfi hotels 6+ months ahead for summer\n- Capri day-trip boats fill fast in July-August\n- Vatican and Uffizi require advance timed tickets\n- Driving in ZTL zones requires special permits', updated: 'Jun 20', used: 14 },
  // Internal Docs
  { id: 18, category: 'Internal Docs', title: 'Flight Booking Forwarding Template', content: 'Internal Process — Flight Confirmation Forwarding:\n\n1. Receive booking confirmation from airline or consolidator.\n2. Verify PNR, flight numbers, times, and passenger names.\n3. Format using client-facing flight summary template.\n4. Attach PDF confirmation and forward to client with trip reference.\n5. Log confirmation in trip management system.\n6. Set reminder for 24-hour check-in notification.\n\nNote: Always double-check terminal information for connecting flights.', updated: 'Jun 1', used: 22 },
  { id: 19, category: 'Internal Docs', title: 'New Advisor Onboarding Checklist', content: 'New Team Member Setup:\n\n1. Create accounts: CRM, AXUS, email, Slack, supplier portals.\n2. Grant access to shared drive and template library.\n3. Schedule shadow sessions with senior advisor (minimum 3 trips).\n4. Review agency SOPs and brand voice guidelines.\n5. Complete supplier partner introductions.\n6. First solo trip assignment (supervised).\n7. 30-day check-in with team lead.\n\nTraining materials located in Shared Drive > Team > Onboarding.', updated: 'May 20', used: 10 },
];

/* ───── Seed Data: Communications ───── */
const seedComms: Communication[] = [
  // Drafts
  { id: 1, recipient: 'Holland, Augusta', subject: 'Pre-Arrival Details — Capri Trip', templateUsed: 'Pre-Arrival Template', status: 'Draft', date: 'Jun 20' },
  { id: 2, recipient: 'Diaz, Maria', subject: 'Bon Voyage — DC Business Trip', templateUsed: 'Bon Voyage Template', status: 'Draft', date: 'Jun 20' },
  { id: 3, recipient: 'Stern, Rachel', subject: 'Insurance Quote — Spain Trip', templateUsed: 'Insurance Quote Follow-up', status: 'Draft', date: 'Jun 19' },
  // Scheduled
  { id: 4, recipient: 'Baker, Sean', subject: 'Welcome Home — Westlake', templateUsed: 'Welcome Home Template', status: 'Scheduled', scheduledDate: 'Jul 26', date: 'Jun 18' },
  { id: 5, recipient: 'Holland, Augusta', subject: 'Trip Confirmation — Capri', templateUsed: 'Trip Confirmation Template', status: 'Scheduled', scheduledDate: 'Jun 25', date: 'Jun 19' },
  // Sent
  { id: 6, recipient: 'McGarey, Patrick', subject: 'Welcome Home — Scotland', templateUsed: 'Welcome Home Template', status: 'Sent', date: 'Jun 15' },
  { id: 7, recipient: 'Holland, Augusta', subject: 'Insurance Quote Follow-up', templateUsed: 'Insurance Quote Follow-up', status: 'Sent', date: 'Jun 13' },
  { id: 8, recipient: 'Hastings, Debra', subject: 'Trip Confirmation — Kenya', templateUsed: 'Trip Confirmation Template', status: 'Sent', date: 'Jun 10' },
  { id: 9, recipient: 'O\'Brien, Liam', subject: 'Welcome Home — Palm Heights', templateUsed: 'Welcome Home Template', status: 'Sent', date: 'Jun 5' },
];

const statusBadgeClass: Record<CommStatus, string> = { Draft: 'b-og', Scheduled: 'b-sa', Sent: 'b-em' };

/* ───── Helpers ───── */
let nextTemplateId = seedTemplates.length + 1;

function preview(content: string, len = 60): string {
  const flat = content.replace(/\n/g, ' ').trim();
  return flat.length > len ? flat.slice(0, len) + '...' : flat;
}

/* ═══════════════════════════════════ Component ═══════════════════════════════════ */

export default function TemplatesHub() {
  const [activeTab, setActiveTab] = useState<TabKey>('All');
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState<Template[]>(seedTemplates);
  const [comms] = useState<Communication[]>(seedComms);

  // Edit panel state
  const [panelOpen, setPanelOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<TemplateCategory>('Email Templates');
  const [editContent, setEditContent] = useState('');
  const [showMergeFields, setShowMergeFields] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Communication filters
  const [commStatusFilter, setCommStatusFilter] = useState<'All' | CommStatus>('All');
  const [commClientFilter, setCommClientFilter] = useState('All');
  const [commTemplateFilter, setCommTemplateFilter] = useState('All');

  /* ─── Derived data ─── */
  const isCommsTab = activeTab === 'Communications';

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = activeTab === 'All' || activeTab === t.category;
    const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredComms = comms.filter(c => {
    const matchesStatus = commStatusFilter === 'All' || c.status === commStatusFilter;
    const matchesClient = commClientFilter === 'All' || c.recipient === commClientFilter;
    const matchesTemplate = commTemplateFilter === 'All' || c.templateUsed === commTemplateFilter;
    return matchesStatus && matchesClient && matchesTemplate;
  });

  const uniqueClients = Array.from(new Set(comms.map(c => c.recipient)));
  const uniqueTemplatesUsed = Array.from(new Set(comms.map(c => c.templateUsed)));

  const activeCategoryDescription = activeTab !== 'All' && activeTab !== 'Communications'
    ? categoryDescriptions[activeTab as TemplateCategory]
    : null;

  /* ─── Panel helpers ─── */
  function openTemplate(t: Template) {
    setEditId(t.id);
    setEditTitle(t.title);
    setEditCategory(t.category);
    setEditContent(t.content);
    setShowMergeFields(false);
    setPanelOpen(true);
  }

  function openNewTemplate() {
    setEditId(null);
    setEditTitle('');
    setEditCategory(activeTab !== 'All' && activeTab !== 'Communications' ? activeTab as TemplateCategory : 'Email Templates');
    setEditContent('');
    setShowMergeFields(false);
    setPanelOpen(true);
  }

  function saveTemplate() {
    if (!editTitle.trim()) return;
    if (editId !== null) {
      setTemplates(prev => prev.map(t =>
        t.id === editId ? { ...t, title: editTitle, category: editCategory, content: editContent, updated: 'Jun 23' } : t
      ));
    } else {
      const newT: Template = { id: nextTemplateId++, category: editCategory, title: editTitle, content: editContent, updated: 'Jun 23', used: 0 };
      setTemplates(prev => [...prev, newT]);
    }
    setPanelOpen(false);
  }

  function deleteTemplate() {
    if (editId !== null) {
      setTemplates(prev => prev.filter(t => t.id !== editId));
    }
    setPanelOpen(false);
  }

  function insertField(field: string) {
    const ta = contentRef.current;
    if (!ta) { setEditContent(prev => prev + field); return; }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = editContent.slice(0, start);
    const after = editContent.slice(end);
    const updated = before + field + after;
    setEditContent(updated);
    setShowMergeFields(false);
    setTimeout(() => {
      ta.focus();
      const pos = start + field.length;
      ta.setSelectionRange(pos, pos);
    }, 0);
  }

  const editingExisting = editId !== null;
  const currentEditTemplate = editId !== null ? templates.find(t => t.id === editId) : null;

  /* ═══════════════════════════════════ Render ═══════════════════════════════════ */
  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Templates & Knowledge Hub</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>
            Centralized resource library &middot; {templates.length} templates &middot; {comms.length} communications
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="td-input"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <button className="btn btn-champ" onClick={openNewTemplate}>+ New Template</button>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {allTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: activeTab === tab ? '1px solid rgba(212,175,106,0.18)' : '1px solid var(--border)',
              background: activeTab === tab ? 'var(--champ-dim)' : 'transparent',
              color: activeTab === tab ? 'var(--champagne)' : 'var(--slate)',
              fontSize: 10,
              letterSpacing: 0.5,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── Category Description ─── */}
      {activeCategoryDescription && (
        <div style={{
          fontSize: 11,
          color: 'var(--slate)',
          lineHeight: 1.6,
          marginBottom: 18,
          padding: '10px 14px',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 8,
        }}>
          {activeCategoryDescription}
        </div>
      )}

      {!activeCategoryDescription && <div style={{ marginBottom: 14 }} />}

      {/* ═══════ Templates Grid (non-Communications) ═══════ */}
      {!isCommsTab && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {filteredTemplates.map(t => (
            <div
              key={t.id}
              onClick={() => openTemplate(t)}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 18,
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--champagne)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {/* Category tag */}
              <div style={{
                fontSize: 9,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: categoryColors[t.category],
                marginBottom: 8,
              }}>
                {t.category}
              </div>
              {/* Title */}
              <div style={{ fontSize: 13, color: 'var(--ivory)', fontWeight: 500, marginBottom: 6 }}>
                {t.title}
              </div>
              {/* Content preview */}
              <div style={{
                fontSize: 10,
                color: 'var(--slate)',
                lineHeight: 1.5,
                marginBottom: 14,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {preview(t.content)}
              </div>
              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--slate-dim)' }}>
                <span>Updated: {t.updated}</span>
                <span>Used {t.used} times</span>
              </div>
            </div>
          ))}
          {filteredTemplates.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--slate)', fontSize: 12 }}>
              No templates match your search.
            </div>
          )}
        </div>
      )}

      {/* ═══════ Communications Tab ═══════ */}
      {isCommsTab && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            <select className="td-input" style={{ width: 140, fontSize: 10, padding: '6px 10px' }} value={commStatusFilter} onChange={e => setCommStatusFilter(e.target.value as 'All' | CommStatus)}>
              <option value="All">All Statuses</option>
              <option value="Draft">Drafts</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Sent">Sent</option>
            </select>
            <select className="td-input" style={{ width: 180, fontSize: 10, padding: '6px 10px' }} value={commClientFilter} onChange={e => setCommClientFilter(e.target.value)}>
              <option value="All">All Clients</option>
              {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="td-input" style={{ width: 200, fontSize: 10, padding: '6px 10px' }} value={commTemplateFilter} onChange={e => setCommTemplateFilter(e.target.value)}>
              <option value="All">All Templates</option>
              {uniqueTemplatesUsed.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* ── Drafts ── */}
          {(commStatusFilter === 'All' || commStatusFilter === 'Draft') && (() => {
            const drafts = filteredComms.filter(c => c.status === 'Draft');
            return drafts.length > 0 ? (
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-h">
                  <span className="card-t">Drafts</span>
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: 'var(--bg4)', color: 'var(--slate)' }}>{drafts.length}</span>
                </div>
                <div className="card-b" style={{ padding: 0 }}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Recipient</th>
                        <th>Subject</th>
                        <th>Template</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drafts.map(c => (
                        <tr key={c.id}>
                          <td className="td-main">{c.recipient}</td>
                          <td>{c.subject}</td>
                          <td>{c.templateUsed}</td>
                          <td><span className={`badge ${statusBadgeClass[c.status]}`}>{c.status}</span></td>
                          <td>{c.date}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn btn-ghost btn-xs">Edit</button>
                              <button className="btn btn-champ btn-xs">Send</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null;
          })()}

          {/* ── Scheduled ── */}
          {(commStatusFilter === 'All' || commStatusFilter === 'Scheduled') && (() => {
            const scheduled = filteredComms.filter(c => c.status === 'Scheduled');
            return scheduled.length > 0 ? (
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-h">
                  <span className="card-t">Scheduled</span>
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: 'var(--bg4)', color: 'var(--slate)' }}>{scheduled.length}</span>
                </div>
                <div className="card-b" style={{ padding: 0 }}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Recipient</th>
                        <th>Subject</th>
                        <th>Template</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduled.map(c => (
                        <tr key={c.id}>
                          <td className="td-main">{c.recipient}</td>
                          <td>{c.subject}</td>
                          <td>{c.templateUsed}</td>
                          <td><span className={`badge ${statusBadgeClass[c.status]}`}>Scheduled {c.scheduledDate}</span></td>
                          <td>{c.date}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn btn-ghost btn-xs">Edit</button>
                              <button className="btn btn-ghost btn-xs">Cancel</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null;
          })()}

          {/* ── Sent ── */}
          {(commStatusFilter === 'All' || commStatusFilter === 'Sent') && (() => {
            const sent = filteredComms.filter(c => c.status === 'Sent');
            return sent.length > 0 ? (
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-h">
                  <span className="card-t">Sent</span>
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: 'var(--bg4)', color: 'var(--slate)' }}>{sent.length}</span>
                </div>
                <div className="card-b" style={{ padding: 0 }}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Recipient</th>
                        <th>Subject</th>
                        <th>Template</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sent.map(c => (
                        <tr key={c.id}>
                          <td className="td-main">{c.recipient}</td>
                          <td>{c.subject}</td>
                          <td>{c.templateUsed}</td>
                          <td><span className={`badge ${statusBadgeClass[c.status]}`}>{c.status}</span></td>
                          <td>{c.date}</td>
                          <td>
                            <button className="btn btn-ghost btn-xs">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null;
          })()}

          {filteredComms.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--slate)', fontSize: 12 }}>
              No communications match your filters.
            </div>
          )}
        </div>
      )}

      {/* ═══════ Edit / Preview Panel (slide-in) ═══════ */}
      <div className={`task-detail${panelOpen ? ' open' : ''}`}>

        {/* Panel header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--slate)' }}>
            {editingExisting ? 'Edit Template' : 'New Template'}
          </div>
          <button
            onClick={() => setPanelOpen(false)}
            style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--slate)', fontSize: 14, flexShrink: 0 }}
          >
            ✕
          </button>
        </div>

        {/* Panel body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Template name */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Template Name</div>
            <input
              className="td-input"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="Enter template name..."
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Category</div>
            <select className="td-input" value={editCategory} onChange={e => setEditCategory(e.target.value as TemplateCategory)}>
              {templateCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Insert Field button + dropdown */}
          <div style={{ marginBottom: 8, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)' }}>Content</div>
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => setShowMergeFields(v => !v)}
                style={{ position: 'relative' }}
              >
                Insert Field
              </button>
            </div>
            {showMergeFields && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 22,
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 10,
                zIndex: 20,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                width: 320,
                boxShadow: 'var(--shadow)',
              }}>
                {mergeFields.map(field => (
                  <span
                    key={field}
                    onClick={() => insertField(field)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'var(--champ-dim)',
                      border: '1px solid rgba(212,175,106,0.18)',
                      color: 'var(--champagne)',
                      fontSize: 10,
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,106,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--champ-dim)'; }}
                  >
                    {field}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content textarea */}
          <textarea
            ref={contentRef}
            className="td-input"
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            placeholder="Enter template content... Use {first_name}, {destination}, etc. for merge fields."
            rows={16}
            style={{
              resize: 'vertical',
              lineHeight: 1.6,
              fontFamily: "'Jost', sans-serif",
              fontSize: 12,
              minHeight: 260,
              marginBottom: 14,
            }}
          />

          {/* Metadata (existing templates only) */}
          {editingExisting && currentEditTemplate && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 9,
              color: 'var(--slate-dim)',
              padding: '10px 0',
              borderTop: '1px solid var(--border2)',
              marginBottom: 14,
            }}>
              <span>Last updated: {currentEditTemplate.updated}</span>
              <span>Used {currentEditTemplate.used} times</span>
            </div>
          )}
        </div>

        {/* Panel footer / actions */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid var(--border)',
          flexShrink: 0,
          background: 'var(--bg2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            {editingExisting && (
              <button className="btn btn-ghost btn-sm" onClick={deleteTemplate} style={{ color: 'var(--ruby-lt)', borderColor: 'rgba(155,58,58,0.3)' }}>
                Delete
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setPanelOpen(false)}>Cancel</button>
            <button className="btn btn-champ btn-sm" onClick={saveTemplate}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
