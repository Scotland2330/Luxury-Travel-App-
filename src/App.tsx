import { useState } from 'react';
import { AgencyProvider } from './AgencyContext';
import { ThemeProvider } from './ThemeContext';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Dashboard from './screens/Dashboard';
import TripRequests from './screens/TripRequests';
import MasterTripBoard from './screens/MasterTripBoard';
import Calendar from './screens/BoardCalendar';
import Tasks from './screens/Tasks';
import TimeRetainers from './screens/TimeRetainers';
import Commissions from './screens/Commissions';
import ClientFeedback from './screens/ClientFeedback';
import ClientPortal from './screens/ClientPortal';
import TemplatesHub from './screens/TemplatesHub';
import Admin from './screens/Admin';
import Platform from './screens/Platform';
import Reports from './screens/Reports';
import ItineraryBuilder from './screens/ItineraryBuilder';

const screens: Record<string, React.FC<{ onNav?: (id: string) => void }>> = {
  dashboard: Dashboard,
  requests: TripRequests,
  master: MasterTripBoard,
  calendar: Calendar,
  tasks: Tasks,
  time: TimeRetainers,
  commissions: Commissions,
  feedback: ClientFeedback,
  portal: ClientPortal,
  templates: TemplatesHub,
  admin: Admin,
  platform: Platform,
  reports: Reports,
  itinerary: ItineraryBuilder,
};

const pageTabs: Record<string, string[]> = {};

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [activeTab, setActiveTab] = useState(0);
  const Screen = screens[active] || Dashboard;
  const tabs = pageTabs[active] || [];

  return (
    <ThemeProvider>
      <AgencyProvider>
        <Topbar onNav={(id) => { setActive(id); setActiveTab(0); }} />
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
            <Screen onNav={(id) => { setActive(id); setActiveTab(0); }} />
          </div>
        </div>
      </AgencyProvider>
    </ThemeProvider>
  );
}
