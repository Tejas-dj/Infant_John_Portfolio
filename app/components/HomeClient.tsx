"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeHero from "./HomeHero";
import MagneticButton from "./MagneticButton";

const whyWork = [
  {
    title: "Personal Editing & Color Grading",
    desc: "Every frame, every color, every cut — handled personally. No outsourcing, no compromise.",
  },
  {
    title: "Chill & Collaborative",
    desc: "The work is serious. The vibe isn't. Enjoy the process as much as the result.",
  },
  {
    title: "Obsessive Work Ethic",
    desc: "The kind of dedication that only stops when the result is genuinely extraordinary.",
  },
];

const curatedItems = [
  { id: 1, isVideo: false, label: "Portrait", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80" },
  { id: 2, isVideo: false, label: "Automotive", img: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&q=80" },
  { id: 3, isVideo: true, label: "Brand Reel", img: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80" },
  { id: 4, isVideo: false, label: "Event", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80" },
  { id: 5, isVideo: false, label: "Commercial", img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80" },
  { id: 6, isVideo: true, label: "Cinematic", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80" },
  { id: 7, isVideo: false, label: "Lifestyle", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80" },
  { id: 8, isVideo: false, label: "Product", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80" },
];

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <polygon points="5,2 16,9 5,16" />
    </svg>
  );
}

export default function HomeClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Global color shift removed

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = galleryTrackRef.current;
    const gallery = galleryRef.current;

    if (track && gallery) {
      const getScrollAmount = () => {
        let trackWidth = track.scrollWidth;
        return -(trackWidth - window.innerWidth + 100);
      };

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: gallery,
          start: "top top",
          end: () => `+=${getScrollAmount() * -1}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <HomeHero />

      <div className="relative z-20 bg-canvas text-charcoal">

        {/* ── About ── */}
        <section className="py-24 md:py-32 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Image (No Transition) */}
            <div className="relative aspect-[4/5] bg-charcoal/5 border border-current/10 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1554046920-90dcac0536d1?auto=format&fit=crop&q=80"
                alt="John"
                className="absolute inset-0 w-full h-full object-cover origin-top"
              />
            </div>

            <div>
              <span className="font-body text-gold text-[10px] tracking-[0.35em] uppercase">About John</span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mt-4 mb-8 leading-[1.15]">
                Where Light<br />Meets Story
              </h2>
              <div className="space-y-5 font-body leading-[1.9] text-sm md:text-base opacity-80">
                <p className="text-xl font-medium !opacity-100 leading-snug">
                  Hey, I'm John — a freelance videographer and photographer driven by a genuine love
                  for the craft. Every aspect of my work is handled personally.
                </p>
                <p>
                  What I do isn't just about capturing moments. It's about building narratives — whether
                  it's the story of a brand, the emotion of an event, or the soul of a space. I bring a
                  cinematic sensibility to every project, large or small.
                </p>
                <p>
                  Collaborating with me means you get someone who cares deeply about your vision, brings
                  a genuinely chill energy to the process, and works with obsessive dedication until the
                  result is something we're both proud of.
                </p>
              </div>
              <MagneticButton className="mt-10 inline-block" data-cursor="hover">
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-32 h-32 rounded-full border border-current hover:bg-gold hover:text-canvas hover:border-gold transition-colors duration-500 font-body text-[10px] tracking-[0.2em] uppercase text-center p-4"
                >
                  Let's Work<br />Together →
                </Link>
              </MagneticButton>
            </div>

          </div>
        </section>

        {/* ── Curated Glimpse (GSAP Horizontal Scroll) ── */}
        <section ref={galleryRef} className="h-screen overflow-hidden bg-charcoal text-canvas pt-20">
          <div className="px-6 max-w-7xl mx-auto mb-10 shrink-0">
            <span className="font-body text-gold text-[10px] tracking-[0.35em] uppercase">Selected Work</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3">
              A Curated Glimpse
            </h2>
          </div>

          <div ref={galleryTrackRef} className="flex gap-8 px-6 pb-20 w-[250vw] md:w-[200vw] h-[60vh] md:h-[70vh] items-center">
            {curatedItems.map((item, i) => {
              const isHovered = hoveredCard === i;
              const isOtherHovered = hoveredCard !== null && hoveredCard !== i;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  data-cursor={item.isVideo ? "play" : "drag"}
                  className="relative h-full aspect-[3/4] flex-none overflow-hidden group cursor-pointer transition-all duration-700"
                  style={{ opacity: isOtherHovered ? 0.3 : 1 }}
                >
                  <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />

                  {/* Fake Video Preview on Hover for Video Items */}
                  {item.isVideo && (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <source src="https://cdn.coverr.co/videos/coverr-camera-focusing-on-a-subject-4318/1080p.mp4" type="video/mp4" />
                    </video>
                  )}

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-charcoal/80 to-transparent translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="font-body text-canvas text-xs tracking-[0.2em] uppercase">
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Why Work With John (Accordion) ── */}
        <section className="py-24 md:py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <span className="font-body text-gold text-[10px] tracking-[0.35em] uppercase">
                The John Difference
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">
                Why Work With John?
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {whyWork.map((item, i) => {
                const isActive = activeAccordion === i;
                return (
                  <div
                    key={item.title}
                    className="border-b border-current/20 pb-4 overflow-hidden cursor-pointer"
                    onMouseEnter={() => setActiveAccordion(i)}
                    data-cursor="hover"
                  >
                    <div className="flex items-center justify-between py-4">
                      <h3 className={`font-heading text-2xl md:text-4xl font-bold transition-colors duration-500 ${isActive ? 'text-gold' : 'text-current opacity-50 hover:opacity-100'}`}>
                        {item.title}
                      </h3>
                      <span className="text-xl font-light opacity-50">{isActive ? '−' : '+'}</span>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <p className="font-body text-current/70 text-lg leading-[1.85] pb-6 max-w-2xl">
                        {item.desc}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Marquee Footer ── */}
        <section className="py-20 md:py-32 overflow-hidden flex items-center justify-center bg-charcoal text-canvas">
          <motion.div
            animate={{ x: [0, -1035] }} // Adjust based on text width
            transition={{ ease: "linear", duration: 10, repeat: Infinity }}
            className="flex whitespace-nowrap"
            data-cursor="hover"
          >
            {[...Array(4)].map((_, i) => (
              <h2 key={i} className="font-heading text-[5vw] font-bold uppercase tracking-tighter leading-none px-4 hover:text-gold transition-colors duration-300">
                Let's Create Magic ✦
              </h2>
            ))}
          </motion.div>
        </section>

      </div>
    </div>
  );
}
