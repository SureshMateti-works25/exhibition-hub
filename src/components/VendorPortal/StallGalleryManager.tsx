import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StallGalleryAlbum } from '../../types';
import { MobileImageUploadHelper } from './MobileImageUploadHelper';
import confetti from 'canvas-confetti';
import {
  Image as ImageIcon,
  Camera,
  Plus,
  Trash2,
  Heart,
  Tag,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShoppingBag,
  X,
  UploadCloud,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const StallGalleryManager: React.FC = () => {
  const {
    stalls,
    selectedVendorStallId,
    stallGallery,
    addGalleryItem,
    removeGalleryItem,
    products
  } = useApp();

  const activeStall =
    stalls.find((s) => s.id === selectedVendorStallId) || stalls[0];

  const myStallGallery = stallGallery.filter(
    (g) =>
      g.stallId === activeStall?.id ||
      g.stallId === activeStall?.stallNumber ||
      (!activeStall && stallGallery.length > 0)
  );

  const [isUploadCardOpen, setIsUploadCardOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('All');

  // Form states
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [album, setAlbum] = useState<StallGalleryAlbum>('Daily Booth Setup');
  const [taggedProductId, setTaggedProductId] = useState<string>('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
  ]);

  const albumsList: Array<'All' | StallGalleryAlbum> = [
    'All',
    'Daily Booth Setup',
    'Fresh Today',
    'Artisan Demos',
    'Crowd & Highlights',
    'Night Lights'
  ];

  const filteredGallery = selectedAlbum === 'All'
    ? myStallGallery
    : myStallGallery.filter((item) => item.album === selectedAlbum);

  const handleUploadShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || images.length === 0) return;

    addGalleryItem({
      stallId: activeStall?.id || 'stall-1',
      title,
      album,
      imageUrl: images[0],
      caption,
      dateTag: 'Today • 6:30 PM',
      taggedProductId: taggedProductId || undefined
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setIsUploadCardOpen(false);
    setTitle('');
    setCaption('');
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Daily Stall Album & Presentation Gallery
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your physical booth's morning look, live loom demos, crowd photos, and fresh drops every single day of Numaish.
          </p>
        </div>

        <button
          onClick={() => setIsUploadCardOpen(!isUploadCardOpen)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition self-start sm:self-auto active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span>{isUploadCardOpen ? 'Hide Upload Card' : "Upload Today's Showcase"}</span>
          {isUploadCardOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>
      </div>

      {/* INLINE EXPANDABLE UPLOAD CARD (Zero Popups) */}
      {isUploadCardOpen && (
        <div className="bg-white rounded-3xl p-5 border-2 border-orange-300 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Add Daily Showcase Photo to Stall Gallery
                </h4>
                <p className="text-[10px] text-orange-700">
                  Stall H-14 • Pochampally Exhibition Showcase
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadCardOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleUploadShowcase} className="space-y-3.5 text-xs">
            <MobileImageUploadHelper
              images={images}
              onChange={setImages}
              maxImages={1}
              label="Snap Booth / Product Photo (Camera or Mobile Disk)"
            />

            <div>
              <label className="font-bold text-slate-800 block mb-1">Moment / Showcase Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Weaver Pit-Loom Demonstration"
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Showcase Album *</label>
                <select
                  value={album}
                  onChange={(e) => setAlbum(e.target.value as StallGalleryAlbum)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 text-xs"
                >
                  <option value="Daily Booth Setup">Daily Booth Setup</option>
                  <option value="Fresh Today">Fresh Today</option>
                  <option value="Artisan Demos">Artisan Demos</option>
                  <option value="Crowd & Highlights">Crowd & Highlights</option>
                  <option value="Night Lights">Night Lights</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Tag Catalog Product (Optional)</label>
                <select
                  value={taggedProductId}
                  onChange={(e) => setTaggedProductId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs"
                >
                  <option value="">-- No Tagged Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title.substring(0, 32)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Caption / Story for Visitors</label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Tell visitors what is happening at the booth right now..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs resize-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsUploadCardOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Showcase to Stall Gallery</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Album Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {albumsList.map((alb) => (
          <button
            key={alb}
            onClick={() => setSelectedAlbum(alb)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedAlbum === alb
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {alb}
          </button>
        ))}
      </div>

      {/* Gallery Photos Masonry Grid */}
      {filteredGallery.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredGallery.map((item) => {
            const linkedProd = products.find((p) => p.id === item.taggedProductId);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-orange-400" />
                      <span>{item.dateTag}</span>
                    </div>

                    <span className="absolute bottom-2.5 right-2.5 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                      {item.album}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>

                    {linkedProd && (
                      <div className="mt-2 p-2 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-orange-950 font-bold truncate">
                          <ShoppingBag className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          <span className="truncate">{linkedProd.title}</span>
                        </div>
                        <span className="font-extrabold text-orange-600 shrink-0">₹{linkedProd.price}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3.5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-rose-600">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    {item.likes} loves
                  </span>

                  <button
                    onClick={() => removeGalleryItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove from Stall Gallery"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-xl">
            📸
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            No Daily Photos in Album: "{selectedAlbum}"
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Snap photos of your stall's morning setup, live artisan demos, customer smiles, or night lights to show online shoppers what is happening at Stall {activeStall?.stallNumber} right now.
          </p>
          <button
            type="button"
            onClick={() => setIsUploadCardOpen(true)}
            className="inline-flex items-center gap-1.5 bg-orange-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:bg-orange-700 transition"
          >
            <Camera className="w-4 h-4" />
            <span>Upload Today's First Photo</span>
          </button>
        </div>
      )}
    </div>
  );
};
