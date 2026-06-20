import { useAgency, agencies } from '../AgencyContext';

export default function Topbar() {
  const { agency, setAgency, showSwitcher, setShowSwitcher } = useAgency();

  return (
    <div style={{height:54,background:'var(--bg2)',borderBottom:'1px solid var(--border)',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,position:'relative'}}>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${agency.accent},transparent)`,opacity:0.3}}/>
      <div style={{display:'flex',alignItems:'center'}}>
        <span className="playfair" style={{fontSize:20,fontWeight:500,letterSpacing:4,background:`linear-gradient(135deg,${agency.accentLt},${agency.accent},${agency.gradientTo})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>TRIP OS</span>
        <span style={{fontSize:9,letterSpacing:4,color:'var(--slate)',textTransform:'uppercase',marginLeft:10,fontWeight:400}}>{agency.tagline}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        {/* Agency name + switcher */}
        <div style={{position:'relative'}}>
          <div
            onClick={() => setShowSwitcher(!showSwitcher)}
            style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',padding:'4px 10px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg3)',transition:'all 0.15s'}}
          >
            <div style={{width:8,height:8,borderRadius:'50%',background:agency.accent}} />
            <span style={{fontSize:10,letterSpacing:2,color:'var(--slate)',textTransform:'uppercase'}}>{agency.name}</span>
            <span style={{fontSize:8,color:'var(--slate)',marginLeft:2}}>▼</span>
          </div>

          {showSwitcher && (
            <div style={{position:'absolute',top:'100%',right:0,marginTop:6,width:320,background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:12,padding:12,zIndex:999,boxShadow:'0 12px 40px rgba(0,0,0,0.5)'}}>
              <div style={{fontSize:8,letterSpacing:3,textTransform:'uppercase',color:'var(--slate)',marginBottom:10,paddingLeft:4}}>Switch Workspace</div>
              {agencies.map(a => (
                <div
                  key={a.id}
                  onClick={() => { setAgency(a.id); setShowSwitcher(false); }}
                  style={{
                    display:'flex',alignItems:'center',gap:12,padding:'10px 12px',borderRadius:10,cursor:'pointer',
                    background: a.id === agency.id ? a.accentDim : 'transparent',
                    border: a.id === agency.id ? `1px solid ${a.accent}30` : '1px solid transparent',
                    marginBottom:4,transition:'all 0.15s',
                  }}
                >
                  <div style={{width:36,height:36,borderRadius:10,background:a.avatarBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,color:a.accent,letterSpacing:1,flexShrink:0,border:`1px solid ${a.accent}40`}}>{a.initials}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,color:'var(--ivory)',fontWeight:500}}>{a.name}</div>
                    <div style={{fontSize:10,color:'var(--slate)'}}>{a.advisor} · {a.plan === 'owner' ? 'Platform Owner' : 'Professional Plan'}</div>
                  </div>
                  {a.id === agency.id && <div style={{width:8,height:8,borderRadius:'50%',background:a.accent}} />}
                </div>
              ))}
              <div style={{borderTop:'1px solid var(--border)',marginTop:8,paddingTop:8}}>
                <div style={{fontSize:9,color:'var(--slate)',textAlign:'center',letterSpacing:1,textTransform:'uppercase'}}>
                  SaaS Demo — Each agent gets their own branded workspace
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{width:32,height:32,borderRadius:8,background:'var(--bg3)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--slate)',cursor:'pointer',position:'relative',fontSize:14}}>
          🔔
          <div style={{position:'absolute',top:6,right:6,width:6,height:6,borderRadius:'50%',background:'var(--cognac-lt)'}}/>
        </div>
        <div style={{width:32,height:32,borderRadius:8,background:'var(--bg3)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--slate)',cursor:'pointer',fontSize:14}}>⚙</div>
        <div style={{width:32,height:32,borderRadius:'50%',border:`1px solid ${agency.accent}`,background:agency.avatarBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:500,color:agency.accent,letterSpacing:1}}>{agency.initials}</div>
      </div>
    </div>
  );
}
