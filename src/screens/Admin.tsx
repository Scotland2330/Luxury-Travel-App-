import { useState } from 'react';
import { useTheme } from '../ThemeContext';

const tabs = ['Staff & Roles', 'Automations', 'Payments & Invoicing', 'Agency Settings', 'Notifications', 'Passport & Visas', 'Team Calendar'];
const tabIds = ['staff', 'automations', 'payments', 'agency', 'notifications', 'passports', 'calendar'];

const staff = [
  { init: 'HM', name: 'Halie McGee', email: 'halie@agency.com', role: 'Owner', roleBadge: 'b-ch', rate: '$150/hr', status: 'Active', statusBadge: 'b-em', bg: 'linear-gradient(135deg,#1B4B5A,#3B9A9C)', color: 'var(--champagne)', borderColor: 'rgba(59,154,156,0.3)', owner: true },
  { init: 'ES', name: 'Emily Stone', email: 'emily@agency.com', role: 'Advisor', roleBadge: 'b-sa', rate: '$120/hr', status: 'Active', statusBadge: 'b-em', bg: 'linear-gradient(135deg,#1B4B5A,#4088AB)', color: 'var(--sapphire-lt)', borderColor: 'rgba(64,136,171,0.3)' },
  { init: '?', name: 'Pending Invite', email: 'newadvisor@agency.com', role: 'Advisor', roleBadge: 'b-mu', rate: '—', status: 'Invited', statusBadge: 'b-og', bg: 'transparent', color: 'var(--slate)', borderColor: 'var(--border)', dashed: true },
];

const permissions = [
  ['View all clients & trips', '✓', '✓', 'Own only'],
  ['Create / edit trips', '✓', '✓', '—'],
  ['Manage invoices & billing', '✓', 'View only', '—'],
  ['Admin & staff settings', '✓', '—', '—'],
  ['Manage automations', '✓', 'Limited', '—'],
];

const automations = [
  { rule: 'Bon Voyage: 2 days before Start Date if not Sent → notify Lead', desc: 'Sends bon voyage message to lead advisor before trip begins', active: true },
  { rule: 'Pre-Arrival: 2 days before Start Date if not Sent → notify Lead', desc: 'Triggers pre-arrival preparation reminder', active: true },
  { rule: 'Welcome Home: 1 week after End Date if not Sent → notify Lead', desc: 'Sends welcome home follow-up after trip concludes', active: true },
  { rule: 'Insurance: When quote sent → set 7-day reminder', desc: 'Creates follow-up reminder after insurance quote is sent', active: true },
  { rule: 'Tours + Transfers: When Booked → notify Lead', desc: 'Alerts lead advisor when tours or transfers are confirmed', active: true },
  { rule: 'Concierge: 2 months before Start Date → notify Lead', desc: 'Triggers concierge coordination well before departure', active: true },
  { rule: 'AXUS Review: 2 weeks before departure → begin review', desc: 'Starts AXUS itinerary review process before trip', active: true },
  { rule: 'Flight Checks: 2 days before Start Date → notify advisor', desc: 'Reminds advisor to verify flight details pre-departure', active: true },
  { rule: 'Return Flight Checks: 2 days before End Date → notify advisor', desc: 'Reminds advisor to verify return flight details', active: true },
  { rule: 'Trip Completion: 1 day after End Date → move to Completed', desc: 'Automatically moves trip status to Completed', active: true },
  { rule: 'Visa/Vaccination Prompt: On trip creation → check requirements', desc: 'Checks visa and vaccination requirements when a new trip is created', active: true },
  { rule: 'AXUS Review: When In Review → notify Lead', desc: 'Notifies lead advisor when AXUS review status changes', active: false },
];

const notifications = [
  { title: 'Automation alert notifications', desc: 'Notify when automated triggers fire' },
  { title: 'Payment & commission alerts', desc: 'Notify when commission status changes' },
  { title: 'Passport expiry warnings', desc: 'Alert 1 year before passport expires' },
  { title: 'Retainer overage alerts', desc: 'Alert when client exceeds included hours' },
  { title: 'Client feedback received', desc: 'Notify when client submits post-trip feedback' },
];

