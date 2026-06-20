type TripCard = {
  title: string;
  dates: string;
  lead: string;
  budget: string;
  notes: string;
  created: string;
  badge: string;
  badgeLabel: string;
};

const columns: { title: string; count: number; cards: TripCard[] }[] = [
  {
    title: 'NEW INQUIRY', count: 2, cards: [
      { title: 'Japan Cherry Blossom — Killian Family', dates: 'Mar 2027', lead: 'Halie McGee', budget: '$25,000–30,000', notes: 'Initial consult completed', created: 'Jun 15', badge: 'b-sa', badgeLabel: 'New' },
      { title: 'Amalfi Anniversary — Torres', dates: 'Sep 2026', lead: 'Halie McGee', budget: '$15,000', notes: 'Referral from Kim Jones', created: 'Jun 18', badge: 'b-sa', badgeLabel: 'New' },
    ],
  },
  {
    title: 'QUOTING', count: 1, cards: [
      { title: 'Maldives Honeymoon — Rivera', dates: 'Jan 2027', lead: 'Emily Stone', budget: '$40,000', notes: 'Flights + 2 resorts quoted · Awaiting client response', created: 'Jun 10', badge: 'b-og', badgeLabel: 'Quoted' },
    ],
  },
  {
    title: 'READY TO BOOK', count: 1, cards: [
      { title: 'London + Paris — Bingham', dates: 'Oct 2026', lead: 'Halie McGee', budget: '$18,000', notes: 'Client approved itinerary · Deposit pending', created: 'Jun 5', badge: 'b-em', badgeLabel: 'Approved' },
    ],
  },
];

export default function TripRequests() {
  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Trip Requests</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4, letterSpacing: 0.5 }}>3 new inquiries · Pipeline view</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-champ">+ New Request</button>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {columns.map((col, ci) => (
          <div key={ci} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {/* Column header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--ivory-dim)' }}>{col.title}</span>
              <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 8, background: 'var(--bg4)', color: 'var(--slate)' }}>{col.count}</span>
            </div>

            {/* Cards */}
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 160 }}>
              {col.cards.map((card, ti) => (
                <div key={ti} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: 12 }}>
                  {/* Title + Badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 400, lineHeight: 1.4 }}>{card.title}</div>
                    <span className={`badge ${card.badge}`} style={{ flexShrink: 0 }}>{card.badgeLabel}</span>
                  </div>

                  {/* Dates + Lead */}
                  <div style={{ fontSize: 10, color: 'var(--slate)', marginBottom: 4 }}>Dates: {card.dates}</div>
                  <div style={{ fontSize: 10, color: 'var(--slate)', marginBottom: 6 }}>Lead: {card.lead}</div>

                  {/* Budget */}
                  <div style={{ fontSize: 10, color: 'var(--champagne)', marginBottom: 6 }}>Budget: {card.budget}</div>

                  {/* Notes */}
                  <div style={{ fontSize: 10, color: 'var(--ivory-dim)', marginBottom: 8, lineHeight: 1.4 }}>{card.notes}</div>

                  {/* Footer: Created date + Convert button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 9, color: 'var(--slate)' }}>Created: {card.created}</span>
                    {col.title === 'READY TO BOOK' && (
                      <button className="btn btn-champ btn-sm">+ Convert to Active Trip</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
