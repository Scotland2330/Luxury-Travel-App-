import { useState } from 'react';

const toggles = [
  { type: 'dep', icon: '✈', label: 'Departures', color: 'var(--sapphire-lt)', bg: 'rgba(46,95,158,0.1)' },
  { type: 'pay', icon: '◎', label: 'Payments', color: 'var(--cognac-lt)', bg: 'rgba(181,96,30,0.1)' },
  { type: 'task', icon: '☑', label: 'Tasks', color: 'var(--emerald-lt)', bg: 'rgba(61,139,110,0.1)' },
  { type: 'over', icon: '⚠', label: 'Overdue', color: 'var(--ruby-lt)', bg: 'rgba(155,58,58,0.1)' },
  { type: 'doc', icon: '📎', label: 'Document Deadlines', color: 'var(--amethyst)', bg: 'rgba(107,61,155,0.1)' },
];

type Card = { date: string; name: string; sub: string; amount?: string; pill?: string; pillClass?: string; advisor?: string; advisorInit?: string; overdue?: string };

const sections: { type: string; title: string; dot: string; count: string; countBg: string; countColor: string; cards: Card[] }[] = [
  { type: 'dep', title: 'Departures', dot: 'var(--sapphire-lt)', count: '4 this month', countBg: 'rgba(46,95,158,0.2)', countColor: 'var(--sapphire-lt)',
    cards: [
      { date: 'Mar 12', name: 'Harrington, P.', sub: 'Maldives · Water Villas', pill: 'Departs Saturday', pillClass: 'today', advisor: 'Denise O.', advisorInit: 'DO' },
      { date: 'Mar 14', name: 'Delacroix, S.', sub: 'Amalfi Coast', pill: 'Departs Monday', pillClass: 'today', advisor: 'Sarah K.', advisorInit: 'SK' },
      { date: 'Apr 3', name: 'Chen, M.', sub: 'Dubrovnik & Hvar', pill: 'Due in 28 days', pillClass: 'ok', advisor: 'Denise O.', advisorInit: 'DO' },
      { date: 'Apr 22', name: 'Okonkwo, A.', sub: 'Masai Mara Safari', pill: 'Due in 47 days', pillClass: 'ok', advisor: 'Marcus T.', advisorInit: 'MT' },
    ]},
  { type: 'pay', title: 'Payments', dot: 'var(--cognac-lt)', count: '4 milestones', countBg: 'rgba(181,96,30,0.2)', countColor: 'var(--cognac-lt)',
    cards: [
      { date: 'Mar 17', name: 'Chen, M.', sub: 'Dubrovnik — 2nd Payment', amount: '$7,600', pill: 'Due in 11 days', pillClass: 'soon', advisor: 'Reminder: Mar 10, 16', advisorInit: 'DO' },
      { date: 'Mar 17', name: 'Okonkwo, A.', sub: 'Safari — Deposit Catch-up', amount: '$7,875', pill: 'Rescheduled', pillClass: 'soon', advisor: 'Reminder: Mar 12, 16', advisorInit: 'MT' },
      { date: 'Mar 28', name: 'Chen, M.', sub: 'Dubrovnik — Final Balance', amount: '$3,800', pill: 'Due in 22 days', pillClass: 'ok', advisor: 'Reminder: Mar 21, 27', advisorInit: 'DO' },
      { date: 'Mar 31', name: 'Delacroix, S.', sub: 'March Retainer + Overage', amount: '$2,300', pill: 'Due in 25 days', pillClass: 'ok', advisor: 'Auto-invoice', advisorInit: 'SK' },
    ]},
  { type: 'task', title: 'Task Deadlines', dot: 'var(--emerald-lt)', count: '7 active', countBg: 'rgba(61,139,110,0.2)', countColor: 'var(--emerald-lt)',
    cards: [
      { date: 'Today', name: 'Request Passport Copy', sub: 'Chen · Dubrovnik / Assigned: Denise O.', pill: 'Started Mar 1', pillClass: 'today' },
      { date: 'Today', name: 'Villa Upgrade Confirm', sub: 'Delacroix · Amalfi / Assigned: Sarah K.', pill: 'Started Mar 5', pillClass: 'today' },
      { date: 'Mar 10', name: 'Confirm Yacht Charter', sub: 'Chen · Dubrovnik / Assigned: Marcus T.', pill: 'Started Mar 3', pillClass: 'soon' },
      { date: 'Mar 12', name: 'Pre-Departure Pack', sub: 'Harrington · Maldives / Assigned: Denise O.', pill: 'Started Feb 28', pillClass: 'soon' },
      { date: 'Mar 20', name: 'Travel Insurance Check', sub: 'Okonkwo · Safari / Assigned: Marcus T.', pill: 'Started Mar 1', pillClass: 'ok' },
    ]},
  { type: 'over', title: 'Overdue Items', dot: 'var(--ruby-lt)', count: '3 items', countBg: 'rgba(155,58,58,0.2)', countColor: 'var(--ruby-lt)',
    cards: [
      { date: 'Was due Mar 3', name: 'Okonkwo Deposit', sub: 'Safari — $7,875 outstanding', amount: '$7,875', overdue: '3 days late', advisor: 'Marcus T. · Send reminder', advisorInit: 'MT' },
      { date: 'Was due Mar 4', name: 'Passport Submission — Chen', sub: 'Client action required · Dubrovnik', pill: 'Portal reminder queued', pillClass: 'ruby', overdue: '2 days late', advisor: 'Denise O.', advisorInit: 'DO' },
      { date: 'Was due Mar 5', name: 'Confirm Transfer — Harrington', sub: 'Airport → Velaa · Maldives leg', pill: 'Escalated to Denise', pillClass: 'ruby', overdue: '1 day late', advisor: 'Denise O.', advisorInit: 'DO' },
    ]},
  { type: 'doc', title: 'Document Deadlines', dot: '#9b6ee8', count: '4 pending', countBg: 'rgba(107,61,155,0.2)', countColor: '#9b6ee8',
    cards: [
      { date: 'Mar 8', name: 'Visa Application', sub: 'Delacroix · Italy Schengen / Docs needed from client', pill: '2 days to deadline', pillClass: 'soon' },
      { date: 'Mar 15', name: 'Travel Insurance', sub: 'Chen · Croatia policy / Client to upload', pill: '9 days', pillClass: 'ok' },
      { date: 'Mar 20', name: 'Medical Clearance', sub: 'Okonkwo · Safari vaccinations / Yellow fever cert required', pill: '14 days', pillClass: 'ok' },
      { date: 'Apr 1', name: 'Hotel Rooming List', sub: 'Chen · Villa Orsula / Internal submission', pill: '26 days', pillClass: 'ok' },
    ]},
];

