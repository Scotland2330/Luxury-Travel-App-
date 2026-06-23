import { useState } from 'react';

/* ─── Data ─── */

const categories = [
  { label: 'Insurance Quoting', defaultTime: '0h 30m' },
  { label: 'Flights', defaultTime: '0h 09m' },
  { label: 'Hotels', defaultTime: '0h 09m' },
  { label: 'Touring/DMC', defaultTime: '' },
  { label: 'Transfers', defaultTime: '' },
  { label: 'Concierge', defaultTime: '' },
  { label: 'AXUS Review', defaultTime: '' },
  { label: 'Admin', defaultTime: '' },
  { label: 'Other', defaultTime: '' },
];

type TimeStatus = 'Unbilled' | 'Logged' | 'Invoiced' | 'Retainer';
type InvoiceStatus = 'Paid' | 'Sent' | 'Draft' | 'Overdue';

interface TimeEntry {
  client: string;
  trip: string;
  task: string;
  category: string;
  hours: number;
  amount: string;
  status: TimeStatus;
  date: string;
}

const timeLog: TimeEntry[] = [
  { client: 'Holland', trip: 'Capri', task: 'Insurance quote follow-up', category: 'Insurance', hours: 0.5, amount: '$75', status: 'Retainer', date: 'Jun 18' },
  { client: 'Holland', trip: 'Capri', task: 'AXUS Review', category: 'AXUS Review', hours: 1.5, amount: '$225', status: 'Retainer', date: 'Jun 17' },
  { client: 'Holland', trip: 'Capri', task: 'Flight check', category: 'Flights', hours: 0.15, amount: '$22.50', status: 'Retainer', date: 'Jun 16' },
  { client: 'Holland', trip: 'Capri', task: 'Hotel confirmation', category: 'Hotels', hours: 0.15, amount: '$22.50', status: 'Retainer', date: 'Jun 15' },
  { client: 'Holland', trip: 'Capri', task: 'Transfer booking', category: 'Transfers', hours: 0.5, amount: '$75', status: 'Retainer', date: 'Jun 14' },
  { client: 'Holland', trip: 'Capri', task: 'Concierge requests', category: 'Concierge', hours: 0.75, amount: '$112.50', status: 'Retainer', date: 'Jun 12' },
  { client: 'Holland', trip: 'Capri', task: 'Touring coordination', category: 'Touring/DMC', hours: 0.5, amount: '$75', status: 'Retainer', date: 'Jun 10' },
  { client: 'Holland', trip: 'Capri', task: 'Admin follow-up', category: 'Admin', hours: 0.25, amount: '$37.50', status: 'Retainer', date: 'Jun 9' },
  { client: 'Holland', trip: 'Capri', task: 'Welcome docs prep', category: 'Admin', hours: 1.2, amount: '$180', status: 'Retainer', date: 'Jun 8' },
  { client: 'Holland', trip: 'Capri', task: 'Vendor confirm calls', category: 'Concierge', hours: 1.0, amount: '$150', status: 'Retainer', date: 'Jun 6' },
  { client: 'Diaz', trip: 'DC Business', task: 'Flight check', category: 'Flights', hours: 0.15, amount: '$22.50', status: 'Retainer', date: 'Jun 18' },
  { client: 'Diaz', trip: 'DC Business', task: 'Hotel confirmation', category: 'Hotels', hours: 0.15, amount: '$22.50', status: 'Retainer', date: 'Jun 16' },
  { client: 'Diaz', trip: 'DC Business', task: 'Transfer coordination', category: 'Transfers', hours: 0.5, amount: '$75', status: 'Retainer', date: 'Jun 14' },
  { client: 'Diaz', trip: 'DC Business', task: 'Concierge dining', category: 'Concierge', hours: 0.35, amount: '$52.50', status: 'Retainer', date: 'Jun 12' },
  { client: 'Diaz', trip: 'DC Business', task: 'Itinerary review', category: 'Admin', hours: 1.0, amount: '$150', status: 'Retainer', date: 'Jun 10' },
  { client: 'Hastings', trip: 'Kenya Safari', task: 'DMC coordination', category: 'Touring/DMC', hours: 2.0, amount: '$300', status: 'Retainer', date: 'Jun 17' },
  { client: 'Hastings', trip: 'Kenya Safari', task: 'Insurance quote', category: 'Insurance', hours: 0.5, amount: '$75', status: 'Retainer', date: 'Jun 15' },
  { client: 'Hastings', trip: 'Kenya Safari', task: 'Flight rebooking', category: 'Flights', hours: 1.4, amount: '$210', status: 'Retainer', date: 'Jun 13' },
  { client: 'Hastings', trip: 'Kenya Safari', task: 'Lodge confirmation', category: 'Hotels', hours: 0.5, amount: '$75', status: 'Retainer', date: 'Jun 12' },
  { client: 'Hastings', trip: 'Kenya Safari', task: 'Transfer logistics', category: 'Transfers', hours: 1.0, amount: '$150', status: 'Retainer', date: 'Jun 10' },
  { client: 'Hastings', trip: 'Kenya Safari', task: 'Visa documentation', category: 'Admin', hours: 1.0, amount: '$150', status: 'Retainer', date: 'Jun 8' },
  { client: 'Baker', trip: 'Aspen', task: 'Ski resort research', category: 'Concierge', hours: 1.5, amount: '$225', status: 'Unbilled', date: 'Jun 16' },
  { client: 'Baker', trip: 'Aspen', task: 'Flight options', category: 'Flights', hours: 0.7, amount: '$105', status: 'Unbilled', date: 'Jun 14' },
  { client: 'Baker', trip: 'Aspen', task: 'Hotel pricing', category: 'Hotels', hours: 1.0, amount: '$150', status: 'Logged', date: 'Jun 12' },
  { client: 'Stern/Gross', trip: 'Custom', task: 'Trip scoping call', category: 'Admin', hours: 1.0, amount: '$150', status: 'Logged', date: 'Jun 18' },
  { client: 'Stern/Gross', trip: 'Custom', task: 'Destination research', category: 'Concierge', hours: 2.5, amount: '$375', status: 'Logged', date: 'Jun 15' },
  { client: 'Stern/Gross', trip: 'Custom', task: 'Vendor outreach', category: 'Touring/DMC', hours: 1.5, amount: '$225', status: 'Unbilled', date: 'Jun 13' },
  { client: 'McGarey', trip: 'Scotland', task: 'Welcome Home prep', category: 'Admin', hours: 0.5, amount: '$75', status: 'Invoiced', date: 'Jun 11' },
];

