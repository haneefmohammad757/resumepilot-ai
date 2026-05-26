import React, { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check, FileText, Download, Briefcase, ChevronRight } from 'lucide-react';
import { CoverLetter as CoverLetterType } from '../types';

interface CoverLetterProps {
  onAddActivity: (act: any) => void;
  token: string | null;
}

export default function CoverLetter({ onAddActivity, token }: CoverLetterProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [resumeDetails, setResumeDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState<CoverLetterType | null>(null);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!letter) return;
    navigator.clipboard.writeText(letter.letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    if (!letter) return;
    const blob = new Blob([letter.letterContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${companyName.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !companyName) return;
    setLoading(true);
    setLetter(null);

    try {
      const res = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'user-demo-123'}`
        },
        body: JSON.stringify({ jobTitle, companyName, resumeDetails })
      });

      if (!res.ok) throw new Error('Cover letter compilation fail');
      const data = await res.json();
      setLetter(data);
      onAddActivity({
        type: 'Cover Letter',
        title: `To ${data.companyName} (${data.jobTitle})`,
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
      
      {/* Track Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Bespoke Cover Letter Composer</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manufacture pristine, clean formal cover letters matching the company domain specifications without using over-flowery language.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Input Column */}
        <div className="lg:col-span-5 p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl h-fit space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Letter Parameters</h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Architect III"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vercel"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">My Background Bulletpoints (Optional)</label>
              <textarea
                placeholder="Paste simple notes about your backgrounds (e.g., Have spent 3 years writing React code. Migrated databases. Led team migrations...)"
                rows={5}
                value={resumeDetails}
                onChange={e => setResumeDetails(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium font-sans"
              />
            </div>

            <button
              type="submit"
              id="cover-letter-generate-btn"
              disabled={loading || !jobTitle || !companyName}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
              {loading ? "Drafting Cover Letter..." : "Draft Recruiter Cover Letter"}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {!letter && !loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[350px]">
              <FileText className="text-slate-300 dark:text-slate-700 mb-2" size={40} />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Written drafts pending formulation</p>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                Provide the job title and enterprise company above. Gemini will build customized business paragraphs focused on direct target keywords.
              </p>
            </div>
          ) : loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[350px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-emerald-500 animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Drafting professional correspondence...</p>
              <p className="text-[10px] text-zinc-400 mt-1 max-w-xs">
                Analyzing company backgrounds and CV accomplishments via Gemini to ensure a clean, humbler, persuasive letter body.
              </p>
            </div>
          ) : (
            <div className="p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-4 animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                  <Briefcase size={14} className="text-emerald-500" />
                  Printable Draft Letter
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1 px-2 text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 border dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded flex items-center gap-1 font-semibold"
                  >
                    {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy Draft'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1 px-2 text-[10px] bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded flex items-center gap-1 font-bold border border-transparent"
                  >
                    <Download size={12} />
                    Download (.txt)
                  </button>
                </div>
              </div>

              {/* Printable Business Letter frame */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-xl space-y-4 font-serif leading-relaxed text-slate-800 dark:text-slate-200 max-h-[450px] overflow-y-auto">
                <div className="whitespace-pre-wrap font-sans text-xs">
                  {letter.letterContent}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
