"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

interface Video {
  id: number;
  title: string;
  client: string;
  category: string;
  duration: string;
  embedUrl?: string;
  isFeatured?: boolean;
}

const CATEGORIES = [
  "All",
  "Brand Reels & Commercials",
  "Automotive Motion",
  "Event Highlights",
  "Podcast & Interviews",
  "Venue & Interiors",
];

const VIDEOS: Video[] = [
  { id: 1, title: "Brand Identity Reel",    client: "Brand Co.",      category: "Brand Reels & Commercials", duration: "2:14", isFeatured: true },
  { id: 2, title: "Automotive Motion Study", client: "Auto Motors",    category: "Automotive Motion",         duration: "1:48" },
  { id: 3, title: "Annual Gala Highlights",  client: "Events Ltd.",    category: "Event Highlights",          duration: "3:02" },
  { id: 4, title: "Founders Podcast",        client: "Startup Inc.",   category: "Podcast & Interviews",      duration: "22:45", isFeatured: true },
  { id: 5, title: "Venue Showcase",          client: "The Grand Hotel",category: "Venue & Interiors",         duration: "1:30" },
  { id: 6, title: "Product Launch Film",     client: "Product X",      category: "Brand Reels & Commercials", duration: "0:58" },
  { id: 7, title: "Corporate Event",         client: "Corp Group",     category: "Event Highlights",          duration: "4:10" },
  { id: 8, title: "Lifestyle Campaign",      client: "Lifestyle Brand",category: "Brand Reels & Commercials", duration: "1:22" },
];

const TINTS = VIDEOS.map((_, i) =>
  `hsl(${210 + (i * 18) % 60},${12 + (i * 3) % 18}%,${22 + (i * 4) % 16}%)`
);

function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <polygon points="3,1 15,8 3,15" />
    </svg>
  );
}

export default function VideoGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openVideo, setOpenVideo] = useState<Video | null>(null);
  const [hoveredVideoId, setHoveredVideoId] = useState<number | null>(null);
  
  // Custom Cursor state
  const [isHoveringGrid, setIsHoveringGrid] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 40); // Offset by half cursor width (80px / 2 = 40)
      mouseY.set(e.clientY - 40);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const visible = activeCategory === "All"
    ? VIDEOS
    : VIDEOS.filter(v => v.category === activeCategory);

  return (
    <>
      {/* Magnetic Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-20 h-20 bg-gold rounded-full flex items-center justify-center text-canvas pointer-events-none z-[60] backdrop-blur-md bg-opacity-90 shadow-xl"
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: isHoveringGrid && !openVideo ? 1 : 0,
          opacity: isHoveringGrid && !openVideo ? 1 : 0,
        }}
        transition={{ scale: { duration: 0.2 }, opacity: { duration: 0.2 } }}
      >
        <span className="font-heading text-xs uppercase tracking-widest font-bold">Play</span>
      </motion.div>

      <section className="py-16 px-6 max-w-7xl mx-auto">
        {/* Category filters */}
        <div className="mb-14">
          <h2 className="font-heading text-2xl text-charcoal font-bold mb-6">The Work</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative font-body text-xs tracking-[0.12em] px-5 py-2.5 transition-colors duration-300 ${
                    isActive ? "text-canvas" : "text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterBg"
                      className="absolute inset-0 bg-gold rounded-none"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  {isActive ? null : <div className="absolute inset-0 border border-warm-gray/30 z-[-1]" />}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Box Video Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          onMouseEnter={() => setIsHoveringGrid(true)}
          onMouseLeave={() => { setIsHoveringGrid(false); setHoveredVideoId(null); }}
        >
          <AnimatePresence mode="popLayout">
            {visible.map((video, index) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setOpenVideo(video)}
                onMouseEnter={() => setHoveredVideoId(video.id)}
                onMouseLeave={() => setHoveredVideoId(null)}
                className={`group cursor-none flex flex-col ${video.isFeatured ? 'md:col-span-2' : 'col-span-1'}`}
              >
                {/* Thumbnail Area */}
                <motion.div
                  layoutId={`video-container-${video.id}`}
                  className={`relative flex-grow flex items-center justify-center overflow-hidden bg-charcoal/5 ${video.isFeatured ? 'aspect-[21/9]' : 'aspect-video'}`}
                  style={{ backgroundColor: TINTS[video.id - 1] }}
                >
                  <motion.div 
                    layoutId={`video-image-${video.id}`}
                    className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(/videos/thumbnails/video-${String(video.id).padStart(2, "0")}.jpg)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  
                  {/* Overlay tint */}
                  <div className="absolute inset-0 bg-charcoal/20 transition-colors duration-500" />

                  {/* Simulated Video Preview (Color crossfade for now since we lack assets) */}
                  <AnimatePresence>
                    {hoveredVideoId === video.id && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-charcoal/80 flex items-center justify-center backdrop-blur-sm"
                      >
                         <span className="text-canvas/50 font-body text-xs tracking-widest uppercase">Preview Playing...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Duration badge */}
                  <span className="absolute bottom-4 right-4 font-body text-[10px] bg-canvas/10 text-canvas px-2.5 py-1 tracking-wider backdrop-blur-md rounded-sm border border-canvas/20">
                    {video.duration}
                  </span>
                </motion.div>

                {/* Card info */}
                <div className="pt-5 pb-2">
                  <p className="font-body text-[10px] text-gold tracking-[0.22em] uppercase mb-2">
                    {video.category}
                  </p>
                  <h3 className="font-heading text-lg text-charcoal font-bold group-hover:text-gold transition-colors duration-300 leading-snug">
                    {video.title}
                  </h3>
                  <p className="font-body text-xs text-charcoal/40 mt-1">{video.client}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── Cinematic Full-Screen Player Modal ── */}
      <AnimatePresence>
        {openVideo && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-charcoal/98 px-4 py-6 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8 flex-none">
              <div>
                <p className="font-body text-[10px] text-gold tracking-[0.22em] uppercase mb-1">
                  {openVideo.category}
                </p>
                <h3 className="font-heading text-xl text-canvas font-bold">{openVideo.title}</h3>
              </div>
              <button
                onClick={() => setOpenVideo(null)}
                className="w-12 h-12 rounded-full border border-warm-gray/20 text-canvas/60 text-2xl flex items-center justify-center hover:border-gold hover:text-gold hover:bg-gold/10 transition-all"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Video Player Area */}
            <motion.div
              layoutId={`video-container-${openVideo.id}`}
              className="relative w-full flex-grow flex items-center justify-center overflow-hidden bg-black/50 rounded-sm"
              onClick={() => setOpenVideo(null)}
            >
              {openVideo.embedUrl ? (
                <iframe
                  src={openVideo.embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={openVideo.title}
                />
              ) : (
                <motion.div 
                  layoutId={`video-image-${openVideo.id}`}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backgroundImage: `url(/videos/thumbnails/video-${String(openVideo.id).padStart(2, "0")}.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.3,
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full border border-gold flex items-center justify-center text-gold mx-auto mb-6 bg-gold/10 backdrop-blur-md">
                      <PlayIcon size={24} />
                    </div>
                    <p className="font-body text-xs tracking-[0.3em] uppercase text-canvas/50">
                      Embed URL Placeholder
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

