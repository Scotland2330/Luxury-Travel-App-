export default function ClientPortal() {
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 className="playfair" style={{fontSize:26,fontWeight:400,letterSpacing:0.5}}>Client Portal</h1>
          <p style={{fontSize:11,color:'var(--slate)',marginTop:4}}>Branded client-facing view · Chen, Michelle</p>
        </div>
        <button className="btn btn-champ">Copy Portal Link</button>
      </div>

      <div style={{maxWidth:620,margin:'0 auto',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:28}}>
        {/* Agency header */}
        <div style={{textAlign:'center',paddingBottom:24,borderBottom:'1px solid var(--border)',marginBottom:24}}>
          <div className="playfair" style={{fontSize:22,color:'var(--champagne)',letterSpacing:3}}>MERIDIAN TRAVEL</div>
          <div style={{width:40,height:1,background:'var(--champagne)',opacity:0.4,margin:'10px auto'}}/>
          <div style={{fontSize:12,color:'var(--ivory-dim)'}}>Welcome back, Michelle. Your adventure awaits.</div>
        </div>

        {/* Departure + Trip */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
          <div style={{background:'var(--bg4)',borderRadius:10,padding:16,textAlign:'center',border:'1px solid var(--border)'}}>
            <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Departure In</div>
            <div className="playfair" style={{fontSize:42,color:'var(--champagne)',lineHeight:1}}>28</div>
            <div style={{fontSize:9,color:'var(--slate)',letterSpacing:1}}>DAYS</div>
          </div>
          <div style={{background:'var(--bg4)',borderRadius:10,padding:16,border:'1px solid var(--border)'}}>
            <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--slate)',marginBottom:6}}>Your Trip</div>
            <div className="playfair" style={{fontSize:18,color:'var(--ivory)'}}>Dubrovnik & Hvar</div>
            <div style={{fontSize:10,color:'var(--slate)',marginTop:4}}>Apr 3–12 · 9 nights</div>
          </div>
        </div>

        {/* Payment */}
        <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10,padding:16,marginBottom:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <span style={{fontSize:12,color:'var(--ivory)',fontWeight:500}}>Next Payment Due</span>
            <span className="badge b-og">Mar 17 · 11 days</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <span style={{fontSize:11,color:'var(--slate)'}}>2nd Payment (50%)</span>
            <span className="playfair" style={{fontSize:22,color:'var(--champagne)'}}>$7,600</span>
          </div>
          <button className="btn btn-champ" style={{width:'100%',padding:10}}>Pay Now via Secure Checkout</button>
        </div>

        {/* Footer */}
        <div style={{textAlign:'center',fontSize:10,color:'var(--slate)'}}>
          Questions? Contact Denise O. · <span style={{color:'var(--champagne)'}}>denise@meridiantravel.com</span>
        </div>
      </div>
    </div>
  );
}