interface RetainerClient {
  name: string;
  monthlyAmount: number;
  rate: number;
  entries: { task: string; hours: number; amount: number }[];
}

const retainerClients: RetainerClient[] = [
  {
    name: 'Holland',
    monthlyAmount: 1500,
    rate: 150,
    entries: [
      { task: 'Insurance quote follow-up', hours: 0.5, amount: 75 },
      { task: 'AXUS Review', hours: 1.5, amount: 225 },
      { task: 'Flight check', hours: 0.15, amount: 22.50 },
      { task: 'Hotel confirmation', hours: 0.15, amount: 22.50 },
      { task: 'Transfer booking', hours: 0.5, amount: 75 },
      { task: 'Concierge requests', hours: 0.75, amount: 112.50 },
      { task: 'Touring coordination', hours: 0.5, amount: 75 },
      { task: 'Admin follow-up', hours: 0.25, amount: 37.50 },
      { task: 'Welcome docs prep', hours: 1.2, amount: 180 },
      { task: 'Vendor confirm calls', hours: 1.0, amount: 150 },
    ],
  },
  {
    name: 'Diaz',
    monthlyAmount: 800,
    rate: 150,
    entries: [
      { task: 'Flight check', hours: 0.15, amount: 22.50 },
      { task: 'Hotel confirmation', hours: 0.15, amount: 22.50 },
      { task: 'Transfer coordination', hours: 0.5, amount: 75 },
      { task: 'Concierge dining', hours: 0.35, amount: 52.50 },
      { task: 'Itinerary review', hours: 1.0, amount: 150 },
    ],
  },
  {
    name: 'Hastings',
    monthlyAmount: 1200,
    rate: 150,
    entries: [
      { task: 'DMC coordination', hours: 2.0, amount: 300 },
      { task: 'Insurance quote', hours: 0.5, amount: 75 },
      { task: 'Flight rebooking', hours: 1.4, amount: 210 },
      { task: 'Lodge confirmation', hours: 0.5, amount: 75 },
      { task: 'Transfer logistics', hours: 1.0, amount: 150 },
      { task: 'Visa documentation', hours: 1.0, amount: 150 },
    ],
  },
];

interface Invoice {
  id: string;
  client: string;
  description: string;
  amount: string;
  status: InvoiceStatus;
  date: string;
}

