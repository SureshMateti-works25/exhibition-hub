import React from 'react';
import { useApp } from '../../context/AppContext';
import { Stall } from '../../types';
import {
  MapPin,
  CheckCircle2,
  Heart,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Store,
  Star,
  Flame,
  Image as ImageIcon,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface StallCardProps {
  stall: Stall;
}

export const StallCard: React.FC<StallCardProps> = ({ stall }) => {
  const {
    navigateTo,
    followedStalls,
    toggleFollowStall,
    products,
    stallGallery
  } = useApp();

  const isFollowed = followedStalls.includes(stall.id);

  // Products belonging strictly to this stall
  const stallProducts = products.filter(
    (p) => p.stallId === stall.id || p.stallNumber === stall.stallNumber
  );

  // Daily gallery photos for this stall strictly
  const stallPhotos = stallGallery.filter(
    (g) => g.stallId === stall.id || g.stallId === stall.stallNumber
  );

  const handleOpenStall = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigateTo({ name: 'stall', stallId: stall.id });
  };

  const handleWhatsAppContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Hello ${stall.name}! I am browsing your stall (${stall.stallNumber}) on the Numaish 2027 Bazaar app. Are you open for visitors right now?`;
    window.open(`https://wa.me/919848023145?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      onClick={() => handleOpenStall()}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Prominent Stall Cover Photo Area */}
      <div
        onClick={() => handleOpenStall()}
        className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 overflow-hidden cursor-pointer"
      >
        <img
          src={stall.bannerImage}
          alt={`${stall.name} Cover Photo`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/40" />

        {/* Top Badges Bar */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-orange-600 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 uppercase tracking-wide">
              <Store className="w-3.5 h-3.5" /> Stall {stall.stallNumber}
            </span>
            {stall.hasGiCert && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                ⭐ GI TAG
              </span>
            )}
            {stall.isVerified && (
              <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Society Verified
              </span>
            )}
          </div>

          {/* Action Pills: Daily Photos & Follow */}
          <div className="flex items-center gap-1.5 shrink-0">
            {stallPhotos.length > 0 && (
              <span className="bg-black/60 backdrop-blur-md text-orange-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-orange-400" />
                {stallPhotos.length} Photos Today
              </span>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFollowStall(stall.id);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                isFollowed
                  ? 'bg-rose-50 text-rose-600 shadow-md'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
              aria-label="Follow stall"
            >
              <Heart className={`w-4 h-4 ${isFollowed ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Cover Photo Content Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between gap-3 z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            {stall.logoImage && (
              <img
                src={stall.logoImage}
                alt={stall.name}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenStall();
                }}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-lg bg-slate-900 shrink-0 cursor-pointer"
              />
            )}
            <div className="min-w-0">
              <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block truncate">
                {stall.sector}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white truncate leading-tight font-serif drop-shadow-sm">
                {stall.name}
              </h3>
              <p className="text-[11px] text-slate-200 flex items-center gap-1 truncate mt-0.5">
                <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                <span>{stall.nearestGate}</span>
              </p>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-amber-300 shrink-0 border border-white/10 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{stall.rating}</span>
          </div>
        </div>
      </div>

      {/* Stall Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Tagline */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {stall.tagline}
          </p>

          {/* Daily Live Update Snippet Banner */}
          {stall.dailyUpdateSnippet && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-50/80 border border-rose-200/70 flex items-start gap-1.5 text-xs text-rose-950">
              <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5 animate-bounce-soft" />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-black uppercase text-rose-700 block">
                  Today's Stall Drop ({stall.lastUpdatedTime || 'Today'})
                </span>
                <p className="text-[11px] font-semibold truncate">
                  "{stall.dailyUpdateSnippet}"
                </p>
              </div>
            </div>
          )}

          {/* Features Strip */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[10px] text-slate-600 font-medium">
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
              <Zap className="w-3 h-3 text-amber-600" /> In-Stall Pickup
            </span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Genuine
            </span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-semibold">
              Prop: {stall.ownerName}
            </span>
          </div>
        </div>

        {/* Showcase Highlights (Products & Photos preview) */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">
              Stall Catalog ({stallProducts.length} items)
            </span>
            <span className="text-[10px] text-orange-600 font-bold flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              {stallPhotos.length} daily photos
            </span>
          </div>

          {/* Products Preview Chips */}
          {stallProducts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5">
              {stallProducts.slice(0, 3).map((prod) => (
                <div
                  key={prod.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo({ name: 'product', productId: prod.id });
                  }}
                  className="bg-slate-50 hover:bg-orange-50 rounded-xl p-1.5 border border-slate-100 hover:border-orange-300 flex flex-col items-center text-center cursor-pointer transition transform hover:-translate-y-0.5"
                  title={`View ${prod.title} (₹${prod.price})`}
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-full aspect-square rounded-lg object-cover mb-1"
                  />
                  <span className="text-[10px] font-bold text-slate-900 truncate w-full">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-dashed border-slate-200">
              <p className="text-[11px] text-slate-500 font-medium">
                Catalog being updated by vendor
              </p>
              <span className="text-[10px] text-orange-600 font-bold mt-0.5 inline-block">
                Visit booth counter for live collection →
              </span>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-2.5 px-3 rounded-xl border border-emerald-200 transition active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenStall();
            }}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition group-hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span>Visit Stall Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
