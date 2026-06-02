"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

interface Video {
  id: number;
  title: string;
  client: string;
  category: string;
  embedUrl: string;
  thumbnail?: string; // custom image in /public/images/videography/ — overrides YouTube thumb
  isFeatured?: boolean;
  orientation: "landscape" | "portrait";
}

const CATEGORIES = ["All", "Fashion & Influencer", "Events", "Salon & Lifestyle", "Jewellery", "Furniture"];

const VIDEOS: Video[] = [
  { id: 1,  title: "SUZARAIN FURNITURE",           client: "Suzarain Furniture",  category: "Furniture",            orientation: "landscape", embedUrl: "https://www.youtube.com/embed/UBzFSXZmYrA", isFeatured: true },
  { id: 2,  title: "THE DREAM Ft. Maheen",         client: "@thatboujeefactor",   category: "Fashion & Influencer", orientation: "landscape", embedUrl: "https://www.youtube.com/embed/tpOrtLjocUY", isFeatured: true },
  { id: 3,  title: "AZŌRTE Store Launch",          client: "@_shashankdeshpande", category: "Fashion & Influencer", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/4Ds-xRxNv5s" },
  { id: 4,  title: "Courtyard Marriott Christmas", client: "Courtyard Marriott",  category: "Events",               orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/zm10wlEa7yI" },
  { id: 5,  title: "LAKMÉ Salon Visit",            client: "@poorni_gowdaaa",     category: "Salon & Lifestyle",    orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/9RBwFyYTjOA" },
  { id: 6,  title: "MAX Fashion Store",            client: "@SOMETHINGNAME",      category: "Fashion & Influencer", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/zhqlZS3jnBY" },
  { id: 7,  title: "Play Salon Visit",             client: "@playsaloon",         category: "Salon & Lifestyle",    orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/1ctfzoaHXjw" },
  { id: 8,  title: "Style Union PR",               client: "@SUSHMITAREDDY",      category: "Fashion & Influencer", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/Gxi2T5rQk5E" },
  { id: 9,  title: "Puppawccino",                  client: "@puppawccino",        category: "Salon & Lifestyle",    orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/av-kbls4wrs" },
  { id: 10, title: "Rasa Jewellery",               client: "@rasajewellery",      category: "Jewellery",            orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/WBqvnOaVjo8" },
  { id: 11, title: "Shein India",                  client: "@snehithaa_kushwaha", category: "Fashion & Influencer", orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/YikChcIoGl8" },
  { id: 12, title: "Taayani Jewellers",            client: "@taayaanijewellery",  category: "Jewellery",            orientation: "portrait",  embedUrl: "https://www.youtube.com/embed/MVLElgyX4GQ" },
];

function getThumb(embedUrl: string, hd = false): string {
  const id = embedUrl.split("/embed/")[1]?.split("?")[0] ?? "";
  if (!id) return "";
  // maxresdefault (1280×720) for featured landscape; hqdefault (480×360) for portrait shorts
  return `https://img.youtube.com/vi/${id}/${hd ? "maxresdefault" : "hqdefault"}.jpg`;
}

function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <polygon points="3,1 15,8 3,15" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="1" y1="1" x2="11" y2="11" />
      <line x1="11" y1="1" x2="1" y2="11" />
    </svg>
  );
}

export default function VideoGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openVideo, setOpenVideo] = useState<Video | null>(null);
  const [isHoveringGrid, setIsHoveringGrid] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const cx = useSpring(mouseX, { damping: 25, stiffness: 350, mass: 0.4 });
  const cy = useSpring(mouseY, { damping: 25, stiffness: 350, mass: 0.4 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 40);
      mouseY.set(e.clientY - 40);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenVideo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visible = activeCategory === "All"
    ? VIDEOS
    : VIDEOS.filter((v) => v.category === activeCategory);

  return (
    <>
      {/* ── Magnetic play cursor (desktop only) ── */}
      <motion.div
        className="fixed top-0 left-0 z-[60] w-20 h-20 rounded-full bg-gold pointer-events-none flex items-center justify-center shadow-2xl"
        style={{ x: cx, y: cy }}
        animate={{
          scale: isHoveringGrid && !openVideo ? 1 : 0,
          opacity: isHoveringGrid && !openVideo ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        <span className="font-heading text-[10px] uppercase tracking-widest text-charcoal font-bold">
          Play
        </span>
      </motion.div>

      <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">

        {/* ── Section header + filter row ── */}
        <div className="mb-10">
          <p className="font-body text-[10px] tracking-[0.35em] uppercase text-gold mb-3">
            Selected Work
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-4">
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal font-bold leading-none">
              The Work
            </h2>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative font-body text-[11px] tracking-[0.1em] uppercase px-4 py-2 transition-colors duration-300 ${
                      isActive ? "text-canvas" : "text-charcoal/50 hover:text-charcoal"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activePill"
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

          <div className="mt-8 h-px bg-warm-gray/20" />
        </div>

        {/* ── Bento grid ──
            All cards span 2 rows (480 px tall).
            Featured landscape cards span 2 columns → wide hero tile.
            Portrait cards are 1 column → tall tile.
            grid-auto-flow: row dense fills any gaps when filtering.
        ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          style={{ gridAutoRows: "240px", gridAutoFlow: "row dense" }}
          onMouseEnter={() => setIsHoveringGrid(true)}
          onMouseLeave={() => setIsHoveringGrid(false)}
        >
          <AnimatePresence mode="popLayout">
            {visible.map((video, i) => {
              const featured = !!video.isFeatured;
              const colSpan = featured ? "sm:col-span-2 lg:col-span-2" : "col-span-1";

              return (
                <motion.article
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{
                    duration: 0.36,
                    delay: i * 0.045,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => setOpenVideo(video)}
                  className={`group relative cursor-none overflow-hidden bg-charcoal row-span-2 ${colSpan}`}
                >
                  {/* Thumbnail — custom image wins; YouTube thumb is the fallback */}
                  <div
                    className="absolute inset-0 bg-cover bg-center will-change-transform transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                    style={{
                      backgroundImage: `url(${video.thumbnail ?? getThumb(video.embedUrl, featured)})`,
                    }}
                  />

                  {/* Permanent bottom gradient for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />

                  {/* Subtle dark tint on hover */}
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/25 transition-colors duration-500" />

                  {/* Category badge — top left */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="font-body text-[9px] tracking-[0.2em] uppercase text-canvas/75 bg-black/40 backdrop-blur-md px-2.5 py-1 border border-white/10">
                      {video.category}
                    </span>
                  </div>

                  {/* Play button — fades in on hover, centered */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full border border-canvas/50 bg-canvas/10 backdrop-blur-md flex items-center justify-center text-canvas pl-0.5 shadow-lg group-hover:border-gold group-hover:text-gold transition-colors duration-300">
                      <PlayIcon size={15} />
                    </div>
                  </div>

                  {/* Title block — slides up on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3
                      className="font-heading text-sm md:text-[15px] text-canvas font-bold leading-snug tracking-wide transition-transform duration-300 ease-out translate-y-1 group-hover:translate-y-0"
                    >
                      {video.title}
                    </h3>
                    <p
                      className="font-body text-[10px] text-canvas/50 mt-1.5 tracking-widest opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 ease-out"
                    >
                      {video.client}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Full-screen video modal ── */}
      <AnimatePresence>
        {openVideo && (
          <motion.div
            className="fixed inset-0 z-[100] bg-charcoal flex flex-col p-5 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            {/* Modal header */}
            <div className="flex-none flex justify-between items-start mb-6">
              <div>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
                  {openVideo.category}
                </p>
                <h3 className="font-heading text-xl md:text-2xl text-canvas font-bold leading-tight">
                  {openVideo.title}
                </h3>
                <p className="font-body text-xs text-canvas/40 mt-1 tracking-wide">
                  {openVideo.client}
                </p>
              </div>
              <button
                onClick={() => setOpenVideo(null)}
                aria-label="Close video"
                className="ml-8 flex-none w-9 h-9 rounded-full border border-canvas/20 flex items-center justify-center text-canvas/50 hover:border-gold hover:text-gold transition-all duration-300"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Video player — portrait vs landscape */}
            <div className="flex-grow min-h-0 flex items-center justify-center">
              {openVideo.orientation === "portrait" ? (
                <div className="relative h-full max-h-full aspect-[9/16] overflow-hidden shadow-2xl">
                  <iframe
                    src={`${openVideo.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={openVideo.title}
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-video overflow-hidden shadow-2xl">
                  <iframe
                    src={`${openVideo.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={openVideo.title}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