const invoices: Invoice[] = [
  { id: 'INV-2026-041', client: 'Holland', description: 'Retainer Summary — June', amount: '$1,500', status: 'Paid', date: 'Jun 1' },
  { id: 'INV-2026-038', client: 'Diaz', description: 'Retainer Summary — June', amount: '$800', status: 'Sent', date: 'Jun 1' },
  { id: 'INV-2026-035', client: 'Hastings', description: 'Retainer Summary — June', amount: '$1,200', status: 'Paid', date: 'Jun 1' },
  { id: 'INV-2026-032', client: 'Baker', description: 'Hourly Billing — May', amount: '$480', status: 'Overdue', date: 'May 28' },
  { id: 'INV-2026-029', client: 'Stern/Gross', description: 'Trip Planning — Custom', amount: '$750', status: 'Draft', date: 'Jun 18' },
];

/* ─── Helpers ─── */

const statusBadge: Record<TimeStatus, { cls: string; label: string }> = {
  Unbilled: { cls: 'b-og', label: 'Unbilled' },
  Logged: { cls: 'b-em', label: 'Logged' },
  Invoiced: { cls: 'b-sa', label: 'Invoiced' },
  Retainer: { cls: 'b-mu', label: 'Retainer' },
};

const invoiceBadge: Record<InvoiceStatus, string> = {
  Paid: 'b-em',
  Sent: 'b-sa',
  Draft: 'b-ch',
  Overdue: 'b-rb',
};

function fmt(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function fmtHrs(n: number): string {
  return n % 1 === 0 ? `${n}h` : `${n.toFixed(2).replace(/0$/, '')}h`;
}

function progressColor(pct: number): string {
  if (pct > 85) return 'var(--ruby-lt)';
  if (pct > 60) return 'var(--cognac-lt)';
  return 'var(--emerald-lt)';
}

function progressBg(pct: number): string {
  if (pct > 85) return 'rgba(155,58,58,0.18)';
  if (pct > 60) return 'rgba(181,96,30,0.15)';
  return 'rgba(61,139,110,0.15)';
}

/* ─── Styles ─── */

const label: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  color: 'var(--slate)',
  marginBottom: 6,
};

const tabBase: React.CSSProperties = {
  padding: '10px 22px',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: 0.8,
  textTransform: 'uppercase',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  color: 'var(--slate)',
  borderBottom: '2px solid transparent',
  fontFamily: 'Jost',
  transition: 'all 0.15s',
};

const tabActive: React.CSSProperties = {
  ...tabBase,
  color: 'var(--champagne)',
  borderBottomColor: 'var(--champagne)',
};

const statBox: React.CSSProperties = {
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '14px 18px',
  flex: 1,
  minWidth: 140,
};

/* ─── Component ─── */

type Tab = 'time' | 'retainers' | 'invoicing';

