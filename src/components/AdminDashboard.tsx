import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, TrendingUp, CreditCard, Clock, CheckCircle, 
  XCircle, RefreshCw, Search, Mail, FileText, Calendar, Layers, 
  ShieldAlert, MessageSquare, Star, Award, EyeOff, UserCheck, Trash2
} from 'lucide-react';

interface PaymentRequest {
  id: string;
  userId: string;
  email: string;
  plan: string;
  txnId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface RegisterUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  subscriptionPlan: string;
  createdAt: string;
  isDemo: boolean;
}

interface ReviewItem {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  status?: 'pending' | 'approved' | 'rejected' | 'hidden' | 'featured';
  createdAt: string;
  moderationHistory?: Array<{
    moderator: string;
    action: string;
    timestamp: string;
  }>;
}

interface AdminMetrics {
  totalUsers: number;
  activeSubscriptions: number;
  revenueCollected: number;
  pendingPayments: number;
}

interface AdminDashboardProps {
  token: string | null;
}

export default function AdminDashboard({ token }: AdminDashboardProps) {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalUsers: 0,
    activeSubscriptions: 0,
    revenueCollected: 0,
    pendingPayments: 0,
  });
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisterUser[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [reviewActionMap, setReviewActionMap] = useState<Record<string, boolean>>({});

  // Navigation & filtration
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [activeSection, setActiveSection] = useState<'billing' | 'reviews' | 'users'>('billing');
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [reviewSearchTerm, setReviewSearchTerm] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState<string>('all');

  const founderData = {
    name: "Mohammad Haneef",
    role: "Founder & Creator of ResumePilot AI",
    subscription: "Pilot Pro Lifetime",
    badge: "Founder Account",
    bio: "Computer Science student and AI enthusiast building ResumePilot AI to help students, fresh graduates, and job seekers improve resumes, optimize LinkedIn profiles, generate portfolio projects, identify skill gaps, and prepare for interviews."
  };

  const fetchAdminData = async (isRef = false) => {
    if (isRef) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // 1. Fetch Admin Metrics
      const metricsRes = await fetch('/api/admin/metrics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!metricsRes.ok) {
        if (metricsRes.status === 403) {
          throw new Error("Access Denied: Only haneefmohammed867@gmail.com holds administrative access.");
        }
        throw new Error(`Failed to load metrics (${metricsRes.status})`);
      }
      const metricsData = await metricsRes.json();
      setMetrics(metricsData);

      // 2. Fetch Payments Queue
      const paymentsRes = await fetch('/api/admin/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!paymentsRes.ok) {
        throw new Error(`Failed to fetch payments queue (${paymentsRes.status})`);
      }
      const paymentsData = await paymentsRes.json();
      setPayments(paymentsData.requests || []);

      // 3. Fetch Registered Users
      const usersRes = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setRegisteredUsers(usersData.users || []);
      }

      // 4. Fetch Reviews
      const reviewsRes = await fetch('/api/admin/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || []);
      }

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while compiling administrative ledgers.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  // Billing Actions
  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${action} payment request.`);
      }
      await fetchAdminData(true);
    } catch (err: any) {
      alert(err.message || "Action failed. Please refresh and try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Review Moderation Actions
  const handleReviewAction = async (id: string, action: 'approve' | 'reject' | 'hide' | 'feature') => {
    const loadingKey = `${id}_${action}`;
    setReviewActionMap(prev => ({ ...prev, [loadingKey]: true }));
    try {
      const res = await fetch(`/api/admin/reviews/${id}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to perform ${action} action on review.`);
      }
      await fetchAdminData(true);
    } catch (err: any) {
      alert(err.message || "Failed to moderate review.");
    } finally {
      setReviewActionMap(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Metrics empty states handlers
  const renderMetricValue = (val: number, isCurrency = false) => {
    if (val === 0) {
      return (
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 italic block mt-1">
          No data available yet
        </span>
      );
    }
    return (
      <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
        {isCurrency ? `₹${val}` : val}
      </p>
    );
  };

  // Filtration selectors
  const filteredPayments = payments
    .filter(pay => pay.status === activeTab)
    .filter(pay => {
      const query = searchTerm.toLowerCase().trim();
      if (!query) return true;
      return (
        pay.email.toLowerCase().includes(query) ||
        pay.txnId.toLowerCase().includes(query) ||
        pay.plan.toLowerCase().includes(query)
      );
    });

  const filteredUsers = registeredUsers.filter(u => {
    const query = userSearchTerm.toLowerCase().trim();
    if (!query) return true;
    return (
      u.email.toLowerCase().includes(query) ||
      (u.fullName || '').toLowerCase().includes(query) ||
      u.subscriptionPlan.toLowerCase().includes(query)
    );
  });

  const filteredReviews = reviews
    .filter(r => {
      if (reviewStatusFilter === 'all') return true;
      const status = r.status || 'pending';
      return status === reviewStatusFilter;
    })
    .filter(r => {
      const query = reviewSearchTerm.toLowerCase().trim();
      if (!query) return true;
      return (
        r.fullName.toLowerCase().includes(query) ||
        r.comment.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query)
      );
    });

  const getPaymentCount = (status: 'pending' | 'approved' | 'rejected') => {
    return payments.filter(p => p.status === status).length;
  };

  const getReviewCount = (status: string) => {
    if (status === 'all') return reviews.length;
    return reviews.filter(r => (r.status || 'pending') === status).length;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-mono tracking-tight">
          Securing credential tunnels and querying administrative tables...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center p-8 bg-red-500/5 border border-red-500/15 dark:border-red-500/10 rounded-2xl space-y-4 my-8">
        <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">administrative access restricted</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          {error}
        </p>
        <button
          onClick={() => fetchAdminData()}
          className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition"
        >
          Retry Verification Channel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-full">
      {/* Founder Spotlight Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="relative z-10 space-y-3 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 shadow">
            <Shield size={10} />
            {founderData.badge}
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
            Welcome, System Administrator <span className="text-emerald-400">{founderData.name}</span>
          </h2>
          <p className="text-slate-300 text-xs font-medium leading-relaxed">
            {founderData.bio}
          </p>
          <div className="pt-1.5 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-1 text-xs font-semibold text-slate-400 font-mono">
            <span>Creator Role: <strong className="text-white font-sans">{founderData.role}</strong></span>
            <span>Accredited Plan: <strong className="text-emerald-400 font-sans">{founderData.subscription}</strong></span>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-center w-24 h-24 rounded-full border-4 border-slate-800 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-mono font-black text-3xl shadow-lg select-none">
          MH
        </div>
      </div>

      {/* Main Sections Switcher Router */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800/80 pb-0.5 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveSection('billing')}
          className={`px-4 py-3 text-xs font-black tracking-wider uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap
            ${activeSection === 'billing' 
              ? 'border-emerald-500 text-slate-900 dark:text-white font-extrabold' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
        >
          <CreditCard size={15} />
          SaaS Billing & metrics
        </button>
        <button
          onClick={() => setActiveSection('reviews')}
          className={`px-4 py-3 text-xs font-black tracking-wider uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap
            ${activeSection === 'reviews' 
              ? 'border-emerald-500 text-slate-900 dark:text-white font-extrabold' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
        >
          <MessageSquare size={15} />
          Review moderation
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full font-mono min-w-5 text-center">
            {reviews.filter(r => (r.status || 'pending') === 'pending').length}
          </span>
        </button>
        <button
          onClick={() => setActiveSection('users')}
          className={`px-4 py-3 text-xs font-black tracking-wider uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap
            ${activeSection === 'users' 
              ? 'border-emerald-500 text-slate-900 dark:text-white font-extrabold' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
        >
          <Users size={15} />
          User directory
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
            {registeredUsers.length}
          </span>
        </button>
      </div>

      {activeSection === 'billing' && (
        <div className="space-y-8 animate-fade-in">
          {/* Dynamic SaaS Analytics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="p-5 bg-white dark:bg-[#12141C] border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl shrink-0">
                <Users size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest font-mono">Total Users</span>
                {renderMetricValue(metrics.totalUsers)}
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#12141C] border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest font-mono">Active Subscriptions</span>
                {renderMetricValue(metrics.activeSubscriptions)}
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#12141C] border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl shrink-0">
                <CreditCard size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest font-mono">Revenue Collected</span>
                {renderMetricValue(metrics.revenueCollected, true)}
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#12141C] border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-440 dark:text-slate-500 uppercase tracking-widest font-mono">Pending Payments</span>
                {renderMetricValue(metrics.pendingPayments)}
              </div>
            </div>
          </div>

          {/* Main Billing Operations Panel */}
          <div className="bg-white dark:bg-[#12141C] border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-sm overflow-hidden space-y-6 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2
                    ${activeTab === 'pending'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-905'}`}
                >
                  Pending Payments
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none font-black
                    ${activeTab === 'pending' ? 'bg-amber-500/20 text-amber-750 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {getPaymentCount('pending')}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('approved')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2
                    ${activeTab === 'approved' 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-905'}`}
                >
                  Approved Payments
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-mono leading-none font-bold">
                    {getPaymentCount('approved')}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2
                    ${activeTab === 'rejected' 
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 font-extrabold' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-905'}`}
                >
                  Rejected Payments
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-mono leading-none font-bold">
                    {getPaymentCount('rejected')}
                  </span>
                </button>
              </div>

              <div className="relative w-full lg:w-72">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Search user email or UTR..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {filteredPayments.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-50/50 dark:bg-[#181B26]/20 rounded-2xl border border-dashed border-slate-100 dark:border-slate-810">
                <Layers className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching payments found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  No payment queues match your query constraints. Use other filters or update the search query.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse hidden md:table">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
                      <th className="py-3 px-4">User Email</th>
                      <th className="py-3 px-4">Plan Selected</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">UTR/Txn Reference ID</th>
                      <th className="py-3 px-4">Submitted Date</th>
                      {activeTab === 'pending' && <th className="py-3 px-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/40 text-xs">
                    {filteredPayments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-205">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                              <Mail size={12} />
                            </div>
                            <span>{pay.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] tracking-wide">
                            <Layers size={10} />
                            {pay.plan}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-extrabold text-slate-800 dark:text-slate-100">
                          ₹{pay.amount}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300 rounded font-semibold select-all">
                            {pay.txnId}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                          {new Date(pay.createdAt).toLocaleString()}
                        </td>
                        {activeTab === 'pending' && (
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                disabled={actionLoadingId !== null}
                                onClick={() => handleAction(pay.id, 'reject')}
                                className="px-3 py-1.5 bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                              >
                                <XCircle size={12} />
                                Reject
                              </button>
                              
                              <button
                                type="button"
                                disabled={actionLoadingId !== null}
                                onClick={() => handleAction(pay.id, 'approve')}
                                className="px-3 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm shadow-emerald-500/10 disabled:opacity-50"
                              >
                                <CheckCircle size={12} />
                                Approve
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile view cards vertical stack */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {filteredPayments.map((pay) => (
                    <div key={pay.id} className="p-4 bg-slate-50 dark:bg-[#181B26]/40 border border-slate-105 dark:border-slate-800/80 rounded-2xl space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{pay.email}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(pay.createdAt).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/40 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider font-bold">Plan</span>
                          <span className="font-bold text-slate-750 dark:text-slate-205">{pay.plan}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider font-bold">Amount</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-100">₹{pay.amount}</span>
                        </div>
                        <div className="col-span-2 mt-1">
                          <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider font-bold">UTR number</span>
                          <span className="font-mono font-bold text-slate-655 dark:text-slate-300 block select-all break-all bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-810 p-1.5 rounded-lg mt-0.5 text-xs">
                            {pay.txnId}
                          </span>
                        </div>
                      </div>

                      {activeTab === 'pending' && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            type="button"
                            disabled={actionLoadingId !== null}
                            onClick={() => handleAction(pay.id, 'reject')}
                            className="w-full py-2 bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <XCircle size={13} />
                            Reject
                          </button>
                          <button
                            type="button"
                            disabled={actionLoadingId !== null}
                            onClick={() => handleAction(pay.id, 'approve')}
                            className="w-full py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10 disabled:opacity-50"
                          >
                            <CheckCircle size={13} />
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'users' && (
        <div className="bg-white dark:bg-[#12141C] border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-sm p-6 space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Registered Users Directory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                A database view of all candidates registered inside the ResumePilot system database.
              </p>
            </div>

            <div className="relative w-full md:w-72 shrink-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search candidates by name, email, plan..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl text-xs text-slate-800 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50/50 dark:bg-[#181B26]/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Users className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No candidates found</h3>
              <p className="text-xs text-slate-400 mt-1">
                No users matched the given criteria search term.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="w-full text-left border-collapse hidden md:table text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
                    <th className="py-3 px-4">Candidate avatar</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Display Name</th>
                    <th className="py-3 px-4">Subscribed Plan</th>
                    <th className="py-3 px-4">Register Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/40">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                      <td className="py-4 px-4">
                        <div className="w-8 h-8 rounded-full bg-slate-120 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800 overflow-hidden shrink-0 select-none">
                          <img 
                            src={u.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                            alt={u.fullName}
                            className="w-full h-full object-cover"
                            referrerPolicy="referrer"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200 select-all">{u.email}</td>
                      <td className="py-4 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">{u.fullName || "-"}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold 
                          ${u.subscriptionPlan !== 'Free' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-slate-100 dark:bg-slate-850 text-slate-500'}`}>
                          {u.subscriptionPlan}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile stack card view */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="p-4 bg-slate-50 dark:bg-[#181B26]/30 border border-slate-150 dark:border-slate-800/80 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 select-none">
                        <img 
                          src={u.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                          alt={u.fullName}
                          className="w-full h-full object-cover"
                          referrerPolicy="referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{u.fullName || "Fresh Pilot Student"}</p>
                        <p className="text-[11px] text-slate-400 truncate font-mono select-all">{u.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 
                      ${u.subscriptionPlan !== 'Free' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'}`}>
                      {u.subscriptionPlan}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === 'reviews' && (
        <div className="bg-white dark:bg-[#12141C] border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-sm p-6 space-y-6 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reviews & Testimonial Moderation Queue</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Approve, reject, hide, or feature community ratings. Approved/featured reviews display publicly in the app testimonials ledger.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
              <select
                value={reviewStatusFilter}
                onChange={(e) => setReviewStatusFilter(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900 text-xs border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-300 font-bold"
              >
                <option value="all">All Reviews ({getReviewCount('all')})</option>
                <option value="pending">Pending ({getReviewCount('pending')})</option>
                <option value="approved">Approved ({getReviewCount('approved')})</option>
                <option value="rejected">Rejected ({getReviewCount('rejected')})</option>
                <option value="hidden">Hidden ({getReviewCount('hidden')})</option>
                <option value="featured">Featured ({getReviewCount('featured')})</option>
              </select>

              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Search reviewer name or comment..."
                  value={reviewSearchTerm}
                  onChange={(e) => setReviewSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50/50 dark:bg-[#181B26]/20 rounded-2xl border border-dashed border-slate-205 dark:border-slate-800">
              <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-650 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching reviews found</h3>
              <p className="text-xs text-slate-400 mt-1">
                No reviews found matching the selected status filter or criteria text.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((r) => {
                const status = r.status || 'pending';
                return (
                  <div key={r.id} className="p-5 bg-slate-50 dark:bg-[#181B26]/30 border border-slate-150 dark:border-slate-800/80 rounded-2xl space-y-4 relative overflow-hidden transition-all hover:border-slate-250 dark:hover:border-slate-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Name Card and Star Ratings */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 select-none">
                          <img 
                            src={r.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                            alt={r.fullName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{r.fullName}</h4>
                            <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 font-mono px-1.5 py-0.5 rounded text-slate-400 select-all">{r.id}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={i < r.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200 dark:text-slate-700'} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Status pill & log */}
                      <div className="flex flex-wrap items-center gap-2 sm:text-right">
                        <div>
                          <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider
                            ${status === 'approved' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}
                            ${status === 'featured' && 'bg-violet-500/10 text-violet-600 dark:text-violet-400'}
                            ${status === 'rejected' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}
                            ${status === 'hidden' && 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}
                            ${status === 'pending' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}
                          `}>
                            {status}
                          </span>
                        </div>
                        <span className="text-slate-410 dark:text-slate-500 text-[11px] font-mono block">
                          Submitted {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Review comment content */}
                    <div className="text-slate-700 dark:text-slate-350 text-xs leading-relaxed italic bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3">
                      "{r.comment}"
                    </div>

                    {/* Moderation History logs if present */}
                    {r.moderationHistory && r.moderationHistory.length > 0 && (
                      <div className="text-[10px] font-mono text-slate-430 dark:text-slate-500 bg-slate-100/50 dark:bg-slate-900/40 p-2 rounded-lg space-y-1">
                        <span className="font-black uppercase tracking-wide text-slate-402 dark:text-slate-400">audit trails:</span>
                        {r.moderationHistory.map((h, i) => (
                          <div key={i} className="flex flex-wrap items-center gap-x-2">
                            <span>● [{new Date(h.timestamp).toLocaleTimeString()}]</span>
                            <span className="font-bold text-slate-505 dark:text-slate-400">{h.moderator}</span>
                            <span>set status to</span>
                            <span className="font-bold uppercase text-emerald-500">{h.action}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Active interactive moderators actions */}
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/20">
                      <button
                        type="button"
                        disabled={reviewActionMap[`${r.id}_approve`]}
                        onClick={() => handleReviewAction(r.id, 'approve')}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50
                          ${status === 'approved' 
                            ? 'bg-emerald-500 text-white font-black' 
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}
                      >
                        <CheckCircle size={12} />
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={reviewActionMap[`${r.id}_reject`]}
                        onClick={() => handleReviewAction(r.id, 'reject')}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50
                          ${status === 'rejected' 
                            ? 'bg-rose-500 text-white font-black' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white'}`}
                      >
                        <XCircle size={12} />
                        Reject
                      </button>

                      <button
                        type="button"
                        disabled={reviewActionMap[`${r.id}_feature`]}
                        onClick={() => handleReviewAction(r.id, 'feature')}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50
                          ${status === 'featured' 
                            ? 'bg-violet-600 text-white font-black hover:bg-violet-700' 
                            : 'bg-violet-600/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600 hover:text-white'}`}
                      >
                        <Award size={12} />
                        Feature
                      </button>

                      <button
                        type="button"
                        disabled={reviewActionMap[`${r.id}_hide`]}
                        onClick={() => handleReviewAction(r.id, 'hide')}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50
                          ${status === 'hidden' 
                            ? 'bg-slate-700 text-white font-black dark:bg-slate-800' 
                            : 'bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-700 hover:text-white dark:hover:bg-slate-800 dark:hover:text-white'}`}
                      >
                        <EyeOff size={12} />
                        Hide
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
