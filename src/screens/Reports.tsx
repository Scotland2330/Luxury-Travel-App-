import { useState } from 'react';

const TABS = [
  'Retainer Report',
  'Revenue Report',
  'Time Spent Report',
  'Commission Status',
  'Passport Status',
  'Task Deadlines',
  'Feedback Report',
  'Trip Pipeline',
];

/* ── Sample data ── */
const retainerData = [
  { client: 'Holland', monthly: 1500, used: 975, remaining: 525, util: 65 },
  { client: 'Diaz', monthly: 800, used: 322, remaining: 478, util: 40 },
  { client: 'Hastings', monthly: 1200, used: 960, remaining: 240, util: 80 },
  { client: 'Baker', monthly: 1000, used: 0, remaining: 1000, util: 0 },
];

const revenueData = [
  { month: 'Jun 2026', retainer: 4500, hourly: 622, commissions: 1940, total: 7062 },
  { month: 'May 2026', retainer: 4500, hourly: 480, commissions: 1170, total: 6150 },
  { month: 'Apr 2026', retainer: 3500, hourly: 350, commissions: 740, total: 4590 },
];

const timeSpentData = [
  { employee: 'Halie McGee', totalHours: '18.5h', billable: '6.5h', retainer: '12h', revenue: 2775 },
  { employee: 'Emily Stone', totalHours: '14.2h', billable: '4.2h', retainer: '10h', revenue: 2130 },
];

const commissionStatusData = [
  { status: 'Done', count: 3, total: 1940, badge: 'b-em' },
  { status: 'Working on it', count: 2, total: 1230, badge: 'b-og' },
  { status: 'Waiting on Supplier', count: 2, total: 1220, badge: 'b-og' },
  { status: 'Money is on the Way', count: 1, total: 850, badge: '', badgeStyle: { background: 'rgba(120,180,60,0.2)', color: '#8bc34a' } as React.CSSProperties },
];

const passportData = [
  { client: 'Holland, Augusta', expiry: 'Mar 2027', status: 'Valid' },
  { client: 'Diaz, Maria', expiry: 'Sep 2026', status: 'Expiring Soon' },
  { client: 'Baker, Sean', expiry: 'Jan 2028', status: 'Valid' },
  { client: 'McGarey, Patrick', expiry: 'Aug 2026', status: 'Expiring Soon' },
];

const taskDeadlineData = [
  { task: 'Send Pre-Arrival — Diaz DC Trip', due: 'Jun 23, 2026', assignee: 'Halie McGee', overdue: false },
  { task: 'Follow up insurance quote — Holland', due: 'Jun 23, 2026', assignee: 'Halie McGee', overdue: false },
  { task: 'Confirm transfer details — Baker', due: 'Jun 25, 2026', assignee: 'Halie McGee', overdue: false },
  { task: 'AXUS Review — Holland Capri', due: 'Jun 21, 2026', assignee: 'Halie McGee', overdue: true },
  { task: 'Welcome Home send — McGarey Scotland', due: 'Jun 15, 2026', assignee: 'Halie McGee', overdue: true },
  { task: 'Client passport submission — Baker', due: 'Jun 18, 2026', assignee: 'Halie McGee', overdue: true },
  { task: 'Insurance decision — Stern/Gross Spain', due: 'Jun 18, 2026', assignee: 'Halie McGee', overdue: true },
  { task: 'Concierge dining res — Holland', due: 'Jun 28, 2026', assignee: 'Halie McGee', overdue: false },
  { task: 'DMC final details — Hastings Kenya', due: 'Jul 15, 2026', assignee: 'Emily Stone', overdue: false },
];

const feedbackData = [
  { destination: 'Italy', responses: 5, avgRating: 4.9, positive: 100 },
  { destination: 'Scotland', responses: 1, avgRating: 5.0, positive: 100 },
  { destination: 'Palm Heights', responses: 1, avgRating: 5.0, positive: 100 },
  { destination: 'NYC Hotels', responses: 2, avgRating: 4.5, positive: 100 },
];