const passports = [
  { client: 'Diaz', expiry: 'Mar 2028', days: 640, visa: 'No', status: 'Valid', statusBadge: 'b-em' },
  { client: 'Holland', expiry: 'Jan 2027', days: 195, visa: 'Italy Schengen — Yes', status: 'Expiring Soon', statusBadge: 'b-og' },
  { client: 'Baker', expiry: 'Sep 2029', days: 1180, visa: 'No', status: 'Valid', statusBadge: 'b-em' },
  { client: 'Hastings', expiry: 'Jun 2027', days: 365, visa: 'Kenya — Yes (eVisa)', status: 'Processing', statusBadge: 'b-sa' },
  { client: 'Stern/Gross', expiry: 'Nov 2026', days: 150, visa: 'Spain Schengen — Yes', status: 'Needs Renewal', statusBadge: 'b-og' },
];

const paymentGateways = [
  { name: 'Stripe', desc: 'Credit cards, ACH, Apple Pay, Google Pay', status: 'connected' as const, acct: 'acct_1Ox...7qR', fees: '2.9% + $0.30' },
  { name: 'Square', desc: 'In-person and online payments', status: 'available' as const, acct: '', fees: '2.6% + $0.10' },
  { name: 'PayPal', desc: 'PayPal, Venmo, Pay Later', status: 'available' as const, acct: '', fees: '3.49% + $0.49' },
  { name: 'Authorize.net', desc: 'Credit cards, eChecks', status: 'available' as const, acct: '', fees: '2.9% + $0.30' },
];

const invoices = [
  { id: 'INV-2026-041', client: 'Holland, Augusta', trip: 'Capri', amount: '$8,400.00', issued: 'Jun 18', due: 'Jun 25', status: 'sent' as const, method: 'stripe' },
  { id: 'INV-2026-040', client: 'Baker, Sean', trip: 'Westlake', amount: '$3,200.00', issued: 'Jun 15', due: 'Jun 22', status: 'paid' as const, method: 'stripe' },
  { id: 'INV-2026-039', client: 'McGarey, Patrick', trip: 'Scotland', amount: '$12,600.00', issued: 'Jun 12', due: 'Jun 19', status: 'overdue' as const, method: 'stripe' },
  { id: 'INV-2026-038', client: 'Diaz, Maria', trip: 'DC Business', amount: '$2,800.00', issued: 'Jun 10', due: 'Jun 17', status: 'paid' as const, method: 'stripe' },
  { id: 'INV-2026-037', client: 'Holland, Augusta', trip: 'Capri', amount: '$4,200.00', issued: 'Jun 1', due: 'Jun 8', status: 'paid' as const, method: 'stripe' },
];

const paymentLinks = [
  { client: 'Holland, Augusta', trip: 'Capri — 2nd Payment', amount: '$8,400.00', link: 'pay.voyance.co/hm-travel/hol-capri-2', created: 'Jun 18', views: 3, status: 'active' as const },
  { client: 'McGarey, Patrick', trip: 'Scotland — Deposit', amount: '$12,600.00', link: 'pay.voyance.co/hm-travel/mcg-scot-dep', created: 'Jun 12', views: 1, status: 'active' as const },
  { client: 'Baker, Sean', trip: 'Westlake — Final Balance', amount: '$1,600.00', link: 'pay.voyance.co/hm-travel/bak-west-fin', created: 'Jun 20', views: 0, status: 'active' as const },
];

const calendarEntries = [
  { person: 'Halie McGee', desc: 'PTO Jun 25–27', badgeText: 'PTO', badgeClass: 'b-mu' },
  { person: 'Emily Stone', desc: 'FAM Trip: Ritz-Carlton Yacht Jul 10–14', badgeText: 'FAM', badgeClass: 'b-sa' },
  { person: 'Halie McGee', desc: 'FAM Trip: Aman Tokyo Aug 5–10', badgeText: 'FAM', badgeClass: 'b-ch' },
];

