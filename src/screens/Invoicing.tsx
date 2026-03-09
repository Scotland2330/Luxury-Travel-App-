import { useState } from 'react';

const splitRows = [
  { name: 'Deposit', reminder: '📧 Sent Jan 14', pct: '25%', amt: '$3,800', date: 'Jan 14, 2025', badge: 'b-em', badgeText: 'Paid' },
  { name: '2nd Payment', reminder: '📧 Auto: Mar 10 & 16', pct: '50%', amt: '$7,600', date: 'Mar 17, 2025', badge: 'b-og', badgeText: 'Due Soon' },
  { name: 'Final Balance', reminder: '📧 Auto: Mar 21 & 27', pct: '25%', amt: '$3,800', date: 'Mar 28, 2025', badge: 'b-mu', badgeText: 'Pending' },
];

const invoices = [
  { client: 'Okonkwo', amount: '$7,875', due: 'Overdue', dueColor: 'var(--ruby-lt)', badge: 'b-rb', badgeText: 'Late' },
  { client: 'Chen', amount: '$7,600', due: 'Mar 17', dueColor: 'var(--slate)', badge: 'b-og', badgeText: 'Due Soon' },
  { client: 'Delacroix', amount: '$2,300', due: 'Mar 31', dueColor: 'var(--slate)', badge: 'b-sa', badgeText: 'Sent' },
  { client: 'Harrington', amount: '$12,800', due: 'Mar 10', dueColor: 'var(--slate)', badge: 'b-em', badgeText: 'Paid' },
];

const reminderLog = [
  { icon: '📧', date: 'Mar 10', text: '2nd payment due in 7 days', channel: 'Email', future: false },
  { icon: '📧', date: 'Mar 16', text: 'Payment due tomorrow', channel: 'Email + SMS', future: false },
  { icon: '📱', date: 'Mar 17', text: 'Due date SMS (scheduled)', channel: '', future: true },
  { icon: '📧', date: 'Mar 21', text: 'Final balance 7-day notice (scheduled)', channel: '', future: true },
];

const reminderRules = [
  { text: 'Email 7 days before each due date', on: true },
  { text: 'Email 1 day before each due date', on: true },
  { text: 'SMS on due date if unpaid', on: true },
  { text: 'Email day after if overdue', on: false },
  { text: 'Payment receipt confirmation on paid', on: true },
];

export default function Invoicing() {
  const [rules, setRules] = useState(reminderRules.map(r => r.on));

  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Invoicing</h1>
          <p style={{fontSize:11,color:'var(--slate)',marginTop:4}}>Split payment schedules with automated reminders</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-ghost">View All</button>
          <button className="btn btn-champ">+ New Invoice</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {/* Left */}
        <div>
          {/* Builder */}
          <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
              <div>
                <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:4}}>Trip Invoice — Chen · Dubrovnik</div>
                <div className="playfair" style={{fontSize:28,color:'var(--champagne)'}}>$15,200.00</div>
              </div>
              <div style={{textAlign:'right'}}>
                <span className="badge b-sa">In Progress</span>
                <div style={{fontSize:10,color:'var(--slate)',marginTop:4}}>3 split payments</div>
              </div>
            </div>

            {/* Column headers */}
            <div style={{display:'grid',gridTemplateColumns:'2.5fr 0.8fr 1fr 1.2fr 1fr',gap:8,borderBottom:'1px solid var(--border)',paddingBottom:8,marginBottom:4}}>
              {['Milestone','%','Amount','Due Date','Status'].map(h => (
                <span key={h} style={{fontSize:8,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)'}}>{h}</span>
              ))}
            </div>

            {splitRows.map((r,i) => (
              <div key={i} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr auto auto',gap:10,alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--border2)'}}>
                <div>
                  <div style={{fontSize:12,color:'var(--ivory)'}}>{r.name}</div>
                  <div style={{fontSize:9,color:'var(--emerald-lt)'}}>{r.reminder}</div>
                </div>
                <span style={{fontSize:10,color:'var(--slate)'}}>{r.pct}</span>
                <span className="playfair" style={{fontSize:13,color:'var(--champagne)'}}>{r.amt}</span>
                <span style={{fontSize:10,color:'var(--ivory-dim)'}}>{r.date}</span>
                <span className={`badge ${r.badge}`}>{r.badgeText}</span>
              </div>
            ))}
            <div style={{fontSize:11,color:'var(--slate)',borderTop:'1px solid var(--border2)',paddingTop:12,marginTop:4,cursor:'pointer'}} onMouseEnter={e => (e.currentTarget.style.color = 'var(--champagne)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--slate)')}>+ Add payment milestone</div>
          </div>

          {/* Reminder Rules */}
          <div style={{background:'var(--bg4)',borderRadius:8,padding:14}}>
            <div style={{fontSize:10,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:12}}>Automated Reminder Rules — Chen Invoice</div>
            {reminderRules.map((r,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,fontSize:11,color:'var(--ivory-dim)'}}>
                <div onClick={() => setRules(s => s.map((v,j) => j===i?!v:v))} style={{width:14,height:14,borderRadius:3,border:`1.5px solid ${rules[i]?'var(--emerald)':'var(--slate-dim)'}`,background:rules[i]?'var(--emerald)':'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {rules[i] && <span style={{fontSize:8,color:'white'}}>✓</span>}
                </div>
                {r.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div>
          {/* Outstanding */}
          <div className="card" style={{marginBottom:16}}>
            <div className="card-h"><span className="card-t">Outstanding Invoices</span></div>
            <table className="tbl">
              <thead><tr>{['Client','Amount','Due','Status'].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {invoices.map((inv,i) => (
                  <tr key={i}>
                    <td className="td-main">{inv.client}</td>
                    <td className="td-gold">{inv.amount}</td>
                    <td style={{color:inv.dueColor}}>{inv.due}</td>
                    <td><span className={`badge ${inv.badge}`}>{inv.badgeText}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reminder Log */}
          <div className="card">
            <div className="card-h"><span className="card-t">Reminder Log — Chen</span></div>
            <div className="card-b">
              {reminderLog.map((r,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<reminderLog.length-1?'1px solid var(--border2)':'none',color:r.future?'var(--slate)':'var(--ivory-dim)',fontSize:11}}>
                  <span>{r.icon}</span>
                  <span style={{color:r.future?'var(--slate)':'var(--champagne)',fontWeight:r.future?400:600}}>{r.date}</span>
                  <span style={{flex:1}}>— {r.text}</span>
                  {r.channel && <span style={{fontSize:9,color:'var(--slate)'}}>{r.channel}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
