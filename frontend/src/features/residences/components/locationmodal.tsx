import { useEffect, useState } from "react";
import { X } from "lucide-react";

import LocationPicker, { type PickedLocation } from "./LocationPicker";

interface LocationModalProps {
  isOpen: boolean;
  initialLocation?: { latitude: number; longitude: number };
  onClose: () => void;
  onConfirm: (location: PickedLocation) => void;
}

export default function LocationModal({
  isOpen,
  initialLocation,
  onClose,
  onConfirm,
}: LocationModalProps) {
  const [pendingLocation, setPendingLocation] = useState<PickedLocation | null>(
    null
  );

  // Lock body scroll while the modal is open, and let Escape close it.
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!pendingLocation) return;
    onConfirm(pendingLocation);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[640px] sm:max-w-2xl sm:rounded-3xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Choose residence location
            </h2>
            <p className="text-sm text-slate-500">
              Search, drag the map, or use your current location.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* MAP */}
        <div className="relative flex-1">
          <LocationPicker
            initialLocation={initialLocation}
            onChange={setPendingLocation}
          />
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!pendingLocation}
            className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}