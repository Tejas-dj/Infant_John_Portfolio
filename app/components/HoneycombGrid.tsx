"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Lightbox from "./Lightbox";

import { PHOTOS, COUNT } from "../data/photography";

// ── Layout helpers ────────────────────────────────────────────
function hexLayout(size: number, gap: number) {
  const sx = size + gap;
  const sy = sx * 0.8660254; // √3/2 — true hexagonal row spacing
  const W = COLS * sx + sx / 2; // extra half-step for staggered rows
  const H = Math.ceil(COUNT / COLS) * sy + size;
  const pos = Array.from({ length: COUNT }, (_, i) => ({
    x: (i % COLS) * sx + (Math.floor(i / COLS) % 2 === 1 ? sx / 2 : 0),
    y: Math.floor(i / COLS) * sy,
  }));
  return { W, H, pos };
}

// ── Component ─────────────────────────────────────────────────
const COLS = 15;
const ICON_D = 90;   // desktop icon px
const ICON_M = 62;   // mobile icon px
const GAP_D = 14;
const GAP_M = 9;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 5;
const G_RADIUS = 210; // gravity influence radius (screen px at zoom 1)

export default function HoneycombGrid() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // All live interaction state in a single ref → zero re-renders from physics
  const lv = useRef({
    z: 1, px: 0, py: 0,           // zoom + pan
    mx: 0, my: 0, inGrid: false,   // mouse
    drag: false,
    dsx: 0, dsy: 0, dpx: 0, dpy: 0, // drag start
    td: 0,                           // pinch start distance
    size: ICON_D, gap: GAP_D,
  });

  // React state only for things that drive UI re-renders
  const [cfg, setCfg] = useState({ size: ICON_D, gap: GAP_D });
  const [mounted, setMounted] = useState(false);
  const [sel, setSel] = useState<number | null>(null);

  const L = hexLayout(cfg.size, cfg.gap);

  // ── DOM helpers ──────────────────────────────────────────────
  function applyTransform() {
    const el = worldRef.current;
    if (!el) return;
    const { z, px, py } = lv.current;
    el.style.transform = `translate(${px}px,${py}px) scale(${z})`;
    el.style.transformOrigin = "0 0";
  }

  function centerGrid() {
    const c = wrapRef.current;
    if (!c) return;
    const { W, H } = hexLayout(lv.current.size, lv.current.gap);
    lv.current.px = (c.clientWidth - W) / 2;
    lv.current.py = (c.clientHeight - H) / 2;
    applyTransform();
  }

  function updateMagnetic() {
    const { z, px, py, mx, my, inGrid, size, gap } = lv.current;
    const { pos } = hexLayout(size, gap);
    const half = size / 2;
    // Radius grows with sqrt(zoom) so the effect feels consistent at all zoom levels
    const radius = G_RADIUS * Math.sqrt(z);

    pos.forEach((p, i) => {
      const el = dotRefs.current[i];
      if (!el) return;
      let target = 1;
      if (inGrid) {
        // Convert icon centre → screen coordinates
        const sx = (p.x + half) * z + px;
        const sy = (p.y + half) * z + py;
        const dist = Math.hypot(mx - sx, my - sy);
        const inf = Math.max(0, 1 - dist / radius);
        // min=0.88 at inf=0, max=2.4 at inf=1, power curve for nice falloff
        target = 0.88 + 1.52 * Math.pow(inf, 1.7);
      }
      gsap.to(el, {
        scale: target,
        duration: inGrid ? 0.28 : 0.55,
        ease: "power2.out",
        overwrite: true,
      });
    });
  }

  // ── Mount: detect device, register all events ────────────────
  useEffect(() => {
    const isMob = window.innerWidth < 768;
    const size = isMob ? ICON_M : ICON_D;
    const gap = isMob ? GAP_M : GAP_D;
    lv.current.size = size;
    lv.current.gap = gap;
    setCfg({ size, gap }); // triggers re-render so circles have correct sizes
    setMounted(true);
  }, []);

  // Re-center whenever cfg changes (mount + resize)
  useEffect(() => {
    if (!mounted) return;
    lv.current.size = cfg.size;
    lv.current.gap = cfg.gap;
    centerGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg, mounted]);

  // Event listeners – only attached once, read mutable state via ref
  useEffect(() => {
    if (!mounted) return;
    const c = wrapRef.current;
    if (!c) return;

    const onMove = (e: MouseEvent) => {
      const r = c.getBoundingClientRect();
      lv.current.mx = e.clientX - r.left;
      lv.current.my = e.clientY - r.top;
      lv.current.inGrid = true;
      updateMagnetic();
    };

    const onLeave = () => {
      lv.current.inGrid = false;
      updateMagnetic();
    };

    const onResize = () => {
      const isMob = window.innerWidth < 768;
      const size = isMob ? ICON_M : ICON_D;
      const gap = isMob ? GAP_M : GAP_D;
      lv.current.z = 1;
      lv.current.size = size;
      lv.current.gap = gap;
      setCfg({ size, gap });
    };

    // Keyboard lightbox navigation
    const onKey = (e: KeyboardEvent) => {
      setSel(cur => {
        if (cur === null) return null;
        if (e.key === "ArrowLeft") return (cur - 1 + COUNT) % COUNT;
        if (e.key === "ArrowRight") return (cur + 1) % COUNT;
        if (e.key === "Escape") return null;
        return cur;
      });
    };

    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);

    return () => {
      c.removeEventListener("mousemove", onMove);
      c.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const prev = () => setSel(i => i !== null ? (i - 1 + COUNT) % COUNT : null);
  const next = () => setSel(i => i !== null ? (i + 1) % COUNT : null);

  // ── Loading state (SSR + before mount) ──────────────────────
  if (!mounted) {
    return (
      <div
        className="relative w-full h-full overflow-hidden bg-canvas flex items-center justify-center"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)"
        }}
      >
        <div className="flex flex-wrap justify-center gap-3 opacity-25 max-w-lg">
          {Array.from({ length: 18 }, (_, i) => (
            <div key={i} className="w-16 h-16 rounded-full bg-beige" />
          ))}
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      <div
        ref={wrapRef}
        className="relative w-full h-full overflow-hidden bg-canvas select-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)"
        }}
      >
        {/* ── World: absolute, positioned by JS transform ── */}
        <div
          ref={worldRef}
          className="absolute top-0 left-0"
          style={{ width: L.W, height: L.H }}
        >
          {PHOTOS.map((photo, i) => (
            <div
              key={photo.id}
              ref={el => { dotRefs.current[i] = el; }}
              onClick={() => setSel(i)}
              role="button"
              tabIndex={0}
              aria-label={`Open photo ${i + 1}`}
              className="absolute rounded-full cursor-pointer will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-gold overflow-hidden"
              style={{
                width: cfg.size,
                height: cfg.size,
                left: L.pos[i].x,
                top: L.pos[i].y,
                backgroundColor: photo.tint,
                boxShadow: "0 4px 18px rgba(44,44,44,0.1), inset 0 0 0 1.5px rgba(217,176,97,0.18)",
              }}
            >
              <Image
                src={photo.src}
                alt={`Photo ${i + 1}`}
                fill
                sizes="90px"
                className="object-cover opacity-0 transition-opacity duration-1000"
                onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
              />
            </div>
          ))}
        </div>

        {/* Hint bar */}
        <p className="absolute bottom-5 inset-x-0 text-center font-body text-[10px] text-charcoal/25 tracking-[0.22em] uppercase pointer-events-none">
          Click on an image to open
        </p>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────── */}
      <Lightbox images={PHOTOS} sel={sel} setSel={setSel} />
    </>
  );
}
