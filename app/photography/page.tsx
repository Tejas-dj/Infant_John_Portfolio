import type { Metadata } from "next";
import HoneycombGrid from "../components/HoneycombGrid";
import FilterableGallery from "../components/FilterableGallery";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "A visual journey through light and story. Browse the photography portfolio of Infant John A.",
  openGraph: {
    title: "Photography — Infant John A",
    description: "A visual journey through light and story.",
    url: "/photography",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photography — Infant John A",
    description: "A visual journey through light and story.",
    images: ["/og-image.jpg"],
  },
};

export default function PhotographyPage() {
  return (
    <>
      {/* ── Hero: Apple Watch Honeycomb Grid ── */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-canvas flex flex-col items-center justify-center pt-[72px]">
        {/* Honeycomb Background */}
        <div className="absolute inset-0 w-full h-full">
          <HoneycombGrid />
        </div>

        {/* Floating Header */}
        <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center px-6 w-full h-full mix-blend-difference">
          <div className="text-center transform transition-transform duration-1000">
            <span className="font-body text-white/90 text-xs md:text-sm tracking-[0.5em] uppercase mb-4 block">
              The Collection
            </span>
            <h1 className="font-heading text-[11vw] sm:text-7xl md:text-[8rem] lg:text-[10rem] xl:text-[12rem] text-white font-bold leading-none tracking-tighter">
              Photography
            </h1>
          </div>
        </div>
      </section>

      {/* ── Filterable Gallery ── */}
      <FilterableGallery />
    </>
  );
}
