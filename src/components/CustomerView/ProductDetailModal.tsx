import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { getDefaultCategoryColors, getDefaultCategorySizes } from '../../data/productVariations';
import {
  X,
  Heart,
  Share2,
  MapPin,
  Phone,
  MessageCircle,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Info,
  Store,
  Check,
  Camera,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    setIsCartOpen,
    setIsMapOpen,
    stallGallery,
    stalls,
    setActiveStallModal
  } = useApp();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageFit, setImageFit] = useState<'contain' | 'cover'>('contain');

  // Guarantee Colors and Sizes are always shown
  const effectiveColors =
    product.colorVariations && product.colorVariations.length > 0
      ? product.colorVariations
      : getDefaultCategoryColors(product.category);

  const effectiveSizes =
    product.sizeVariations && product.sizeVariations.length > 0
      ? product.sizeVariations
      : getDefaultCategorySizes(product.category);

  const [selectedColor, setSelectedColor] = useState<string>(
    effectiveColors[0]?.name || 'Standard Shade'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    effectiveSizes[0]?.name || 'Standard Size'
  );
  const isWishlisted = wishlist.includes(product.id);

  const matchedStall = stalls.find(
    (s) => s.id === product.stallId || s.stallNumber === product.stallNumber
  );

  const displayImages: { url: string; name: string }[] =
    product.imageAngles && product.imageAngles.length > 0
      ? product.imageAngles
      : product.images.map((img, i) => ({
          url: img,
          name: i === 0 ? 'Front Drape' : i === 1 ? 'Detail Angle' : `Angle ${i + 1}`
        }));

  const handlePrevImage = () => {
    if (displayImages.length <= 1) return;
    setSelectedImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (displayImages.length <= 1) return;
    setSelectedImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleOpenStall = () => {
    if (matchedStall) {
      onClose();
      setActiveStallModal(matchedStall);
    }
  };

  const stallShowcasePhotos = stallGallery.filter(
    (g) => g.stallId === product.stallId || product.stallNumber.includes('H-14')
  );

  const handleWhatsAppContact = () => {
    const text = `Hello ${product.stallName}! I am interested in "${product.title}" (${selectedColor ? 'Color: ' + selectedColor + ', ' : ''}${selectedSize ? 'Size: ' + selectedSize + ', ' : ''}Stall ${product.stallNumber} at Numaish 2027). Is it currently available for viewing/pickup?`;
    window.open(`https://wa.me/919848023145?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCallVendor = () => {
    window.open('tel:+919848023145', '_self');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, undefined, selectedColor || undefined, selectedSize || undefined);
    setIsCartOpen(true);
    onClose();
  };

  const handleLocateOnMap = () => {
    setIsMapOpen(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div
        className="bg-white w-full max-w-2xl max-h-[92dvh] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-100"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Top Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Stall {product.stallNumber}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-2 rounded-full hover:bg-slate-200/60 text-slate-600 transition"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200/60 text-slate-600 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Gallery Area: Small Vertical Thumbnails on LEFT of Big Image with visible scrollbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            {/* Left Thumbnails Strip (Desktop only: hidden on mobile so only 1 big carousel image is shown) */}
            {displayImages.length > 0 && (
              <div className="hidden sm:flex flex-col gap-2 overflow-y-auto max-h-[360px] w-20 shrink-0 thumbnail-scrollbar p-1 bg-slate-100 rounded-xl border border-slate-200 order-1">
                {displayImages.slice(0, 5).map((imgObj, idx) => {
                  const isSelected = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`group relative flex flex-col rounded-xl overflow-hidden border-2 transition shrink-0 ${
                        isSelected
                          ? 'border-orange-600 shadow-sm ring-2 ring-orange-200 scale-102 bg-white'
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100 bg-white'
                      } w-full`}
                      title={`Angle #${idx + 1}: ${imgObj.name}`}
                    >
                      <div className="aspect-[4/5] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                        <img src={imgObj.url} alt={imgObj.name} className="w-full h-full object-cover" />
                      </div>
                      <span className={`px-0.5 py-0.5 text-[8px] font-bold text-center truncate ${
                        isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-800'
                      }`}>
                        #{idx + 1} {imgObj.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Big Main Stage Image with full fit (object-contain) & Carousel Navigation */}
            <div className="relative flex-1 aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 order-1 sm:order-2 flex items-center justify-center select-none group">
              <img
                key={selectedImageIndex}
                src={displayImages[selectedImageIndex]?.url || product.images[0]}
                alt={displayImages[selectedImageIndex]?.name || product.title}
                className={`w-full h-full ${imageFit === 'contain' ? 'object-contain p-1' : 'object-cover'} transition-all duration-300 animate-fadeIn`}
              />

              {/* Carousel Prev Button */}
              {displayImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-orange-600 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90 z-20 cursor-pointer"
                  aria-label="Previous Image Angle"
                  title="Previous Angle"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Carousel Next Button */}
              {displayImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-orange-600 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90 z-20 cursor-pointer"
                  aria-label="Next Image Angle"
                  title="Next Angle"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Carousel Dots Pagination */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 z-20 shadow-sm">
                  {displayImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(i);
                      }}
                      className={`transition-all duration-300 rounded-full ${
                        selectedImageIndex === i
                          ? 'w-5 h-1.5 bg-orange-500'
                          : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/90'
                      }`}
                      aria-label={`Go to angle ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {product.discountPercentage > 0 && (
                <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase shadow">
                  {product.discountPercentage}% DISCOUNT
                </div>
              )}
              {/* Active Angle Badge & Fit Toggle */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                <div className="bg-black/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow">
                  <Camera className="w-3 h-3 text-amber-400" />
                  <span className="truncate max-w-[120px]">
                    {displayImages[selectedImageIndex]?.name || `Angle ${selectedImageIndex + 1}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setImageFit((prev) => (prev === 'contain' ? 'cover' : 'contain'))}
                  className="bg-black/80 hover:bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1 transition shadow"
                  title="Toggle Fit / Fill"
                >
                  {imageFit === 'contain' ? <Maximize2 className="w-3 h-3 text-emerald-400" /> : <Minimize2 className="w-3 h-3 text-amber-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Title & Price Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">{product.subCategory}</span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug font-serif">
              {product.title}
            </h2>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* COLOR VARIATIONS (GUARANTEED FOR SHOPPERS) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">
                  Color: <span className="text-orange-600 font-black">{selectedColor}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                  {effectiveColors.length} Shades
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {effectiveColors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color.name);
                        if (color.image) {
                          const matchIdx = displayImages.findIndex(img => img.url === color.image);
                          if (matchIdx >= 0) setSelectedImageIndex(matchIdx);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition ${
                        isSelected
                          ? 'border-orange-600 bg-orange-50 font-black text-orange-950 ring-1 ring-orange-300'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: color.hexCode || '#64748b' }}
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIZE & MEASUREMENT VARIATIONS (IN BOTTOM) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">
                  Size: <span className="text-slate-900 font-black">{selectedSize}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                  {effectiveSizes.length} Sizing Options
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {effectiveSizes.map((sz) => {
                  const isSelected = selectedSize === sz.name;
                  return (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setSelectedSize(sz.name)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {sz.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category-Specific Dynamic Specifications Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-orange-600" />
              Category Specifications ({product.category})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {product.attributes.map((attr, idx) => (
                <div key={idx} className="flex justify-between py-1.5 px-2.5 rounded-lg bg-white border border-slate-100">
                  <span className="text-slate-500 font-medium">{attr.label}:</span>
                  <span className="text-slate-900 font-bold text-right ml-2">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Stall Location & Direct Contact Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-orange-200">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded">
                  Physical Stall Details
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  {product.stallName}
                </h4>
                <p className="text-xs text-orange-800 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  Stall {product.stallNumber} • Exhibition Grounds, Nampally
                </p>
              </div>

              <button
                onClick={handleLocateOnMap}
                className="bg-white hover:bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-orange-300 shadow-sm transition shrink-0"
              >
                Locate on Map
              </button>
            </div>

            {/* Direct Vendor Communication Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-orange-200/60">
              <button
                onClick={handleWhatsAppContact}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Stall
              </button>

              <button
                onClick={handleCallVendor}
                className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2 px-3 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Vendor
              </button>
            </div>

            {/* Visit Full Stall Showcase Album */}
            {matchedStall && (
              <div className="pt-2 border-t border-orange-200/60">
                <button
                  type="button"
                  onClick={handleOpenStall}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-2 px-3 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                >
                  <Store className="w-4 h-4" />
                  <span>Visit Full Stall Presentation & Daily Albums</span>
                </button>
              </div>
            )}
          </div>

          {/* Daily Stall Showcase Gallery for this Stall */}
          {stallShowcasePhotos.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Live Stall Showcase Gallery (Updated Today)
                </span>
                <span className="text-[10px] text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded-full">
                  Stall {product.stallNumber} Live
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
                {stallShowcasePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="w-36 shrink-0 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1 rounded">
                        {photo.album}
                      </span>
                    </div>
                    <div className="p-1.5">
                      <p className="text-[10px] font-bold text-slate-900 truncate">{photo.title}</p>
                      <p className="text-[9px] text-slate-500 truncate">{photo.dateTag}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exhibition Society Trust Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px] text-slate-500">
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="font-bold text-slate-700">Verified Stall</span>
              <span>Society Approved</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
              <RotateCcw className="w-4 h-4 text-orange-600 mb-1" />
              <span className="font-bold text-slate-700">Fair Pricing</span>
              <span>No Inflated MRP</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
              <Truck className="w-4 h-4 text-indigo-600 mb-1" />
              <span className="font-bold text-slate-700">Stall Pickup</span>
              <span>Zero Waiting Time</span>
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          {/* Quantity selector */}
          <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition"
            >
              +
            </button>
          </div>

          {/* Add to Cart / Buy Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
