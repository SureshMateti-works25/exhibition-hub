import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_DATA } from '../../data/mockData';
import { StallCategory } from '../../types';
import {
  Sparkles,
  Gem,
  UtensilsCrossed,
  Palette,
  Footprints,
  Shirt,
  Home,
  Coffee,
  Zap,
  Ticket,
  LayoutGrid
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Gem: <Gem className="w-4 h-4" />,
  UtensilsCrossed: <UtensilsCrossed className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Footprints: <Footprints className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Ticket: <Ticket className="w-4 h-4" />
};

export const CategoryPills: React.FC = () => {
  const { selectedCategory, setSelectedCategory, t } = useApp();

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {t('exploreCategories')}
          </h2>
          <p className="text-xs text-slate-500">
            Official Numaish Pavilion Sections
          </p>
        </div>
        {selectedCategory !== 'All' && (
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
        {/* All Button */}
        <button
          onClick={() => setSelectedCategory('All')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'All'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>All 10 Categories</span>
        </button>

        {/* 10 Official Categories */}
        {CATEGORIES_DATA.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? 'All' : cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md scale-102'
                  : 'bg-white text-slate-700 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-200'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-orange-600'}>
                {iconMap[cat.icon] || <Sparkles className="w-3.5 h-3.5" />}
              </span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
