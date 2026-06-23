import { useState } from 'react';
import { useTheme } from '../ThemeContext';

/* ─── Status definitions ─── */
interface StatusDef {
  label: string;
  badgeClass: string;
  badgeStyle?: React.CSSProperties;
}

const DEFAULT_STATUSES: StatusDef[] = [
  { label: 'Working on it', badgeClass: 'b-og' },
  { label: 'SF- Commission Inquiry', badgeClass: 'b-sa' },
  { label: 'Stuck', badgeClass: 'b-rb' },
  { label: 'Holding', badgeClass: '', badgeStyle: { background: 'rgba(107,61,155,0.2)', color: 'var(--amethyst)' } },
  { label: 'Done', badgeClass: 'b-em' },
  { label: 'Followed-up with Supplier', badgeClass: 'b-ch' },
  { label: 'Waiting on Supplier', badgeClass: 'b-og' },
  { label: 'Money is on the Way', badgeClass: '', badgeStyle: { background: 'rgba(120,180,60,0.2)', color: '#8bc34a' } },
];

/* ─── Commission entry type ─── */
interface Commission {
  id: number;
  client: string;
  property: string;
  supplier: string;
  amount: number;
  status: string;
  notes: string;
  month: string; // "June 2026", "May 2026", etc.
}

/* ─── Sample data ─── */
const INITIAL_DATA: Commission[] = [
  { id: 1, client: 'Cady, Heather', property: 'Waldorf Astoria', supplier: 'Waldorf Astoria', amount: 1150, status: 'Working on it', notes: 'Group rate commission pending', month: 'June 2026' },
  { id: 2, client: 'Hastings, Debra', property: 'Medjet', supplier: 'Medjet', amount: 320, status: 'Done', notes: 'Travel protection referral', month: 'June 2026' },
  { id: 3, client: 'Clark Burkle', property: 'Queen of Clubs', supplier: 'Queen of Clubs', amount: 875, status: 'SF- Commission Inquiry', notes: 'Submitted via SF portal Jun 10', month: 'June 2026' },
  { id: 4, client: 'Kim Jones', property: 'Villa San Michele', supplier: 'Belmond', amount: 1420, status: 'Money is on the Way', notes: 'Wire transfer initiated', month: 'May 2026' },
  { id: 5, client: 'Holland', property: 'Hotel Caesar Augustus', supplier: 'Hotel Caesar Augustus', amount: 540, status: 'Waiting on Supplier', notes: 'Capri 9-night stay — follow up Jun 25', month: 'May 2026' },
  { id: 6, client: 'McGarey', property: 'Gleneagles Hotel', supplier: 'Gleneagles Hotel', amount: 680, status: 'Done', notes: 'Scotland 5-night stay collected', month: 'April 2026' },
  { id: 7, client: "O'Brien", property: 'Palm Heights', supplier: 'Palm Heights Resort', amount: 390, status: 'Done', notes: '4-night R&R package', month: 'April 2026' },
  { id: 8, client: 'Baker', property: 'Westlake Hotels', supplier: 'Westlake Hotels', amount: 480, status: 'Followed-up with Supplier', notes: 'Business retreat — emailed Apr 2', month: 'March 2026' },
  { id: 9, client: 'Julia Lewis', property: 'The Lowell', supplier: 'The Lowell NYC', amount: 960, status: 'Holding', notes: 'Client requested hold on claim', month: 'December 2025' },
  { id: 10, client: 'Andrea Gleason', property: 'Rosewood Miramar', supplier: 'Rosewood Hotels', amount: 1100, status: 'Working on it', notes: 'Multi-room booking commission', month: 'October 2025' },
  { id: 11, client: 'Dianna Baker', property: 'Meadowood Resort', supplier: 'Meadowood Resort', amount: 750, status: 'Stuck', notes: 'Supplier disputes commission tier', month: 'October 2025' },
];

/* ─── Month ordering ─── */
const MONTH_ORDER = [
  'June 2026', 'May 2026', 'April 2026', 'March 2026',
  'February 2026', 'January 2026', 'December 2025', 'November 2025',
  'October 2025',
];

/* ─── Helpers ─── */
function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

function getStatusDef(label: string, statuses: StatusDef[]): StatusDef | undefined {
  return statuses.find(s => s.label === label);
}

const lightBadgeOverrides: Record<string, React.CSSProperties> = {
  'Holding': { background: 'rgba(107,74,139,0.15)', color: '#6B4A8B' },
  'Money is on the Way': { background: 'rgba(46,123,90,0.15)', color: '#2E7B5A' },
};

function badgeProps(label: string, statuses: StatusDef[], isLight = false): { className: string; style?: React.CSSProperties } {
  const def = getStatusDef(label, statuses);
  if (!def) return { className: 'badge b-mu' };
  const cls = `badge ${def.badgeClass}`.trim();
  if (isLight && lightBadgeOverrides[label]) {
    return { className: cls, style: lightBadgeOverrides[label] };
  }
  return def.badgeStyle ? { className: cls, style: def.badgeStyle } : { className: cls };
}

