import React, { useState } from 'react';
import { Linkedin, Sparkles, RefreshCw, Copy, Check, FileCheck, ArrowUpRight } from 'lucide-react';
import { LinkedInGeneration } from '../types';

interface LinkedInProfileProps {
  onAddActivity: (act: any) => void;
  token: string | null;
}

export default function LinkedInProfile({ onAddActivity, token }: LinkedInProfileProps) {
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level');
  const [skills, setSkills] = useState('');
  const [achievements, setAchievements] = useState('');

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<LinkedInGeneration | null>(null);

  // Copy feedbacks
  const [copiedField, setCopiedField] = useState<'headline' | 'about' | 'skills' | null>(null);

  const handleCopy = (text: string, field: 'headline' | 'about' | 'skills') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole || !skills) return;
    setLoading(true);
    setOutput(null);

    try {
      const res = await fetch('/api/linkedin/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'user-demo-123'}`
        },
        body: JSON.stringify({
          currentRole,
          targetRole,
          experienceLevel,
          skills,
          achievements
        })
      });

      if (!res.ok) throw new Error('LinkedIn optimization routine failed');
      const data = await res.json();
      setOutput(data);
      onAddActivity({
        type: 'LinkedIn Profile',
        title: `${data.currentRole} ➜ ${data.targetRole}`,
        date: data.createdAt,
        id: data.id
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pl-1">
      
      {/* View Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">LinkedIn Executive Profile Generator</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Construct algorithmic headings and search-optimized biographies targeting corporate talent scouts.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Input Column */}
        <div className="lg:col-span-5 p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl h-fit space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Branding Blueprint</h3>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Current Position</label>
                <input
                  type="text"
                  placeholder="e.g. Associate Engineer"
                  value={currentRole}
                  onChange={e => setCurrentRole(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Target Position *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Tech Lead"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Career Seniority</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="Entry-Level">Entry-Level (0-2 years)</option>
                <option value="Associate / Mid-Level">Associate / Mid-Level (2-5 years)</option>
                <option value="Senior Lead">Senior Lead (5-8 years)</option>
                <option value="Executive Principal / Architect">Executive Principal / Architect (8+ years)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">My Core Expertise (Skills) *</label>
              <input
                type="text"
                required
                placeholder="React, CSS, Postgres, Event Sourcing, AWS..."
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Key Accomplishments / Deliverables</label>
              <textarea
                placeholder="Led cluster migrations, decreased bundle overheads, trained 3 new hires, saved $14K cloud costs annually..."
                rows={4}
                value={achievements}
                onChange={e => setAchievements(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium font-sans"
              />
            </div>

            <button
              type="submit"
              id="linkedin-generate-btn"
              disabled={loading || !targetRole || !skills}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
              {loading ? "Aligning Search Keywords..." : "Generate Recruiting Optimization Package"}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {!output && !loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[400px]">
              <Linkedin className="text-slate-300 dark:text-slate-700 mb-2" size={40} />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Optimization contents pending</p>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                Submit your target positions and achievements. We'll outline elegant headlines and search-tags tailored for automated HR searches.
              </p>
            </div>
          ) : loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[400px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-emerald-500 animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Evaluating semantic corporate headings...</p>
              <p className="text-[10px] text-zinc-400 mt-1 max-w-xs">
                Analyzing search volumes and keyword tag limits to write a perfect executive biography utilizing Google GenAI.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden animate-fade-in divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Header */}
              <div className="p-5 flex items-center gap-2 text-slate-900 dark:text-white">
                <Linkedin size={18} className="text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">LinkedIn Branding Deliverables</span>
              </div>

              {/* Headline block */}
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Dynamic Search Headline (Target tag)</span>
                  <button
                    onClick={() => handleCopy(output.headline, 'headline')}
                    className="p-1 px-2.5 text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 border dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded flex items-center gap-1 font-medium"
                  >
                    {copiedField === 'headline' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copiedField === 'headline' ? 'Copied' : 'Copy Headline'}
                  </button>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 pl-3 border-l-2 border-emerald-500 py-1 leading-relaxed bg-slate-50/50 dark:bg-slate-900/30 font-sans">
                  {output.headline}
                </p>
              </div>

              {/* About section block */}
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Optimization biography narrative (About)</span>
                  <button
                    onClick={() => handleCopy(output.aboutSection, 'about')}
                    className="p-1 px-2.5 text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 border dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded flex items-center gap-1 font-medium"
                  >
                    {copiedField === 'about' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copiedField === 'about' ? 'Copied' : 'Copy About'}
                  </button>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-dotted border-slate-200 dark:border-slate-800 font-sans">
                  {output.aboutSection}
                </div>
              </div>

              {/* Suggested Tags section block */}
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Recruiter Tags List (Featured Skills)</span>
                  <button
                    onClick={() => handleCopy(output.skillsSection, 'skills')}
                    className="p-1 px-2.5 text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 border dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded flex items-center gap-1 font-medium"
                  >
                    {copiedField === 'skills' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copiedField === 'skills' ? 'Copied' : 'Copy Skills'}
                  </button>
                </div>
                <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-full truncate whitespace-pre-line">
                  {output.skillsSection}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
}
