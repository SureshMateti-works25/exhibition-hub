import React from 'react';
import { useApp } from '../context/AppContext';
import { StaffRole } from '../types';
import {
  ArrowLeft,
  ShieldCheck,
  QrCode,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  MapPin,
  Clock,
  AlertCircle
} from 'lucide-react';

interface GatePassPageProps {
  staffId?: string;
}

export const GatePassPage: React.FC<GatePassPageProps> = ({ staffId }) => {
  const { staffMembers, goBack } = useApp();

  const staff = staffMembers.find((s) => s.id === staffId) || staffMembers[0];

  const roleLabels: Record<StaffRole, { title: string; color: string; gate: string }> = {
    stall_manager: { title: 'Stall Manager / In-Charge', color: 'bg-purple-100 text-purple-800 border-purple-300', gate: 'All Gates (1, 2, 3)' },
    sales_assistant: { title: 'Floor Sales Staff', color: 'bg-blue-100 text-blue-800 border-blue-300', gate: 'Gate 2 (Ajanta Gate)' },
    billing_counter: { title: 'Billing Counter Cashier', color: 'bg-amber-100 text-amber-800 border-amber-300', gate: 'Gate 2 (Ajanta Gate)' },
    helper: { title: 'Stall Helper & Stock Loader', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', gate: 'All Gates' }
  };

  const roleInfo = staff ? roleLabels[staff.role] || roleLabels.sales_assistant : roleLabels.sales_assistant;

  if (!staff) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold text-slate-700">Gate Pass Not Found</p>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col pb-24 md:pb-12 animate-fadeIn text-slate-100">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95 flex items-center gap-1.5"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-orange-400" />
            <span className="text-xs font-bold">Back</span>
          </button>

          <span className="text-xs font-bold text-slate-300">
            Exhibitor Gate Pass #{staff.gatePassId}
          </span>

          <button
            type="button"
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </header>

      {/* Main Gate Pass Document Card */}
      <main className="max-w-md mx-auto w-full px-4 py-6 flex-1 flex flex-col justify-center">
        <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/50 relative">
          {/* Hologram Header Ribbon */}
          <div className="h-3 bg-gradient-to-r from-orange-600 via-amber-400 to-emerald-500 animate-shimmer-fast" />

          {/* Exhibition Society Official Header */}
          <div className="p-5 text-center border-b border-slate-100 bg-gradient-to-b from-amber-50/60 to-white">
            <span className="inline-block text-[9px] font-black tracking-widest text-orange-800 uppercase bg-orange-100 px-3 py-0.5 rounded-full mb-1.5">
              85th All India Industrial Exhibition 2027
            </span>
            <h2 className="text-lg font-black text-slate-900 font-serif tracking-tight">
              OFFICIAL EXHIBITOR GATE PASS
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">
              The Exhibition Society, Hyderabad • Authorized Entry Badge
            </p>
          </div>

          {/* Pass Content Body */}
          <div className="p-5 space-y-4">
            {/* Photo & Role */}
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-900 shadow-md shrink-0">
                <img
                  src={staff.photoUrl}
                  alt={staff.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[9px] font-black text-center py-0.5">
                  ACTIVE
                </div>
              </div>

              <div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase inline-block mb-1 ${roleInfo.color}`}>
                  {roleInfo.title}
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {staff.name}
                </h3>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  ID: {staff.gatePassId}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-orange-600" />
                  Stall {staff.stallNumber} • Near Gate 2
                </p>
              </div>
            </div>

            {/* Verification QR Box */}
            <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-2xl text-center space-y-2">
              <QrCode className="w-36 h-36 text-slate-950 mx-auto" />
              <p className="text-[10px] font-mono font-bold text-slate-600">
                PASS-VERIFY: {staff.gatePassId}-SECURE-2027
              </p>
              <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 py-1 px-3 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                <span>Digitally Signed by Exhibition Society</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Stall Allotment</span>
                <strong className="text-slate-800">{staff.stallNumber} (Sector Handloom)</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Authorized Gate</span>
                <strong className="text-slate-800">{roleInfo.gate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">DPDP Phone Consent</span>
                <strong className="text-emerald-700">
                  {staff.phone.replace(/(\+91 \d{2})\d{4}(\d{4})/, '$1****$2')} (Masked)
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Validity Period</span>
                <strong className="text-slate-800">Jan 01 - Feb 15, 2027</strong>
              </div>
            </div>

            {/* Legal Notice */}
            <p className="text-[9px] text-slate-400 text-center leading-tight">
              Notice: This digital pass must be presented upon request to Hyderabad City Police & Society Security Personnel. Valid only at Nampally Exhibition Grounds.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-5">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-lg transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Hardcopy Pass</span>
          </button>
          <button
            type="button"
            onClick={() => alert(`Official Gate Pass #${staff.gatePassId} has been verified and saved for offline security check.`)}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>Save Offline</span>
          </button>
        </div>
      </main>
    </div>
  );
};
