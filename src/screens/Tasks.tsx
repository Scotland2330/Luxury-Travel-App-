import { useState } from 'react';

type Task = { title: string; trip: string; tags?: string[]; due: string; dueClass?: string; assignees: string[]; attach?: string; comments?: string; border?: string; start?: string; done?: string };

const columns: { title: string; count: number; ruby?: boolean; tasks: Task[] }[] = [
  { title: 'TO DO', count: 6, tasks: [
    { title: 'Request passport copy from client', trip: 'Dubrovnik', tags: ['Client Docs'], due: 'Today', dueClass: 'today', start: 'Mar 1', attach: '2', assignees: ['DO'] },
    { title: 'Confirm yacht charter — Blue Adriatic', trip: 'Dubrovnik', tags: ['Vendor'], due: 'Mar 10', start: 'Mar 3', assignees: ['MT'] },
    { title: 'Travel insurance confirmation — Okonkwo', trip: 'Safari', tags: ['Insurance'], due: 'Mar 20', start: 'Mar 10', assignees: ['MT'] },
  ]},
  { title: 'IN PROGRESS', count: 5, tasks: [
    { title: 'Villa upgrade negotiation — Amalfi', trip: 'Amalfi', tags: ['Vendor', 'Urgent'], due: 'Today', dueClass: 'today', start: 'Mar 4', comments: '3', assignees: ['SK', 'DO'] },
    { title: 'Safari lodge options research deck', trip: 'Safari', tags: ['Research'], due: 'Mar 12', start: 'Mar 1', attach: '5', assignees: ['MT'] },
  ]},
  { title: 'BLOCKED / OVERDUE', count: 5, ruby: true, tasks: [
    { title: 'Okonkwo deposit follow-up', trip: 'Safari', tags: ['Overdue 3d'], due: 'Was Mar 3', dueClass: 'overdue', assignees: ['MT'], border: 'rgba(155,58,58,0.3)' },
    { title: 'Airport transfer confirmation — Harrington', trip: 'Maldives', tags: ['Overdue 1d'], due: 'Was Mar 4', dueClass: 'overdue', assignees: ['DO'], border: 'rgba(155,58,58,0.3)' },
    { title: 'Visa documentation — Delacroix', trip: 'Amalfi', tags: ['Awaiting Client'], due: 'Was Mar 5', dueClass: 'overdue', assignees: ['DO'], border: 'rgba(155,58,58,0.3)' },
  ]},
  { title: 'COMPLETED', count: 4, tasks: [
    { title: 'Book flights JFK → DBV — Chen', trip: 'Dubrovnik', done: 'Done Mar 2', due: '', assignees: ['DO'] },
    { title: 'Reserve Villa Orsula — Chen', trip: 'Dubrovnik', done: 'Done Feb 28', due: '', assignees: ['DO'] },
    { title: 'Amalfi villa — reservation confirmed', trip: 'Amalfi', done: 'Done Mar 1', due: '', assignees: ['SK'] },
    { title: 'Maldives briefing document sent', trip: 'Maldives', done: 'Done Mar 3', due: '', assignees: ['DO'] },
  ]},
];

const checklist = [
  { done: true, text: 'Research Blue Adriatic availability Apr 7' },
  { done: true, text: 'Request quote for Dubrovnik–Hvar route' },
  { done: false, text: 'Send contract to client for review' },
  { done: false, text: 'Confirm deposit payment to vendor' },
  { done: false, text: 'Add confirmation number to itinerary' },
];

const chatMessages = [
  { init: 'DO', name: 'Denise O.', text: 'Blue Adriatic confirmed availability Apr 7–9. Waiting on deposit confirmation before I finalize. @Marcus can you follow up today?', time: 'Mar 5, 2:14pm' },
  { init: 'MT', name: 'Marcus T.', text: 'On it — calling them now. Quote was $1,800, expires tomorrow.', time: 'Mar 5, 3:30pm' },
  { init: 'DO', name: 'Denise O.', text: "Uploading their quote to attachments. Let's get this locked.", time: 'Mar 6, 9:12am' },
];

const avColors: Record<string, string> = { DO: 'linear-gradient(135deg,#2a1a0a,#5a3a10)', MT: 'linear-gradient(135deg,#1a2a3a,#2a4060)', SK: 'linear-gradient(135deg,#1a2a2a,#2a4040)' };
const avTextColors: Record<string, string> = { DO: 'var(--champagne)', MT: 'var(--sapphire-lt)', SK: 'var(--emerald-lt)' };

