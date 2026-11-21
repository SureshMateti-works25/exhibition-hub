import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Stall, StallGalleryAlbum, Product } from '../../types';
import { ProductCard } from './ProductCard';
import {
  ArrowLeft,
  X,
  MapPin,
  Heart,
  Share2,
  MessageCircle,
  Phone,
  Store,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Compass,
  Star,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';

interface StallDetailModalProps {
  stall: Stall;
  onClose: () => void;
}

export const StallDetailModal: React.FC<StallDetailModalProps> = ({ stall, onClose }) => {
  const {
    products,
    stallGallery,
    staffMembers,
    followedStalls,
    toggleFollowStall,
    setIsMapOpen,
    setActiveProductModal,
    isMobileFrame
  } = useApp();

  const [activeTab, setActiveTab] = useState<'gallery' | 'products' | 'about'>('gallery');
  const [selectedAlbum, setSelectedAlbum] = useState<StallGalleryAlbum | 'All'>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const isFollowed = followedStalls.includes(stall.id);

  // Products belonging strictly to this stall
  const stallProducts = products.filter(
    (p) => p.stallId === stall.id || p.stallNumber === stall.stallNumber
  );

  // Filter stall products by subcategory
  const filteredStallProducts = stallProducts.filter(
    (p) => selectedSubCategory === 'All' || p.subCategory === selectedSubCategory
  );

  // Daily gallery photos for this stall
  const stallPhotos = stallGallery.filter(
    (g) => g.stallId === stall.id || stall.stallNumber.includes('H-14')
  );

  const filteredPhotos = stallPhotos.filter(
    (p) => selectedAlbum === 'All' || p.album === selectedAlbum
  );

  // Staff on duty for this stall
  const onDutyStaff = staffMembers.filter(
    (s) => s.stallId === stall.id || stall.stallNumber.includes('H-14')
  );

  const albumsList: (StallGalleryAlbum | 'All')[] = [
    'All',
    'Daily Booth Setup',
    'Fresh Today',
    'Artisan Demos',
    'Crowd & Highlights',
    'Night Lights'
  ];

  const handleWhatsAppContact = () => {
    const text = `Hello ${stall.name}! I am viewing your stall (${stall.stallNumber}) on the Numaish 2027 Bazaar app. Are you open for visitors right now?`;
    window.open(`https://wa.me/919848023145?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShare = () => {
    const shareText = `Check out "${stall.name}" (Stall ${stall.stallNumber}) at Numaish 2027! Browse their daily photos & catalog online:`;
    if (navigator.share) {
      navigator.share({ title: stall.name, text: shareText, url: window.location.href }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`, '_blank');
    }
  };

  return (
    <div
      className={`${
        isMobileFrame ? 'absolute inset-0' : 'fixed inset-0'
      } z-50 bg-slate-50 overflow-y-auto animate-fadeIn flex flex-col`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 1rem)' }}
    >
      {/* 1. Sticky Top Navigation App Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md text-white border-b border-white/10 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition backdrop-blur-md"
            aria-label="Back to Exhibition"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Back to Exhibition</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="bg-orange-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-sm">
              Stall {stall.stallNumber}
            </span>
            <span className="hidden md:inline text-xs text-slate-300 font-medium truncate max-w-xs">
              {stall.name}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-sm transition active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            title="Share Stall"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => toggleFollowStall(stall.id)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
              isFollowed
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isFollowed ? 'Unfollow Stall' : 'Follow Stall'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-white' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition ml-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Bigger Hero Cover Photo Banner Section */}
      <section className="relative w-full bg-slate-950 overflow-hidden">
        {/* Full-bleed Stall Cover Banner Image */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={stall.bannerImage}
            alt={`${stall.name} Hero Cover`}
            className="w-full h-full object-cover scale-102 filter brightness-95"
            loading="eager"
          />

          {/* Cinematic Multi-tier Gradient for Top & Bottom legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/20" />

          {/* Cover Photo Status Tags (Top-Left & Top-Right) */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white pointer-events-none">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-black/60 backdrop-blur-md text-orange-300 border border-orange-500/30 text-xs font-bold px-3 py-1 rounded-xl shadow-lg uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-orange-400" />
                Numaish 2027 Pavilion Stall
              </span>
              {stall.hasGiCert && (
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> GI CERTIFIED
                </span>
              )}
            </div>

            <span className="bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-xl shadow-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Open Now
            </span>
          </div>

          {/* Bottom Hero Information Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-start sm:items-end gap-3.5 min-w-0">
              {stall.logoImage && (
                <img
                  src={stall.logoImage}
                  alt={stall.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white shadow-2xl bg-slate-900 shrink-0"
                />
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] sm:text-xs bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Society Verified
                  </span>
                  <span className="text-[10px] sm:text-xs bg-orange-500/25 text-orange-200 border border-orange-400/40 px-2.5 py-0.5 rounded-full font-bold">
                    {stall.sector}
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white font-serif leading-tight drop-shadow-md">
                  {stall.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-2 max-w-2xl font-normal leading-relaxed drop-shadow-sm">
                  {stall.tagline}
                </p>

                <p className="text-xs text-orange-300 font-semibold flex items-center gap-1 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>{stall.nearestGate}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics Badge in Hero */}
            <div className="flex items-center gap-3 shrink-0 bg-black/60 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 self-start md:self-auto">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-sm sm:text-base">
                  <Star className="w-4 h-4 fill-amber-300" />
                  <span>{stall.rating}</span>
                </div>
                <span className="text-[10px] text-slate-300 font-medium">
                  {stall.reviewCount} Reviews
                </span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center px-2">
                <span className="block text-white font-black text-sm sm:text-base">
                  {stall.followersCount}
                </span>
                <span className="text-[10px] text-slate-300 font-medium">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stall Feature Matrix Bar ("With Features Only") */}
      <section className="bg-white border-b border-slate-200 shadow-sm px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Feature 1: Official Code & Sector */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-orange-50/70 border border-orange-100">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-orange-800 font-bold uppercase tracking-wider block">
                  Allotted Stall
                </span>
                <p className="font-extrabold text-slate-900 truncate">
                  Stall {stall.stallNumber}
                </p>
              </div>
            </div>

            {/* Feature 2: Certification / Heritage */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-50/70 border border-amber-100">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
                  Authenticity
                </span>
                <p className="font-extrabold text-slate-900 truncate">
                  {stall.hasGiCert ? 'GI Tag Registered' : 'Society Certified'}
                </p>
              </div>
            </div>

            {/* Feature 3: Walking Distance */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                  Gate Distance
                </span>
                <p className="font-extrabold text-slate-900 truncate">
                  {stall.nearestGate.split('•')[0] || stall.nearestGate}
                </p>
              </div>
            </div>

            {/* Feature 4: Delivery & Pickup */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-indigo-50/70 border border-indigo-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-indigo-800 font-bold uppercase tracking-wider block">
                  Fulfillment
                </span>
                <p className="font-extrabold text-slate-900 truncate">
                  Instant Counter Pickup
                </p>
              </div>
            </div>
          </div>

          {/* Today's Live Announcement Feature Drop */}
          {stall.dailyUpdateSnippet && (
            <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-4 h-4 animate-bounce-soft" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider">
                    Today's Vendor Drop ({stall.lastUpdatedTime || 'Today'})
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                  "{stall.dailyUpdateSnippet}"
                </p>
              </div>
              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-sm shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Inquire</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Feature Navigation Tabs */}
      <nav className="sticky top-[53px] z-30 bg-slate-100/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeTab === 'gallery'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Daily Showcase Album ({stallPhotos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeTab === 'products'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Stall Catalog ({stallProducts.length} Products)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeTab === 'about'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Booth Details & Crew ({onDutyStaff.length})</span>
          </button>
        </div>
      </nav>

      {/* 5. Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* TAB 1: PRESENTATION VIEW - DAILY STALL ALBUM & SHOWCASE */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Daily Photo Presentation Showcase</span>
                  <span className="text-[10px] bg-rose-600 text-white font-black px-2 py-0.5 rounded-full uppercase">
                    Live Today
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explore high-resolution morning booth setups, live handloom artisan demos, and crowd highlights at Stall {stall.stallNumber}.
                </p>
              </div>

              {/* Album Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {albumsList.map((alb) => (
                  <button
                    key={alb}
                    type="button"
                    onClick={() => setSelectedAlbum(alb)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                      selectedAlbum === alb
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {alb}
                  </button>
                ))}
              </div>
            </div>

            {/* Presentation Showcase Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPhotos.map((photo) => {
                const linkedProd = products.find((p) => p.id === photo.taggedProductId);

                return (
                  <div
                    key={photo.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo Thumbnail with Zoom Cursor */}
                      <div
                        onClick={() => setLightboxImage(photo.imageUrl)}
                        className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden cursor-zoom-in"
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Badges */}
                        <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {photo.album}
                        </span>
                        <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                          {photo.dateTag}
                        </span>
                      </div>

                      {/* Content Details */}
                      <div className="p-4 space-y-2.5">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">
                            {photo.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1">
                            {photo.caption}
                          </p>
                        </div>

                        {/* Tagged Product Link */}
                        {linkedProd && (
                          <div
                            onClick={() => setActiveProductModal(linkedProd)}
                            className="p-2.5 rounded-2xl bg-orange-50/80 border border-orange-200/80 flex items-center justify-between cursor-pointer hover:bg-orange-100 transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={linkedProd.images[0]}
                                alt={linkedProd.title}
                                className="w-10 h-10 rounded-xl object-cover shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-orange-950 truncate">
                                  {linkedProd.title}
                                </p>
                                <p className="text-xs text-orange-700 font-extrabold">
                                  ₹{linkedProd.price.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-orange-600 text-white font-bold px-2.5 py-1 rounded-xl shrink-0 shadow-xs">
                              Buy Item
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Photo Reaction Footer */}
                    <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 text-rose-600 font-bold text-xs">
                        <Heart className="w-4 h-4 fill-rose-500" />
                        {photo.likes} people liked this
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Stall {stall.stallNumber}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: STALL VENDOR'S PRODUCTS ONLY */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Exclusive Products from {stall.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing all {stallProducts.length} verified products available at Stall {stall.stallNumber}.
                </p>
              </div>

              {/* Subcategory Filter Pills */}
              {stall.subCategories && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSubCategory('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedSubCategory === 'All'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All Items ({stallProducts.length})
                  </button>
                  {stall.subCategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                        selectedSubCategory === sub
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Products Grid (Only this vendor's products!) */}
            {filteredStallProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStallProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 my-6">
                <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">
                  No items in this subcategory
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try choosing 'All Items' to view all products from this vendor.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ABOUT STALL, BOOTH INFO & CREW ON DUTY */}
        {activeTab === 'about' && (
          <div className="space-y-5">
            {/* Story & Background */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wide text-xs">
                About {stall.name}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {stall.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">Stall Code</span>
                  <strong className="text-orange-600 font-mono text-base">{stall.stallNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">Pavilion Sector</span>
                  <strong className="text-slate-900 text-sm">{stall.sector}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">Proprietor</span>
                  <strong className="text-slate-900 text-sm">{stall.ownerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">Visitors</span>
                  <strong className="text-slate-900 text-sm">{stall.followersCount} Followers</strong>
                </div>
              </div>
            </div>

            {/* Physical Booth Location & Walking Directions */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-3xl border border-orange-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-orange-950 uppercase tracking-wide text-xs flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  How to Visit Stall {stall.stallNumber} at Nampally Exhibition Grounds
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsMapOpen(true);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-orange-800 bg-white hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-300 shadow-sm transition"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Open Interactive Map</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Enter through <strong>{stall.nearestGate}</strong>. Take the central avenue towards the <strong>{stall.sector}</strong>. Stall {stall.stallNumber} is illuminated under large Society banners and provides free fabric demonstrations.
              </p>
            </div>

            {/* On-Duty Staff with Verified Gate Passes */}
            {onDutyStaff.length > 0 && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wide text-xs flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-orange-600" />
                    Authorized On-Duty Staff at Booth
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Gate Passes Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {onDutyStaff.map((staff) => (
                    <div
                      key={staff.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200"
                    >
                      <img
                        src={staff.photoUrl}
                        alt={staff.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-300 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs truncate">{staff.name}</p>
                        <p className="text-[10px] text-slate-500 capitalize font-medium">
                          {staff.role.replace('_', ' ')}
                        </p>
                        <p className="text-[10px] text-orange-700 font-mono font-bold mt-0.5 truncate">
                          Pass: {staff.gatePassId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Lightbox Full-Screen Modal for Gallery Photos */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
        >
          <div className="relative max-w-3xl max-h-[90dvh] overflow-hidden rounded-3xl">
            <img
              src={lightboxImage}
              alt="Enlarged Showcase"
              className="w-full h-auto object-contain max-h-[85dvh]"
            />
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
