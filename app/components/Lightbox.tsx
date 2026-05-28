"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export type LightboxImage = {
  src: string;
  tint: string;
  filename?: string;
};

type LightboxProps = {
  images: LightboxImage[];
  sel: number | null;
  setSel: (sel: number | null) => void;
};

export default function Lightbox({ images, sel, setSel }: LightboxProps) {
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  if (!images || images.length === 0) return null;

  const count = images.length;
  const prev = () => setSel(sel !== null ? (sel - 1 + count) % count : null);
  const next = () => setSel(sel !== null ? (sel + 1) % count : null);

  const currentImage = sel !== null ? images[sel] : null;

  return (
    <AnimatePresence>
      {sel !== null && currentImage && (
        <motion.div
          key="lb-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/90 backdrop-blur-xl"
          onClick={() => setSel(null)}
        >
          {/* Close */}
          <button
            data-nodrag
            onClick={e => { e.stopPropagation(); setSel(null); }}
            className="absolute top-5 right-5 md:top-7 md:right-7 z-10 w-10 h-10 rounded-full border border-gold/50 text-gold text-2xl leading-none flex items-center justify-center hover:bg-gold/12 transition-colors font-light"
            aria-label="Close"
          >
            ×
          </button>

          {/* Prev */}
          <button
            data-nodrag
            onClick={e => { e.stopPropagation(); prev(); }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-warm-gray/25 text-canvas/55 text-3xl leading-none flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
            aria-label="Previous"
          >
            ‹
          </button>

          {/* Photo panel */}
          <motion.div
            key={sel}
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.86 }}
            transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -90) next();
              else if (info.offset.x > 90) prev();
            }}
            onClick={e => e.stopPropagation()}
            className="relative rounded-sm overflow-hidden"
            style={{
              width: "min(88vw, 600px)",
              height: "min(88vw, 600px)",
              cursor: "grab",
              backgroundColor: currentImage.tint,
            }}
          >
            {/* Smooth Blur-up Image Loading */}
            <Image
              src={currentImage.src}
              alt={currentImage.filename || "Photography"}
              fill
              sizes="(max-width: 768px) 88vw, 600px"
              className={`object-cover transition-opacity duration-700 ease-in-out ${
                loaded[sel] ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setLoaded(prev => ({ ...prev, [sel]: true }))}
              priority
            />

            {!loaded[sel] && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                 <p className="font-body text-xs tracking-[0.22em] uppercase text-charcoal/35">Loading</p>
                 <div className="w-4 h-4 rounded-full border-2 border-charcoal/20 border-t-charcoal/50 animate-spin" />
              </div>
            )}
          </motion.div>

          {/* Next */}
          <button
            data-nodrag
            onClick={e => { e.stopPropagation(); next(); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-warm-gray/25 text-canvas/55 text-3xl leading-none flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
            aria-label="Next"
          >
            ›
          </button>

          {/* Counter */}
          <p className="absolute bottom-6 inset-x-0 text-center font-body text-xs text-canvas/30 tracking-widest">
            {sel + 1} / {count}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
