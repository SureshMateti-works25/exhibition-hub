import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA } from '../data/mockData';
import { Product, StallCategory, ProductAttribute, ProductImageAngle, ColorVariation, SizeVariation } from '../types';
import { getDefaultCategoryColors, getDefaultCategorySizes } from '../data/productVariations';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Tag,
  DollarSign,
  Layers,
  Sparkles,
  Camera,
  ShieldCheck,
  AlertCircle,
  Zap,
  Store,
  RotateCcw,
  Palette,
  Ruler,
  Eye,
  Check,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

interface VendorProductFormPageProps {
  productId?: string;
}

interface AngleSlotData {
  slot: number; // 1 to 5
  slotTitle: string; // e.g. "Angle 1: Front Drape (Main Cover)"
  suggestedName: string;
  name: string;
  description: string;
  badge: string;
  presets: string[];
  url: string | null;
}

const getCategoryAngleConfigs = (cat: StallCategory) => {
  if (cat === 'Handlooms') {
    return [
      {
        title: 'Angle 1: Front Drape (Main Cover)',
        suggestedName: 'Front Drape',
        description: 'Full front look of the saree as draped or displayed. This is the primary cover image shown on the bazaar catalog.',
        badge: 'Primary Cover',
        presets: ['Front Drape', 'Full Look', 'Mannequin Drape', 'Front View']
      },
      {
        title: 'Angle 2: Pallu & Zari Detail',
        suggestedName: 'Pallu & Zari Detail',
        description: 'Close-up of the grand pallu pattern, golden/silver zari work, and edge tassels.',
        badge: 'Pallu Angle',
        presets: ['Pallu & Zari Detail', 'Zari Border Close-up', 'Grand Pallu', 'Tassels Detail']
      },
      {
        title: 'Angle 3: Fabric & Weave Close-up',
        suggestedName: 'Fabric Weave Close-up',
        description: 'Macro shot showing pure silk texture, yarn density, and authentic ikat tie-dye weave.',
        badge: 'Texture Angle',
        presets: ['Fabric Weave Close-up', 'Pure Silk Texture', 'Ikat Motif Macro', 'Handloom Grain']
      },
      {
        title: 'Angle 4: Pleats & Fall Drape',
        suggestedName: 'Pleats & Fall',
        description: 'Lower skirt pleats showing how the saree drapes, flares, and moves.',
        badge: 'Pleats Angle',
        presets: ['Pleats & Fall', 'Lower Pleats Drape', 'Pleats Flow', 'Side Fall']
      },
      {
        title: 'Angle 5: Blouse Piece / Border',
        suggestedName: 'Blouse Piece / Border',
        description: 'Unstitched blouse fabric piece or reverse side weave demonstrating authentic handloom craftsmanship.',
        badge: 'Blouse / Back',
        presets: ['Blouse Piece / Border', 'Unstitched Blouse Piece', 'Reverse Weave Authenticity', 'Border Zari']
      }
    ];
  }
  if (cat === 'Ready-Made Garments') {
    return [
      {
        title: 'Angle 1: Front Full Look (Main Cover)',
        suggestedName: 'Front View',
        description: 'Full frontal view of the garment on model or hanger.',
        badge: 'Primary Cover',
        presets: ['Front View', 'Full Outfit Look', 'Hanger View', 'Front Fit']
      },
      {
        title: 'Angle 2: Back Design Detail',
        suggestedName: 'Back View',
        description: 'Back cut, zipper, embroidery, or drape.',
        badge: 'Back Angle',
        presets: ['Back View', 'Back Design', 'Rear Silhouette', 'Zipper & Tie']
      },
      {
        title: 'Angle 3: Side Profile & Silhouette',
        suggestedName: 'Side Profile',
        description: 'Side view showing garment fit, flare, and sleeve length.',
        badge: 'Side Angle',
        presets: ['Side Profile', 'Side Flare', 'Sleeve Length', 'Profile View']
      },
      {
        title: 'Angle 4: Collar, Neckline & Embroidery',
        suggestedName: 'Neck & Collar Detail',
        description: 'Close-up of the collar, buttons, embroidery, or lace work.',
        badge: 'Detail Angle',
        presets: ['Neck & Collar Detail', 'Embroidery Close-up', 'Button & Placket', 'Lace Work']
      },
      {
        title: 'Angle 5: Fabric Texture & Stitching',
        suggestedName: 'Fabric Texture',
        description: 'Close-up macro of the cloth weave, stitching quality, and hemline.',
        badge: 'Fabric Angle',
        presets: ['Fabric Texture', 'Stitching Quality', 'Lining Detail', 'Hemline Finish']
      }
    ];
  }
  if (cat === 'Jewelry & Accessories') {
    return [
      {
        title: 'Angle 1: Full Jewelry Set (Main Cover)',
        suggestedName: 'Full Set View',
        description: 'Complete necklace set with earrings displayed on velvet bust or case.',
        badge: 'Primary Cover',
        presets: ['Full Set View', 'Complete Necklace Set', 'Velvet Box Display', 'Jewelry Set']
      },
      {
        title: 'Angle 2: Pendant & Centerpiece Detail',
        suggestedName: 'Pendant & Clasp Detail',
        description: 'Intricate close-up of the center stone, kundan, or emerald pendant.',
        badge: 'Pendant Angle',
        presets: ['Pendant & Clasp Detail', 'Centerpiece Close-up', 'Stone Setting', 'Locket Detail']
      },
      {
        title: 'Angle 3: Lustre & Pearl Grade Macro',
        suggestedName: 'Lustre Close-up',
        description: 'Macro shot demonstrating pearl lustre, smooth skin, and round symmetry.',
        badge: 'Lustre Angle',
        presets: ['Lustre Close-up', 'Pearl Grade Macro', 'Surface Polish', 'Bead Detail']
      },
      {
        title: 'Angle 4: Matching Earrings / Studs',
        suggestedName: 'Earrings Detail',
        description: 'Close-up of matching jhumkas, studs, or drops included in the set.',
        badge: 'Earrings Angle',
        presets: ['Earrings Detail', 'Jhumka Pair', 'Earring Drops', 'Studs Close-up']
      },
      {
        title: 'Angle 5: Hallmark & Lab Certificate',
        suggestedName: 'Hallmark & Certificate',
        description: 'Government 92.5 silver hallmark stamp or gemological lab authenticity card.',
        badge: 'Govt Certificate',
        presets: ['Hallmark & Certificate', '92.5 Silver Stamp', 'IIGJ Lab Card', 'Guarantee Card']
      }
    ];
  }
  if (cat === 'Leather Goods & Footwear') {
    return [
      {
        title: 'Angle 1: Top Angle & Embroidery (Main Cover)',
        suggestedName: 'Top Angle & Zari',
        description: 'Top-down view of the pair showing shape, toe curve, and upper zardozi embroidery.',
        badge: 'Primary Cover',
        presets: ['Top Angle & Zari', 'Pair Top View', 'Upper Embroidery', 'Toe Shape']
      },
      {
        title: 'Angle 2: Side Profile & Silhouette',
        suggestedName: 'Side Profile',
        description: 'Side profile showing arch curve, shoe height, and side stitching.',
        badge: 'Side Angle',
        presets: ['Side Profile', 'Arch & Curve', 'Side Stitching', 'Profile Angle']
      },
      {
        title: 'Angle 3: Sole & Leather Insole',
        suggestedName: 'Sole & Leather Insole',
        description: 'Bottom treated leather sole and cushioned inner footbed.',
        badge: 'Sole Angle',
        presets: ['Sole & Leather Insole', 'Cushioned Footbed', 'Treated Leather Sole', 'Bottom Grip']
      },
      {
        title: 'Angle 4: Zardozi & Threadwork Close-up',
        suggestedName: 'Embroidery Detail',
        description: 'Macro close-up of golden zari metallic threadwork and velvet sheen.',
        badge: 'Detail Angle',
        presets: ['Embroidery Detail', 'Zardozi Threadwork', 'Velvet Texture', 'Beadwork Macro']
      },
      {
        title: 'Angle 5: Heel & Back Stitching',
        suggestedName: 'Heel & Back Angle',
        description: 'Rear view of the heel counter, back padding, and craftsmanship.',
        badge: 'Heel Angle',
        presets: ['Heel & Back Angle', 'Heel Counter', 'Back Padding', 'Rear View']
      }
    ];
  }
  return [
    {
      title: 'Angle 1: Front Main Angle (Main Cover)',
      suggestedName: 'Front View',
      description: 'Primary product look for exhibition catalog.',
      badge: 'Primary Cover',
      presets: ['Front View', 'Full Look', 'Main Display', 'Cover Angle']
    },
    {
      title: 'Angle 2: Side Perspective',
      suggestedName: 'Side Angle',
      description: 'Side profile showing dimensions, depth, and thickness.',
      badge: 'Side Angle',
      presets: ['Side Angle', 'Depth View', '3/4 Angle', 'Profile Angle']
    },
    {
      title: 'Angle 3: Craftsmanship & Texture Detail',
      suggestedName: 'Detail Close-up',
      description: 'Macro shot of artisan handiwork, materials, or ingredients.',
      badge: 'Texture Angle',
      presets: ['Detail Close-up', 'Handcraft Macro', 'Texture Finish', 'Ingredient Detail']
    },
    {
      title: 'Angle 4: Back / Base View',
      suggestedName: 'Back View',
      description: 'Reverse or bottom perspective showing construction or seals.',
      badge: 'Base / Back',
      presets: ['Back View', 'Base View', 'Reverse Finish', 'Bottom Seal']
    },
    {
      title: 'Angle 5: In-Use / Packaging Display',
      suggestedName: 'Packaging / In-Use',
      description: 'Item in its gift box, pouch, or serving setup.',
      badge: 'Packaging Angle',
      presets: ['Packaging / In-Use', 'Gift Box Display', 'Serving Presentation', 'Scale Reference']
    }
  ];
};

