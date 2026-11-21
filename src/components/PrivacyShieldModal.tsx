import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
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
  Smartphone
} from 'lucide-react';

export const PrivacyShieldModal: React.FC = () => {
  const { isPrivacyShieldOpen, setIsPrivacyShieldOpen, currentUser } = useApp();

  if (!isPrivacyShieldOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div
        className="bg-white w-full max-w-2xl max-h-[92dvh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                DPDP Act 2023 Data Privacy & Multi-Tenant Shield
              </h3>
              <p className="text-[10px] text-emerald-200">
                How user data is partitioned and kept private per role
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPrivacyShieldOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1 text-xs">
          {/* Active Session JWT Token Inspector */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <Key className="w-3.5 h-3.5" />
                <span>Active JWT Session Token (Decoded Claims)</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-white/10 text-orange-300 px-2 py-0.5 rounded-full">
                Role: {currentUser?.role || 'Guest Visitor'}
              </span>
            </div>

            <pre className="p-3 rounded-xl bg-black/60 font-mono text-[10px] text-emerald-300 overflow-x-auto leading-relaxed border border-white/5">
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

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Tenant Scope: <strong className="text-white">{currentUser?.jwtClaims?.tenant || 'Global / Customer'}</strong></span>
              <span className="text-emerald-400">Cryptographically Signed (HS256)</span>
            </div>
          </div>

          {/* Interactive Role Data Visibility Matrix */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-600" />
              Role-Based Data Privacy & Masking Matrix
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[10px] uppercase text-slate-600 border-b border-slate-200">
                    <th className="p-2.5 font-bold">Data Field</th>
                    <th className="p-2.5 font-bold">🛍️ Customer View</th>
                    <th className="p-2.5 font-bold">🏪 Vendor View</th>
                    <th className="p-2.5 font-bold">🏛️ Admin View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Customer Phone</td>
                    <td className="p-2.5 text-emerald-700 font-semibold flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Full (+91 98490 12345)
                    </td>
                    <td className="p-2.5 text-slate-600">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold">
                        +91 98490 •••••
                      </span>{' '}
                      (Masked until order)
                    </td>
                    <td className="p-2.5 text-slate-500">
                      Masked Proxy (Audit-logged access)
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Vendor KYC (Aadhaar / PAN)</td>
                    <td className="p-2.5 text-slate-400 flex items-center gap-1">
                      <EyeOff className="w-3 h-3 text-rose-500" /> Hidden (Shows Verified badge only)
                    </td>
                    <td className="p-2.5 text-slate-700">
                      Own files only (Isolated S3 folder)
                    </td>
                    <td className="p-2.5 text-emerald-700 font-semibold">
                      Decrypted via 15-min Signed URL
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Peer Stall Catalogs</td>
                    <td className="p-2.5 text-slate-700">Public Read-Only</td>
                    <td className="p-2.5 text-slate-500">
                      Read-only public; cannot edit
                    </td>
                    <td className="p-2.5 text-slate-700">Full Moderation & Flagging</td>
                  </tr>

                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Credit / Debit Card Data</td>
                    <td className="p-2.5 text-rose-700 font-semibold" colSpan={3}>
                      🛡️ NEVER STORED: Tokenized directly through PCI-DSS Level 1 Gateway (Razorpay)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 Pillars of Data Privacy in Numaish Bazaar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <Database className="w-4 h-4 text-orange-600" />
                <span>1. Row-Level Security (PostgreSQL)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Database queries enforce <code>WHERE vendor_id = current_setting('jwt.claims.sub')</code>. No vendor API call can read another vendor's draft applications or payout records.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>2. Encrypted Document S3 Vault</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                KYC files are stored with server-side <strong>AES-256 (KMS)</strong> encryption. Uploads use single-use pre-signed URLs with virus scanning and EXIF/GPS stripping.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>3. Customer Number Virtual Proxy</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Under DPDP Act 2023 purpose limitation, phone numbers are masked everywhere in public. Once an order is created, an SMS OTP verifies pickup at the physical stall without exposing personal history.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>4. Append-Only Audit Chain</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Every application approval, status modification, and document unmasking is logged with actor timestamp, IP, and SHA-256 hash chaining so records cannot be tampered with.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500 text-[11px]">
            Data Residency: AWS Mumbai / Hyderabad Region (In-Country)
          </span>
          <button
            onClick={() => setIsPrivacyShieldOpen(false)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-xl transition"
          >
            Close Shield
          </button>
        </div>
      </div>
    </div>
  );
};
