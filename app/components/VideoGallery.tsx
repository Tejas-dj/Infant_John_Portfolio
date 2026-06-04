"use client";

import {
  useState,
  useEffect,
  useCallback,
} from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Video {
  id: number;
  title: string;
  client: string;
  category: string;
  description: string;
  embedUrl: string;
  /** Optional Cloudinary autoplay URL for the featured section */
  cloudinaryUrl?: string;
  isFeatured?: boolean;
  orientation: "landscape" | "portrait";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const VIDEOS: Video[] = [
  { id: 1,  title: "SUZARAIN FURNITURE",           client: "Suzarain Furniture",   category: "Furniture",             description: "A cinematic showcase of premium furniture pieces highlighting craftsmanship and elegant design.", orientation: "landscape", isFeatured: true,  embedUrl: "https://www.youtube.com/embed/UBzFSXZmYrA" },
  { id: 2,  title: "THE DREAM Ft. Maheen",         client: "@thatboujeefactor",    category: "Fashion & Influencer",  description: "A stylish fashion editorial capturing the essence of modern influencer aesthetics.", orientation: "landscape", isFeatured: true,  embedUrl: "https://www.youtube.com/embed/tpOrtLjocUY" },
  { id: 3,  title: "AZŌRTE Store Launch",          client: "@_shashankdeshpande",  category: "Fashion & Influencer",  description: "High-energy event coverage capturing the vibrant atmosphere of the AZŌRTE store grand opening.", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/4Ds-xRxNv5s" },
  { id: 4,  title: "Courtyard Marriott Christmas", client: "Courtyard Marriott",   category: "Events",                description: "A festive and heartwarming look into the holiday celebrations at the Courtyard Marriott.", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/zm10wlEa7yI" },
  { id: 6,  title: "MAX Fashion Store",            client: "@somethingname",       category: "Fashion & Influencer",  description: "Highlighting the latest apparel collections and engaging in-store experiences at MAX Fashion.", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/zhqlZS3jnBY" },
  { id: 7,  title: "Play Salon Visit",             client: "@playsaloon",          category: "Salon & Lifestyle",     description: "Capturing top-tier grooming and styling services in a modern, luxurious salon environment.", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/1ctfzoaHXjw" },
  { id: 8,  title: "Style Union PR",               client: "@SUSHMITAREDDY",       category: "Fashion & Influencer",  description: "An exclusive PR package unboxing and fashion showcase featuring local influencers.", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/Gxi2T5rQk5E" },
  { id: 9,  title: "Puppawccino",                  client: "@puppawccino",         category: "Salon & Lifestyle",     description: "A playful, heartwarming look into premium pet grooming services and happy customers.", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/av-kbls4wrs" },
  { id: 10, title: "Rasa Jewellery",               client: "@rasajewellery",       category: "Jewellery",             description: "Highlighting the intricate details and stunning craftsmanship of the Rasa Jewellery collection.", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/WBqvnOaVjo8" },
  { id: 11, title: "Shein India",                  client: "@snehithaa_kushwaha",  category: "Fashion & Influencer",  description: "Trendy fashion transitions and outfit inspirations featuring the latest Shein styles.", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/YikChcIoGl8" },
  { id: 12, title: "Taayani Jewellers",            client: "@taayaanijewellery",   category: "Jewellery",             description: "Elegant and timeless jewelry pieces captured in a breathtaking visual showcase.", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/MVLElgyX4GQ" },
];

const CATEGORIES = ["All", "Fashion & Influencer", "Events", "Salon & Lifestyle", "Jewellery", "Furniture"];

const FEATURED = VIDEOS.filter((v) => v.isFeatured);
const REELS    = VIDEOS.filter((v) => !v.isFeatured);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ytThumb(embedUrl: string, hd = false): string {
  const id = embedUrl.split("/embed/")[1]?.split("?")[0] ?? "";
  return id ? `https://img.youtube.com/vi/${id}/${hd ? "maxresdefault" : "hqdefault"}.jpg` : "";
}

function zeroPad(n: number): string {
  return String(n).padStart(2, "0");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlayIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <polygon points="3,1 15,8 3,15" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <line x1="1" y1="1" x2="11" y2="11" />
      <line x1="11" y1="1" x2="1" y2="11" />
    </svg>
  );
}

// ─── Featured Film Card ───────────────────────────────────────────────────────

function FeaturedCard({
  video,
  index,
  onOpen,
  onCursorEnter,
  onCursorLeave,
}: {
  video: Video;
  index: number;
  onOpen: (v: Video) => void;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const thumb = ytThumb(video.embedUrl, true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden cursor-none group"
      style={{ aspectRatio: "16/10" }}
      onMouseEnter={() => { setHovered(true); onCursorEnter(); }}
      onMouseLeave={() => { setHovered(false); onCursorLeave(); }}
      onClick={() => onOpen(video)}
      role="button"
      tabIndex={0}
      aria-label={`Play ${video.title}`}
      onKeyDown={(e) => e.key === "Enter" && onOpen(video)}
    >
      {/* Thumbnail */}
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform transition-transform duration-700 ease-out"
        style={{
          backgroundImage: `url(${thumb})`,
          transform: hovered ? "scale(1.06)" : "scale(1)",
        }}
      />

      {/* Permanent cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/30 to-transparent" />

      {/* Hover tint */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: hovered ? "rgba(44,44,44,0.18)" : "transparent" }}
      />

      {/* Film number — top right */}
      <div className="absolute top-5 right-5 z-10">
        <span
          className="font-heading text-[10px] tracking-[0.3em] uppercase text-canvas/40"
          aria-hidden
        >
          {zeroPad(index + 1)}
        </span>
      </div>

      {/* Category badge — top left */}
      <div className="absolute top-5 left-5 z-10">
        <span className="font-body text-[9px] tracking-[0.22em] uppercase text-canvas/60 bg-black/30 backdrop-blur-md px-2.5 py-1 border border-white/10">
          {video.category}
        </span>
      </div>

      {/* Title block */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <p className="font-body text-[9px] tracking-[0.28em] uppercase text-gold mb-2">
          Featured Work
        </p>
        <h3 className="font-heading text-xl md:text-2xl text-canvas font-bold leading-tight tracking-wide">
          {video.title}
        </h3>
        <p
          className="font-body text-[10px] text-canvas/40 mt-1.5 tracking-widest transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(4px)" }}
        >
          {video.client}
        </p>
      </div>

      {/* Gold corner accent */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gold transition-all duration-500 ease-out"
        style={{ width: hovered ? "100%" : "0%" }}
      />
    </motion.div>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

function GridCard({
  video,
  index,
  onOpen,
  onCursorEnter,
  onCursorLeave,
}: {
  video: Video;
  index: number;
  onOpen: () => void;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
}) {
  const thumb = ytThumb(video.embedUrl, false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col cursor-none"
      onMouseEnter={() => { setHovered(true); onCursorEnter(); }}
      onMouseLeave={() => { setHovered(false); onCursorLeave(); }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={`Play ${video.title}`}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
    >
      {/* Thumbnail container */}
      <div 
        className="relative w-full overflow-hidden mb-5 shadow-sm group-hover:shadow-lg transition-shadow duration-500"
        style={{ aspectRatio: "9/16" }}
      >
         <div
           className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
           style={{ 
             backgroundImage: `url(${thumb})`,
             transform: hovered ? "scale(1.05)" : "scale(1)" 
           }}
         />
         <div 
           className="absolute inset-0 transition-colors duration-300" 
           style={{ backgroundColor: hovered ? "rgba(44,44,44,0.15)" : "rgba(44,44,44,0.35)" }} 
         />
         
         {/* Category Badge */}
         <div className="absolute top-4 left-4">
           <span className="font-body text-[8px] tracking-[0.2em] uppercase text-canvas/80 bg-black/40 backdrop-blur-md px-2.5 py-1.5 border border-white/10">
             {video.category}
           </span>
         </div>
      </div>

      {/* Text Details */}
      <div className="flex flex-col px-1">
        <h3 className="font-heading text-lg md:text-xl text-charcoal font-bold leading-tight group-hover:text-gold transition-colors duration-300">
          {video.title}
        </h3>
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-charcoal/40 mt-1.5 mb-2.5">
          {video.client}
        </p>
        <p className="font-body text-sm text-charcoal/60 leading-relaxed">
          {video.description}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Video Modal ──────────────────────────────────────────────────────────────

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-sm flex flex-col p-5 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="flex-none flex justify-between items-start mb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="font-body text-[9px] tracking-[0.32em] uppercase text-gold mb-1">
            {video.category}
          </p>
          <h3 className="font-heading text-xl md:text-3xl text-canvas font-bold leading-tight tracking-wide">
            {video.title}
          </h3>
          <p className="font-body text-xs text-canvas/35 mt-1 tracking-widest">
            {video.client}
          </p>
        </div>

        <button
          onClick={onClose}
          aria-label="Close video"
          className="ml-8 flex-none w-10 h-10 rounded-full border border-canvas/15 flex items-center justify-center text-canvas/40 hover:border-gold hover:text-gold transition-all duration-300"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Player */}
      <div
        className="flex-grow min-h-0 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {video.orientation === "portrait" ? (
          <div className="relative h-full max-h-full aspect-[9/16] overflow-hidden shadow-2xl">
            <iframe
              src={`${video.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video overflow-hidden shadow-2xl">
            <iframe
              src={`${video.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VideoGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openVideo, setOpenVideo]           = useState<Video | null>(null);
  const [cursorActive, setCursorActive]     = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const cursorX = useSpring(rawX, { damping: 25, stiffness: 350, mass: 0.5 });
  const cursorY = useSpring(rawY, { damping: 25, stiffness: 350, mass: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX - 40); // 40px is half of w-20 (80px)
      rawY.set(e.clientY - 40);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  const handleOpen = useCallback((v: Video) => setOpenVideo(v), []);
  const handleClose = useCallback(() => setOpenVideo(null), []);

  const visibleReels =
    activeCategory === "All"
      ? REELS
      : REELS.filter((v) => v.category === activeCategory);

  return (
    <>
      {/* ── Magnetic Play Cursor ── */}
      <motion.div
        className="fixed top-0 left-0 z-[60] w-20 h-20 rounded-full bg-gold pointer-events-none flex items-center justify-center shadow-lg"
        style={{ x: cursorX, y: cursorY }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: cursorActive && !openVideo ? 1 : 0, 
          opacity: cursorActive && !openVideo ? 1 : 0 
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <span className="font-heading text-[10px] tracking-widest uppercase text-charcoal font-bold">
          Play
        </span>
      </motion.div>

      {/* ── Section wrapper ── */}
      <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">

        {/* ── Section label ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-14 md:mb-16"
        >
          <p className="font-body text-[10px] tracking-[0.38em] uppercase text-gold mb-3">
            Selected Work
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal font-bold leading-none">
              The Work
            </h2>
            {/* Thin gold accent line */}
            <div className="hidden md:block h-px flex-1 mx-12 bg-warm-gray/25 self-center" />
            <p className="font-body text-xs text-charcoal/40 tracking-widest max-w-xs leading-relaxed">
              A curated reel of brand films, commercial shorts, and cinematic narratives.
            </p>
          </div>
        </motion.div>

        {/* ── Featured Films ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-20 md:mb-28">
          {FEATURED.map((video, i) => (
            <FeaturedCard
              key={video.id}
              video={video}
              index={i}
              onOpen={handleOpen}
              onCursorEnter={() => setCursorActive(true)}
              onCursorLeave={() => setCursorActive(false)}
            />
          ))}
        </div>

        {/* ── Reels section ── */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-body text-[9px] tracking-[0.38em] uppercase text-charcoal/35 mb-2">
              Short Form
            </p>
            <h2 className="font-heading text-2xl md:text-3xl text-charcoal font-bold leading-none">
              The Reels
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative font-body text-[10px] tracking-[0.12em] uppercase px-4 py-2 transition-colors duration-300 ${
                    isActive ? "text-canvas" : "text-charcoal/40 hover:text-charcoal"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="filterPill"
                      className="absolute inset-0 bg-charcoal"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  {!isActive && (
                    <span className="absolute inset-0 border border-warm-gray/30" />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Grid List ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          <AnimatePresence mode="popLayout">
            {visibleReels.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full font-body text-sm text-charcoal/35 py-16 text-center tracking-widest"
              >
                No reels in this category yet.
              </motion.p>
            ) : (
              visibleReels.map((video, i) => (
                <GridCard
                  key={video.id}
                  video={video}
                  index={i}
                  onOpen={() => handleOpen(video)}
                  onCursorEnter={() => setCursorActive(true)}
                  onCursorLeave={() => setCursorActive(false)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Modal ── */}
      <AnimatePresence>
        {openVideo && (
          <VideoModal video={openVideo} onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  );
}
