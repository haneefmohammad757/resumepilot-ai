import React, { useState, useEffect } from 'react';
import { 
  Check, Sparkles, Zap, Award, CheckCircle, Copy, AlertTriangle, 
  ArrowRight, ShieldCheck, History, RefreshCcw, CheckSquare, XCircle, Settings 
} from 'lucide-react';
import { User } from '../types';

interface SubscriptionProps {
  user: User | null;
  token: string | null;
  onUpdateUser: (userData: any) => void;
}

export default function Subscription({ user, token, onUpdateUser }: SubscriptionProps) {
  const [selectedTier, setSelectedTier] = useState<any | null>(null);
  const [step, setStep] = useState<'pricing' | 'checkout' | 'submitted'>('pricing');
  const [txnId, setTxnId] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Ledger and simulation states
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [allPendingRequests, setAllPendingRequests] = useState<any[]>([]);
  const [showAdminConsole, setShowAdminConsole] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: 0,
      priceLabel: "₹0",
      period: "forever",
      desc: "Perfect for students planning initial job searches and portfolio mappings.",
      features: [
        "3 ATS Analyses per month",
        "3 LinkedIn Generations per month",
        "3 Project Innovations per month",
        "Basic Career Roadmap",
        "Local Database Workspace Sync"
      ],
      color: "border-slate-200 dark:border-slate-800"
    },
    {
      id: "lite",
      name: "Pilot Lite",
      price: 29,
      priceLabel: "₹29",
      period: "per month",
      desc: "Perfect for active job seekers sending standard applications.",
      features: [
        "25 ATS Analyses per month",
        "25 LinkedIn Generations per month",
        "25 Project Generations per month",
        "Cover Letter Generator included",
        "Resume Bullet Generator",
        "Standard Email Support"
      ],
      color: "border-slate-200 dark:border-slate-800"
    },
    {
      id: "pro",
      name: "Pilot Pro",
      price: 69,
      priceLabel: "₹69",
      period: "per month",
      desc: "The ultimate recruiter-ready toolkit designed for top technical placement.",
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
      color: "border-emerald-500/35 ring-2 ring-emerald-500/10 shadow-sm bg-gradient-to-b from-emerald-500/[0.02] to-transparent",
      popular: true
    },
    {
      id: "lifetime",
      name: "Pilot Pro Lifetime",
      price: 249,
      priceLabel: "₹249",
      period: "one-time",
      desc: "Complete, lifelong candidate readiness. No subscriptions, forever updates.",
      features: [
        "Lifetime access to all Pilot Pro features",
        "Lifetime career roadmap updates",
        "Early access to fresh releases",
        "Founder Member Profile Badge",
        "Priority VIP Discord support"
      ],
      color: "border-slate-200 dark:border-slate-800"
    }
  ];

  // Fetch client and simulator records
  const fetchLedgers = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/payments/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyRequests(data.requests || []);
      }

      // Admin simulator list
      const adminRes = await fetch('/api/admin/payments');
      if (adminRes.ok) {
        const adminData = await adminRes.json();
        setAllPendingRequests(adminData.requests || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, [token, user]);

  const copyUpi = () => {
    navigator.clipboard.writeText("shadow777@ptaxis");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnId.trim()) {
      setMessage("Please enter a valid Transaction Hash / UTR ID reference.");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/payments/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: selectedTier.name,
          txnId: txnId,
          amount: selectedTier.price
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStep('submitted');
        fetchLedgers();
      } else {
        setMessage(data.error || "Submission error occurred.");
      }
    } catch (err) {
      setMessage("Internal networking error.");
    } finally {
      setLoading(false);
    }
  };

  // Simulator Controls
  const simulateApproval = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/admin/payments/${id}/${action}`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchLedgers();
        // Refresh profile to update plan layout in workspace real-time
        if (token) {
          const profileRes = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profileRes.ok) {
            const up = await profileRes.json();
            if (up.user) {
              onUpdateUser(up.user);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pl-1 text-xs text-[#1e293b] dark:text-slate-100 font-sans">
      
      {/* Title block */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-555 text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-wider">
          <Award size={13} /> Pricing Matrices
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-905 dark:text-white">Fair, Student-Aligned Career Plans</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Unlock complete ATS analysis, interview questions simulators, and developer blueprint files with zero hidden locks.</p>
      </div>

      {step === 'pricing' && (
        <div className="space-y-8">
          {/* Active subscription status indicator */}
          <div className="max-w-4xl mx-auto p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-505 text-emerald-500 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-150 text-xs">Logged Subscription Tier</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Active plan level: <strong className="text-emerald-530 dark:text-emerald-400 font-bold">{user?.subscriptionPlan || "Free Plan"}</strong></p>
              </div>
            </div>
            
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {user?.email === 'haneefmohammed867@gmail.com' ? (
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-505 font-bold font-mono text-[9px] tracking-wide uppercase">
                  Automatic VIP Access Active
                </span>
              ) : (
                <span>Need more API scan allotments? Upgrade utilizing direct instant UPI.</span>
              )}
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto text-xs">
            {plans.map((tier) => {
              const isActivePlan = user?.subscriptionPlan === tier.name || 
                (tier.id === 'free' && (!user?.subscriptionPlan || user?.subscriptionPlan === 'Free'));
              
              return (
                <div 
                  key={tier.id} 
                  className={`p-6 bg-white dark:bg-[#12141C] border rounded-2xl flex flex-col justify-between relative transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md ${tier.color}
                    ${isActivePlan ? 'ring-2 ring-emerald-500 border-transparent shadow' : ''}`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 text-[8px] font-mono leading-none rounded-full bg-emerald-500 text-white font-bold tracking-wider uppercase select-none shadow">
                      Most Popular Choice
                    </span>
                  )}

                  {isActivePlan && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 text-[8px] font-mono leading-none rounded-full bg-emerald-550 text-white font-bold tracking-wider uppercase select-none shadow">
                      Your Active Plan
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        {tier.name}
                        {isActivePlan && <CheckSquare size={13} className="text-emerald-505 shrink-0" />}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">{tier.desc}</p>
                    </div>

                    <div className="flex items-baseline gap-1 py-1.5 border-y border-dashed border-slate-100 dark:border-slate-800/80">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{tier.priceLabel}</span>
                      <span className="text-[10px] text-[#94a3b8] font-medium font-sans">/ {tier.period}</span>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2.5 pt-2">
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-slate-650 dark:text-slate-350">
                          <CheckCircle size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug text-slate-500 dark:text-slate-400">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    {tier.id === 'free' ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 text-slate-400 border dark:border-slate-800 shrink-0 text-center cursor-not-allowed"
                      >
                        Default Starter Tier
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTier(tier);
                          setTxnId('');
                          setMessage('');
                          setStep('checkout');
                        }}
                        disabled={isActivePlan}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer
                          ${isActivePlan 
                            ? 'bg-slate-100 dark:bg-slate-805 text-slate-400 cursor-not-allowed border dark:border-slate-800' 
                            : tier.popular
                              ? 'bg-emerald-505 bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10'
                              : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#181B26] dark:hover:bg-[#1E2331] border dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
                      >
                        {isActivePlan ? "Logged Active" : `Claim ${tier.name}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 'checkout' && selectedTier && (
        <div className="max-w-xl mx-auto p-6 md:p-8 bg-white dark:bg-[#12141C] border border-slate-205/60 dark:border-slate-800 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800/60">
            <div>
              <h3 className="font-extrabold text-slate-905 dark:text-slate-100 text-sm">UPI Payment Instructions</h3>
              <p className="text-[10px] text-slate-400">Upgrade to {selectedTier.name} securely utilizing instant UPI</p>
            </div>
            <button
              onClick={() => setStep('pricing')}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-605"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Amount details info card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Total Due Amount</p>
                <p className="text-[10px] text-slate-450 mt-0.5">Indian Rupees (INR) transaction</p>
              </div>
              <span className="text-2xl font-black font-mono text-emerald-505 text-emerald-500">{selectedTier.priceLabel}</span>
            </div>

            {/* UPI details */}
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 space-y-3.5">
              <div className="flex items-center justify-between gap-2.5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Beneficiary UPI ID</p>
                  <p className="text-base font-extrabold text-[#1e293b] dark:text-white font-mono mt-1.5">shadow777@ptaxis</p>
                </div>
                
                <button
                  type="button"
                  onClick={copyUpi}
                  className="px-3 py-1.5 rounded-lg border dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 inline-flex items-center gap-1.5 text-[10px] font-bold cursor-pointer"
                >
                  <Copy size={13} />
                  {copied ? "Copied" : "Copy UPI"}
                </button>
              </div>

              <div className="p-3 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400 flex items-start gap-2.5 leading-snug">
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                <p className="text-[10px]">
                  <strong>Payment Process:</strong> Copy the UPI address above, open any mobile payment app (PhonePe, GPay, Paytm, BHIM), and transfer exactly <strong>{selectedTier.priceLabel}</strong>. Paste your UTR transaction reference number below to verify.
                </p>
              </div>
            </div>

            {/* Reference checkout form */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-3.5 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">UTR / Transaction Hash Reference</label>
                <input
                  type="text"
                  placeholder="Enter 12-digit UPI reference number or transaction ID"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[#1e293b] dark:text-white"
                  disabled={loading}
                />
              </div>

              {message && (
                <div className="p-3 text-xs rounded-lg font-medium text-rose-500 bg-rose-500/10">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Filing Request..." : "Submit Payment UTR"} <ArrowRight size={14} />
              </button>
            </form>

          </div>
        </div>
      )}

      {step === 'submitted' && (
        <div className="max-w-md mx-auto p-6 md:p-8 bg-white dark:bg-[#12141C] border border-slate-205/60 dark:border-slate-800 rounded-2xl shadow-xl text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-505 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle size={28} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Payment Submitted Successfully</h3>
            <p className="text-[11px] text-slate-450 mt-1 lines-snug max-w-sm mx-auto leading-relaxed">
              Your reference receipt UTR has been filed in the queue. Our platform supervisors will manually reconcile the transaction within a few hours to unlock full workspace access.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setStep('pricing');
                fetchLedgers();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-805 text-[11px] font-bold text-slate-700 dark:text-slate-350 transition-all cursor-pointer"
            >
              Back to Pricing Panel
            </button>
          </div>
        </div>
      )}

      {/* User Ledger subscription and payment history list */}
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-[#12141C] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-905 dark:text-slate-100 text-sm flex items-center gap-2">
          <History size={15} className="text-emerald-505" /> Subscription Purchase History
        </h3>
        <p className="text-[10px] text-slate-400">Reconcile verification histories for active billing actions, bought subscriptions, and past transactions</p>

        {myRequests.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-150 dark:border-slate-850 rounded-xl bg-slate-50/30 dark:bg-slate-900/10 text-slate-400">
            <History size={24} className="mx-auto text-slate-350 mb-2.5 animate-pulse" />
            <p className="text-xs font-semibold">No previous subscriptions or payment requests found</p>
            <p className="text-[10px] text-slate-400 mt-1">Upgrade your subscription plan to populate your permanent billing receipt logs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 dark:border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  <th className="py-2.5">Requested Level</th>
                  <th className="py-2.5">Reference UTR</th>
                  <th className="py-2.5">Paid Amount</th>
                  <th className="py-2.5">Purchased Date & Time</th>
                  <th className="py-2.5 font-mono">Status Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px] font-mono">
                {myRequests.map((req, i) => {
                  const reqDate = new Date(req.createdAt);
                  const formattedDateTime = reqDate.toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  });

                  return (
                    <tr key={req.id || i} className="hover:bg-slate-100/10">
                      <td className="py-3 font-bold font-sans text-slate-800 dark:text-slate-200">{req.plan}</td>
                      <td className="py-3 font-semibold text-slate-500 truncate max-w-[130px]" title={req.txnId}>{req.txnId}</td>
                      <td className="py-3 font-bold text-slate-800 dark:text-slate-200">₹{req.amount}</td>
                      <td className="py-3 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{formattedDateTime}</td>
                      <td className="py-3 font-sans">
                        {req.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-bold tracking-wide uppercase">
                            Pending Approval
                          </span>
                        )}
                        {req.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold tracking-wide uppercase">
                            Approved / Active
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[9px] font-bold tracking-wide uppercase">
                            UTR Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Simulator Console (Tester Assistant Tools) */}
      <div className="max-w-4xl mx-auto p-6 bg-slate-50/50 dark:bg-[#12141D] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <button 
          type="button"
          onClick={() => setShowAdminConsole(!showAdminConsole)}
          className="w-full flex items-center justify-between font-extrabold text-slate-905 dark:text-slate-200 text-sm cursor-pointer"
        >
          <span className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Settings size={15} className="text-emerald-500" /> Administrative Simulation Controls (QA Tester Tools)
          </span>
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
            {showAdminConsole ? "Hide Portal" : "Reveal Portal"}
          </span>
        </button>
        <p className="text-[10px] text-slate-400 mt-0.5">Use this local simulation deck to approve your UPI UTR requests in real-time for diagnostic checks</p>

        {showAdminConsole && (
          <div className="space-y-4 pt-3.5 border-t border-slate-200 dark:border-slate-800">
            {allPendingRequests.length === 0 ? (
              <div className="text-center py-6 text-slate-400 italic">
                No active UPI reconciliation requests in queue. Submit a payment receipt reference to inspect.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      <th className="py-2">User details</th>
                      <th className="py-2">Tier Level</th>
                      <th className="py-2">Submitted hash</th>
                      <th className="py-2">Amount due</th>
                      <th className="py-2">State</th>
                      <th className="py-2 text-right">System Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-[10px] font-mono">
                    {allPendingRequests.map((p, i) => (
                      <tr key={p.id || i} className="hover:bg-slate-200/10">
                        <td className="py-3 font-sans text-slate-700 dark:text-slate-300">
                          <p className="font-bold leading-none">{p.email}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5 truncate max-w-[120px]">ID: {p.userId}</p>
                        </td>
                        <td className="py-3 font-extrabold text-emerald-600 dark:text-emerald-400">{p.plan}</td>
                        <td className="py-3 text-slate-500 truncate max-w-[100px]" title={p.txnId}>{p.txnId}</td>
                        <td className="py-3 font-bold text-slate-800 dark:text-slate-200">₹{p.amount}</td>
                        <td className="py-3 font-sans">
                          {p.status === 'pending' && <span className="text-amber-500 uppercase font-bold text-[8px] tracking-wide">Pending</span>}
                          {p.status === 'approved' && <span className="text-emerald-500 uppercase font-bold text-[8px] tracking-wide">Approved</span>}
                          {p.status === 'rejected' && <span className="text-rose-500 uppercase font-bold text-[8px] tracking-wide">Rejected</span>}
                        </td>
                        <td className="py-3 text-right space-x-1.5 font-sans">
                          {p.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => simulateApproval(p.id, 'approve')}
                                className="px-2 py-1 text-[9px] font-bold bg-emerald-500 text-white hover:bg-emerald-600 rounded cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => simulateApproval(p.id, 'reject')}
                                className="px-2 py-1 text-[9px] font-semibold bg-rose-500 text-white hover:bg-rose-600 rounded cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 italic">Reconciled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
