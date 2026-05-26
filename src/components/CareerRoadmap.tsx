import React, { useState } from 'react';
import { Compass, Sparkles, RefreshCw, ChevronRight, CheckCircle2, GitCommit, FileSpreadsheet } from 'lucide-react';
import { CareerRoadmap as CareerRoadmapType } from '../types';

interface CareerRoadmapProps {
  onAddActivity: (act: any) => void;
  token: string | null;
}

export default function CareerRoadmap({ onAddActivity, token }: CareerRoadmapProps) {
  const [currentLevel, setCurrentLevel] = useState('Junior-Level');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<CareerRoadmapType | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole) return;
    setLoading(true);
    setRoadmap(null);

    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'user-demo-123'}`
        },
        body: JSON.stringify({ currentLevel, targetRole })
      });

      if (!res.ok) throw new Error('Roadmap generation failed');
      const data = await res.json();
      setRoadmap(data);
      onAddActivity({
        type: 'Career Roadmap',
        title: `Roadmap to ${data.targetRole}`,
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
    <div className="space-y-8 animate-fade-in pl-1">
      
      {/* View Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Professional Career Roadmap Generator</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Plot a customized milestone matrix tracing clear week-by-week transition milestones to reach your ideal senior architectural goals.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Input Column */}
        <div className="lg:col-span-4 p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl h-fit space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Roadmap Parameters</h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Current Career Level</label>
              <select
                value={currentLevel}
                onChange={e => setCurrentLevel(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="Junior / Student">Junior Developer / Student</option>
                <option value="Mid-Level Specialist">Mid-Level Specialist (2-4 yrs)</option>
                <option value="Senior Level Lead">Senior Level Lead (5+ yrs)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Aspirational Goal Role *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lead Kubernetes Platform Architect"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-[1px] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium font-sans"
              />
            </div>

            <button
              type="submit"
              id="roadmap-generate-btn"
              disabled={loading || !targetRole}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
              {loading ? "Composing Milestone Rails..." : "Generate 12-Week Roadmap"}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-8">
          {!roadmap && !loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[350px]">
              <Compass className="text-slate-300 dark:text-slate-700 mb-2" size={40} />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Milestone trajectories pending</p>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                Enter your target roles to build sequential training stages complete with specific study materials and tangible github repository deliverables.
              </p>
            </div>
          ) : loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[350px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-emerald-500 animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Plotting technical career curriculum...</p>
              <p className="text-[10px] text-zinc-400 mt-1 max-w-xs">
                Querying Google Gemini to map 12 weeks of training steps targeted for {targetRole} pipelines.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in text-xs">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">12-Week Acceleration Blueprint</span>

              <div className="relative border-l-2 border-slate-200/80 dark:border-slate-800 ml-4 pl-6 space-y-8 py-2">
                {roadmap.steps.map((step, idx) => (
                  <div key={idx} className="relative space-y-3">
                    {/* Circle Node Indicator */}
                    <span className="absolute -left-[35px] top-1 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white font-mono font-bold text-[10px] shadow-sm">
                      {idx + 1}
                    </span>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-500 font-mono leading-none tracking-widest uppercase">
                        {step.weekRange}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>

                    {/* Checkbox skills list & deliverables */}
                    <div className="grid gap-4 md:grid-cols-2 pt-1 font-sans">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border dark:border-slate-850 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Acquire Capabilities</span>
                        <div className="space-y-1">
                          {step.skillsToAcquire.map((sk, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                              <CheckCircle2 size={12} className="text-emerald-500" />
                              {sk}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border dark:border-slate-850 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Tangible Deliverable</span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                          {step.deliverable}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
}
