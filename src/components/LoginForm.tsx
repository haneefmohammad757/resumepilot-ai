import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: (token: string, userData: any) => void;
  isDark?: boolean;
}

export default function LoginForm({ onLoginSuccess, isDark = true }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    const url = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    const body = isSignUp 
      ? { email, password, fullName }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication challenge failed');
      }

      onLoginSuccess(data.token, data.user);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/auth/oauth-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: "demo-guest@resumepilot.ai",
          fullName: "Demo Candidate",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google login failed');
      }

      onLoginSuccess(data.token, data.user);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#11141D] text-slate-900 dark:text-white transition-colors p-6 sm:p-8 space-y-6">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 text-white font-mono font-bold text-2xl mb-1">
          R
        </div>
        <h2 className="text-xl font-bold tracking-tight">
          {isSignUp ? "Create Pilot Profile" : "Access ResumePilot AI"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isSignUp 
            ? "Configure your student career accelerator today" 
            : "Launch your career workspace and optimize assets"}
        </p>
      </div>

      {/* Errors Block */}
      {err && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-lg text-center font-medium">
          {err}
        </div>
      )}

      {/* Auth Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                <User size={15} />
              </span>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-xs bg-slate-50 dark:bg-[#181B26] border-slate-205 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Mail size={15} />
            </span>
            <input
              type="email"
              required
              placeholder="demo@resumepilot.ai"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-xs bg-slate-50 dark:bg-[#181B26] border-slate-205 dark:border-slate-803 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Lock size={15} />
            </span>
            <input
              type="password"
              required
              placeholder="••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-xs bg-slate-50 dark:bg-[#181B26] border-slate-205 dark:border-slate-803 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          id="auth-submit-btn"
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-xs font-bold tracking-wide text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 mt-4"
        >
          {loading ? "Processing..." : (
            <>
              {isSignUp ? "Create Free Account" : "Access Candidate Workspace"}
              <ArrowRight size={13} />
            </>
          )}
        </button>
      </form>

      {/* Toggle Links */}
      <div className="text-center pt-1.5">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-slate-400 hover:text-emerald-500 hover:underline inline-flex items-center gap-1 font-medium"
        >
          {isSignUp ? "Already a pilot user? Sign in" : "New candidate? Create your Profile"}
        </button>
      </div>

    </div>
  );
}
