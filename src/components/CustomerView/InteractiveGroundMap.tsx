import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GROUND_MAP_ZONES } from '../../data/mockData';
import { GroundMapZone } from '../../types';
import {
  X,
  MapPin,
  Compass,
  Search,
  Navigation,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

export const InteractiveGroundMap: React.FC = () => {
  const {
    isMapOpen,
    setIsMapOpen,
    selectedZone,
    setSelectedZone,
    setSelectedCategory,
    setCustomerBrowseView,
    products,
    stalls,
    setActiveStallModal,
    setActiveProductModal
  } = useApp();

  const [searchedStall, setSearchedStall] = useState<string>('');
  const [highlightedZoneId, setHighlightedZoneId] = useState<string | null>(null);

  if (!isMapOpen) return null;

  const handleZoneClick = (zone: GroundMapZone) => {
    setSelectedZone(zone);
    setHighlightedZoneId(zone.id);
  };

  const handleFilterByCategory = (zone: GroundMapZone) => {
    setSelectedCategory(zone.category);
    setCustomerBrowseView('stalls');
    setIsMapOpen(false);
  };

  const handleOpenStallByCode = (stallCode: string) => {
    const matched = stalls.find(s => s.stallNumber.toLowerCase() === stallCode.toLowerCase());
    if (matched) {
      setIsMapOpen(false);
      setActiveStallModal(matched);
    }
  };

  // Check if searched stall belongs to any zone
  const matchingZone = searchedStall.trim()
    ? GROUND_MAP_ZONES.find(z =>
        z.stalls.some(s => s.toLowerCase().includes(searchedStall.toLowerCase())) ||
        z.sectorName.toLowerCase().includes(searchedStall.toLowerCase())
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div
        className="bg-white w-full max-w-4xl max-h-[94dvh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Map Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Numaish 2027 Exhibition Grounds Map
              </h3>
              <p className="text-[10px] text-orange-200">
                Nampally Exhibition Grounds, Hyderabad • 3 Main Gates
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMapOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Close Map"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Gate Legend Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Quick Stall Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search stall code (e.g. H-14, FD-02, J-08)..."
              value={searchedStall}
              onChange={(e) => setSearchedStall(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Gate Indicators */}
          <div className="flex items-center gap-1.5 text-[10px] font-semibold">
            <span className="px-2 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300">
              🚪 Gate 1: Gandhi Bhavan
            </span>
            <span className="px-2 py-1 rounded bg-orange-100 text-orange-900 border border-orange-300">
              🚪 Gate 2: Ajanta Gate (Main)
            </span>
            <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-900 border border-indigo-300">
              🚪 Gate 3: Goshamahal
            </span>
          </div>
        </div>

        {/* Map Canvas & Details Split View */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* SVG Map (2 cols on desktop) */}
          <div className="md:col-span-2 p-4 bg-slate-950 flex flex-col items-center justify-center relative min-h-[340px]">
            {/* SVG Interactive Ground Layout */}
            <svg
              viewBox="0 0 500 460"
              className="w-full h-auto max-h-[440px] drop-shadow-xl select-none"
            >
              {/* Grounds Boundary */}
              <rect
                x="15"
                y="15"
                width="470"
                height="430"
                rx="24"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Entrance Gate Markers */}
              {/* Gate 2: Ajanta Gate (Top) */}
              <rect x="200" y="8" width="100" height="16" rx="4" fill="#ea580c" />
              <text x="250" y="20" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                GATE 2 • AJANTA GATE (MAIN)
              </text>

              {/* Gate 1: Gandhi Bhavan Gate (Left) */}
              <rect x="4" y="210" width="16" height="80" rx="4" fill="#d97706" />
              <text
                x="12"
                y="250"
                fill="#ffffff"
                fontSize="8"
                fontWeight="bold"
                textAnchor="middle"
                transform="rotate(-90, 12, 250)"
              >
                GATE 1 (GANDHI BHAVAN)
              </text>

              {/* Gate 3: Goshamahal Gate (Bottom) */}
              <rect x="180" y="438" width="120" height="16" rx="4" fill="#4f46e5" />
              <text x="240" y="450" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                GATE 3 • GOSHAMAHAL GATE
              </text>

              {/* Walkways / Pathways */}
              <path
                d="M 250 30 L 250 430 M 30 250 L 470 250"
                stroke="#1e293b"
                strokeWidth="16"
                strokeDasharray="4 4"
              />

              {/* Sector Rectangles */}
              {GROUND_MAP_ZONES.map((zone) => {
                const isSelected = selectedZone?.id === zone.id || matchingZone?.id === zone.id;
                return (
                  <g
                    key={zone.id}
                    onClick={() => handleZoneClick(zone)}
                    className="cursor-pointer group"
                  >
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.width}
                      height={zone.height}
                      rx="12"
                      fill={zone.color}
                      fillOpacity={isSelected ? 0.95 : 0.65}
                      stroke={isSelected ? '#ffffff' : zone.color}
                      strokeWidth={isSelected ? '3' : '1'}
                      className="transition-all duration-300 hover:fill-opacity-95"
                    />
                    {/* Zone Code Tag */}
                    <rect
                      x={zone.x + 8}
                      y={zone.y + 8}
                      width="34"
                      height="20"
                      rx="6"
                      fill="#ffffff"
                    />
                    <text
                      x={zone.x + 25}
                      y={zone.y + 22}
                      fill="#0f172a"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {zone.code}
                    </text>

                    {/* Zone Title */}
                    <text
                      x={zone.x + 48}
                      y={zone.y + 22}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {zone.code === 'FD' ? 'Food Plaza' : zone.category.split(' ')[0]}
                    </text>

                    {/* Stalls in zone */}
                    <text
                      x={zone.x + 12}
                      y={zone.y + 45}
                      fill="#f8fafc"
                      fontSize="8"
                      opacity="0.9"
                    >
                      Stalls: {zone.stalls.join(', ')}
                    </text>

                    {/* Active Pulsing Indicator if selected */}
                    {isSelected && (
                      <circle
                        cx={zone.x + zone.width / 2}
                        cy={zone.y + zone.height / 2}
                        r="14"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}

              {/* Central Fountain / Gandhi Statue Landmark */}
              <circle cx="250" cy="250" r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <text x="250" y="253" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
                FOUNTAIN
              </text>
            </svg>

            <div className="absolute bottom-3 left-4 text-[10px] text-slate-400">
              💡 Tap any pavilion sector above to view vendor stalls and directions.
            </div>
          </div>

          {/* Right Column: Zone & Stall Inspector */}
          <div className="p-4 bg-white flex flex-col justify-between">
            {selectedZone || matchingZone ? (
              <div className="space-y-4">
                {(() => {
                  const current = matchingZone || selectedZone!;
                  const zoneProducts = products.filter(p => p.category === current.category);

                  return (
                    <>
                      <div>
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-1">
                          <Navigation className="w-3 h-3" />
                          <span>Selected Ground Zone</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {current.sectorName}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          {current.gateProximity}
                        </p>
                      </div>

                      {/* Stalls list in this zone */}
                      <div>
                        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                          Allotted Stall Booths:
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {current.stalls.map((stallCode, i) => {
                            const hasStallData = stalls.some(
                              s => s.stallNumber.toLowerCase() === stallCode.toLowerCase()
                            );
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleOpenStallByCode(stallCode)}
                                className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                                  searchedStall.toUpperCase() === stallCode
                                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                                    : hasStallData
                                    ? 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-600 hover:text-white cursor-pointer'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                                title={hasStallData ? 'Click to visit stall showroom' : undefined}
                              >
                                Stall {stallCode} {hasStallData && '⚡'}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Featured Products from this pavilion */}
                      {zoneProducts.length > 0 && (
                        <div>
                          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                            Available in this Zone:
                          </h5>
                          <div className="space-y-2">
                            {zoneProducts.slice(0, 2).map(prod => (
                              <div
                                key={prod.id}
                                onClick={() => {
                                  setIsMapOpen(false);
                                  setActiveProductModal(prod);
                                }}
                                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-100 hover:border-orange-200 cursor-pointer transition"
                              >
                                <img
                                  src={prod.images[0]}
                                  alt={prod.title}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-900 truncate">
                                    {prod.title}
                                  </p>
                                  <p className="text-[10px] text-orange-700 font-semibold">
                                    Stall {prod.stallNumber} • ₹{prod.price}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Browse this category button */}
                      <button
                        onClick={() => handleFilterByCategory(current)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition"
                      >
                        <span>Browse All {current.category} Stalls</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  );
                })()}
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

            {/* Emergency & Exhibition Society Help Line */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Grounds Help Desk: Mukarram Jah Gate</span>
              <span className="font-bold text-slate-700">Dial 100 / 108</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
