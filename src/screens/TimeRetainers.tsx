const timeLog = [
  { client: 'Harrington', trip: 'Maldives', task: '☑ Final itinerary', hours: '1.5h', amount: '$225', badge: 'b-og', badgeText: 'Unbilled' },
  { client: 'Delacroix', trip: 'Amalfi', task: '☑ Villa upgrade', hours: '2.0h', amount: '$300', badge: 'b-og', badgeText: 'Unbilled' },
  { client: 'Chen', trip: 'Dubrovnik', task: '☑ Yacht confirm', hours: '1.0h', amount: '$150', badge: 'b-og', badgeText: 'Unbilled' },
  { client: 'Okonkwo', trip: 'Safari', task: '☑ Lodge research', hours: '3.0h', amount: '$450', badge: 'b-em', badgeText: 'Invoiced' },
  { client: 'Harrington', trip: 'Retainer', task: 'Client calls', hours: '2.5h', amount: 'Covered', badge: 'b-mu', badgeText: 'Retainer', isRetainer: true },
];

const retainers = [
  { name: 'Harrington', info: '$1,500/mo · 14/20h', pct: 70, color: 'var(--champagne)' },
  { name: 'Delacroix', info: 'Overage: +2h = $300', pct: 100, color: 'var(--ruby-lt)', warn: true },
  { name: 'Okonkwo', info: '$1,000/mo · 6/15h', pct: 40, color: 'var(--champagne)' },
];

export default function TimeRetainers() {
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Time & Retainers</h1>
          <p style={{fontSize:11,color:'var(--slate)',marginTop:4}}>March 2025 · 38.5 hours logged · $5,775 billed</p>
        </div>
      </div>

      {/* Time Entry Form */}
      <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:12,padding:20,marginBottom:12}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr auto',gap:12,alignItems:'end'}}>
          {[
            { label: 'Description', el: <input className="td-input" defaultValue="Yacht charter negotiation call" placeholder="What did you work on?"/> },
            { label: 'Client', el: <select className="td-input"><option>Chen, Michelle</option><option>Harrington</option><option>Delacroix</option></select> },
            { label: 'Duration', el: <input className="td-input" defaultValue="1h 30m" placeholder="0h 00m"/> },
            { label: 'Billable', el: <select className="td-input"><option>Billable</option><option>Retainer (covered)</option><option>Non-billable</option></select> },
          ].map((f,i) => (
            <div key={i}>
              <div style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>{f.label}</div>
              {f.el}
            </div>
          ))}
          <button className="btn btn-champ" style={{whiteSpace:'nowrap',marginTop:22}}>+ Log</button>
        </div>

        {/* Task tag */}
        <div style={{borderTop:'1px solid var(--border2)',marginTop:14,paddingTop:14}}>
          <div style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Tag to Task (optional)</div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <select className="td-input" style={{maxWidth:280,background:'var(--bg4)'}}>
              <option>— Select task —</option>
              <option>Confirm yacht charter — Dubrovnik</option>
            </select>
            <span style={{display:'inline-flex',alignItems:'center',gap:5,background:'var(--champ-dim)',border:'1px solid rgba(212,175,106,0.2)',borderRadius:6,padding:'4px 10px',fontSize:10,color:'var(--champagne)'}}>
              ☑ Confirm yacht charter — Dubrovnik <span style={{cursor:'pointer',opacity:0.6,fontSize:12}}>×</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {/* Left - Time Log */}
        <div className="card">
          <div className="card-h"><span className="card-t">Time Log — March 2025</span></div>
          <table className="tbl">
            <thead><tr>{['Client','Trip','Task','Hours','Amount','Status'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {timeLog.map((t,i) => (
                <tr key={i}>
                  <td className="td-main">{t.client}</td>
                  <td>{t.trip}</td>
                  <td>{t.isRetainer ? <span style={{fontSize:10,color:'var(--slate)'}}>{t.task}</span> :
                    <span style={{display:'inline-flex',alignItems:'center',gap:5,background:'var(--champ-dim)',border:'1px solid rgba(212,175,106,0.2)',borderRadius:6,padding:'2px 7px',fontSize:9,color:'var(--champagne)'}}>{t.task}</span>}
                  </td>
                  <td>{t.hours}</td>
                  <td style={{color:t.isRetainer?'var(--slate)':'var(--champagne)'}}>{t.amount}</td>
                  <td><span className={`badge ${t.badge}`}>{t.badgeText}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right - Summary */}
        <div className="card">
          <div className="card-h"><span className="card-t">March Summary</span></div>
          <div className="card-b">
            {retainers.map((r,i) => (
              <div key={i} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <span style={{fontSize:11,color:'var(--ivory-dim)'}}>{r.name}</span>
                  <span style={{fontSize:10,color:r.warn?'var(--ruby-lt)':'var(--slate)'}}>{r.info}</span>
                </div>
                <div style={{background:'var(--bg5)',borderRadius:3,height:3}}>
                  <div style={{width:`${r.pct}%`,height:3,borderRadius:3,background:r.color}}/>
                </div>
              </div>
            ))}

            <div style={{borderTop:'1px solid var(--border)',marginTop:16,paddingTop:16}}>
              {[
                { label: 'Retainer Revenue', value: '$4,500', color: 'var(--champagne)', size: 18 },
                { label: 'Unbilled Hours', value: '$1,125', color: 'var(--cognac-lt)', size: 18 },
              ].map((t,i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                  <span style={{fontSize:11,color:'var(--ivory-dim)'}}>{t.label}</span>
                  <span className="playfair" style={{fontSize:t.size,color:t.color}}>{t.value}</span>
                </div>
              ))}
              <div style={{borderTop:'1px solid var(--border)',paddingTop:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:12,color:'var(--ivory)'}}>March Total</span>
                <span className="playfair" style={{fontSize:24,color:'var(--champagne)'}}>$5,625</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
