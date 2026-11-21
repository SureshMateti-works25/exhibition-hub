import React from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Heart,
  MapPin,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Share2,
  Star
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    stalls,
    addToCart,
    wishlist,
    toggleWishlist,
    navigateTo,
    t
  } = useApp();

  const isWishlisted = wishlist.includes(product.id);

  const handleOpenProduct = () => {
    navigateTo({ name: 'product', productId: product.id });
  };

  const handleOpenStall = (e: React.MouseEvent) => {
    e.stopPropagation();
    const matchedStall = stalls.find(
      (s) => s.id === product.stallId || s.stallNumber === product.stallNumber
    );
    if (matchedStall) {
      navigateTo({ name: 'stall', stallId: matchedStall.id });
    } else {
      navigateTo({ name: 'product', productId: product.id });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `Check out "${product.title}" from ${product.stallName} (Stall ${product.stallNumber}) at Numaish 2027 Exhibition! Price: ₹${product.price}`;
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`,
        '_blank'
      );
    }
  };

  const handleDirectBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    navigateTo({ name: 'cart' });
  };

  return (
    <div
      onClick={handleOpenProduct}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition backdrop-blur-md ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-slate-700 hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* WhatsApp Viral Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-12 right-2.5 w-8 h-8 rounded-full bg-white/80 text-slate-700 hover:text-green-600 hover:bg-white flex items-center justify-center transition backdrop-blur-md opacity-0 group-hover:opacity-100"
          title="Share on WhatsApp"
          aria-label="Share product"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Stall Number Tag on Image */}
        <button
          type="button"
          onClick={handleOpenStall}
          className="absolute bottom-2 left-2.5 bg-black/75 hover:bg-orange-600 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors z-10"
          title="Open stall daily showcase"
        >
          <MapPin className="w-2.5 h-2.5 text-amber-400" />
          <span>Stall {product.stallNumber}</span>
        </button>

        {/* Color Variations Pill on Image */}
        {product.colorVariations && product.colorVariations.length > 1 && (
          <span className="absolute bottom-2 right-2.5 bg-white/95 backdrop-blur-md text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm border border-slate-200/80 flex items-center gap-1 z-10">
            <span className="flex -space-x-1 items-center">
              {product.colorVariations.slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full border border-white"
                  style={{ backgroundColor: c.hexCode || '#64748b' }}
                />
              ))}
            </span>
            <span>{product.colorVariations.length} Colors</span>
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Vendor Name & Verification */}
          <div className="flex items-center justify-between gap-1 mb-1 text-[11px] text-slate-500">
            <button
              type="button"
              onClick={handleOpenStall}
              className="truncate font-medium hover:text-orange-600 transition-colors text-left"
              title="Visit vendor stall profile"
            >
              {product.stallName}
            </button>
            {product.isVerifiedStall && (
              <span className="flex items-center gap-0.5 text-emerald-600 shrink-0 font-semibold" title="Verified Exhibition Society Stall">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[9px]">Verified</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-1.5 group-hover:text-orange-600 transition-colors">
            {product.title}
          </h3>

          {/* Dynamic Attribute Pills (Fabric, GI Tag, Veg/Non-Veg, etc.) */}
          <div className="flex flex-wrap items-center gap-1 mb-2.5">
            {product.hasGiTag && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                ⭐ GI Tag
              </span>
            )}
            {product.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-base sm:text-lg font-black text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
            {product.stockCount <= 5 && product.stockCount > 0 && (
              <span className="text-[10px] text-rose-600 font-bold ml-auto">
                Only {product.stockCount} left!
              </span>
            )}
          </div>

          {/* Action Buttons: Visit Stall & Buy Online */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleOpenStall}
              className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-orange-50 text-slate-800 hover:text-orange-700 text-[11px] font-bold py-2 px-2 rounded-xl transition border border-transparent hover:border-orange-200"
              title="Open full stall view & daily albums"
            >
              <MapPin className="w-3 h-3 text-orange-600" />
              <span>Visit Stall</span>
            </button>

            <button
              onClick={handleDirectBuy}
              className="flex items-center justify-center gap-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-[11px] font-bold py-2 px-2 rounded-xl shadow-sm transition active:scale-95"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Buy Online</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
