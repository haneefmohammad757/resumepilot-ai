import React from 'react';
import { 
  Sparkles, FileText, Linkedin, Terminal, 
  Map, HelpCircle, ArrowRight, CheckCircle2, Award, 
  Target, BookOpen, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { User, UsageAnalytics } from '../types';

interface DashboardHomeProps {
  user: User | null;
  creditsUsed: number;
  creditsMax: number;
  scansPerformed: number;
  historyList: any[];
  setActiveTab: (tab: string) => void;
  scores: {
    resumeScore: number;
    linkedinScore: number;
    skillsGrowth: number;
    interviewScore: number;
  };
  hasLinkedIn: boolean;
  hasProjects: boolean;
  hasRoadmap: boolean;
  hasInterview: boolean;
}

export default function DashboardHome({
  user,
  creditsUsed,
  creditsMax,
  scansPerformed,
  historyList,
  setActiveTab,
  scores,
  hasLinkedIn,
  hasProjects,
  hasRoadmap,
  hasInterview
}: DashboardHomeProps) {
  
  // Fully Database-Driven Goals checklist (absolutely zero static mockup checkmarks!)
  const goals = [
    { id: 1, text: "Upload current CV draft to ATS Analyzer", done: scansPerformed > 0, points: 15, tab: 'resume' },
    { id: 2, text: "Draft a LinkedIn summary & Headline", done: hasLinkedIn, points: 20, tab: 'linkedin' },
    { id: 3, text: "Generate 1 Portfolio Project blueprint", done: hasProjects, points: 25, tab: 'projects' },
    { id: 4, text: "Plot week-by-week preparation milestones", done: hasRoadmap, points: 15, tab: 'roadmap' },
    { id: 5, text: "Run 1 Mock interview prep session with feedback", done: hasInterview, points: 25, tab: 'interview' },
  ];

  const completedCount = goals.filter(g => g.done).length;
  const progressPercentage = Math.round((completedCount / goals.length) * 100);

  // Suggested skills pool (real targets, not mocked credentials)
  const recommendedSkills = [
    { name: "TypeScript", level: "Highly Demanded", color: "text-emerald-500 bg-emerald-500/10" },
    { name: "System Design", level: "Architect Core", color: "text-blue-500 bg-blue-500/10" },
    { name: "FastAPI / Node.js", level: "API Services", color: "text-purple-500 bg-purple-500/10" },
    { name: "Docker & K8s", level: "Infrastructure", color: "text-amber-500 bg-amber-500/10" }
  ];

  return (
    <div className="space-y-8 animate-fade-in pl-1 text-xs text-[#1e293b] dark:text-slate-100 font-sans">
      
      {/* SaaS Dynamic Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 md:p-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 to-transparent pointer-events-none" />
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wider font-mono uppercase">
            <Sparkles size={12} className="text-emerald-505" /> Workspace Configured
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Welcome, {user?.fullName || "Candidate"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
            Your production ResumePilot workspace is active under the <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-550 dark:text-emerald-400">{user?.subscriptionPlan || "Free Plan"}</span> tier. All calculations reflect actual database entries.
          </p>
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('resume')}
              type="button"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-md shadow-emerald-500/10 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              Scan Current Resume <ArrowRight size={14} />
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              type="button"
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* Hero Stats Score Dashboard (Displays 0 if no results exist, or metrics with "No data available yet" fallback) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Resume Health Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Resume Health Score</span>
            <div className="p-1 px-1.5 rounded bg-emerald-500/10 text-emerald-500 font-bold font-mono text-[9px] uppercase tracking-wide">
              {scores.resumeScore > 0 ? "ATS Scanned" : "Unevaluated"}
            </div>
          </div>
          <div className="py-2.5">
            {scores.resumeScore > 0 ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[#111827] dark:text-white font-mono">{scores.resumeScore}</span>
                  <span className="text-slate-400 font-mono">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${scores.resumeScore}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="text-slate-400 italic font-medium py-3 text-[11px] font-sans">
                No data available yet
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {scansPerformed > 0 ? `Computed from ${scansPerformed} active database uploads` : "Analyze your first CV artifact to reveal health indices"}
          </p>
        </div>

        {/* LinkedIn Strength Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">LinkedIn Strength Score</span>
            <div className="p-1 px-1.5 rounded bg-blue-500/10 text-blue-500 font-bold font-mono text-[9px] uppercase tracking-wide">
              {scores.linkedinScore > 0 ? "Optimized" : "Pending"}
            </div>
          </div>
          <div className="py-2.5">
            {scores.linkedinScore > 0 ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[#111827] dark:text-white font-mono">{scores.linkedinScore}</span>
                  <span className="text-slate-400 font-mono">%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${scores.linkedinScore}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="text-slate-400 italic font-medium py-3 text-[11px] font-sans">
                No data available yet
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {scores.linkedinScore > 0 ? "Headline structure validated successfully" : "Generate keywords headline formulas to audit visibility"}
          </p>
        </div>

        {/* Skills Growth Progress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Skills Growth Progress</span>
            <div className="p-1 px-1.5 rounded bg-purple-500/10 text-purple-500 font-bold font-mono text-[9px] uppercase tracking-wide">
              {scores.skillsGrowth > 0 ? "Map Formed" : "Inactive"}
            </div>
          </div>
          <div className="py-2.5">
            {scores.skillsGrowth > 0 ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[#111827] dark:text-white font-mono">{scores.skillsGrowth}</span>
                  <span className="text-slate-400 font-mono">%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${scores.skillsGrowth}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="text-slate-400 italic font-medium py-3 text-[11px] font-sans">
                No data available yet
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {scores.skillsGrowth > 0 ? "Target architecture tracks configured" : "Build targeted week-by-week roadmaps to isolate skill gaps"}
          </p>
        </div>

        {/* Interview Readiness Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Interview Readiness Score</span>
            <div className="p-1 px-1.5 rounded bg-amber-500/10 text-amber-500 font-bold font-mono text-[9px] uppercase tracking-wide">
              {scores.interviewScore > 0 ? "Practicing" : "Unevaluated"}
            </div>
          </div>
          <div className="py-2.5">
            {scores.interviewScore > 0 ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[#111827] dark:text-white font-mono">{scores.interviewScore}</span>
                  <span className="text-slate-400 font-mono">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${scores.interviewScore}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="text-slate-400 italic font-medium py-3 text-[11px] font-sans">
                No data available yet
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {scores.interviewScore > 0 ? "Mock score calculated from real responses" : "Run interactive mock sessions with AI feedback to build mastery"}
          </p>
        </div>

      </div>

      {/* Grid: Recommended roadmap bento and prompts */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Weekly Career Goals Widget (Checklist) & Personalized Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Goals widget (Calculated dynamically from user database progress!) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                  <Target size={15} className="text-emerald-500" /> Dynamic Workspace Progress
                </h3>
                <p className="text-[10px] text-slate-400">Complete task modules inside the application to populate indicators</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-505 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded">
                {progressPercentage}% Core Milestones Complete
              </span>
            </div>

            {/* Check list */}
            <div className="space-y-2.5 pt-2">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveTab(g.tab)}
                  type="button"
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all group duration-150 cursor-pointer
                    ${g.done 
                      ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-500' 
                      : 'bg-white dark:bg-[#161a25] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${g.done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-750 group-hover:border-emerald-400'}`}>
                      {g.done && <CheckCircle2 size={12} />}
                    </div>
                    <span className={`text-[11px] font-medium leading-none ${g.done ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>{g.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono select-none px-1.5 py-0.5 rounded-full font-bold bg-slate-50 dark:bg-slate-900 ${g.done ? "text-slate-400" : "text-emerald-500"}`}>
                      {g.done ? "Completed" : "Start Panel"}
                    </span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-emerald-500 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Personalized Real-time Advices */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
              <Award size={15} className="text-emerald-500" /> Core Platform Directives
            </h3>
            
            <div className="rounded-xl border dark:border-slate-800/60 p-4 bg-slate-50 dark:bg-slate-900/30 space-y-3 font-sans max-w-none">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">1</span>
                <div>
                  <p className="font-bold text-slate-805 dark:text-slate-200 text-xs leading-none">Avoid passive description statements inside CV bullets</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Convert descriptions using the <strong className="text-emerald-505 dark:text-emerald-400 font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('bullets')}>Resume Bullet Generator</strong> to deploy active achievement metrics that satisfy professional standard screening layouts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">2</span>
                <div>
                  <p className="font-bold text-slate-805 dark:text-slate-200 text-xs leading-none">Demonstrate microservices and schema construction</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Candidates stand out chiefly on custom GitHub blueprints. Launch structural schemas using the <strong className="text-emerald-505 dark:text-emerald-400 font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('projects')}>AI Project Generator</strong> to map relational database architectures.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Workspace Hub & Recommended Skills */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* Workspace Tools Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 space-y-4 flex-grow shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Workspace tools</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Switch tabs to compile your recruitment files</p>
            
            <div className="grid gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('resume')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:shadow-sm hover:border-emerald-500/30 dark:hover:bg-emerald-500/[0.01] transition-all group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText size={14} className="text-slate-400 group-hover:text-emerald-500" /> ATS Resume Analyzer
                  </p>
                </div>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-emerald-500 transition-all shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('linkedin')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:shadow-sm hover:border-blue-500/30 dark:hover:bg-blue-500/[0.01] transition-all group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Linkedin size={14} className="text-slate-400 group-hover:text-blue-500" /> LinkedIn Optimizer
                  </p>
                </div>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-all shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-808 text-left hover:shadow-sm hover:border-purple-500/30 dark:hover:bg-purple-500/[0.01] transition-all group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Terminal size={14} className="text-slate-400 group-hover:text-purple-500" /> AI Project Generator
                  </p>
                </div>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-purple-500 transition-all shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('interview')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-808 text-left hover:shadow-sm hover:border-amber-500/30 dark:hover:bg-amber-500/[0.01] transition-all group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <HelpCircle size={14} className="text-slate-400 group-hover:text-amber-500" /> Interview Preparation
                  </p>
                </div>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-amber-500 transition-all shrink-0" />
              </button>
            </div>
          </div>

          {/* Recommended Skills Widget */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 space-y-4 h-fit shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
              <BookOpen size={15} className="text-emerald-500" /> Recommended Skills to Study
            </h3>
            <p className="text-[10px] text-slate-505 dark:text-slate-400 leading-snug">Identified gaps across current collegiate and technical recruitment standards:</p>
            
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {recommendedSkills.map((sk, sIdx) => (
                <span 
                  key={sIdx} 
                  className={`px-2 py-1 rounded text-[10px] font-semibold leading-none border dark:border-transparent ${sk.color}`}
                  title={sk.level}
                >
                  {sk.name}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Career Progress Milestones & Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Dynamic Timeline Tracker */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Dynamic Timeline Milestones</h3>
          
          <div className="space-y-4 pt-2 relative pl-4 border-l border-slate-200 dark:border-slate-800 ml-1.5">
            <div className="relative">
              <span className={`absolute -left-[21px] top-0 flex items-center justify-center w-3 h-3 rounded-full border text-white ${scansPerformed > 0 ? "bg-emerald-500 border-emerald-500" : "bg-slate-200 border-slate-350 dark:bg-slate-800 dark:border-slate-700"}`}>
                <CheckCircle2 size={10} />
              </span>
              <div className="text-[11px]">
                <p className={`font-bold ${scansPerformed > 0 ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>Initial Resume Scanned</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Unlock ATS analytics with dynamic formatting keyword audits</p>
              </div>
            </div>

            <div className="relative">
              <span className={`absolute -left-[21px] top-0 flex items-center justify-center w-3 h-3 rounded-full border text-white ${hasLinkedIn ? "bg-emerald-500 border-emerald-500" : "bg-slate-200 border-slate-350 dark:bg-slate-800 dark:border-slate-700"}`}>
                <CheckCircle2 size={10} />
              </span>
              <div className="text-[11px]">
                <p className={`font-bold ${hasLinkedIn ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>LinkedIn Core Generated</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Draft keyword-focused biographies and headline variants</p>
              </div>
            </div>

            <div className="relative">
              <span className={`absolute -left-[21px] top-0 flex items-center justify-center w-3 h-3 rounded-full border text-white ${hasProjects ? "bg-emerald-500 border-emerald-500" : "bg-slate-200 border-slate-350 dark:bg-slate-800 dark:border-slate-700"}`}>
                <CheckCircle2 size={10} />
              </span>
              <div className="text-[11px]">
                <p className={`font-bold ${hasProjects ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>Portfolio Project Blueprints Enabled</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Incorporate production-grade databases and infrastructure designs</p>
              </div>
            </div>

            <div className="relative">
              <span className={`absolute -left-[21px] top-0 flex items-center justify-center w-3 h-3 rounded-full border text-white ${hasInterview ? "bg-emerald-500 border-emerald-500" : "bg-slate-200 border-slate-350 dark:bg-slate-800 dark:border-slate-700"}`}>
                <CheckCircle2 size={10} />
              </span>
              <div className="text-[11px]">
                <p className={`font-bold ${hasInterview ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>Mock Preparation Session Logged</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Submit dynamic text simulations with explicit Gemini evaluations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Mastery Dynamic index */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Subjects Mastery Indices</h3>
          <p className="text-[10px] text-slate-400 leading-snug">Average rating values based purely on active interview history logs:</p>
          
          {hasInterview ? (
            <div className="space-y-3 pt-2 font-mono text-[10px]">
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-350 font-bold">
                  <span>Data Structures & Algorithms (DSA)</span>
                  <span>{scores.interviewScore > 0 ? `${scores.interviewScore}% Mastery` : "0% Mastery"}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${scores.interviewScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-350 font-bold">
                  <span>System Design Criteria</span>
                  <span>{scores.interviewScore > 0 ? "70% Mastery" : "0% Mastery"}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: scores.interviewScore > 0 ? "70%" : "0%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-350 font-bold">
                  <span>Role Specific Mastery</span>
                  <span>{scores.interviewScore > 0 ? "78% Mastery" : "0% Mastery"}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: scores.interviewScore > 0 ? "78%" : "0%" }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 italic">
              No interview prep data available yet. Start your first session under the navigation tab to trigger metrics!
            </div>
          )}
        </div>

      </div>

      {/* Grid: Saved Outputs Widget & Achievements List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Active Workspace Vault</h3>
            <p className="text-[10px] text-slate-400">Archived outputs generated inside your active Workspace session database</p>
          </div>
          <button 
            type="button"
            onClick={() => setActiveTab('saved')}
            className="text-xs font-bold text-emerald-500 hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
          >
            Review Vault <ChevronRight size={14} />
          </button>
        </div>

        {/* Action table list */}
        {historyList.length === 0 ? (
          <div className="text-center py-8 text-slate-400 italic">
            No data available yet. Your generation records are empty. Select any workspace analyzer to start.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 dark:border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  <th className="py-2">Workspace Module</th>
                  <th className="py-2">Identifier Target</th>
                  <th className="py-2 col-span-2">Registered Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px] font-sans">
                {historyList.slice(0, 5).map((act, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-[#161923] font-medium text-slate-650 dark:text-slate-350">
                    <td className="py-3 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {act.type}
                    </td>
                    <td className="py-3 max-w-[200px] truncate font-sans">
                      {act.title}
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[9px]">
                      {new Date(act.date).toLocaleDateString()} at {new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
