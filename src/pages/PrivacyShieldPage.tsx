import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Database,
  Key,
  FileText,
  Server,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Hash
} from 'lucide-react';

export const PrivacyShieldPage: React.FC = () => {
  const { goBack, currentUser, auditLogs } = useApp();

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col animate-fadeIn">
      {/* 1. Enterprise Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 px-3 rounded-xl transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <span className="font-extrabold text-slate-900">
              India DPDP Act 2023 Compliance Shield
            </span>
          </div>
        </div>

        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Enforced
        </span>
      </nav>

      {/* 2. Main Page Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-24 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Statutory Compliance
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1 font-serif">
                Data Privacy & Multi-Tenant Partitioning
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                The Numaish Bazaar architecture adheres strictly to India's Digital Personal Data Protection Act (DPDP 2023). User data is encrypted at rest and masked in transit across tenant boundaries.
              </p>
            </div>
          </div>
        </div>

        {/* Active Session JWT Token Inspector */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-extrabold text-slate-900">
                Active JWT Session Token Claims
              </h2>
            </div>
            <span className="text-xs font-bold uppercase bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-lg">
              Role: {currentUser?.role || 'Guest Visitor'}
            </span>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{currentUser
  ? JSON.stringify(currentUser.jwtClaims, null, 2)
  : JSON.stringify(
      {
        sub: 'guest-session',
        role: 'guest',
        scope: ['shop:browse_public'],
        dpdp_consent: false,
        tenant: 'public'
      },
      null,
      2
    )}
          </pre>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Tenant Scope: <strong className="text-slate-800">{currentUser?.jwtClaims?.tenant || 'Global / Customer'}</strong></span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Cryptographically Signed (HS256)
            </span>
          </div>
        </div>

        {/* Data Masking Matrix */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-extrabold text-slate-900">
              Role-Based Data Privacy & Masking Matrix
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-[10px] uppercase text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-bold">Data Field</th>
                  <th className="p-3 font-bold">🛍️ Customer View</th>
                  <th className="p-3 font-bold">🏪 Vendor View</th>
                  <th className="p-3 font-bold">🏛️ Admin View</th>
                  <th className="p-3 font-bold">🔍 Auditor View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr>
                  <td className="p-3 font-bold text-slate-800">Customer Phone</td>
                  <td className="p-3 text-emerald-700 font-semibold">Full Access</td>
                  <td className="p-3 text-rose-700 font-semibold font-mono">Masked: +91 98490 •••••</td>
                  <td className="p-3 text-slate-700">Audit-Only Access</td>
                  <td className="p-3 text-slate-500 font-mono">Pseudonymized Hash</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-800">Aadhaar Last 4</td>
                  <td className="p-3 text-slate-400">Hidden</td>
                  <td className="p-3 text-slate-700 font-mono font-semibold">Own Staff Only</td>
                  <td className="p-3 text-emerald-700 font-semibold">Full Verification</td>
                  <td className="p-3 text-slate-700">Read-Only Audit</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-800">Stall Revenue & P&L</td>
                  <td className="p-3 text-slate-400">Hidden</td>
                  <td className="p-3 text-emerald-700 font-semibold">Own Stall Only</td>
                  <td className="p-3 text-slate-700 font-semibold">Aggregated Society Pool</td>
                  <td className="p-3 text-slate-700">Financial Audit</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-800">UPI Transaction ID</td>
                  <td className="p-3 text-emerald-700 font-semibold">Customer Copy</td>
                  <td className="p-3 text-slate-700">Settlement Copy</td>
                  <td className="p-3 text-emerald-700 font-semibold">Banking Ledger</td>
                  <td className="p-3 text-slate-700">Reconciliation Trail</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cryptographic Audit Trail */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-extrabold text-slate-900">
                Immutable Cryptographic Audit Trail
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {auditLogs.length} verified trail entries
            </span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-slate-800 font-semibold">{log.details}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                  <span>Actor: {log.actor} ({log.actorRole})</span>
                  <span className="text-indigo-600 truncate max-w-xs">Hash: {log.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
