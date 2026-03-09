import { useState } from 'react';

const tabs = ['Staff & Roles', 'Payment Gateways', 'Agency Settings', 'Notifications', 'Plan & Billing', 'Audit Log'];
const tabIds = ['staff', 'payments-api', 'agency', 'notifications', 'billing-plan', 'audit'];

const staff = [
  { init: 'DO', name: "Denise O'Donnell", email: 'denise@meridian.com', role: 'Owner', roleBadge: 'b-ch', rate: '$150/hr', status: 'Active', statusBadge: 'b-em', bg: 'linear-gradient(135deg,#3a2a10,#6a4a1a)', color: 'var(--champagne)', borderColor: 'rgba(212,175,106,0.3)', owner: true },
  { init: 'MT', name: 'Marcus Thompson', email: 'marcus@meridian.com', role: 'Advisor', roleBadge: 'b-sa', rate: '$120/hr', status: 'Active', statusBadge: 'b-em', bg: 'linear-gradient(135deg,#1a2a3a,#2a4060)', color: 'var(--sapphire-lt)', borderColor: 'rgba(46,95,158,0.3)' },
  { init: 'SK', name: 'Sarah Kim', email: 'sarah@meridian.com', role: 'Advisor', roleBadge: 'b-sa', rate: '$120/hr', status: 'Active', statusBadge: 'b-em', bg: 'linear-gradient(135deg,#1a2a2a,#2a4040)', color: 'var(--emerald-lt)', borderColor: 'rgba(61,139,110,0.3)' },
  { init: '?', name: 'Pending Invite', email: 'newadvisor@meridian.com', role: 'Advisor', roleBadge: 'b-mu', rate: '—', status: 'Invited', statusBadge: 'b-og', bg: 'transparent', color: 'var(--slate)', borderColor: 'var(--border)', dashed: true },
];

const permissions = [
  ['View all clients & trips', '✓', '✓', 'Own only', 'Own only'],
  ['Create / edit trips', '✓', '✓', '✓', '—'],
  ['Manage invoices & billing', '✓', '✓', 'View only', '—'],
  ['Admin & staff settings', '✓', 'Limited', '—', '—'],
  ['Payment gateway config', '✓', '—', '—', '—'],
];

const gateways = [
  { icon: '🟦', name: 'Square', desc: 'Current processor · migrate or keep', fields: [{ label: 'Access Token', type: 'password', ph: 'EAAAl••••' }, { label: 'Location ID', type: 'text', ph: 'L••••' }] },
  { icon: '🔵', name: 'PayPal / Braintree', desc: 'For international client payments', fields: [{ label: 'Client ID', type: 'text', ph: 'AZ••••' }, { label: 'Secret Key', type: 'password', ph: '••••' }] },
  { icon: '🟣', name: 'Authorize.Net', desc: 'US-based ACH + card processing', fields: [{ label: 'API Login ID', type: 'text', ph: '' }, { label: 'Transaction Key', type: 'password', ph: '' }] },
  { icon: '⚙', name: 'Custom Gateway', desc: 'Connect any PCI-compliant processor via REST API', fields: [{ label: 'Base API URL', type: 'text', ph: 'https://api.yourgateway.com/v1' }, { label: 'API Key / Bearer Token', type: 'password', ph: '' }], custom: true },
];

const notifications = [
  { title: 'Payment overdue alerts', desc: 'Notify advisor when payment is 1+ days overdue' },
  { title: 'Task overdue alerts', desc: 'Notify assigned advisor + admin' },
  { title: 'Passport expiry warnings', desc: 'Alert 6 months before passport expires relative to departure' },
  { title: 'Retainer overage alerts', desc: 'Alert when client exceeds included hours' },
  { title: '@mention email notifications', desc: 'Email when tagged in task chat' },
];

