import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Stall, StallCategory } from '../../types';
import { MobileImageUploadHelper } from './MobileImageUploadHelper';
import confetti from 'canvas-confetti';
import {
  Store,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Key,
  MapPin,
  Sparkles,
  Phone,
  User,
  Layers,
  Eye,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface StallProfileSettingsProps {
  stall: Stall;
}

const CATEGORIES: StallCategory[] = [
  'Handlooms',
  'Handicrafts',
  'Ready-Made Garments',
  'Home Furnishings',
  'Crockery & Home Essentials',
  'Jewelry & Accessories',
  'Leather Goods & Footwear',
  'Electronics & Appliances',
  'Dry Fruits & Food Items',
  'Amusement & Attractions'
];

export const StallProfileSettings: React.FC<StallProfileSettingsProps> = ({ stall }) => {
  const { updateStall, navigateTo } = useApp();

  const [name, setName] = useState(stall.name || '');
  const [tagline, setTagline] = useState(stall.tagline || '');
  const [description, setDescription] = useState(stall.description || '');
  const [category, setCategory] = useState<StallCategory>(stall.category || 'Handlooms');
  const [subCategoriesStr, setSubCategoriesStr] = useState(
    (stall.subCategories || []).join(', ')
  );
  const [ownerName, setOwnerName] = useState(stall.ownerName || '');
  const [phone, setPhone] = useState(stall.phone || '');
  const [sector, setSector] = useState(stall.sector || 'Sector Handlooms');
  const [nearestGate, setNearestGate] = useState(stall.nearestGate || 'Gate 2 (Ajanta Gate)');
  const [pin, setPin] = useState(stall.pin || '2027');

  // Images state
  const [bannerImages, setBannerImages] = useState<string[]>([
    stall.bannerImage ||
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [logoImages, setLogoImages] = useState<string[]>([
    stall.logoImage ||
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subCats = subCategoriesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateStall(stall.id, {
      name,
      tagline,
      description,
      category,
      subCategories: subCats.length > 0 ? subCats : [category],
      ownerName,
      phone,
      sector,
      nearestGate,
      pin: pin.trim() || '2027',
      bannerImage: bannerImages[0] || stall.bannerImage,
      logoImage: logoImages[0] || stall.logoImage
    });

    setSavedSuccess(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Stall Profile & Showcase Customization
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Update your business name, booth banner photo, brand logo, description, and security access PIN.
            All changes reflect immediately on your public stall page for exhibition shoppers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateTo({ name: 'stall', stallId: stall.id })}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition shrink-0 self-start sm:self-auto"
        >
          <Eye className="w-4 h-4 text-amber-300" />
          <span>Preview Live Stall Page</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <strong className="block font-bold">Stall Settings Saved Successfully!</strong>
            Your updated cover photo, description, and contact info are now live for all exhibition visitors.
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Card 1: Brand & Basic Information */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Store className="w-4 h-4 text-orange-600" />
            Booth Branding & Identification
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Stall / Business Display Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pochampally Weavers Co-op"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Catchy Tagline / Specialization *
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Master Artisan Handlooms & Traditional Ikats"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="font-bold text-slate-800 block mb-1">
              About the Stall & Artisan Story (Description)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell exhibition visitors about your heritage craft, quality guarantee, and booth specialties..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Primary Exhibition Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StallCategory)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-orange-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Sub-categories / Tags (Comma separated)
              </label>
              <input
                type="text"
                value={subCategoriesStr}
                onChange={(e) => setSubCategoriesStr(e.target.value)}
                placeholder="Silk Sarees, Cotton Dupattas, Dress Materials"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Cover Photo & Logo Media Upload (Phone Camera & File Disk) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <ImageIcon className="w-4 h-4 text-orange-600" />
            Booth Media & Showcase Images (Camera / Phone Upload)
          </h4>

          {/* Banner Photo */}
          <div>
            <MobileImageUploadHelper
              images={bannerImages}
              onChange={setBannerImages}
              maxImages={1}
              label="Stall Banner / Cover Photo (Shown prominent on Home Stall View & Stall Page)"
            />
            {bannerImages[0] && (
              <div className="mt-2 relative rounded-2xl overflow-hidden aspect-[16/7] border border-slate-200 bg-slate-950">
                <img
                  src={bannerImages[0]}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/20">
                  Banner Live Preview
                </span>
              </div>
            )}
          </div>

          {/* Logo / Emblem */}
          <div className="pt-2 border-t border-slate-100">
            <MobileImageUploadHelper
              images={logoImages}
              onChange={setLogoImages}
              maxImages={1}
              label="Stall Emblem / Avatar Photo"
            />
          </div>
        </div>

        {/* Card 3: Location & Contact Details */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <MapPin className="w-4 h-4 text-orange-600" />
            Physical Booth Location & Proprietary Contact
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Proprietor / Contact Person</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Contact Phone (For WhatsApp)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98480 23145"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Nearest Grounds Gate</label>
              <select
                value={nearestGate}
                onChange={(e) => setNearestGate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold"
              >
                <option value="Gate 2 (Ajanta Gate) • Main">Gate 2 (Ajanta Gate) • Main</option>
                <option value="Gate 1 (Gandhi Bhavan Gate)">Gate 1 (Gandhi Bhavan Gate)</option>
                <option value="Gate 3 (Goshamahal Gate)">Gate 3 (Goshamahal Gate)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 4: Stall Security Access PIN */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Key className="w-4 h-4 text-orange-600" />
            Vendor Portal Access Credentials & Security PIN
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Stall Security Access PIN (4 Digits) *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="2027"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-mono font-black text-orange-700 bg-orange-50/50"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                You can change this PIN anytime. Use Stall Number (<strong>{stall.stallNumber}</strong>) or registered phone with this PIN to log in.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Public Customer View Status (Set by Society Admin)
              </span>
              <div className="flex items-center gap-2 pt-0.5">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                    stall.isVisibleInStallView !== false
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {stall.isVisibleInStallView !== false
                    ? 'Stall is Published to Customers'
                    : 'Stall is Hidden from Customer Browse'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Products Market Visibility:{' '}
                <strong>
                  {stall.isProductsVisible !== false ? 'Live & Searchable' : 'Hidden by Admin'}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Stall Showcase & Update Public View</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo({ name: 'stall', stallId: stall.id })}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            View Live Booth
          </button>
        </div>
      </form>
    </div>
  );
};