/* ─── Blank form ─── */
const BLANK_FORM = { client: '', property: '', supplier: '', amount: '', status: 'Working on it', notes: '', month: 'June 2026' };

/* ─── Component ─── */
export default function Commissions() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [data, setData] = useState<Commission[]>(INITIAL_DATA);
  const [statuses, setStatuses] = useState<StatusDef[]>(DEFAULT_STATUSES);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [filterStatus, setFilterStatus] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [showManage, setShowManage] = useState(false);
  const [newStatusLabel, setNewStatusLabel] = useState('');

  /* ─── Derived data ─── */
  const filtered = data.filter(c => {
    if (filterStatus && c.status !== filterStatus) return false;
    if (filterClient && c.client !== filterClient) return false;
    if (filterMonth && c.month !== filterMonth) return false;
    return true;
  });

  const months = MONTH_ORDER.filter(m => filtered.some(c => c.month === m));

  const uniqueClients = [...new Set(data.map(c => c.client))].sort();
  const uniqueMonths = [...new Set(data.map(c => c.month))];
  const sortedMonths = MONTH_ORDER.filter(m => uniqueMonths.includes(m));

  /* ─── Summary calcs ─── */
  const totalAll = data.reduce((s, c) => s + c.amount, 0);
  const collected = data.filter(c => c.status === 'Done').reduce((s, c) => s + c.amount, 0);
  const pending = totalAll - collected;
  const thisMonthTotal = data.filter(c => c.month === 'June 2026').reduce((s, c) => s + c.amount, 0);

  /* ─── Handlers ─── */
  const toggleMonth = (m: string) => setCollapsed(prev => ({ ...prev, [m]: !prev[m] }));

  const handleSubmit = () => {
    if (!form.client.trim() || !form.amount.trim()) return;
    const entry: Commission = {
      id: Date.now(),
      client: form.client.trim(),
      property: form.property.trim(),
      supplier: form.supplier.trim(),
      amount: parseFloat(form.amount.replace(/[^0-9.]/g, '')) || 0,
      status: form.status,
      notes: form.notes.trim(),
      month: form.month,
    };
    setData(prev => [entry, ...prev]);
    setForm({ ...BLANK_FORM });
    setShowForm(false);
  };

  const addStatus = () => {
    const label = newStatusLabel.trim();
    if (!label || statuses.some(s => s.label === label)) return;
    setStatuses(prev => [...prev, { label, badgeClass: 'b-mu' }]);
    setNewStatusLabel('');
  };

  const removeStatus = (label: string) => {
    setStatuses(prev => prev.filter(s => s.label !== label));
  };

  /* ─── Shared input style ─── */
  const selectStyle: React.CSSProperties = { minWidth: 140 };

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Commission Tracking</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>Log and track supplier commissions across all bookings</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowManage(true)}>Manage Statuses</button>
          <button className="btn btn-champ" onClick={() => setShowForm(!showForm)}>+ Log Commission</button>
        </div>
      </div>

      {/* ─── Filter Bar ─── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <select className="td-input" style={selectStyle} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
        </select>
        <select className="td-input" style={selectStyle} value={filterClient} onChange={e => setFilterClient(e.target.value)}>
          <option value="">All Clients</option>
          {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="td-input" style={selectStyle} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
          <option value="">All Months</option>
          {sortedMonths.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        {(filterStatus || filterClient || filterMonth) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilterStatus(''); setFilterClient(''); setFilterMonth(''); }}>Clear Filters</button>
        )}
      </div>

      {/* ─── Log Commission Form ─── */}
      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-h">
            <span className="card-t">Log New Commission</span>
            <button className="btn btn-ghost btn-xs" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
          <div className="card-b">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4, display: 'block' }}>Client Name</label>
                <input className="td-input" placeholder="e.g. Smith, John" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4, display: 'block' }}>Property Name</label>
                <input className="td-input" placeholder="e.g. Waldorf Astoria" value={form.property} onChange={e => setForm(f => ({ ...f, property: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4, display: 'block' }}>Supplier / Vendor</label>
                <input className="td-input" placeholder="e.g. Hilton" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4, display: 'block' }}>Amount</label>
                <input className="td-input" placeholder="$0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4, display: 'block' }}>Status</label>
                <select className="td-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {statuses.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4, display: 'block' }}>Month</label>
                <select className="td-input" value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))}>
                  {MONTH_ORDER.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4, display: 'block' }}>Notes</label>
                <input className="td-input" placeholder="Optional notes..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <button className="btn btn-champ" onClick={handleSubmit}>Save Commission</button>
          </div>
        </div>
      )}

      {/* ─── Main Layout: Table + Summary sidebar ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        {/* ─── Left: Month-grouped commissions ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {months.length === 0 && (
            <div className="card">
              <div className="card-b" style={{ textAlign: 'center', padding: 40, color: 'var(--slate)' }}>
                No commissions match the current filters.
              </div>
            </div>
          )}

          {months.map(month => {
            const rows = filtered.filter(c => c.month === month);
            const isCollapsed = !!collapsed[month];
            const monthTotal = rows.reduce((s, c) => s + c.amount, 0);

            return (
              <div key={month}>
                {/* Month header */}
                <div
                  onClick={() => toggleMonth(month)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 16px',
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    borderRadius: isCollapsed ? 8 : '8px 8px 0 0',
                    cursor: 'pointer', userSelect: 'none',
                  }}
                >
                  <span style={{
                    fontSize: 11, color: 'var(--champagne)',
                    transition: 'transform 0.2s', display: 'inline-block',
                    transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                  }}>▼</span>
                  <span className="playfair" style={{ fontSize: 15, color: 'var(--ivory)', fontWeight: 400 }}>{month}</span>
                  <span style={{ fontSize: 10, color: 'var(--slate)', marginLeft: 4 }}>({rows.length} {rows.length === 1 ? 'entry' : 'entries'})</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--champagne)' }} className="playfair">{fmt(monthTotal)}</span>
                </div>

                {/* Table */}
                {!isCollapsed && (
                  <div className="card" style={{ borderRadius: '0 0 12px 12px', borderTop: 'none' }}>
                    <table className="tbl">
                      <thead>
                        <tr>
                          {['Client Name', 'Property', 'Supplier / Vendor', 'Amount', 'Status', 'Notes'].map(h => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map(r => {
                          const bp = badgeProps(r.status, statuses, isLight);
                          return (
                            <tr key={r.id}>
                              <td className="td-main">{r.client}</td>
                              <td style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>{r.property}</td>
                              <td style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>{r.supplier}</td>
                              <td className="td-gold">{fmt(r.amount)}</td>
                              <td>
                                <span className={bp.className} style={bp.style}>{r.status}</span>
                              </td>
                              <td style={{ fontSize: 10, color: 'var(--slate)', maxWidth: 180 }}>{r.notes}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Right: Summary cards ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Total Commissions */}
          <div className="card">
            <div className="card-b" style={{ padding: 18 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Total Commissions</div>
              <div className="playfair" style={{ fontSize: 26, color: 'var(--champagne)' }}>{fmt(totalAll)}</div>
            </div>
          </div>

          {/* Collected */}
          <div className="card">
            <div className="card-b" style={{ padding: 18 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Collected</div>
              <div className="playfair" style={{ fontSize: 22, color: 'var(--emerald-lt)' }}>{fmt(collected)}</div>
              <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 4 }}>{data.filter(c => c.status === 'Done').length} commissions received</div>
            </div>
          </div>

          {/* Pending */}
          <div className="card">
            <div className="card-b" style={{ padding: 18 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Pending</div>
              <div className="playfair" style={{ fontSize: 22, color: 'var(--cognac-lt)' }}>{fmt(pending)}</div>
              <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 4 }}>{data.filter(c => c.status !== 'Done').length} commissions outstanding</div>
            </div>
          </div>

          {/* This Month */}
          <div className="card">
            <div className="card-b" style={{ padding: 18 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>This Month (June 2026)</div>
              <div className="playfair" style={{ fontSize: 22, color: 'var(--ivory)' }}>{fmt(thisMonthTotal)}</div>
              <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 4 }}>{data.filter(c => c.month === 'June 2026').length} entries</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Manage Statuses Panel (overlay) ─── */}
      {showManage && (
        <>
          <div onClick={() => setShowManage(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 420, background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 12, zIndex: 201, boxShadow: 'var(--shadow)',
          }}>
            <div className="card-h">
              <span className="card-t">Manage Commission Statuses</span>
              <button className="btn btn-ghost btn-xs" onClick={() => setShowManage(false)}>Close</button>
            </div>
            <div style={{ padding: 20, maxHeight: 400, overflowY: 'auto' }}>
              {statuses.map(s => {
                const bp = badgeProps(s.label, statuses, isLight);
                return (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border2)' }}>
                    <span className={bp.className} style={bp.style}>{s.label}</span>
                    <button
                      onClick={() => removeStatus(s.label)}
                      style={{
                        background: 'none', border: 'none', color: 'var(--ruby-lt)',
                        cursor: 'pointer', fontSize: 14, padding: '2px 6px', fontFamily: "'Aptos Display', 'Aptos', 'Inter', sans-serif",
                      }}
                      title={`Remove "${s.label}"`}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <input
                  className="td-input"
                  placeholder="New status label..."
                  value={newStatusLabel}
                  onChange={e => setNewStatusLabel(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addStatus()}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-champ btn-sm" onClick={addStatus}>+ Add Status</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
