import React, { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check, Info, FileSpreadsheet, ArrowRight, HelpCircle } from 'lucide-react';
import { BulletPoint } from '../types';

interface BulletGeneratorProps {
  onAddActivity: (act: any) => void;
  token: string | null;
}

export default function BulletGenerator({ onAddActivity, token }: BulletGeneratorProps) {
  const [inputActivity, setInputActivity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulletPoint | null>(null);

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputActivity.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/bullets/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'user-demo-123'}`
        },
        body: JSON.stringify({ inputActivity })
      });

      if (!res.ok) throw new Error('Bullet tuning routine failed');
      const data = await res.json();
      setResult(data);
      onAddActivity({
        type: 'Bullet Points',
        title: inputActivity.substring(0, 40) + '...',
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
      
      {/* View Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ATS Professional Bullet-Points Tuner</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Restructure raw, dry project descriptions into quantitative accomplishments following the strict Google XYZ framework.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Form input */}
        <div className="lg:col-span-5 p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl h-fit space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Original Description</h3>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1">
              <textarea
                placeholder="e.g. Worked as an AWS developer. Built standard Express APIs. Handled user tables and resolved some query delays..."
                rows={6}
                required
                value={inputActivity}
                onChange={e => setInputActivity(e.target.value)}
                className="w-full text-xs p-3 border rounded-xl font-sans text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              id="bullets-generate-btn"
              disabled={loading || !inputActivity.trim()}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
              {loading ? "Aligning Impact Ratios..." : "Optimize using Google XYZ Formula"}
            </button>
          </form>

          {/* Guidelines notes */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-[10px] text-slate-500 leading-normal font-sans">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
              <Info size={14} className="text-emerald-500" />
              What is the Google XYZ Formula?
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-300">
              Accomplished [X] as measured by [Y], by doing [Z].
            </p>
            <p className="text-slate-400 leading-snug">
              Rather than stating responsibilities (e.g. "Responsible for AWS API writing"), recruiters look for quantifiable outcomes (e.g. "Optimized API load times by 24% by configuring multi-cluster Redis replication").
            </p>
          </div>
        </div>

        {/* Output list column */}
        <div className="lg:col-span-7">
          {!result && !loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[350px]">
              <FileSpreadsheet className="text-slate-300 dark:text-slate-700 mb-2" size={40} />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Accomplishment points pending optimization</p>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                Enter your previous activities or tasks. The model will design tailored action bullets complete with believable engineering metrics.
              </p>
            </div>
          ) : loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[350px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-emerald-500 animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Rewriting resume accomplishments...</p>
              <p className="text-[10px] text-zinc-400 mt-1 max-w-xs">
                Injecting powerful active verbs and believable system optimization figures to satisfy modern ATS scanning schemas.
              </p>
            </div>
          ) : (
            <div className="p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-4 animate-fade-in text-xs">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Optimized ATS Accomplishments</span>

              <div className="space-y-3.5 pt-2">
                {result.bullets.map((bullet, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-2 relative transition-all group hover:border-emerald-500/30">
                    <p className="text-xs font-sans text-slate-700 dark:text-slate-200 leading-relaxed pr-8">
                      {bullet}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] leading-none bg-emerald-500/10 text-emerald-500 font-bold tracking-wider font-mono">
                        Google XYZ Compliant
                      </span>
                      <button
                        onClick={() => handleCopy(bullet, idx)}
                        className="p-1 px-2 text-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 border dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded flex items-center gap-1 font-semibold"
                      >
                        {copiedIdx === idx ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        {copiedIdx === idx ? 'Copied' : 'Copy'}
                      </button>
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