const triggerTypes = ['Days Before Start Date', 'Days After End Date', 'On Status Change', 'On Trip Creation', 'On Booking Confirmation'];
const actionTypes = ['Notify Lead', 'Send Email', 'Move Status', 'Create Task', 'Set Reminder'];

interface AutomationForm {
  rule: string;
  desc: string;
  triggerType: string;
  triggerValue: string;
  action: string;
  active: boolean;
}

const emptyForm: AutomationForm = { rule: '', desc: '', triggerType: triggerTypes[0], triggerValue: '', action: actionTypes[0], active: true };

export default function Admin() {
  const [activeTab, setActiveTab] = useState('staff');
  const [notifToggles, setNotifToggles] = useState(notifications.map(() => true));
  const [autoToggles, setAutoToggles] = useState(automations.map(a => a.active));
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  /* Automation edit modal state: index = -1 means "new", null means closed */
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AutomationForm>(emptyForm);
  const [paymentSubTab, setPaymentSubTab] = useState<'gateways' | 'invoices' | 'links'>('gateways');
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const openEdit = (i: number) => {
    const a = automations[i];
    setEditForm({ rule: a.rule, desc: a.desc, triggerType: triggerTypes[0], triggerValue: '', action: actionTypes[0], active: autoToggles[i] });
    setEditIndex(i);
  };
  const openNew = () => { setEditForm({ ...emptyForm }); setEditIndex(-1); };
  const closeModal = () => setEditIndex(null);
  const handleSave = () => { /* persist logic would go here */ closeModal(); };
  const handleDelete = () => { /* delete logic would go here */ closeModal(); };

  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Admin</h1>
          <p style={{fontSize:11,color:'var(--slate)',marginTop:4}}>Agency settings, staff, automations, and operations</p>
        </div>
        <button className="btn btn-champ">+ Invite Staff</button>
      </div>

      <div className="card" style={{display:'grid',gridTemplateColumns:'200px 1fr',minHeight:600}}>
        {/* Left nav */}
        <div style={{borderRight:'1px solid var(--border)',padding:'16px 0'}}>
          {tabs.map((t, i) => (
            <div key={i} onClick={() => setActiveTab(tabIds[i])} style={{padding:'10px 18px',fontSize:12,cursor:'pointer',transition:'all 0.15s',letterSpacing:0.3,
              color: activeTab===tabIds[i] ? 'var(--champagne)' : 'var(--slate)',
              borderRight: activeTab===tabIds[i] ? '2px solid var(--champagne)' : '2px solid transparent',
              background: activeTab===tabIds[i] ? 'var(--champ-dim)' : 'transparent'}}>{t}</div>
          ))}
        </div>

        {/* Right content */}
        <div style={{padding:24}}>
          {/* Staff & Roles */}
          {activeTab === 'staff' && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <span style={{fontSize:13,color:'var(--ivory)',fontWeight:500}}>Team Members</span>
                <button className="btn btn-champ btn-sm">+ Invite</button>
              </div>
              <table className="tbl" style={{marginBottom:24}}>
                <thead><tr>{['Name','Email','Role','Hourly Rate','Status','Actions'].map(h => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {staff.map((s,i) => (
                    <tr key={i}>
                      <td className="td-main">
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div style={{width:28,height:28,borderRadius:'50%',background:isLight && s.init === 'HM' ? 'linear-gradient(135deg,#F0BF9A,#E8A87C)' : isLight && s.init === 'ES' ? 'linear-gradient(135deg,#A0DCD8,#85CDCA)' : s.bg,border:`1px solid ${isLight && !s.dashed ? 'var(--border)' : s.borderColor}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:isLight && s.init === 'HM' ? '#6A4020' : isLight && s.init === 'ES' ? '#1B4B5A' : s.color,fontWeight:500,borderStyle:s.dashed?'dashed':'solid'}}>{s.init}</div>
                          {s.name}
                        </div>
                      </td>
                      <td>{s.email}</td>
                      <td><span className={`badge ${s.roleBadge}`}>{s.role}</span></td>
                      <td>{s.rate}</td>
                      <td><span className={`badge ${s.statusBadge}`}>{s.status}</span></td>
                      <td>{s.owner ? '—' : s.dashed ? <button className="btn btn-ghost btn-xs">Resend</button> :
                        <div style={{display:'flex',gap:4}}>
                          <button className="btn btn-ghost btn-xs">Edit</button>
                          <button className="btn btn-xs" style={{background:isLight ? 'rgba(181,64,64,0.15)' : 'rgba(155,58,58,0.2)',color:isLight ? '#8A2020' : 'var(--ruby-lt)',border:'none'}}>Remove</button>
                        </div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Permissions */}
              <div style={{fontSize:11,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:12}}>Role Permissions</div>
              <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10,overflow:'hidden'}}>
                <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',padding:'10px 16px',borderBottom:'1px solid var(--border2)'}}>
                  {['Permission','Owner','Advisor','Invited'].map(h => (
                    <span key={h} style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)'}}>{h}</span>
                  ))}
                </div>
                {permissions.map((row,i) => (
                  <div key={i} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',padding:'10px 16px',borderBottom:i<permissions.length-1?'1px solid var(--border2)':'none'}}>
                    {row.map((cell,j) => (
                      <span key={j} style={{fontSize:11,color:j===0?'var(--ivory-dim)':cell==='✓'?'var(--emerald-lt)':cell==='—'?'var(--slate-dim)':'var(--ivory-dim)'}}>{cell}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Automations */}
          {activeTab === 'automations' && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500}}>Workflow Automations</div>
                <button className="btn btn-champ btn-sm" onClick={openNew}>+ New Automation</button>
              </div>
              <div style={{fontSize:11,color:'var(--slate)',marginBottom:24}}>Manage automated triggers and notifications</div>

              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {automations.map((a,i) => (
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10,gap:10,opacity:autoToggles[i]?1:0.5}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,flex:1}}>
                      <div className={`toggle${autoToggles[i]?' on':''}`} onClick={() => setAutoToggles(t => t.map((v,j) => j===i?!v:v))}/>
                      <div>
                        <div style={{fontSize:12,color:'var(--ivory)'}}>{a.rule}</div>
                        <div style={{fontSize:10,color:'var(--slate)'}}>{a.desc}</div>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-xs" onClick={() => openEdit(i)}>Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments & Invoicing */}
          {activeTab === 'payments' && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                <div>
                  <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500}}>Payments & Invoicing</div>
                  <div style={{fontSize:11,color:'var(--slate)',marginTop:2}}>Connect gateways, create invoices, and send payment links to clients</div>
                </div>
                <button className="btn btn-champ btn-sm" onClick={() => { setPaymentSubTab('invoices'); setShowNewInvoice(true); }}>+ New Invoice</button>
              </div>

              {/* Sub-tabs */}
              <div style={{display:'flex',gap:4,marginBottom:20,borderBottom:'1px solid var(--border)'}}>
                {([['gateways','Payment Gateways'],['invoices','Invoices'],['links','Payment Links']] as const).map(([id,label]) => (
                  <div key={id} onClick={() => { setPaymentSubTab(id); setShowNewInvoice(false); }} style={{
                    padding:'8px 16px',fontSize:10,letterSpacing:0.8,textTransform:'uppercase',cursor:'pointer',transition:'all 0.15s',
                    color: paymentSubTab===id ? 'var(--champagne)' : 'var(--slate)',
                    borderBottom: paymentSubTab===id ? '2px solid var(--champagne)' : '2px solid transparent',
                  }}>{label}</div>
                ))}
              </div>

              {/* Payment Gateways */}
              {paymentSubTab === 'gateways' && (
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {paymentGateways.map((gw,i) => (
                    <div key={i} style={{
                      display:'flex',alignItems:'center',justifyContent:'space-between',
                      padding:'16px 18px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10,
                      borderLeft: gw.status === 'connected' ? '3px solid var(--emerald-lt)' : '3px solid var(--border)',
                    }}>
                      <div style={{display:'flex',alignItems:'center',gap:14,flex:1}}>
                        <div style={{
                          width:40,height:40,borderRadius:10,
                          background: gw.status === 'connected' ? 'rgba(59,154,156,0.1)' : 'var(--bg4)',
                          border:`1px solid ${gw.status === 'connected' ? 'rgba(59,154,156,0.2)' : 'var(--border)'}`,
                          display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,
                          color: gw.status === 'connected' ? 'var(--emerald-lt)' : 'var(--slate)',
                        }}>{gw.status === 'connected' ? '◆' : '◇'}</div>
                        <div style={{flex:1}}>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <span style={{fontSize:13,color:'var(--ivory)',fontWeight:500}}>{gw.name}</span>
                            {gw.status === 'connected' && <span className="badge b-em" style={{fontSize:7}}>Connected</span>}
                          </div>
                          <div style={{fontSize:10,color:'var(--slate)',marginTop:2}}>{gw.desc}</div>
                          <div style={{fontSize:9,color:'var(--slate-dim)',marginTop:3}}>
                            Processing fee: {gw.fees}
                            {gw.acct && <span style={{marginLeft:8}}>· Account: <span style={{color:'var(--champagne)'}}>{gw.acct}</span></span>}
                          </div>
                        </div>
                      </div>
                      <div style={{display:'flex',gap:6}}>
                        {gw.status === 'connected' ? (
                          <>
                            <button className="btn btn-ghost btn-xs">Settings</button>
                            <button className="btn btn-ghost btn-xs">Test Payment</button>
                            <button className="btn btn-xs" style={{background:'rgba(155,58,58,0.15)',color:'var(--ruby-lt)',border:'none'}}>Disconnect</button>
                          </>
                        ) : (
                          <button className="btn btn-champ btn-sm">Connect</button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div style={{
                    padding:'16px 18px',background:'var(--bg3)',border:'1px dashed var(--border)',borderRadius:10,
                    textAlign:'center',marginTop:4,
                  }}>
                    <div style={{fontSize:11,color:'var(--slate)',marginBottom:6}}>Need a different gateway?</div>
                    <button className="btn btn-ghost" style={{fontSize:10,padding:'6px 16px'}}>Request Integration</button>
                  </div>

                  {/* Payout settings */}
                  <div style={{marginTop:8}}>
                    <div style={{fontSize:10,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:10}}>Payout Settings</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                      <div style={{padding:'14px 16px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10}}>
                        <div style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:4}}>Payout Schedule</div>
                        <select className="td-input" style={{width:'100%',fontSize:11}} defaultValue="weekly">
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly (Every Monday)</option>
                          <option value="monthly">Monthly (1st of month)</option>
                        </select>
                      </div>
                      <div style={{padding:'14px 16px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10}}>
                        <div style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:4}}>Default Currency</div>
                        <select className="td-input" style={{width:'100%',fontSize:11}} defaultValue="usd">
                          <option value="usd">USD — US Dollar</option>
                          <option value="eur">EUR — Euro</option>
                          <option value="gbp">GBP — British Pound</option>
                          <option value="cad">CAD — Canadian Dollar</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invoices */}
              {paymentSubTab === 'invoices' && !showNewInvoice && (
                <div>
                  {/* Invoice KPIs */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:18}}>
                    {[
                      {label:'Outstanding',value:'$21,000',color:'var(--cognac-lt)'},
                      {label:'Paid This Month',value:'$10,200',color:'var(--emerald-lt)'},
                      {label:'Overdue',value:'$12,600',color:'var(--ruby-lt)'},
                      {label:'Total Invoiced',value:'$31,200',color:'var(--champagne)'},
                    ].map((k,i) => (
                      <div key={i} style={{padding:'12px 14px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8}}>
                        <div style={{fontSize:8,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>{k.label}</div>
                        <div className="playfair" style={{fontSize:20,color:k.color}}>{k.value}</div>
                      </div>
                    ))}
                  </div>

                  <table className="tbl">
                    <thead><tr>{['Invoice','Client','Trip','Amount','Issued','Due','Status',''].map(h => <th key={h}>{h}</th>)}</tr></thead>
                    <tbody>
                      {invoices.map((inv,i) => (
                        <tr key={i}>
                          <td style={{fontSize:11,color:'var(--champagne)',fontWeight:500}}>{inv.id}</td>
                          <td className="td-main" style={{fontSize:11}}>{inv.client}</td>
                          <td style={{fontSize:11,color:'var(--ivory-dim)'}}>{inv.trip}</td>
                          <td className="td-gold" style={{fontSize:12}}>{inv.amount}</td>
                          <td style={{fontSize:10,color:'var(--slate)'}}>{inv.issued}</td>
                          <td style={{fontSize:10,color:'var(--slate)'}}>{inv.due}</td>
                          <td>
                            <span className={`badge ${inv.status === 'paid' ? 'b-em' : inv.status === 'sent' ? 'b-sa' : 'b-ru'}`}>
                              {inv.status === 'paid' ? 'Paid' : inv.status === 'sent' ? 'Sent' : 'Overdue'}
                            </span>
                          </td>
                          <td>
                            <div style={{display:'flex',gap:4}}>
                              <button className="btn btn-ghost btn-xs">View</button>
                              {inv.status !== 'paid' && <button className="btn btn-ghost btn-xs">Resend</button>}
                              {inv.status !== 'paid' && <button className="btn btn-ghost btn-xs">Copy Link</button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* New Invoice Form */}
              {paymentSubTab === 'invoices' && showNewInvoice && (
                <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:12,padding:24}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                    <div style={{fontSize:14,color:'var(--ivory)',fontWeight:500}}>Create New Invoice</div>
                    <button className="btn btn-ghost btn-xs" onClick={() => setShowNewInvoice(false)}>Cancel</button>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
                    <div>
                      <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Client</div>
                      <select className="td-input" style={{width:'100%'}}>
                        <option>Select a client...</option>
                        <option>Holland, Augusta</option>
                        <option>Baker, Sean</option>
                        <option>McGarey, Patrick & Cristin</option>
                        <option>Diaz, Maria</option>
                      </select>
                    </div>
                    <div>
                      <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Trip</div>
                      <select className="td-input" style={{width:'100%'}}>
                        <option>Select a trip...</option>
                        <option>Capri</option>
                        <option>Westlake</option>
                        <option>Scotland</option>
                        <option>DC Business</option>
                      </select>
                    </div>
                  </div>

                  <div style={{fontSize:10,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:10,marginTop:8}}>Line Items</div>
                  <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:8,overflow:'hidden',marginBottom:14}}>
                    <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 40px',padding:'8px 14px',borderBottom:'1px solid var(--border2)'}}>
                      {['Description','Qty','Amount',''].map(h => <span key={h} style={{fontSize:8,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)'}}>{h}</span>)}
                    </div>
                    {[
                      {desc:'Hotel deposit — Caesar Augustus',qty:'1',amount:'$4,200.00'},
                      {desc:'Flight booking — AA Business Class',qty:'2',amount:'$3,980.00'},
                    ].map((item,i) => (
                      <div key={i} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 40px',padding:'8px 14px',borderBottom:'1px solid var(--border2)',alignItems:'center'}}>
                        <input className="td-input" defaultValue={item.desc} style={{fontSize:11}}/>
                        <input className="td-input" defaultValue={item.qty} style={{fontSize:11,width:50}}/>
                        <input className="td-input" defaultValue={item.amount} style={{fontSize:11,width:100}}/>
                        <div style={{cursor:'pointer',color:'var(--ruby-lt)',fontSize:14,textAlign:'center'}}>×</div>
                      </div>
                    ))}
                    <div style={{padding:'8px 14px'}}>
                      <button className="btn btn-ghost btn-xs">+ Add Line Item</button>
                    </div>
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:18}}>
                    <div>
                      <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Due Date</div>
                      <input className="td-input" type="date" style={{width:'100%',fontSize:11}}/>
                    </div>
                    <div>
                      <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Payment Gateway</div>
                      <select className="td-input" style={{width:'100%'}}>
                        <option>Stripe (Connected)</option>
                        <option>Square</option>
                        <option>PayPal</option>
                      </select>
                    </div>
                    <div>
                      <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Payment Methods</div>
                      <select className="td-input" style={{width:'100%'}}>
                        <option>Credit Card + ACH</option>
                        <option>Credit Card Only</option>
                        <option>ACH Only</option>
                      </select>
                    </div>
                  </div>

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 18px',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:8,marginBottom:18}}>
                    <span style={{fontSize:11,color:'var(--slate)',letterSpacing:0.5,textTransform:'uppercase'}}>Invoice Total</span>
                    <span className="playfair" style={{fontSize:24,color:'var(--champagne)'}}>$8,180.00</span>
                  </div>

                  <div style={{display:'flex',gap:8}}>
                    <button className="btn btn-champ" style={{flex:1}}>Send Invoice to Client</button>
                    <button className="btn btn-ghost">Save as Draft</button>
                    <button className="btn btn-ghost">Preview</button>
                  </div>

                  <div style={{fontSize:9,color:'var(--slate-dim)',marginTop:12,textAlign:'center'}}>
                    Client will receive an email with a secure payment link via your connected gateway
                  </div>
                </div>
              )}

              {/* Payment Links */}
              {paymentSubTab === 'links' && (
                <div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                    <div style={{fontSize:11,color:'var(--slate)'}}>Shareable payment links for direct client payments</div>
                    <button className="btn btn-champ btn-sm">+ Create Payment Link</button>
                  </div>

                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {paymentLinks.map((pl,i) => (
                      <div key={i} style={{
                        padding:'16px 18px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10,
                      }}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                          <div>
                            <div style={{fontSize:12,color:'var(--ivory)',fontWeight:500}}>{pl.client}</div>
                            <div style={{fontSize:10,color:'var(--slate)',marginTop:2}}>{pl.trip}</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <div className="playfair" style={{fontSize:18,color:'var(--champagne)'}}>{pl.amount}</div>
                            <span className="badge b-em" style={{fontSize:7,marginTop:4}}>{pl.status === 'active' ? 'Active' : 'Expired'}</span>
                          </div>
                        </div>
                        <div style={{
                          display:'flex',alignItems:'center',gap:8,padding:'8px 12px',
                          background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:8,marginBottom:10,
                        }}>
                          <span style={{flex:1,fontSize:10,color:'var(--champagne)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{pl.link}</span>
                          <button className="btn btn-ghost btn-xs" onClick={() => navigator.clipboard?.writeText(`https://${pl.link}`)}>Copy</button>
                          <button className="btn btn-ghost btn-xs">Email to Client</button>
                        </div>
                        <div style={{display:'flex',gap:16,fontSize:9,color:'var(--slate)'}}>
                          <span>Created: {pl.created}</span>
                          <span>Views: {pl.views}</span>
                          <span>Gateway: Stripe</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Agency Settings */}
          {activeTab === 'agency' && (
            <div>
              <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500,marginBottom:20}}>Agency Settings</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16}}>
                {[
                  { label: 'Agency Name', el: <input className="td-input" defaultValue="Halie McGee Travel"/> },
                  { label: 'Subdomain', el: <input className="td-input" defaultValue="haliemcgee"/> },
                  { label: 'Brand Color', el: <div style={{display:'flex',gap:8}}><input type="color" defaultValue="#3B9A9C" style={{width:40,height:36,border:'none',background:'transparent',cursor:'pointer'}}/><input className="td-input" defaultValue="3B9A9C" style={{width:100}}/></div> },
                  { label: 'Timezone', el: <select className="td-input"><option>America/New_York (EST)</option><option>America/Los_Angeles (PST)</option><option>Europe/London (GMT)</option></select> },
                ].map((f,i) => (
                  <div key={i}>
                    <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>{f.label}</div>
                    {f.el}
                  </div>
                ))}
              </div>
              {/* Theme Toggle */}
              <div style={{marginTop:20,marginBottom:20,padding:'16px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:12,color:'var(--ivory)',fontWeight:500}}>Theme</div>
                    <div style={{fontSize:10,color:'var(--slate)',marginTop:2}}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:10,color:'var(--slate)',letterSpacing:0.5,textTransform:'uppercase'}}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                    <div className={`toggle${theme === 'light' ? ' on' : ''}`} onClick={toggleTheme}/>
                  </div>
                </div>
              </div>
              <button className="btn btn-champ">Save Settings</button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div>
              <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500,marginBottom:20}}>Notification & Reminder Settings</div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {notifications.map((n,i) => (
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10,gap:10}}>
                    <div>
                      <div style={{fontSize:12,color:'var(--ivory)'}}>{n.title}</div>
                      <div style={{fontSize:10,color:'var(--slate)'}}>{n.desc}</div>
                    </div>
                    <div className={`toggle${notifToggles[i]?' on':''}`} onClick={() => setNotifToggles(t => t.map((v,j) => j===i?!v:v))}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Passport & Visas */}
          {activeTab === 'passports' && (
            <div>
              <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500,marginBottom:4}}>Passport & Visa Tracking</div>
              <div style={{fontSize:11,color:'var(--slate)',marginBottom:20}}>Notify 1 year before expiry</div>
              <table className="tbl">
                <thead><tr>{['Client','Passport Expiry','Days Until Expiry','Visa Required','Status'].map(h => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {passports.map((p,i) => (
                    <tr key={i}>
                      <td className="td-main">{p.client}</td>
                      <td>{p.expiry}</td>
                      <td>{p.days} days</td>
                      <td>{p.visa}</td>
                      <td><span className={`badge ${p.statusBadge}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Team Calendar */}
          {activeTab === 'calendar' && (
            <div>
              <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500,marginBottom:20}}>Team Calendar & Time Off</div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {calendarEntries.map((e,i) => (
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <div>
                        <div style={{fontSize:12,color:'var(--ivory)'}}>{e.person}</div>
                        <div style={{fontSize:10,color:'var(--slate)'}}>{e.desc}</div>
                      </div>
                    </div>
                    <span className={`badge ${e.badgeClass}`}>{e.badgeText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Automation Edit Modal */}
      {editIndex !== null && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={closeModal}>
          <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:28,maxWidth:560,width:'90%'}} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={{fontSize:15,color:'var(--ivory)',fontWeight:500}}>{editIndex === -1 ? 'New Automation' : 'Edit Automation'}</div>
              <div onClick={closeModal} style={{cursor:'pointer',fontSize:18,color:'var(--slate)',lineHeight:1}}>&#x2715;</div>
            </div>

            {/* Fields */}
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div>
                <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Rule Name</div>
                <input className="td-input" style={{width:'100%'}} value={editForm.rule} onChange={e => setEditForm(f => ({...f, rule: e.target.value}))}/>
              </div>
              <div>
                <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Description</div>
                <input className="td-input" style={{width:'100%'}} value={editForm.desc} onChange={e => setEditForm(f => ({...f, desc: e.target.value}))}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div>
                  <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Trigger Type</div>
                  <select className="td-input" style={{width:'100%'}} value={editForm.triggerType} onChange={e => setEditForm(f => ({...f, triggerType: e.target.value}))}>
                    {triggerTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Trigger Value</div>
                  <input className="td-input" style={{width:'100%'}} placeholder="e.g. 2 days, 1 week" value={editForm.triggerValue} onChange={e => setEditForm(f => ({...f, triggerValue: e.target.value}))}/>
                </div>
              </div>
              <div>
                <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Action</div>
                <select className="td-input" style={{width:'100%'}} value={editForm.action} onChange={e => setEditForm(f => ({...f, action: e.target.value}))}>
                  {actionTypes.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div className={`toggle${editForm.active?' on':''}`} onClick={() => setEditForm(f => ({...f, active: !f.active}))}/>
                <span style={{fontSize:11,color:'var(--ivory)'}}>{editForm.active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:24}}>
              {editIndex !== -1 ? (
                <button className="btn btn-ghost" style={{color:'var(--ruby-lt)'}} onClick={handleDelete}>Delete Automation</button>
              ) : <div/>}
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button className="btn btn-champ" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