const pillStyles: Record<string, { bg: string; color: string }> = {
  soon: { bg: 'rgba(181,96,30,0.2)', color: 'var(--cognac-lt)' },
  ok: { bg: 'rgba(61,139,110,0.15)', color: 'var(--emerald-lt)' },
  today: { bg: 'rgba(212,175,106,0.15)', color: 'var(--champagne)' },
  ruby: { bg: 'rgba(155,58,58,0.2)', color: 'var(--ruby-lt)' },
};

export default function BoardCalendar() {
  const [visible, setVisible] = useState<Record<string, boolean>>({ dep: true, pay: true, task: true, over: true, doc: true });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [view, setView] = useState('Board');

  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Board Calendar</h1>
          <p style={{fontSize:11,color:'var(--slate)',marginTop:4,letterSpacing:0.5}}>All advisors · March 2025 · Toggle sections to customize your view</p>
        </div>
        <div style={{display:'flex',gap:6}}>
          {['Board','Week','Agenda'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{padding:'6px 14px',borderRadius:6,fontSize:10,fontWeight:500,cursor:'pointer',letterSpacing:0.5,textTransform:'uppercase',
              border: v===view ? '1px solid rgba(212,175,106,0.25)' : '1px solid var(--border)',
              background: v===view ? 'var(--champ-dim)' : 'transparent',
              color: v===view ? 'var(--champagne)' : 'var(--slate)',
              fontFamily:'Jost'}}>{v}</button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:20,gap:12,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {toggles.map(t => (
            <button key={t.type} onClick={() => setVisible(v => ({...v, [t.type]: !v[t.type]}))}
              style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:20,fontSize:10,fontWeight:500,letterSpacing:0.5,textTransform:'uppercase',cursor:'pointer',fontFamily:'Jost',
                border: visible[t.type] ? `1px solid ${t.color}` : '1px solid var(--border)',
                background: visible[t.type] ? t.bg : 'transparent',
                color: visible[t.type] ? t.color : 'var(--slate)'}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:10,color:'var(--slate)',letterSpacing:1}}>FILTER:</span>
          <select className="td-input" style={{width:160,fontSize:10,padding:'6px 10px'}}>
            <option>All Advisors</option><option>Denise O.</option><option>Marcus T.</option><option>Sarah K.</option>
          </select>
        </div>
      </div>

      {/* Board sections */}
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {sections.map(s => visible[s.type] && (
          <div key={s.type} className={`board-section${collapsed[s.type]?' collapsed':''}`} style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',transition:'all 0.2s'}}>
            <div onClick={() => setCollapsed(c => ({...c, [s.type]: !c[s.type]}))}
              style={{display:'flex',alignItems:'center',gap:12,padding:'14px 20px',cursor:'pointer',borderBottom:'1px solid var(--border2)',transition:'background 0.1s'}}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--champ-glow)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div style={{width:8,height:8,borderRadius:'50%',background:s.dot}}/>
              <span style={{fontSize:11,fontWeight:500,letterSpacing:1.5,textTransform:'uppercase',color:'var(--ivory-dim)'}}>{s.title}</span>
              <span style={{marginLeft:'auto',fontSize:9,padding:'2px 8px',borderRadius:10,fontWeight:500,background:s.countBg,color:s.countColor}}>{s.count}</span>
              <span className="board-chevron" style={{fontSize:10,color:'var(--slate)',transition:'transform 0.2s',marginLeft:8}}>▼</span>
            </div>
            <div className="board-cards" style={{display:'flex',gap:10,padding:'14px 16px',overflowX:'auto'}}>
              {s.cards.map((c,i) => (
                <div key={i} className={`date-card ${s.type === 'task' ? 'task-type' : s.type}`}>
                  {c.overdue && <div style={{position:'absolute',top:8,right:8,background:'var(--ruby)',color:'white',fontSize:8,padding:'2px 6px',borderRadius:4,fontWeight:500}}>{c.overdue}</div>}
                  <div style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:'var(--slate)',marginBottom:8}}>{c.date}</div>
                  <div className="playfair" style={{fontSize:13,color:'var(--ivory)',fontWeight:400,marginBottom:4}}>{c.name}</div>
                  <div style={{fontSize:10,color:'var(--slate)',marginBottom:8,lineHeight:1.4}}>{c.sub}</div>
                  {c.amount && <div className="playfair" style={{fontSize:18,color:'var(--champagne)'}}>{c.amount}</div>}
                  {c.pill && c.pillClass && (
                    <span style={{display:'inline-block',marginTop:6,fontSize:9,padding:'2px 7px',borderRadius:10,fontWeight:500,
                      background: pillStyles[c.pillClass]?.bg || 'rgba(155,58,58,0.2)',
                      color: pillStyles[c.pillClass]?.color || 'var(--ruby-lt)'}}>{c.pill}</span>
                  )}
                  {c.advisor && (
                    <div style={{fontSize:9,color:'var(--slate)',marginTop:6,display:'flex',alignItems:'center',gap:4}}>
                      {c.advisorInit && <div style={{width:16,height:16,borderRadius:'50%',background:'linear-gradient(135deg,#3a2a10,#6a4a1a)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:'var(--champagne)',fontWeight:500}}>{c.advisorInit}</div>}
                      {c.advisor}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
