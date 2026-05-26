import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, FileText, Linkedin, Briefcase, FolderHeart, Terminal, 
  AlertCircle, Map, HelpCircle, ArrowRight, Check, Star, ShieldCheck, 
  ChevronDown, ChevronUp, Sun, Moon, Sparkle, Globe, UserCheck, Play, 
  Shield, Laptop, Compass, Award, Rocket, CheckCircle
} from 'lucide-react';
import LoginForm from './LoginForm';

interface LandingPageProps {
  onLoginSuccess: (token: string, userData: any) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function LandingPage({ onLoginSuccess, theme, toggleTheme }: LandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [demoLoading, setDemoLoading] = useState(false);
  const [stats, setStats] = useState<{
    resumesAnalyzed: number;
    linkedinOptimized: number;
    projectsGenerated: number;
    interviewsCompleted: number;
  } | null>(null);

  useEffect(() => {
    // Fetch review testimonials
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.reviews) {
          setReviews(data.reviews);
        }
      })
      .catch(err => console.error("Failed to load reviews:", err));

    // Fetch dynamic database-driven analytics
    fetch('/api/public/stats')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStats(data);
        }
      })
      .catch(err => console.error("Failed to load public stats:", err));
  }, []);

  const isStatsZero = !stats || (
    (stats.resumesAnalyzed || 0) === 0 &&
    (stats.linkedinOptimized || 0) === 0 &&
    (stats.projectsGenerated || 0) === 0 &&
    (stats.interviewsCompleted || 0) === 0
  );

  const handleTryLiveDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch('/api/auth/oauth-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: "demo-guest@resumepilot.ai",
          fullName: "Demo Candidate",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Live demo failed to boot');
      }
      onLoginSuccess(data.token, data.user);
    } catch (e: any) {
      console.error("Failed to boot live demo:", e.message);
    } finally {
      setDemoLoading(false);
    }
  };

  const features = [
    {
      icon: FileText,
      title: "ATS Resume Analyzer",
      desc: "Upload your CV to extract text, find missing high-value keywords, get structural grades, and optimize formatting for employer screening algorithms.",
      color: "text-emerald-500 bg-emerald-500/10"
    },
    {
      icon: Linkedin,
      title: "LinkedIn Optimizer",
      desc: "Generate professional headline formulas, comprehensive summaries, and bulleted expertise tags engineered to increase visibility by recruiter searches.",
      color: "text-blue-500 bg-blue-500/10"
    },
    {
      icon: Briefcase,
      title: "Resume Bullet Generator",
      desc: "Convert basic task listings into active verb-driven achievement metrics using Google XYZ formula criteria (Accomplished [X] as measured by [Y] by doing [Z]).",
      color: "text-amber-500 bg-amber-500/10"
    },
    {
      icon: FolderHeart,
      title: "Cover Letter Generator",
      desc: "Draft personalized, industry-specific cover letters adjusted seamlessly to job roles, target companies, and your individual history.",
      color: "text-rose-500 bg-rose-500/10"
    },
    {
      icon: Terminal,
      title: "AI Project Generator",
      desc: "Generate comprehensive portfolio design blueprints from specialized domains like AI/ML, Java, Web Dev, Cybersecurity, Cloud, and Data Science.",
      color: "text-purple-500 bg-purple-500/10"
    },
    {
      icon: AlertCircle,
      title: "Skill Gap Analyzer",
      desc: "Contrast your passive knowledge set with target job decoders to extract strict, prioritized courses and technical topics you need to study.",
      color: "text-indigo-500 bg-indigo-505/10 text-indigo-500"
    },
    {
      icon: Map,
      title: "Career Roadmap",
      desc: "Create week-by-week transition milestones to guide your prep from college studies, fresh graduate job seeking, or internship hunting.",
      color: "text-pink-500 bg-pink-500/10"
    },
    {
      icon: HelpCircle,
      title: "Interview Preparation Suite",
      desc: "Simulate questions mapped to Technical, HR, DSA, or System Design levels, submit your practice explanations, and receive Gemini-based grading scores.",
      color: "text-cyan-500 bg-cyan-500/10"
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Upload Resume",
      desc: "Instantly drop your PDF or text CV into our smart sandbox. We parse key variables and extract raw metrics immediately.",
      badge: "Step 1"
    },
    {
      num: "02",
      title: "Get ATS Score",
      desc: "See where your CV ranks in real time. Access instant formatting, structure, and keyword density scores aligned with top ATS screening algorithms.",
      badge: "Step 2"
    },
    {
      num: "03",
      title: "Optimize LinkedIn",
      desc: "Convert passive profiles to magnet headlines, custom summaries, and professional badges that immediately stand out to verified hiring partners.",
      badge: "Step 3"
    },
    {
      num: "04",
      title: "Identify Skill Gaps",
      desc: "Crosscheck your current qualifications against active market job listings. Get a detailed gap analysis of what skills are keeping you from landing the interview.",
      badge: "Step 4"
    },
    {
      num: "05",
      title: "Generate Projects",
      desc: "Generate production-grade portfolio engineering guides (AI/ML, Web, DevOps) complete with full relational schemas, architecture designs, and milestones.",
      badge: "Step 5"
    },
    {
      num: "06",
      title: "Master Mock Prep",
      desc: "Simulate real-world technical and behavioral questions under live graded environments with detailed structural advice powered by Gemini feedback.",
      badge: "Step 6"
    }
  ];

  const faqs = [
    {
      q: "How does the ATS Resume Analyzer evaluate my score?",
      a: "It parses your resume text structure and cross-checks it with target recruiter criteria. It evaluates layout spacing, missing high-impact technical keywords, active verbs usage, and suggests granular additions to help you score above standard ATS filtering cutoffs."
    },
    {
      q: "Can I use the local Sandbox database for my mock prep?",
      a: "Yes! ResumePilot AI runs within a sandboxed environment with persistent local storage meaning you can try out all features like project generation and roadmap creation instantly on startup without waiting for complex database pipelines."
    },
    {
      q: "What is the Google XYZ formula for resume bullet points?",
      a: "It's an elite resume standard designed by Google: 'Accomplished [X] as measured by [Y], by doing [Z]'. Our Bullet Generator takes your plain description, identifies the metrics, and rewrites the bullet with active language and high mathematical impact."
    },
    {
      q: "What limits are set on the Free Plan versus Premium plans?",
      a: "The Free plan provides 3 edits/scans per month for essential tasks, Pilot Lite grants 25 evaluations, and Pilot Pro provides completely Unlimited ATS scans, LinkedIn optimizations, Roadmaps, projects, and the complete Interview Prep suite."
    }
  ];

  // Pricing plans in INR kept completely unchanged as requested
  const pricingPlans = [
    {
      name: "Free Plan",
      price: "₹0",
      period: "forever",
      desc: "Kickstart your core profile alignment with vital CV assets.",
      features: [
        "3 ATS Analyses per month",
        "3 LinkedIn Generations per month",
        "3 Project Ideas per month",
        "Basic Career Roadmap",
        "Local Database Persistence"
      ],
      cta: "Launch Workspace",
      popular: false
    },
    {
      name: "Pilot Lite",
      price: "₹29",
      period: "per month",
      desc: "For active candidates applying to standard starter pipelines.",
      features: [
        "25 ATS Analyses per month",
        "25 LinkedIn Generations per month",
        "25 Project Generations per month",
        "Cover Letter Generator included",
        "Resume Bullet Generator",
        "Standard Email Support"
      ],
      cta: "Acquire Lite Upgrade",
      popular: false
    },
    {
      name: "Pilot Pro",
      price: "₹69",
      period: "per month",
      desc: "Our most chosen suite for aggressive job seekers wanting full leverage.",
      features: [
        "Unlimited ATS Analyses",
        "Unlimited LinkedIn Optimizations",
        "Unlimited Project Generations",
        "Unlimited Cover Letters",
        "Skill Gap Analyzer active",
        "Career Roadmap Generator",
        "Interview Preparation Suite",
        "Priority AI Processing speeds"
      ],
      cta: "Upgrade to Pro Suite",
      popular: true
    },
    {
      name: "Pilot Pro Lifetime",
      price: "₹249",
      period: "one-time",
      desc: "For ambitious students planning multi-year preparation trajectories.",
      features: [
        "Lifetime access to all Pilot Pro features",
        "Lifetime platform updates",
        "Early access to new releases",
        "Founder Member Profile Badge",
        "Exclusive VIP Discord board"
      ],
      cta: "Claim Lifetime Access",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08090D] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Sticky Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#08090D]/80 border-b border-slate-100 dark:border-slate-900/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white font-mono font-bold text-base shadow-sm">
              R
            </div>
            <span className="font-sans font-bold text-base tracking-tight text-slate-900 dark:text-white">
              Resume<span className="text-emerald-500">Pilot</span> AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-emerald-500 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-500 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-emerald-500 transition-colors">Pricing & Plans</a>
            <a href="#faq" className="hover:text-emerald-500 transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} />}
            </button>
            
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-205 dark:border-slate-800 transition-all shadow-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="hidden sm:inline-flex px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/10"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Upgraded Modern SaaS Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-24 md:pb-24 px-6 max-w-7xl mx-auto">
        {/* Colorful background gradient blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/5 dark:bg-emerald-500/[0.02] blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 right-20 w-[200px] h-[200px] bg-blue-500/[0.02] blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text body */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.08] tracking-tight font-sans">
              Build Your Career <br className="hidden sm:inline" />
              With Confidence.
            </h1>
            
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl lg:mx-0 mx-auto leading-relaxed font-sans font-normal">
              ResumePilot AI helps students and professionals improve resumes, optimize LinkedIn profiles, generate portfolio projects, identify skill gaps, and prepare for interviews from one unified workspace.
            </p>

            {/* Interactive CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleTryLiveDemo}
                disabled={demoLoading}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 disabled:opacity-50"
              >
                {demoLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Booting Live Sandbox...
                  </>
                ) : (
                  <>
                    <Play size={13} fill="currentColor" /> Try Live Demo
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-black text-slate-805 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-md shadow-slate-100 dark:shadow-none hover:-translate-y-0.5"
              >
                Get Started Free
              </button>
            </div>

            {/* Core Trust Badges requested */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-150 dark:border-slate-900/40 text-center lg:text-left max-w-sm lg:max-w-none">
              <div className="flex items-center justify-center lg:justify-start gap-1 text-[11px] font-bold text-slate-505 dark:text-slate-450 leading-none">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>ATS Optimized</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1 text-[11px] font-bold text-slate-505 dark:text-slate-450 leading-none">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1 text-[11px] font-bold text-slate-505 dark:text-slate-450 leading-none">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>Student Friendly</span>
              </div>
            </div>
          </div>

          {/* Interactive Workspace visualizer representation (Anti-AI-Slop design) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-md bg-white dark:bg-[#0A0C12] border border-slate-150 dark:border-slate-850 rounded-xl p-6 shadow-xl space-y-4">
              
              {/* Fake dashboard tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 block" />
                  <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500">
                    workspace / transition-flow
                  </span>
                </div>
                <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[9px] font-bold tracking-wider">
                  FLOW ACTIVE
                </div>
              </div>

              {/* Genuine product workflow pipeline preview */}
              <div className="space-y-4">
                {[
                  { label: "Resume Uploaded", subtitle: "Parsing resume structure and experience schemas", status: "completed" },
                  { label: "ATS Analysis Complete", subtitle: "Validating keyword density and Google XYZ milestones", status: "completed" },
                  { label: "LinkedIn Optimized", subtitle: "Injecting high-impact search formula headlines", status: "completed" },
                  { label: "Project Generated", subtitle: "Structuring deep technical portfolio blueprints", status: "completed" },
                  { label: "Interview Preparation Ready", subtitle: "Generating interactive behavioral mock simulations", status: "active" }
                ].map((step, idx, arr) => (
                  <div key={idx} className="relative flex gap-3 text-xs text-left">
                    {/* Visual Connector line between workflow components */}
                    {idx < arr.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-16px] w-[1px] bg-slate-150 dark:bg-slate-850" />
                    )}
                    
                    {/* Step Icon Indicator */}
                    <div className="shrink-0 mt-0.5">
                      {step.status === "completed" ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-semibold tracking-tight ${
                          step.status === "completed" 
                            ? "text-slate-900 dark:text-slate-100" 
                            : "text-blue-600 dark:text-blue-400 font-bold"
                        }`}>
                          {step.label}
                        </span>
                        {step.status === "completed" ? (
                          <span className="text-[9px] font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.2 rounded">Done</span>
                        ) : (
                          <span className="text-[9px] font-mono font-medium text-blue-600 dark:text-blue-400 uppercase bg-blue-500/10 px-1.5 py-0.2 rounded animate-pulse">Active</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>



      {/* Visual Career Journey requested */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-[#07080C] text-xs">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full select-none">VISUAL WORKFLOW PATH</span>
            <h2 className="text-2xl sm:text-3.5xl font-black text-slate-900 dark:text-white tracking-tight">Your Transition Roadmap — Step by Step</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Follow the path from basic credentials to premium custom engineering assets and verified interview performance.</p>
          </div>

          {/* Interactive timeline grid cards */}
          <div className="relative">
            {/* Dashed connecting border for desktop layouts */}
            <div className="hidden lg:block absolute top-[120px] left-[5%] right-[5%] h-0.5 border-t border-dashed border-slate-200 dark:border-slate-800 -z-0" />

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 relative z-10">
              {steps.map((st, sI) => (
                <div 
                  key={sI} 
                  className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-850 rounded-2xl p-5 hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-2xl text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors leading-none">
                        {st.num}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-mono font-bold leading-none">
                        {st.badge}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-[#111827] dark:text-white group-hover:text-emerald-500 transition-colors text-xs">
                      {st.title}
                    </h4>
                    
                    <p className="text-[11px] leading-relaxed text-[#64748b] dark:text-slate-400">
                      {st.desc}
                    </p>
                  </div>

                  {/* Downward indicator between cards for small devices and custom arrow for lg */}
                  <div className="pt-2 text-center text-slate-300 dark:text-slate-800">
                    <span className="lg:hidden text-lg">↓</span>
                    <span className="hidden lg:inline group-last:hidden text-sm">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Feature Showcase Grid kept completely intact but redesign layout */}
      <section id="features" className="py-20 bg-slate-50/50 dark:bg-[#090C12] border-t border-slate-155 dark:border-slate-900/60 transition-colors">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-2 max-w-xl mx-auto col-span-full">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full select-none">AI ACCELERATION SUITE</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Formulate Your Professional Edge</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Everything early-career candidates need to transition from classroom theories to professional landing offers.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4 text-xs">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 bg-white dark:bg-[#11141E] border border-slate-150 dark:border-slate-850 rounded-2xl space-y-4 hover:shadow-md hover:border-emerald-500/25 dark:hover:border-emerald-500/15 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`p-2.5 rounded-xl w-fit ${feat.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-sans">{feat.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{feat.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section kept intact */}
      <section className="py-20 bg-white dark:bg-[#07080C] border-y border-slate-150 dark:border-slate-900/60 transition-colors">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold">CANDIDATE REVIEWS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Empowering Job-Seekers Globally</h2>
            <p className="text-xs text-[#64748b] dark:text-slate-400">Authentic reviews pulled directly from our database of verified early-career professionals.</p>
          </div>

          {reviews.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 max-w-md mx-auto">
              <p className="font-sans text-xs font-bold text-slate-800 dark:text-slate-200">No client reviews submitted yet</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Be the first to optimize your ATS score and leave a rating check directly inside your active Workspace dashboard.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-6 text-xs">
              {reviews.map((rev, rI) => {
                const firstName = rev.fullName ? rev.fullName.trim().split(" ")[0] : "Candidate";
                const initials = rev.fullName 
                  ? rev.fullName.trim().split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)
                  : "C";
                return (
                  <div 
                    key={rev.id || rI} 
                    className="p-6 bg-slate-50/50 dark:bg-[#11141E] border border-slate-100 dark:border-slate-850 rounded-2xl space-y-4 flex flex-col justify-between hover:shadow-lg transition-all border-dashed"
                  >
                    <div className="space-y-2 leading-relaxed text-slate-600 dark:text-slate-300">
                      <div className="flex text-amber-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            fill={i < rev.rating ? "currentColor" : "none"} 
                            className={i < rev.rating ? "text-amber-500" : "text-slate-300 dark:text-slate-700"}
                          />
                        ))}
                      </div>
                      <p className="font-medium font-sans text-slate-850 dark:text-slate-200">"{rev.comment}"</p>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 font-sans">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 uppercase border border-emerald-500/10">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans font-bold text-slate-900 dark:text-white leading-none">{firstName}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-1">Verified Candidate</p>
                        <p className="text-[9px] font-mono text-emerald-500 font-bold mt-0.5 leading-none">
                          Logged on {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Pricing Matrix Section kept 100% intact */}
      <section id="pricing" className="py-20 bg-slate-50/50 dark:bg-[#090C12] max-w-7xl mx-auto px-6 space-y-12 border-t border-slate-150 dark:border-slate-900/60">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold">FAIR RECRUITER PRICING</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">One Simple Hub. Student Friendly Rates</h2>
          <p className="text-xs text-[#64748b] dark:text-slate-400">Achieve premium AI-driven candidate templates under accessible pricing plans with no surprise lock-ins.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4 text-xs">
          {pricingPlans.map((plan, pIdx) => (
            <div 
              key={pIdx}
              className={`p-6 bg-white dark:bg-[#11141E] border rounded-2xl flex flex-col justify-between relative transition-all duration-305 hover:translate-y-[-2px] hover:shadow-md
                ${plan.popular 
                  ? 'border-emerald-500/40 ring-2 ring-emerald-500/5 shadow-sm bg-gradient-to-b from-emerald-500/[0.015] to-transparent' 
                  : 'border-slate-200 dark:border-slate-800/80'}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 text-[8px] font-mono leading-none rounded-full bg-emerald-500 text-white font-bold tracking-wider uppercase select-none shadow">
                  Most Popular choice
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{plan.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 py-1.5 border-y border-dashed border-slate-100 dark:border-slate-800/80">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{plan.price}</span>
                  <span className="text-[10px] text-[#94a3b8] font-medium font-sans">/ {plan.period}</span>
                </div>

                <div className="space-y-2.5 pt-2">
                  {plan.features.map((feat, fI) => (
                    <div key={fI} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug text-slate-500 dark:text-slate-400">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer
                    ${plan.popular
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/15'
                      : 'bg-slate-50 hover:bg-slate-105 dark:bg-[#181B26] dark:hover:bg-[#1E2331] border dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section kept completely intact */}
      <section id="faq" className="py-20 bg-white dark:bg-[#07080C] border-y border-slate-150 dark:border-slate-900/60 transition-colors">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-2 max-w-xl mx-auto col-span-full">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full select-none">STUDENT SUPPORT FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Got Questions? We’ve Got Answers</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Everything about structural parsing checks, privacy sandbox modes, and template customization.</p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="py-4 text-xs">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left py-2 font-bold text-slate-900 dark:text-white hover:text-emerald-500 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={14} className="text-[#64748b]" /> : <ChevronDown size={14} className="text-[#64748b]" />}
                  </button>
                  {isOpen && (
                    <div className="pt-2 pb-3 text-slate-500 dark:text-slate-400 font-sans leading-relaxed text-[11px] pr-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action Footer Card Section */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 rounded-3xl -z-10 blur-3xl pointer-events-none" />
        
        <div className="p-8 md:p-12 rounded-3xl bg-white dark:bg-[#0E1118] border border-slate-205 dark:border-slate-800/80 shadow-2xl space-y-6 relative z-10">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold tracking-wider font-mono uppercase">
              <UserCheck size={11} /> 100% Student Optimized
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            Start Your Career Acceleration Journey
          </h2>
          <p className="text-xs text-slate-505 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Configure your professional workspace today. Build high scoring resume outputs, robust project schemas, and clear developer career maps.
          </p>
          
          <div className="pt-2">
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/15 flex items-center gap-2 mx-auto cursor-pointer"
            >
              Access Your Pilot Workspace <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Core Copyright Footer */}
      <footer className="py-8 border-t border-slate-200/60 dark:border-slate-900/40 text-center text-[10px] text-slate-400 font-mono">
        <p>© 2026 ResumePilot AI. Launch Your Career with AI. Built for exceptional software candidates.</p>
      </footer>

      {/* Auth Overlay Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-[#11141D] rounded-2xl shadow-2xl border dark:border-slate-800 overflow-hidden">
            {/* Close Circle Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 z-50 p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all text-sm font-bold w-6 h-6 flex items-center justify-center cursor-pointer"
              title="Close System Modal"
            >
              ✕
            </button>
            
            <div className="overflow-y-auto max-h-[90vh]">
              <LoginForm 
                onLoginSuccess={(tok, usr) => {
                  setShowAuthModal(false);
                  onLoginSuccess(tok, usr);
                }} 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
