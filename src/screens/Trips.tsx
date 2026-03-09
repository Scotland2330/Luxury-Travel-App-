import { useState } from 'react';

const tripCards = [
  { id: 'maldives', title: 'Maldives · Water Villas', client: 'Harrington, Patricia', bar: 'linear-gradient(90deg,var(--sapphire),var(--sapphire-lt))', badge: 'b-em', status: 'Confirmed', dep: 'Mar 12', ret: 'Mar 22', value: '$18,400', tasks: 6, done: 3, pct: 50, barColor: 'var(--emerald)', advisor: 'DO', advisorName: 'Denise O.', pill: '✈ 6 days', pillBg: 'rgba(46,95,158,0.3)', pillColor: 'var(--sapphire-lt)' },
  { id: 'dubrovnik', title: 'Dubrovnik & Hvar Island', client: 'Chen, Michelle', bar: 'linear-gradient(90deg,var(--cognac),var(--cognac-lt))', badge: 'b-sa', status: 'Planning', dep: 'Apr 3', ret: 'Apr 12', value: '$15,200', tasks: 9, done: 4, pct: 44, barColor: 'var(--emerald)', advisor: 'DO', advisorName: 'Denise O.', pill: '⚠ Payment due Mar 17', pillBg: 'rgba(181,96,30,0.3)', pillColor: 'var(--cognac-lt)' },
  { id: 'safari', title: 'Masai Mara Safari', client: 'Okonkwo, Adaeze', bar: 'linear-gradient(90deg,var(--ruby),var(--ruby-lt))', badge: 'b-rb', status: 'Action Needed', dep: 'Apr 22', ret: 'Apr 30', value: '$31,500', tasks: 7, done: 1, pct: 14, barColor: 'var(--ruby)', advisor: 'MT', advisorName: 'Marcus T.', pill: '⚠ Deposit overdue', pillBg: 'rgba(155,58,58,0.3)', pillColor: 'var(--ruby-lt)' },
  { id: 'amalfi', title: 'Amalfi Coast · Villa Rufolo', client: 'Delacroix, Sophie', bar: 'linear-gradient(90deg,var(--emerald),var(--emerald-lt))', badge: 'b-em', status: 'Confirmed', dep: 'Mar 14', ret: 'Mar 21', value: '$24,800', tasks: 5, done: 5, pct: 100, barColor: 'var(--emerald)', advisor: 'SK', advisorName: 'Sarah K.', pill: '✈ 8 days', pillBg: 'rgba(46,95,158,0.3)', pillColor: 'var(--sapphire-lt)' },
  { id: 'swiss', title: 'Swiss Alps · Zermatt', client: 'Williams, Thomas', bar: 'linear-gradient(90deg,var(--slate-dim),var(--slate))', badge: 'b-mu', status: 'Inquiry', dep: 'Jun 15', ret: 'Jun 25', value: '$19,900', tasks: 0, done: 0, pct: 0, barColor: 'var(--slate)', advisor: 'SK', advisorName: 'Sarah K.', pill: 'Awaiting deposit', pillBg: 'var(--bg5)', pillColor: 'var(--slate)' },
];

const avColors: Record<string, string> = { DO: 'linear-gradient(135deg,#3a2a10,#6a4a1a)', MT: 'linear-gradient(135deg,#1a2a3a,#2a4060)', SK: 'linear-gradient(135deg,#1a2a2a,#2a4040)' };
const avTextColors: Record<string, string> = { DO: 'var(--champagne)', MT: 'var(--sapphire-lt)', SK: 'var(--emerald-lt)' };