export default function Tasks() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [checkState, setCheckState] = useState(checklist.map(c => c.done));

  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Tasks</h1>
          <p style={{fontSize:11,color:'var(--slate)',marginTop:4,letterSpacing:0.5}}>All advisors · 18 active · 5 overdue · Board view</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <select className="td-input" style={{width:120,fontSize:10,padding:'6px 10px'}}><option>All Trips</option></select>
          <select className="td-input" style={{width:120,fontSize:10,padding:'6px 10px'}}><option>All Advisors</option></select>
          <button className="btn btn-champ" onClick={() => setPanelOpen(true)}>+ New Task</button>
        </div>
      </div>

      {/* Task Board */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
        {columns.map((col, ci) => (
          <div key={ci} style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden'}}>
            <div style={{padding:'14px 16px',borderBottom:'1px solid var(--border2)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:10,fontWeight:500,letterSpacing:1.5,textTransform:'uppercase',color:col.ruby?'var(--ruby-lt)':'var(--ivory-dim)'}}>{col.title}</span>
              <span style={{fontSize:9,padding:'2px 7px',borderRadius:8,background:col.ruby?'rgba(155,58,58,0.2)':'var(--bg4)',color:col.ruby?'var(--ruby-lt)':'var(--slate)'}}>{col.count}</span>
            </div>
            <div style={{padding:10,display:'flex',flexDirection:'column',gap:8,minHeight:160}}>
              {col.tasks.map((t,ti) => (
                <div key={ti} className="task-card" onClick={() => setPanelOpen(true)}
                  style={{borderColor:t.border||'var(--border)',opacity:col.title==='COMPLETED'?0.7:1}}>
                  <div style={{fontSize:12,color:'var(--ivory)',marginBottom:6,fontWeight:400,lineHeight:1.4}}>{t.title}</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:8}}>
                    <span style={{fontSize:9,padding:'2px 7px',borderRadius:5,background:'var(--champ-dim)',color:'var(--champagne)'}}>{t.trip}</span>
                    {t.tags?.map((tag,i) => (
                      <span key={i} style={{fontSize:9,padding:'2px 7px',borderRadius:5,background:tag.includes('Overdue')?'rgba(155,58,58,0.3)':'var(--bg5)',color:tag.includes('Overdue')?'var(--ruby-lt)':'var(--slate)'}}>{tag}</span>
                    ))}
                  </div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      {t.done ? <span style={{fontSize:9,color:'var(--slate)'}}>{t.done}</span> :
                        <span style={{fontSize:9,color:t.dueClass==='overdue'?'var(--ruby-lt)':t.dueClass==='today'?'var(--champagne)':'var(--slate)'}}>Due: {t.due}</span>}
                      {t.attach && <span style={{fontSize:9,color:'var(--slate)'}}>📎 {t.attach}</span>}
                      {t.comments && <span style={{fontSize:9,color:'var(--slate)'}}>💬 {t.comments}</span>}
                    </div>
                    <div style={{display:'flex'}}>
                      {t.assignees.map((a,i) => (
                        <div key={i} style={{width:20,height:20,borderRadius:'50%',background:avColors[a],border:'1.5px solid var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:avTextColors[a],fontWeight:500,marginLeft:i>0?-4:0}}>{a}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Panel */}
      <div className={`task-detail${panelOpen?' open':''}`}>
        <div style={{padding:'20px 24px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexShrink:0}}>
          <textarea className="playfair" style={{fontSize:20,fontWeight:400,color:'var(--ivory)',background:'transparent',border:'none',outline:'none',width:'100%',resize:'none',lineHeight:1.4,fontFamily:"'Playfair Display',serif"}} defaultValue="Confirm Yacht Charter — Blue Adriatic" rows={2}/>
          <button onClick={() => setPanelOpen(false)} style={{width:28,height:28,borderRadius:6,background:'var(--bg3)',border:'1px solid var(--border)',cursor:'pointer',color:'var(--slate)',fontSize:14,flexShrink:0}}>✕</button>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'20px 24px'}}>
          {/* Fields */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Trip</div>
              <select className="td-input"><option>Dubrovnik & Hvar — Chen</option></select></div>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Assigned To</div>
              <select className="td-input"><option>Marcus T.</option><option>Denise O.</option><option>Sarah K.</option></select></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Start Date</div>
              <input className="td-input" type="date" defaultValue="2025-03-03"/></div>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Due Date</div>
              <input className="td-input" type="date" defaultValue="2025-03-10"/></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Priority</div>
              <select className="td-input"><option>Urgent</option><option>High</option><option>Normal</option><option>Low</option></select></div>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Status</div>
              <select className="td-input"><option>In Progress</option><option>To Do</option><option>Blocked</option><option>Done</option></select></div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Tags / Category</div>
            <input className="td-input" defaultValue="Vendor, Charter, Transport"/>
          </div>

          {/* Assignees */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Also Assign To</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {[{init:'MT',color:'var(--ivory-dim)',border:'var(--border)'},{init:'DO',color:'var(--champagne)',border:'rgba(212,175,106,0.2)'}].map((a,i) => (
                <span key={i} style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:6,background:'var(--bg3)',border:`1px solid ${a.border}`,fontSize:10,color:a.color}}>
                  <span style={{width:14,height:14,borderRadius:'50%',background:avColors[a.init],display:'flex',alignItems:'center',justifyContent:'center',fontSize:7,color:avTextColors[a.init]}}>{a.init}</span>
                  {a.init}
                </span>
              ))}
              <span style={{display:'inline-flex',alignItems:'center',padding:'4px 10px',borderRadius:6,border:'1px dashed var(--border)',fontSize:10,color:'var(--slate)',cursor:'pointer'}}>+ Tag member</span>
            </div>
          </div>

          {/* Repeat */}
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <span style={{fontSize:11,color:'var(--ivory-dim)'}}>Repeat</span>
            <div className="toggle" onClick={e => e.currentTarget.classList.toggle('on')}/>
          </div>

          {/* Checklist */}
          <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',margin:'16px 0 10px',display:'flex',alignItems:'center',gap:10}}>
            <span style={{flex:1,height:1,background:'var(--border2)'}}/>CHECKLIST<span style={{flex:1,height:1,background:'var(--border2)'}}/>
          </div>
          {checklist.map((c,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid var(--border2)'}}>
              <div className={`cl-check${checkState[i]?' done':''}`} onClick={() => setCheckState(s => s.map((v,j) => j===i?!v:v))}>
                {checkState[i] && <span style={{fontSize:9,color:'white'}}>✓</span>}
              </div>
              <span style={{fontSize:12,color:checkState[i]?'var(--slate)':'var(--ivory-dim)',flex:1,textDecoration:checkState[i]?'line-through':'none'}}>{c.text}</span>
            </div>
          ))}
          <div style={{fontSize:11,color:'var(--slate)',cursor:'pointer',padding:'8px 0',marginBottom:14}} onMouseEnter={e => (e.currentTarget.style.color = 'var(--champagne)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--slate)')}>+ Add checklist item</div>

          {/* Attachments */}
          <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',margin:'16px 0 10px',display:'flex',alignItems:'center',gap:10}}>
            <span style={{flex:1,height:1,background:'var(--border2)'}}/>ATTACHMENTS<span style={{flex:1,height:1,background:'var(--border2)'}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:4}}>
            {[{name:'📄 BlueAdriatic_Quote.pdf',size:'342KB'},{name:'📋 Contract_Draft_v2.docx',size:'28KB'}].map((f,i) => (
              <div key={i} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8,padding:10,display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:11,color:'var(--ivory-dim)'}}>{f.name}<span style={{fontSize:9,color:'var(--slate)',marginLeft:'auto'}}>{f.size}</span></div>
            ))}
          </div>
          <div style={{border:'1px dashed var(--border)',borderRadius:8,padding:16,textAlign:'center',fontSize:11,color:'var(--slate)',cursor:'pointer',marginTop:8}} onMouseEnter={e => {e.currentTarget.style.borderColor='var(--champagne)';e.currentTarget.style.color='var(--champagne)'}} onMouseLeave={e => {e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--slate)'}}>↑ Drop files or click to upload</div>

          {/* Team Chat */}
          <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',margin:'16px 0 10px',display:'flex',alignItems:'center',gap:10}}>
            <span style={{flex:1,height:1,background:'var(--border2)'}}/>TEAM CHAT<span style={{flex:1,height:1,background:'var(--border2)'}}/>
          </div>
          {chatMessages.map((m,i) => (
            <div key={i} style={{display:'flex',gap:10,marginBottom:14}}>
              <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,#2a1a0a,#5a3a10)',border:'1px solid rgba(212,175,106,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'var(--champagne)'}}>{m.init}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:'var(--champagne)',fontWeight:500,marginBottom:4}}>{m.name}</div>
                <div className="chat-bubble">{m.text}</div>
                <div style={{fontSize:9,color:'var(--slate)',marginTop:4}}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat input */}
        <div style={{padding:'12px 24px',borderTop:'1px solid var(--border)',flexShrink:0,background:'var(--bg2)',display:'flex',gap:8}}>
          <input className="td-input" style={{flex:1,borderRadius:20,padding:'8px 16px',fontSize:11}} placeholder="Type a message..."/>
          <button className="btn btn-champ btn-sm">Send</button>
        </div>
      </div>
    </div>
  );
}
