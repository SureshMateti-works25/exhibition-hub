import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_DATA } from '../../data/mockData';
import { Product, StallCategory, ProductAttribute } from '../../types';
import { MobileImageUploadHelper } from './MobileImageUploadHelper';
import confetti from 'canvas-confetti';
import {
  X,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Tag,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';

interface ProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  isOpen,
  onClose,
  productToEdit
}) => {
  const { addProduct, updateProduct, deleteProduct } = useApp();

  const isEditing = Boolean(productToEdit);

  const [category, setCategory] = useState<StallCategory>('Handlooms');
  const [subCategory, setSubCategory] = useState('Pochampally Ikat');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(4500);
  const [mrp, setMrp] = useState<number>(6000);
  const [stockCount, setStockCount] = useState<number>(20);
  const [hasGiTag, setHasGiTag] = useState(true);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
  ]);

  // Dynamic Category Attributes
  const [fabric, setFabric] = useState('100% Pure Mulberry Silk');
  const [weave, setWeave] = useState('Double Ikat Weave');
  const [care, setCare] = useState('Dry Clean Only');

  const [diet, setDiet] = useState('100% Vegetarian');
  const [fssai, setFssai] = useState('13619011000412');
  const [netWeight, setNetWeight] = useState('1000g');

  const [leatherMaterial, setLeatherMaterial] = useState('Genuine Camel Leather');
  const [sizes, setSizes] = useState('7, 8, 9, 10, 11');

  useEffect(() => {
    if (productToEdit) {
      setCategory(productToEdit.category);
      setSubCategory(productToEdit.subCategory);
      setTitle(productToEdit.title);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setMrp(productToEdit.mrp);
      setStockCount(productToEdit.stockCount);
      setHasGiTag(Boolean(productToEdit.hasGiTag));
      setImages(productToEdit.images);

      // Extract existing attributes if available
      productToEdit.attributes.forEach((attr) => {
        if (attr.key === 'fabric') setFabric(attr.value);
        if (attr.key === 'weave') setWeave(attr.value);
        if (attr.key === 'care') setCare(attr.value);
        if (attr.key === 'diet') setDiet(attr.value);
        if (attr.key === 'fssai') setFssai(attr.value);
        if (attr.key === 'net_weight') setNetWeight(attr.value);
        if (attr.key === 'material') setLeatherMaterial(attr.value);
        if (attr.key === 'sizes') setSizes(attr.value);
      });
    } else {
      // Defaults for new product
      setTitle('Pochampally Handwoven Pure Silk Saree');
      setDescription('Heritage double ikat silk saree directly from master weavers. Lightweight, vibrant festive colors.');
      setPrice(4500);
      setMrp(6000);
      setStockCount(15);
      setImages(['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80']);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const currentCategoryObj = CATEGORIES_DATA.find((c) => c.id === category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct dynamic attributes
    const attributes: ProductAttribute[] = [];
    if (category === 'Handlooms') {
      attributes.push(
        { key: 'fabric', label: 'Fabric Composition', value: fabric },
        { key: 'weave', label: 'Weaving Technique', value: weave },
        { key: 'care', label: 'Care Instructions', value: care }
      );
    } else if (category === 'Dry Fruits & Food Items') {
      attributes.push(
        { key: 'diet', label: 'Dietary', value: diet },
        { key: 'fssai', label: 'FSSAI License', value: fssai },
        { key: 'net_weight', label: 'Net Weight', value: netWeight }
      );
    } else if (category === 'Leather Goods & Footwear') {
      attributes.push(
        { key: 'material', label: 'Leather Material', value: leatherMaterial },
        { key: 'sizes', label: 'Available Sizes', value: sizes }
      );
    } else {
      attributes.push(
        { key: 'subtype', label: 'Sub-Category', value: subCategory },
        { key: 'quality', label: 'Quality Assurance', value: 'Numaish Verified Stall' }
      );
    }

    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    if (isEditing && productToEdit) {
      updateProduct(productToEdit.id, {
        title,
        description,
        category,
        subCategory,
        price: Number(price),
        mrp: Number(mrp),
        discountPercentage: discount,
        stockCount: Number(stockCount),
        inStock: Number(stockCount) > 0,
        images: images.length > 0 ? images : productToEdit.images,
        attributes,
        hasGiTag
      });
    } else {
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
        inStock: Number(stockCount) > 0,
        stockCount: Number(stockCount),
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        tags: [hasGiTag ? 'GI Tag Certified' : 'Society Certified', subCategory],
        attributes,
        isVerifiedStall: true,
        hasGiTag
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (productToEdit && window.confirm(`Are you sure you want to remove "${productToEdit.title}" from your stall catalog?`)) {
      deleteProduct(productToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div
        className="bg-white w-full max-w-xl max-h-[94dvh] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight">
                {isEditing ? 'Edit Stall Product & Stock' : 'Add New Product (Mobile Camera Snap)'}
              </h4>
              <p className="text-[10px] text-orange-200">
                Stall H-14 • Pochampally Weavers Society
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 flex-1 text-xs">
          {/* Mobile Camera / Disk Image Upload Component */}
          <MobileImageUploadHelper
            images={images}
            onChange={setImages}
            maxImages={4}
            label="Product Photos (Snap from Phone Camera or Gallery)"
          />

          {/* Title */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">Product Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Pure Silk Pochampally Double Ikat Saree"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
            />
          </div>

          {/* Pricing & Stock Stepper */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">MRP (₹)</label>
              <input
                type="number"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Stock Count</label>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setStockCount(Math.max(0, stockCount - 1))}
                  className="w-8 py-2 text-center text-slate-600 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(Number(e.target.value))}
                  className="w-full text-center font-bold text-xs p-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setStockCount(stockCount + 1)}
                  className="w-8 py-2 text-center text-slate-600 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Category & Subtype */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as StallCategory;
                  setCategory(cat);
                  const obj = CATEGORIES_DATA.find((c) => c.id === cat);
                  if (obj && obj.subtypes.length > 0) setSubCategory(obj.subtypes[0]);
                }}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
              >
                {CATEGORIES_DATA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Sub-Category</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
              >
                {currentCategoryObj?.subtypes.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category-Specific Dynamic Specifications */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wide block">
              Flexible Specs: {category}
            </span>

            {category === 'Handlooms' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block">Fabric</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block">Weave</label>
                  <input
                    type="text"
                    value={weave}
                    onChange={(e) => setWeave(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block">Care</label>
                  <input
                    type="text"
                    value={care}
                    onChange={(e) => setCare(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}

            {category === 'Dry Fruits & Food Items' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block">Dietary</label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="100% Vegetarian">100% Vegetarian</option>
                    <option value="Non-Vegetarian (100% Halal)">Non-Vegetarian (100% Halal)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block">FSSAI Lic.</label>
                  <input
                    type="text"
                    value={fssai}
                    onChange={(e) => setFssai(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block">Net Weight</label>
                  <input
                    type="text"
                    value={netWeight}
                    onChange={(e) => setNetWeight(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}

            {category === 'Leather Goods & Footwear' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block">Material</label>
                  <input
                    type="text"
                    value={leatherMaterial}
                    onChange={(e) => setLeatherMaterial(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block">Available Sizes</label>
                  <input
                    type="text"
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer pt-1 font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={hasGiTag}
                onChange={(e) => setHasGiTag(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span>Government GI Tag Certified Product</span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">Description & Weaving Clan</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Product Changes' : 'Publish Product to Stall'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
