import { useState } from 'react';

type Task = { title: string; trip: string; tags?: string[]; due: string; dueClass?: string; assignees: string[]; attach?: string; comments?: string; border?: string; start?: string; done?: string };

const columns: { title: string; count: number; ruby?: boolean; tasks: Task[] }[] = [
  { title: 'TO DO', count: 7, tasks: [
    { title: 'Send Pre-Arrival — Diaz DC Trip', trip: 'DC Business', tags: ['Pre-Arrival', 'Urgent'], due: 'Today', dueClass: 'today', assignees: ['HM'] },
    { title: 'Follow up insurance quote — Holland', trip: 'Capri', tags: ['Insurance'], due: 'Today', dueClass: 'today', assignees: ['HM'] },
    { title: 'Confirm transfer details — Baker', trip: 'Westlake', tags: ['Transfers'], due: 'Jun 25', assignees: ['HM'] },
    { title: 'Send Bon Voyage — Diaz', trip: 'DC Business', tags: ['Bon Voyage', 'Auto-triggered'], due: 'Jun 20', assignees: ['HM'] },
  ]},
  { title: 'IN PROGRESS', count: 5, tasks: [
    { title: 'AXUS Review — Holland Capri itinerary', trip: 'Capri', tags: ['AXUS Review'], due: 'Jun 21', comments: '2', assignees: ['HM', 'ES'] },
    { title: 'Concierge dining res — Holland', trip: 'Capri', tags: ['Concierge'], due: 'Jun 28', assignees: ['HM'] },
    { title: 'DMC final details follow-up — Hastings Kenya', trip: 'Kenya Safari', tags: ['Touring', '30-day check'], due: 'Jul 15', assignees: ['ES'] },
  ]},
  { title: 'BLOCKED / OVERDUE', count: 3, ruby: true, tasks: [
    { title: 'Welcome Home send — McGarey Scotland', trip: 'Scotland', tags: ['Overdue 5d'], due: 'Was Jun 15', dueClass: 'overdue', assignees: ['HM'], border: 'rgba(155,58,58,0.3)' },
    { title: 'Client passport submission — Baker', trip: 'Westlake', tags: ['Awaiting Client'], due: 'Was Jun 18', dueClass: 'overdue', assignees: ['HM'], border: 'rgba(155,58,58,0.3)' },
    { title: 'Insurance decision — Stern/Gross Spain', trip: 'Spain', tags: ['Insurance', 'Overdue 2d'], due: 'Was Jun 18', dueClass: 'overdue', assignees: ['HM'], border: 'rgba(155,58,58,0.3)' },
  ]},
  { title: 'COMPLETED', count: 6, tasks: [
    { title: 'Flight check — Diaz departing', trip: 'DC Business', done: 'Done Jun 20', due: '', assignees: ['HM'] },
    { title: 'Book flights — Holland Capri', trip: 'Capri', done: 'Done Jun 8', due: '', assignees: ['HM'] },
    { title: 'Reserve Hotel Caesar Augustus', trip: 'Capri', done: 'Done Jun 5', due: '', assignees: ['HM'] },
    { title: 'Send Welcome Home — O\'Brien', trip: 'Palm Heights', done: 'Done Jun 1', due: '', assignees: ['HM'] },
    { title: 'Insurance confirmed — Hastings Kenya', trip: 'Kenya Safari', done: 'Done May 28', due: '', assignees: ['ES'] },
    { title: 'Pre-Arrival sent — McGarey Scotland', trip: 'Scotland', done: 'Done May 8', due: '', assignees: ['HM'] },
  ]},
];

const checklist = [
  { done: true, text: 'Upload itinerary to AXUS platform' },
  { done: true, text: 'Verify all flight details match bookings' },
  { done: false, text: 'Confirm hotel check-in/out times' },
  { done: false, text: 'Add transfer pickup details' },
  { done: false, text: 'Final review with team before sending to client' },
];

