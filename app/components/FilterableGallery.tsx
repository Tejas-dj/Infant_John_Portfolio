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

function CategoryTile({
  name,
  cover,
  active,
  onClick,
}: {
  name: string;
  cover: Photo;
  active: boolean;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={name}
      aria-pressed={active}
      style={{ backgroundColor: cover.tint }}
      className={`group relative aspect-[4/5] w-36 sm:w-44 lg:w-auto shrink-0 snap-start overflow-hidden border-2 cursor-pointer transition-colors duration-300 ${
        active ? "border-gold" : "border-transparent hover:border-gold/45"
      }`}
    >
      <CldImage
        src={cover.src}
        alt={`${name} cover photo`}
        fill
        sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 14vw"
        format="auto"
        quality="auto"
        crop="fill"
        gravity="auto"
        className={`object-cover will-change-transform transition-[opacity,transform] duration-700 ease-out group-hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
      <span className="absolute bottom-0 inset-x-0 p-3 md:p-4 text-left">
        <span
          aria-hidden="true"
          className={`block h-0.5 w-8 mb-2 bg-gold origin-left will-change-transform transition-transform duration-300 ${
            active ? "scale-x-100" : "scale-x-0"
          }`}
        />
        <span className="block font-heading text-sm xl:text-base text-canvas tracking-[0.08em] leading-snug">
          {name}
        </span>
      </span>
    </button>
  );
}

export default function FilterableGallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sel, setSel] = useState<number | null>(null);

  const PRIORITY_ORDER = [
    "Wedding",
    "Pub and Nightlife",
    "Potraits",
    "Family Events",
    "Auto Mobile",
  ];
  const allCats = Array.from(new Set(photos.map((p) => p.category)));
  const displayCategories = [
    ...PRIORITY_ORDER.filter((c) => allCats.includes(c)),
    ...allCats.filter((c) => !PRIORITY_ORDER.includes(c)),
  ];

  // No "All" view — the first category is shown until the visitor picks another
  const active =
    selected !== null && displayCategories.includes(selected) ? selected : displayCategories[0];
  const visible = photos.filter((item) => item.category === active);

  // Each tile is fronted by a photo from its own category — a portrait one where possible, to suit the tall tile
  const tiles = displayCategories.flatMap((name) => {
    const inCategory = photos.filter((p) => p.category === name);
    const cover = inCategory.find((p) => p.orientation === "portrait") ?? inCategory[0];
    return cover ? [{ name, cover }] : [];
  });

  return (
    <section className="py-20 w-full overflow-hidden">
      <div className="mb-10 px-6 md:px-10">
        <h2 className="font-heading text-2xl text-charcoal font-bold mb-6">Browse by Category</h2>

        {/* Swipeable row on small screens, one even row on desktop */}
        <div className="flex gap-3 overflow-x-auto snap-x scrollbar-none -mx-6 px-6 md:-mx-10 md:px-10 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-7 lg:overflow-visible">
          {tiles.map(({ name, cover }) => (
            <CategoryTile
              key={name}
              name={name}
              cover={cover}
              active={active === name}
              onClick={() => setSelected(name)}
            />
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
