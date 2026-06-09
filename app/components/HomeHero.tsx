"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import MagneticButton from "./MagneticButton";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.8 } }, // Delay text to let mask finish
};

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export default function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  
  // Parallax the video container a bit slower than scroll
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Fade out text as we scroll down
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal"
    >
      {/* Mask Reveal Container */}
      <motion.div
        initial={{ clipPath: "inset(20% 10% 20% 10% round 12px)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
        className="absolute inset-0 w-full h-full"
      >
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 w-full h-full scale-[1.1]"
        >
          {/* Video Background */}
          {isMounted && (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80"
            >
              <source
                src="https://cdn.coverr.co/videos/coverr-camera-focusing-on-a-subject-4318/1080p.mp4"
                type="video/mp4"
              />
            </video>
          )}

          {/* Dark Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-charcoal/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/40" />
        </motion.div>
      </motion.div>

      {/* Sequenced entrance */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <motion.p
          variants={rise}
          className="font-body text-gold text-xs tracking-[0.35em] uppercase mb-8"
        >
          Available for Projects
        </motion.p>

        <motion.h1
          variants={rise}
          className="font-heading text-5xl sm:text-7xl lg:text-8xl text-canvas font-bold leading-[1.05] mb-6"
        >
          Infant John A
        </motion.h1>

        <motion.p
          variants={rise}
          className="font-body text-base md:text-lg text-canvas/70 max-w-xl mx-auto leading-[1.9] mb-12"
        >
          Videographer &amp; Photographer
          <br />
          Light, story, and precision. Delivered with heart.
        </motion.p>

        <motion.div
          variants={rise}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton>
            <Link
              href="/videography"
              data-cursor="hover"
              className="block px-9 py-4 bg-gold text-canvas font-body text-xs tracking-[0.2em] uppercase hover:bg-gold/85 transition-colors w-full sm:w-auto text-center"
            >
              Watch The Reel
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link
              href="/photography"
              data-cursor="hover"
              className="block px-9 py-4 border border-canvas/40 text-canvas font-body text-xs tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-colors w-full sm:w-auto text-center"
            >
              See The Work
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Bouncing scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-body text-[10px] text-gold tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
