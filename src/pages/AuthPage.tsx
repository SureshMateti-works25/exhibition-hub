import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  Lock,
  Key,
  CheckCircle2,
  Building,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  Store,
  Users,
  AlertCircle,
  Zap,
  Calendar,
  Building2,
  PlusCircle
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const {
    goBack,
    navigateTo,
    currentUser,
    loginAs,
    loginAsVendor,
    loginAsStaff,
    loginAsEventHost,
    stalls,
    eventStalls,
    staffMembers,
    events,
    activeEvent,
    activeEventId,
    setActiveEventId,
    appMode
  } = useApp();

  const [authTab, setAuthTab] = useState<'event_host' | 'vendor' | 'staff' | 'customer' | 'admin' | 'auditor'>('event_host');

  // Event Host Login State
  const [hostEventId, setHostEventId] = useState<string>(activeEventId || (events[0]?.id || 'event-numaish-2027'));
  const [hostEmailOrId, setHostEmailOrId] = useState<string>('numaish.society@hyderabad.gov.in');
  const [hostPin, setHostPin] = useState<string>('2027');

  // Vendor Login State
  const activeStallList = eventStalls.length > 0 ? eventStalls : stalls;
  const [vendorStallOrPhone, setVendorStallOrPhone] = useState(
    activeStallList.length > 0 ? activeStallList[0].stallNumber : 'H-14'
  );
  const [vendorPin, setVendorPin] = useState('2027');

  // Staff Login State
  const [staffPhoneOrPass, setStaffPhoneOrPass] = useState(
    staffMembers.length > 0 ? staffMembers[0].gatePassId : 'NUM27-GP-H14-01'
  );
  const [staffPin, setStaffPin] = useState('1234');

  // Customer Login State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+91 98490 12345');
  const [customerOtp, setCustomerOtp] = useState('4821');

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('k.srinivas@exhibitionsociety.com');
  const [mfaCode, setMfaCode] = useState('719 402');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEventHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const identifier = hostEventId || hostEmailOrId;
    const result = loginAsEventHost(identifier, hostPin);
    if (result.success) {
      setSuccessMessage(result.message);
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        navigateTo({ name: 'admin' });
      }, 700);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = loginAsVendor(vendorStallOrPhone, vendorPin);
    if (result.success) {
      setSuccessMessage(result.message);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        navigateTo({ name: 'vendor' });
      }, 700);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = loginAsStaff(staffPhoneOrPass, staffPin);
    if (result.success) {
      setSuccessMessage(result.message);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        navigateTo({ name: 'vendor' });
      }, 700);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('customer', customerName.trim() || undefined, customerPhone.trim() || undefined);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    navigateTo({ name: 'stalls' });
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('admin', adminEmail);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    navigateTo({ name: 'admin' });
  };

  const handleAuditorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('auditor');
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    navigateTo({ name: 'admin' });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col animate-fadeIn">
      {/* 1. Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 px-3 rounded-xl transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <span className="font-extrabold text-slate-900">
              Numaish Exhibition Security & Access Portal
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo({ name: 'privacy' })}
          className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold py-1.5 px-3 rounded-xl transition"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">DPDP Shield</span>
        </button>
      </nav>

      {/* 2. Main Page Layout */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 pb-24 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Official Exhibition Login
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {appMode === 'real' ? 'Real Database' : 'Demo Mode'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-serif">
              Sign In to Your Workspace
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select your persona below. Allotted vendors log in with their Stall Number or Phone + Access PIN to manage stall profiles, photos, staff, and products.
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Persona Selection Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'event_host', label: 'Event Host', icon: '🎪', badge: 'Host Portal' },
              { id: 'vendor', label: 'Stall Owner', icon: '🏪', badge: 'Stall PIN' },
              { id: 'staff', label: 'Stall Staff', icon: '👥', badge: 'Role Pass' },
              { id: 'customer', label: 'Shopper', icon: '🛍️', badge: 'Mobile OTP' },
              { id: 'admin', label: 'Admin', icon: '🏛️', badge: 'Society 2FA' },
              { id: 'auditor', label: 'Auditor', icon: '🔍', badge: 'Read-Only' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setAuthTab(p.id as any);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between ${
                  authTab === p.id
                    ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-200 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className="text-xl mb-1">{p.icon}</span>
                <strong className="text-xs font-extrabold text-slate-900">{p.label}</strong>
                <span className="text-[10px] text-slate-500 mt-0.5">{p.badge}</span>
              </button>
            ))}
          </div>

          {/* TAB 0: EVENT HOST LOGIN */}
          {authTab === 'event_host' && (
            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold flex items-center gap-1.5 text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Exhibition Host & Society Portal
                  </span>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    Strict Multi-Tenant Scoping
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Log in as an Event Host to manage your exhibition's stall allotment, vendor applications, products, staff passes, schedule, and <strong>special themed days</strong> (such as <em>Ladies-Only Day</em>). All stalls, products, and applications are strictly scoped to your event with zero data leakage.
                </p>
              </div>

              {/* 1-Click Quick Host Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                  ⚡ Registered Exhibitions ({events.length}):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {events.map((evt) => {
                    const isSelected = hostEventId === evt.id;
                    return (
                      <button
                        key={evt.id}
                        type="button"
                        onClick={() => {
                          setHostEventId(evt.id);
                          setHostEmailOrId(evt.hostEmail);
                          setActiveEventId(evt.id);
                        }}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/90 ring-2 ring-orange-200 shadow-sm'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-1.5 py-0.2 rounded">
                              {evt.edition || 'Exhibition'}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            )}
                          </div>
                          <h4 className="text-xs font-black text-slate-900 leading-tight">
                            {evt.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                            {evt.hostOrgName}
                          </p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600 font-mono">
                          <span>PIN: 2027</span>
                          <span className="text-orange-600 font-bold">Select →</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Event Host Form */}
              <form onSubmit={handleEventHostSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Selected Exhibition *
                  </label>
                  <select
                    value={hostEventId}
                    onChange={(e) => {
                      setHostEventId(e.target.value);
                      const matched = events.find((ev) => ev.id === e.target.value);
                      if (matched) {
                        setHostEmailOrId(matched.hostEmail);
                        setActiveEventId(matched.id);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-800 bg-white"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name} ({ev.hostOrgName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Event Host Registered Email or Event ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={hostEmailOrId}
                    onChange={(e) => setHostEmailOrId(e.target.value)}
                    placeholder="e.g. numaish.society@hyderabad.gov.in or event-numaish-2027"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Event Host Security PIN *
                  </label>
                  <input
                    type="password"
                    required
                    value={hostPin}
                    onChange={(e) => setHostPin(e.target.value)}
                    placeholder="2027"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-center tracking-widest font-black text-slate-900"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Initial Security PIN for registered exhibition organizers is <strong>2027</strong>.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white shadow-md transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Sign In to Event Host Console</span>
                </button>
              </form>

              {/* Host Onboarding Callout */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-center sm:text-left">
                  <h4 className="font-black text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                    <span>🎪</span> Want to Host an Exhibition or Mela on Bazaar?
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Register your society/organization, venue, dates, gates, and special days (e.g. Ladies-Only Day).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo({ name: 'event-host-register' })}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
                  <span>Register as Event Host</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: VENDOR STALL OWNER LOGIN */}
          {authTab === 'vendor' && (
            <form onSubmit={handleVendorSubmit} className="space-y-4 pt-2">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
                <span className="font-extrabold flex items-center gap-1.5 text-amber-900">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  Allotted Vendor Credentials
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Once your stall is approved and allotted by the Society Admin, log in here using your <strong>Stall Number</strong> (e.g. H-22) or registered mobile number. Default initial PIN is <strong>2027</strong>.
                </p>
              </div>

              {/* Quick Pick Helper from active stalls */}
              {activeStallList.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    ⚡ Quick Select from {activeEvent?.name || 'Active Exhibition'} Allotted Stalls ({activeStallList.length}):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {activeStallList.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setVendorStallOrPhone(s.stallNumber);
                          setVendorPin(s.pin || '2027');
                        }}
                        className={`text-xs px-2.5 py-1 rounded-xl border font-bold transition flex items-center gap-1 ${
                          vendorStallOrPhone === s.stallNumber
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{s.stallNumber}:</span>
                        <span className="font-normal truncate max-w-[120px]">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Allotted Stall Number or Registered Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    value={vendorStallOrPhone}
                    onChange={(e) => setVendorStallOrPhone(e.target.value)}
                    placeholder="e.g. H-22 or +91 98480 99887"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Vendor Access PIN / Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={vendorPin}
                    onChange={(e) => setVendorPin(e.target.value)}
                    placeholder="e.g. 2027"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-center tracking-widest font-black text-slate-900"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Default Initial PIN for all newly approved stalls is <strong>2027</strong>. You can change this in Stall Settings.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>Sign In to Stall Vendor Dashboard</span>
              </button>
            </form>
          )}

          {/* TAB 2: STALL STAFF MEMBER LOGIN */}
          {authTab === 'staff' && (
            <form onSubmit={handleStaffSubmit} className="space-y-4 pt-2">
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 text-xs space-y-1">
                <span className="font-extrabold flex items-center gap-1.5 text-blue-900">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Delegated Stall Staff & Crew Access
                </span>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Sign in with your Gate Pass ID or registered phone number. Your permissions (sales, billing, catalog, or gate badge) are configured by your stall owner.
                </p>
              </div>

              {/* Quick Pick Helper from active staff */}
              {staffMembers.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    ⚡ Registered Staff Members ({staffMembers.length}):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {staffMembers.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          setStaffPhoneOrPass(st.gatePassId);
                          setStaffPin('1234');
                        }}
                        className={`text-xs px-2.5 py-1 rounded-xl border font-bold transition flex items-center gap-1 ${
                          staffPhoneOrPass === st.gatePassId
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{st.name}</span>
                        <span className="text-[10px] opacity-80">({st.role.replace('_', ' ')})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Gate Pass ID or Staff Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffPhoneOrPass}
                    onChange={(e) => setStaffPhoneOrPass(e.target.value)}
                    placeholder="e.g. NUM27-GP-H14-01 or +91 98480 33441"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Staff Entry PIN *
                  </label>
                  <input
                    type="password"
                    required
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value)}
                    placeholder="e.g. 1234"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center tracking-widest font-black text-slate-900"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Initial staff pass PIN is <strong>1234</strong>.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Sign In as Stall Staff</span>
              </button>
            </form>
          )}

          {/* TAB 3: CUSTOMER / SHOPPER */}
          {authTab === 'customer' && (
            <form onSubmit={handleCustomerSubmit} className="space-y-4 pt-2">
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Your Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Mobile Number (OTP Verified)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98490 XXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    DPDP Protection: Your number is masked (+91 98490 •••••) until order pickup.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white shadow-md transition active:scale-95"
              >
                Sign In as Shopper & Browse Stalls
              </button>
            </form>
          )}

          {/* TAB 4: ADMIN */}
          {authTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4 pt-2">
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Exhibition Society Official SSO
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">2FA Security Token</label>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-center font-bold text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-slate-900 hover:bg-black text-white shadow-md transition active:scale-95"
              >
                Sign In as Society Admin
              </button>
            </form>
          )}

          {/* TAB 5: AUDITOR */}
          {authTab === 'auditor' && (
            <form onSubmit={handleAuditorSubmit} className="space-y-4 pt-2">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
                <span className="font-bold block">Statutory DPDP 2023 Auditor Access</span>
                <span className="text-[11px] text-emerald-800">
                  Read-only cryptographic access to immutable audit trails and compliance reports.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition active:scale-95"
              >
                Sign In as Statutory Auditor
              </button>
            </form>
          )}

          {/* Active JWT Claims Inspector */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-[11px] font-mono space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-orange-400 font-bold">Active Decoded JWT Token</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
                HS256 Verified
              </span>
            </div>
            <pre className="text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed text-[10px]">
{currentUser ? JSON.stringify(currentUser.jwtClaims, null, 2) : '// No active session. Please authenticate above.'}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};
