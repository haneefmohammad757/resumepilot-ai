import { useState, useEffect } from 'react';

export const COLORS = {
  // Slate/charcoal theme (recruiter-grade professional tones instead of generic tech blues)
  bgLight: 'bg-[#F9FAFB]',
  bgCardLight: 'bg-white',
  textLight: 'text-slate-900',
  textMutedLight: 'text-slate-500',
  borderLight: 'border-slate-200/80',
  
  bgDark: 'bg-[#0F1115]',
  bgCardDark: 'bg-[#161920]',
  textDark: 'text-slate-100',
  textMutedDark: 'text-slate-400',
  borderDark: 'border-slate-800',

  // Elegant emerald accents expressing career progression and growth
  emerald: 'text-emerald-500',
  emeraldBg: 'bg-emerald-500',
  emeraldBgMuted: 'bg-emerald-500/10',
  emeraldHover: 'hover:bg-emerald-600',
  emeraldBorder: 'border-emerald-500/30',

  // Premium Slate accent colors
  slateActiveBg: 'bg-slate-500/10',
  slateActiveBorder: 'border-slate-500/30',
  slateHover: 'hover:bg-slate-100 dark:hover:bg-slate-800'
};

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('saas_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // Cool, luxurious SaaS slate dark mode by default
  });

  useEffect(() => {
    localStorage.setItem('saas_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
