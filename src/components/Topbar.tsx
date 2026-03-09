export default function Topbar() {
  return (
    <div style={{height:54,background:'var(--bg2)',borderBottom:'1px solid var(--border)',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,position:'relative'}}>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,var(--champagne),transparent)',opacity:0.3}}/>
      <div style={{display:'flex',alignItems:'center'}}>
        <span className="playfair" style={{fontSize:20,fontWeight:500,letterSpacing:4,background:'linear-gradient(135deg,var(--champ-lt),var(--champagne),#9a7830)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>TRIP OS</span>
        <span style={{fontSize:9,letterSpacing:4,color:'var(--slate)',textTransform:'uppercase',marginLeft:10,fontWeight:400}}>Luxury Travel Operations</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <span style={{fontSize:10,letterSpacing:2,color:'var(--slate)',textTransform:'uppercase'}}>Meridian Travel Group</span>
        <div style={{width:32,height:32,borderRadius:8,background:'var(--bg3)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--slate)',cursor:'pointer',position:'relative',fontSize:14}}>
          🔔
          <div style={{position:'absolute',top:6,right:6,width:6,height:6,borderRadius:'50%',background:'var(--cognac-lt)'}}/>
        </div>
        <div style={{width:32,height:32,borderRadius:8,background:'var(--bg3)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--slate)',cursor:'pointer',fontSize:14}}>⚙</div>
        <div style={{width:32,height:32,borderRadius:'50%',border:'1px solid var(--champagne)',background:'linear-gradient(135deg,#3a2a10,#6a4a1a)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:500,color:'var(--champagne)',letterSpacing:1}}>DO</div>
      </div>
    </div>
  );
}
