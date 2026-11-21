import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StallApplication, ApplicationStatus, Stall, StallCategory, EventSpecialDay } from '../../types';
import { CATEGORIES_DATA } from '../../data/mockData';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  Eye,
  Send,
  Database,
  Hash,
  Filter,
  Search,
  Lock,
  Download,
  MapPin,
  TrendingUp,
  DollarSign,
  Store,
  PlusCircle,
  Trash2,
  Zap,
  RotateCcw,
  Key,
  EyeOff,
  Check,
  Calendar,
  Sparkles,
  Building2,
  Heart,
  ChevronDown,
  Layers,
  Settings
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    stalls,
    eventStalls,
    addStall,
    updateStall,
    deleteStall,
    loginAsVendor,
    applications,
    eventApplications,
    updateApplicationStatus,
    auditLogs,
    products,
    eventProducts,
    stories,
    eventStories,
    events,
    activeEvent,
    activeEventId,
    setActiveEventId,
    updateEvent,
    currentUser,
    role,
    setIsMapOpen,
    navigateTo,
    appMode
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'applications' | 'stalls' | 'audit' | 'event'>('applications');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<StallApplication | null>(null);

  // Special Days Management State (for Event tab)
  const [newDayTitle, setNewDayTitle] = useState('');
  const [newDayDate, setNewDayDate] = useState('2027-01-20');
  const [newDayStartTime, setNewDayStartTime] = useState('15:00');
  const [newDayEndTime, setNewDayEndTime] = useState('22:30');
  const [newDayBadge, setNewDayBadge] = useState('🌸 Ladies Only');
  const [newDayBadgeColor, setNewDayBadgeColor] = useState<'pink' | 'purple' | 'amber' | 'blue' | 'emerald'>('pink');
  const [newDayDesc, setNewDayDesc] = useState('');
  const [newDayRules, setNewDayRules] = useState('');
  const [newDayIsLadiesOnly, setNewDayIsLadiesOnly] = useState(false);
  const [newDayIsDiscount, setNewDayIsDiscount] = useState(false);
  const [newDayIsFamilyOnly, setNewDayIsFamilyOnly] = useState(false);

  // Direct Stall Registration Form State
  const [directName, setDirectName] = useState('');
  const [directStallNo, setDirectStallNo] = useState('');
  const [directCategory, setDirectCategory] = useState<StallCategory>('Handlooms');
  const [directSector, setDirectSector] = useState('Sector 2 (Crafts Pavilion)');
  const [directOwner, setDirectOwner] = useState('');
  const [directPhone, setDirectPhone] = useState('+91 98480 11223');
  const [directGate, setDirectGate] = useState('Gate 2 (Ajanta Gate)');
  const [directTagline, setDirectTagline] = useState('Authentic Artisan Exhibition Stall');

  // Review action modal state
  const [reviewAction, setReviewAction] = useState<ApplicationStatus | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState<string>('');
  const [allottingStallNo, setAllottingStallNo] = useState<string>('H-22');
  const [allottingSector, setAllottingSector] = useState<string>('Sector H (Handlooms Pavilion)');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Direct stall registration handler
  const handleDirectRegisterStall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName.trim() || !directStallNo.trim()) {
      alert('Please enter stall name and stall number.');
      return;
    }
    const catObj = CATEGORIES_DATA.find((c) => c.id === directCategory);
    const newStall: Stall = {
      id: `stall-direct-${Date.now()}`,
      eventId: activeEvent?.id || 'event-numaish-2027',
      stallNumber: directStallNo.trim(),
      name: directName.trim(),
      tagline: directTagline || `${directCategory} • Authentic Artisan Stall`,
      category: directCategory,
      subCategories: catObj?.subtypes ? [catObj.subtypes[0]] : [directCategory],
      sector: directSector,
      nearestGate: directGate,
      ownerName: directOwner || 'Registered Artisan',
      phone: directPhone,
      bannerImage:
        catObj?.bannerImage ||
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
      logoImage:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      description: `${directName} - Registered exhibitor at ${activeEvent?.name || 'Numaish 2027'}. Authentic ${directCategory} direct from artisan.`,
      isVerified: true,
      hasGiCert: true,
      rating: 5.0,
      reviewCount: 0,
      followersCount: 1,
      dailyUpdateSnippet: `Welcome to ${directName}! Visit stall ${directStallNo}.`,
      lastUpdatedTime: 'Just now'
    };

    addStall(newStall);
    setDirectName('');
    setDirectStallNo('');
    setActionSuccessMsg(
      `Stall ${newStall.stallNumber} ("${newStall.name}") registered for ${activeEvent?.name || 'Exhibition'}! Now live in the customer Browse Stalls directory.`
    );
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Special Day Management Handlers
  const handleAddSpecialDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent || !newDayTitle.trim() || !newDayDate.trim()) {
      alert('Please fill out Title and Date for the special day.');
      return;
    }

    const newDay: EventSpecialDay = {
      id: `sd-${Date.now()}`,
      date: newDayDate,
      title: newDayTitle.trim(),
      badgeText: newDayBadge || '⭐ Special Day',
      badgeColor: newDayBadgeColor,
      startTime: newDayStartTime,
      endTime: newDayEndTime,
      description: newDayDesc || 'Official themed exhibition day with tailored visitor access.',
      entryRules: newDayRules || (newDayIsLadiesOnly ? 'Male visitors restricted. Female security volunteers on duty.' : 'Standard exhibition entry rules apply.'),
      isLadiesOnly: newDayIsLadiesOnly,
      isDiscountDay: newDayIsDiscount,
      isFamilyOnly: newDayIsFamilyOnly
    };

    const existingDays = activeEvent.specialDays || [];
    updateEvent(activeEvent.id, {
      specialDays: [...existingDays, newDay]
    });

    setActionSuccessMsg(`Special Themed Day "${newDay.title}" added to ${activeEvent.name}!`);
    setNewDayTitle('');
    setNewDayDesc('');
    setNewDayRules('');
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleDeleteSpecialDay = (dayId: string) => {
    if (!activeEvent) return;
    const updatedDays = (activeEvent.specialDays || []).filter((d) => d.id !== dayId);
    updateEvent(activeEvent.id, { specialDays: updatedDays });
    setActionSuccessMsg('Special day removed successfully.');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // Strictly event-scoped applications
  const filteredApps = eventApplications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const totalFeeCollected = eventApplications
    .filter(a => a.feePaid)
    .reduce((acc, a) => acc + a.feeAmount, 0);

  const allottedCount = eventApplications.filter(a => a.status === 'stall_allotted').length;
  const pendingCount = eventApplications.filter(a => a.status === 'submitted' || a.status === 'under_review').length;

  const handleOpenReview = (app: StallApplication, action: ApplicationStatus) => {
    setSelectedApp(app);
    setReviewAction(action);
    setReviewerNotes(
      action === 'approved'
        ? 'Documents verified against Society craft standards. Approved for fee payment.'
        : action === 'needs_changes'
        ? 'Document quality blurry. Please re-upload verified GST registration certificate.'
        : action === 'stall_allotted'
        ? `Stall ${allottingStallNo} allotted upon full fee verification.`
        : 'Application does not meet exhibition criteria.'
    );
  };

  const handleConfirmReview = () => {
    if (!selectedApp || !reviewAction) return;

    updateApplicationStatus(
      selectedApp.id,
      reviewAction,
      reviewerNotes,
      reviewAction === 'stall_allotted' ? allottingStallNo : undefined,
      reviewAction === 'stall_allotted' ? allottingSector : undefined
    );

    setActionSuccessMsg(
      `Application ${selectedApp.applicationNumber} updated to ${reviewAction.toUpperCase()}.${
        reviewAction === 'stall_allotted' ? ` Stall ${allottingStallNo} created and live in directory!` : ''
      }`
    );

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 }
    });

    setReviewAction(null);
    setSelectedApp(null);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Admin / Host Society Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-orange-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {currentUser?.role === 'event_host' ? '🎪 Event Host Console' : '🏛️ Exhibition Society Console'}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Event Data Isolation Active
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full">
                ID: {activeEvent?.id || 'event-numaish-2027'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-serif text-white">
              {activeEvent?.name || 'Numaish 2027 • All India Industrial Exhibition'}
            </h2>
            <p className="text-xs text-slate-300">
              Hosted by <strong className="text-white">{activeEvent?.hostOrgName || 'The Exhibition Society'}</strong> • 📍 {activeEvent?.venueName || 'Exhibition Grounds, Nampally'} ({activeEvent?.city || 'Hyderabad'})
            </p>
            <p className="text-[11px] text-slate-400">
              📅 {activeEvent?.startDate || 'Jan 1, 2027'} to {activeEvent?.endDate || 'Feb 15, 2027'} • ⏰ Timings: {activeEvent?.timings || '15:00 - 22:30'} • 🎫 Ticket: ₹{activeEvent?.ticketPriceAdult || 40}
            </p>

            {/* Exhibition Switcher Dropdown */}
            <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-amber-300">Active Exhibition:</span>
              <select
                value={activeEventId}
                onChange={(e) => setActiveEventId(e.target.value)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl px-3 py-1 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id} className="text-slate-900">
                    {ev.name} ({ev.hostOrgName})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => navigateTo({ name: 'event-host-register' })}
                className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1 rounded-xl transition flex items-center gap-1 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Onboard New Exhibition</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => setIsMapOpen(true)}
              className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition self-start sm:self-auto"
            >
              <MapPin className="w-4 h-4" />
              <span>Grounds Allotment Map</span>
            </button>
            <button
              onClick={() => navigateTo({ name: 'event-detail', eventId: activeEventId })}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-xl border border-white/20 transition self-start sm:self-auto"
            >
              <Eye className="w-4 h-4" />
              <span>Public Exhibition Page</span>
            </button>
          </div>
        </div>

        {/* 4 Admin KPI Metrics (strictly scoped to this event) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6 pt-5 border-t border-white/10 text-white">
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Event Applications</p>
            <p className="text-xl sm:text-2xl font-black mt-1 text-white">{eventApplications.length}</p>
            <p className="text-[10px] text-amber-300 mt-0.5">{pendingCount} pending review</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Allotted Stalls</p>
            <p className="text-xl sm:text-2xl font-black mt-1 text-emerald-400">{eventStalls.length}</p>
            <p className="text-[10px] text-emerald-300 mt-0.5">Capacity: {activeEvent?.totalStalls || 2500}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Live Event Products</p>
            <p className="text-xl sm:text-2xl font-black mt-1 text-amber-400">
              {eventProducts.length}
            </p>
            <p className="text-[10px] text-slate-300 mt-0.5">Across {eventStalls.length} stalls</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Special Themed Days</p>
            <p className="text-xl sm:text-2xl font-black mt-1 text-pink-300">
              {activeEvent?.specialDays?.length || 0}
            </p>
            <p className="text-[10px] text-pink-200 mt-0.5">Incl. Ladies-Only Days</p>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveAdminTab('applications')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition ${
            activeAdminTab === 'applications'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Application Review Queue ({filteredApps.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('stalls')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition ${
            activeAdminTab === 'stalls'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Manage Active Stalls ({eventStalls.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('event')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition ${
            activeAdminTab === 'event'
              ? 'bg-pink-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Event & Special Days ({activeEvent?.specialDays?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition ${
            activeAdminTab === 'audit'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>DPDP 2023 Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Application Review Queue */}
      {activeAdminTab === 'applications' && (
        <div className="space-y-4">
          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Applications' },
              { id: 'submitted', label: 'Submitted (New)' },
              { id: 'under_review', label: 'Under Review' },
              { id: 'needs_changes', label: 'Needs Changes' },
              { id: 'approved', label: 'Approved (Fee Pending)' },
              { id: 'fee_paid', label: 'Fee Paid' },
              { id: 'stall_allotted', label: 'Stall Allotted' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  statusFilter === f.id
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Applications Cards Grid */}
          <div className="space-y-3">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Application Details */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                      {app.applicationNumber}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-900">
                      {app.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        app.status === 'stall_allotted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'approved' || app.status === 'fee_paid'
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === 'needs_changes'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      ● {app.status.replace('_', ' ')}
                    </span>
                    {app.allottedStallNumber && (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        🎪 Stall {app.allottedStallNumber}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {app.businessName}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      (Proprietor: {app.vendorName})
                    </span>
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span>
                      Sub-category: <strong className="text-slate-800">{app.subCategory}</strong>
                    </span>
                    <span>
                      Pref: <strong className="text-slate-800">{app.stallSizePreference}</strong>
                    </span>
                    <span>
                      Fee: <strong className="text-slate-900">₹{app.feeAmount.toLocaleString('en-IN')}</strong> ({app.feePaid ? 'Paid' : 'Pending'})
                    </span>
                    <span>Phone: {app.mobile}</span>
                  </div>

                  {/* Documents Verified Tag */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-semibold text-slate-500">Documents ({app.documents.length}):</span>
                    {app.documents.map(d => (
                      <span
                        key={d.id}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                      >
                        {d.type}: {d.status}
                      </span>
                    ))}
                  </div>

                  {app.reviewerNotes && (
                    <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      Note: "{app.reviewerNotes}"
                    </p>
                  )}
                </div>

                {/* Admin Action Buttons */}
                <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  <div className="flex gap-1.5">
                    {app.status !== 'stall_allotted' && (
                      <button
                        onClick={() => handleOpenReview(app, 'stall_allotted')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-sm transition"
                      >
                        Allot Stall
                      </button>
                    )}

                    {app.status === 'submitted' || app.status === 'under_review' ? (
                      <>
                        <button
                          onClick={() => handleOpenReview(app, 'approved')}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-sm transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleOpenReview(app, 'needs_changes')}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-1.5 px-2.5 rounded-xl shadow-sm transition"
                        >
                          Query
                        </button>
                        <button
                          onClick={() => handleOpenReview(app, 'rejected')}
                          className="bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-xs font-bold py-1.5 px-2.5 rounded-xl transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Manage Active Stalls (Direct Registration & Directory) */}
      {activeAdminTab === 'stalls' && (
        <div className="space-y-6">
          {/* Direct Stall Registration Form */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-orange-600" />
                  Direct Register Exhibition Stall
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instantly create an official stall in the registry without going through the public application process.
                </p>
              </div>
              <span className="text-[11px] font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                Instant Provisioning
              </span>
            </div>

            <form onSubmit={handleDirectRegisterStall} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Stall Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={directName}
                    onChange={(e) => setDirectName(e.target.value)}
                    placeholder="e.g. Royal Kashmir Shawls"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Allotted Stall Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={directStallNo}
                    onChange={(e) => setDirectStallNo(e.target.value)}
                    placeholder="e.g. K-08 / H-15 / J-22"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Exhibition Category *
                  </label>
                  <select
                    value={directCategory}
                    onChange={(e) => setDirectCategory(e.target.value as StallCategory)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sector Pavilion</label>
                  <input
                    type="text"
                    value={directSector}
                    onChange={(e) => setDirectSector(e.target.value)}
                    placeholder="Sector 2 (Crafts Pavilion)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Proprietor / Artisan Name</label>
                  <input
                    type="text"
                    value={directOwner}
                    onChange={(e) => setDirectOwner(e.target.value)}
                    placeholder="e.g. Ghulam Hassan"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={directPhone}
                    onChange={(e) => setDirectPhone(e.target.value)}
                    placeholder="+91 98480 XXXXX"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Tagline / Highlight</label>
                  <input
                    type="text"
                    value={directTagline}
                    onChange={(e) => setDirectTagline(e.target.value)}
                    placeholder="Authentic Handcrafted Treasures direct from Master Artisan"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nearest Gate</label>
                  <input
                    type="text"
                    value={directGate}
                    onChange={(e) => setDirectGate(e.target.value)}
                    placeholder="Gate 2 (Ajanta Gate)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Stall Now</span>
                </button>
              </div>
            </form>
          </div>

          {/* Stalls Directory Table / List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>Active Allotted Stalls</span>
                <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                  {eventStalls.length} Stalls • {activeEvent?.name || 'Exhibition'}
                </span>
              </h3>
            </div>

            {eventStalls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {eventStalls.map((s) => {
                  const isStallVisible = s.isVisibleInStallView !== false;
                  const isProductsVisible = s.isProductsVisible !== false;
                  const isSuspended = s.adminStatus === 'suspended';

                  return (
                    <div
                      key={s.id}
                      className={`bg-white rounded-2xl p-4 border transition-all space-y-3 ${
                        isSuspended
                          ? 'border-rose-300 bg-rose-50/30'
                          : 'border-slate-200 shadow-2xs hover:shadow-sm'
                      }`}
                    >
                      {/* Stall Header */}
                      <div className="flex items-start gap-3">
                        <img
                          src={s.bannerImage}
                          alt={s.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="bg-orange-100 text-orange-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                              {s.stallNumber}
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded truncate">
                              {s.category}
                            </span>
                            {isSuspended && (
                              <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                                Suspended
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-1">
                            {s.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate">
                            {s.ownerName} • {s.sector}
                          </p>
                        </div>
                      </div>

                      {/* Vendor Authentication Credentials Box */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <Key className="w-3 h-3 text-orange-600" /> Vendor Login ID:
                          </span>
                          <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                            {s.stallNumber}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Access PIN:</span>
                          <span className="font-mono font-extrabold text-orange-700 bg-orange-50 px-2 py-0.2 rounded border border-orange-200">
                            {s.pin || '2027'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const res = loginAsVendor(s.stallNumber, s.pin || '2027');
                            if (res.success) {
                              navigateTo({ name: 'vendor' });
                            }
                          }}
                          className="w-full flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] py-1.5 px-2.5 rounded-lg shadow-2xs transition active:scale-95"
                        >
                          <Key className="w-3 h-3 text-amber-300" />
                          <span>🔑 Log in as this Vendor</span>
                        </button>
                      </div>

                      {/* Public Visibility & Customer Controls */}
                      <div className="pt-2 border-t border-slate-100 text-xs space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Customer View Controls
                        </span>

                        {/* Toggle 1: Stall View */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-700 font-medium">Browse Stalls View:</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateStall(s.id, { isVisibleInStallView: !isStallVisible })
                            }
                            className={`text-[10px] font-bold px-2 py-0.8 rounded-lg border transition flex items-center gap-1 ${
                              isStallVisible
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                            title="Click to toggle stall visibility in customer Browse Stalls"
                          >
                            {isStallVisible ? (
                              <>
                                <Eye className="w-3 h-3" /> Visible
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" /> Hidden
                              </>
                            )}
                          </button>
                        </div>

                        {/* Toggle 2: Products View */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-700 font-medium">Marketplace Products:</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateStall(s.id, { isProductsVisible: !isProductsVisible })
                            }
                            className={`text-[10px] font-bold px-2 py-0.8 rounded-lg border transition flex items-center gap-1 ${
                              isProductsVisible
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                            title="Click to toggle stall products visibility in All Products"
                          >
                            {isProductsVisible ? (
                              <>
                                <Check className="w-3 h-3" /> Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" /> Hidden
                              </>
                            )}
                          </button>
                        </div>

                        {/* Toggle 3: Admin Status */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-700 font-medium">Booth Status:</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateStall(s.id, {
                                adminStatus: isSuspended ? 'active' : 'suspended'
                              })
                            }
                            className={`text-[10px] font-bold px-2 py-0.8 rounded-lg border transition ${
                              !isSuspended
                                ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                            }`}
                          >
                            {!isSuspended ? '● Operating' : '✕ Suspended'}
                          </button>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <button
                          onClick={() => navigateTo({ name: 'stall', stallId: s.id })}
                          className="flex items-center gap-1 text-orange-600 hover:text-orange-800 font-bold text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Public Page</span>
                        </button>

                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete stall "${s.name}" (${s.stallNumber})?`
                              )
                            ) {
                              deleteStall(s.id);
                            }
                          }}
                          className="flex items-center gap-1 text-slate-400 hover:text-rose-600 text-[11px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
                <Store className="w-10 h-10 text-orange-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Stalls Allotted Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Use the Direct Register form above or review pending stall applications to allot your first exhibition stall.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: DPDP Act 2023 Tamper-Evident Audit Trail */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  DPDP Act 2023 & Security Audit Log
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Append-only verifiable ledger of stall status changes, price edits, KYC document views, and data masking.
              </p>
            </div>

            <button
              onClick={() => {
                const jsonStr = JSON.stringify(auditLogs, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Numaish2027_AuditTrail_${Date.now()}.json`;
                a.click();
              }}
              className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl transition self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              Export Audit Trail (JSON)
            </button>
          </div>

          {/* Audit Rows */}
          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 bg-white px-1.5 py-0.5 rounded border">
                    Hash: {log.hash}
                  </span>
                </div>

                <p className="text-slate-800 font-medium">
                  {log.details}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <span>
                    Actor: <strong className="text-slate-700">{log.actor}</strong> ({log.actorRole})
                  </span>
                  <span>
                    Entity: <strong className="text-slate-700">{log.entityType} ({log.entityId})</strong>
                  </span>
                </div>

                {(log.previousValue || log.newValue) && (
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-[10px] font-mono grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 block font-sans">Before:</span>
                      {log.previousValue || 'None'}
                    </div>
                    <div>
                      <span className="text-emerald-600 block font-sans">After:</span>
                      {log.newValue || 'None'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Event Configuration & Special Days Manager */}
      {activeAdminTab === 'event' && activeEvent && (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. Host Organization & Exhibition Master Info */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    Host Society Profile
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Status: {activeEvent.status?.toUpperCase() || 'LIVE'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-serif">
                  {activeEvent.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Organized by <strong className="text-slate-800">{activeEvent.hostOrgName}</strong> (Reg #{activeEvent.hostRegNumber || 'SOC-HYD-1938'})
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigateTo({ name: 'event-detail', eventId: activeEvent.id })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-xs font-bold transition self-start sm:self-auto"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Schedule Page</span>
              </button>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Venue & City</span>
                <span className="font-bold text-slate-900 block truncate">{activeEvent.venueName}</span>
                <span className="text-[11px] text-slate-500">{activeEvent.city}, {activeEvent.state}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Exhibition Duration</span>
                <span className="font-bold text-slate-900 block">{activeEvent.startDate} to</span>
                <span className="text-[11px] text-slate-500">{activeEvent.endDate}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Daily Timings & Gates</span>
                <span className="font-bold text-slate-900 block">{activeEvent.timings}</span>
                <span className="text-[11px] text-slate-500">{activeEvent.gates?.length || 4} Public Gates</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Capacity & Tickets</span>
                <span className="font-bold text-slate-900 block">{activeEvent.totalStalls} Stalls Max</span>
                <span className="text-[11px] text-slate-500">₹{activeEvent.ticketPriceAdult} Adults / ₹{activeEvent.ticketPriceChild} Kids</span>
              </div>
            </div>

            {/* Host Contact Credentials */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="font-bold text-indigo-950">Official Host Secretariat:</span>
                  <span className="text-indigo-800 ml-1.5">{activeEvent.hostContactPerson} ({activeEvent.hostDesignation || 'Exhibition Secretary'})</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-indigo-700 font-mono text-[11px]">
                <span>✉️ {activeEvent.hostEmail}</span>
                <span>📞 {activeEvent.hostPhone}</span>
              </div>
            </div>
          </div>

          {/* 2. Special Days & Themed Days Manager */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌸</span>
                  <h3 className="text-base font-black text-slate-900 font-serif">
                    Special Days & Themed Exhibition Schedules
                  </h3>
                </div>
                <span className="text-xs bg-pink-100 text-pink-800 font-bold px-2.5 py-0.5 rounded-full">
                  {activeEvent.specialDays?.length || 0} Special Days Configured
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Configure special event days with restricted or prioritized entry (e.g. <strong>Ladies-Only Day / Khaas Janana Day</strong>, School Excursion Day, or Craftsman Celebration Days).
              </p>
            </div>

            {/* List of Configured Special Days */}
            <div className="space-y-3">
              {activeEvent.specialDays && activeEvent.specialDays.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {activeEvent.specialDays.map((sd) => (
                    <div
                      key={sd.id}
                      className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                        sd.isLadiesOnly
                          ? 'bg-pink-50/60 border-pink-300 ring-1 ring-pink-200'
                          : 'bg-slate-50/80 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200 shadow-2xs">
                              {sd.badgeText}
                            </span>
                            {sd.isLadiesOnly && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-600 text-white">
                                🌸 Ladies Only Day
                              </span>
                            )}
                            {sd.isDiscountDay && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                                🏷️ Flat Discounts
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-black text-slate-900 mt-1">
                            {sd.title}
                          </h4>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteSpecialDay(sd.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                          title="Remove special day"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
                        <span className="font-bold text-slate-800">📅 {sd.date}</span>
                        <span>⏰ {sd.startTime} – {sd.endTime}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {sd.description}
                      </p>

                      {sd.entryRules && (
                        <div className="p-2 rounded-xl bg-white/90 border border-slate-200 text-[10px] text-slate-700">
                          <strong className="text-slate-900 block font-semibold mb-0.5">
                            🛡️ Entry Protocol / Safety Rules:
                          </strong>
                          {sd.entryRules}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold">
                    No special themed days added yet for this exhibition.
                  </p>
                </div>
              )}
            </div>

            {/* Add New Special Day Form */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-900 mb-3 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-orange-600" />
                <span>Add a New Themed / Special Day (e.g. Ladies-Only Day)</span>
              </h4>

              <form onSubmit={handleAddSpecialDay} className="space-y-3.5 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Special Day Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDayTitle}
                      onChange={(e) => setNewDayTitle(e.target.value)}
                      placeholder="e.g. Ladies-Only Day (Khaas Janana Day)"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Date (YYYY-MM-DD) *
                    </label>
                    <input
                      type="date"
                      required
                      value={newDayDate}
                      onChange={(e) => setNewDayDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newDayStartTime}
                      onChange={(e) => setNewDayStartTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newDayEndTime}
                      onChange={(e) => setNewDayEndTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={newDayBadge}
                      onChange={(e) => setNewDayBadge(e.target.value)}
                      placeholder="🌸 Ladies Only"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Badge Highlight Color
                    </label>
                    <select
                      value={newDayBadgeColor}
                      onChange={(e) => setNewDayBadgeColor(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      <option value="pink">Pink (Ladies / Women)</option>
                      <option value="purple">Purple (School / Youth)</option>
                      <option value="amber">Amber (Crafts / Handloom)</option>
                      <option value="blue">Blue (Cultural / Music)</option>
                      <option value="emerald">Emerald (Senior / Eco)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Event Description
                  </label>
                  <input
                    type="text"
                    value={newDayDesc}
                    onChange={(e) => setNewDayDesc(e.target.value)}
                    placeholder="Exclusive access reserved for women and boys aged 10 and below with female security volunteers."
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Strict Entry Rules & Safety Protocol
                  </label>
                  <input
                    type="text"
                    value={newDayRules}
                    onChange={(e) => setNewDayRules(e.target.value)}
                    placeholder="Male visitors strictly barred across all gates. Female police officers manning turnstiles."
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={newDayIsLadiesOnly}
                      onChange={(e) => setNewDayIsLadiesOnly(e.target.checked)}
                      className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
                    />
                    <span>🌸 Is Ladies-Only Day (Strict Male Restriction)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={newDayIsDiscount}
                      onChange={(e) => setNewDayIsDiscount(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>🏷️ Special Artisanal Discount Day</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={newDayIsFamilyOnly}
                      onChange={(e) => setNewDayIsFamilyOnly(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>👨‍👩‍👧 Family-Only Day</span>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Save & Publish Special Day</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Inline Review Panel (Zero Popups) */}
      {reviewAction && selectedApp && (
        <div className="bg-white rounded-3xl p-5 border-2 border-orange-400 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded">
                Official Review Panel
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                Confirm Status Action: {reviewAction.toUpperCase()}
              </h4>
              <p className="text-xs text-slate-500">
                {selectedApp.businessName} ({selectedApp.applicationNumber})
              </p>
            </div>
            <button
              onClick={() => setReviewAction(null)}
              className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
            >
              ✕
            </button>
          </div>

          {/* If allotting stall, select stall number */}
          {reviewAction === 'stall_allotted' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Assign Exhibition Stall Number *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={allottingStallNo}
                  onChange={(e) => setAllottingStallNo(e.target.value)}
                  placeholder="e.g. H-15"
                  className="text-xs p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                />
                <input
                  type="text"
                  value={allottingSector}
                  onChange={(e) => setAllottingSector(e.target.value)}
                  placeholder="Sector Pavilion"
                  className="text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <Key className="w-3.5 h-3.5" /> Automated Vendor Credentials Issued:
                </span>
                <p className="text-[11px] leading-relaxed">
                  Upon allotment, the vendor can log in at <code>/#auth</code> using Stall Number <strong>{allottingStallNo}</strong> (or phone <strong>{selectedApp.mobile}</strong>) with default Security PIN <strong>2027</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Reviewer Notes & SMS Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Official Reviewer Notes (Sent via SMS to Vendor)
            </label>
            <textarea
              rows={3}
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-200 text-[11px] text-orange-950 flex items-center gap-2">
            <Send className="w-4 h-4 text-orange-600 shrink-0" />
            <span>
              Automated SMS & WhatsApp status alert will dispatch to {selectedApp.mobile}.
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleConfirmReview}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition active:scale-95"
            >
              Confirm & Dispatch Notification
            </button>
            <button
              onClick={() => setReviewAction(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
