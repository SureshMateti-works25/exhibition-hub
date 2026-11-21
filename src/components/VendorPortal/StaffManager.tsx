import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StallStaffMember, StaffRole } from '../../types';
import { MobileImageUploadHelper } from './MobileImageUploadHelper';
import confetti from 'canvas-confetti';
import {
  Users,
  UserPlus,
  ShieldCheck,
  QrCode,
  Printer,
  Trash2,
  CheckCircle2,
  X,
  Phone,
  Lock,
  Building,
  Key,
  BadgeAlert,
  ArrowRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const StaffManager: React.FC = () => {
  const {
    stalls,
    selectedVendorStallId,
    staffMembers,
    addStaffMember,
    updateStaffMember,
    removeStaffMember,
    toggleStaffStatus,
    navigateTo
  } = useApp();

  const activeStall =
    stalls.find((s) => s.id === selectedVendorStallId) || stalls[0];

  const myStaff = staffMembers.filter(
    (s) =>
      s.stallId === activeStall?.id ||
      s.stallNumber === activeStall?.stallNumber ||
      (!activeStall && staffMembers.length > 0)
  );

  const [isOnboardFormOpen, setIsOnboardFormOpen] = useState(false);

  // New staff form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [role, setRole] = useState<StaffRole>('sales_assistant');
  const [staffPin, setStaffPin] = useState('1234');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [entryGateAuthorized, setEntryGateAuthorized] = useState('Gate 2 (Ajanta Gate)');
  const [photoUrl, setPhotoUrl] = useState<string[]>([
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  ]);
  const [permissions, setPermissions] = useState<string[]>([
    'orders:verify_pickup',
    'catalog:view',
    'stories:post'
  ]);

  const roleLabels: Record<StaffRole, { title: string; color: string; desc: string }> = {
    stall_manager: {
      title: 'Stall Manager',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      desc: 'Can edit catalog, issue staff passes, and handle pickups'
    },
    sales_assistant: {
      title: 'Sales Associate',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      desc: 'Can collect payments & verify customer pickup tokens'
    },
    billing_counter: {
      title: 'Billing & Cashier',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      desc: 'UPI verification, cash register & invoice receipts'
    },
    helper: {
      title: 'Stall Helper & Stock Loader',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      desc: 'Cargo unloading & booth stock replenishment'
    }
  };

  const handleTogglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const targetStallId = activeStall?.id || 'stall-1';
    const targetStallNumber = activeStall?.stallNumber || 'H-01';

    addStaffMember({
      stallId: targetStallId,
      stallNumber: targetStallNumber,
      name,
      phone,
      role,
      pin: staffPin || '1234',
      aadhaarLast4: aadhaarLast4 || '4921',
      photoUrl: photoUrl[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: 'active',
      entryGateAuthorized,
      permissions
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setIsOnboardFormOpen(false);
    setName('');
    setPhone('+91 ');
    setAadhaarLast4('');
    setStaffPin('1234');
  };

  return (
    <div className="space-y-4">
      {/* Staff Management Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Stall Staff Logins & Exhibitor Gate Passes
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Onboard helpers, cashiers & sales staff. Generates official Exhibition Society Gate Passes for entry through Ajanta/Gandhi Bhavan Gates.
          </p>
        </div>

        <button
          onClick={() => setIsOnboardFormOpen(!isOnboardFormOpen)}
          className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition self-start sm:self-auto active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isOnboardFormOpen ? 'Hide Form' : 'Onboard Stall Worker'}</span>
          {isOnboardFormOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>
      </div>

      {/* INLINE EXPANDABLE ONBOARD FORM (Zero Popups) */}
      {isOnboardFormOpen && (
        <div className="bg-white rounded-3xl p-5 border-2 border-orange-300 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Onboard Stall Worker & Issue Official Gate Pass
                </h4>
                <p className="text-[10px] text-orange-700 font-semibold">
                  Stall {activeStall?.stallNumber || 'H-01'} • {activeStall?.name || 'Exhibition Stall'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOnboardFormOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleOnboardSubmit} className="space-y-4 text-xs">
            {/* DPDP Compliance Notice */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-900 leading-tight">
                <strong>DPDP Act 2023 Compliant:</strong> Staff phone numbers are masked on public visitor pages. Full identification is recorded for Society security gate check only.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Worker Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Mobile Number (For Pass SMS/OTP) *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98480 12345"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Aadhaar Last 4 (ID Check)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={aadhaarLast4}
                  onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 5819"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Staff Access PIN</label>
                <input
                  type="text"
                  maxLength={4}
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  placeholder="1234"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Exhibition Gate Authorized</label>
                <select
                  value={entryGateAuthorized}
                  onChange={(e) => setEntryGateAuthorized(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold"
                >
                  <option value="Gate 2 (Ajanta Gate) • Main">Gate 2 (Ajanta Gate) • Main Entrance</option>
                  <option value="Gate 1 (Gandhi Bhavan Gate)">Gate 1 (Gandhi Bhavan Gate)</option>
                  <option value="Gate 3 (Goshamahal Gate)">Gate 3 (Goshamahal Gate)</option>
                  <option value="All Exhibitor Gates (1, 2, 3)">All Exhibitor Gates (1, 2, 3)</option>
                </select>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">Designated Stall Role *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(Object.keys(roleLabels) as StaffRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      role === r
                        ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-200'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold block text-slate-900">{roleLabels[r].title}</span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                      {roleLabels[r].desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload with Phone Camera Support */}
            <MobileImageUploadHelper
              images={photoUrl}
              onChange={setPhotoUrl}
              maxImages={1}
              label="Worker Identity Photo (Captured from Camera or Gallery)"
            />

            {/* Permission Scopes */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 block">Security Scopes & Permissions</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  { id: 'orders:verify_pickup', label: 'Verify 4-digit customer pickup tokens' },
                  { id: 'stories:post', label: 'Publish live 60-second video/photo drops' },
                  { id: 'gallery:upload', label: 'Upload daily stall showcase photos' },
                  { id: 'billing:create', label: 'Collect UPI/Cash & print receipts' }
                ].map((perm) => (
                  <label key={perm.id} className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={permissions.includes(perm.id)}
                      onChange={() => handleTogglePermission(perm.id)}
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span>{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsOnboardFormOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Onboard Worker & Generate Official Gate Pass</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff Cards Grid */}
      {myStaff.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {myStaff.map((staff) => (
            <div
              key={staff.id}
              className={`bg-white rounded-2xl p-4 border transition-all duration-200 shadow-sm flex flex-col justify-between ${
                staff.status === 'active' ? 'border-slate-200' : 'border-slate-200 bg-slate-50/60 opacity-70'
              }`}
            >
              <div>
                {/* Header with Photo & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img
                        src={staff.photoUrl}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          staff.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {staff.name}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-1 ${
                          roleLabels[staff.role]?.color || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {roleLabels[staff.role]?.title || staff.role}
                      </span>
                    </div>
                  </div>

                  {/* Status Switcher Toggle */}
                  <button
                    onClick={() => toggleStaffStatus(staff.id)}
                    className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border transition ${
                      staff.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {staff.status === 'active' ? 'Active' : 'Deactivated'}
                  </button>
                </div>

                {/* Pass ID & Gate authorization */}
                <div className="bg-slate-50 p-2.5 rounded-xl space-y-1 text-xs border border-slate-100 mb-3">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Gate Pass Token:</span>
                    <span className="font-mono font-bold text-slate-800">{staff.gatePassId}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Staff Login PIN:</span>
                    <span className="font-mono font-bold text-orange-700 bg-orange-100/60 px-1.5 py-0.2 rounded border border-orange-200">
                      {staff.pin || '1234'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Authorized Gate:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                      {staff.entryGateAuthorized || 'Gate 2 (Ajanta Gate)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Masked Contact:</span>
                    <span className="font-mono text-emerald-700 font-semibold">
                      {staff.phone.replace(/(\+91 \d{2})\d{4}(\d{4})/, '$1****$2')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Aadhaar Verification:</span>
                    <span className="font-mono text-slate-700">•••• •••• {staff.aadhaarLast4}</span>
                  </div>
                </div>

                {/* Permissions list */}
                <div className="mb-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Granted App Scopes:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {staff.permissions.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.2 rounded text-slate-700 font-mono"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => navigateTo({ name: 'vendor-gate-pass', staffId: staff.id })}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-sm transition active:scale-95"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-300" />
                  <span>View Full Gate Pass</span>
                </button>

                <button
                  onClick={() => removeStaffMember(staff.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                  title="Revoke Staff Credentials & Cancel Pass"
                  aria-label="Revoke staff"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-xl">
            👥
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            No Staff Onboarded Yet for Stall {activeStall?.stallNumber}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Register your stall workers, helpers, sales assistants, or cashiers. Once onboarded, each staff member receives an official Exhibition Gate Pass QR code and can log in with their mobile number or Gate Pass ID using PIN <strong>1234</strong>.
          </p>
          <button
            type="button"
            onClick={() => setIsOnboardFormOpen(true)}
            className="inline-flex items-center gap-1.5 bg-orange-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:bg-orange-700 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard First Staff Member</span>
          </button>
        </div>
      )}
    </div>
  );
};
