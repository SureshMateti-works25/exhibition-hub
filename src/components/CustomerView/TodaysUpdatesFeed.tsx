import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Plus, Sparkles } from 'lucide-react';

export const TodaysUpdatesFeed: React.FC = () => {
  const {
    eventStories,
    navigateTo,
    t
  } = useApp();

  return (
    <section className="mb-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <Flame className="w-3.5 h-3.5 animate-bounce-soft" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              {t('todayFeedTitle')}
              <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                Live
              </span>
            </h2>
          </div>
        </div>

        <button
          onClick={() => navigateTo({ name: 'vendor-quick-drop' })}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Vendor Drop</span>
        </button>
      </div>

      {/* Horizontal Scroll Story Circles */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
        {/* Post Drop Button for Vendors */}
        <button
          onClick={() => navigateTo({ name: 'vendor-quick-drop' })}
          className="flex flex-col items-center gap-1 shrink-0 group"
          aria-label="Post Live Update"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 border-dashed border-orange-400 bg-orange-50 flex flex-col items-center justify-center text-orange-600 group-hover:bg-orange-100 group-hover:scale-105 transition">
            <Plus className="w-5 h-5 text-orange-600" />
            <span className="text-[9px] font-bold mt-0.5">Post Drop</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-700 text-center max-w-[70px] truncate">
            Your Stall
          </span>
        </button>

        {/* Stories List */}
        {eventStories.map((story) => (
          <button
            key={story.id}
            onClick={() => navigateTo({ name: 'story', storyId: story.id })}
            className="flex flex-col items-center gap-1 shrink-0 group text-left cursor-pointer focus:outline-none"
            aria-label={`View update from ${story.stallName}`}
          >
            <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-orange-500 via-rose-500 to-amber-400 group-hover:scale-105 transition-transform shadow-sm">
              <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-[14px] overflow-hidden bg-white relative">
                <img
                  src={story.mediaUrl}
                  alt={story.stallName}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  loading="lazy"
                />
                {story.discountTag && (
                  <span className="absolute bottom-0 inset-x-0 bg-rose-600/90 backdrop-blur-xs text-white text-[8px] font-black py-0.5 text-center uppercase tracking-tight">
                    {story.discountTag}
                  </span>
                )}
              </div>
              {/* Live badge */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-600 border-2 border-white" />
            </div>
            <span className="text-[11px] font-medium text-slate-800 text-center max-w-[72px] truncate">
              {story.stallName.split(' ')[0]}
            </span>
          </button>
        ))}

        {eventStories.length === 0 && (
          <div className="flex items-center gap-2 pl-2 text-xs text-slate-400 italic">
            <span>No live drops posted yet. Vendors can post 60-second updates anytime.</span>
          </div>
        )}
      </div>
    </section>
  );
};
