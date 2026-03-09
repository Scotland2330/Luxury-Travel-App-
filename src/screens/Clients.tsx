const clients = [
  { name: 'Harrington, Patricia', advisor: 'Denise O.', trips: '1 active', retainer: '$1,500/mo', retainerGold: true, outstanding: '—', passport: 'Sep 2027', passportColor: 'var(--emerald-lt)', status: 'Active', statusBadge: 'b-em' },
  { name: 'Delacroix, Sophie', advisor: 'Denise O.', trips: '1 active', retainer: '$2,000/mo', retainerGold: false, outstanding: '$300 overage', outColor: 'var(--ruby-lt)', passport: 'Mar 2028', passportColor: 'var(--emerald-lt)', status: 'Active', statusBadge: 'b-em' },
  { name: 'Chen, Michelle', advisor: 'Denise O.', trips: '1 active', retainer: '$1,000/mo', retainerGold: false, outstanding: '$7,600 due', outColor: 'var(--cognac-lt)', passport: 'Jan 2026 ⚠', passportColor: 'var(--cognac-lt)', status: 'Planning', statusBadge: 'b-sa' },
  { name: 'Okonkwo, Adaeze', advisor: 'Marcus T.', trips: '1 active', retainer: '$1,000/mo', retainerGold: false, outstanding: 'Dep. overdue', outColor: 'var(--ruby-lt)', passport: 'Jun 2027', passportColor: 'var(--emerald-lt)', status: 'Action Needed', statusBadge: 'b-rb' },
];

export default function Clients() {
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Clients</h1>
          <p style={{fontSize:11,color:'var(--slate)',marginTop:4,letterSpacing:0.5}}>12 active clients</p>
        </div>
        <button className="btn btn-champ">+ New Client</button>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr>
            {['Client','Advisor','Active Trips','Retainer','Outstanding','Passport','Status'].map(h => <th key={h}>{h}</th>)}
          </tr></thead>
          <tbody>
            {clients.map((c,i) => (
              <tr key={i}>
                <td className="td-main">{c.name}</td>
                <td>{c.advisor}</td>
                <td>{c.trips}</td>
                <td className={c.retainerGold?'td-gold':''}>{c.retainer}</td>
                <td style={{color:c.outColor||'var(--slate)'}}>{c.outstanding}</td>
                <td style={{color:c.passportColor}}>{c.passport}</td>
                <td><span className={`badge ${c.statusBadge}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