export default function TimeRetainers() {
  const [activeTab, setActiveTab] = useState<Tab>('time');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedRetainer, setExpandedRetainer] = useState<string | null>('Holland');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const durationDefault = categories.find(c => c.label === selectedCategory)?.defaultTime || '';

  /* Summary stats */
  const totalHours = timeLog.reduce((s, e) => s + e.hours, 0);
  const revenueBilled = timeLog.filter(e => e.status === 'Invoiced' || e.status === 'Retainer').reduce((s, e) => s + parseFloat(e.amount.replace('$', '').replace(',', '')), 0);
  const retainerRevenue = retainerClients.reduce((s, r) => s + r.monthlyAmount, 0);
  const unbilledHours = timeLog.filter(e => e.status === 'Unbilled' || e.status === 'Logged').reduce((s, e) => s + e.hours, 0);
  const outstandingInvoices = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue' || i.status === 'Draft').length;

  /* Filtered time log */
  const filteredLog = timeLog.filter(e => {
    if (filterClient && e.client !== filterClient) return false;
    if (filterCategory && e.category !== filterCategory) return false;
    if (filterStatus && e.status !== filterStatus) return false;
    return true;
  });

  const clients = [...new Set(timeLog.map(e => e.client))];
  const cats = [...new Set(timeLog.map(e => e.category))];

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Time & Retainers</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>June 2026</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Hours (June)', value: fmtHrs(totalHours), color: 'var(--ivory)' },
          { label: 'Revenue Billed', value: fmt(revenueBilled), color: 'var(--champagne)' },
          { label: 'Retainer Revenue', value: fmt(retainerRevenue), color: 'var(--champagne)' },
          { label: 'Unbilled Hours', value: fmtHrs(unbilledHours), color: 'var(--cognac-lt)' },
          { label: 'Outstanding Invoices', value: String(outstandingInvoices), color: 'var(--ruby-lt)' },
        ].map((s, i) => (
          <div key={i} style={statBox}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>{s.label}</div>
            <div className="playfair" style={{ fontSize: 20, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {([
          ['time', 'Time Log'],
          ['retainers', 'Retainer Balances'],
          ['invoicing', 'Invoicing'],
        ] as [Tab, string][]).map(([key, lbl]) => (
          <button key={key} style={activeTab === key ? tabActive : tabBase} onClick={() => setActiveTab(key)}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ─── TIME LOG TAB ─── */}
      {activeTab === 'time' && (
        <>
          {/* Time Entry Form */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
              {[
                {
                  label: 'Description',
                  el: <input className="td-input" defaultValue="Insurance quote follow-up" placeholder="What did you work on?" />,
                },
                {
                  label: 'Client',
                  el: (
                    <select className="td-input">
                      <option>Holland</option>
                      <option>Diaz</option>
                      <option>Baker</option>
                      <option>Hastings</option>
                      <option>McGarey</option>
                      <option>Stern/Gross</option>
                    </select>
                  ),
                },
                {
                  label: 'Category',
                  el: (
                    <select className="td-input" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                      <option value="">-- Select category --</option>
                      {categories.map(c => (
                        <option key={c.label} value={c.label}>
                          {c.label}{c.defaultTime ? ` (${c.defaultTime})` : ''}
                        </option>
                      ))}
                    </select>
                  ),
                },
                {
                  label: 'Duration',
                  el: (
                    <input
                      className="td-input"
                      key={selectedCategory}
                      defaultValue={durationDefault}
                      placeholder={durationDefault ? durationDefault : 'Enter time'}
                    />
                  ),
                },
                {
                  label: 'Billable',
                  el: (
                    <select className="td-input">
                      <option>Billable</option>
                      <option>Retainer (covered)</option>
                      <option>Non-billable</option>
                    </select>
                  ),
                },
              ].map((f, i) => (
                <div key={i}>
                  <div style={label}>{f.label}</div>
                  {f.el}
                </div>
              ))}
              <button className="btn btn-champ" style={{ whiteSpace: 'nowrap', marginTop: 22 }}>+ Log</button>
            </div>

            {/* Tag to Task */}
            <div style={{ borderTop: '1px solid var(--border2)', marginTop: 14, paddingTop: 14 }}>
              <div style={label}>Tag to Task (optional)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <select className="td-input" style={{ maxWidth: 280, background: 'var(--bg4)' }}>
                  <option>-- Select task --</option>
                  <option>Insurance quote follow-up -- Capri</option>
                  <option>Flight check -- DC Business</option>
                  <option>DMC coordination -- Kenya Safari</option>
                  <option>AXUS Review -- Capri</option>
                  <option>Welcome Home prep -- Scotland</option>
                </select>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'var(--champ-dim)',
                    border: '1px solid rgba(212,175,106,0.2)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 10,
                    color: 'var(--champagne)',
                  }}
                >
                  Insurance quote follow-up -- Capri{' '}
                  <span style={{ cursor: 'pointer', opacity: 0.6, fontSize: 12 }}>x</span>
                </span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginRight: 4 }}>Filter:</div>
            <select className="td-input" style={{ width: 140 }} value={filterClient} onChange={e => setFilterClient(e.target.value)}>
              <option value="">All Clients</option>
              {clients.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="td-input" style={{ width: 150 }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="td-input" style={{ width: 130 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Unbilled">Unbilled</option>
              <option value="Logged">Logged</option>
              <option value="Invoiced">Invoiced</option>
              <option value="Retainer">Retainer</option>
            </select>
            {(filterClient || filterCategory || filterStatus) && (
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => { setFilterClient(''); setFilterCategory(''); setFilterStatus(''); }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Time Log Table */}
          <div className="card">
            <div className="card-h">
              <span className="card-t">Time Log -- June 2026</span>
              <span style={{ fontSize: 10, color: 'var(--slate)' }}>{filteredLog.length} entries</span>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  {['Client', 'Trip', 'Task', 'Category', 'Hours', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLog.map((t, i) => {
                  const sb = statusBadge[t.status];
                  return (
                    <tr key={i}>
                      <td className="td-main">{t.client}</td>
                      <td>{t.trip}</td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            background: 'var(--champ-dim)',
                            border: '1px solid rgba(212,175,106,0.2)',
                            borderRadius: 6,
                            padding: '2px 7px',
                            fontSize: 9,
                            color: 'var(--champagne)',
                          }}
                        >
                          {t.task}
                        </span>
                      </td>
                      <td style={{ fontSize: 10, color: 'var(--slate)' }}>{t.category}</td>
                      <td>{fmtHrs(t.hours)}</td>
                      <td style={{ color: t.status === 'Retainer' ? 'var(--slate)' : 'var(--champagne)' }}>{t.amount}</td>
                      <td><span className={`badge ${sb.cls}`}>{sb.label}</span></td>
                      <td style={{ fontSize: 10, color: 'var(--slate)' }}>{t.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ─── RETAINER BALANCES TAB ─── */}
      {activeTab === 'retainers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {retainerClients.map(rc => {
            const usedAmount = rc.entries.reduce((s, e) => s + e.amount, 0);
            const usedHours = rc.entries.reduce((s, e) => s + e.hours, 0);
            const remaining = Math.max(0, rc.monthlyAmount - usedAmount);
            const overage = usedAmount > rc.monthlyAmount ? usedAmount - rc.monthlyAmount : 0;
            const pct = Math.min(100, (usedAmount / rc.monthlyAmount) * 100);
            const isExpanded = expandedRetainer === rc.name;

            return (
              <div key={rc.name} className="card">
                <div className="card-h" style={{ cursor: 'pointer' }} onClick={() => setExpandedRetainer(isExpanded ? null : rc.name)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="td-main" style={{ fontSize: 14, fontWeight: 400 }}>{rc.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--slate)' }}>{fmt(rc.monthlyAmount)}/month</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 11, color: progressColor(pct) }}>{pct.toFixed(0)}% used</span>
                    <span style={{ fontSize: 16, color: 'var(--slate)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                      v
                    </span>
                  </div>
                </div>

                <div className="card-b">
                  {/* Progress bar */}
                  <div style={{ background: progressBg(pct), borderRadius: 6, height: 8, marginBottom: 16, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        height: 8,
                        borderRadius: 6,
                        background: progressColor(pct),
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>

                  {/* Summary row */}
                  <div style={{ display: 'flex', gap: 24, marginBottom: isExpanded ? 16 : 0, flexWrap: 'wrap' }}>
                    <div>
                      <div style={label}>Used this month</div>
                      <div style={{ fontSize: 14, color: 'var(--ivory)' }}>
                        {fmt(usedAmount)} <span style={{ fontSize: 11, color: 'var(--slate)' }}>({fmtHrs(usedHours)})</span>
                      </div>
                    </div>
                    <div>
                      <div style={label}>Remaining</div>
                      <div style={{ fontSize: 14, color: remaining > 0 ? 'var(--emerald-lt)' : 'var(--ruby-lt)' }}>
                        {fmt(remaining)}
                      </div>
                    </div>
                    {overage > 0 && (
                      <div>
                        <div style={label}>Overage</div>
                        <div style={{ fontSize: 14, color: 'var(--ruby-lt)' }}>{fmt(overage)}</div>
                      </div>
                    )}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm">View History</button>
                      <button className="btn btn-ghost btn-sm">Send Summary</button>
                    </div>
                  </div>

                  {/* Expanded line items */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--border2)', paddingTop: 12 }}>
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>Task</th>
                            <th>Hours</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rc.entries.map((e, idx) => (
                            <tr key={idx}>
                              <td className="td-main">{e.task}</td>
                              <td>{fmtHrs(e.hours)}</td>
                              <td className="td-gold">{fmt(e.amount)}</td>
                            </tr>
                          ))}
                          <tr>
                            <td style={{ fontWeight: 500, color: 'var(--ivory)' }}>Total</td>
                            <td style={{ fontWeight: 500, color: 'var(--ivory)' }}>{fmtHrs(usedHours)}</td>
                            <td style={{ fontWeight: 500, color: 'var(--champagne)' }}>{fmt(usedAmount)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── INVOICING TAB ─── */}
      {activeTab === 'invoicing' && (
        <>
          {/* Action bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--slate)' }}>{invoices.length} invoices</div>
            <button className="btn btn-champ" onClick={() => setShowInvoiceForm(!showInvoiceForm)}>
              {showInvoiceForm ? 'Cancel' : '+ Create Invoice'}
            </button>
          </div>

          {/* Create Invoice Form */}
          {showInvoiceForm && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-h">
                <span className="card-t">New Invoice</span>
              </div>
              <div className="card-b">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
                  <div>
                    <div style={label}>Client</div>
                    <select className="td-input">
                      <option>-- Select client --</option>
                      <option>Holland</option>
                      <option>Diaz</option>
                      <option>Hastings</option>
                      <option>Baker</option>
                      <option>McGarey</option>
                      <option>Stern/Gross</option>
                    </select>
                  </div>
                  <div>
                    <div style={label}>Invoice Type</div>
                    <select className="td-input">
                      <option>Retainer Summary</option>
                      <option>Hourly Billing</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div>
                    <div style={label}>Period</div>
                    <select className="td-input">
                      <option>June 2026</option>
                      <option>May 2026</option>
                      <option>April 2026</option>
                      <option>Custom Range</option>
                    </select>
                  </div>
                </div>

                {/* Line items */}
                <div style={{ marginBottom: 16 }}>
                  <div style={label}>Line Items</div>
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                    {[
                      { desc: 'Monthly retainer -- June 2026', qty: '1', rate: '$1,500.00', total: '$1,500.00' },
                    ].map((li, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '3fr 1fr 1fr 1fr auto',
                          gap: 10,
                          padding: '10px 12px',
                          borderBottom: '1px solid var(--border2)',
                          alignItems: 'center',
                        }}
                      >
                        <input className="td-input" defaultValue={li.desc} />
                        <input className="td-input" defaultValue={li.qty} style={{ textAlign: 'center' }} />
                        <input className="td-input" defaultValue={li.rate} style={{ textAlign: 'right' }} />
                        <div style={{ fontSize: 12, color: 'var(--champagne)', textAlign: 'right' }}>{li.total}</div>
                        <span style={{ cursor: 'pointer', color: 'var(--slate)', fontSize: 14, padding: '0 4px' }}>x</span>
                      </div>
                    ))}
                    <div style={{ padding: '8px 12px' }}>
                      <button className="btn btn-ghost btn-xs">+ Add Line Item</button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                  <div>
                    <div style={label}>Notes</div>
                    <textarea
                      className="td-input"
                      rows={3}
                      style={{ resize: 'vertical' }}
                      defaultValue="Thank you for your continued partnership."
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border2)' }}>
                      <span style={{ fontSize: 11, color: 'var(--slate)' }}>Subtotal</span>
                      <span style={{ fontSize: 12, color: 'var(--ivory)' }}>$1,500.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                      <span style={{ fontSize: 13, color: 'var(--ivory)', fontWeight: 500 }}>Total</span>
                      <span className="playfair" style={{ fontSize: 20, color: 'var(--champagne)' }}>$1,500.00</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button className="btn btn-champ" style={{ flex: 1 }}>Save as Draft</button>
                      <button className="btn btn-ghost" style={{ flex: 1 }}>Send Invoice</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoice List */}
          <div className="card">
            <div className="card-h">
              <span className="card-t">Invoices</span>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  {['Invoice', 'Client', 'Description', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={i}>
                    <td className="td-main" style={{ fontFamily: 'monospace', fontSize: 11 }}>{inv.id}</td>
                    <td className="td-main">{inv.client}</td>
                    <td>{inv.description}</td>
                    <td className="td-gold">{inv.amount}</td>
                    <td>
                      <span className={`badge ${invoiceBadge[inv.status]}`}>{inv.status}</span>
                    </td>
                    <td style={{ fontSize: 10, color: 'var(--slate)' }}>{inv.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Templates */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 10 }}>Invoice Templates</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { title: 'Retainer Summary', desc: 'Monthly retainer breakdown with hours used, remaining balance, and line-item detail.', badge: 'b-em' },
                { title: 'Hourly Billing', desc: 'Time-based invoice grouped by task and category with hourly rates applied.', badge: 'b-sa' },
                { title: 'Custom', desc: 'Blank invoice template for one-off projects, trip planning fees, or special billing.', badge: 'b-ch' },
              ].map((t, i) => (
                <div key={i} className="card" style={{ flex: 1, cursor: 'pointer' }}>
                  <div className="card-b" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 400 }}>{t.title}</span>
                      <span className={`badge ${t.badge}`}>Template</span>
                    </div>
                    <p style={{ fontSize: 10, color: 'var(--slate)', lineHeight: 1.5 }}>{t.desc}</p>
                    <button className="btn btn-ghost btn-xs" style={{ alignSelf: 'flex-start', marginTop: 4 }}>Use Template</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
