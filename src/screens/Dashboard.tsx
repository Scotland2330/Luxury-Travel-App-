const kpis = [
  { label: 'Active Trips', value: '8', sub: '↑ 2 from last month', subClass: 'up' },
  { label: 'Outstanding', value: '$47,200', sub: '3 overdue invoices', subClass: 'dn', gold: true },
  { label: 'Hours Logged (Mar)', value: '38.5', sub: '$5,775 billable', subClass: 'gold' },
  { label: 'Departures — 7 Days', value: '2', sub: 'Harrington & Delacroix', subClass: '' },
];

const trips = [
  { dot: 'var(--sapphire-lt)', dest: 'Maldives · Water Villas', client: 'Harrington, P. · Mar 12', val: '$18,400', badge: 'b-em', status: 'Confirmed' },
  { dot: 'var(--sapphire-lt)', dest: 'Amalfi Coast · Villa Rufolo', client: 'Delacroix, S. · Mar 14', val: '$24,800', badge: 'b-em', status: 'Confirmed' },
  { dot: 'var(--cognac-lt)', dest: 'Dubrovnik & Hvar Island', client: 'Chen, M. · Apr 3', val: '$15,200', badge: 'b-sa', status: 'Planning' },
  { dot: 'var(--ruby-lt)', dest: 'Safari · Masai Mara, Kenya', client: 'Okonkwo, A. · Apr 22', val: '$31,500', badge: 'b-og', status: 'Dep. Due' },
  { dot: 'var(--slate)', dest: 'Swiss Alps · Zermatt', client: 'Williams, T. · Jun 15', val: '$19,900', badge: 'b-mu', status: 'Inquiry' },
];

const tasks = [
  { done: true, title: 'Send final itinerary — Harrington', sub: 'Maldives · Denise O. · 1.5h logged', badge: '' },
  { done: false, title: 'Confirm villa upgrade — Amalfi', sub: 'Amalfi · Sarah K.', badge: 'b-rb', status: 'Urgent' },
  { done: false, title: 'Request passport copy — Chen', sub: 'Dubrovnik · Denise O.', badge: 'b-og', status: 'Today' },
  { done: false, title: 'Okonkwo deposit follow-up', sub: 'Safari · Marcus T.', badge: 'b-rb', status: 'Overdue' },
];

const activities = [
  { dot: 'var(--emerald)', text: 'Payment received · Harrington final $12,800', time: '2 hours ago' },
  { dot: 'var(--sapphire-lt)', text: 'Itinerary updated · Amalfi Day 3 restaurant added', time: '4 hours ago' },
  { dot: 'var(--cognac-lt)', text: 'Split payment reminder sent · Okonkwo deposit', time: 'Yesterday' },
  { dot: 'var(--amethyst)', text: 'Task comment · @Marcus tagged on yacht confirm', time: 'Yesterday' },
  { dot: 'var(--champagne)', text: 'Retainer invoice generated · Chen — March', time: 'Mar 1' },
];

const retainers = [
  { name: 'Harrington', info: '$1,500/mo · 14/20h', pct: 70, color: 'var(--champagne)' },
  { name: 'Delacroix', info: '$2,000/mo · 22/20h ⚠', pct: 100, color: 'var(--ruby-lt)', warn: true },
  { name: 'Okonkwo', info: '$1,000/mo · 6/15h', pct: 40, color: 'var(--champagne)' },
];

export default function Dashboard() {
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Good morning, Denise</h1>
          <p style={{fontSize:11,color:'var(--slate)',marginTop:4,letterSpacing:0.5}}>Friday, March 6 · 4 departures this month · 5 tasks need attention</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-ghost">+ Client</button>
          <button className="btn btn-champ">+ Trip</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        {kpis.map((k,i) => (
          <div key={i} style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:12,padding:20,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:-30,right:-30,width:80,height:80,borderRadius:'50%',background:'var(--champ-glow)'}}/>
            <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:12}}>{k.label}</div>
            <div className="playfair" style={{fontSize:34,fontWeight:400,color:k.gold?'var(--champagne)':'var(--ivory)',lineHeight:1}}>{k.value}</div>
            <div style={{fontSize:10,color:k.subClass==='up'?'var(--emerald-lt)':k.subClass==='dn'?'var(--ruby-lt)':k.subClass==='gold'?'var(--champagne)':'var(--slate)',marginTop:8}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16}}>
        <div>
          {/* Active Trips */}
          <div className="card" style={{marginBottom:16}}>
            <div className="card-h">
              <span className="card-t">Active Trips</span>
              <span style={{fontSize:11,color:'var(--champagne)',cursor:'pointer'}}>View All →</span>
            </div>
            <div>
              {trips.map((t,i) => (
                <div key={i} className="trip-mini">
                  <div style={{width:6,height:6,borderRadius:'50%',background:t.dot,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,color:'var(--ivory)'}}>{t.dest}</div>
                    <div style={{fontSize:10,color:'var(--slate)'}}>{t.client}</div>
                  </div>
                  <span className="playfair" style={{fontSize:15,color:'var(--champagne)'}}>{t.val}</span>
                  <span className={`badge ${t.badge}`}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Due Today */}
          <div className="card">
            <div className="card-h">
              <span className="card-t">Tasks Due Today</span>
              <span className="badge b-rb">5 urgent</span>
            </div>
            <div>
              {tasks.map((t,i) => (
                <div key={i} className="trip-mini">
                  <div className={`cl-check${t.done?' done':''}`}>{t.done && <span style={{fontSize:9,color:'white'}}>✓</span>}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,color:'var(--ivory)',textDecoration:t.done?'line-through':'none',opacity:t.done?0.5:1}}>{t.title}</div>
                    <div style={{fontSize:10,color:'var(--slate)'}}>{t.sub}</div>
                  </div>
                  {t.badge && <span className={`badge ${t.badge}`}>{t.status}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* Activity */}
          <div className="card" style={{marginBottom:16}}>
            <div className="card-h"><span className="card-t">Activity</span></div>
            <div className="card-b">
              {activities.map((a,i) => (
                <div key={i} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:i<activities.length-1?'1px solid var(--border2)':'none'}}>
                  <div style={{width:7,height:7,borderRadius:'50%',background:a.dot,marginTop:4,flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:11,color:'var(--ivory-dim)',lineHeight:1.5}}>{a.text}</div>
                    <div style={{fontSize:9,color:'var(--slate)',marginTop:2}}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retainer Health */}
          <div className="card">
            <div className="card-h"><span className="card-t">Retainer Health</span></div>
            <div className="card-b">
              {retainers.map((r,i) => (
                <div key={i} style={{marginBottom:i<retainers.length-1?14:0}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:11,color:'var(--ivory-dim)'}}>{r.name}</span>
                    <span style={{fontSize:10,color:r.warn?'var(--ruby-lt)':'var(--slate)'}}>{r.info}</span>
                  </div>
                  <div style={{background:'var(--bg5)',borderRadius:3,height:3}}>
                    <div style={{width:`${r.pct}%`,height:3,borderRadius:3,background:r.color}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
