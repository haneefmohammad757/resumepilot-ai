import React, { useState } from 'react';
import { AlertCircle, Sparkles, RefreshCw, Copy, Check, CheckCircle2, BookOpen, GraduationCap } from 'lucide-react';
import { SkillGapReport } from '../types';

interface SkillGapProps {
  onAddActivity: (act: any) => void;
  token: string | null;
}

export default function SkillGap({ onAddActivity, token }: SkillGapProps) {
  const [targetRole, setTargetRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SkillGapReport | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole || !currentSkills) return;
    setLoading(true);
    setReport(null);

    try {
      const res = await fetch('/api/skill-gap/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'user-demo-123'}`
        },
        body: JSON.stringify({ targetRole, currentSkills })
      });

      if (!res.ok) throw new Error('Skill gap analysis routine failed');
      const data = await res.json();
      setReport(data);
      onAddActivity({
        type: 'Skill Gap',
        title: `Targeting ${data.targetRole}`,
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Professional Career Skill-Gap Expert</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Map your listed skills with corporate target profiles. Audit which critical engineering capabilities you are missing.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Input Column */}
        <div className="lg:col-span-5 p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl h-fit space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">My Capabilities Blueprint</h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Target Role *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lead Devops Architect"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">My Current Skills *</label>
              <textarea
                placeholder="Describe your active skills (e.g. React, Node, Webpack, some Express, Git, CSS, responsive designs...)"
                rows={5}
                required
                value={currentSkills}
                onChange={e => setCurrentSkills(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium font-sans"
              />
            </div>

            <button
              type="submit"
              id="skill-gap-generate-btn"
              disabled={loading || !targetRole || !currentSkills}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
              {loading ? "Calculating Gaps..." : "Audit Skill Gaps"}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {!report && !loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[350px]">
              <AlertCircle className="text-slate-300 dark:text-slate-700 mb-2" size={40} />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Analysis results pending</p>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                Pinpoint your favorite goal role and current skill lists. Our system compiles a rigorous audit matching industry hiring standards.
              </p>
            </div>
          ) : loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[350px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-emerald-500 animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Auditing industry requirements lists...</p>
              <p className="text-[10px] text-zinc-400 mt-1 max-w-xs">
                Querying Google Gemini to compare skill sets against 5,000+ top-tier tech job notices.
              </p>
            </div>
          ) : (
            <div className="p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-6 animate-fade-in text-xs">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Expert Gap Analysis Report</span>

              {/* Verified core standard skills */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    Verified Strengths ({report.currentSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {report.currentSkills.map((sk, i) => (
                      <span key={i} className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-emerald-500/10 text-emerald-600">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <AlertCircle size={12} className="text-rose-500" />
                    Crucial Gaps Identified
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {report.missingSkills.length === 0 ? (
                      <span className="text-[10px] font-semibold text-emerald-500">No core gaps spotted!</span>
                    ) : (
                      report.missingSkills.map((sk, i) => (
                        <span key={i} className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-rose-500/10 text-rose-500">
                          {sk}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations cards */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Targeted Learning Syllabus</span>
                <div className="space-y-3">
                  {report.learningRecommendations.map((rec, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                        <BookOpen size={14} className="text-emerald-500" />
                        {rec.skill}
                      </div>
                      
                      {/* Learning links and items */}
                      <div className="pl-4 border-l border-slate-200 dark:border-slate-850 space-y-1">
                        {rec.resources.map((res, rIdx) => (
                          <p key={rIdx} className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed list-item list-inside">
                            {res}
                          </p>
                        ))}
                      </div>

                      {rec.certificationSuggested && (
                        <div className="pt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-500 font-medium">
                          <GraduationCap size={14} />
                          Target Cert: <span className="underline font-bold text-slate-700 dark:text-slate-300">{rec.certificationSuggested}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
}
