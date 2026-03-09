import { useState } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Dashboard from './screens/Dashboard';
import BoardCalendar from './screens/BoardCalendar';
import Tasks from './screens/Tasks';
import Clients from './screens/Clients';
import Trips from './screens/Trips';
import Invoicing from './screens/Invoicing';
import TimeRetainers from './screens/TimeRetainers';
import ClientPortal from './screens/ClientPortal';
import Admin from './screens/Admin';

const screens: Record<string, React.FC> = {
  dashboard: Dashboard,
  clients: Clients,
  trips: Trips,
  board: BoardCalendar,
  tasks: Tasks,
  time: TimeRetainers,
  invoicing: Invoicing,
  portal: ClientPortal,
  admin: Admin,
};

const pageTabs: Record<string, string[]> = {
  dashboard: ['Overview', 'Chen · Dubrovnik', 'Harrington · Maldives'],
};

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [activeTab, setActiveTab] = useState(0);
  const Screen = screens[active] || Dashboard;
  const tabs = pageTabs[active] || [];

  return (
    <>
      <Topbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar active={active} onNav={(id) => { setActive(id); setActiveTab(0); }} />
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {tabs.length > 0 && (
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px', background: 'var(--bg2)', flexShrink: 0 }}>
              {tabs.map((t, i) => (
                <div key={i} onClick={() => setActiveTab(i)} style={{
                  padding: '15px 18px', fontSize: 11, fontWeight: 400, letterSpacing: 0.8, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
                  color: activeTab === i ? 'var(--champagne)' : 'var(--slate)',
                  borderBottom: activeTab === i ? '2px solid var(--champagne)' : '2px solid transparent',
                }}>{t}</div>
              ))}
            </div>
          )}
          <Screen />
        </div>
      </div>
    </>
  );
}
