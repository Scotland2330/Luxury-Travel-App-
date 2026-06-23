import { useState } from 'react';

const subscribedAgents = [
  { name: 'Wanderlust Luxury Travel', advisor: 'Sophie Blake', initials: 'SB', accent: '#6abed4', gradientFrom: '#102a3a', gradientTo: '#1a4a6a', plan: 'Professional', status: 'Active', joined: 'Jun 10, 2026', trips: 8, mrr: '$297', lastActive: '2 hours ago' },
  { name: 'Atlas & Compass Travel', advisor: 'Rachel Kim', initials: 'RK', accent: '#b48ad4', gradientFrom: '#2a1040', gradientTo: '#4a1a6a', plan: 'Professional', status: 'Active', joined: 'Jun 14, 2026', trips: 5, mrr: '$297', lastActive: '4 hours ago' },
  { name: 'Luxe Getaways Co.', advisor: 'Mariana Torres', initials: 'MT', accent: '#d4836a', gradientFrom: '#3a1a10', gradientTo: '#6a3a1a', plan: 'Professional', status: 'Active', joined: 'Jun 18, 2026', trips: 3, mrr: '$297', lastActive: 'Today' },
  { name: 'Golden Hour Travels', advisor: 'Claire Donovan', initials: 'CD', accent: '#b8d46a', gradientFrom: '#1a2a10', gradientTo: '#3a4a1a', plan: 'Starter', status: 'Active', joined: 'Jun 19, 2026', trips: 1, mrr: '$197', lastActive: 'Today' },
  { name: 'Refined Routes', advisor: 'Jessica Park', initials: 'JP', accent: '#d46a9a', gradientFrom: '#3a1028', gradientTo: '#6a1a4a', plan: 'Professional', status: 'Trial', joined: 'Jun 20, 2026', trips: 0, mrr: '$0', lastActive: 'Just now' },
];

const platformKpis = [
  { label: 'Active Agents', value: '5', sub: '1 trial · 4 paid', color: 'var(--emerald-lt)' },
  { label: 'Monthly Revenue', value: '$1,088', sub: '$297 avg per agent', color: 'var(--champagne)' },
  { label: 'Total Trips Managed', value: '29', sub: 'Across all workspaces', color: 'var(--sapphire-lt)' },
  { label: 'Platform Uptime', value: '99.9%', sub: 'Last 30 days', color: 'var(--emerald-lt)' },
];

const revenueProjection = [
  { agents: 5, monthly: '$1,088', annual: '$13,056' },
  { agents: 10, monthly: '$2,673', annual: '$32,076' },
  { agents: 25, monthly: '$7,128', annual: '$85,536' },
  { agents: 50, monthly: '$14,553', annual: '$174,636' },
];

