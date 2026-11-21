import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA } from '../data/mockData';
import { StallCategory, StallApplication, VendorDocument } from '../types';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
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
  Clock,
  AlertCircle,
  Store,
  Check,
  RotateCcw,
  Zap,
  Trash2,
  Plus
} from 'lucide-react';

export const StallApplicationPage: React.FC = () => {
  const { goBack, navigateTo, submitApplication, appMode, events, activeEventId, activeEvent } = useApp();

  const [selectedEventId, setSelectedEventId] = useState<string>(activeEventId || 'event-numaish-2027');
  const [step, setStep] = useState<number>(1);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);

  // Form Fields - Clean by default in Real Mode
  const [vendorName, setVendorName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobile, setMobile] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StallCategory>('Handlooms');
  const [selectedSubtype, setSelectedSubtype] = useState('Pochampally Ikat');
  const [stallSize, setStallSize] = useState<StallApplication['stallSizePreference']>('Standard (10x10 ft)');
  const [craftCert, setCraftCert] = useState('');
  const [gst, setGst] = useState('');
  const [fssai, setFssai] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Telangana');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Uploaded Documents
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [newDocType, setNewDocType] = useState<VendorDocument['type']>('Aadhaar/PAN');
  const [newDocName, setNewDocName] = useState('');

  const [submittedAppNumber, setSubmittedAppNumber] = useState<string | null>(null);

  const feeMap: Record<StallApplication['stallSizePreference'], number> = {
    'Standard (10x10 ft)': 35000,
    'Prime Corner (15x15 ft)': 48000,
    'Double Stall (20x10 ft)': 65000,
    'Food Stall Special': 75000
  };
  const currentFee = feeMap[stallSize];

  const currentCategoryObj = CATEGORIES_DATA.find((c) => c.id === selectedCategory);

  const handleAutoFillSample = () => {
    setVendorName('Chandrakanth Goud');
    setBusinessName('Pochampally Weavers Heritage');
    setMobile('+91 98480 99887');
    setEmail('chandrakanth.weavers@gmail.com');
    setSelectedCategory('Handlooms');
    setSelectedSubtype('Pochampally Ikat');
    setStallSize('Prime Corner (15x15 ft)');
    setCraftCert('Handloom Mark #TEL-2026-881');
    setGst('36AAACG1234H1Z1');
    setAddress('House 3-21, Handloom Colony, Pochampally');
    setCity('Hyderabad');
    setState('Telangana');
    setAgreedTerms(true);
    setDocuments([
      {
        id: `doc-${Date.now()}-1`,
        name: 'Aadhaar_Vendor_FrontBack.pdf',
        type: 'Aadhaar/PAN',
        status: 'verified',
        fileUrl: '#',
        uploadedAt: new Date().toISOString().split('T')[0]
      },
      {
        id: `doc-${Date.now()}-2`,
        name: 'Craft_GI_HandloomMark_Certificate.pdf',
        type: 'Handloom Mark / GI Tag',
        status: 'pending',
        fileUrl: '#',
        uploadedAt: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const handleClearForm = () => {
    setVendorName('');
    setBusinessName('');
    setMobile('+91 ');
    setEmail('');
    setSelectedCategory('Handlooms');
    setSelectedSubtype('');
    setStallSize('Standard (10x10 ft)');
    setCraftCert('');
    setGst('');
    setFssai('');
    setAddress('');
    setCity('');
    setState('Telangana');
    setAgreedTerms(false);
    setDocuments([]);
  };

  const handleAddSampleDoc = () => {
    const docTitle = newDocName.trim() || `${newDocType.replace('/', '_')}_Verified_${Date.now().toString().slice(-4)}.pdf`;
    const docItem: VendorDocument = {
      id: `doc-${Date.now()}`,
      name: docTitle,
      type: newDocType,
      status: 'verified',
      fileUrl: '#',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [...prev, docItem]);
    setNewDocName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const docItem: VendorDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: newDocType,
        status: 'pending',
        fileUrl: '#',
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      setDocuments(prev => [...prev, docItem]);
    }
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEvent = events.find(e => e.id === selectedEventId) || activeEvent;
    const appNum = submitApplication({
      eventId: targetEvent?.id || 'event-numaish-2027',
      eventName: targetEvent?.name || 'Numaish All India Industrial Exhibition 2027',
      vendorName,
      businessName,
      mobile,
      email,
      category: selectedCategory,
      subCategory: selectedSubtype,
      stallSizePreference: stallSize,
      craftCertification: craftCert || undefined,
      gstNumber: gst || undefined,
      fssaiNumber: fssai || undefined,
      address: address || 'Exhibition Grounds',
      city: city || 'Hyderabad',
      state: state || 'Telangana',
      status: 'submitted',
      feeAmount: currentFee,
      documents
    });

    setSubmittedAppNumber(appNum);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

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
            <ArrowLeft className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <span className="font-extrabold text-slate-900">
              Exhibition Society • Stall Allotment Application
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
            appMode === 'real' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-orange-100 text-orange-800'
          }`}>
            {appMode === 'real' ? '🟢 Real Mode (Clean)' : '🟠 Demo Mode'}
          </span>
          <span className="text-[11px] font-bold text-orange-800 bg-orange-100 px-2.5 py-1 rounded-full hidden sm:inline">
            Numaish 2027
          </span>
        </div>
      </nav>

      {/* 2. Main Page Layout */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24">
        {submittedAppNumber ? (
          /* SUCCESS SUBMISSION SCREEN */
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4 my-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Application Submitted Successfully
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-serif">
                Registration Confirmed!
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Your dossier for <strong>{businessName}</strong> has been saved and routed to the Exhibition Society Allotment Committee.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Official Tracking Number
              </span>
              <p className="text-xl font-mono font-black text-orange-600">
                {submittedAppNumber}
              </p>
              <p className="text-[11px] text-slate-500">
                Category: <strong>{selectedCategory}</strong> • Preferred Size: <strong>{stallSize}</strong>
              </p>
            </div>

            {/* Direct Admin Allotment Helper Button */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Next Step: Allot Stall & Issue Hall Ticket</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                To test the complete end-to-end flow, open the Admin Portal to review and allot this stall. Once allotted, it will immediately appear in the customer <strong>Browse Stalls</strong> view!
              </p>
              <button
                type="button"
                onClick={() => navigateTo({ name: 'admin' })}
                className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Open Admin Portal & Allot This Stall Now</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigateTo({ name: 'stalls' })}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 px-4 rounded-xl transition"
              >
                🎪 Browse Stalls
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmittedAppNumber(null);
                  handleClearForm();
                  setStep(1);
                }}
                className="bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold py-3 px-4 rounded-xl transition"
              >
                ➕ Submit Another Stall
              </button>
            </div>
          </div>
        ) : (
          /* STEPPER WIZARD */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Quick Fill Utility Bar */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                {appMode === 'real' ? 'Clean Form ready for real vendor details' : 'Demo application preview'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoFillSample}
                  className="flex items-center gap-1 text-[11px] font-bold text-orange-700 hover:text-orange-900 bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-2xs hover:bg-orange-50 transition"
                  title="Populate realistic sample data for quick testing"
                >
                  <Zap className="w-3 h-3 text-orange-600" />
                  <span>⚡ Auto-Fill Sample Data</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200 transition"
                  title="Clear all fields"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-center">
              {[
                { num: 1, label: 'Identity' },
                { num: 2, label: 'Category & Documents' },
                { num: 3, label: 'Stall Size' },
                { num: 4, label: 'Declaration' }
              ].map((s) => (
                <div
                  key={s.num}
                  className={`py-3 px-2 border-r last:border-r-0 border-slate-200 flex items-center justify-center gap-1.5 ${
                    step === s.num
                      ? 'bg-orange-600 text-white'
                      : step > s.num
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-slate-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold border border-current">
                    {step > s.num ? '✓' : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Step Form Body */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-slate-900">
                      Step 1: Vendor & Business Identity
                    </h2>
                    <span className="text-xs text-slate-400">* Required fields</span>
                  </div>

                  {/* Target Exhibition Selector */}
                  <div className="bg-orange-50/80 p-3.5 rounded-2xl border border-orange-200 space-y-2">
                    <label className="text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎪</span> Target Exhibition / Fair *
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-orange-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.name} • {ev.hostOrgName} ({ev.city})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-orange-800">
                      Your application, KYC docs, and stall allotment fee will be submitted specifically to the selected exhibition host.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Authorized Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        placeholder="e.g. Chandrakanth Goud / Ghulam Hassan"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Business / Cooperative Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Pochampally Weavers Heritage"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+91 98480 XXXXX"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vendor@example.com"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">Workshop / Registered Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Plot / Street / Artisan Village"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">City / Town</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Hyderabad / Srinagar / Jaipur"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Telangana"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CATEGORY, CRAFT & DOCUMENTS */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Step 2: Pavilion Category, Craft & Verification Documents
                  </h2>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1.5">
                        Exhibition Category *
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          const cat = e.target.value as StallCategory;
                          setSelectedCategory(cat);
                          const c = CATEGORIES_DATA.find((x) => x.id === cat);
                          if (c && c.subtypes.length > 0) setSelectedSubtype(c.subtypes[0]);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        {CATEGORIES_DATA.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {currentCategoryObj && (
                      <div>
                        <label className="font-bold text-slate-700 block mb-1.5">
                          Sub-Category / Specialization
                        </label>
                        <select
                          value={selectedSubtype}
                          onChange={(e) => setSelectedSubtype(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        >
                          {currentCategoryObj.subtypes.map((sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Craft Certificate / GI Tag ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={craftCert}
                          onChange={(e) => setCraftCert(e.target.value)}
                          placeholder="Handloom Mark, GI Tag registration"
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          GST Number (If applicable)
                        </label>
                        <input
                          type="text"
                          value={gst}
                          onChange={(e) => setGst(e.target.value)}
                          placeholder="36AAACG1234H1Z1"
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    {/* Interactive Document Upload Section */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-1.5">
                          <UploadCloud className="w-4 h-4 text-orange-600" />
                          <span>KYC & Craft Certification Documents ({documents.length})</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleAddSampleDoc}
                          className="text-[11px] font-bold text-orange-700 hover:text-orange-900 bg-white px-2.5 py-1 rounded-lg border border-orange-200 hover:bg-orange-50 transition"
                        >
                          + Add Quick Sample Document
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                          value={newDocType}
                          onChange={(e) => setNewDocType(e.target.value as VendorDocument['type'])}
                          className="p-2 rounded-xl border border-slate-200 bg-white text-xs"
                        >
                          <option value="Aadhaar/PAN">Aadhaar/PAN Identity</option>
                          <option value="Handloom Mark / GI Tag">Handloom Mark / GI Tag</option>
                          <option value="GST Certificate">GST Certificate</option>
                          <option value="FSSAI License">FSSAI License</option>
                        </select>
                        <input
                          type="text"
                          value={newDocName}
                          onChange={(e) => setNewDocName(e.target.value)}
                          placeholder="Document filename (or upload below)"
                          className="p-2 rounded-xl border border-slate-200 bg-white text-xs"
                        />
                        <label className="cursor-pointer bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 py-2 px-3 transition">
                          <UploadCloud className="w-4 h-4" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                          />
                        </label>
                      </div>

                      {documents.length > 0 && (
                        <div className="space-y-1.5 pt-2">
                          {documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="w-4 h-4 text-orange-600 shrink-0" />
                                <div className="truncate">
                                  <p className="font-bold text-slate-800 text-xs truncate">{doc.name}</p>
                                  <span className="text-[10px] text-slate-400">{doc.type} • {doc.status}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveDoc(doc.id)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: STALL SIZE & FEE */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Step 3: Stall Size Preference & Ground Fee
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {(Object.keys(feeMap) as StallApplication['stallSizePreference'][]).map(
                      (sizeKey) => (
                        <div
                          key={sizeKey}
                          onClick={() => setStallSize(sizeKey)}
                          className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                            stallSize === sizeKey
                              ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-200'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <strong className="text-sm font-extrabold text-slate-900">{sizeKey}</strong>
                            <span className="text-xs font-black text-orange-600">
                              ₹{feeMap[sizeKey].toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-2">
                            Includes 45-day exhibition electrical connection and 3 crew gate passes.
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: DECLARATION */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Step 4: Review Application & Declaration
                  </h2>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Applicant:</span>
                      <strong>{vendorName || '(Blank)'} ({businessName || '(Blank)'})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contact:</span>
                      <strong>{mobile} • {email}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category:</span>
                      <strong>{selectedCategory} • {selectedSubtype}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Stall Dimension:</span>
                      <strong>{stallSize}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Attached Documents:</span>
                      <strong>{documents.length} files</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                      <span>Society Fee (45 Days):</span>
                      <strong className="text-orange-600 text-sm">
                        ₹{currentFee.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 text-orange-600 focus:ring-orange-500"
                    />
                    <span>
                      I hereby declare all craft and business details submitted are genuine and abide by the All India Industrial Exhibition Society rules and regulations.
                    </span>
                  </label>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl transition"
                  >
                    Previous Step
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-xs transition"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!agreedTerms || !vendorName || !businessName}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    Submit Official Application
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};