export const VendorProductFormPage: React.FC<VendorProductFormPageProps> = ({
  productId
}) => {
  const {
    stalls,
    selectedVendorStallId,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    goBack,
    navigateTo
  } = useApp();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const productToEdit = productId ? products.find((p) => p.id === productId) : null;
  const isEditing = Boolean(productToEdit);

  // Determine current stall
  const defaultStallId =
    productToEdit?.stallId ||
    selectedVendorStallId ||
    (stalls.length > 0 ? stalls[0].id : 'stall-101');
  const [chosenStallId, setChosenStallId] = useState<string>(defaultStallId);

  const activeStall = stalls.find((s) => s.id === chosenStallId) || stalls[0];

  const [category, setCategory] = useState<StallCategory>(activeStall?.category || 'Handlooms');
  const [subCategory, setSubCategory] = useState(activeStall?.subCategories?.[0] || 'Artisan Craft');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [mrp, setMrp] = useState<number>(0);
  const [stockCount, setStockCount] = useState<number>(10);
  const [hasGiTag, setHasGiTag] = useState(false);

  // 5 Dedicated Product Angle Slots
  const [slots, setSlots] = useState<AngleSlotData[]>(() => {
    const initialCat = productToEdit?.category || activeStall?.category || 'Handlooms';
    const configs = getCategoryAngleConfigs(initialCat);
    const existing = productToEdit?.imageAngles ||
      (productToEdit?.images?.map((url, i) => ({
        url,
        name: i === 0 ? 'Front Drape' : i === 1 ? 'Pallu & Zari Detail' : `Angle ${i + 1}`
      }))) || [];

    return configs.map((cfg, idx) => ({
      slot: idx + 1,
      slotTitle: cfg.title,
      suggestedName: cfg.suggestedName,
      name: existing[idx] ? existing[idx].name : cfg.suggestedName,
      description: cfg.description,
      badge: cfg.badge,
      presets: cfg.presets,
      url: existing[idx] ? existing[idx].url : null
    }));
  });

  const [activeUploadSlotNumber, setActiveUploadSlotNumber] = useState<number>(1);

  // Color Variations (Guaranteed default options based on exhibition category)
  const [colorVariations, setColorVariations] = useState<ColorVariation[]>(() => {
    return productToEdit?.colorVariations && productToEdit.colorVariations.length > 0
      ? productToEdit.colorVariations
      : getDefaultCategoryColors(activeStall?.category || 'Handlooms');
  });
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1e3a8a');

  // Size Variations (Guaranteed default options based on exhibition category)
  const [sizeVariations, setSizeVariations] = useState<SizeVariation[]>(() => {
    return productToEdit?.sizeVariations && productToEdit.sizeVariations.length > 0
      ? productToEdit.sizeVariations
      : getDefaultCategorySizes(activeStall?.category || 'Handlooms');
  });
  const [newSizeName, setNewSizeName] = useState('');

  // Live Preview active angle index
  const [previewAngleIdx, setPreviewAngleIdx] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<string | null>(null);

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
      setChosenStallId(productToEdit.stallId);
      setCategory(productToEdit.category);
      setSubCategory(productToEdit.subCategory);
      setTitle(productToEdit.title);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setMrp(productToEdit.mrp);
      setStockCount(productToEdit.stockCount);
      setHasGiTag(Boolean(productToEdit.hasGiTag));

      const configs = getCategoryAngleConfigs(productToEdit.category);
      const existing = productToEdit.imageAngles ||
        (productToEdit.images?.map((url, i) => ({
          url,
          name: i === 0 ? 'Front Drape' : i === 1 ? 'Pallu & Zari Detail' : `Angle ${i + 1}`
        }))) || [];

      setSlots(
        configs.map((cfg, idx) => ({
          slot: idx + 1,
          slotTitle: cfg.title,
          suggestedName: cfg.suggestedName,
          name: existing[idx] ? existing[idx].name : cfg.suggestedName,
          description: cfg.description,
          badge: cfg.badge,
          presets: cfg.presets,
          url: existing[idx] ? existing[idx].url : null
        }))
      );

      if (productToEdit.colorVariations && productToEdit.colorVariations.length > 0) {
        setColorVariations(productToEdit.colorVariations);
      } else {
        setColorVariations(getDefaultCategoryColors(productToEdit.category));
      }
      if (productToEdit.sizeVariations && productToEdit.sizeVariations.length > 0) {
        setSizeVariations(productToEdit.sizeVariations);
      } else {
        setSizeVariations(getDefaultCategorySizes(productToEdit.category));
      }

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
    }
  }, [productToEdit]);

  const handleCategoryChange = (newCat: StallCategory) => {
    setCategory(newCat);
    const catData = CATEGORIES_DATA.find((c) => c.id === newCat);
    if (catData && catData.subtypes.length > 0) {
      setSubCategory(catData.subtypes[0]);
    }
    const newConfigs = getCategoryAngleConfigs(newCat);
    setSlots(prev =>
      newConfigs.map((cfg, idx) => {
        const prevSlot = prev[idx];
        return {
          slot: idx + 1,
          slotTitle: cfg.title,
          suggestedName: cfg.suggestedName,
          name: prevSlot?.url ? prevSlot.name : cfg.suggestedName,
          description: cfg.description,
          badge: cfg.badge,
          presets: cfg.presets,
          url: prevSlot ? prevSlot.url : null
        };
      })
    );
    setColorVariations(getDefaultCategoryColors(newCat));
    setSizeVariations(getDefaultCategorySizes(newCat));
  };

  const processAndCompressFile = (file: File, targetSlotNum: number) => {
    setIsCompressing(true);
    setCompressionStatus(`Compressing photo for Angle #${targetSlotNum}...`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          const origSizeKb = Math.round(file.size / 1024);
          const compressedSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

          setSlots(prev =>
            prev.map(s => (s.slot === targetSlotNum ? { ...s, url: compressedDataUrl } : s))
          );

          setCompressionStatus(`Angle #${targetSlotNum} updated: ${origSizeKb}KB ➔ ${compressedSizeKb}KB WebP`);
        }
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const triggerCameraForSlot = (slotNum: number) => {
    setActiveUploadSlotNumber(slotNum);
    cameraInputRef.current?.click();
  };

  const triggerGalleryForSlot = (slotNum: number) => {
    setActiveUploadSlotNumber(slotNum);
    galleryInputRef.current?.click();
  };

  const removeSlotPhoto = (slotNum: number) => {
    setSlots(prev =>
      prev.map(s => (s.slot === slotNum ? { ...s, url: null } : s))
    );
  };

  const updateSlotName = (slotNum: number, newName: string) => {
    setSlots(prev =>
      prev.map(s => (s.slot === slotNum ? { ...s, name: newName } : s))
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processAndCompressFile(files[0], activeUploadSlotNumber);
    e.target.value = '';
  };

  const handleAddColor = (name: string, hex?: string) => {
    if (!name.trim()) return;
    if (colorVariations.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) return;
    const newColor: ColorVariation = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      hexCode: hex || '#1e3a8a',
      inStock: true
    };
    setColorVariations(prev => [...prev, newColor]);
    setNewColorName('');
  };

  const handleRemoveColor = (id: string) => {
    setColorVariations(prev => prev.filter(c => c.id !== id));
  };

  const handleAddSize = (name: string) => {
    if (!name.trim()) return;
    if (sizeVariations.some(s => s.name.toLowerCase() === name.trim().toLowerCase())) return;
    const newSize: SizeVariation = {
      id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      inStock: true
    };
    setSizeVariations(prev => [...prev, newSize]);
    setNewSizeName('');
  };

  const handleRemoveSize = (id: string) => {
    setSizeVariations(prev => prev.filter(s => s.id !== id));
  };

  const handleAutoFillSample = () => {
    setTitle('Heritage Handwoven Pure Silk Double Ikat Saree');
    setDescription('Master artisan handwoven silk with authentic double-warp weave, traditional Telia Rumal geometric motifs and rich golden zari border.');
    setPrice(6850);
    setMrp(9500);
    setStockCount(14);
    setHasGiTag(true);

    const sampleAngles = [
      { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', name: 'Front Drape' },
      { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', name: 'Pallu & Zari Detail' },
      { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', name: 'Fabric Weave Close-up' },
      { url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80', name: 'Pleats & Fall' },
      { url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80', name: 'Blouse Piece / Border' }
    ];

    setSlots(prev =>
      prev.map((s, idx) => ({
        ...s,
        url: sampleAngles[idx]?.url || null,
        name: sampleAngles[idx]?.name || s.suggestedName
      }))
    );

    setColorVariations([
      { id: 'c-1', name: 'Royal Peacock Blue', hexCode: '#1e3a8a', inStock: true },
      { id: 'c-2', name: 'Rani Magenta Pink', hexCode: '#be185d', inStock: true },
      { id: 'c-3', name: 'Temple Emerald Green', hexCode: '#047857', inStock: true },
      { id: 'c-4', name: 'Mustard Haldi Gold', hexCode: '#b45309', inStock: true },
      { id: 'c-5', name: 'Shahi Crimson Maroon', hexCode: '#991b1b', inStock: true }
    ]);

    setSizeVariations([
      { id: 's-1', name: 'Standard Saree (5.5m + 0.8m Blouse Piece)', inStock: true },
      { id: 's-2', name: 'Extended Length (6.3m + 0.9m Blouse Piece)', inStock: true }
    ]);
  };

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setPrice(0);
    setMrp(0);
    setStockCount(10);
    setHasGiTag(false);
    setSlots(prev => prev.map(s => ({ ...s, url: null })));
    setColorVariations([]);
    setSizeVariations([]);
  };

  const currentCategoryObj = CATEGORIES_DATA.find((c) => c.id === category);
  const discount = mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  // Uploaded non-null slots
  const activeUploadedSlots = slots.filter((s): s is AngleSlotData & { url: string } => Boolean(s.url));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || price <= 0) {
      alert('Please enter a product title and valid price.');
      return;
    }

    // Dynamic attributes
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

    const stallObj = stalls.find((s) => s.id === chosenStallId) || activeStall;
    const finalStallId = stallObj?.id || 'stall-real-1';
    const finalStallName = stallObj?.name || 'Exhibition Artisan Stall';
    const finalStallNumber = stallObj?.stallNumber || 'H-01';

    const fallbackImage = currentCategoryObj?.bannerImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
    const finalImageAngles: ProductImageAngle[] = activeUploadedSlots.map(s => ({
      url: s.url,
      name: s.name || s.suggestedName
    }));
    const finalImages = finalImageAngles.length > 0 ? finalImageAngles.map(a => a.url) : [fallbackImage];

    const effectiveColors = colorVariations.length > 0 ? colorVariations : getDefaultCategoryColors(category);
    const effectiveSizes = sizeVariations.length > 0 ? sizeVariations : getDefaultCategorySizes(category);

    if (isEditing && productToEdit) {
      updateProduct(productToEdit.id, {
        stallId: finalStallId,
        stallName: finalStallName,
        stallNumber: finalStallNumber,
        title,
        description,
        category,
        subCategory,
        price: Number(price),
        mrp: Number(mrp) || Number(price),
        discountPercentage: discount,
        stockCount: Number(stockCount),
        inStock: Number(stockCount) > 0,
        images: finalImages,
        imageAngles: finalImageAngles,
        colorVariations: effectiveColors,
        sizeVariations: effectiveSizes,
        attributes,
        hasGiTag
      });
    } else {
      addProduct({
        stallId: finalStallId,
        stallName: finalStallName,
        stallNumber: finalStallNumber,
        category,
        subCategory,
        title,
        description,
        price: Number(price),
        mrp: Number(mrp) || Number(price),
        discountPercentage: discount,
        inStock: Number(stockCount) > 0,
        stockCount: Number(stockCount),
        images: finalImages,
        imageAngles: finalImageAngles,
        colorVariations: effectiveColors,
        sizeVariations: effectiveSizes,
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

    goBack();
  };

  const handleDelete = () => {
    if (productToEdit && window.confirm(`Are you sure you want to remove "${productToEdit.title}" from your stall catalog?`)) {
      deleteProduct(productToEdit.id);
      goBack();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-28 md:pb-16 animate-fadeIn">
      {/* Sticky Top App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95 flex items-center gap-1.5"
              aria-label="Back to Vendor Portal"
            >
              <ArrowLeft className="w-5 h-5 text-orange-400" />
              <span className="text-xs font-bold hidden sm:inline">Back</span>
            </button>
            <div className="h-5 w-px bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight">
                  {isEditing ? 'Edit Stall Product' : 'Add New Product'}
                </h1>
                <p className="text-[10px] text-orange-200">
                  {activeStall ? `Stall ${activeStall.stallNumber} • ${activeStall.name}` : 'Vendor Exhibition Catalog'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={handleAutoFillSample}
                className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-orange-200 hover:text-white bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/20 transition"
              >
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                <span>⚡ Auto-Fill</span>
              </button>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition text-xs font-bold flex items-center gap-1"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-lg transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Product</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="max-w-4xl mx-auto w-full px-3 sm:px-6 py-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 0: Stall Assignment & Quick Tools */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Stall Allotment & Association
                </h3>
              </div>

              {!isEditing && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoFillSample}
                    className="flex items-center gap-1 text-[11px] font-bold text-orange-700 hover:text-orange-900 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 transition"
                  >
                    <Zap className="w-3 h-3 text-orange-600" />
                    <span>⚡ Fill Sample Product</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Assign Product to Exhibition Stall *
              </label>
              {stalls.length > 0 ? (
                <select
                  value={chosenStallId}
                  onChange={(e) => setChosenStallId(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none bg-white font-semibold text-slate-800"
                >
                  {stalls.map((s) => (
                    <option key={s.id} value={s.id}>
                      Stall {s.stallNumber}: {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center justify-between">
                  <span>No registered stalls found in active database yet.</span>
                  <button
                    type="button"
                    onClick={() => navigateTo({ name: 'apply' })}
                    className="text-orange-700 font-bold underline"
                  >
                    Apply for Stall
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hidden native mobile file inputs for phone camera snap & disk upload */}
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            type="file"
            ref={galleryInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Section 1: Product Photos & 5 Named Angles */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-orange-600" />
                  Product Photos & 5 Dedicated Angle Slots ({activeUploadedSlots.length}/5 Angles Uploaded)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload up to 5 specific angles (Front Drape, Pallu & Zari, Fabric Weave, Pleats & Fall, Blouse Piece). Each angle has its own slot and replacement button.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const sampleAngles = [
                      { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', name: 'Front Drape' },
                      { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', name: 'Pallu & Zari Detail' },
                      { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', name: 'Fabric Weave Close-up' },
                      { url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80', name: 'Pleats & Fall' },
                      { url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80', name: 'Blouse Piece / Border' }
                    ];
                    setSlots((prev) =>
                      prev.map((s, idx) => ({
                        ...s,
                        url: sampleAngles[idx]?.url || null,
                        name: sampleAngles[idx]?.name || s.suggestedName
                      }))
                    );
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs transition"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>⚡ Load 5 Saree Angles</span>
                </button>

                {compressionStatus && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {compressionStatus}
                  </span>
                )}
              </div>
            </div>

            {/* Instruction Banner on How Replacing Angles Works */}
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950 space-y-1">
              <span className="font-extrabold flex items-center gap-1.5 text-orange-900">
                <Info className="w-4 h-4 text-orange-600 shrink-0" />
                Step-by-Step Angle Photo Guide:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-orange-900/90 pl-1">
                <li><strong>Angle #1:</strong> Main Cover Photo shown on Bazaar product cards and catalog search.</li>
                <li><strong>Angles #2 to #5:</strong> Detail shots (Pallu & Zari, Fabric Weave, Pleats & Fall, Blouse Piece).</li>
                <li><strong>To Replace an Angle:</strong> Click <span className="font-bold underline">"Replace via Camera"</span> or <span className="font-bold underline">"Replace via File"</span> on that specific Angle Card.</li>
              </ul>
            </div>

            {isCompressing && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-orange-800 animate-pulse">
                <RotateCcw className="w-4 h-4 animate-spin text-orange-600" />
                <span>Processing & compressing high-res photo for instant mobile loading...</span>
              </div>
            )}

            {/* 5 DEDICATED ANGLE SLOT CARDS */}
            <div className="space-y-3 pt-1">
              {slots.map((slotItem) => {
                const hasPhoto = Boolean(slotItem.url);
                return (
                  <div
                    key={slotItem.slot}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition ${
                      hasPhoto
                        ? 'bg-slate-50/90 border-slate-300 shadow-2xs'
                        : 'bg-white border-dashed border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                          #{slotItem.slot}
                        </span>
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 block">
                            {slotItem.slotTitle}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {slotItem.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 uppercase tracking-wide">
                          {slotItem.badge}
                        </span>
                        {hasPhoto ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Photo Uploaded
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                            Slot Empty
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 items-start">
                      {/* Thumbnail / Upload Box */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 shrink-0 flex items-center justify-center shadow-xs">
                        {hasPhoto ? (
                          <>
                            <img
                              src={slotItem.url!}
                              alt={slotItem.name}
                              className="w-full h-full object-contain p-1"
                            />
                            <div className="absolute top-1 right-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              #{slotItem.slot}
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-2 text-slate-400">
                            <Camera className="w-6 h-6 mx-auto mb-1 opacity-50" />
                            <span className="text-[9px] font-bold block leading-tight">No Photo</span>
                          </div>
                        )}
                      </div>

                      {/* Controls and Naming for this Slot */}
                      <div className="flex-1 w-full space-y-2">
                        <div>
                          <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                            Angle #{slotItem.slot} Label Name (Displayed on Customer Thumbnail):
                          </label>
                          <input
                            type="text"
                            value={slotItem.name}
                            onChange={(e) => updateSlotName(slotItem.slot, e.target.value)}
                            placeholder={`e.g. ${slotItem.suggestedName}`}
                            className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                          />
                        </div>

                        {/* Quick Presets for this Slot */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-semibold">Suggested Names:</span>
                          {slotItem.presets.map((preset, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => updateSlotName(slotItem.slot, preset)}
                              className={`text-[10px] px-2 py-0.5 rounded-lg border font-semibold transition ${
                                slotItem.name === preset
                                  ? 'bg-orange-600 text-white border-orange-600'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>

                        {/* Dedicated Action Buttons for this specific Slot */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {hasPhoto ? (
                            <>
                              <button
                                type="button"
                                disabled={isCompressing}
                                onClick={() => triggerCameraForSlot(slotItem.slot)}
                                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition active:scale-95 shadow-xs"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span>Replace via Camera</span>
                              </button>
                              <button
                                type="button"
                                disabled={isCompressing}
                                onClick={() => triggerGalleryForSlot(slotItem.slot)}
                                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition active:scale-95 shadow-xs"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Replace via File</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSlotPhoto(slotItem.slot)}
                                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition"
                                title="Remove this angle photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                disabled={isCompressing}
                                onClick={() => triggerCameraForSlot(slotItem.slot)}
                                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition active:scale-95 shadow-xs"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span>📸 Snap Camera for Angle #{slotItem.slot}</span>
                              </button>
                              <button
                                type="button"
                                disabled={isCompressing}
                                onClick={() => triggerGalleryForSlot(slotItem.slot)}
                                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition active:scale-95"
                              >
                                <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                                <span>📁 Upload Photo for Angle #{slotItem.slot}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Customer Preview in Vendor Form */}
            {activeUploadedSlots.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    Live Customer Gallery Preview (Left-Thumbnail Layout)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Click thumbnails to test angle switching
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  {/* Left Thumbnails Rail with Visible Scrollbar */}
                  <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[300px] w-full sm:w-24 shrink-0 thumbnail-scrollbar p-1 bg-slate-800/80 rounded-xl">
                    {activeUploadedSlots.map((ang, i) => {
                      const isSelected = previewAngleIdx === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPreviewAngleIdx(i)}
                          className={`flex flex-col rounded-xl overflow-hidden border-2 transition shrink-0 ${
                            isSelected
                              ? 'border-orange-500 ring-2 ring-orange-300 scale-102 bg-slate-900'
                              : 'border-slate-700 opacity-60 hover:opacity-100 bg-slate-900'
                          } w-16 sm:w-full`}
                        >
                          <img src={ang.url} alt="" className="w-full aspect-square object-contain p-0.5 bg-black" />
                          <span className={`text-[8px] font-bold text-center px-0.5 py-0.5 truncate ${
                            isSelected ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}>
                            #{ang.slot} {ang.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Big Image with object-contain & Carousel Controls */}
                  <div className="relative flex-1 aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center select-none group">
                    <img
                      src={activeUploadedSlots[previewAngleIdx]?.url || activeUploadedSlots[0]?.url}
                      alt="Preview"
                      className="w-full h-full object-contain p-1"
                    />

                    {/* Prev Angle Button */}
                    {activeUploadedSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewAngleIdx((prev) => (prev === 0 ? activeUploadedSlots.length - 1 : prev - 1));
                        }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-orange-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition active:scale-90 z-20 cursor-pointer"
                        title="Previous Angle"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}

                    {/* Next Angle Button */}
                    {activeUploadedSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewAngleIdx((prev) => (prev === activeUploadedSlots.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-orange-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition active:scale-90 z-20 cursor-pointer"
                        title="Next Angle"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    {/* Dots indicator */}
                    {activeUploadedSlots.length > 1 && (
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full border border-white/20 z-20">
                        {activeUploadedSlots.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setPreviewAngleIdx(i)}
                            className={`rounded-full transition-all ${
                              previewAngleIdx === i ? 'w-4 h-1.5 bg-orange-500' : 'w-1.5 h-1.5 bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow">
                      <Camera className="w-3 h-3 text-amber-400" />
                      <span>{activeUploadedSlots[previewAngleIdx]?.name || 'Angle Preview'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Color Variations Available */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-orange-600" />
                Color Variations Available ({colorVariations.length} Colors Mentioned)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mention and showcase all color shades available for this saree / product. Customers can select their desired color before ordering.
              </p>
            </div>

            {/* Quick 1-Click Popular Color Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 block">
                1-Click Popular Saree / Fabric Colors:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { name: 'Royal Peacock Blue', hex: '#1e3a8a' },
                  { name: 'Rani Magenta Pink', hex: '#be185d' },
                  { name: 'Temple Emerald Green', hex: '#047857' },
                  { name: 'Mustard Haldi Gold', hex: '#b45309' },
                  { name: 'Shahi Crimson Maroon', hex: '#991b1b' },
                  { name: 'Sunset Rust Orange', hex: '#c2410c' },
                  { name: 'Midnight Black', hex: '#18181b' },
                  { name: 'Off-White / Cream', hex: '#fef3c7' }
                ].map((colorPreset, cIdx) => (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => handleAddColor(colorPreset.name, colorPreset.hex)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-slate-200 hover:border-orange-400 bg-slate-50 hover:bg-orange-50/50 text-xs text-slate-800 font-semibold transition active:scale-95"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: colorPreset.hex }}
                    />
                    <span>+ {colorPreset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Input */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-10 h-10 p-0.5 rounded-xl border border-slate-300 cursor-pointer shrink-0"
                  title="Pick Color"
                />
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Enter Color Name (e.g. Pastel Mint Green)"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddColor(newColorName, newColorHex)}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shrink-0"
              >
                + Add Custom Color
              </button>
            </div>

            {/* Active Color Variations Chips */}
            {colorVariations.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Active Colors Displayed to Shoppers:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {colorVariations.map((color) => (
                    <div
                      key={color.id}
                      className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-950 shadow-2xs"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: color.hexCode || '#64748b' }}
                      />
                      <span>{color.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color.id)}
                        className="w-4 h-4 rounded-full text-slate-400 hover:text-rose-600 flex items-center justify-center transition"
                        title="Remove Color"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Size & Measurement Variations */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-orange-600" />
                Size & Measurement Variations (Shown in Bottom of Product Page)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Specify draping dimensions, standard sizing, or shoe/garment fit available at your stall counter.
              </p>
            </div>

            {/* Quick Presets by Category */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 block">
                1-Click Category Size Presets:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {(category === 'Handlooms'
                  ? [
                      'Standard Saree (5.5m + 0.8m Blouse)',
                      'Extended Length (6.3m + 0.9m Blouse)',
                      'Free Size (5.5 Meters)',
                      'Running Blouse (6.2m)'
                    ]
                  : category === 'Leather Goods & Footwear'
                  ? ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']
                  : category === 'Ready-Made Garments'
                  ? ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)']
                  : ['Standard Size', 'Small (Compact)', 'Medium', 'Large (Family Pack)']
                ).map((szPreset, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => handleAddSize(szPreset)}
                    className="px-2.5 py-1 rounded-xl border border-slate-200 hover:border-orange-400 bg-slate-50 hover:bg-orange-50/50 text-xs text-slate-800 font-semibold transition active:scale-95"
                  >
                    + {szPreset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Size Input */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={newSizeName}
                onChange={(e) => setNewSizeName(e.target.value)}
                placeholder="Enter Size (e.g. Free Size / 5.5m + 0.8m Blouse Piece)"
                className="w-full sm:flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddSize(newSizeName)}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shrink-0"
              >
                + Add Custom Size
              </button>
            </div>

            {/* Active Size Variations Chips */}
            {sizeVariations.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Active Sizes Displayed to Shoppers:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {sizeVariations.map((sz) => (
                    <div
                      key={sz.id}
                      className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs"
                    >
                      <span>{sz.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(sz.id)}
                        className="w-4 h-4 rounded-full text-slate-400 hover:text-rose-600 flex items-center justify-center transition"
                        title="Remove Size"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Product Identity & Description */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-600" />
              General Information
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Product Title / Item Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pochampally Double Ikat Silk Saree (Midnight Blue)"
                className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Exhibition Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value as StallCategory;
                    setCategory(newCat);
                    const catData = CATEGORIES_DATA.find((c) => c.id === newCat);
                    if (catData && catData.subtypes.length > 0) {
                      setSubCategory(catData.subtypes[0]);
                    }
                  }}
                  className="w-full text-xs p-3 rounded-2xl border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  {CATEGORIES_DATA.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Sub-Category / Craft Variety
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  {currentCategoryObj?.subtypes.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Item Description (Features, Craft Story, Wash Care)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe why visitors should purchase this item at your exhibition stall..."
                className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              />
            </div>

            {/* Geographical Indication (GI) Certification Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasGiTag}
                  onChange={(e) => setHasGiTag(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-extrabold text-emerald-900 block flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Government GI Tag / Handloom Mark Certified
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Displays official Government authenticity badge on product page & stall listing.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Dynamic Category Specifications */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-600" />
              Dynamic Specifications ({category})
            </h3>

            {category === 'Handlooms' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Fabric Composition</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Weave Technique</label>
                  <input
                    type="text"
                    value={weave}
                    onChange={(e) => setWeave(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Care Advice</label>
                  <input
                    type="text"
                    value={care}
                    onChange={(e) => setCare(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            )}

            {category === 'Dry Fruits & Food Items' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dietary Type</label>
                  <input
                    type="text"
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">FSSAI License #</label>
                  <input
                    type="text"
                    value={fssai}
                    onChange={(e) => setFssai(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Net Weight / Pack Size</label>
                  <input
                    type="text"
                    value={netWeight}
                    onChange={(e) => setNetWeight(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            )}

            {category === 'Leather Goods & Footwear' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Material Source</label>
                  <input
                    type="text"
                    value={leatherMaterial}
                    onChange={(e) => setLeatherMaterial(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Available Sizes</label>
                  <input
                    type="text"
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            )}

            {category !== 'Handlooms' && category !== 'Dry Fruits & Food Items' && category !== 'Leather Goods & Footwear' && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                Specifications for <strong className="text-slate-900">{subCategory}</strong> will automatically be verified and formatted by the Exhibition Society verification team.
              </div>
            )}
          </div>

          {/* Section 4: Pricing, Discount & Stock Inventory */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-600" />
              Pricing, Discounts & Live Stock
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Exhibition Sale Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm pl-7 pr-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Regular MRP (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    required
                    min={price}
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm pl-7 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Available Stock Count *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={stockCount}
                  onChange={(e) => setStockCount(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>
            </div>

            {/* Calculated Discount Pill */}
            <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-orange-800 uppercase font-black tracking-wider block">
                  Exhibition Bargain Tag
                </span>
                <span className="text-xs font-extrabold text-orange-950">
                  Customer Saves ₹{Math.max(0, mrp - price)} ({discount}% OFF)
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-orange-600 text-white font-black text-xs">
                {discount}% SPECIAL
              </span>
            </div>
          </div>
        </form>
      </main>

      {/* Sticky Bottom Action Bar for Mobile & Desktop */}
      <footer className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs sm:text-sm font-bold py-2.5 px-7 rounded-2xl shadow-xl transition active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEditing ? 'Save Product Changes' : 'Publish Product to Stall'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