type ItinItem = { icon: string; iconBg: string; name: string; sub: string; conf: string; cost: string; badge?: string; badgeText?: string; confColor?: string; warn?: boolean };
const itinerary: { day: string; title: string; date: string; items: ItinItem[] }[] = [
  { day: '1', title: 'Arrival · Dubrovnik', date: 'Thursday, April 3', items: [
    { icon: '✈', iconBg: 'rgba(46,95,158,0.3)', name: 'AA 1842 · JFK → DBV', sub: 'Departs 9:15am · Arrives 11:40pm local', conf: 'CONF: AA-4829KX', badge: 'b-em', badgeText: 'Confirmed', cost: '$2,400' },
    { icon: '🚗', iconBg: 'rgba(107,61,155,0.3)', name: 'Private Transfer · Airport to Hotel', sub: 'Adriatic Transfers · Mercedes S-Class', conf: 'Pending confirmation', confColor: 'var(--cognac-lt)', cost: '$180' },
    { icon: '🏨', iconBg: 'rgba(212,175,106,0.2)', name: 'Villa Orsula, Dubrovnik', sub: 'Apr 3–8 · Sea View Suite · 5 nights', conf: 'CONF: VO-2025-334', badge: 'b-em', badgeText: 'Confirmed', cost: '$5,200' },
  ]},
  { day: '5', title: 'Transfer to Hvar', date: 'Monday, April 7', items: [
    { icon: '⚓', iconBg: 'rgba(61,139,110,0.3)', name: 'Private Yacht · Dubrovnik to Hvar', sub: 'Blue Adriatic Yachts · 4hr scenic crossing', conf: '⚠ Awaiting deposit · Task pending', confColor: 'var(--cognac-lt)', cost: '$1,800', warn: true },
  ]},
];

const tripTasks = [
  { done: true, title: 'Book flights JFK → DBV', sub: 'Denise O. · Start Feb 20 · Done Mar 2 · 0.5h logged', badge: 'b-em', badgeText: 'Done' },
  { done: true, title: 'Reserve Villa Orsula', sub: 'Denise O. · Start Feb 22 · Done Feb 28 · 0.75h logged', badge: 'b-em', badgeText: 'Done' },
  { done: false, title: 'Request passport copy from client', sub: 'Denise O. · Start Mar 1 · Due Today', badge: 'b-og', badgeText: 'Today', border: 'rgba(212,175,106,0.15)' },
  { done: false, title: 'Confirm yacht charter — Blue Adriatic', sub: 'Marcus T. · Start Mar 3 · Due Mar 10', badge: 'b-sa', badgeText: 'Mar 10' },
  { done: false, title: 'Travel insurance confirmation', sub: 'Client action needed · Due Mar 15', badge: 'b-mu', badgeText: 'Client' },
];

const payments = [
  { name: 'Deposit (25%)', sub: 'Paid Jan 14, 2025', subColor: 'var(--slate)', amount: '$3,800', badge: 'b-em', badgeText: 'Paid' },
  { name: '2nd Payment (50%)', sub: 'Due March 17 · Auto-reminder Mar 10 & 16', subColor: 'var(--cognac-lt)', amount: '$7,600', badge: 'b-og', badgeText: 'Due Soon' },
  { name: 'Final Balance (25%)', sub: 'Due March 28 · Auto-reminder Mar 21 & 27', subColor: 'var(--slate)', amount: '$3,800', badge: 'b-mu', badgeText: 'Pending' },
];

const docs = [
  { icon: '✈', name: 'AA_Tickets_Harrington.pdf', size: '342 KB · Mar 2', badge: 'b-em', badgeText: 'Confirmed' },
  { icon: '🏨', name: 'VillaOrsula_Confirmation.pdf', size: '218 KB · Feb 28', badge: 'b-em', badgeText: 'Confirmed' },
  { icon: '📋', name: 'Passport Copy', size: 'Required from client', badge: 'b-rb', badgeText: 'Missing', border: 'rgba(155,58,58,0.3)' },
];

