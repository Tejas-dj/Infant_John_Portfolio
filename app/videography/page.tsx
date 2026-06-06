import type { Metadata } from "next";
import VideoGallery from "../components/VideoGallery";
import VideographyHero from "../components/VideographyHero";
import { getVideoThumbnails } from "../lib/cloudinary";

export const metadata: Metadata = {
  title: "Videography",
  description: "Motion that moves people. Watch the video portfolio of Infant John A.",
  openGraph: {
    title: "Videography — Infant John A",
    description: "Motion that moves people.",
    url: "/videography",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Videography — Infant John A",
    description: "Motion that moves people.",
    images: ["/og-image.jpg"],
  },
};

export default async function VideographyPage() {
  const thumbnails = await getVideoThumbnails();
  return (
    <>
      <VideographyHero />
      <VideoGallery thumbnails={thumbnails} />
    </>
  );
}

