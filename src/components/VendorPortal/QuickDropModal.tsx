import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StallCategory } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  Camera,
  Flame,
  Tag,
  CheckCircle2,
  Sparkles,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';

export const QuickDropModal: React.FC = () => {
  const {
    isQuickDropOpen,
    setIsQuickDropOpen,
    addStory,
    products
  } = useApp();

  const [stallName, setStallName] = useState('Pochampally Weavers Society');
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

  if (!isQuickDropOpen) return null;

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
      stallNumber,
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
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsSuccess(false);
      setIsQuickDropOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div
        className="bg-white w-full max-w-md max-h-[92dvh] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-600 to-orange-600 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">
              <Flame className="w-4 h-4 animate-bounce-soft" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Post "Today's Live Drop" (60 Secs)
              </h3>
              <p className="text-[10px] text-orange-100">
                Instantly broadcast to all Numaish visitors
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsQuickDropOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {isSuccess ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Live Update Broadcasted!
              </h4>
              <p className="text-xs text-slate-500">
                Your drop is now featured in the story reel for all exhibition visitors.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePublish} className="space-y-3 text-xs">
              {/* Media Preview & Camera Snap Simulation */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  1. Snap Photo or Select Recent Media *
                </label>
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 mb-2 border border-slate-200">
                  <img
                    src={mediaUrl}
                    alt="Drop Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Camera className="w-3 h-3 text-amber-300" />
                    <span>Live Snap</span>
                  </div>
                  {discountTag && (
                    <div className="absolute bottom-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      ⚡ {discountTag}
                    </div>
                  )}
                </div>

                {/* Quick Preset Images */}
                <div className="flex gap-2">
                  {sampleImages.map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setMediaUrl(img.url)}
                      className={`flex-1 py-1 px-1 rounded-lg border text-[10px] font-medium transition ${
                        mediaUrl === img.url
                          ? 'border-orange-600 bg-orange-50 text-orange-900 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  2. Caption / Message to Visitors *
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  required
                  placeholder="e.g. Fresh steaming batch of Haleem ready! Or 50% discount on last 10 sarees..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Discount / Flash Deal Tag */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-rose-600" />
                    <span>Flash Tag</span>
                  </label>
                  <input
                    type="text"
                    value={discountTag}
                    onChange={(e) => setDiscountTag(e.target.value)}
                    placeholder="e.g. 20% OFF TODAY"
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Link to Catalog Product
                  </label>
                  <select
                    value={featuredProductId}
                    onChange={(e) => setFeaturedProductId(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title.substring(0, 26)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stall Details Indicator */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  Broadcasting from: <strong className="text-slate-900">{stallNumber}</strong>
                </span>
                <span className="text-emerald-600 font-bold">Verified Stall</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg transition active:scale-98"
                >
                  <Flame className="w-4 h-4" />
                  <span>Publish Live Story Drop</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
