import { createContext, useContext, useState } from 'react';

export type Agency = {
  id: string;
  name: string;
  advisor: string;
  initials: string;
  accent: string;
  accentLt: string;
  accentDim: string;
  accentGlow: string;
  gradientFrom: string;
  gradientTo: string;
  avatarBg: string;
  tagline: string;
  plan: string;
};

export const agencies: Agency[] = [
  {
    id: 'meridian',
    name: 'Meridian Travel Group',
    advisor: 'Halie',
    initials: 'HM',
    accent: '#d4af6a',
    accentLt: '#e8c98a',
    accentDim: 'rgba(212,175,106,0.08)',
    accentGlow: 'rgba(212,175,106,0.04)',
    gradientFrom: '#3a2a10',
    gradientTo: '#6a4a1a',
    avatarBg: 'linear-gradient(135deg,#3a2a10,#6a4a1a)',
    tagline: 'Luxury Travel Operations',
    plan: 'owner',
  },
  {
    id: 'wanderlust',
    name: 'Wanderlust Luxury Travel',
    advisor: 'Sophie',
    initials: 'SB',
    accent: '#6abed4',
    accentLt: '#8ad4e8',
    accentDim: 'rgba(106,190,212,0.08)',
    accentGlow: 'rgba(106,190,212,0.04)',
    gradientFrom: '#102a3a',
    gradientTo: '#1a4a6a',
    avatarBg: 'linear-gradient(135deg,#102a3a,#1a4a6a)',
    tagline: 'Curated Journeys Worldwide',
    plan: 'professional',
  },
  {
    id: 'atlas',
    name: 'Atlas & Compass Travel',
    advisor: 'Rachel',
    initials: 'RK',
    accent: '#b48ad4',
    accentLt: '#caa8e8',
    accentDim: 'rgba(180,138,212,0.08)',
    accentGlow: 'rgba(180,138,212,0.04)',
    gradientFrom: '#2a1040',
    gradientTo: '#4a1a6a',
    avatarBg: 'linear-gradient(135deg,#2a1040,#4a1a6a)',
    tagline: 'Adventure Meets Elegance',
    plan: 'professional',
  },
];

type AgencyCtx = {
  agency: Agency;
  setAgency: (id: string) => void;
  showSwitcher: boolean;
  setShowSwitcher: (v: boolean) => void;
};

const Ctx = createContext<AgencyCtx>({
  agency: agencies[0],
  setAgency: () => {},
  showSwitcher: false,
  setShowSwitcher: () => {},
});

export function AgencyProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState(agencies[0]);
  const [showSwitcher, setShowSwitcher] = useState(false);

  const setAgency = (id: string) => {
    const a = agencies.find(a => a.id === id);
    if (a) {
      setCurrent(a);
      document.documentElement.style.setProperty('--champagne', a.accent);
      document.documentElement.style.setProperty('--champ-lt', a.accentLt);
      document.documentElement.style.setProperty('--champ-dim', a.accentDim);
      document.documentElement.style.setProperty('--champ-glow', a.accentGlow);
    }
  };

  return <Ctx.Provider value={{ agency: current, setAgency, showSwitcher, setShowSwitcher }}>{children}</Ctx.Provider>;
}

export const useAgency = () => useContext(Ctx);
