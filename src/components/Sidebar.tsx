type NavItem = { icon: string; name: string; id: string; badge?: string; alert?: boolean };
const sections: { label: string; items: NavItem[] }[] = [
  { label: 'WORKSPACE', items: [
    { icon: '◈', name: 'Dashboard', id: 'dashboard' },
    { icon: '✦', name: 'Trip Requests', id: 'requests', badge: '3' },
    { icon: '◫', name: 'Master Trip Board', id: 'master' },
    { icon: '▦', name: 'Calendar', id: 'calendar' },
  ]},
  { label: 'OPERATIONS', items: [
    { icon: '☑', name: 'Tasks', id: 'tasks', badge: '5', alert: true },
    { icon: '◔', name: 'Time & Retainers', id: 'time' },
    { icon: '◆', name: 'Commissions', id: 'commissions', badge: '2' },
  ]},
  { label: 'CLIENT', items: [
    { icon: '✧', name: 'Client Feedback', id: 'feedback' },
    { icon: '⬡', name: 'Client Portal', id: 'portal' },
  ]},
  { label: 'RESOURCES', items: [
    { icon: '❖', name: 'Templates & Hub', id: 'templates' },
    { icon: '◩', name: 'Reports', id: 'reports' },
    { icon: '⚙', name: 'Admin', id: 'admin' },
  ]},
  { label: 'PLATFORM', items: [
    { icon: '⊞', name: 'Agency Sub-Accounts', id: 'platform' },
  ]},
];

export default function Sidebar({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  return (
    <div style={{width:210,background:'var(--bg2)',borderRight:'1px solid var(--border)',padding:'20px 0',overflowY:'auto',flexShrink:0}}>
      {sections.map(s => (
        <div key={s.label} style={{padding:'0 14px',marginBottom:26}}>
          <div style={{fontSize:8,letterSpacing:3,textTransform:'uppercase',color:'var(--slate-dim)',padding:'0 8px',marginBottom:8}}>{s.label}</div>
          {s.items.map(i => (
            <div key={i.id} onClick={() => onNav(i.id)}
              style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:8,
                color: active===i.id ? 'var(--champagne)' : 'var(--slate)',
                background: active===i.id ? 'var(--champ-dim)' : 'transparent',
                border: active===i.id ? '1px solid rgba(59,154,156,0.18)' : '1px solid transparent',
                fontSize:12,fontWeight:400,marginBottom:2,cursor:'pointer',transition:'all 0.15s',letterSpacing:0.3}}>
              <span style={{fontSize:13,width:16,textAlign:'center',flexShrink:0}}>{i.icon}</span>
              <span>{i.name}</span>
              {i.badge && <span style={{marginLeft:'auto',background:i.alert?'var(--ruby)':'var(--cognac)',color:'#fff',fontSize:9,fontWeight:600,padding:'2px 7px',borderRadius:10}}>{i.badge}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
