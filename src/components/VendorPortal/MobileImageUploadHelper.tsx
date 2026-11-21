import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, UploadCloud, CheckCircle2, RefreshCw } from 'lucide-react';

interface MobileImageUploadHelperProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  allowCamera?: boolean;
}

export const MobileImageUploadHelper: React.FC<MobileImageUploadHelperProps> = ({
  images,
  onChange,
  maxImages = 4,
  label = 'Product / Showcase Photos',
  allowCamera = true
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<string | null>(null);

  // Client-side image compression for mobile devices
  const processAndCompressFile = (file: File) => {
    setIsCompressing(true);
    setCompressionStats('Compressing for mobile upload...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for WebP compression
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
          // Export as optimized WebP or JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          const origSizeKb = Math.round(file.size / 1024);
          const compressedSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

          setCompressionStats(`Auto-compressed: ${origSizeKb}KB ➔ ${compressedSizeKb}KB WebP`);
          onChange([...images, compressedDataUrl]);
        }
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    processAndCompressFile(file);
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
    setCompressionStats(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 block">
          {label} ({images.length}/{maxImages})
        </label>
        {compressionStats && (
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {compressionStats}
          </span>
        )}
      </div>

      {/* Hidden native mobile file inputs */}
      {/* 1: Camera capture input */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      {/* 2: Mobile disk gallery input */}
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Mobile-Friendly Action Trigger Buttons */}
      {images.length < maxImages && (
        <div className="grid grid-cols-2 gap-2">
          {/* Camera Button */}
          {allowCamera && (
            <button
              type="button"
              disabled={isCompressing}
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border-2 border-dashed border-orange-300 text-orange-800 font-bold text-xs transition active:scale-95"
            >
              <Camera className="w-4 h-4 text-orange-600" />
              <span>Snap Phone Camera</span>
            </button>
          )}

          {/* Disk Upload Button */}
          <button
            type="button"
            disabled={isCompressing}
            onClick={() => galleryInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 text-slate-700 font-bold text-xs transition active:scale-95"
          >
            <ImageIcon className="w-4 h-4 text-slate-600" />
            <span>Select Mobile Photo</span>
          </button>
        </div>
      )}

      {isCompressing && (
        <div className="p-2.5 bg-orange-50 rounded-xl flex items-center justify-center gap-2 text-xs text-orange-800 font-semibold animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-orange-600" />
          <span>Processing & compressing high-res photo...</span>
        </div>
      )}

      {/* Uploaded Images Thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group"
            >
              <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] font-bold text-white text-center py-0.5">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
