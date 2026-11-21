import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StallCategory } from '../types';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Flame,
  Camera,
  CheckCircle2,
  Tag,
  Sparkles,
  MapPin,
  Image as ImageIcon,
  Radio,
  Send
} from 'lucide-react';

export const VendorQuickDropPage: React.FC = () => {
  const { addStory, products, goBack } = useApp();

  const [stallName, setStallName] = useState('Pochampally Handloom Weavers Co-op');
  const [stallNumber, setStallNumber] = useState('H-14 (Sector Handlooms)');
  const [vendorName, setVendorName] = useState('Narsimha Rao');
  const [category, setCategory] = useState<StallCategory>('Handlooms');
  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
  );
  const [caption, setCaption] = useState(
    '🔥 Flash Drop: Unboxing 10 new Pochampally Ikat silk dupattas! Special 20% off for the next 2 hours at Stall H-14.'
  );
  const [discountTag, setDiscountTag] = useState('20% FLASH DEAL');
  const [featuredProductId, setFeaturedProductId] = useState('prod-1');
  const [isSuccess, setIsSuccess] = useState(false);

  const sampleImages = [
    {
      label: 'Silk Weave',
      url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
    },
    {
      label: 'Haleem Pot',
      url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
    },
    {
      label: 'Pearl Bangles',
      url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
    },
    {
      label: 'Toys Carving',
      url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    addStory({
      stallId: 'stall-101',
      stallName,
      stallNumber: 'H-14',
      vendorName,
      category,
      mediaUrl,
      caption,
      discountTag: discountTag || undefined,
      isHotDeal: true,
      featuredProductId: featuredProductId || undefined
    });

    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 }
    });

    setTimeout(() => {
      goBack();
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-28 md:pb-16 animate-fadeIn">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-rose-700 via-orange-600 to-amber-600 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="p-2 -ml-2 rounded-xl text-white hover:bg-white/20 transition active:scale-95 flex items-center gap-1.5"
              aria-label="Back to Vendor Portal"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
              <span className="text-xs font-bold hidden sm:inline">Back</span>
            </button>
            <div className="h-5 w-px bg-white/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <Flame className="w-4 h-4 animate-bounce-soft" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight">
                  Post Today's Live Drop
                </h1>
                <p className="text-[10px] text-orange-100">
                  Broadcast flash discount or fresh stock directly to all exhibition visitors
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full px-3 sm:px-6 py-5">
        {isSuccess ? (
          <div className="bg-white rounded-3xl p-8 text-center space-y-4 shadow-sm border border-slate-200">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Live Update Broadcasted!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your live story and flash bargain are now active at the top of the Numaish homepage for every visitor.
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Returning to Vendor Portal...
            </div>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="space-y-4">
            {/* Live Visual Preview Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
                  Live Visitor Story Card Preview
                </h3>
                <span className="text-[10px] bg-rose-600 text-white font-black px-2 py-0.5 rounded-full uppercase">
                  60-Sec Flash Drop
                </span>
              </div>

              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 shadow-inner">
                <img
                  src={mediaUrl}
                  alt="Drop Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Camera className="w-3 h-3 text-amber-300" />
                  <span>Live Photo</span>
                </div>

                {discountTag && (
                  <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase shadow-md">
                    ⚡ {discountTag}
                  </div>
                )}

                <div className="absolute bottom-3 inset-x-3 text-white">
                  <p className="text-xs sm:text-sm font-bold line-clamp-2 drop-shadow">
                    {caption}
                  </p>
                  <p className="text-[10px] text-amber-200 font-semibold mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Stall H-14 • Handlooms Sector
                  </p>
                </div>
              </div>

              {/* Quick Sample Photos */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                  Choose Photo Sample or Tap to Swap:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMediaUrl(s.url)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition ${
                        mediaUrl === s.url
                          ? 'border-rose-600 ring-2 ring-rose-300'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={s.url} alt={s.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 inset-x-1 text-[9px] font-bold bg-black/75 text-white text-center rounded truncate px-1">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Caption & Discount Offer */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-3">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-600" />
                Drop Message & Tag
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Story Caption / Live Announcement *
                </label>
                <textarea
                  rows={3}
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Fresh stock just arrived! 25% off for next 2 hours only at Stall H-14."
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Promotional Tag (Shown as Red Badge)
                  </label>
                  <input
                    type="text"
                    value={discountTag}
                    onChange={(e) => setDiscountTag(e.target.value)}
                    placeholder="e.g. 20% FLASH DEAL or NEW ARRIVAL"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold text-rose-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Link Catalog Product (Optional)
                  </label>
                  <select
                    value={featuredProductId}
                    onChange={(e) => setFeaturedProductId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="">None (General Stall Visit)</option>
                    {products
                      .filter((p) => p.stallNumber === 'H-14')
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (₹{p.price})
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Sticky Bottom Broadcast Bar */}
      {!isSuccess && (
        <footer className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 z-40 shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs sm:text-sm font-bold py-2.5 px-7 rounded-2xl shadow-xl transition active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Live to All Visitors</span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};
