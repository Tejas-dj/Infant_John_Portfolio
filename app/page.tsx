import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";

export const metadata: Metadata = {
  title: "Infant John A — Videographer & Photographer",
  description:
    "Premium portfolio of Infant John A. Light, story, and precision — delivered with heart.",
  openGraph: {
    title: "Infant John A — Videographer & Photographer",
    description: "Light, story, and precision — delivered with heart.",
    url: "/",
  },
  twitter: {
    title: "Infant John A — Videographer & Photographer",
    description: "Light, story, and precision — delivered with heart.",
  },
};

export default function Home() {
  return <HomeClient />;
}
