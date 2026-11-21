import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { getDefaultCategoryColors, getDefaultCategorySizes } from '../data/productVariations';
import {
  ArrowLeft,
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
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Check,
  Camera,
  Layers,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';

interface ProductPageProps {
  productId?: string;
}

export const ProductPage: React.FC<ProductPageProps> = ({ productId }) => {
  const {
    products,
    stalls,
    currentRoute,
    goBack,
    navigateTo,
    addToCart,
    wishlist,
    toggleWishlist,
    cart,
    stallGallery
  } = useApp();

  const targetId = productId || (currentRoute.name === 'product' ? currentRoute.productId : products[0]?.id);
  const product = products.find((p) => p.id === targetId) || products[0];

  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageFit, setImageFit] = useState<'contain' | 'cover'>('contain'); // Default to full fit without cropping!
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  // Guarantee that every product has rich colors & size variations for customers
  const effectiveColors =
    product?.colorVariations && product.colorVariations.length > 0
      ? product.colorVariations
      : getDefaultCategoryColors(product?.category);

  const effectiveSizes =
    product?.sizeVariations && product.sizeVariations.length > 0
      ? product.sizeVariations
      : getDefaultCategorySizes(product?.category);

  const [selectedColor, setSelectedColor] = useState<string>(
    effectiveColors[0]?.name || 'Standard Shade'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    effectiveSizes[0]?.name || 'Standard Size'
  );

  useEffect(() => {
    if (product) {
      const colors = product.colorVariations && product.colorVariations.length > 0
        ? product.colorVariations
        : getDefaultCategoryColors(product.category);
      const sizes = product.sizeVariations && product.sizeVariations.length > 0
        ? product.sizeVariations
        : getDefaultCategorySizes(product.category);

      setSelectedColor(colors[0]?.name || 'Standard Shade');
      setSelectedSize(sizes[0]?.name || 'Standard Size');
      setSelectedImageIndex(0);
      setLightboxZoom(1);
    }
  }, [product?.id]);

  const scrollThumbnails = (direction: 'up' | 'down') => {
    if (thumbnailsRef.current) {
      const amount = 100;
      thumbnailsRef.current.scrollBy({
        top: direction === 'up' ? -amount : amount,
        left: direction === 'up' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Product not found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">The requested stall item is unavailable or out of stock.</p>
        <button
          onClick={goBack}
          className="bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Normalize images and up to 5 image angles
  const displayImages: { url: string; name: string }[] =
    product.imageAngles && product.imageAngles.length > 0
      ? product.imageAngles
      : product.images.map((img, i) => ({
          url: img,
          name: i === 0 ? 'Front Drape' : i === 1 ? 'Detail Angle' : `Angle ${i + 1}`
        }));

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleSelectImage = (idx: number) => {
    setSelectedImageIndex(idx);
    if (thumbnailsRef.current && thumbnailsRef.current.children[idx]) {
      const child = thumbnailsRef.current.children[idx] as HTMLElement;
      child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const handlePrevImage = () => {
    if (displayImages.length <= 1) return;
    const newIdx = selectedImageIndex === 0 ? displayImages.length - 1 : selectedImageIndex - 1;
    handleSelectImage(newIdx);
  };

  const handleNextImage = () => {
    if (displayImages.length <= 1) return;
    const newIdx = selectedImageIndex === displayImages.length - 1 ? 0 : selectedImageIndex + 1;
    handleSelectImage(newIdx);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 45) {
      handlePrevImage();
    } else if (diff < -45) {
      handleNextImage();
    }
    setTouchStartX(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayImages.length, selectedImageIndex, isLightboxOpen]);

  const isWishlisted = wishlist.includes(product.id);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const matchedStall = stalls.find(
    (s) => s.id === product.stallId || s.stallNumber === product.stallNumber
  );

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
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, undefined, selectedColor || undefined, selectedSize || undefined);
    navigateTo({ name: 'cart' });
  };

  const handleShare = () => {
    const shareText = `Check out "${product.title}" at Stall ${product.stallNumber} (${product.stallName}) on Numaish 2027 Bazaar! Price: ₹${product.price}`;
    if (navigator.share) {
      navigator.share({ title: product.title, text: shareText, url: window.location.href }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`, '_blank');
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col animate-fadeIn">
      {/* 1. Enterprise Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 px-3 rounded-xl transition shrink-0"
            aria-label="Back to previous page"
          >
            <ArrowLeft className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium truncate">
            <span>Numaish</span>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
            title="Share Product"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => navigateTo({ name: 'cart' })}
            className="relative flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xs transition"
          >
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="bg-orange-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* 2. Main Product Content Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* LEFT COLUMN: Large Media Gallery & Live Showcase */}
          <div className="lg:col-span-7 space-y-4">
            {/* Standard Ecommerce Gallery: Left Thumbnail Strip on Desktop, Single Clean Full-Width Carousel on Mobile */}
            <div className="flex flex-col sm:flex-row gap-3.5 items-start">
              {/* Vertical Thumbnail Strip on LEFT (Desktop only: hidden on mobile so only 1 big carousel image is shown) */}
              {displayImages.length > 0 && (
                <div className="hidden sm:flex flex-col sm:w-24 shrink-0 order-1 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500 px-1">
                    <span>Angles ({displayImages.length})</span>
                    {displayImages.length > 3 && (
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => scrollThumbnails('up')}
                          className="p-0.5 hover:bg-slate-200 rounded text-slate-600 transition"
                          title="Scroll Up"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollThumbnails('down')}
                          className="p-0.5 hover:bg-slate-200 rounded text-slate-600 transition"
                          title="Scroll Down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Scroll Container with visible scrollbar */}
                  <div
                    ref={thumbnailsRef}
                    className="flex flex-col gap-2.5 overflow-y-auto max-h-[520px] w-full thumbnail-scrollbar p-1 pb-1 bg-slate-100/70 rounded-2xl border border-slate-200/80"
                  >
                    {displayImages.slice(0, 5).map((imgObj, idx) => {
                      const isSelected = selectedImageIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectImage(idx)}
                          className={`group relative flex flex-col rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0 text-left ${
                            isSelected
                              ? 'border-orange-600 shadow-md ring-2 ring-orange-200 scale-102 bg-white'
                              : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100 bg-white'
                          } w-full`}
                          title={`Angle #${idx + 1}: ${imgObj.name}`}
                        >
                          <div className="aspect-[4/5] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                            <img
                              src={imgObj.url}
                              alt={imgObj.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          {/* Angle Name & Number Tag */}
                          <div
                            className={`px-1 py-1 text-[8px] sm:text-[9px] font-bold text-center truncate ${
                              isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            <span className="font-extrabold mr-0.5">#{idx + 1}</span> {imgObj.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Main Stage Image on the RIGHT of thumbnails (FULL FIT DISPLAY & CAROUSEL) */}
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative flex-1 aspect-[4/5] sm:aspect-[4/3] w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black border border-slate-800 shadow-lg order-1 sm:order-2 group flex items-center justify-center select-none"
              >
                {/* Product Photo with object-contain to fit entire uploaded photo without cropping */}
                <img
                  key={selectedImageIndex}
                  src={displayImages[selectedImageIndex]?.url || product.images[0]}
                  alt={displayImages[selectedImageIndex]?.name || product.title}
                  className={`w-full h-full max-h-[580px] ${
                    imageFit === 'contain' ? 'object-contain p-1' : 'object-cover'
                  } transition-all duration-300 animate-fadeIn`}
                />

                {/* Carousel Prev Button */}
                {displayImages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-orange-600 text-white backdrop-blur-md border border-white/25 shadow-xl flex items-center justify-center transition-all duration-200 active:scale-90 z-20 group-hover:scale-105 cursor-pointer"
                    aria-label="Previous Image Angle"
                    title="Previous Angle (← Arrow)"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
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
                    className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-orange-600 text-white backdrop-blur-md border border-white/25 shadow-xl flex items-center justify-center transition-all duration-200 active:scale-90 z-20 group-hover:scale-105 cursor-pointer"
                    aria-label="Next Image Angle"
                    title="Next Angle (→ Arrow)"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}

                {/* Carousel Dot Indicators (Bottom-Center) */}
                {displayImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 z-20 shadow-md">
                    {displayImages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectImage(i);
                        }}
                        className={`transition-all duration-300 rounded-full ${
                          selectedImageIndex === i
                            ? 'w-6 h-2 bg-orange-500 shadow-sm'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/90'
                        }`}
                        aria-label={`Go to angle ${i + 1}: ${displayImages[i]?.name}`}
                        title={`Angle ${i + 1}: ${displayImages[i]?.name}`}
                      />
                    ))}
                  </div>
                )}

                {/* Badges on Top-Left */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start pointer-events-none z-10">
                  {product.discountPercentage > 0 && (
                    <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md uppercase tracking-wider">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                  {product.hasGiTag && (
                    <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> GI TAGGED
                    </span>
                  )}
                </div>

                {/* Interactive Top-Right Controls: Active Angle Name, Fit/Fill Toggle & Zoom */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10 flex-wrap justify-end">
                  {/* Active Angle Name Pill */}
                  <div className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate max-w-[140px]">
                      {displayImages[selectedImageIndex]?.name || `Angle ${selectedImageIndex + 1}`}
                    </span>
                    <span className="text-[10px] text-white/60 ml-0.5 font-mono">
                      ({selectedImageIndex + 1}/{displayImages.length})
                    </span>
                  </div>

                  {/* Fit Full Image vs Fill Area Toggle */}
                  <button
                    type="button"
                    onClick={() => setImageFit((prev) => (prev === 'contain' ? 'cover' : 'contain'))}
                    className="bg-black/80 hover:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1 transition shadow-md"
                    title={imageFit === 'contain' ? 'Current: Fit full image (Click to Fill Area)' : 'Current: Fill Area (Click to Fit Full Image)'}
                  >
                    {imageFit === 'contain' ? (
                      <>
                        <Maximize2 className="w-3 h-3 text-emerald-400" />
                        <span className="hidden sm:inline">Fit (Full Image)</span>
                      </>
                    ) : (
                      <>
                        <Minimize2 className="w-3 h-3 text-amber-400" />
                        <span className="hidden sm:inline">Fill Area</span>
                      </>
                    )}
                  </button>

                  {/* High-Resolution Zoom Lightbox Button */}
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="bg-black/80 hover:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1 transition shadow-md"
                    title="Open Fullscreen Lightbox Zoom"
                  >
                    <ZoomIn className="w-3 h-3 text-amber-400" />
                    <span className="hidden sm:inline">Zoom</span>
                  </button>
                </div>

                {/* Stall Pin Badge Bottom-Left */}
                <button
                  type="button"
                  onClick={() => matchedStall && navigateTo({ name: 'stall', stallId: matchedStall.id })}
                  className="absolute bottom-4 left-4 bg-black/80 hover:bg-orange-600 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-lg z-10"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Stall {product.stallNumber}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>
            </div>

            {/* Daily Live Showcase Gallery for this Stall */}
            {stallShowcasePhotos.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight uppercase flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-orange-600" />
                    <span>Live Stall Showcase Gallery (Updated Today)</span>
                  </h3>
                  <span className="text-[10px] text-orange-700 bg-orange-100 font-bold px-2 py-0.5 rounded-full">
                    Stall {product.stallNumber} Live
                  </span>
                </div>

                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {stallShowcasePhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="w-44 shrink-0 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200"
                    >
                      <div className="relative aspect-[4/3] w-full">
                        <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {photo.album}
                        </span>
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{photo.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">{photo.dateTag}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Details, Specifications, Stall Location & Buying */}
          <div className="lg:col-span-5 space-y-5">
            {/* Header info */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="bg-orange-100 text-orange-800 font-bold px-2.5 py-0.5 rounded-lg text-[11px] uppercase">
                  {product.category}
                </span>
                <span className="font-semibold">{product.subCategory}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight font-serif">
                {product.title}
              </h1>

              {/* Pricing Block */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                {product.mrp > product.price && (
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                {product.stockCount > 0 ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    In Stock at Stall ({product.stockCount} left)
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-xl">
                    Sold Out for Today
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                {product.description}
              </p>

              {/* COLOR VARIATIONS SECTION (ALWAYS MENTIONED FOR CUSTOMERS) */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <span>Available Colors:</span>
                    <strong className="text-orange-600 font-black">{selectedColor}</strong>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {effectiveColors.length} Shades Mentioned
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
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/80 shadow-xs ring-2 ring-orange-200'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        title={`Select ${color.name}`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/15 shadow-inner shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: color.hexCode || '#64748b' }}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white drop-shadow-sm" />}
                        </span>
                        <span className={`text-xs ${isSelected ? 'font-black text-orange-950' : 'font-semibold text-slate-700'}`}>
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SIZE & MEASUREMENT VARIATIONS SECTION (IN BOTTOM BELOW COLORS) */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <span>Available Sizes / Draping:</span>
                    <strong className="text-slate-900 font-black">{selectedSize}</strong>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {effectiveSizes.length} Sizing Options
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {effectiveSizes.map((sz) => {
                    const isSelected = selectedSize === sz.name;
                    return (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => setSelectedSize(sz.name)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition active:scale-95 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-orange-400'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {sz.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Specifications Grid */}
              {product.attributes && product.attributes.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                  {product.attributes.map((attr, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">{attr.label}</span>
                      <strong className="text-slate-800 text-xs truncate block mt-0.5">{attr.value}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Physical Stall Location & Direct Contact Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border border-orange-200 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-md">
                    Exhibition Stall Details
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {product.stallName}
                  </h3>
                  <p className="text-xs text-orange-900 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    Stall {product.stallNumber} • Exhibition Grounds, Nampally
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo({ name: 'map' })}
                  className="bg-white hover:bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-orange-300 shadow-xs transition shrink-0"
                >
                  Locate on Map
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-orange-200/80">
                <button
                  type="button"
                  onClick={handleWhatsAppContact}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-xs transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Stall</span>
                </button>

                <button
                  type="button"
                  onClick={handleCallVendor}
                  className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-xs transition active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Vendor</span>
                </button>
              </div>

              {matchedStall && (
                <button
                  type="button"
                  onClick={() => navigateTo({ name: 'stall', stallId: matchedStall.id })}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm transition"
                >
                  <Store className="w-4 h-4" />
                  <span>Visit Full Stall Presentation & Daily Albums</span>
                </button>
              )}
            </div>

            {/* Desktop Add to Cart & Buy Box */}
            <div className="hidden lg:block bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              {(selectedColor || selectedSize) && (
                <div className="p-2.5 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs text-orange-950 flex flex-wrap items-center gap-2">
                  <span className="font-bold text-orange-900">Selected Option:</span>
                  {selectedColor && (
                    <span className="font-black bg-white text-orange-800 px-2.5 py-0.5 rounded-lg shadow-2xs border border-orange-200">
                      Color: {selectedColor}
                    </span>
                  )}
                  {selectedSize && (
                    <span className="font-black bg-white text-slate-800 px-2.5 py-0.5 rounded-lg shadow-2xs border border-slate-200">
                      Size: {selectedSize}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Quantity</span>
                <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center shadow-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold px-2">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white shadow-md transition active:scale-95"
                >
                  Buy Online (UPI)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Mobile Sticky Bottom Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-mobile">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 font-medium block">Total</span>
            {selectedColor && (
              <span className="text-[9px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200 truncate max-w-[80px]">
                {selectedColor}
              </span>
            )}
            {selectedSize && (
              <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded truncate max-w-[80px]">
                {selectedSize}
              </span>
            )}
          </div>
          <span className="text-lg font-black text-slate-900">
            ₹{(product.price * quantity).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center text-xs shadow-xs"
            >
              -
            </button>
            <span className="text-xs font-bold px-2">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center text-xs shadow-xs"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl transition shrink-0"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl shadow-md transition active:scale-95 shrink-0"
          >
            Buy Online
          </button>
        </div>
      </div>

      {/* 4. Fullscreen Ultra High-Res Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pb-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold">
                Angle #{selectedImageIndex + 1}: {displayImages[selectedImageIndex]?.name}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ({selectedImageIndex + 1} of {displayImages.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.max(1, z - 0.5))}
                disabled={lightboxZoom <= 1}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-1 font-bold">{Math.round(lightboxZoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.min(3, z + 0.5))}
                disabled={lightboxZoom >= 3}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition ml-2"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Full Fit Image Container with Carousel Navigation */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-auto p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Prev Button */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                  setLightboxZoom(1);
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-orange-600 text-white backdrop-blur-md border border-white/30 shadow-2xl flex items-center justify-center transition-all duration-200 active:scale-90 z-30 cursor-pointer"
                aria-label="Previous image"
                title="Previous Angle (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Lightbox Next Button */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                  setLightboxZoom(1);
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-orange-600 text-white backdrop-blur-md border border-white/30 shadow-2xl flex items-center justify-center transition-all duration-200 active:scale-90 z-30 cursor-pointer"
                aria-label="Next image"
                title="Next Angle (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <img
              src={displayImages[selectedImageIndex]?.url || product.images[0]}
              alt={displayImages[selectedImageIndex]?.name}
              className="max-h-[82vh] max-w-full object-contain transition-transform duration-200 select-none cursor-zoom-in"
              style={{ transform: `scale(${lightboxZoom})` }}
              onClick={() => setLightboxZoom((z) => (z >= 2 ? 1 : z + 0.5))}
            />
          </div>

          {/* Bottom Thumbnails Strip for Lightbox */}
          <div
            className="flex items-center justify-center gap-2 overflow-x-auto py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedImageIndex(idx);
                  setLightboxZoom(1);
                }}
                className={`relative rounded-xl overflow-hidden border-2 w-14 h-14 shrink-0 transition ${
                  selectedImageIndex === idx
                    ? 'border-orange-500 scale-105 ring-2 ring-orange-300'
                    : 'border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-white text-[8px] font-bold text-center py-0.5 truncate">
                  #{idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
