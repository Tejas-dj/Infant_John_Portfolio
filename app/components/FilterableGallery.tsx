"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CldImage } from "next-cloudinary";
import Lightbox from "./Lightbox";

import type { Photo } from "../data/photography";

function GalleryItem({ item, onClick }: { item: Photo; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ backgroundColor: item.tint }}
      onClick={onClick}
      className={`break-inside-avoid mb-2 md:mb-4 border border-warm-gray/30 ${
        item.orientation === "landscape"
          ? "aspect-[4/3]"
          : item.orientation === "portrait"
          ? "aspect-[2/3]"
          : "aspect-square"
      } relative overflow-hidden group hover:border-gold/45 hover:shadow-sm transition-colors duration-300 cursor-pointer`}
    >
      <CldImage
        src={item.src}
        alt={item.filename}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
        format="auto"
        quality="auto"
        crop="fill"
        gravity="auto"
        className={`object-cover transition-opacity duration-1000 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300 z-0">
          <span className="font-body text-[10px] text-charcoal/25">{item.filename}</span>
        </div>
      )}
      {/* Hover reveal */}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-charcoal/55 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
        <p className="font-body text-canvas text-[10px] tracking-[0.15em] uppercase">{item.category}</p>
      </div>
    </motion.div>
  );
}

export default function FilterableGallery({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState("All");
  const [sel, setSel] = useState<number | null>(null);

  const visible =
    active === "All" ? photos : photos.filter((item) => item.category === active);

  const displayCategories = ["All", ...Array.from(new Set(photos.map((p) => p.category)))];

  return (
    <section className="py-20 w-full overflow-hidden">
      <div className="mb-10 px-6 md:px-10">
        <h2 className="font-heading text-2xl text-charcoal font-bold mb-6">Browse by Category</h2>

        <div className="flex flex-wrap gap-3">
          {displayCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`font-body text-xs tracking-[0.12em] px-5 py-2.5 border transition-all duration-200 ${
                active === cat
                  ? "border-gold text-gold bg-gold/5"
                  : "border-warm-gray/50 text-charcoal/55 hover:border-gold hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid - Edge to edge */}
      <div className="w-full px-2 md:px-4">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-2 md:gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((item, index) => (
              <GalleryItem
                key={item.id}
                item={item}
                onClick={() => setSel(index)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Lightbox images={visible} sel={sel} setSel={setSel} />
    </section>
  );
}
