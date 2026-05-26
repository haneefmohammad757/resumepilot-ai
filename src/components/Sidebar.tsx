import React, { useState } from 'react';
import { 
  BarChart3, FileText, Linkedin, Compass, AlertCircle, HelpCircle, 
  Settings, Key, FolderHeart, Zap, LogOut, Sun, Moon, Briefcase, 
  Map, Terminal, ChevronLeft, ChevronRight, Shield, Info
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: User | null;
  creditsUsed: number;
  creditsMax: number;
  scansPerformed: number;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  theme,
  toggleTheme,
  user,
  creditsUsed,
  creditsMax,
  scansPerformed,
  isOpen,
  setIsOpen
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Updated navigation menu items precisely as instructed in bullet points
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'resume', label: 'ATS Resume Analyzer', icon: FileText, badge: scansPerformed > 0 ? `${scansPerformed} scans` : undefined },
    { id: 'linkedin', label: 'LinkedIn Optimizer', icon: Linkedin },
    { id: 'bullets', label: 'Resume Bullet Generator', icon: Briefcase },
    { id: 'cover-letter', label: 'Cover Letter Generator', icon: FolderHeart },
    { id: 'projects', label: 'AI Project Generator', icon: Terminal },
    { id: 'skill-gap', label: 'Skill Gap Analyzer', icon: AlertCircle },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map },
    { id: 'interview', label: 'Interview Preparation', icon: HelpCircle },
    { id: 'saved', label: 'Saved Reports', icon: Key },
    { id: 'billing', label: 'Pricing', icon: Zap },
    ...(user?.email?.toLowerCase() === 'haneefmohammed867@gmail.com' ? [
      { id: 'admin', label: 'Admin Dashboard', icon: Shield }
    ] : []),
    { id: 'profile', label: 'Account Settings', icon: Settings },
    { id: 'about', label: 'About & Founder', icon: Info },
  ];

  // Map remaining log values to "AI Credits Remaining" quota mapping
  const remainingCredits = Math.max(creditsMax - creditsUsed, 0);
  const progressPercent = Math.min((remainingCredits / creditsMax) * 100, 100);
  const isDark = theme === 'dark';

  return (
    <>
      {/* Mobile background overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col justify-between h-screen border-r bg-white dark:bg-[#12141C] border-slate-205/60 dark:border-slate-800 transition-all duration-300 md:sticky md:block 
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          ${collapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-emerald-500 text-white font-mono font-bold tracking-wider text-base shadow-sm shrink-0">
              R
            </div>
            {!collapsed && (
              <span className="font-sans font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 animate-fade-in whitespace-nowrap">
                Resume<span className="text-emerald-500">Pilot</span> AI
              </span>
            )}
          </div>
          <button 
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`sidebar-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group relative duration-150
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/10 border-l-[3px] border-emerald-500 rounded-l-none pl-2.5' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
              >
                <Icon size={16} className={`${isActive ? 'text-emerald-500 shrink-0' : 'text-slate-400 shrink-0 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                {!collapsed && (
                  <span className="ml-3 truncate">{item.label}</span>
                )}
                
                {/* Visual indicator / mini badge */}
                {!collapsed && item.badge && (
                  <span className="ml-auto text-[9px] font-mono select-none px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold leading-none">
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Tooltips */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-950 text-white text-[10px] font-semibold rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/60">
            <button
              type="button"
              id="sidebar-signout-btn"
              onClick={onLogout}
              className="flex items-center w-full px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all group relative duration-150"
            >
              <LogOut size={16} className="text-rose-500 shrink-0" />
              {!collapsed && <span className="ml-3 truncate font-bold">Sign Out</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-950 text-white text-[10px] font-semibold rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Sign Out
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 space-y-4 shrink-0">
          {/* Credits remaining block (Cleaned from log/sandbox jargon) */}
          {!collapsed && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181B26] border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5 text-[10px]">
                <span className="font-bold uppercase tracking-wider text-slate-400 font-mono">AI Credits Remaining</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {remainingCredits}/{creditsMax} API credits
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-1.5 text-[9px] text-slate-400 leading-normal font-sans">
                Powering your career transition with Gemini AI.
              </p>
            </div>
          )}

          {/* Theme & Profile elements */}
          <div className="flex items-center justify-between gap-1">
            {/* Theme Toggle */}
            <button
              type="button"
              id="sidebar-theme-toggle"
              onClick={toggleTheme}
              className="flex items-center justify-center w-8.5 h-8.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} />}
            </button>

            {/* User Meta Card */}
            {!collapsed && user && (
              <div className="flex-1 flex items-center gap-2 px-1 max-w-[150px] overflow-hidden">
                <img 
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} 
                  alt="Avatar" 
                  className="w-6.5 h-6.5 rounded-full object-cover border border-emerald-500/20 shrink-0" 
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate leading-none">
                    {user.fullName}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate mt-0.5 leading-none font-mono">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center w-8.5 h-8.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 border border-transparent"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
