import { useState } from 'react';
import { useTheme } from '../ThemeContext';

const tabs = ['Staff & Roles', 'Automations', 'Agency Settings', 'Notifications', 'Passport & Visas', 'Team Calendar'];
const tabIds = ['staff', 'automations', 'agency', 'notifications', 'passports', 'calendar'];

const staff = [
  { init: 'HM', name: 'Halie McGee', email: 'halie@agency.com', role: 'Owner', roleBadge: 'b-ch', rate: '$150/hr', status: 'Active', statusBadge: 'b-em', bg: 'linear-gradient(135deg,#3a2a10,#6a4a1a)', color: 'var(--champagne)', borderColor: 'rgba(212,175,106,0.3)', owner: true },
  { init: 'ES', name: 'Emily Stone', email: 'emily@agency.com', role: 'Advisor', roleBadge: 'b-sa', rate: '$120/hr', status: 'Active', statusBadge: 'b-em', bg: 'linear-gradient(135deg,#1a2a3a,#2a4060)', color: 'var(--sapphire-lt)', borderColor: 'rgba(46,95,158,0.3)' },
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

  /* Automation edit modal state: index = -1 means "new", null means closed */
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AutomationForm>(emptyForm);

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
                          <div style={{width:28,height:28,borderRadius:'50%',background:s.bg,border:`1px solid ${s.borderColor}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:s.color,fontWeight:500,borderStyle:s.dashed?'dashed':'solid'}}>{s.init}</div>
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
                          <button className="btn btn-xs" style={{background:'rgba(155,58,58,0.2)',color:'var(--ruby-lt)',border:'none'}}>Remove</button>
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

          {/* Agency Settings */}
          {activeTab === 'agency' && (
            <div>
              <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500,marginBottom:20}}>Agency Settings</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16}}>
                {[
                  { label: 'Agency Name', el: <input className="td-input" defaultValue="Halie McGee Travel"/> },
                  { label: 'Subdomain', el: <input className="td-input" defaultValue="haliemcgee"/> },
                  { label: 'Brand Color', el: <div style={{display:'flex',gap:8}}><input type="color" defaultValue="#d4af6a" style={{width:40,height:36,border:'none',background:'transparent',cursor:'pointer'}}/><input className="td-input" defaultValue="d4af6a" style={{width:100}}/></div> },
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
