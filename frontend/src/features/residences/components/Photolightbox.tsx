import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import type { ResidencePhoto } from "../types/residence.types";

interface PhotoLightboxProps {
  photos: ResidencePhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  residenceName: string;
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  residenceName,
}: PhotoLightboxProps) {
  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  // Lock body scroll and keyboard navigation
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
    <div className="fixed inset-0 z-[3000] flex flex-col bg-black/95 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in">
      {/* ===== HEADER ===== */}
      <div className="relative flex items-center justify-between px-4 py-4 sm:px-8 sm:py-5">
        <span className="text-xs font-medium text-white/60 sm:text-sm">
          {currentIndex + 1} / {photos.length}
        </span>

        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-105 active:scale-95"
          aria-label="Close gallery"
        >
          <X size={18} className="stroke-[2.5]" />
        </button>
      </div>

      {/* ===== MAIN IMAGE AREA ===== */}
      <div className="relative flex flex-1 items-center justify-center px-2 sm:px-8 md:px-16">
        {/* Left navigation */}
        {photos.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 hover:scale-110 active:scale-95 sm:left-4 md:left-8"
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} className="stroke-[2.5]" />
          </button>
        )}

        {/* Image */}
        <img
          key={current.id}
          src={current.photo_url}
          alt={`${residenceName} — photo ${currentIndex + 1}`}
          className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-2xl animate-in zoom-in-95 duration-200"
        />

        {/* Right navigation */}
        {photos.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 hover:scale-110 active:scale-95 sm:right-4 md:right-8"
            aria-label="Next photo"
          >
            <ChevronRight size={22} className="stroke-[2.5]" />
          </button>
        )}

        {/* Image counter overlay (bottom) – optional, but we already have it in header */}
      </div>

      {/* ===== THUMBNAIL STRIP ===== */}
      {photos.length > 1 && (
        <div className="relative flex justify-center px-4 pb-4 pt-2 sm:px-8 sm:pb-6">
          <div className="flex max-w-full gap-3 overflow-x-auto scroll-smooth no-scrollbar">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => onNavigate(index)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl transition-all duration-200 ${
                  index === currentIndex
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black/80 scale-105"
                    : "opacity-40 hover:opacity-80 hover:scale-105"
                }`}
              >
                <img
                  src={photo.photo_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}