const chatMessages = [
  { init: 'HM', name: 'Halie M.', text: 'Itinerary uploaded to AXUS. Flight details verified. Need to confirm hotel check-in times with Caesar Augustus.', time: 'Jun 18, 2:30pm' },
  { init: 'ES', name: 'Emily S.', text: 'I\'ll call the hotel tomorrow AM to confirm. Also — should we add the Blue Grotto tour timing?', time: 'Jun 18, 4:15pm' },
  { init: 'HM', name: 'Halie M.', text: 'Yes, please add it. Client specifically requested morning slot.', time: 'Jun 19, 9:00am' },
];

const avColors: Record<string, string> = { HM: 'linear-gradient(135deg,#2a1a0a,#5a3a10)', ES: 'linear-gradient(135deg,#0d1b3a,#1a3a6a)' };
const avTextColors: Record<string, string> = { HM: 'var(--champagne)', ES: 'var(--sapphire-lt)' };

export default function Tasks() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [checkState, setCheckState] = useState(checklist.map(c => c.done));

  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Tasks</h1>
          <p style={{fontSize:11,color:'var(--slate)',marginTop:4,letterSpacing:0.5}}>All advisors · 22 active · 3 overdue · Board view</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <select className="td-input" style={{width:120,fontSize:10,padding:'6px 10px'}}><option>All Trips</option></select>
          <select className="td-input" style={{width:120,fontSize:10,padding:'6px 10px'}}>
            <option>All Advisors</option>
            <option>Halie McGee</option>
            <option>Emily Stone</option>
          </select>
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
          <textarea className="playfair" style={{fontSize:20,fontWeight:400,color:'var(--ivory)',background:'transparent',border:'none',outline:'none',width:'100%',resize:'none',lineHeight:1.4,fontFamily:"'Playfair Display',serif"}} defaultValue="AXUS Review — Holland Capri Itinerary" rows={2}/>
          <button onClick={() => setPanelOpen(false)} style={{width:28,height:28,borderRadius:6,background:'var(--bg3)',border:'1px solid var(--border)',cursor:'pointer',color:'var(--slate)',fontSize:14,flexShrink:0}}>✕</button>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'20px 24px'}}>
          {/* Fields */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Trip</div>
              <select className="td-input"><option>Capri [Augusta Holland]</option></select></div>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Assigned To</div>
              <select className="td-input"><option>Halie McGee</option><option>Emily Stone</option></select></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Start Date</div>
              <input className="td-input" type="date" defaultValue="2026-06-18"/></div>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Due Date</div>
              <input className="td-input" type="date" defaultValue="2026-06-21"/></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Priority</div>
              <select className="td-input"><option>High</option><option>Urgent</option><option>Normal</option><option>Low</option></select></div>
            <div><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Status</div>
              <select className="td-input"><option>In Progress</option><option>To Do</option><option>Blocked</option><option>Done</option></select></div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Tags / Category</div>
            <input className="td-input" defaultValue="AXUS Review, Itinerary, Pre-Departure"/>
          </div>

          {/* Assignees */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Also Assign To</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {[{init:'HM',color:'var(--champagne)',border:'rgba(212,175,106,0.2)'},{init:'ES',color:'var(--sapphire-lt)',border:'rgba(74,134,232,0.2)'}].map((a,i) => (
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
            {[{name:'📄 Holland_Capri_Itinerary.pdf',size:'1.2MB'},{name:'📋 AXUS_Review_Notes.docx',size:'45KB'}].map((f,i) => (
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
              <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:avColors[m.init],border:`1px solid ${m.init==='HM'?'rgba(212,175,106,0.2)':'rgba(74,134,232,0.2)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:avTextColors[m.init]}}>{m.init}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:m.init==='HM'?'var(--champagne)':'var(--sapphire-lt)',fontWeight:500,marginBottom:4}}>{m.name}</div>
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
