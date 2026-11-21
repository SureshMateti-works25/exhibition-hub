import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GROUND_MAP_ZONES } from '../data/mockData';
import { GroundMapZone, Stall } from '../types';
import {
  ArrowLeft,
  MapPin,
  Compass,
  Search,
  Navigation,
  Info,
  Layers,
  ArrowRight,
  Store,
  ChevronRight
} from 'lucide-react';

export const GroundsMapPage: React.FC = () => {
  const {
    goBack,
    navigateTo,
    selectedZone,
    setSelectedZone,
    setSelectedCategory,
    setCustomerBrowseView,
    eventProducts,
    eventStalls,
    activeEvent
  } = useApp();

  const [searchedStall, setSearchedStall] = useState<string>('');
  const [highlightedZoneId, setHighlightedZoneId] = useState<string | null>(null);

  const handleZoneClick = (zone: GroundMapZone) => {
    setSelectedZone(zone);
    setHighlightedZoneId(zone.id);
  };

  const handleFilterByCategory = (zone: GroundMapZone) => {
    setSelectedCategory(zone.category);
    setCustomerBrowseView('stalls');
    navigateTo({ name: 'stalls' });
  };

  const handleOpenStallByCode = (stallCode: string) => {
    const matched = eventStalls.find(s => s.stallNumber.toLowerCase() === stallCode.toLowerCase());
    if (matched) {
      navigateTo({ name: 'stall', stallId: matched.id });
    }
  };

  // Check if searched stall belongs to any zone
  const matchingZone = searchedStall.trim()
    ? GROUND_MAP_ZONES.find(z =>
        z.stalls.some(s => s.toLowerCase().includes(searchedStall.toLowerCase())) ||
        z.sectorName.toLowerCase().includes(searchedStall.toLowerCase())
      )
    : null;

  const current = matchingZone || selectedZone || GROUND_MAP_ZONES[0];
  const zoneProducts = eventProducts.filter(p => current && p.category === current.category);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col animate-fadeIn">
      {/* 1. Enterprise Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 px-3 rounded-xl transition shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium truncate">
            <span className="font-bold text-slate-900">{activeEvent?.name ? activeEvent.name.split('-')[0].trim() : 'Numaish'} Grounds Map</span>
            <span className="hidden sm:inline text-slate-400">• {activeEvent?.venueName || 'Exhibition Grounds'}, {activeEvent?.city || 'Hyderabad'}</span>
          </div>
        </div>

        {/* Quick Stalls Action */}
        <button
          type="button"
          onClick={() => navigateTo({ name: 'stalls' })}
          className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xs transition"
        >
          <Store className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Stalls</span>
        </button>
      </nav>

      {/* 2. Search & Gate Legend Bar */}
      <div className="p-3 sm:px-6 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Quick Stall Code Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            placeholder="Search stall code (e.g. H-14, FD-02, J-08, Kondapalli)..."
            value={searchedStall}
            onChange={(e) => setSearchedStall(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Gate Badges */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-semibold">
          <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 shadow-xs">
            🚪 Gate 1: Gandhi Bhavan
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-orange-50 text-orange-900 border border-orange-200 shadow-xs">
            🚪 Gate 2: Ajanta Gate (Main)
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs">
            🚪 Gate 3: Goshamahal
          </span>
        </div>
      </div>

      {/* 3. Main Map & Sector Details Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SVG Map Canvas Area */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-orange-600 animate-spin-slow" />
                Interactive Pavilion Layout
              </span>
              <span className="text-[11px] text-slate-500">Tap any sector to view stalls</span>
            </div>

            {/* Grounds SVG Map */}
            <div className="relative aspect-[4/3] w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
              <svg viewBox="0 0 500 450" className="w-full h-full select-none">
                {/* Background Grounds Grass/Paved Tone */}
                <rect width="500" height="450" fill="#0f172a" />
                
                {/* Decorative Central Walkways */}
                <path d="M 0 240 L 500 240" stroke="#334155" strokeWidth="22" strokeDasharray="6 6" />
                <path d="M 250 0 L 250 450" stroke="#334155" strokeWidth="22" strokeDasharray="6 6" />
                
                {/* Boundary Roads & Trees */}
                <rect x="15" y="15" width="470" height="420" fill="none" stroke="#1e293b" strokeWidth="6" rx="20" />

                {/* Gate 1: Gandhi Bhavan (Top/North) */}
                <g transform="translate(180, 5)">
                  <rect width="140" height="22" fill="#d97706" rx="4" />
                  <text x="70" y="15" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    🚪 GATE 1: GANDHI BHAVAN
                  </text>
                </g>

                {/* Gate 2: Ajanta Gate (Right/East - Main Gateway) */}
                <g transform="translate(470, 160)">
                  <rect width="25" height="130" fill="#ea580c" rx="4" />
                  <text x="13" y="65" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" transform="rotate(90, 13, 65)">
                    🚪 GATE 2: AJANTA (MAIN)
                  </text>
                </g>

                {/* Gate 3: Goshamahal Gate (Bottom/South) */}
                <g transform="translate(180, 423)">
                  <rect width="140" height="22" fill="#059669" rx="4" />
                  <text x="70" y="15" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    🚪 GATE 3: GOSHAMAHAL
                  </text>
                </g>

                {/* Pavilion Zones */}
                {GROUND_MAP_ZONES.map((zone) => {
                  const isSelected = current?.id === zone.id;
                  const isMatch = matchingZone?.id === zone.id;
                  
                  return (
                    <g
                      key={zone.id}
                      onClick={() => handleZoneClick(zone)}
                      className="cursor-pointer transition duration-300"
                    >
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.width}
                        height={zone.height}
                        fill={zone.color}
                        fillOpacity={isSelected || isMatch ? '0.85' : '0.45'}
                        stroke={isSelected || isMatch ? '#ffffff' : zone.color}
                        strokeWidth={isSelected || isMatch ? '3' : '1.5'}
                        rx="12"
                        className="hover:fill-opacity-80 transition"
                      />
                      
                      {/* Sector Code */}
                      <text
                        x={zone.x + zone.width / 2}
                        y={zone.y + zone.height / 2 - 8}
                        fill="#ffffff"
                        fontSize="15"
                        fontWeight="black"
                        textAnchor="middle"
                        className="pointer-events-none drop-shadow-md"
                      >
                        Sector {zone.code}
                      </text>
                      
                      {/* Category Label */}
                      <text
                        x={zone.x + zone.width / 2}
                        y={zone.y + zone.height / 2 + 10}
                        fill="#f8fafc"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none drop-shadow-sm opacity-90"
                      >
                        {zone.category.split('&')[0]}
                      </text>

                      {/* Stall Count Tag */}
                      <rect
                        x={zone.x + zone.width / 2 - 28}
                        y={zone.y + zone.height / 2 + 18}
                        width="56"
                        height="14"
                        fill="#000000"
                        fillOpacity="0.6"
                        rx="7"
                      />
                      <text
                        x={zone.x + zone.width / 2}
                        y={zone.y + zone.height / 2 + 28}
                        fill="#fbbf24"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {zone.stalls.length} Stalls
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="text-[11px] text-slate-500 text-center mt-3">
              Tip: Tap any pavilion sector above to see all allotted booths, walking routes, and live items.
            </p>
          </div>

          {/* Sector Details Panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            {current ? (
              <div className="space-y-4">
                {/* Sector Header */}
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg text-white" style={{ backgroundColor: current.color }}>
                      Sector {current.code}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {current.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 leading-snug">
                    {current.sectorName}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>{current.gateProximity}</span>
                  </p>
                </div>

                {/* Stalls in this Sector */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Allotted Stall Booths:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {current.stalls.map((stallCode, i) => {
                      const hasStallData = eventStalls.some(
                        (s: Stall) => s.stallNumber.toLowerCase() === stallCode.toLowerCase()
                      );
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleOpenStallByCode(stallCode)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                            searchedStall.toUpperCase() === stallCode
                              ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                              : hasStallData
                              ? 'bg-orange-50 text-orange-950 border-orange-200 hover:bg-orange-600 hover:text-white cursor-pointer shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                          title={hasStallData ? 'Click to visit stall showroom page' : undefined}
                        >
                          Stall {stallCode} {hasStallData && '⚡'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Featured Products in this zone */}
                {zoneProducts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Available in this Zone:
                    </h3>
                    <div className="space-y-2">
                      {zoneProducts.slice(0, 3).map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => navigateTo({ name: 'product', productId: prod.id })}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-100 hover:border-orange-200 cursor-pointer transition"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {prod.title}
                            </p>
                            <p className="text-[11px] text-orange-700 font-bold">
                              Stall {prod.stallNumber} • ₹{prod.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Browse All in Sector */}
                <button
                  type="button"
                  onClick={() => handleFilterByCategory(current)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition"
                >
                  <span>Browse All {current.category} Stalls</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Compass className="w-10 h-10 text-slate-300 mb-2" />
                <h4 className="text-sm font-bold text-slate-700">Select a Ground Sector</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Tap any colored pavilion on the map to see stalls, walking directions from gates, and live products.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