export default function Trips() {
  const [detailView, setDetailView] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary');

  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      {/* List View */}
      {!detailView && (
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
            <div>
              <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Trips</h1>
              <p style={{fontSize:11,color:'var(--slate)',marginTop:4}}>8 active · 2 departing this month · $124,000 total value</p>
            </div>
            <div style={{display:'flex',gap:8}}>
              <select className="td-input" style={{width:120,fontSize:10,padding:'6px 10px'}}><option>All Statuses</option></select>
              <select className="td-input" style={{width:120,fontSize:10,padding:'6px 10px'}}><option>All Advisors</option></select>
              <button className="btn btn-champ">+ New Trip</button>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
            {tripCards.map(t => (
              <div key={t.id} className="trip-card" onClick={() => setDetailView(true)}>
                <div style={{height:5,background:t.bar}}/>
                <div style={{padding:'16px 18px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                    <div>
                      <div className="playfair" style={{fontSize:17,color:'var(--ivory)'}}>{t.title}</div>
                      <div style={{fontSize:11,color:'var(--slate)',marginTop:2}}>{t.client}</div>
                    </div>
                    <span className={`badge ${t.badge}`}>{t.status}</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
                    {[{l:'Departure',v:t.dep},{l:'Return',v:t.ret}].map((d,i) => (
                      <div key={i} style={{background:'var(--bg3)',borderRadius:7,padding:'8px 10px'}}>
                        <div style={{fontSize:8,letterSpacing:1,textTransform:'uppercase',color:'var(--slate)'}}>{d.l}</div>
                        <div style={{fontSize:12,color:'var(--ivory)'}}>{d.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="playfair" style={{fontSize:20,color:'var(--champagne)',marginBottom:8}}>{t.value}</div>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                    <span style={{fontSize:10,color:'var(--slate)'}}>{t.tasks?`${t.tasks} tasks · ${t.done} done`:'No tasks yet'}</span>
                    {t.tasks > 0 && <div style={{width:50,height:3,background:'var(--bg5)',borderRadius:3}}><div style={{width:`${t.pct}%`,height:3,borderRadius:3,background:t.barColor}}/></div>}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <div style={{width:20,height:20,borderRadius:'50%',background:avColors[t.advisor],display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:avTextColors[t.advisor],fontWeight:500}}>{t.advisor}</div>
                      <span style={{fontSize:10,color:'var(--slate)'}}>{t.advisorName}</span>
                    </div>
                    <span style={{fontSize:9,padding:'2px 7px',borderRadius:5,background:t.pillBg,color:t.pillColor}}>{t.pill}</span>
                  </div>
                </div>
              </div>
            ))}
            {/* Add new */}
            <div style={{border:'1px dashed var(--border)',borderRadius:12,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',minHeight:200,gap:8}} onClick={() => {}}>
              <span style={{fontSize:32,color:'var(--slate)'}}>+</span>
              <span style={{fontSize:12,color:'var(--slate)'}}>New Trip</span>
            </div>
          </div>
        </div>
      )}

      {/* Detail View */}
      {detailView && (
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
            <div>
              <button className="btn btn-ghost btn-sm" onClick={() => setDetailView(false)} style={{marginBottom:12}}>← Back</button>
              <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Dubrovnik & Hvar Island</h1>
              <p style={{fontSize:11,color:'var(--slate)',marginTop:4}}>Chen, Michelle · 9 nights · Apr 3–12, 2025</p>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-ghost">Export PDF</button>
              <button className="btn btn-champ">Share Portal</button>
            </div>
          </div>

          {/* Status bar */}
          <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
            {[
              {l:'Status',v:<span className="badge b-sa">Planning</span>},
              {l:'Total Value',v:<span className="playfair" style={{fontSize:20,color:'var(--champagne)'}}>$15,200</span>},
              {l:'Departure',v:<span style={{fontSize:14,color:'var(--ivory)'}}>Apr 3</span>},
              {l:'Days Away',v:<span className="playfair" style={{fontSize:20,color:'var(--champagne)'}}>28</span>},
              {l:'Tasks',v:<span style={{fontSize:12}}>4 of 9 done</span>},
            ].map((c,i) => (
              <div key={i} style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:10,padding:'12px 18px'}}>
                <div style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:4}}>{c.l}</div>
                {c.v}
              </div>
            ))}
            <div style={{background:'var(--bg2)',border:'1px solid rgba(155,58,58,0.3)',borderRadius:10,padding:'12px 18px'}}>
              <div style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:4}}>Balance Due</div>
              <span className="playfair" style={{fontSize:20,color:'var(--ruby-lt)'}}>$11,400</span>
            </div>
          </div>

          {/* Tab strip */}
          <div style={{display:'flex',borderBottom:'1px solid var(--border)',marginBottom:20}}>
            {[{id:'itinerary',l:'Itinerary'},{id:'tasks',l:'Tasks'},{id:'payments',l:'Payments'},{id:'docs',l:'Documents'},{id:'notes',l:'Notes'}].map(t => (
              <div key={t.id} onClick={() => setActiveTab(t.id)} style={{padding:'11px 18px',fontSize:11,fontWeight:activeTab===t.id?500:400,color:activeTab===t.id?'var(--champagne)':'var(--slate)',borderBottom:activeTab===t.id?'2px solid var(--champagne)':'2px solid transparent',cursor:'pointer',letterSpacing:0.8,textTransform:'uppercase'}}>{t.l}</div>
            ))}
          </div>

          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <div>
              <div style={{display:'flex',gap:8,marginBottom:16}}>
                <button className="btn btn-ghost btn-sm">Export PDF</button>
                <button className="btn btn-champ btn-sm">+ Add Item</button>
              </div>
              {itinerary.map((day, di) => (
                <div key={di} style={{marginBottom:24}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                    <div style={{width:32,height:32,borderRadius:8,background:'var(--champ-dim)',border:'1px solid rgba(212,175,106,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--champagne)',fontSize:12,fontWeight:600}}>{day.day}</div>
                    <span style={{fontSize:13,color:'var(--ivory)',fontWeight:500}}>{day.title}</span>
                    <span style={{fontSize:10,color:'var(--slate)'}}>{day.date}</span>
                  </div>
                  <div style={{paddingLeft:44,display:'flex',flexDirection:'column',gap:8}}>
                    {day.items.map((item, ii) => (
                      <div key={ii} style={{display:'flex',gap:10,padding:'10px 14px',background:'var(--bg3)',border:`1px solid ${item.warn?'rgba(181,96,30,0.3)':'var(--border)'}`,borderRadius:8,alignItems:'center'}}>
                        <div style={{width:26,height:26,borderRadius:6,background:item.iconBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,flexShrink:0}}>{item.icon}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,color:'var(--ivory)',fontWeight:500}}>{item.name}</div>
                          <div style={{fontSize:10,color:'var(--slate)'}}>{item.sub}</div>
                          <div style={{fontSize:10,marginTop:2}}>
                            {item.badge ? <><span style={{color:'var(--slate)'}}>{item.conf}</span> <span className={`badge ${item.badge}`} style={{marginLeft:6}}>{item.badgeText}</span></> :
                              <span style={{color:item.confColor||'var(--slate)'}}>{item.conf}</span>}
                          </div>
                        </div>
                        <span className="playfair" style={{fontSize:14,color:'var(--champagne)',flexShrink:0}}>{item.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div>
              <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}><button className="btn btn-champ btn-sm">+ Add Task</button></div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {tripTasks.map((t,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 16px',background:'var(--bg2)',border:`1px solid ${t.border||'var(--border)'}`,borderRadius:9,cursor:'pointer'}}>
                    <div className={`cl-check${t.done?' done':''}`}>{t.done && <span style={{fontSize:9,color:'white'}}>✓</span>}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:'var(--ivory)',fontWeight:400}}>{t.title}</div>
                      <div style={{fontSize:10,color:'var(--slate)'}}>{t.sub}</div>
                    </div>
                    <span className={`badge ${t.badge}`}>{t.badgeText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}><button className="btn btn-champ btn-sm">+ Add Milestone</button></div>
              <div className="card">
                {payments.map((p,i) => (
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 20px',borderBottom:i<payments.length-1?'1px solid var(--border2)':'none'}}>
                    <div>
                      <div style={{fontSize:13,color:'var(--ivory)',fontWeight:500}}>{p.name}</div>
                      <div style={{fontSize:10,color:p.subColor,marginTop:2}}>{p.sub}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div className="playfair" style={{fontSize:20,color:'var(--champagne)'}}>{p.amount}</div>
                      <span className={`badge ${p.badge}`} style={{marginTop:4,display:'inline-block'}}>{p.badgeText}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'docs' && (
            <div>
              <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}><button className="btn btn-champ btn-sm">Upload</button></div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                {docs.map((d,i) => (
                  <div key={i} style={{background:'var(--bg2)',border:`1px solid ${d.border||'var(--border)'}`,borderRadius:10,padding:14,cursor:'pointer'}}>
                    <div style={{fontSize:24,marginBottom:6}}>{d.icon}</div>
                    <div style={{fontSize:11,color:'var(--ivory)'}}>{d.name}</div>
                    <div style={{fontSize:9,color:'var(--slate)',marginTop:3}}>{d.size}</div>
                    <span className={`badge ${d.badge}`} style={{marginTop:8,display:'inline-block'}}>{d.badgeText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="card">
              <div className="card-b">
                <textarea style={{width:'100%',background:'transparent',border:'none',outline:'none',fontFamily:'Jost',fontSize:12,color:'var(--ivory-dim)',fontWeight:300,minHeight:200,resize:'none',lineHeight:1.7}} defaultValue={`Client prefers window seats. Allergic to shellfish — notify all restaurants.\nVilla Orsula: request room 304 (corner suite, best view).\nYacht charter: client wants stop at Pakleni Islands for lunch.\nBudget flexibility: up to 10% overage approved verbally by client.\nPassport expires Jan 2026 — flag for renewal before Croatia trip.`}/>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
