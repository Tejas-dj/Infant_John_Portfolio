"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { getCldImageUrl } from "next-cloudinary";
import type { BunnyVideo } from "../lib/bunny";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Video {
  id: number | string;
  title: string;
  client: string;
  /** Empty for a Bunny video that is in no collection — it then shows under "All" only */
  category: string;
  description: string;
  embedUrl: string;
  source: "youtube" | "bunny";
  /** Ready-made thumbnail URL (Bunny videos) */
  thumbUrl?: string;
  /** Optional Cloudinary autoplay URL for the featured section */
  cloudinaryUrl?: string;
  /** Display name of the custom thumbnail in the Cloudinary Thumbnails folder */
  cloudinaryThumb?: string;
  isFeatured?: boolean;
  /** Short films get their own section, apart from the featured films and the reels */
  isShortFilm?: boolean;
  /** Runtime in seconds (Bunny videos) */
  duration?: number;
  orientation: "landscape" | "portrait";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const VIDEOS: Video[] = [
  { id: 2,  title: "THE DREAM Ft. Maheen",         client: "@thatboujeefactor",    category: "Fashion & Influencer",  description: "A stylish fashion editorial capturing the essence of modern influencer aesthetics.", orientation: "landscape", isFeatured: true,  source: "youtube", embedUrl: "https://www.youtube.com/embed/tpOrtLjocUY" },
  { id: 3,  title: "AZŌRTE Store Launch",          client: "@_shashankdeshpande",  category: "Fashion & Influencer",  description: "High-energy event coverage capturing the vibrant atmosphere of the AZŌRTE store grand opening.", orientation: "portrait",  source: "youtube", embedUrl: "https://www.youtube.com/embed/4Ds-xRxNv5s",  cloudinaryThumb: "Azorte" },
  { id: 4,  title: "Courtyard Marriott Christmas", client: "Courtyard Marriott",   category: "Events",                description: "A festive and heartwarming look into the holiday celebrations at the Courtyard Marriott.", orientation: "portrait",  source: "youtube", embedUrl: "https://www.youtube.com/embed/zm10wlEa7yI",  cloudinaryThumb: "Courtyard_Marriott_Christmas" },
  { id: 6,  title: "MAX Fashion Store",            client: "@somethingname",       category: "Fashion & Influencer",  description: "Highlighting the latest apparel collections and engaging in-store experiences at MAX Fashion.", orientation: "portrait",  source: "youtube", embedUrl: "https://www.youtube.com/embed/zhqlZS3jnBY" },
  { id: 7,  title: "Play Salon Visit",             client: "@playsaloon",          category: "Salon & Lifestyle",     description: "Capturing top-tier grooming and styling services in a modern, luxurious salon environment.", orientation: "portrait",  source: "youtube", embedUrl: "https://www.youtube.com/embed/1ctfzoaHXjw",  cloudinaryThumb: "Play_Salon_Visit" },
  { id: 9,  title: "Puppawccino",                  client: "@puppawccino",         category: "Salon & Lifestyle",     description: "A playful, heartwarming look into premium pet grooming services and happy customers.", orientation: "portrait",  source: "youtube", embedUrl: "https://www.youtube.com/embed/av-kbls4wrs",  cloudinaryThumb: "Puppawccino" },
  { id: 11, title: "Shein India",                  client: "@snehithaa_kushwaha",  category: "Fashion & Influencer",  description: "Trendy fashion transitions and outfit inspirations featuring the latest Shein styles.", orientation: "portrait",  source: "youtube", embedUrl: "https://www.youtube.com/embed/YikChcIoGl8" },
  { id: 12, title: "Taayani Jewellers",            client: "@taayaanijewellery",   category: "Jewellery",             description: "Elegant and timeless jewelry pieces captured in a breathtaking visual showcase.", orientation: "portrait",  source: "youtube", embedUrl: "https://www.youtube.com/embed/MVLElgyX4GQ",  cloudinaryThumb: "Taayani_Jewellers" },
];

const CATEGORIES = ["All", "Fashion & Influencer", "Events", "Salon & Lifestyle", "Jewellery"];

// A Bunny video is a short film when it sits in a collection with this name,
// or is one of the films pinned below (uploaded before any collection existed).
const SHORT_FILMS_COLLECTION = "Short Films";
const SHORT_FILM_GUIDS = new Set([
  "7d4f6270-d315-4b3c-b446-0cb921b478b1", // Confession film
  "d078edd5-3414-44f4-aea0-3d71b5ed1fdc", // HOSKOTE BIRIYANI
]);

// Reels pinned to the front of the grid, in this order. Everything else
// follows in its usual order.
const REEL_ORDER = [
  "7e32ba74-9fd0-4883-a3fb-0790a9b7cf42", // BANANA CLUB
  "731e193e-2d3a-4c01-b2cf-1b335a8f6d8e", // MALL OF ASIA X ZOYE
  "45b86c4d-5683-4550-a650-b618e5e1c5b0", // ZOYA X EASY BUY
  "63db5903-c727-4589-b48a-78ed165ea95f", // GODS PLAN
  "5f2dff56-1d2b-48d6-aa95-dd5e34f45176", // SICKO MODE
  "d68694c9-57bb-400f-a041-d1390f75b6ce", // BURNING BRIDGES
];

function reelRank(video: Video): number {
  const i = REEL_ORDER.indexOf(String(video.id));
  return i === -1 ? REEL_ORDER.length : i;
}

// Bunny Stream videos join the hardcoded list: short films get their own
// section, other landscape cuts sit with the featured films, portrait cuts
// with the reels.
function fromBunny(video: BunnyVideo): Video {
  const isShortFilm =
    video.category === SHORT_FILMS_COLLECTION || SHORT_FILM_GUIDS.has(video.guid);
  return {
    id: video.guid,
    title: video.title,
    client: "",
    category: isShortFilm ? "Short Film" : video.category,
    description: video.description,
    embedUrl: video.embedUrl,
    source: "bunny",
    thumbUrl: video.thumbUrl,
    isShortFilm,
    isFeatured: !isShortFilm && video.orientation === "landscape",
    duration: video.duration,
    orientation: video.orientation,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ytThumb(embedUrl: string, hd = false): string {
  const id = embedUrl.split("/embed/")[1]?.split("?")[0] ?? "";
  return id ? `https://img.youtube.com/vi/${id}/${hd ? "maxresdefault" : "hqdefault"}.jpg` : "";
}

function getThumb(video: Video, thumbMap: Record<string, string>, hd = false): string {
  if (video.thumbUrl) return video.thumbUrl;
  // Custom thumbnail if one with this display name exists in Cloudinary, else YouTube's
  const publicId = video.cloudinaryThumb ? thumbMap[video.cloudinaryThumb] : undefined;
  if (publicId) {
    return getCldImageUrl({ src: publicId, width: hd ? 1920 : 720, format: "auto", quality: "auto" });
  }
  return ytThumb(video.embedUrl, hd);
}

function playerSrc(video: Video): string {
  return video.source === "bunny"
    ? `${video.embedUrl}?autoplay=true&preload=true&responsive=true`
    : `${video.embedUrl}?autoplay=1&rel=0&modestbranding=1`;
}

function zeroPad(n: number): string {
  return String(n).padStart(2, "0");
}

// 118 → "1:58"
function formatRuntime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${zeroPad(seconds % 60)}`;
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

// Card still, lazy-loaded so off-screen cards cost nothing until scrolled to.
// Served as-is: the Bunny CDN rejects requests that carry no Referer, which
// rules out Next's server-side optimizer.
function CardThumb({
  src,
  title,
  zoom,
  className,
}: {
  src: string;
  title: string;
  zoom: number;
  className: string;
}) {
  return (
    <div
      className={`absolute inset-0 will-change-transform transition-transform duration-700 ease-out ${className}`}
      style={{ transform: `scale(${zoom})` }}
    >
      {src && (
        <Image src={src} alt={`Still from ${title}`} fill unoptimized className="object-cover" />
      )}
    </div>
  );
}

// ─── Featured Film Card ───────────────────────────────────────────────────────

function FeaturedCard({
  video,
  index,
  className = "",
  thumbMap,
  onOpen,
  onCursorEnter,
  onCursorLeave,
}: {
  video: Video;
  index: number;
  className?: string;
  thumbMap: Record<string, string>;
  onOpen: (v: Video) => void;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const thumb = getThumb(video, thumbMap, true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative overflow-hidden cursor-none group ${className}`}
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
      <CardThumb src={thumb} title={video.title} zoom={hovered ? 1.06 : 1} className="bg-charcoal" />

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
      {video.category && (
        <div className="absolute top-5 left-5 z-10">
          <span className="font-body text-[9px] tracking-[0.22em] uppercase text-canvas/60 bg-black/30 backdrop-blur-md px-2.5 py-1 border border-white/10">
            {video.category}
          </span>
        </div>
      )}

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

// ─── Short Film Card ──────────────────────────────────────────────────────────

function ShortFilmCard({
  video,
  index,
  thumbMap,
  onOpen,
  onCursorEnter,
  onCursorLeave,
}: {
  video: Video;
  index: number;
  thumbMap: Record<string, string>;
  onOpen: (v: Video) => void;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const thumb = getThumb(video, thumbMap, true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group flex flex-col cursor-none"
      onMouseEnter={() => { setHovered(true); onCursorEnter(); }}
      onMouseLeave={() => { setHovered(false); onCursorLeave(); }}
      onClick={() => onOpen(video)}
      role="button"
      tabIndex={0}
      aria-label={`Play ${video.title}`}
      onKeyDown={(e) => e.key === "Enter" && onOpen(video)}
    >
      {/* Framed still */}
      <div className="relative overflow-hidden border border-canvas/15 p-2 md:p-3">
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <CardThumb src={thumb} title={video.title} zoom={hovered ? 1.05 : 1} className="bg-charcoal" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />

          {/* Badge — top left */}
          <div className="absolute top-4 left-4">
            <span className="font-body text-[9px] tracking-[0.28em] uppercase text-gold border border-gold/60 bg-charcoal/75 backdrop-blur-md px-2.5 py-1">
              Short Film
            </span>
          </div>

          {/* Runtime — bottom right */}
          {video.duration ? (
            <div className="absolute bottom-4 right-4">
              <span className="font-body text-[10px] tracking-[0.2em] text-canvas/80 bg-charcoal/50 backdrop-blur-md px-2.5 py-1">
                {formatRuntime(video.duration)}
              </span>
            </div>
          ) : null}
        </div>

        {/* Gold accent */}
        <div
          className="absolute bottom-0 left-0 h-[2px] w-full bg-gold origin-left will-change-transform transition-transform duration-500 ease-out"
          style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)" }}
        />
      </div>

      {/* Title block */}
      <div className="flex items-baseline gap-5 mt-6 px-1">
        <span className="font-heading text-sm tracking-[0.3em] text-gold" aria-hidden>
          {zeroPad(index + 1)}
        </span>
        <div>
          <h3 className="font-heading text-xl md:text-2xl text-canvas font-bold leading-tight tracking-wide group-hover:text-gold transition-colors duration-300">
            {video.title}
          </h3>
          {video.description && (
            <p className="font-body text-sm text-canvas/55 leading-relaxed mt-2.5">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

function GridCard({
  video,
  index,
  thumbMap,
  onOpen,
  onCursorEnter,
  onCursorLeave,
}: {
  video: Video;
  index: number;
  thumbMap: Record<string, string>;
  onOpen: () => void;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
}) {
  const thumb = getThumb(video, thumbMap, false);
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
         <CardThumb src={thumb} title={video.title} zoom={hovered ? 1.05 : 1} className="bg-beige" />
         <div 
           className="absolute inset-0 transition-colors duration-300" 
           style={{ backgroundColor: hovered ? "rgba(44,44,44,0.15)" : "rgba(44,44,44,0.35)" }} 
         />
         
         {/* Category Badge */}
         {video.category && (
           <div className="absolute top-4 left-4">
             <span className="font-body text-[8px] tracking-[0.2em] uppercase text-canvas/80 bg-black/40 backdrop-blur-md px-2.5 py-1.5 border border-white/10">
               {video.category}
             </span>
           </div>
         )}
      </div>

      {/* Text Details */}
      <div className="flex flex-col px-1">
        <h3 className="font-heading text-lg md:text-xl text-charcoal font-bold leading-tight group-hover:text-gold transition-colors duration-300">
          {video.title}
        </h3>
        {video.client && (
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-charcoal/40 mt-1.5 mb-2.5">
            {video.client}
          </p>
        )}
        {video.description && (
          <p className="font-body text-sm text-charcoal/60 leading-relaxed">
            {video.description}
          </p>
        )}
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
              src={playerSrc(video)}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video overflow-hidden shadow-2xl">
            <iframe
              src={playerSrc(video)}
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

export default function VideoGallery({
  thumbnails = {},
  bunnyVideos = [],
}: {
  thumbnails?: Record<string, string>;
  bunnyVideos?: BunnyVideo[];
}) {
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

  const { featured, shortFilms, reels, categories } = useMemo(() => {
    // Newer Bunny uploads lead; the older YouTube embeds follow
    const all = [...bunnyVideos.map(fromBunny), ...VIDEOS];
    const reels = all
      .filter((v) => !v.isFeatured && !v.isShortFilm)
      .sort((a, b) => reelRank(a) - reelRank(b));
    // Bunny collections that aren't one of the fixed tabs get a tab of their own
    const extra = reels.map((v) => v.category).filter((c) => c && !CATEGORIES.includes(c));
    return {
      featured: all.filter((v) => v.isFeatured),
      shortFilms: all.filter((v) => v.isShortFilm),
      reels,
      categories: [...CATEGORIES, ...new Set(extra)],
    };
  }, [bunnyVideos]);

  const visibleReels =
    activeCategory === "All"
      ? reels
      : reels.filter((v) => v.category === activeCategory);

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

      {/* ── Featured films — #work is the hero's "Explore The Work" target ── */}
      <section id="work" className="scroll-mt-6 py-20 md:py-28 px-6 max-w-7xl mx-auto">

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
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3 md:gap-4">
          {featured.map((video, i) => (
            <FeaturedCard
              key={video.id}
              video={video}
              index={i}
              // The lead film runs full width whenever that leaves the rest in even rows
              className={i === 0 && featured.length % 2 === 1 ? "md:col-span-2" : ""}
              thumbMap={thumbnails}
              onOpen={handleOpen}
              onCursorEnter={() => setCursorActive(true)}
              onCursorLeave={() => setCursorActive(false)}
            />
          ))}
        </div>
      </section>

      {/* ── Short films — a charcoal band, set apart from the brand work ── */}
      {shortFilms.length > 0 && (
        <section className="bg-charcoal text-canvas py-20 md:py-28">
          <div className="px-6 max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="font-body text-[10px] tracking-[0.38em] uppercase text-gold mb-3">
                  Narrative
                </p>
                <h2 className="font-heading text-4xl md:text-5xl text-canvas font-bold leading-none">
                  Short Films
                </h2>
              </div>
              <div className="hidden md:block h-px flex-1 mx-12 bg-canvas/15 self-center" />
              <p className="font-body text-xs text-canvas/50 tracking-widest max-w-xs leading-relaxed">
                Longer, story-led pieces — made to be watched from start to finish.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
              {shortFilms.map((video, i) => (
                <ShortFilmCard
                  key={video.id}
                  video={video}
                  index={i}
                  thumbMap={thumbnails}
                  onOpen={handleOpen}
                  onCursorEnter={() => setCursorActive(true)}
                  onCursorLeave={() => setCursorActive(false)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Reels section ── */}
      <section className={`pb-20 md:pb-28 px-6 max-w-7xl mx-auto ${shortFilms.length > 0 ? "pt-20 md:pt-28" : ""}`}>
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
            {categories.map((cat) => {
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
                  thumbMap={thumbnails}
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
