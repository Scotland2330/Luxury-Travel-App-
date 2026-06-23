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
    accent: '#3B9A9C',
    accentLt: '#85CDCA',
    accentDim: 'rgba(59,154,156,0.08)',
    accentGlow: 'rgba(59,154,156,0.04)',
    gradientFrom: '#1B4B5A',
    gradientTo: '#3B9A9C',
    avatarBg: 'linear-gradient(135deg,#1B4B5A,#3B9A9C)',
    tagline: 'Luxury Travel Operations',
    plan: 'owner',
  },
  {
    id: 'wanderlust',
    name: 'Wanderlust Luxury Travel',
    advisor: 'Sophie',
    initials: 'SB',
    accent: '#C27849',
    accentLt: '#E8A87C',
    accentDim: 'rgba(194,120,73,0.08)',
    accentGlow: 'rgba(194,120,73,0.04)',
    gradientFrom: '#6A3A20',
    gradientTo: '#C27849',
    avatarBg: 'linear-gradient(135deg,#6A3A20,#C27849)',
    tagline: 'Curated Journeys Worldwide',
    plan: 'professional',
  },
  {
    id: 'atlas',
    name: 'Atlas & Compass Travel',
    advisor: 'Rachel',
    initials: 'RK',
    accent: '#6B4A8B',
    accentLt: '#8B6AAB',
    accentDim: 'rgba(107,74,139,0.08)',
    accentGlow: 'rgba(107,74,139,0.04)',
    gradientFrom: '#3A2050',
    gradientTo: '#6B4A8B',
    avatarBg: 'linear-gradient(135deg,#3A2050,#6B4A8B)',
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
