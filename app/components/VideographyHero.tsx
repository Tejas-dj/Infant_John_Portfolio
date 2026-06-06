"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <polygon points="3,1 15,8 3,15" />
    </svg>
  );
}

export default function VideographyHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  
  return (
    <section ref={containerRef} className="relative pt-32 pb-24 px-0 md:px-12 lg:px-16 xl:px-24 overflow-hidden min-h-[85vh] flex items-center bg-canvas">
      
      {/* Background ambient noise */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-multiply"
        style={{ backgroundImage: "url(/noise.png)", backgroundRepeat: "repeat" }}
      />

      <div className="max-w-[1500px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        
        {/* Left Column: Typography (Smaller column) */}
        <motion.div 
          style={{ y: textY }}
          className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 px-6 md:px-0"
        >
          <h1 className="font-heading text-6xl md:text-8xl lg:text-7xl xl:text-[6.5rem] text-charcoal font-bold leading-[0.9] tracking-tight">
            <motion.span 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
              className="block"
            >
              Motion
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
              className="block text-warm-gray italic font-light ml-8 md:ml-12"
            >
              That Moves
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
              className="block"
            >
              People.
            </motion.span>
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7 }}
            className="font-body text-charcoal/60 mt-10 max-w-sm text-sm leading-[1.8] pl-2 md:pl-0"
          >
            A curated selection of cinematic brand narratives, commercial projects, and visual storytelling by Infant John A.
          </motion.p>
          
          <motion.div
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9 }}
             className="mt-10"
          >
            <button className="group flex items-center gap-4 text-charcoal hover:text-gold transition-colors duration-300">
               <span className="font-body text-xs tracking-widest uppercase font-semibold">Explore The Work</span>
               <div className="w-8 h-[1px] bg-charcoal group-hover:bg-gold transition-colors duration-300 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gold w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
               </div>
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column: Floating Video Card (Bigger column) */}
        <div className="lg:col-span-7 relative order-1 lg:order-2 flex justify-center lg:justify-end">
          
          {/* Decorative Circle */}
          <motion.div 
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="absolute -top-12 -right-12 w-64 h-64 rounded-full border border-warm-gray/20 z-0 hidden lg:block"
          />

          <motion.div 
            style={{ y: videoY }}
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full md:max-w-full aspect-video bg-warm-gray/10 md:p-3 md:pb-12 shadow-2xl shadow-charcoal/5 group"
          >
            {/* Video Container */}
            <div className="relative w-full h-full overflow-hidden bg-charcoal">
              <AnimatePresence mode="wait">
                {!playing ? (
                  <motion.div key="thumb" className="absolute inset-0" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <motion.div
                      className="absolute inset-0 w-full h-full transition-transform duration-1000 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(https://img.youtube.com/vi/UBzFSXZmYrA/maxresdefault.jpg)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-colors duration-500" />
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setPlaying(true)}
                        aria-label="Play Suzarain Furniture video"
                        className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-canvas/30 backdrop-blur-md border border-canvas/50 flex items-center justify-center text-canvas cursor-pointer hover:bg-gold hover:text-charcoal hover:border-gold hover:scale-110 transition-all duration-500 shadow-lg"
                      >
                        <PlayIcon />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="player" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <iframe
                      src="https://www.youtube.com/embed/UBzFSXZmYrA?autoplay=1&rel=0&modestbranding=1"
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="Suzarain Furniture"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Polaroid style text - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex absolute bottom-4 left-5 right-5 justify-between items-center text-charcoal/50 font-body text-[10px] tracking-widest uppercase">
              <span>Suzarain Furniture</span>
              <span>Featured Film</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
