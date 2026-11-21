import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_DATA } from '../../data/mockData';
import { StallCategory, StallApplication, VendorDocument } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  UploadCloud,
  FileText,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  AlertCircle
} from 'lucide-react';

export const StallApplicationWizard: React.FC = () => {
  const {
    isStallApplicationOpen,
    setIsStallApplicationOpen,
    applications,
    submitApplication,
    activeEventId,
    activeEvent
  } = useApp();

  // Wizard Steps: 1: Auth & Vendor Details -> 2: Category & Docs -> 3: Stall Preference -> 4: Review & Declaration
  const [step, setStep] = useState<number>(1);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('4821');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);

  // Form Fields
  const [vendorName, setVendorName] = useState('Chandrakanth Goud');
  const [businessName, setBusinessName] = useState('Pochampally Weavers Heritage');
  const [mobile, setMobile] = useState('+91 98480 99887');
  const [email, setEmail] = useState('chandrakanth.weavers@gmail.com');
  const [selectedCategory, setSelectedCategory] = useState<StallCategory>('Handlooms');
  const [selectedSubtype, setSelectedSubtype] = useState('Pochampally Ikat');
  const [stallSize, setStallSize] = useState<StallApplication['stallSizePreference']>('Prime Corner (15x15 ft)');
  const [craftCert, setCraftCert] = useState('Handloom Mark #TEL-2026-881');
  const [gst, setGst] = useState('36AAACG1234H1Z1');
  const [fssai, setFssai] = useState('');
  const [address, setAddress] = useState('House 3-21, Handloom Colony, Pochampally');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Mock Uploaded Documents
  const [documents, setDocuments] = useState<VendorDocument[]>([
    {
      id: 'doc-id-1',
      name: 'Aadhaar_Vendor_FrontBack.pdf',
      type: 'Aadhaar/PAN',
      status: 'verified',
      fileUrl: '#',
      uploadedAt: '2026-11-20'
    },
    {
      id: 'doc-id-2',
      name: 'Craft_GI_HandloomMark_Certificate.pdf',
      type: 'Handloom Mark / GI Tag',
      status: 'pending',
      fileUrl: '#',
      uploadedAt: '2026-11-20'
    }
  ]);

  const [submittedAppNumber, setSubmittedAppNumber] = useState<string | null>(null);

  if (!isStallApplicationOpen) return null;

  // Fee calculation based on stall size
  const feeMap: Record<StallApplication['stallSizePreference'], number> = {
    'Standard (10x10 ft)': 35000,
    'Prime Corner (15x15 ft)': 48000,
    'Double Stall (20x10 ft)': 65000,
    'Food Stall Special': 75000
  };
  const currentFee = feeMap[stallSize];

  const currentCategoryObj = CATEGORIES_DATA.find(c => c.id === selectedCategory);

  const handleVerifyOtp = () => {
    setIsOtpVerified(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appNum = submitApplication({
      eventId: activeEventId || 'event-numaish-2027',
      eventName: activeEvent?.name || 'Numaish 2027',
      vendorName,
      businessName,
      mobile,
      email,
      category: selectedCategory,
      subCategory: selectedSubtype,
      stallSizePreference: stallSize,
      craftCertification: craftCert,
      fssaiNumber: selectedCategory === 'Dry Fruits & Food Items' ? fssai : undefined,
      gstNumber: gst,
      address,
      city,
      state,
      status: 'submitted',
      feeAmount: currentFee,
      documents
    });

    setSubmittedAppNumber(appNum);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  const handleResetAndClose = () => {
    setIsStallApplicationOpen(false);
    setSubmittedAppNumber(null);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div
        className="bg-white w-full max-w-2xl max-h-[92dvh] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Wizard Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Numaish 2027 Digital Stall Application
              </h3>
              <p className="text-[10px] text-orange-200">
                The Exhibition Society • Replaces PDF Form
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Close form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Step Progress Bar */}
        {!submittedAppNumber && (
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                1
              </span>
              <span className={`text-[11px] font-medium ${step === 1 ? 'font-bold text-orange-700' : 'text-slate-500'}`}>
                Identity & OTP
              </span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                2
              </span>
              <span className={`text-[11px] font-medium ${step === 2 ? 'font-bold text-orange-700' : 'text-slate-500'}`}>
                Category & Docs
              </span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                3
              </span>
              <span className={`text-[11px] font-medium ${step === 3 ? 'font-bold text-orange-700' : 'text-slate-500'}`}>
                Review & Fee
              </span>
            </div>
          </div>
        )}

        {/* Wizard Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1">
          {submittedAppNumber ? (
            /* Application Submitted Success Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                  Application Logged in Society Registry
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-2 font-serif">
                  Stall Application Submitted!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Application Number: <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{submittedAppNumber}</span>
                </p>
              </div>

              {/* Status Timeline */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-3">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Application Workflow Timeline
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>1. Form & KYC Documents Submitted (Complete)</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-ping" />
                    <span>2. Under Review by Category Committee (Current)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span>3. Approval & Digital Fee Payment (₹{currentFee.toLocaleString('en-IN')})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span>4. Stall Allotment & Physical Booth QR Pass</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>SMS & WhatsApp status updates will be sent to {mobile}.</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md transition"
              >
                Go to Vendor Dashboard
              </button>
            </div>
          ) : step === 1 ? (
            /* Step 1: Mobile OTP & Business Details */
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-xs text-orange-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Numaish 2027 Extended Portal:</span> Register with your official mobile number. You will receive OTP authentication and SMS notifications at each verification stage.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Authorized Vendor / Proprietor Name *
                  </label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Trade / Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Mobile & OTP Row */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Mobile Number Verification (MSG91 / Fast2SMS Gateway)
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98480 XXXXX"
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={() => setOtpSent(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 rounded-xl shadow-sm transition"
                    >
                      Send OTP
                    </button>
                  ) : isOtpVerified ? (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold px-3">
                      <CheckCircle2 className="w-4 h-4" /> Verified
                    </span>
                  ) : (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-16 text-center text-xs p-2 rounded-xl border border-orange-300 font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 rounded-xl shadow-sm"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                </div>
                {otpSent && !isOtpVerified && (
                  <p className="text-[10px] text-slate-500">
                    OTP sent to {mobile}. (Demo test code pre-filled: 4821)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    GSTIN Number (If registered)
                  </label>
                  <input
                    type="text"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                    placeholder="36AAACG1234H1Z1"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Permanent / Workshop Address *
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition"
                >
                  <span>Next: Category & Documents</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            /* Step 2: Category & Documents */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Exhibition Society Stall Category (Select from 10) *
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    const cat = e.target.value as StallCategory;
                    setSelectedCategory(cat);
                    const obj = CATEGORIES_DATA.find(c => c.id === cat);
                    if (obj && obj.subtypes.length > 0) {
                      setSelectedSubtype(obj.subtypes[0]);
                    }
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {CATEGORIES_DATA.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-category picker */}
              {currentCategoryObj && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Speciality Sub-Category *
                  </label>
                  <select
                    value={selectedSubtype}
                    onChange={(e) => setSelectedSubtype(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {currentCategoryObj.subtypes.map(sub => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional Compliance Inputs */}
              {selectedCategory === 'Handlooms' && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                  <label className="text-xs font-bold text-amber-950 block">
                    Handloom Mark / GI Registration Certification
                  </label>
                  <input
                    type="text"
                    value={craftCert}
                    onChange={(e) => setCraftCert(e.target.value)}
                    placeholder="E.g. Handloom Mark #TEL-2026-881"
                    className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white"
                  />
                  <p className="text-[10px] text-amber-800">
                    Handloom Mark holders qualify for 20% Exhibition Society subsidized stall rate.
                  </p>
                </div>
              )}

              {selectedCategory === 'Dry Fruits & Food Items' && (
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                  <label className="text-xs font-bold text-rose-950 block">
                    Mandatory FSSAI Food Safety License Number *
                  </label>
                  <input
                    type="text"
                    value={fssai}
                    onChange={(e) => setFssai(e.target.value)}
                    placeholder="14-digit FSSAI Registration"
                    className="w-full text-xs p-2 rounded-xl border border-rose-300 bg-white"
                  />
                  <p className="text-[10px] text-rose-800">
                    Required under Telangana Food Safety regulations for all hot food and packaged stalls.
                  </p>
                </div>
              )}

              {/* Document Uploads Area with Previews */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Mandatory KYC & Verification Documents
                  </label>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> DPDP 2023 Encrypted
                  </span>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 text-center hover:bg-slate-100/70 transition cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-orange-600 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drop Identity & Certificate PDFs
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Aadhaar/PAN, GSTIN Certificate, FSSAI, Handloom Mark (Max 5MB each)
                  </p>
                </div>

                {/* Uploaded Documents List */}
                <div className="space-y-1.5">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">{doc.name}</span>
                        <span className="text-[10px] bg-white px-1.5 py-0.2 rounded border text-slate-600">
                          {doc.type}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                        Ready for Review
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-xs py-2 px-3 rounded-xl transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition"
                >
                  <span>Next: Stall Size & Fees</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Step 3: Stall Size, Fees & Final Declaration */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-2">
                  Select Stall Configuration & Dimension
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(
                    [
                      'Standard (10x10 ft)',
                      'Prime Corner (15x15 ft)',
                      'Double Stall (20x10 ft)',
                      'Food Stall Special'
                    ] as StallApplication['stallSizePreference'][]
                  ).map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setStallSize(size)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                        stallSize === size
                          ? 'border-orange-600 bg-orange-50 text-orange-950 ring-1 ring-orange-500'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold">{size}</span>
                        <span className="font-black text-orange-700">
                          ₹{feeMap[size].toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Includes electricity, 2 exhibitor passes & ground security
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Application Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <h5 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1.5">
                  Application Summary
                </h5>
                <div className="flex justify-between">
                  <span className="text-slate-500">Business / Trade:</span>
                  <span className="font-bold text-slate-900">{businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category / Craft:</span>
                  <span className="font-bold text-slate-900">{selectedCategory} ({selectedSubtype})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stall Preference:</span>
                  <span className="font-bold text-slate-900">{stallSize}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-200 text-sm font-extrabold">
                  <span className="text-slate-900">Total Exhibition Fee:</span>
                  <span className="text-orange-600">₹{currentFee.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Society Rules Declaration & DPDP Consent */}
              <div className="p-3 bg-slate-100 rounded-2xl space-y-2 text-[11px] text-slate-600">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>
                    I hereby certify that all information and craft/FSSAI documents provided are authentic. I agree to abide by the Exhibition Society Rules 2027 and India's Digital Personal Data Protection (DPDP) Act terms.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-xs py-2 px-3 rounded-xl transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!agreedTerms}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg transition"
                >
                  <Building className="w-4 h-4" />
                  <span>Submit Digital Stall Application</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
