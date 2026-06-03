"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { CldImage } from "next-cloudinary";
import Lightbox from "./Lightbox";

import type { Photo } from "../data/photography";

// ── Layout helpers ────────────────────────────────────────────
function computeLayout(vw: number) {
  const cols = vw < 600 ? 5 : vw < 1024 ? 10 : 15;
  const sx   = vw / (cols + 0.5);                        // step that exactly fills viewport width
  const gap  = Math.max(4, Math.round(sx * 0.134));      // ~13% of step as gap
  const size = Math.round(sx - gap);
  return { size, gap, cols };
}

function hexLayout(size: number, gap: number, count: number, cols: number) {
  const sx = size + gap;
  const sy = sx * 0.8660254; // √3/2 — true hexagonal row spacing
  const W  = cols * sx + sx / 2;
  const H  = Math.ceil(count / cols) * sy + size;
  const pos = Array.from({ length: count }, (_, i) => ({
    x: (i % cols) * sx + (Math.floor(i / cols) % 2 === 1 ? sx / 2 : 0),
    y: Math.floor(i / cols) * sy,
  }));
  return { W, H, pos };
}

// ── Component ─────────────────────────────────────────────────
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 5;
const G_RADIUS = 210;

export default function HoneycombGrid({ photos }: { photos: Photo[] }) {
  const count = photos.length;

  const wrapRef  = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const dotRefs  = useRef<(HTMLDivElement | null)[]>([]);

  const lv = useRef({
    z: 1, px: 0, py: 0,
    mx: 0, my: 0, inGrid: false,
    drag: false,
    dsx: 0, dsy: 0, dpx: 0, dpy: 0,
    td: 0,
    size: 90, gap: 14, cols: 15,
  });

  const [cfg, setCfg] = useState({ size: 90, gap: 14, cols: 15 });
  const [mounted, setMounted] = useState(false);
  const [sel, setSel] = useState<number | null>(null);

  const L = hexLayout(cfg.size, cfg.gap, count, cfg.cols);

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
    const { size, gap, cols } = lv.current;
    const { H } = hexLayout(size, gap, count, cols);
    lv.current.px = 0; // grid fills full width — no horizontal offset needed
    lv.current.py = (c.clientHeight - H) / 2;
    applyTransform();
  }

  function updateMagnetic() {
    const { z, px, py, mx, my, inGrid, size, gap, cols } = lv.current;
    const { pos } = hexLayout(size, gap, count, cols);
    const half = size / 2;
    const radius = G_RADIUS * Math.sqrt(z);

    pos.forEach((p, i) => {
      const el = dotRefs.current[i];
      if (!el) return;
      let target = 1;
      if (inGrid) {
        const sx = (p.x + half) * z + px;
        const sy = (p.y + half) * z + py;
        const dist = Math.hypot(mx - sx, my - sy);
        const inf  = Math.max(0, 1 - dist / radius);
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

  // ── Mount ────────────────────────────────────────────────────
  useEffect(() => {
    const layout = computeLayout(window.innerWidth);
    lv.current.size = layout.size;
    lv.current.gap  = layout.gap;
    lv.current.cols = layout.cols;
    setCfg(layout);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    lv.current.size = cfg.size;
    lv.current.gap  = cfg.gap;
    lv.current.cols = cfg.cols;
    centerGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg, mounted]);

  // ── Event listeners ──────────────────────────────────────────
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
      const layout = computeLayout(window.innerWidth);
      lv.current.z    = 1;
      lv.current.size = layout.size;
      lv.current.gap  = layout.gap;
      lv.current.cols = layout.cols;
      setCfg(layout);
    };

    const onKey = (e: KeyboardEvent) => {
      setSel(cur => {
        if (cur === null) return null;
        if (e.key === "ArrowLeft")  return (cur - 1 + count) % count;
        if (e.key === "ArrowRight") return (cur + 1) % count;
        if (e.key === "Escape")     return null;
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

  const prev = () => setSel(i => i !== null ? (i - 1 + count) % count : null);
  const next = () => setSel(i => i !== null ? (i + 1) % count : null);

  // ── Loading skeleton ─────────────────────────────────────────
  if (!mounted) {
    return (
      <div
        className="relative w-full h-full overflow-hidden bg-canvas flex items-center justify-center"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
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

  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      <div
        ref={wrapRef}
        className="relative w-full h-full overflow-hidden bg-canvas select-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
        }}
      >
        <div
          ref={worldRef}
          className="absolute top-0 left-0"
          style={{ width: L.W, height: L.H }}
        >
          {photos.map((photo, i) => (
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
              <CldImage
                src={photo.src}
                alt={`Photo ${i + 1}`}
                fill
                sizes="(max-width: 600px) 18vw, (max-width: 1024px) 10vw, 7vw"
                format="auto"
                quality="auto"
                crop="fill"
                gravity="auto"
                className="object-cover opacity-0 transition-opacity duration-1000"
                onLoad={(e) => (e.currentTarget as HTMLImageElement).classList.remove("opacity-0")}
              />
            </div>
          ))}
        </div>

        <p className="absolute bottom-5 inset-x-0 text-center font-body text-[10px] text-charcoal/25 tracking-[0.22em] uppercase pointer-events-none">
          Click on an image to open
        </p>
      </div>

      <Lightbox images={photos} sel={sel} setSel={setSel} />
    </>
  );
}
