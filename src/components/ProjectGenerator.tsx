import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  GitCommit, 
  Database, 
  Code2, 
  ClipboardList,
  Lightbulb
} from 'lucide-react';
import { ProjectGeneration } from '../types';

interface ProjectGeneratorProps {
  onAddActivity: (act: any) => void;
  token: string | null;
}

const DOMAINS = [
  { id: 'AI/ML', name: 'AI / ML', emoji: '🤖' },
  { id: 'Java', name: 'Java', emoji: '☕' },
  { id: 'Web Development', name: 'Web Dev', emoji: '🌐' },
  { id: 'Cybersecurity', name: 'Cybersecurity', emoji: '🔐' },
  { id: 'Cloud Computing', name: 'Cloud Computing', emoji: '☁️' },
  { id: 'Data Science', name: 'Data Science', emoji: '📊' },
];

export default function ProjectGenerator({ onAddActivity, token }: ProjectGeneratorProps) {
  const [domain, setDomain] = useState('AI/ML');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [preferences, setPreferences] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProjectGeneration | null>(null);

  // Copy controllers
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole) return;
    setLoading(true);
    setProject(null);

    try {
      const res = await fetch('/api/project/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'user-demo-123'}`
        },
        body: JSON.stringify({ domain, targetRole, difficulty, preferences })
      });

      if (!res.ok) throw new Error('AI project architect run failed');
      const data = await res.json();
      setProject(data);
      onAddActivity({
        type: 'Project Generator',
        title: data.title,
        date: data.createdAt,
        id: data.id
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pl-1 text-xs">
      
      {/* Header aligned like mockup */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#e8f7f2] dark:bg-[#153a31] text-emerald-500 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Project Idea Generator</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Complete project plans powered by AI</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Form panel left (Spacious Col) */}
        <div className="lg:col-span-7 p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl h-fit space-y-6 shadow-sm">
          
          <form onSubmit={handleGenerate} className="space-y-5">
            
            {/* Domain Grid Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Domain</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DOMAINS.map((dom) => {
                  const isSelected = domain === dom.id;
                  return (
                    <button
                      key={dom.id}
                      type="button"
                      onClick={() => setDomain(dom.id)}
                      className={`p-4 rounded-xl text-left border flex flex-col items-start gap-4 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-emerald-500 bg-[#e6fcf5] dark:bg-emerald-500/10 ring-2 ring-emerald-500/20"
                          : "border-slate-150 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-750"
                      }`}
                    >
                      <span className="text-2xl filter drop-shadow hover:scale-110 transition-transform">{dom.emoji}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 select-none">{dom.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Level pills selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Difficulty Level</label>
              <div className="flex flex-wrap gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                  const isSelected = difficulty === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspirational goal role */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Aspirational Goal Role *</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed SQL Backend Architect"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium font-sans placeholder-slate-400"
              />
            </div>

            {/* Additional preferences textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Additional preferences (optional)</label>
              <textarea
                rows={3}
                placeholder="e.g. I want a project using Python and FastAPI, for portfolio, with real-time features..."
                value={preferences}
                onChange={e => setPreferences(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              id="projects-generate-btn"
              disabled={loading || !targetRole}
              className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
              {loading ? "Composing Project Models..." : "Forge Advanced Project Specification"}
            </button>
          </form>
        </div>

        {/* Display right column (Results display) */}
        <div className="lg:col-span-5 h-full">
          {!project && !loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[420px] shadow-sm">
              <Terminal className="text-slate-300 dark:text-slate-700 mb-2.5 animate-pulse" size={40} />
              <p className="text-xs font-bold text-slate-550 dark:text-slate-450">Architect parameters pending</p>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                Pinpoint your favorite domain, select required experience level, and insert target role to blueprint deep database designs and code action plans.
              </p>
            </div>
          ) : loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[420px] shadow-sm">
              <div className="w-12 h-12 rounded-full border-4 border-slate-150 dark:border-slate-800 border-t-emerald-500 animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Formulating custom blueprint scheme...</p>
              <p className="text-[10px] text-zinc-400 mt-1 max-w-xs leading-relaxed">
                Querying Google Gemini to construct realistic DB mappings, functional feature sets, and professional CV achievements.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Primary Bento Header */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
                <span className="px-2 py-0.5 text-[9px] font-bold font-mono rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
                  {project.domain} • {difficulty} Template
                </span>
                <h3 className="text-md font-black text-slate-950 dark:text-white flex items-center gap-2 truncate">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  {project.description}
                </p>
              </div>

              {/* Grid: Tech stack, DB design, and Code milestones */}
              <div className="space-y-6">
                {/* Tech & Features */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Stack & System Functions</span>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-bold border border-transparent dark:border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2 mt-2">
                    {project.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Code2 size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug font-sans-body">
                          {feat}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Database schemas */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <Database size={12} className="text-emerald-500" />
                    Suggested Relational Schema
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#151720] border dark:border-slate-900 p-3.5 rounded-xl font-mono">
                    {project.databaseDesign}
                  </p>
                </div>
              </div>

              {/* Developer Roadmap */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Technical Roadmap Steps</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {project.roadmap.map((step, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181B26] border dark:border-slate-800 space-y-1 relative">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-500 font-bold">
                        <GitCommit size={14} />
                        Milestone {i + 1}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug font-sans-body">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Copy-paste CV summary metric bullet */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/20 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <ClipboardList size={12} className="text-emerald-500" />
                    Pre-Written CV Accomplishment
                  </span>
                  <button
                    onClick={() => triggerCopy(project.resumeSummary, 'cv-bullet')}
                    className="p-1 px-2 text-[10px] hover:bg-slate-500/10 border border-slate-500/20 text-slate-500 dark:text-slate-300 rounded flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedField === 'cv-bullet' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copiedField === 'cv-bullet' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 pl-3 border-l-2 border-emerald-500 py-0.5 leading-relaxed font-sans">
                  {project.resumeSummary}
                </p>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
}
