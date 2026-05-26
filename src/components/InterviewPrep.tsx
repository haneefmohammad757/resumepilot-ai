import React, { useState } from 'react';
import { HelpCircle, Sparkles, RefreshCw, Send, Lock, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { InterviewPrep as PrepType, InterviewQuestion } from '../types';

interface InterviewPrepProps {
  onAddActivity: (act: any) => void;
  token: string | null;
}

export default function InterviewPrep({ onAddActivity, token }: InterviewPrepProps) {
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<PrepType | null>(null);

  // Active question index state
  const [activeQ, setActiveQ] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Generates questions list
  const startSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole) return;
    setLoading(true);
    setSession(null);
    setActiveQ(0);
    setUserAnswer('');

    try {
      const res = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'user-demo-123'}`
        },
        body: JSON.stringify({ targetRole, experienceLevel })
      });

      if (!res.ok) throw new Error('Interview prep query fail');
      const data = await res.json();
      setSession(data);
      onAddActivity({
        type: 'Interview Prep',
        title: `${data.targetRole} Prep Session`,
        date: data.createdAt,
        id: data.id
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Submits candidate response to Gemini for evaluation
  const submitAnswer = async () => {
    if (!session || !userAnswer.trim()) return;
    setSubmittingAnswer(true);

    try {
      const res = await fetch('/api/interview/feedback', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'user-demo-123'}`
        },
        body: JSON.stringify({
          prepId: session.id,
          questionIndex: activeQ,
          userAnswer: userAnswer
        })
      });

      if (!res.ok) throw new Error('Grade submit routine failed');
      const data = await res.json();
      
      // Update session values locally
      setSession(data.updatedPrep);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const currentQuestionList: InterviewQuestion[] = session?.questions || [];
  const currentQ: InterviewQuestion | undefined = currentQuestionList[activeQ];

  return (
    <div className="space-y-8 animate-fade-in pl-1">
      
      {/* View Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Recruiting Interview Simulator</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Practice Technical, System Design, and Behavioral HR inquiries with modern grading criteria and actionable sample structures.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left selector gate */}
        <div className="lg:col-span-4 p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl h-fit space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Simulation Parameters</h3>

          <form onSubmit={startSession} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Job Title Target *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lead Backend Engineer"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Experience Grade</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="Associate / Entry">Graduate / Entry-Level (0-2 yrs)</option>
                <option value="Mid Level">Mid-Level Specialist (2-5 yrs)</option>
                <option value="Senior Lead">Senior Principal Lead (5+ yrs)</option>
              </select>
            </div>

            <button
              type="submit"
              id="interview-generate-btn"
              disabled={loading || !targetRole}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
              {loading ? "Aligning HR Rubrics..." : "Launch Immersive Interview Simulation"}
            </button>
          </form>
        </div>

        {/* Dynamic portal area right */}
        <div className="lg:col-span-8">
          {!session && !loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[350px]">
              <HelpCircle className="text-slate-300 dark:text-slate-700 mb-2" size={40} />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Simulation portal pending</p>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                Pinpoint your target role above to load technical coding prompts, microarchitectures questions, and behavioral criteria evaluated in real-time.
              </p>
            </div>
          ) : loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center min-h-[350px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-emerald-500 animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Aligning interview questions schemas...</p>
              <p className="text-[10px] text-zinc-400 mt-1 max-w-xs">
                Leveraging Google Gemini to create real-world technical and STAR-behavioral questions targeted for {targetRole} pipelines.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden animate-fade-in divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              
              {/* Simulation Header */}
              <div className="p-5 flex items-center justify-between bg-slate-50/50 dark:bg-[#161821]">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-sans">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-450 font-mono">Live {targetRole} Session</span>
                </div>
                
                {/* Visual tabs selectors */}
                <div className="flex items-center gap-1">
                  {currentQuestionList.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setActiveQ(i);
                        setUserAnswer(currentQuestionList[i].userAnswer || '');
                      }}
                      className={`px-3 py-1 font-mono hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-semibold transition-all ${activeQ === i ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10' : 'text-slate-400 border border-transparent'}`}
                    >
                      Question {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active question card and type tag */}
              {currentQ && (
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono leading-none rounded bg-emerald-500/10 text-emerald-500 font-bold tracking-widest uppercase">
                      {currentQ.type} Question
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed font-sans">
                      {currentQ.question}
                    </h4>
                  </div>

                  {/* Submission text area */}
                  <div className="space-y-1.5 font-sans pt-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Candidate Answer response</label>
                    <textarea
                      placeholder="Type your thorough professional answer here. Detail your STAR-method constraints or architectural selections..."
                      rows={6}
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      disabled={submittingAnswer || !!currentQ.feedback}
                      className="w-full text-xs p-3 border rounded-xl font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Button bar */}
                  {!currentQ.feedback ? (
                    <button
                      onClick={submitAnswer}
                      disabled={submittingAnswer || !userAnswer.trim()}
                      className="px-4 py-2 font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs disabled:opacity-40 shadow-md shadow-emerald-500/10 flex items-center gap-2.5 transition-all"
                    >
                      {submittingAnswer ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                      {submittingAnswer ? "Evaluating Answer Strategy..." : "Submit Answer to AI Recruiter"}
                    </button>
                  ) : (
                    <div className="space-y-3.5 pt-3 animate-fade-in font-sans leading-relaxed text-xs">
                      
                      {/* Interactive grading banner */}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">AI Evaluator Scorecard & Feedback</span>
                      <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] text-slate-600 dark:text-slate-300">
                        <div className="whitespace-pre-wrap font-sans leading-relaxed text-xs">
                          {currentQ.feedback}
                        </div>
                      </div>

                      {/* Golden model answer panel */}
                      <div className="p-4 rounded-xl border dark:border-slate-850 bg-slate-50 dark:bg-[#151821] space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Recruiter Golden Standard Model Answer</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 tracking-wide font-medium italic">
                          "{currentQ.modelAnswer}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </div>

    </div>
  );
}