const auditLog = [
  { time: 'Mar 6, 10:22am', user: 'DO', action: 'Updated trip status: Chen · Dubrovnik → Planning' },
  { time: 'Mar 6, 9:15am', user: 'MT', action: 'Logged 3.0h on task: Safari lodge research' },
  { time: 'Mar 5, 4:30pm', user: 'DO', action: 'Created invoice #INV-2025-041 for Delacroix ($2,300)' },
  { time: 'Mar 5, 2:14pm', user: 'DO', action: 'Tagged @Marcus, @Sarah in task chat: Yacht Charter' },
  { time: 'Mar 4, 11:05am', user: 'MT', action: 'Uploaded file: BlueAdriatic_Quote.pdf to task' },
  { time: 'Mar 1, 9:00am', user: 'System', action: 'Retainer invoices auto-generated for 3 clients' },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('staff');
  const [notifToggles, setNotifToggles] = useState(notifications.map(() => true));

  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Admin</h1>
          <p style={{fontSize:11,color:'var(--slate)',marginTop:4}}>Meridian Travel Group · Agency settings, staff, and integrations</p>
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
                <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr',padding:'10px 16px',borderBottom:'1px solid var(--border2)'}}>
                  {['Permission','Owner','Admin','Advisor','Client'].map(h => (
                    <span key={h} style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)'}}>{h}</span>
                  ))}
                </div>
                {permissions.map((row,i) => (
                  <div key={i} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr',padding:'10px 16px',borderBottom:i<permissions.length-1?'1px solid var(--border2)':'none'}}>
                    {row.map((cell,j) => (
                      <span key={j} style={{fontSize:11,color:j===0?'var(--ivory-dim)':cell==='✓'?'var(--emerald-lt)':cell==='—'?'var(--slate-dim)':'var(--ivory-dim)'}}>{cell}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Gateways */}
          {activeTab === 'payments-api' && (
            <div>
              <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500}}>Payment Gateway Integrations</div>
              <div style={{fontSize:11,color:'var(--slate)',marginBottom:24}}>Connect your payment processor via API. All credentials are encrypted at rest. TripOS never stores card data directly.</div>

              {/* Active gateway */}
              <div style={{background:'var(--bg3)',border:'1px solid rgba(61,139,110,0.3)',borderRadius:12,padding:'18px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <div style={{width:44,height:44,background:'var(--bg4)',border:'1px solid var(--border)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>💳</div>
                  <div>
                    <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500}}>Stripe</div>
                    <div style={{fontSize:10,color:'var(--slate)'}}>Connected · sk_live_••••••••4j2k</div>
                    <div style={{fontSize:10,color:'var(--emerald-lt)'}}>✓ Invoices · ✓ Subscriptions · ✓ Webhooks active</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:6}}>
                  <button className="btn btn-ghost btn-sm">Configure</button>
                  <button className="btn btn-sm" style={{background:'rgba(155,58,58,0.2)',color:'var(--ruby-lt)',border:'none'}}>Disconnect</button>
                </div>
              </div>

              <div style={{fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:12}}>Available Integrations</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                {gateways.map((g,i) => (
                  <div key={i} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:12,padding:'18px 20px'}}>
                    <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:14}}>
                      <div style={{width:40,height:40,background:'var(--bg4)',border:'1px solid var(--border)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{g.icon}</div>
                      <div>
                        <div style={{fontSize:13,color:'var(--ivory)'}}>{g.name}</div>
                        <div style={{fontSize:10,color:'var(--slate)'}}>{g.desc}</div>
                      </div>
                    </div>
                    {g.fields.map((f,j) => (
                      <div key={j} style={{marginBottom:10}}>
                        <div style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:4}}>{f.label}</div>
                        <input className="td-input" type={f.type} placeholder={f.ph} style={{background:'var(--bg4)',borderRadius:7,fontSize:11}}/>
                      </div>
                    ))}
                    <div style={{display:'flex',gap:6,marginTop:4}}>
                      {!g.custom && <button className="btn btn-ghost btn-sm" style={{flex:1}}>Test Connection</button>}
                      <button className="btn btn-champ btn-sm" style={{flex:1}}>{g.custom ? 'Save' : 'Connect'}</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{background:'var(--champ-dim)',border:'1px solid var(--border)',borderRadius:10,padding:'14px 16px',fontSize:11,color:'var(--ivory-dim)',lineHeight:1.6,marginTop:16}}>
                <strong style={{color:'var(--champagne)'}}>Security note:</strong> All API keys are AES-256 encrypted before storage. TripOS communicates with gateways server-side only — keys are never exposed to the browser. Webhook endpoints are auto-configured for Stripe and Square on connect.
              </div>
            </div>
          )}

          {/* Agency Settings */}
          {activeTab === 'agency' && (
            <div>
              <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500,marginBottom:20}}>Agency Settings</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16}}>
                {[
                  { label: 'Agency Name', el: <input className="td-input" defaultValue="Meridian Travel Group"/> },
                  { label: 'Subdomain', el: <input className="td-input" defaultValue="meridian"/> },
                  { label: 'Brand Color', el: <div style={{display:'flex',gap:8}}><input type="color" defaultValue="#d4af6a" style={{width:40,height:36,border:'none',background:'transparent',cursor:'pointer'}}/><input className="td-input" defaultValue="d4af6a" style={{width:100}}/></div> },
                  { label: 'Timezone', el: <select className="td-input"><option>America/New_York (EST)</option><option>America/Los_Angeles (PST)</option><option>Europe/London (GMT)</option></select> },
                ].map((f,i) => (
                  <div key={i}>
                    <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>{f.label}</div>
                    {f.el}
                  </div>
                ))}
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

          {/* Plan & Billing */}
          {activeTab === 'billing-plan' && (
            <div>
              <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500,marginBottom:16}}>Current Plan</div>
              <div style={{background:'var(--champ-dim)',border:'1px solid rgba(212,175,106,0.25)',borderRadius:12,padding:20,marginBottom:20,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div className="playfair" style={{fontSize:22,color:'var(--champagne)'}}>Professional</div>
                  <div style={{fontSize:11,color:'var(--slate)',marginTop:4}}>Up to 5 advisors · Client portal · All features</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <span className="playfair" style={{fontSize:28,color:'var(--champagne)'}}>$199</span>
                  <span style={{fontSize:10,color:'var(--slate)'}}>/month</span>
                </div>
              </div>
              <div style={{fontSize:10,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:12}}>Usage</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                {[{l:'Advisors',v:'4',max:'/5'},{l:'Active Trips',v:'8',max:''},{l:'Clients',v:'12',max:''}].map((u,i) => (
                  <div key={i} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10,padding:14,textAlign:'center'}}>
                    <div style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>{u.l}</div>
                    <span className="playfair" style={{fontSize:24,color:'var(--champagne)'}}>{u.v}</span>
                    {u.max && <span style={{fontSize:14,color:'var(--slate)'}}>{u.max}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Log */}
          {activeTab === 'audit' && (
            <div>
              <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500,marginBottom:16}}>Audit Log</div>
              <div style={{display:'flex',flexDirection:'column'}}>
                {auditLog.map((a,i) => (
                  <div key={i} style={{display:'flex',gap:12,padding:'11px 0',borderBottom:'1px solid var(--border2)',fontSize:11}}>
                    <span style={{color:'var(--slate)',width:140,flexShrink:0}}>{a.time}</span>
                    <span style={{color:'var(--champagne)',width:80,flexShrink:0}}>{a.user}</span>
                    <span style={{color:'var(--ivory-dim)'}}>{a.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
