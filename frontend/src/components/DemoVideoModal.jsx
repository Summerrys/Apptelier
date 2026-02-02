import React from "react";
import { X } from "lucide-react";

export const DemoVideoModal = ({ open, onClose, videoUrl }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4">
      <div className="relative w-full max-w-3xl bg-black rounded-xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black text-white rounded-full p-2"
          aria-label="Close demo video"
        >
          <X className="w-5 h-5" />
        </button>

        <video
          src={videoUrl}
          controls
          autoPlay
          playsInline
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};
