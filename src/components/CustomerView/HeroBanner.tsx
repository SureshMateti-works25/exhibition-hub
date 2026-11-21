import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Sparkles, Flame, PlusCircle, Clock, ShieldCheck, ArrowRight, Calendar } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setIsMapOpen, setIsStallApplicationOpen, setSelectedCategory, activeEvent, navigateTo, t } = useApp();

  const ladiesDay = activeEvent?.specialDays?.find((sd) => sd.isLadiesOnly);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-amber-600 to-rose-700 text-white p-5 sm:p-8 shadow-xl shadow-orange-600/10 mb-6">
      {/* Background Decorative Patterns */}
      <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute right-10 bottom-0 text-white/10 font-serif text-[120px] font-black select-none pointer-events-none leading-none hidden sm:block">
        NUMAISH
      </div>

      <div className="relative z-10 max-w-2xl">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-orange-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            LIVE BAZAAR 2027
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-white border border-white/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            {activeEvent?.hostOrgName || 'Exhibition Society'}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2 text-white font-serif">
          {activeEvent?.name || 'All India Industrial Exhibition'}
        </h1>
        <p className="text-sm sm:text-base text-orange-100 font-medium mb-4 max-w-xl">
          {activeEvent?.description || 'Discover 2,500+ heritage stalls, handlooms, pearls, live Haleem, and authentic handicrafts. Browse daily vendor drops, order for zero-wait stall pickup, or get delivered to your doorstep.'}
        </p>

        {/* Special Day Spotlight (e.g. Ladies Only Day) */}
        {ladiesDay && activeEvent && (
          <div
            onClick={() => navigateTo({ name: 'event-detail', eventId: activeEvent.id })}
            className="cursor-pointer bg-white/15 hover:bg-white/25 border border-white/30 rounded-2xl p-2.5 sm:p-3 mb-5 flex items-center justify-between gap-3 transition group backdrop-blur-md shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl shrink-0">🌸</span>
              <div>
                <p className="text-xs font-black text-amber-200 group-hover:text-white flex items-center gap-1.5">
                  <span>Special Event: {ladiesDay.title}</span>
                  <span className="text-[10px] bg-pink-500 text-white px-2 py-0.2 rounded-full font-bold">
                    {ladiesDay.date}
                  </span>
                </p>
                <p className="text-[11px] text-orange-100 line-clamp-1">
                  {ladiesDay.description}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-white text-orange-800 px-2.5 py-1 rounded-lg shrink-0 shadow-xs group-hover:scale-105 transition">
              Schedule & Rules →
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setIsMapOpen(true)}
            className="flex items-center gap-2 bg-white text-orange-700 hover:bg-orange-50 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95"
          >
            <MapPin className="w-4 h-4 text-orange-600" />
            Interactive Stall Map
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (activeEvent) {
                navigateTo({ name: 'event-detail', eventId: activeEvent.id });
              } else {
                navigateTo({ name: 'events' });
              }
            }}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/40 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm backdrop-blur-md transition transform active:scale-95"
          >
            <Calendar className="w-4 h-4 text-amber-200" />
            Exhibition Schedule & Timings
          </button>

          <button
            onClick={() => setIsStallApplicationOpen(true)}
            className="flex items-center gap-2 bg-amber-500/30 hover:bg-amber-500/40 text-white border border-white/40 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm backdrop-blur-md transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-amber-200" />
            Apply for Stall
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-5 border-t border-white/20 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold">10 Categories</p>
              <p className="text-[10px] text-orange-200">GI Tagged & Verified</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-rose-300" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold">Today's Feed</p>
              <p className="text-[10px] text-orange-200">Live 60-Sec Drops</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold">Zero-Wait Pickup</p>
              <p className="text-[10px] text-orange-200">Reserve via App</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