const tripPipelineData = [
  { stage: 'New Inquiry', count: 12, conversion: '' },
  { stage: 'Quoting', count: 8, conversion: '67%' },
  { stage: 'Ready to Book', count: 6, conversion: '75%' },
  { stage: 'Active Trip', count: 5, conversion: '83%' },
  { stage: 'Completed', count: 4, conversion: '80%' },
];

function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

function UtilBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? 'var(--cognac-lt)' : pct >= 50 ? 'var(--champagne)' : 'var(--emerald-lt)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, background: 'var(--bg5)', borderRadius: 3, height: 4, maxWidth: 80 }}>
        <div style={{ width: `${pct}%`, height: 4, borderRadius: 3, background: color }} />
      </div>
      <span style={{ fontSize: 11, color }}>{pct}%</span>
    </div>
  );
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateFrom, setDateFrom] = useState('2026-06-01');
  const [dateTo, setDateTo] = useState('2026-06-30');

  const actionBar = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 0.5 }}>FROM</span>
        <input className="td-input" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: 140, fontSize: 10, padding: '6px 10px' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 0.5 }}>TO</span>
        <input className="td-input" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: 140, fontSize: 10, padding: '6px 10px' }} />
      </div>
      <button className="btn btn-champ btn-sm" onClick={() => alert('Report generated (mock)')}>Generate Report</button>
      <button className="btn btn-ghost btn-sm" onClick={() => alert('CSV exported (mock)')}>Export CSV</button>
      <button className="btn btn-ghost btn-sm" onClick={() => alert('Print triggered (mock)')}>Print</button>
    </div>
  );

  const sortedDeadlines = [...taskDeadlineData].sort((a, b) => {
    if (a.overdue && !b.overdue) return -1;
    if (!a.overdue && b.overdue) return 1;
    return new Date(a.due).getTime() - new Date(b.due).getTime();
  });

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Reports</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4, letterSpacing: 0.5 }}>Generate, view, and export agency reports</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((t, i) => (
          <div
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '12px 16px',
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: 0.5,
              cursor: 'pointer',
              transition: 'all 0.15s',
              color: activeTab === i ? 'var(--champagne)' : 'var(--slate)',
              borderBottom: activeTab === i ? '2px solid var(--champagne)' : '2px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Action bar */}
      <div style={{ marginBottom: 24 }}>{actionBar}</div>

      {/* ═══ Retainer Report ═══ */}
      {activeTab === 0 && (
        <div className="card">
          <div className="card-h">
            <span className="card-t">Retainer Report</span>
            <span style={{ fontSize: 10, color: 'var(--slate)' }}>
              Total Monthly: {fmt(retainerData.reduce((s, r) => s + r.monthly, 0))}
            </span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                {['Client', 'Monthly Retainer', 'Used (Jun)', 'Remaining', 'Utilization'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {retainerData.map((r, i) => (
                <tr key={i}>
                  <td className="td-main">{r.client}</td>
                  <td className="td-gold">{fmt(r.monthly)}</td>
                  <td>{fmt(r.used)}</td>
                  <td style={{ color: r.remaining > 0 ? 'var(--emerald-lt)' : 'var(--ruby-lt)' }}>{fmt(r.remaining)}</td>
                  <td><UtilBar pct={r.util} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Totals row */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--ivory-dim)' }}>Total</span>
            <div style={{ display: 'flex', gap: 32 }}>
              <span style={{ color: 'var(--champagne)' }}>Monthly: {fmt(retainerData.reduce((s, r) => s + r.monthly, 0))}</span>
              <span style={{ color: 'var(--slate)' }}>Used: {fmt(retainerData.reduce((s, r) => s + r.used, 0))}</span>
              <span style={{ color: 'var(--emerald-lt)' }}>Remaining: {fmt(retainerData.reduce((s, r) => s + r.remaining, 0))}</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Revenue Report ═══ */}
      {activeTab === 1 && (
        <div className="card">
          <div className="card-h">
            <span className="card-t">Revenue Report</span>
            <span className="playfair" style={{ fontSize: 18, color: 'var(--champagne)' }}>
              {fmt(revenueData.reduce((s, r) => s + r.total, 0))} total
            </span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                {['Month', 'Retainer', 'Hourly', 'Commissions', 'Total'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {revenueData.map((r, i) => (
                <tr key={i}>
                  <td className="td-main">{r.month}</td>
                  <td>{fmt(r.retainer)}</td>
                  <td>{fmt(r.hourly)}</td>
                  <td>{fmt(r.commissions)}</td>
                  <td className="td-gold">{fmt(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Visual bar chart */}
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 12 }}>Revenue Breakdown</div>
            {revenueData.map((r, i) => {
              const max = Math.max(...revenueData.map(d => d.total));
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--ivory-dim)', width: 70 }}>{r.month}</span>
                  <div style={{ flex: 1, display: 'flex', height: 18, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(r.retainer / max) * 100}%`, background: 'var(--champagne)', opacity: 0.8 }} />
                    <div style={{ width: `${(r.hourly / max) * 100}%`, background: 'var(--sapphire-lt)', opacity: 0.8 }} />
                    <div style={{ width: `${(r.commissions / max) * 100}%`, background: 'var(--emerald-lt)', opacity: 0.8 }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--champagne)', width: 60, textAlign: 'right' }}>{fmt(r.total)}</span>
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
              {[{ label: 'Retainer', color: 'var(--champagne)' }, { label: 'Hourly', color: 'var(--sapphire-lt)' }, { label: 'Commissions', color: 'var(--emerald-lt)' }].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, opacity: 0.8 }} />
                  <span style={{ fontSize: 9, color: 'var(--slate)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Time Spent Report ═══ */}
      {activeTab === 2 && (
        <div className="card">
          <div className="card-h">
            <span className="card-t">Time Spent Report — By Employee</span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                {['Employee', 'Total Hours', 'Billable', 'Retainer', 'Revenue'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSpentData.map((r, i) => (
                <tr key={i}>
                  <td className="td-main">{r.employee}</td>
                  <td>{r.totalHours}</td>
                  <td>{r.billable}</td>
                  <td>{r.retainer}</td>
                  <td className="td-gold">{fmt(r.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--ivory-dim)' }}>Total</span>
            <span className="playfair" style={{ color: 'var(--champagne)', fontSize: 16 }}>
              {fmt(timeSpentData.reduce((s, r) => s + r.revenue, 0))}
            </span>
          </div>
        </div>
      )}

      {/* ═══ Commission Status Report ═══ */}
      {activeTab === 3 && (
        <div className="card">
          <div className="card-h">
            <span className="card-t">Commission Status Report</span>
            <span className="playfair" style={{ fontSize: 18, color: 'var(--champagne)' }}>
              {fmt(commissionStatusData.reduce((s, r) => s + r.total, 0))} total
            </span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                {['Status', 'Count', 'Total Value'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commissionStatusData.map((r, i) => (
                <tr key={i}>
                  <td>
                    <span
                      className={`badge ${r.badge}`}
                      style={r.badgeStyle}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="td-main">{r.count}</td>
                  <td className="td-gold">{fmt(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Visual summary */}
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 12 }}>Distribution</div>
            {commissionStatusData.map((r, i) => {
              const max = Math.max(...commissionStatusData.map(d => d.total));
              const colors = ['var(--emerald-lt)', 'var(--cognac-lt)', 'var(--cognac-lt)', '#8bc34a'];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--ivory-dim)', width: 140, whiteSpace: 'nowrap' }}>{r.status}</span>
                  <div style={{ flex: 1, background: 'var(--bg5)', borderRadius: 3, height: 8 }}>
                    <div style={{ width: `${(r.total / max) * 100}%`, height: 8, borderRadius: 3, background: colors[i] }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--champagne)', width: 60, textAlign: 'right' }}>{fmt(r.total)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Passport Status Report ═══ */}
      {activeTab === 4 && (
        <div className="card">
          <div className="card-h">
            <span className="card-t">Passport Status Report</span>
            <span style={{ fontSize: 10, color: 'var(--ruby-lt)' }}>
              {passportData.filter(p => p.status === 'Expiring Soon').length} expiring within 6 months
            </span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                {['Client', 'Passport Expiry', 'Status'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {passportData.map((r, i) => (
                <tr key={i}>
                  <td className="td-main">{r.client}</td>
                  <td>{r.expiry}</td>
                  <td>
                    {r.status === 'Expiring Soon' ? (
                      <span className="badge b-rb" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 11 }}>&#9873;</span> Expiring Soon
                      </span>
                    ) : (
                      <span className="badge b-em">Valid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══ Task Deadline Report ═══ */}
      {activeTab === 5 && (
        <div className="card">
          <div className="card-h">
            <span className="card-t">Task Deadline Report</span>
            <span style={{ fontSize: 10, color: 'var(--ruby-lt)' }}>
              {sortedDeadlines.filter(t => t.overdue).length} overdue
            </span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                {['Task', 'Due Date', 'Assignee', 'Status'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedDeadlines.map((r, i) => (
                <tr key={i} style={r.overdue ? { background: 'rgba(155,58,58,0.08)' } : undefined}>
                  <td className="td-main" style={r.overdue ? { color: 'var(--ruby-lt)' } : undefined}>{r.task}</td>
                  <td style={r.overdue ? { color: 'var(--ruby-lt)' } : undefined}>{r.due}</td>
                  <td>{r.assignee}</td>
                  <td>
                    {r.overdue ? (
                      <span className="badge b-rb">Overdue</span>
                    ) : (
                      <span className="badge b-em">On Track</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══ Feedback Report ═══ */}
      {activeTab === 6 && (
        <div className="card">
          <div className="card-h">
            <span className="card-t">Feedback Report</span>
            <span style={{ fontSize: 10, color: 'var(--slate)' }}>
              Avg: {(feedbackData.reduce((s, r) => s + r.avgRating * r.responses, 0) / feedbackData.reduce((s, r) => s + r.responses, 0)).toFixed(1)} / 5.0
            </span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                {['Destination', 'Responses', 'Avg Rating', 'Positive %'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feedbackData.map((r, i) => (
                <tr key={i}>
                  <td className="td-main">{r.destination}</td>
                  <td>{r.responses}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: 'var(--champagne)' }}>{r.avgRating.toFixed(1)}</span>
                      <span style={{ fontSize: 10, color: 'var(--champagne)', letterSpacing: 1 }}>
                        {'★'.repeat(Math.round(r.avgRating))}{'☆'.repeat(5 - Math.round(r.avgRating))}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge b-em">{r.positive}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══ Trip Pipeline Report ═══ */}
      {activeTab === 7 && (
        <div className="card">
          <div className="card-h">
            <span className="card-t">Trip Pipeline Report</span>
            <span style={{ fontSize: 10, color: 'var(--slate)' }}>Inquiry to Completion funnel</span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                {['Stage', 'Count', 'Conversion'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tripPipelineData.map((r, i) => (
                <tr key={i}>
                  <td className="td-main">{r.stage}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{r.count}</span>
                      <div style={{ flex: 1, background: 'var(--bg5)', borderRadius: 3, height: 6, maxWidth: 120 }}>
                        <div style={{ width: `${(r.count / 12) * 100}%`, height: 6, borderRadius: 3, background: 'var(--champagne)', opacity: 0.7 }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    {r.conversion ? (
                      <span className="badge b-em">{r.conversion}</span>
                    ) : (
                      <span style={{ fontSize: 10, color: 'var(--slate)' }}>--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Funnel visual */}
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 16 }}>Funnel Visualization</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {tripPipelineData.map((r, i) => {
                const widthPct = 30 + (70 * (tripPipelineData.length - i) / tripPipelineData.length);
                const colors = ['var(--sapphire-lt)', 'var(--champagne)', 'var(--cognac-lt)', 'var(--emerald-lt)', 'var(--emerald)'];
                return (
                  <div
                    key={i}
                    style={{
                      width: `${widthPct}%`,
                      background: colors[i],
                      opacity: 0.7,
                      padding: '10px 16px',
                      borderRadius: 6,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 11, color: 'var(--bg)', fontWeight: 500 }}>{r.stage}</span>
                    <span style={{ fontSize: 12, color: 'var(--bg)', fontWeight: 600 }}>{r.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
