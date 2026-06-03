import type { Metadata } from "next";
import HoneycombGrid from "../components/HoneycombGrid";
import FilterableGallery from "../components/FilterableGallery";
import { getAllPhotos } from "../lib/cloudinary";

export const revalidate = 3600;

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

export default async function PhotographyPage() {
  const photos = await getAllPhotos();

  return (
    <>
      {/* ── Hero: Apple Watch Honeycomb Grid ── */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-canvas pt-[72px]">
        <div className="absolute inset-0 w-full h-full">
          <HoneycombGrid photos={photos} />
        </div>

        {/* Top gradient for navbar legibility */}
        <div
          className="absolute top-0 left-0 right-0 z-[5] h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-canvas) 0%, color-mix(in srgb, var(--color-canvas) 60%, transparent) 50%, transparent 100%)",
          }}
        />

        {/* Centered frosted title */}
        <div className="relative z-10 pointer-events-none flex items-center justify-center w-full h-full">
          <div className="text-center bg-canvas/30 backdrop-blur-md rounded-xl px-6 py-3 md:px-8 md:py-4 border border-warm-gray/20">
            <span className="font-body text-gold text-[8px] md:text-[10px] tracking-[0.4em] uppercase block mb-0.5">
              The Collection
            </span>
            <h1 className="font-heading text-lg sm:text-xl md:text-2xl lg:text-3xl text-charcoal font-bold leading-none tracking-tight">
              Photography
            </h1>
          </div>
        </div>
      </section>

      {/* ── Filterable Gallery ── */}
      <FilterableGallery photos={photos} />
    </>
  );
}
