"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Video {
  id: number;
  title: string;
  client: string;
  category: string;
  embedUrl: string;
  /** Optional Cloudinary autoplay URL for the featured section */
  cloudinaryUrl?: string;
  isFeatured?: boolean;
  orientation: "landscape" | "portrait";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const VIDEOS: Video[] = [
  { id: 1,  title: "SUZARAIN FURNITURE",           client: "Suzarain Furniture",   category: "Furniture",             orientation: "landscape", isFeatured: true,  embedUrl: "https://www.youtube.com/embed/UBzFSXZmYrA" },
  { id: 2,  title: "THE DREAM Ft. Maheen",         client: "@thatboujeefactor",    category: "Fashion & Influencer",  orientation: "landscape", isFeatured: true,  embedUrl: "https://www.youtube.com/embed/tpOrtLjocUY" },
  { id: 3,  title: "AZŌRTE Store Launch",          client: "@_shashankdeshpande",  category: "Fashion & Influencer",  orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/4Ds-xRxNv5s" },
  { id: 4,  title: "Courtyard Marriott Christmas", client: "Courtyard Marriott",   category: "Events",                orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/zm10wlEa7yI" },
  { id: 5,  title: "LAKMÉ Salon Visit",            client: "@poorni_gowdaaa",      category: "Salon & Lifestyle",     orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/9RBwFyYTjOA" },
  { id: 6,  title: "MAX Fashion Store",            client: "@somethingname",       category: "Fashion & Influencer",  orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/zhqlZS3jnBY" },
  { id: 7,  title: "Play Salon Visit",             client: "@playsaloon",          category: "Salon & Lifestyle",     orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/1ctfzoaHXjw" },
  { id: 8,  title: "Style Union PR",               client: "@SUSHMITAREDDY",       category: "Fashion & Influencer",  orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/Gxi2T5rQk5E" },
  { id: 9,  title: "Puppawccino",                  client: "@puppawccino",         category: "Salon & Lifestyle",     orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/av-kbls4wrs" },
  { id: 10, title: "Rasa Jewellery",               client: "@rasajewellery",       category: "Jewellery",             orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/WBqvnOaVjo8" },
  { id: 11, title: "Shein India",                  client: "@snehithaa_kushwaha",  category: "Fashion & Influencer",  orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/YikChcIoGl8" },
  { id: 12, title: "Taayani Jewellers",            client: "@taayaanijewellery",   category: "Jewellery",             orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/MVLElgyX4GQ" },
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
}: {
  video: Video;
  index: number;
  onOpen: (v: Video) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const thumb = ytThumb(video.embedUrl, true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden cursor-pointer group"
      style={{ aspectRatio: "16/10" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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

      {/* Play ring — fades in on hover */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <div className="w-16 h-16 rounded-full border border-gold/60 bg-canvas/10 backdrop-blur-md flex items-center justify-center text-gold shadow-lg">
          <PlayIcon size={16} />
        </div>
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

// ─── Marquee Row ──────────────────────────────────────────────────────────────

function MarqueeRow({
  video,
  index,
  isActive,
  onHover,
  onLeave,
  onOpen,
}: {
  video: Video;
  index: number;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onOpen: () => void;
}) {
  const thumb = ytThumb(video.embedUrl, false);
  const isPortrait = video.orientation === "portrait";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative border-b border-warm-gray/25 cursor-pointer select-none"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={`Play ${video.title}`}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
    >
      {/* Hover background fill — sweeps from left */}
      <div
        className="absolute inset-0 bg-charcoal/[0.035] origin-left transition-transform duration-500 ease-out"
        style={{ transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
      />

      <div className="relative flex items-center gap-4 md:gap-6 py-5 md:py-6 px-2 md:px-4">

        {/* Sequence number */}
        <div className="flex-none w-8 md:w-12 text-right">
          <span
            className="font-heading text-xs md:text-sm font-bold transition-colors duration-300"
            style={{ color: isActive ? "var(--color-gold)" : "rgba(44,44,44,0.2)" }}
          >
            {zeroPad(index + 1)}
          </span>
        </div>

        {/* Title and Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
          <h3
            className="font-heading font-bold leading-none tracking-tight transition-colors duration-300 truncate"
            style={{
              fontSize: "clamp(1.25rem, 3.5vw, 2.2rem)",
              color: isActive ? "var(--color-charcoal)" : "rgba(44,44,44,0.55)",
            }}
          >
            {video.title}
          </h3>
          
          <div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-3">
             <span className="font-body text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-charcoal/60 bg-warm-gray/30 px-2 py-0.5 border border-warm-gray/20">
               {video.category}
             </span>
             <span 
                className="font-body text-[9px] md:text-[10px] tracking-widest transition-colors duration-300"
                style={{ color: isActive ? "rgba(44,44,44,0.7)" : "rgba(44,44,44,0.4)" }}
             >
               {video.client}
             </span>
          </div>
        </div>

        {/* Small Thumbnail Indicator */}
        <div className="flex-none flex items-center justify-end pl-2">
          <div 
             className="relative overflow-hidden border border-warm-gray/40 shadow-sm transition-transform duration-500 ease-out"
             style={{ 
               width: isPortrait ? "48px" : "86px", 
               aspectRatio: isPortrait ? "9/16" : "16/9",
               transform: isActive ? "scale(1.08)" : "scale(1)"
             }}
          >
             {/* Thumbnail Image */}
             <div
               className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
               style={{ 
                 backgroundImage: `url(${thumb})`,
                 transform: isActive ? "scale(1.1)" : "scale(1)" 
               }}
             />
             
             {/* Dark overlay that lightens slightly on hover */}
             <div 
                className="absolute inset-0 transition-colors duration-300" 
                style={{ backgroundColor: isActive ? "rgba(44,44,44,0.15)" : "rgba(44,44,44,0.4)" }} 
             />
             
             {/* Small Play Button */}
             <div className="absolute inset-0 flex items-center justify-center text-canvas drop-shadow-md">
               <div 
                  className="flex items-center justify-center rounded-full bg-charcoal/40 backdrop-blur-sm border border-canvas/30 transition-colors duration-300"
                  style={{ 
                     width: "24px", 
                     height: "24px",
                     borderColor: isActive ? "var(--color-gold)" : "rgba(248, 245, 240, 0.3)",
                     color: isActive ? "var(--color-gold)" : "var(--color-canvas)"
                  }}
               >
                 <PlayIcon size={10} />
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Gold underline sweep */}
      <div
        className="absolute bottom-0 left-0 h-[1.5px] bg-gold transition-all duration-500 ease-out"
        style={{ width: isActive ? "100%" : "0%" }}
      />
    </motion.div>
  );
}

// ─── Floating thumbnail preview ───────────────────────────────────────────────

function FloatingPreview({
  video,
  containerRef,
}: {
  video: Video | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { damping: 22, stiffness: 260, mass: 0.5 });
  const y = useSpring(rawY, { damping: 22, stiffness: 260, mass: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY, containerRef]);

  const isPortrait = video?.orientation === "portrait";
  const thumb = video ? ytThumb(video.embedUrl, false) : "";

  return (
    <AnimatePresence mode="wait">
      {video && (
        <motion.div
          key={video.id}
          className="absolute top-0 left-0 z-20 pointer-events-none overflow-hidden shadow-2xl shadow-charcoal/20"
          style={{
            x,
            y,
            translateX: "-50%",
            translateY: "-55%",
            width: isPortrait ? 130 : 220,
            aspectRatio: isPortrait ? "9/16" : "16/9",
          }}
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.88 }}
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Thumbnail */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${thumb})` }}
          />
          <div className="absolute inset-0 bg-charcoal/15" />

          {/* Gold border */}
          <div className="absolute inset-0 border border-gold/30" />

          {/* Tiny play icon */}
          <div className="absolute inset-0 flex items-center justify-center text-canvas/70">
            <PlayIcon size={20} />
          </div>

          {/* Orientation label */}
          <div className="absolute bottom-2 right-2">
            <span className="font-body text-[7px] tracking-[0.2em] uppercase text-canvas/50">
              {isPortrait ? "Short" : "Film"}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const [hoveredId, setHoveredId]           = useState<number | null>(null);
  const [openVideo, setOpenVideo]           = useState<Video | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback((v: Video) => setOpenVideo(v), []);
  const handleClose = useCallback(() => setOpenVideo(null), []);

  const visibleReels =
    activeCategory === "All"
      ? REELS
      : REELS.filter((v) => v.category === activeCategory);

  const hoveredVideo = hoveredId !== null
    ? REELS.find((v) => v.id === hoveredId) ?? null
    : null;

  return (
    <>
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
            />
          ))}
        </div>

        {/* ── Reels section ── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
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

        {/* ── Marquee list ── */}
        <div
          ref={marqueeRef}
          className="relative border-t border-warm-gray/25"
          // Hide the floating preview on touch / mobile
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Floating thumbnail — desktop only */}
          <div className="hidden lg:block">
            <FloatingPreview video={hoveredVideo} containerRef={marqueeRef} />
          </div>

          <AnimatePresence mode="popLayout">
            {visibleReels.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-body text-sm text-charcoal/35 py-16 text-center tracking-widest"
              >
                No reels in this category yet.
              </motion.p>
            ) : (
              visibleReels.map((video, i) => (
                <MarqueeRow
                  key={video.id}
                  video={video}
                  index={i}
                  isActive={hoveredId === video.id}
                  onHover={() => setHoveredId(video.id)}
                  onLeave={() => setHoveredId(null)}
                  onOpen={() => handleOpen(video)}
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
