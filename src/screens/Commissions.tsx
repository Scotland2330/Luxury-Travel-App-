const pipelineRows = [
  { client: 'Deb Hastings', supplier: 'Micato Safaris', amount: '$1,200', notes: 'Kenya group booking', badge: 'b-em', status: 'Completed' },
  { client: 'Kim Jones', supplier: 'Belmond', amount: '$850', notes: 'Villa San Michele', badge: 'b-sa', status: 'Payment in Progress' },
  { client: 'McGarey', supplier: 'Gleneagles Hotel', amount: '$420', notes: 'Scotland 5-night stay', badge: 'b-em', status: 'Completed' },
  { client: 'Hillebrand/Hancock', supplier: 'Italy DMC Tours', amount: '$680', notes: 'Multi-city Italy package', badge: 'b-og', status: 'Waiting on Supplier' },
  { client: 'Holland', supplier: 'Hotel Caesar Augustus', amount: '$540', notes: 'Capri 9-night stay', badge: 'b-og', status: 'Waiting on Supplier' },
  { client: "O'Brien", supplier: 'Palm Heights Resort', amount: '$320', notes: '4-night R&R package', badge: 'b-em', status: 'Completed' },
  { client: 'Baker', supplier: 'Westlake Hotels', amount: '$480', notes: 'Business retreat package', badge: 'b-mu', status: 'Submitted (SF)' },
  { client: 'Stern/Gross', supplier: 'Spain Luxury DMC', amount: '$750', notes: 'Barcelona + San Sebastian', badge: 'b-sa', status: 'Payment in Progress' },
];

const completedLog = [
  { label: 'Deb Hastings — Micato Safaris', amount: '$1,200', date: 'Logged Jun 15' },
  { label: 'McGarey — Gleneagles', amount: '$420', date: 'Logged Jun 1' },
  { label: "O'Brien — Palm Heights", amount: '$320', date: 'Logged May 20' },
];

export default function Commissions() {
  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Commission Tracking</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>Track supplier commissions across all bookings</p>
        </div>
        <button className="btn btn-champ">+ Log Commission</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left — Commission Pipeline */}
        <div className="card">
          <div className="card-h"><span className="card-t">Commission Pipeline</span></div>
          <table className="tbl">
            <thead>
              <tr>
                {['Client', 'Supplier/Vendor', 'Amount', 'Notes', 'Status'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pipelineRows.map((r, i) => (
                <tr key={i}>
                  <td className="td-main">{r.client}</td>
                  <td style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>{r.supplier}</td>
                  <td className="td-gold">{r.amount}</td>
                  <td style={{ fontSize: 10, color: 'var(--slate)' }}>{r.notes}</td>
                  <td><span className={`badge ${r.badge}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right — Summary */}
        <div>
          {/* Commission Summary */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-h"><span className="card-t">Commission Summary</span></div>
            <div className="card-b" style={{ padding: 20 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Total Earned (2026)</div>
              <div className="playfair" style={{ fontSize: 28, color: 'var(--champagne)', marginBottom: 16 }}>$12,840</div>

              <div style={{ display: 'flex', gap: 24 }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Pending</div>
                  <div className="playfair" style={{ fontSize: 18, color: 'var(--cognac-lt)' }}>$4,280</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Collected</div>
                  <div className="playfair" style={{ fontSize: 18, color: 'var(--emerald-lt)' }}>$8,560</div>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Log */}
          <div className="card">
            <div className="card-h"><span className="card-t">Recently Completed</span></div>
            <div className="card-b">
              {completedLog.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < completedLog.length - 1 ? '1px solid var(--border2)' : 'none', fontSize: 11 }}>
                  <span style={{ color: 'var(--ivory-dim)' }}>{r.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="playfair" style={{ fontSize: 12, color: 'var(--champagne)' }}>{r.amount}</span>
                    <span style={{ fontSize: 9, color: 'var(--slate)' }}>{r.date}</span>
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
