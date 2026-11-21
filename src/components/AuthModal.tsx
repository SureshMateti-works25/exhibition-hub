import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
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
  Info
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    loginAs,
    setIsPrivacyShieldOpen
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || 'customer');
  const [phoneNumber, setPhoneNumber] = useState('+91 98490 12345');
  const [otpCode, setOtpCode] = useState('4821');
  const [otpSent, setOtpSent] = useState(false);
  const [adminEmail, setAdminEmail] = useState('k.srinivas@exhibitionsociety.com');
  const [adminPassword, setAdminPassword] = useState('••••••••••••');
  const [mfaCode, setMfaCode] = useState('719 402');
  const [showConsent, setShowConsent] = useState(true);

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(selectedRole);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
    setIsAuthModalOpen(false);
  };

  const handleQuickDemoSwitch = (role: UserRole) => {
    setSelectedRole(role);
    loginAs(role);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div
        className="bg-white w-full max-w-lg max-h-[94dvh] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Role-Based Authentication & Privacy
              </h3>
              <p className="text-[10px] text-orange-200">
                DPDP Act 2023 Compliant • Isolated Data Compartments
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'customer', label: '🛍️ Shopper', badge: 'OTP Auth' },
            { id: 'vendor', label: '🏪 Vendor', badge: 'Stall Scope' },
            { id: 'admin', label: '🏛️ Society Admin', badge: '2FA MFA' },
            { id: 'auditor', label: '🔍 Auditor', badge: 'Read-Only' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRole(tab.id as UserRole)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedRole === tab.id
                  ? 'bg-white text-orange-600 shadow-sm border border-slate-200 ring-1 ring-orange-500'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[9px] font-semibold text-slate-400 mt-0.5">
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1 text-xs">
          {/* Quick 1-Click Role Switch Demo Banner */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-3 rounded-2xl border border-orange-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-600" />
                Live Demo Fast Switch
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Instant Test</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['customer', 'vendor', 'admin', 'auditor'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleQuickDemoSwitch(r)}
                  className={`py-1.5 px-2 rounded-lg font-bold text-[10px] capitalize transition ${
                    currentUser?.role === r
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-orange-100/50 border border-slate-200'
                  }`}
                >
                  {r === 'customer' ? 'Shopper' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Form based on Role */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* Customer Login Form */}
            {selectedRole === 'customer' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 block">
                      Mobile Number (Passwordless OTP)
                    </label>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Phone Masked
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98490 XXXXX"
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-orange-500"
                    />
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={() => setOtpSent(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-2 rounded-xl"
                      >
                        Send OTP
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold flex items-center px-2">
                        Sent ✓
                      </span>
                    )}
                  </div>
                </div>

                {otpSent && (
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                    <label className="font-bold text-emerald-950 block">
                      Enter 4-Digit SMS OTP (Simulated: 4821)
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full text-center text-base tracking-widest font-mono font-bold p-2 rounded-xl border border-emerald-300 bg-white"
                    />
                  </div>
                )}

                {/* Privacy Guarantee Box */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>How Customer Data is Kept Private:</span>
                  </div>
                  <p>
                    1. <strong>Phone Number Masking</strong>: Your phone number is masked as <span className="font-mono font-bold text-slate-800">+91 98490 •••••</span> in all public stall directories. Vendors only see your contact when you place a confirmed order.
                  </p>
                  <p>
                    2. <strong>Zero Card Storage</strong>: All card/UPI payments are tokenized via Razorpay / PhonePe PCI-DSS servers.
                  </p>
                </div>
              </div>
            )}

            {/* Vendor Login Form */}
            {selectedRole === 'vendor' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="font-bold text-slate-800 block">
                    Registered Vendor Mobile / Application ID
                  </label>
                  <input
                    type="text"
                    defaultValue="+91 98480 23145 (Pochampally Weavers)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>

                {/* Scope & KYC Isolation Guarantee */}
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Lock className="w-4 h-4 text-orange-600" />
                    <span>Vendor Tenant Isolation & KYC Protection:</span>
                  </div>
                  <p>
                    1. <strong>Row-Level Security (RLS)</strong>: The issued JWT scopes your session strictly to <code>tenant: stall_H14</code>. You cannot access or modify other vendors' catalogs or sales.
                  </p>
                  <p>
                    2. <strong>KYC Document Vault</strong>: Your Aadhaar, PAN, and FSSAI files reside in an AES-256 encrypted private bucket with 15-minute temporary pre-signed access for society auditors only.
                  </p>
                </div>
              </div>
            )}

            {/* Society Admin Form */}
            {selectedRole === 'admin' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Official Society Corporate Email *
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Admin Password *
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                      <span>Mandatory 2FA Authenticator Token (TOTP)</span>
                      <span className="text-[10px] text-orange-600 font-bold">Time-based OTP</span>
                    </label>
                    <input
                      type="text"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="w-full p-2 rounded-xl border border-orange-300 bg-orange-50 font-mono text-center font-bold"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-600">
                  🛡️ <strong>Audit Trail Notice:</strong> Every administrative login and approval action is permanently signed and logged in the append-only DPDP audit ledger.
                </div>
              </div>
            )}

            {/* Auditor Form */}
            {selectedRole === 'auditor' && (
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-indigo-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Key className="w-4 h-4 text-indigo-600" />
                    <span>Cryptographic Read-Only Audit Token</span>
                  </div>
                  <p className="text-[11px]">
                    Authorized for statutory auditors to inspect compliance hashes, application status histories, and DPDP masking adherence without edit permissions.
                  </p>
                </div>
              </div>
            )}

            {/* DPDP Act Explicit Consent Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
              <input
                type="checkbox"
                checked={showConsent}
                onChange={(e) => setShowConsent(e.target.checked)}
                className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
              />
              <span>
                I acknowledge the <strong>Numaish 2027 Privacy Notice</strong> under India's Digital Personal Data Protection (DPDP) Act 2023. Purpose limited to stall showcase and order fulfillment.
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={!showConsent}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-md transition active:scale-98"
              >
                <Lock className="w-4 h-4" />
                <span>Sign In as {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setIsPrivacyShieldOpen(true);
                }}
                className="px-3 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold"
                title="Inspect Data Privacy Shield"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
