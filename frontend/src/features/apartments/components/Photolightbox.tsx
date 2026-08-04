import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxPhoto {
  id: string;
  photo_url: string;
}

interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title: string;
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  title,
}: PhotoLightboxProps) {
  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  // Lock body scroll and set up keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, goPrev, goNext]);

  if (!isOpen || photos.length === 0) return null;

  const current = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-[3000] flex flex-col bg-white text-slate-900 select-none animate-in fade-in duration-200">
      {/* AIRBNB HEADER BAR */}
      <div className="relative flex items-center justify-between px-6 py-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full text-slate-700 transition hover:bg-slate-100 active:scale-95"
          aria-label="Close photo viewer"
        >
          <X size={20} className="stroke-[2.5]" />
        </button>

        {/* Counter & Title */}
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span>
            {currentIndex + 1} / {photos.length}
          </span>
          {title && (
            <>
              <span className="text-slate-300">•</span>
              <span className="max-w-[200px] sm:max-w-md truncate text-slate-500 font-normal">
                {title}
              </span>
            </>
          )}
        </div>

        {/* Placeholder spacer for symmetrical header alignment */}
        <div className="w-10" />
      </div>

      {/* MAIN VIEWPORT & NAVIGATION BUTTONS */}
      <div className="relative flex flex-1 items-center justify-center px-4 sm:px-20 py-2 overflow-hidden">
        {/* Previous Button */}
        {photos.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-800 shadow-lg shadow-slate-200/60 transition hover:scale-105 hover:bg-slate-50 active:scale-95 sm:left-8"
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} className="stroke-[2.5]" />
          </button>
        )}

        {/* Display Image */}
        <div className="flex h-full w-full items-center justify-center">
          <img
            key={current.id}
            src={current.photo_url}
            alt={`${title} — photo ${currentIndex + 1}`}
            className="max-h-full max-w-full rounded-2xl object-contain transition-all duration-300 shadow-xl shadow-slate-200/50"
          />
        </div>

        {/* Next Button */}
        {photos.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-800 shadow-lg shadow-slate-200/60 transition hover:scale-105 hover:bg-slate-50 active:scale-95 sm:right-8"
            aria-label="Next photo"
          >
            <ChevronRight size={22} className="stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* AIRBNB THUMBNAIL BOTTOM BAR */}
      {photos.length > 1 && (
        <div className="flex justify-center border-t border-slate-100 py-4 px-6">
          <div className="flex gap-2.5 overflow-x-auto max-w-4xl py-1 no-scrollbar">
            {photos.map((photo, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={photo.id}
                  onClick={() => onNavigate(index)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "ring-2 ring-slate-900 ring-offset-2 scale-105 opacity-100"
                      : "opacity-60 hover:opacity-100 hover:scale-102"
                  }`}
                >
                  <img
                    src={photo.photo_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}