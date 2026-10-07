"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CldImage, getCldImageUrl, type CldImageProps } from "next-cloudinary";
import { useState } from "react";

export type LightboxImage = {
  src: string;
  tint: string;
  filename?: string;
  width?: number;
  height?: number;
  orientation?: string;
};

type LightboxProps = {
  images: LightboxImage[];
  sel: number | null;
  setSel: (sel: number | null) => void;
};

function getPanelSize(img: LightboxImage): { w: number; h: number } {
  let ratio: number;
  if (img.width && img.height) {
    ratio = img.width / img.height;
  } else if (img.orientation === "portrait") {
    ratio = 2 / 3;
  } else if (img.orientation === "landscape") {
    ratio = 4 / 3;
  } else {
    ratio = 1;
  }
  const MAX_W = Math.min(window.innerWidth * 0.88, 1100);
  const MAX_H = window.innerHeight * 0.85;
  let w = MAX_W;
  let h = w / ratio;
  if (h > MAX_H) { h = MAX_H; w = h * ratio; }
  return { w, h };
}

// Tiny ~50px Cloudinary thumbnail — loads in <100ms, gives instant visual context
function getThumbUrl(src: string) {
  return getCldImageUrl({ src, width: 60, quality: 10, format: "auto" });
}

// Every prop that influences the requested Cloudinary URL (srcset candidates + transformation).
// The visible photo and the hidden neighbour preloads both spread this, so the browser picks
// the exact same srcset candidate for both and the preload is a guaranteed cache hit.
const FULL_IMAGE_PROPS = {
  fill: true,
  sizes: "(max-width: 768px) 88vw, 1100px",
  format: "auto",
  quality: "auto",
} satisfies Partial<CldImageProps>;

export default function Lightbox({ images, sel, setSel }: LightboxProps) {
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  if (!images || images.length === 0) return null;

  const count = images.length;
  const prev = () => setSel(sel !== null ? (sel - 1 + count) % count : null);
  const next = () => setSel(sel !== null ? (sel + 1) % count : null);

  const currentImage = sel !== null ? images[sel] : null;

  // Neighbours to preload. Set dedupes the 2-photo case (prev === next); the filter drops
  // the selected photo itself (1-photo case), so no duplicates and no self-preload.
  const preloadIdx =
    sel !== null
      ? Array.from(new Set([(sel + 1) % count, (sel - 1 + count) % count])).filter((i) => i !== sel)
      : [];
  const panelSize = currentImage ? getPanelSize(currentImage) : { w: 600, h: 600 };

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
            onClick={(e) => { e.stopPropagation(); setSel(null); }}
            className="absolute top-5 right-5 md:top-7 md:right-7 z-10 w-10 h-10 rounded-full border border-gold/50 text-gold text-2xl leading-none flex items-center justify-center hover:bg-gold/12 transition-colors font-light"
            aria-label="Close"
          >
            ×
          </button>

          {/* Prev */}
          <button
            data-nodrag
            onClick={(e) => { e.stopPropagation(); prev(); }}
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
            onClick={(e) => e.stopPropagation()}
            className="relative rounded-sm overflow-hidden"
            style={{
              width: panelSize.w,
              height: panelSize.h,
              cursor: "grab",
              backgroundColor: currentImage.tint,
            }}
          >
            {/* Instant tiny placeholder — visible immediately, gives colour/composition before full image arrives */}
            <img
              src={getThumbUrl(currentImage.src)}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Full-res image fades in over the placeholder */}
            <CldImage
              src={currentImage.src}
              alt={currentImage.filename || "Photography"}
              {...FULL_IMAGE_PROPS}
              className={`absolute inset-0 object-contain transition-opacity duration-500 ease-in-out ${
                loaded[sel] ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setLoaded((prev) => ({ ...prev, [sel]: true }))}
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>

          {/* Next */}
          <button
            data-nodrag
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-warm-gray/25 text-canvas/55 text-3xl leading-none flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
            aria-label="Next"
          >
            ›
          </button>

          {/* Hidden neighbour preloads — same CldImage props as the visible photo, so the browser
              requests the identical srcset URL. 1px (not display:none) so the fetch is reliable. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
          >
            {preloadIdx.map((idx) => (
              <CldImage
                key={idx}
                src={images[idx].src}
                alt=""
                {...FULL_IMAGE_PROPS}
                loading="eager"
                fetchPriority="low"
              />
            ))}
          </div>

          {/* Counter */}
          <p className="absolute bottom-6 inset-x-0 text-center font-body text-xs text-canvas/30 tracking-widest">
            {sel + 1} / {count}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
