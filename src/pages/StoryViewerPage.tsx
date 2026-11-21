import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  X,
  Heart,
  ShoppingBag,
  Store,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react';

interface StoryViewerPageProps {
  storyId: string;
}

export const StoryViewerPage: React.FC<StoryViewerPageProps> = ({ storyId }) => {
  const { stories, likeStory, navigateTo, goBack, stalls } = useApp();

  const currentIndex = stories.findIndex((s) => s.id === storyId);
  const [index, setIndex] = useState(currentIndex >= 0 ? currentIndex : 0);

  const currentStory = stories[index] || stories[0];

  useEffect(() => {
    if (currentIndex >= 0) {
      setIndex(currentIndex);
    }
  }, [storyId, currentIndex]);

  if (!currentStory) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold">Story Not Available</p>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (index < stories.length - 1) {
      setIndex(index + 1);
    } else {
      goBack();
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const matchingStall = stalls.find(
    (s) => s.id === currentStory.stallId || s.stallNumber === currentStory.stallNumber
  );

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden select-none animate-fadeIn">
      {/* Top Segmented Progress Bar */}
      <div className="absolute top-3 inset-x-3 z-30 flex gap-1.5 pt-safe">
        {stories.map((s, i) => (
          <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className={`h-full bg-white rounded-full transition-all duration-300 ${
                i < index ? 'w-full' : i === index ? 'w-full animate-pulse' : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="absolute top-7 inset-x-3 z-30 flex items-center justify-between text-white drop-shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={goBack}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div
            onClick={() => {
              if (matchingStall) {
                navigateTo({ name: 'stall', stallId: matchingStall.id });
              }
            }}
            className="flex items-center gap-2 cursor-pointer bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
          >
            <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-xs font-bold border border-white">
              🎪
            </div>
            <div>
              <h2 className="text-xs font-bold text-white leading-tight">
                {currentStory.stallName}
              </h2>
              <p className="text-[10px] text-amber-200 flex items-center gap-1 font-medium">
                <MapPin className="w-2.5 h-2.5" />
                {currentStory.stallNumber} • {currentStory.timeAgo}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition"
          aria-label="Close Story"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Full-Height Story Photo */}
      <div className="relative flex-1 w-full flex items-center justify-center bg-slate-950">
        <img
          src={currentStory.mediaUrl}
          alt={currentStory.stallName}
          className="w-full h-full object-cover max-h-screen"
        />
        {/* Subtle Top & Bottom Gradients for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

        {/* Left & Right Touch Areas for Navigation */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={index === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition disabled:opacity-0 hover:bg-black/70"
          aria-label="Previous Story"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition hover:bg-black/70"
          aria-label="Next Story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Story Caption & Actions */}
      <div className="relative z-30 p-4 sm:p-5 bg-gradient-to-t from-black via-black/90 to-transparent pb-safe space-y-3">
        {currentStory.discountTag && (
          <div className="inline-block px-3 py-1 rounded-lg bg-rose-600 text-white font-black text-xs tracking-wider uppercase shadow-lg">
            ⚡ {currentStory.discountTag}
          </div>
        )}

        <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed drop-shadow">
          {currentStory.caption}
        </p>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => likeStory(currentStory.id)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-bold text-rose-300 transition"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>{currentStory.likes}</span>
          </button>

          {currentStory.featuredProductId ? (
            <button
              type="button"
              onClick={() => {
                navigateTo({ name: 'product', productId: currentStory.featuredProductId! });
              }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs py-2.5 px-4 rounded-2xl shadow-xl transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Featured Bargain</span>
            </button>
          ) : matchingStall ? (
            <button
              type="button"
              onClick={() => {
                navigateTo({ name: 'stall', stallId: matchingStall.id });
              }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs py-2.5 px-4 rounded-2xl shadow-xl transition active:scale-95"
            >
              <Store className="w-4 h-4" />
              <span>Visit Stall Page</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
