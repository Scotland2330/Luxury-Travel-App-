import { useState } from 'react';

const subscribedAgents = [
  {
    name: 'Wanderlust Luxury Travel', advisor: 'Sophie Blake', initials: 'SB', accent: '#6abed4',
    gradientFrom: '#102a3a', gradientTo: '#1a4a6a', plan: 'Professional', status: 'Active',
    joined: 'Jun 10, 2026', trips: 8, mrr: '$297', lastActive: '2 hours ago',
    workspace: {
      activeTrips: [
        { client: 'Pemberton Family', dest: 'Amalfi Coast', dates: 'Jul 18–28', stage: 'Finalizing', budget: '$24,500' },
        { client: 'Dr. & Mrs. Okafor', dest: 'Maldives', dates: 'Aug 3–12', stage: 'Booking', budget: '$32,000' },
        { client: 'Chen Wedding Party', dest: 'Bali', dates: 'Sep 14–22', stage: 'Planning', budget: '$58,000' },
        { client: 'Martinez Anniversary', dest: 'Paris & Provence', dates: 'Aug 20–30', stage: 'Confirmed', budget: '$18,600' },
      ],
      revenue: { thisMonth: '$8,420', lastMonth: '$6,100', ytd: '$42,800', outstanding: '$12,500' },
      automations: 12,
      templates: 8,
      clientPortals: 6,
    },
  },
  {
    name: 'Atlas & Compass Travel', advisor: 'Rachel Kim', initials: 'RK', accent: '#b48ad4',
    gradientFrom: '#2a1040', gradientTo: '#4a1a6a', plan: 'Professional', status: 'Active',
    joined: 'Jun 14, 2026', trips: 5, mrr: '$297', lastActive: '4 hours ago',
    workspace: {
      activeTrips: [
        { client: 'Whitfield Family', dest: 'Iceland', dates: 'Jul 22–Aug 1', stage: 'Confirmed', budget: '$19,800' },
        { client: 'Johnson Retreat', dest: 'Costa Rica', dates: 'Aug 8–15', stage: 'Booking', budget: '$14,200' },
        { client: 'Park & Lee', dest: 'Japan', dates: 'Sep 1–14', stage: 'Planning', budget: '$26,400' },
      ],
      revenue: { thisMonth: '$5,200', lastMonth: '$4,800', ytd: '$28,600', outstanding: '$8,400' },
      automations: 9,
      templates: 6,
      clientPortals: 4,
    },
  },
  {
    name: 'Luxe Getaways Co.', advisor: 'Mariana Torres', initials: 'MT', accent: '#d4836a',
    gradientFrom: '#3a1a10', gradientTo: '#6a3a1a', plan: 'Professional', status: 'Active',
    joined: 'Jun 18, 2026', trips: 3, mrr: '$297', lastActive: 'Today',
    workspace: {
      activeTrips: [
        { client: 'Alvarez Honeymoon', dest: 'Santorini', dates: 'Aug 1–10', stage: 'Finalizing', budget: '$15,800' },
        { client: 'Rivera Family', dest: 'Cancún', dates: 'Jul 25–31', stage: 'Confirmed', budget: '$9,200' },
      ],
      revenue: { thisMonth: '$3,800', lastMonth: '$2,900', ytd: '$18,400', outstanding: '$4,200' },
      automations: 5,
      templates: 4,
      clientPortals: 3,
    },
  },
  {
    name: 'Golden Hour Travels', advisor: 'Claire Donovan', initials: 'CD', accent: '#b8d46a',
    gradientFrom: '#1a2a10', gradientTo: '#3a4a1a', plan: 'Starter', status: 'Active',
    joined: 'Jun 19, 2026', trips: 1, mrr: '$197', lastActive: 'Today',
    workspace: {
      activeTrips: [
        { client: 'Donovan Anniversary', dest: 'Napa Valley', dates: 'Aug 15–19', stage: 'Planning', budget: '$6,800' },
      ],
      revenue: { thisMonth: '$1,200', lastMonth: '$0', ytd: '$1,200', outstanding: '$0' },
      automations: 3,
      templates: 2,
      clientPortals: 1,
    },
  },
  {
    name: 'Refined Routes', advisor: 'Jessica Park', initials: 'JP', accent: '#d46a9a',
    gradientFrom: '#3a1028', gradientTo: '#6a1a4a', plan: 'Professional', status: 'Trial',
    joined: 'Jun 20, 2026', trips: 0, mrr: '$0', lastActive: 'Just now',
    workspace: {
      activeTrips: [],
      revenue: { thisMonth: '$0', lastMonth: '$0', ytd: '$0', outstanding: '$0' },
      automations: 0,
      templates: 0,
      clientPortals: 0,
    },
  },
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

function MirrorOverlay({ agent, onClose }: { agent: typeof subscribedAgents[0]; onClose: () => void }) {
  const [mirrorTab, setMirrorTab] = useState(0);
  const mirrorTabs = ['Dashboard', 'Trip Board', 'Clients', 'Settings'];
  const w = agent.workspace;
  const stageColor = (s: string) =>
    s === 'Confirmed' ? 'b-em' : s === 'Finalizing' ? 'b-sa' : s === 'Booking' ? 'b-og' : 'b-mu';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'stretch', justifyContent: 'center',
      padding: 24,
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: 1100, background: 'var(--bg)',
        border: `2px solid ${agent.accent}40`, borderRadius: 16,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }} onClick={(e) => e.stopPropagation()}>

        {/* Mirror header bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 24px',
          background: `linear-gradient(135deg, ${agent.gradientFrom}, ${agent.gradientTo})`,
          borderBottom: `1px solid ${agent.accent}30`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${agent.gradientFrom}, ${agent.gradientTo})`,
              border: `2px solid ${agent.accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: agent.accent, letterSpacing: 1,
            }}>{agent.initials}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{agent.name}</div>
              <div style={{ fontSize: 10, color: `${agent.accent}cc` }}>{agent.advisor} · {agent.plan} Plan</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="badge b-og" style={{ fontSize: 8, padding: '3px 10px' }}>MIRROR MODE</span>
            <span className="badge b-em" style={{ fontSize: 8, padding: '3px 10px' }}>READ ONLY</span>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>
          </div>
        </div>

        {/* Mirror nav tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
          {mirrorTabs.map((t, i) => (
            <div key={i} onClick={() => setMirrorTab(i)} style={{
              padding: '10px 18px', fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.15s',
              color: mirrorTab === i ? agent.accent : 'var(--slate)',
              borderBottom: mirrorTab === i ? `2px solid ${agent.accent}` : '2px solid transparent',
            }}>{t}</div>
          ))}
        </div>

        {/* Mirror body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* Dashboard tab */}
          {mirrorTab === 0 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Active Trips', value: String(w.activeTrips.length), color: 'var(--emerald-lt)' },
                  { label: 'This Month', value: w.revenue.thisMonth, color: 'var(--champagne)' },
                  { label: 'Automations', value: String(w.automations), color: 'var(--sapphire-lt)' },
                  { label: 'Client Portals', value: String(w.clientPortals), color: agent.accent },
                ].map((k, i) => (
                  <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8 }}>{k.label}</div>
                    <div className="playfair" style={{ fontSize: 26, color: k.color, lineHeight: 1 }}>{k.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div className="card">
                  <div className="card-h"><span className="card-t">Active Trips</span></div>
                  {w.activeTrips.length === 0 ? (
                    <div className="card-b" style={{ padding: 24, textAlign: 'center' }}>
                      <div style={{ fontSize: 12, color: 'var(--slate)' }}>No active trips yet</div>
                      <div style={{ fontSize: 10, color: 'var(--slate-dim)', marginTop: 4 }}>This agent is on a trial — no trips created</div>
                    </div>
                  ) : (
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>Client</th><th>Destination</th><th>Dates</th><th>Stage</th><th>Budget</th>
                        </tr>
                      </thead>
                      <tbody>
                        {w.activeTrips.map((t, i) => (
                          <tr key={i}>
                            <td className="td-main" style={{ fontSize: 11 }}>{t.client}</td>
                            <td style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>{t.dest}</td>
                            <td style={{ fontSize: 10, color: 'var(--slate)' }}>{t.dates}</td>
                            <td><span className={`badge ${stageColor(t.stage)}`}>{t.stage}</span></td>
                            <td className="td-gold" style={{ fontSize: 11 }}>{t.budget}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="card">
                  <div className="card-h"><span className="card-t">Revenue</span></div>
                  <div className="card-b" style={{ padding: 16 }}>
                    {[
                      { label: 'This Month', value: w.revenue.thisMonth },
                      { label: 'Last Month', value: w.revenue.lastMonth },
                      { label: 'Year to Date', value: w.revenue.ytd },
                      { label: 'Outstanding', value: w.revenue.outstanding },
                    ].map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--border2)' : 'none' }}>
                        <span style={{ fontSize: 10, color: 'var(--slate)' }}>{r.label}</span>
                        <span className="playfair" style={{ fontSize: 14, color: 'var(--champagne)' }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 16 }}>
                {[
                  { label: 'Templates', value: w.templates, icon: '◩' },
                  { label: 'Automation Rules', value: w.automations, icon: '⚡' },
                  { label: 'Active Portals', value: w.clientPortals, icon: '◆' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
                    padding: 16, display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, background: 'var(--bg3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, color: agent.accent,
                    }}>{item.icon}</div>
                    <div>
                      <div className="playfair" style={{ fontSize: 20, color: 'var(--ivory)' }}>{item.value}</div>
                      <div style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase' }}>{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Trip Board tab */}
          {mirrorTab === 1 && (
            <>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 16 }}>
                {agent.name} — Trip Pipeline
              </div>
              {w.activeTrips.length === 0 ? (
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--slate)' }}>No trips in pipeline</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                  {['Planning', 'Booking', 'Finalizing', 'Confirmed'].map(stage => (
                    <div key={stage}>
                      <div style={{
                        fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)',
                        marginBottom: 10, padding: '6px 10px', background: 'var(--bg2)', borderRadius: 6,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        {stage}
                        <span className={`badge ${stageColor(stage)}`} style={{ fontSize: 7 }}>
                          {w.activeTrips.filter(t => t.stage === stage).length}
                        </span>
                      </div>
                      {w.activeTrips.filter(t => t.stage === stage).map((trip, j) => (
                        <div key={j} style={{
                          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
                          padding: 14, marginBottom: 8,
                        }}>
                          <div style={{ fontSize: 12, color: 'var(--ivory)', marginBottom: 4, fontWeight: 500 }}>{trip.client}</div>
                          <div style={{ fontSize: 10, color: 'var(--slate)', marginBottom: 6 }}>{trip.dest}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 9, color: 'var(--slate-dim)' }}>{trip.dates}</span>
                            <span style={{ fontSize: 10, color: 'var(--champagne)', fontWeight: 500 }}>{trip.budget}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Clients tab */}
          {mirrorTab === 2 && (
            <>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 16 }}>
                {agent.name} — Client Roster
              </div>
              {w.activeTrips.length === 0 ? (
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--slate)' }}>No clients yet</div>
                </div>
              ) : (
                <div className="card">
                  <table className="tbl">
                    <thead>
                      <tr><th>Client</th><th>Trip</th><th>Stage</th><th>Budget</th><th>Portal</th></tr>
                    </thead>
                    <tbody>
                      {w.activeTrips.map((t, i) => (
                        <tr key={i}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 28, height: 28, borderRadius: '50%',
                                background: `linear-gradient(135deg, ${agent.gradientFrom}, ${agent.gradientTo})`,
                                border: `1px solid ${agent.accent}40`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 9, fontWeight: 600, color: agent.accent,
                              }}>{t.client.split(' ')[0][0]}{t.client.split(' ')[1]?.[0] || ''}</div>
                              <span className="td-main" style={{ fontSize: 11 }}>{t.client}</span>
                            </div>
                          </td>
                          <td style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>{t.dest}</td>
                          <td><span className={`badge ${stageColor(t.stage)}`}>{t.stage}</span></td>
                          <td className="td-gold" style={{ fontSize: 11 }}>{t.budget}</td>
                          <td><span className="badge b-em" style={{ fontSize: 7 }}>Active</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Settings tab */}
          {mirrorTab === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="card">
                <div className="card-h"><span className="card-t">Account Details</span></div>
                <div className="card-b" style={{ padding: 18 }}>
                  {[
                    { label: 'Agency Name', value: agent.name },
                    { label: 'Primary Advisor', value: agent.advisor },
                    { label: 'Plan', value: agent.plan },
                    { label: 'Status', value: agent.status },
                    { label: 'Member Since', value: agent.joined },
                    { label: 'Monthly Rate', value: agent.mrr },
                  ].map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 5 ? '1px solid var(--border2)' : 'none' }}>
                      <span style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 1 }}>{d.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--ivory)' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-h"><span className="card-t">Workspace Usage</span></div>
                <div className="card-b" style={{ padding: 18 }}>
                  {[
                    { label: 'Active Trips', value: String(w.activeTrips.length), max: agent.plan === 'Starter' ? 15 : 999 },
                    { label: 'Automation Rules', value: String(w.automations), max: agent.plan === 'Starter' ? 10 : 999 },
                    { label: 'Templates', value: String(w.templates), max: 999 },
                    { label: 'Client Portals', value: String(w.clientPortals), max: 999 },
                  ].map((u, i) => (
                    <div key={i} style={{ marginBottom: i < 3 ? 14 : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: 'var(--slate)' }}>{u.label}</span>
                        <span style={{ fontSize: 10, color: 'var(--ivory-dim)' }}>
                          {u.value}{u.max < 999 ? ` / ${u.max}` : ''}
                        </span>
                      </div>
                      {u.max < 999 && (
                        <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${Math.min((parseInt(u.value) / u.max) * 100, 100)}%`,
                            background: agent.accent, borderRadius: 2,
                          }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <div className="card-h"><span className="card-t">Brand Configuration</span></div>
                <div className="card-b" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 12,
                      background: `linear-gradient(135deg, ${agent.gradientFrom}, ${agent.gradientTo})`,
                      border: `2px solid ${agent.accent}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 700, color: agent.accent, letterSpacing: 2,
                    }}>{agent.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--ivory)', marginBottom: 4 }}>{agent.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--slate)', marginBottom: 8 }}>Whitelabel branding applied to client portal and communications</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase' }}>Accent</div>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: agent.accent, border: '2px solid var(--border)' }} />
                        <span style={{ fontSize: 10, color: 'var(--ivory-dim)' }}>{agent.accent}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Platform() {
  const [tab, setTab] = useState(0);
  const [mirrorAgent, setMirrorAgent] = useState<typeof subscribedAgents[0] | null>(null);
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
          <div className="card-h">
            <span className="card-t">Subscribed Agents</span>
            <span className="badge b-em">{subscribedAgents.length} agents</span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                {['Agency', 'Advisor', 'Plan', 'Status', 'Active Trips', 'MRR', 'Joined', ''].map(h => (
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
                  <td>
                    <button className="btn btn-ghost" style={{
                      fontSize: 9, padding: '5px 12px', borderRadius: 6, whiteSpace: 'nowrap',
                    }} onClick={() => setMirrorAgent(a)}>
                      Mirror Account
                    </button>
                  </td>
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

      {mirrorAgent && <MirrorOverlay agent={mirrorAgent} onClose={() => setMirrorAgent(null)} />}
    </div>
  );
}