export default function Platform() {
  const [tab, setTab] = useState(0);
  const tabs = ['Agent Workspaces', 'Revenue', 'Onboarding', 'Plans & Pricing'];

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Platform Management</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>Manage agent subscriptions, revenue, and platform settings</p>
        </div>
        <button className="btn btn-champ">+ Invite Agent</button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {platformKpis.map((k, i) => (
          <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 80, height: 80, borderRadius: '50%', background: 'var(--champ-glow)' }} />
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 12 }}>{k.label}</div>
            <div className="playfair" style={{ fontSize: 34, fontWeight: 400, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 8 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {tabs.map((t, i) => (
          <div key={i} onClick={() => setTab(i)} style={{
            padding: '12px 18px', fontSize: 11, fontWeight: 400, letterSpacing: 0.8, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
            color: tab === i ? 'var(--champagne)' : 'var(--slate)',
            borderBottom: tab === i ? '2px solid var(--champagne)' : '2px solid transparent',
          }}>{t}</div>
        ))}
      </div>

      {tab === 0 && (
        <div className="card">
          <div className="card-h"><span className="card-t">Subscribed Agents</span><span className="badge b-em">{subscribedAgents.length} agents</span></div>
          <table className="tbl">
            <thead>
              <tr>
                {['Agency', 'Advisor', 'Plan', 'Status', 'Active Trips', 'MRR', 'Joined', 'Last Active'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribedAgents.map((a, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${a.gradientFrom},${a.gradientTo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: a.accent, letterSpacing: 1, flexShrink: 0, border: `1px solid ${a.accent}40` }}>{a.initials}</div>
                      <span className="td-main" style={{ fontSize: 12 }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>{a.advisor}</td>
                  <td><span className={`badge ${a.plan === 'Professional' ? 'b-sa' : 'b-ch'}`}>{a.plan}</span></td>
                  <td><span className={`badge ${a.status === 'Active' ? 'b-em' : 'b-og'}`}>{a.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--ivory)' }}>{a.trips}</td>
                  <td className="td-gold">{a.mrr}</td>
                  <td style={{ fontSize: 10, color: 'var(--slate)' }}>{a.joined}</td>
                  <td style={{ fontSize: 10, color: 'var(--slate)' }}>{a.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-h"><span className="card-t">Revenue Summary</span></div>
            <div className="card-b" style={{ padding: 24 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Current Monthly Revenue</div>
              <div className="playfair" style={{ fontSize: 36, color: 'var(--champagne)', marginBottom: 20 }}>$1,088</div>
              <div style={{ display: 'flex', gap: 32 }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Paid Agents</div>
                  <div className="playfair" style={{ fontSize: 22, color: 'var(--emerald-lt)' }}>4</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Trial</div>
                  <div className="playfair" style={{ fontSize: 22, color: 'var(--cognac-lt)' }}>1</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Annual Run Rate</div>
                  <div className="playfair" style={{ fontSize: 22, color: 'var(--ivory)' }}>$13,056</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-h"><span className="card-t">Growth Projection</span></div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Agents</th>
                  <th>Monthly Revenue</th>
                  <th>Annual Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenueProjection.map((r, i) => (
                  <tr key={i} style={{ background: i === 0 ? 'rgba(59,154,156,0.05)' : undefined }}>
                    <td style={{ fontSize: 12, color: 'var(--ivory)' }}>{r.agents} agents</td>
                    <td className="td-gold">{r.monthly}</td>
                    <td style={{ fontSize: 12, fontWeight: 600, color: 'var(--emerald-lt)' }}>{r.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Revenue by agent */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-h"><span className="card-t">Revenue by Agent</span></div>
            <div className="card-b">
              {subscribedAgents.filter(a => a.status === 'Active' && a.mrr !== '$0').map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border2)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${a.gradientFrom},${a.gradientTo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: a.accent, letterSpacing: 1, flexShrink: 0 }}>{a.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--ivory)' }}>{a.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)' }}>{a.plan} · {a.trips} trips</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 120, height: 6, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden' }}>
                      <div style={{ width: `${a.plan === 'Professional' ? 100 : 66}%`, height: '100%', borderRadius: 3, background: a.accent }} />
                    </div>
                    <span className="playfair" style={{ fontSize: 14, color: 'var(--champagne)', minWidth: 50, textAlign: 'right' }}>{a.mrr}</span>
                    <span style={{ fontSize: 10, color: 'var(--slate)' }}>/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-h"><span className="card-t">Agent Onboarding Flow</span></div>
            <div className="card-b" style={{ padding: 20 }}>
              {['Create Account & Set Password', 'Agency Profile Setup', 'Upload Logo & Brand Colors', 'Import Existing Trips (Optional)', 'Configure Automation Rules', 'Invite Team Members', 'Go Live'].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < 6 ? '1px solid var(--border2)' : 'none' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0,
                    background: i < 5 ? 'var(--emerald)' : 'var(--bg3)',
                    color: i < 5 ? 'white' : 'var(--slate)',
                    border: i >= 5 ? '1px solid var(--border)' : 'none',
                  }}>{i < 5 ? '✓' : i + 1}</div>
                  <span style={{ fontSize: 12, color: i < 5 ? 'var(--ivory-dim)' : 'var(--ivory)', fontWeight: i >= 5 ? 500 : 400 }}>{step}</span>
                  {i === 5 && <span className="badge b-sa" style={{ marginLeft: 'auto' }}>Current Step</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-h"><span className="card-t">Pending Invitations</span></div>
            <div className="card-b">
              {[
                { name: 'Caroline West', email: 'caroline@luxevoyage.com', sent: 'Jun 19', status: 'Pending' },
                { name: 'Amanda Liu', email: 'amanda@pacifictravel.co', sent: 'Jun 18', status: 'Viewed' },
                { name: 'David Chen', email: 'david@eliteescapes.com', sent: 'Jun 15', status: 'Expired' },
              ].map((inv, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border2)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--slate)' }}>?</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--ivory)' }}>{inv.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)' }}>{inv.email} · Sent {inv.sent}</div>
                  </div>
                  <span className={`badge ${inv.status === 'Pending' ? 'b-og' : inv.status === 'Viewed' ? 'b-sa' : 'b-mu'}`}>{inv.status}</span>
                  <button className="btn btn-ghost" style={{ fontSize: 10, padding: '4px 10px' }}>Resend</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { name: 'Starter', price: '$197', features: ['Up to 15 active trips', '1 advisor seat', 'Core trip management', 'Basic automations (10 rules)', 'Email templates', 'Client portal'], accent: 'var(--slate)', popular: false },
            { name: 'Professional', price: '$297', features: ['Unlimited active trips', 'Up to 3 advisor seats', 'Full trip lifecycle management', 'Unlimited automations', 'Commission tracking', 'Time & retainer billing', 'Client feedback system', 'Templates & Knowledge Hub', 'Priority support'], accent: 'var(--champagne)', popular: true },
            { name: 'Enterprise', price: 'Custom', features: ['Everything in Professional', 'Unlimited advisor seats', 'Custom branding & domain', 'API access', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'], accent: 'var(--amethyst)', popular: false },
          ].map((plan, i) => (
            <div key={i} style={{ background: 'var(--bg2)', border: plan.popular ? `2px solid var(--champagne)` : '1px solid var(--border)', borderRadius: 14, padding: 28, position: 'relative' }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%) translateY(-50%)', background: 'var(--champagne)', color: 'var(--bg)', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '4px 14px', borderRadius: 20 }}>Most Popular</div>
              )}
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8 }}>{plan.name}</div>
              <div className="playfair" style={{ fontSize: 32, color: plan.accent, marginBottom: 4 }}>{plan.price}</div>
              {plan.price !== 'Custom' && <div style={{ fontSize: 10, color: 'var(--slate)', marginBottom: 20 }}>per month</div>}
              {plan.price === 'Custom' && <div style={{ fontSize: 10, color: 'var(--slate)', marginBottom: 20 }}>contact for pricing</div>}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 11, color: 'var(--ivory-dim)' }}>
                    <span style={{ color: 'var(--emerald-lt)', fontSize: 10 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <button className={plan.popular ? 'btn btn-champ' : 'btn btn-ghost'} style={{ width: '100%', marginTop: 20 }}>
                {plan.price === 'Custom' ? 'Contact Us' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
