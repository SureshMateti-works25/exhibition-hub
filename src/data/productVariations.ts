import { StallCategory, ColorVariation, SizeVariation } from '../types';

export const getDefaultCategoryColors = (category?: StallCategory): ColorVariation[] => {
  switch (category) {
    case 'Handlooms':
      return [
        { id: 'c-hl-1', name: 'Royal Peacock Blue', hexCode: '#1e3a8a', inStock: true },
        { id: 'c-hl-2', name: 'Rani Magenta Pink', hexCode: '#be185d', inStock: true },
        { id: 'c-hl-3', name: 'Temple Emerald Green', hexCode: '#047857', inStock: true },
        { id: 'c-hl-4', name: 'Mustard Haldi Gold', hexCode: '#b45309', inStock: true },
        { id: 'c-hl-5', name: 'Shahi Crimson Maroon', hexCode: '#991b1b', inStock: true }
      ];
    case 'Leather Goods & Footwear':
      return [
        { id: 'c-lg-1', name: 'Heritage Tan Brown', hexCode: '#92400e', inStock: true },
        { id: 'c-lg-2', name: 'Midnight Charcoal Black', hexCode: '#18181b', inStock: true },
        { id: 'c-lg-3', name: 'Oxblood Deep Maroon', hexCode: '#831843', inStock: true },
        { id: 'c-lg-4', name: 'Raw Saddle Suede', hexCode: '#d97706', inStock: true }
      ];
    case 'Ready-Made Garments':
      return [
        { id: 'c-rm-1', name: 'Navy Blue', hexCode: '#1e3a8a', inStock: true },
        { id: 'c-rm-2', name: 'Crimson Red', hexCode: '#b91c1c', inStock: true },
        { id: 'c-rm-3', name: 'Olive Green', hexCode: '#4d7c0f', inStock: true },
        { id: 'c-rm-4', name: 'Pastel Ivory', hexCode: '#fef3c7', inStock: true }
      ];
    case 'Jewelry & Accessories':
      return [
        { id: 'c-jw-1', name: 'Antique Temple Gold', hexCode: '#d97706', inStock: true },
        { id: 'c-jw-2', name: 'Oxidized Silver Finish', hexCode: '#64748b', inStock: true },
        { id: 'c-jw-3', name: 'Ruby Red & Pearl', hexCode: '#991b1b', inStock: true },
        { id: 'c-jw-4', name: 'Emerald Green Inlay', hexCode: '#047857', inStock: true }
      ];
    case 'Home Furnishings':
      return [
        { id: 'c-hf-1', name: 'Sunset Amber & Rust', hexCode: '#c2410c', inStock: true },
        { id: 'c-hf-2', name: 'Ocean Turquoise Teal', hexCode: '#0f766e', inStock: true },
        { id: 'c-hf-3', name: 'Earthy Linen Beige', hexCode: '#d4d4d8', inStock: true }
      ];
    default:
      return [
        { id: 'c-gen-1', name: 'Artisan Original Shade', hexCode: '#ea580c', inStock: true },
        { id: 'c-gen-2', name: 'Royal Peacock Blue', hexCode: '#1e3a8a', inStock: true },
        { id: 'c-gen-3', name: 'Crimson Maroon', hexCode: '#991b1b', inStock: true },
        { id: 'c-gen-4', name: 'Temple Emerald Green', hexCode: '#047857', inStock: true }
      ];
  }
};

export const getDefaultCategorySizes = (category?: StallCategory): SizeVariation[] => {
  switch (category) {
    case 'Handlooms':
      return [
        { id: 's-hl-1', name: 'Standard Saree (5.5m + 0.8m Blouse Piece)', inStock: true },
        { id: 's-hl-2', name: 'Free Size (5.5 Meters)', inStock: true },
        { id: 's-hl-3', name: 'Extended Length (6.3m + 0.9m Blouse Piece)', inStock: true }
      ];
    case 'Leather Goods & Footwear':
      return [
        { id: 's-lg-1', name: 'UK / IND 7', inStock: true },
        { id: 's-lg-2', name: 'UK / IND 8', inStock: true },
        { id: 's-lg-3', name: 'UK / IND 9', inStock: true },
        { id: 's-lg-4', name: 'UK / IND 10', inStock: true },
        { id: 's-lg-5', name: 'UK / IND 11', inStock: true }
      ];
    case 'Ready-Made Garments':
      return [
        { id: 's-rm-1', name: 'S (36)', inStock: true },
        { id: 's-rm-2', name: 'M (38)', inStock: true },
        { id: 's-rm-3', name: 'L (40)', inStock: true },
        { id: 's-rm-4', name: 'XL (42)', inStock: true },
        { id: 's-rm-5', name: 'XXL (44)', inStock: true }
      ];
    case 'Dry Fruits & Food Items':
      return [
        { id: 's-df-1', name: '250g Trial Pack', inStock: true },
        { id: 's-df-2', name: '500g Standard Pouch', inStock: true },
        { id: 's-df-3', name: '1 Kg Family Value Pack', inStock: true }
      ];
    default:
      return [
        { id: 's-gen-1', name: 'Standard Artisan Size', inStock: true },
        { id: 's-gen-2', name: 'Free Size / Universal Fit', inStock: true }
      ];
  }
};
