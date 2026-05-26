import { useState } from 'react';
import { Key, RotateCcw, Copy, Check, Trash2, FileText, Linkedin, Compass, HelpCircle, Terminal, ClipboardList } from 'lucide-react';
import { SavedGenerations as SavedType } from '../types';

interface SavedGenerationsProps {
  savedData: SavedType | null;
  onRefresh: () => void;
  onDelete: (type: string, id: string) => void;
}

export default function SavedGenerations({
  savedData,
  onRefresh,
  onDelete
}: SavedGenerationsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'resumes' | 'linkedin' | 'projects' | 'coverLetters' | 'skillGaps' | 'careerRoadmaps' | 'bullets' | 'interviews'>('resumes');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const triggerCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const tabsList = [
    { id: 'resumes', label: 'Resumes', icon: FileText, count: (savedData?.resumes || []).length },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, count: (savedData?.linkedin || []).length },
    { id: 'projects', label: 'Projects', icon: Terminal, count: (savedData?.projects || []).length },
    { id: 'coverLetters', label: 'Letters', icon: FileText, count: (savedData?.coverLetters || []).length },
    { id: 'skillGaps', label: 'Skill Gap', icon: AlertCircleIcon, count: (savedData?.skillGaps || []).length },
    { id: 'careerRoadmaps', label: 'Roadmaps', icon: Compass, count: (savedData?.careerRoadmaps || []).length },
    { id: 'bullets', label: 'Bullets', icon: ClipboardList, count: (savedData?.bullets || []).length },
    { id: 'interviews', label: 'Questions', icon: HelpCircle, count: (savedData?.interviews || []).length },
  ];

  return (
    <div className="space-y-8 animate-fade-in pl-1">
      
      {/* View Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">SaaS Code Logs & Saved Outputs</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Revisit past scans, optimized headlines, cover letters and systems layouts saved inside your sandbox database.</p>
        </div>
        <button
          onClick={onRefresh}
          className="px-2.5 py-1 text-[10px] bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-750 text-slate-500 dark:text-slate-300 rounded font-bold flex items-center gap-1.5 transition-all"
        >
          <RotateCcw size={12} />
          Refresh Database State
        </button>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Sub-tab selection row */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100 dark:border-slate-800/60 flex-wrap">
          {tabsList.map(tab => {
            const isActive = activeSubTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold select-none border border-transparent transition-all duration-150
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-500 font-bold border-l-2 border-emerald-500/30' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'}`}
              >
                <Icon size={14} />
                {tab.label}
                <span className="text-[10px] font-mono leading-none px-1 rounded bg-slate-100/80 dark:bg-slate-800/80 text-slate-500">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic lists contents */}
        <div className="space-y-4">
          
          {/* 1. Resumes list */}
          {activeSubTab === 'resumes' && (
            <div className="grid gap-4 md:grid-cols-2">
              {!savedData?.resumes.length ? <EmptyState msg="No previous resume evaluations. Upload files in ATS Scan!" /> : (
                savedData.resumes.map(r => (
                  <div key={r.id} className="p-5 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3.5 relative">
                    <button
                      onClick={() => onDelete('resumes', r.id)}
                      className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-rose-500 rounded"
                      title="Delete Record"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div>
                      <p className="text-xs font-bold text-slate-850 dark:text-slate-100 pr-5 truncate">{r.filename}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(r.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] leading-none font-mono font-bold rounded bg-emerald-500/10 text-emerald-500">
                        {r.atsScore}% ATS compatibility
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{r.overallSummary}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. LinkedIn list */}
          {activeSubTab === 'linkedin' && (
            <div className="space-y-4">
              {!savedData?.linkedin.length ? <EmptyState msg="No previous LinkedIn copies. Configure tags in Career Tuning!" /> : (
                savedData.linkedin.map(l => (
                  <div key={l.id} className="p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl relative space-y-4">
                    <button
                      onClick={() => onDelete('linkedin', l.id)}
                      className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{l.currentRole} ➜ {l.targetRole}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(l.createdAt).toLocaleString()} | {l.experienceLevel}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 text-xs">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                          <span>Headline</span>
                          <button onClick={() => triggerCopy(l.headline, l.id + '-hl')} className="text-emerald-500">
                            {copiedId === l.id + '-hl' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <p className="p-2 border rounded-lg bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 font-semibold leading-relaxed font-sans">{l.headline}</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                          <span>About Narrative</span>
                          <button onClick={() => triggerCopy(l.aboutSection, l.id + '-ab')} className="text-emerald-500">
                            {copiedId === l.id + '-ab' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <p className="p-2 border rounded-lg bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed font-sans whitespace-pre-line">{l.aboutSection}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. Projects list */}
          {activeSubTab === 'projects' && (
            <div className="grid gap-4 md:grid-cols-2">
              {!savedData?.projects.length ? <EmptyState msg="No previous project blueprints generated!" /> : (
                savedData.projects.map(p => (
                  <div key={p.id} className="p-5 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3.5 relative">
                    <button
                      onClick={() => onDelete('projects', p.id)}
                      className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div>
                      <span className="px-1.5 py-0.5 text-[9px] font-mono hover:bg-slate-100 rounded text-slate-500 border dark:border-slate-800 font-bold">{p.domain}</span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate mt-1.5 pr-6">{p.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">{p.description}</p>
                    
                    <div className="border-t pt-2 border-slate-100 dark:border-slate-850">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-400 uppercase tracking-widest text-[9px] font-bold">Resumebullet</span>
                        <button onClick={() => triggerCopy(p.resumeSummary, p.id)} className="text-emerald-500 font-semibold hover:underline">
                          {copiedId === p.id ? 'Copied' : 'Copy Bullet'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. Cover letters list */}
          {activeSubTab === 'coverLetters' && (
            <div className="grid gap-4 md:grid-cols-2">
              {!savedData?.coverLetters.length ? <EmptyState msg="No printed cover letters archived!" /> : (
                savedData.coverLetters.map(c => (
                  <div key={c.id} className="p-5 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 relative">
                    <button
                      onClick={() => onDelete('coverLetters', c.id)}
                      className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate pr-6">To {c.companyName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{c.jobTitle} | {new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-serif whitespace-pre-wrap">{c.letterContent}</p>
                    <div className="pt-2 border-t flex justify-end">
                      <button onClick={() => triggerCopy(c.letterContent, c.id)} className="text-emerald-500 text-xs font-semibold">
                        {copiedId === c.id ? 'Copied' : 'Copy Content'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 5. Skill Gaps list */}
          {activeSubTab === 'skillGaps' && (
            <div className="grid gap-4 md:grid-cols-2">
              {!(savedData?.skillGaps || []).length ? <EmptyState msg="No previous skill gap audit reports!" /> : (
                (savedData?.skillGaps || []).map(s => (
                  <div key={s.id} className="p-5 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 relative">
                    <button
                      onClick={() => onDelete('skillGaps', s.id)}
                      className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">Target: {s.targetRole}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(s.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Missing Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {(s.missingSkills || []).map((sk: string, i: number) => (
                          <span key={i} className="px-1.5 py-0.5 text-[10px] font-mono leading-none rounded bg-rose-500/10 text-rose-500 font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 6. Career Roadmaps list */}
          {activeSubTab === 'careerRoadmaps' && (
            <div className="grid gap-4 md:grid-cols-2">
              {!savedData?.careerRoadmaps.length ? <EmptyState msg="No previous 12-week roadmaps planned!" /> : (
                savedData.careerRoadmaps.map(r => (
                  <div key={r.id} className="p-5 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 relative">
                    <button
                      onClick={() => onDelete('careerRoadmaps', r.id)}
                      className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">Roadmap to {r.targetRole}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{r.currentLevel} | {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-emerald-500 font-bold uppercase leading-none">Phases Checklist</p>
                      <p className="text-xs text-slate-500 leading-snug font-sans-body">
                        {r.steps.map((st, sI) => `Phase ${sI + 1}: ${st.title}`).join(' ➜ ')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 7. Bullets Points */}
          {activeSubTab === 'bullets' && (
            <div className="space-y-3">
              {!savedData?.bullets.length ? <EmptyState msg="No previous Google XYZ tuned bullets!" /> : (
                savedData.bullets.map(b => (
                  <div key={b.id} className="p-5 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl relative space-y-3">
                    <button
                      onClick={() => onDelete('bullets', b.id)}
                      className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Source Draft</span>
                      <p className="text-xs text-slate-500 leading-relaxed italic">"{b.inputActivity}"</p>
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase block">Google XYZ Formula Accomplishments</span>
                      <div className="space-y-2">
                        {b.bullets.map((bul, bulIdx) => (
                          <div key={bulIdx} className="p-2 border rounded-lg bg-emerald-500/[0.02] border-emerald-500/10 flex items-start justify-between gap-4">
                            <p className="text-xs text-slate-705 dark:text-slate-200 leading-relaxed font-sans pr-1">{bul}</p>
                            <button onClick={() => triggerCopy(bul, b.id + bulIdx)} className="text-emerald-500 shrink-0 font-bold">
                              {copiedId === b.id + bulIdx ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 8. Interviews */}
          {activeSubTab === 'interviews' && (
            <div className="grid gap-4 md:grid-cols-2">
              {!savedData?.interviews.length ? <EmptyState msg="No previous active interview simulations!" /> : (
                savedData.interviews.map(i => (
                  <div key={i.id} className="p-5 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 relative">
                    <button
                      onClick={() => onDelete('interviews', i.id)}
                      className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate pr-6">{i.targetRole} Prep</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{i.experienceLevel} | {new Date(i.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-500 font-bold border border-transparent">
                        {i.questions.filter(q => q.feedback).length}/{i.questions.length} scored
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

// Micro inner components to handle empty lists seamlessly
function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="col-span-full py-12 text-center bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-1">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Folder ledger empty</p>
      <p className="text-[10px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
        {msg}
      </p>
    </div>
  );
}

// Mini fallback for Missing Alert icons
function AlertCircleIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
