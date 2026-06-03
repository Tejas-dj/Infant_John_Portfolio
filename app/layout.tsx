import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import NoiseOverlay from "./components/NoiseOverlay";
import LightboxPreloader from "./components/LightboxPreloader";
import { getAllPhotos } from "./lib/cloudinary";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://infantjohna.com"),
  title: {
    default: "Infant John A — Videographer & Photographer",
    template: "%s — Infant John A",
  },
  description:
    "Premium portfolio of Infant John A. Light, story, and precision — delivered with heart.",
  openGraph: {
    siteName: "Infant John A",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Infant John A — Videographer & Photographer" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const photos = await getAllPhotos();

  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-canvas text-charcoal">
        <NoiseOverlay />
        <ScrollProgress />
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <LightboxPreloader srcs={photos.map((p) => p.src)} />
      </body>
    </html>
  );
}
