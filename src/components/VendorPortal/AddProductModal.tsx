import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_DATA } from '../../data/mockData';
import { StallCategory, ProductAttribute } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  Plus,
  Package,
  Sparkles,
  Tag,
  CheckCircle2,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useApp();

  const [category, setCategory] = useState<StallCategory>('Handlooms');
  const [subCategory, setSubCategory] = useState('Pochampally Ikat');
  const [title, setTitle] = useState('Chanderi Pure Zari Border Silk Dupatta');
  const [description, setDescription] = useState('Handcrafted sheer Chanderi silk with golden zari border. Light weight, elegant festive wear.');
  const [price, setPrice] = useState(2450);
  const [mrp, setMrp] = useState(3500);
  const [stockCount, setStockCount] = useState(15);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
  const [hasGiTag, setHasGiTag] = useState(true);

  // Category specific dynamic attributes
  const [fabric, setFabric] = useState('Pure Chanderi Silk Cotton');
  const [weave, setWeave] = useState('Traditional Handloom Extra Weft');
  const [care, setCare] = useState('Gentle Handwash / Dryclean');

  const [vegFlag, setVegFlag] = useState('100% Vegetarian');
  const [fssaiNum, setFssaiNum] = useState('13619011000412');
  const [netWeight, setNetWeight] = useState('500g');

  const [footwearMaterial, setFootwearMaterial] = useState('Genuine Camel Leather');
  const [footwearSizes, setFootwearSizes] = useState('6, 7, 8, 9, 10');

  if (!isOpen) return null;

  const currentCategoryObj = CATEGORIES_DATA.find(c => c.id === category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build dynamic attributes based on category
    const attributes: ProductAttribute[] = [];
    if (category === 'Handlooms') {
      attributes.push(
        { key: 'fabric', label: 'Fabric Composition', value: fabric },
        { key: 'weave', label: 'Weaving Technique', value: weave },
        { key: 'care', label: 'Care Instructions', value: care }
      );
    } else if (category === 'Dry Fruits & Food Items') {
      attributes.push(
        { key: 'diet', label: 'Dietary', value: vegFlag },
        { key: 'fssai', label: 'FSSAI License', value: fssaiNum },
        { key: 'net_weight', label: 'Net Weight', value: netWeight }
      );
    } else if (category === 'Leather Goods & Footwear') {
      attributes.push(
        { key: 'material', label: 'Leather Material', value: footwearMaterial },
        { key: 'sizes', label: 'Available Sizes', value: footwearSizes }
      );
    } else {
      attributes.push(
        { key: 'type', label: 'Type', value: subCategory },
        { key: 'origin', label: 'Artisan Heritage', value: 'Numaish Society Verified' }
      );
    }

    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    addProduct({
      stallId: 'stall-101',
      stallName: 'Pochampally Weavers Society',
      stallNumber: 'H-14',
      category,
      subCategory,
      title,
      description,
      price: Number(price),
      mrp: Number(mrp),
      discountPercentage: discount,
      inStock: stockCount > 0,
      stockCount: Number(stockCount),
      images: [imageUrl],
      tags: [hasGiTag ? 'GI Tag Certified' : 'Society Certified', subCategory],
      attributes,
      isVerifiedStall: true,
      hasGiTag
    });

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div
        className="bg-white w-full max-w-xl max-h-[92dvh] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Add Catalog Product (Dynamic Schema)
              </h3>
              <p className="text-[10px] text-orange-200">
                Pochampally Weavers Society • Stall H-14
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 space-y-3.5 flex-1 text-xs">
          {/* Category Selector */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as StallCategory;
                  setCategory(cat);
                  const obj = CATEGORIES_DATA.find(c => c.id === cat);
                  if (obj && obj.subtypes.length > 0) setSubCategory(obj.subtypes[0]);
                }}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
              >
                {CATEGORIES_DATA.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Sub-Category
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
              >
                {currentCategoryObj?.subtypes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Title */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Product Listing Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
            />
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                MRP (₹)
              </label>
              <input
                type="number"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Available Units
              </label>
              <input
                type="number"
                value={stockCount}
                onChange={(e) => setStockCount(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Image URL (Auto-optimised WebP) *
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Description & Artisan Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          {/* Category-Specific Form Section (Changes based on category!) */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wide">
                Category Attributes: {category}
              </span>
              <span className="text-[10px] text-orange-600 font-semibold">
                Auto-adapting schema
              </span>
            </div>

            {category === 'Handlooms' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Fabric</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Weave Type</label>
                  <input
                    type="text"
                    value={weave}
                    onChange={(e) => setWeave(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Wash Care</label>
                  <input
                    type="text"
                    value={care}
                    onChange={(e) => setCare(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}

            {category === 'Dry Fruits & Food Items' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Dietary</label>
                  <select
                    value={vegFlag}
                    onChange={(e) => setVegFlag(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="100% Vegetarian">100% Vegetarian</option>
                    <option value="Non-Vegetarian (100% Halal)">Non-Vegetarian (100% Halal)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">FSSAI Lic.</label>
                  <input
                    type="text"
                    value={fssaiNum}
                    onChange={(e) => setFssaiNum(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Net Weight</label>
                  <input
                    type="text"
                    value={netWeight}
                    onChange={(e) => setNetWeight(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}

            {category === 'Leather Goods & Footwear' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Material</label>
                  <input
                    type="text"
                    value={footwearMaterial}
                    onChange={(e) => setFootwearMaterial(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Sizes (UK/IND)</label>
                  <input
                    type="text"
                    value={footwearSizes}
                    onChange={(e) => setFootwearSizes(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={hasGiTag}
                  onChange={(e) => setHasGiTag(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span>Official GI Tag Certified Product</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Product to Digital Catalog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
