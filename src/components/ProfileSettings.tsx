import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Save, 
  Sparkles, 
  CheckCircle, 
  Star, 
  Trash2, 
  LogOut, 
  Camera, 
  Upload, 
  RotateCcw, 
  User, 
  Phone, 
  Hash, 
  Mail, 
  Image,
  Info
} from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileSettingsProps {
  user: UserType | null;
  onUpdateUser: (userData: any) => void;
  token: string | null;
  onLogout: () => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80"
];

export default function ProfileSettings({ user, onUpdateUser, token, onLogout }: ProfileSettingsProps) {
  // Personal Details States
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [email, setEmail] = useState(user?.email || '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [mobile, setMobile] = useState(user?.mobile || '');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Profile Pic Editor Panels
  const [editorOpen, setEditorOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic review system states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hasReview, setHasReview] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      fetchMyReview();
    }
  }, [token]);

  const fetchMyReview = async () => {
    try {
      const res = await fetch('/api/reviews/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.review) {
          setRating(data.review.rating);
          setComment(data.review.comment);
          setHasReview(true);
        } else {
          setHasReview(false);
        }
      }
    } catch (e) {
      console.error("Failed to load user feedback:", e);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          fullName, 
          avatarUrl,
          email,
          age: age ? Number(age) : null,
          mobile
        })
      });

      if (!res.ok) throw new Error('Failed to update sandbox profile');
      const data = await res.json();
      
      // Notify application state
      onUpdateUser(data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Profile Pic upload triggers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const removeProfilePic = () => {
    setAvatarUrl('');
  };

  const initials = fullName
    ? fullName.trim().split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : email ? email.substring(0, 2).toUpperCase() : "AA";

  // Review Submissions
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setReviewLoading(true);
    setReviewSuccess(false);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (res.ok) {
        setReviewSuccess(true);
        setHasReview(true);
        setTimeout(() => setReviewSuccess(false), 2000);
        fetchMyReview();
      }
    } catch (err) {
      console.error("Failed to post candidate review:", err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    setReviewLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setRating(5);
        setComment('');
        setHasReview(false);
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pl-1 text-xs text-[#1e293b] dark:text-slate-100 font-sans">
      
      {/* Settings title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="text-emerald-500 animate-[spin_8s_linear_infinite]" size={24} />
          Account & Candidate Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Maintain your personal candidate details, configure your custom display photo, and shape your student portfolio identity.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Form column (Personal Details) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl h-fit space-y-5 shadow-sm">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Personal Information Details</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-mono uppercase font-bold">Workspace Active</span>
            </div>

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold flex items-center gap-1.5 leading-none">
                <CheckCircle size={14} className="shrink-0" /> Profiles and candidate details saved successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Name Details */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                  <User size={12} className="text-emerald-500" /> Full Candidate Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                />
              </div>

              {/* Gmail / Email Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Mail size={12} className="text-emerald-500" /> Gmail / Primary Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium font-mono"
                />
              </div>

              {/* Grid for Age and Mobile No. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <Hash size={12} className="text-emerald-500" /> Candidate Age
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="100"
                    placeholder="e.g. 21"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>

                {/* Mobile No Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <Phone size={12} className="text-emerald-500" /> Mobile String / Contact *
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium font-mono"
                  />
                </div>
              </div>

              {/* Invisible input field showing image location in form */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Profile Picture Data / URL</label>
                <input
                  type="text"
                  placeholder="Set via designer wheel in right-hand column"
                  value={avatarUrl ? (avatarUrl.startsWith('data:image') ? 'Uploaded Local Image File (Base64 Schema)' : avatarUrl) : 'No picture configured.'}
                  disabled
                  className="w-full text-[10px] p-2 bg-slate-100/50 dark:bg-slate-900/40 text-slate-400 border border-slate-200 dark:border-slate-800 rounded font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 rounded-xl text-xs font-black uppercase bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5"
                >
                  {loading ? <Save size={14} className="animate-spin" /> : <Save size={14} />}
                  {loading ? "Saving Details..." : "Save Candidate Details"}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Right Display Picture (DP) Editor Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl h-fit space-y-6 shadow-sm text-center">
            
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Profile Photo</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Click or hover to update your visible profile image.</p>
            </div>

            {/* DP styled circle container */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div 
                onClick={() => setEditorOpen(!editorOpen)}
                className="group relative w-40 h-40 rounded-full border-4 border-slate-100 dark:border-slate-900 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xl overflow-hidden cursor-pointer select-none transition-all duration-300 hover:scale-[1.03] active:scale-95 flex items-center justify-center hover:shadow-emerald-500/10"
                title="Change display photo"
              >
                {avatarUrl ? (
                  <img 
                    src={avatarUrl}
                    alt={fullName || "Candidate"}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // fallback if image fails
                      (e.target as any).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="font-mono font-black text-5xl tracking-tight group-hover:brightness-50 transition-all">
                    {initials}
                  </span>
                )}

                {/* Overlapped Hover Cover like standard DP */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-wider gap-1.5 text-white">
                  <Camera size={20} className="text-emerald-400 animate-pulse" />
                  <span>Change DP</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setEditorOpen(!editorOpen)}
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <Camera size={12} className="text-emerald-500" />
                  {editorOpen ? "Close Photo Drawer" : "Edit Photo"}
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={removeProfilePic}
                    className="px-3.5 py-1.5 bg-slate-50 hover:bg-red-50 dark:bg-slate-900 dark:hover:bg-rose-950/20 border dark:border-slate-800 text-rose-500 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <Trash2 size={12} />
                    Delete Photo
                  </button>
                )}
              </div>
            </div>

            {/* Collapsible Editor Dashboard panel */}
            {editorOpen && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-left space-y-4 animate-fade-in">
                
                {/* Drag and Drop Box */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Upload Local Photo File</span>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
                      isDragOver
                        ? "border-emerald-500 bg-emerald-500/5"
                        : "border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 bg-slate-50/50 dark:bg-slate-900/30"
                    }`}
                  >
                    <Upload size={20} className="mx-auto text-emerald-500 mb-1.5" />
                    <p className="text-[10px] font-bold">Drag passport photo here or click</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Saves in high resolution direct to profile</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Preset Avatars wheel */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Instant Student Designer Presets</span>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_AVATARS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(p)}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 block transition-all hover:scale-105 cursor-pointer ${
                          avatarUrl === p ? "border-emerald-500 shadow-md scale-95" : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img src={p} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        {avatarUrl === p && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle size={14} className="text-white bg-emerald-500 rounded-full" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* URL Direct Pasting */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Paste Custom Image URL</span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={avatarUrl && !avatarUrl.startsWith('data:image') ? avatarUrl : ''}
                      onChange={e => setAvatarUrl(e.target.value)}
                      className="flex-1 text-[10px] p-2 rounded border text-slate-905 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-205 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={removeProfilePic}
                        className="px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 rounded text-[10px]"
                        title="Clear URL expression"
                      >
                        <RotateCcw size={12} />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}

            <div className="bg-emerald-500/5 dark:bg-emerald-500/[0.01] p-3 border border-emerald-500/10 rounded-xl text-left text-[10px] text-slate-500 dark:text-slate-400 font-sans flex items-start gap-1.5 leading-relaxed">
              <Info size={14} className="text-emerald-505 shrink-0 mt-0.5" />
              <span>
                <strong>Profile Sync Principle:</strong> Saving your candidate details persists local and cloud records instantly. This synchronizes your display photo across review comments, workspace sidebar status bars, and the admin system dashboard.
              </span>
            </div>

          </div>
        </div>

        {/* Dynamic Review & Submission Form Card */}
        <div className="lg:col-span-12 p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl h-fit space-y-4 shadow-sm">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Share Platform Experience</span>
          <p className="text-[11px] text-slate-450 leading-relaxed">Submit a rating review. Your verified endorsement is displayed on the homepage in real-time!</p>

          {reviewSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-555 dark:text-emerald-400 rounded-xl font-bold flex items-center gap-1.5 leading-none font-sans">
              <CheckCircle size={14} /> Review record registered and updated!
            </div>
          )}

          <form onSubmit={handleSaveReview} className="space-y-4">
            
            {/* Star selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Stars Rating Awarded</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform shrink-0 cursor-pointer"
                    title={`${s} Stars`}
                  >
                    <Star 
                      size={18} 
                      fill={s <= rating ? "currentColor" : "none"}
                      className={s <= rating ? "text-amber-500" : "text-slate-300 dark:text-slate-700"}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Message inputs */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider font-mono">Feedback Critique Comment</label>
              <textarea
                required
                rows={3}
                placeholder="Review the core generator templates, parsing accuracies, roadmaps quality, or support speeds..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border text-slate-900 dark:text-white bg-slate-50 dark:bg-[#181B26] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={reviewLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Star size={14} fill="currentColor" />
                {hasReview ? "Update My Review" : "Submit Rating"}
              </button>

              {hasReview && (
                <button
                  type="button"
                  onClick={handleDeleteReview}
                  disabled={reviewLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 dark:bg-[#1E212D]/60 dark:hover:bg-[#252A3B] border dark:border-slate-800 text-rose-500 flex items-center gap-1.5 hover:border-rose-500/30 cursor-pointer"
                >
                  <Trash2 size={13} />
                  Delete Review
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Session Management / Sign Out Card */}
        <div className="lg:col-span-12 p-6 bg-rose-500/5 dark:bg-rose-500/[0.02] border border-rose-500/15 dark:border-rose-500/10 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-rose-500 font-mono flex items-center gap-2">
                <LogOut size={16} />
                Session & Security Control
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Disconnect your active session safely. This clears your local security token and returns you to the login screen.
              </p>
            </div>
            
            <button
              type="button"
              onClick={onLogout}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md shadow-rose-600/10 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <LogOut size={14} />
              Sign Out of App
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
