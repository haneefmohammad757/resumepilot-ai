import React from 'react';
import { Award, Code, Sparkles, Heart, Linkedin, BookOpen, Star, ArrowUpRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-8 animate-fade-in pl-1 text-xs text-[#1e293b] dark:text-slate-100 font-sans max-w-4xl mx-auto">
      
      {/* Header section */}
      <div className="border-b border-slate-100 dark:border-slate-800/60 pb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-2">
          <Heart size={12} className="text-rose-500 fill-rose-500" />
          About ResumePilot AI
        </span>
        <h1 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">
          Meet the Creator
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Accelerating student developer careers through precise portfolio engineering and computational profile optimization.
        </p>
      </div>

      {/* Founder Spotlight Card */}
      <div className="p-8 bg-white dark:bg-[#12141C] border border-slate-105/60 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/[0.03] blur-2xl rounded-full pointer-events-none" />
        
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-4xl font-extrabold text-emerald-500 border border-emerald-500/20 shadow-inner select-none font-mono">
            MH
          </div>
          <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white font-mono shadow">
            Founder
          </span>
        </div>

        {/* Info */}
        <div className="space-y-4 text-center md:text-left flex-1">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Mohammad Haneef</h2>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              Founder & Creator of ResumePilot AI
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-xl">
            Computer Science student and AI enthusiast building ResumePilot AI to help students, fresh graduates, and job seekers improve resumes, optimize LinkedIn profiles, generate portfolio projects, identify skill gaps, and prepare for interviews.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-1 text-[10px] font-mono text-slate-450 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <Award size={12} className="text-emerald-550" /> Student First Initiative
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <Code size={12} className="text-emerald-555" /> Gemini API Powered
            </span>
          </div>
        </div>
      </div>

      {/* Platform Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vision Item 1 */}
        <div className="p-6 bg-white dark:bg-[#12141C] border border-slate-100 dark:border-slate-800/60 rounded-2xl space-y-3 shadow-none">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">The Career Gap Mission</h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
            Most ATS screening algorithms reject highly capable self-taught developers, fresh engineers, and students simply due to profile structural parsing errors. ResumePilot AI bridges this gap through verified XYZ achievement models that prove actual capability.
          </p>
        </div>

        {/* Vision Item 2 */}
        <div className="p-6 bg-white dark:bg-[#12141C] border border-slate-100 dark:border-slate-800/60 rounded-2xl space-y-3 shadow-none">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <BookOpen size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Relational Portfolio Engineering</h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
            Instead of cookie-cutter projects, ResumePilot guides candidates to build comprehensive backend schemas and operational milestone tasks mapping directly to real enterprise microservice architectures.
          </p>
        </div>
      </div>

    </div>
  );
}
