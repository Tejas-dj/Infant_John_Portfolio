import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Infant John A for your next photography or videography project.",
  openGraph: {
    title: "Contact — Infant John A",
    description: "Get in touch for your next photography or videography project.",
    url: "/contact",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Infant John A",
    description: "Get in touch for your next photography or videography project.",
    images: ["/og-image.jpg"],
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-24 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        <span className="font-body text-gold text-xs tracking-[0.35em] uppercase mb-6 block">Let's Connect</span>
        <h1 className="font-heading text-5xl md:text-7xl text-charcoal font-bold mb-8 leading-tight">
          Start Something<br />Extraordinary
        </h1>
        <p className="font-body text-charcoal/60 text-lg max-w-2xl mx-auto leading-relaxed mb-16">
          Whether you have a clear vision or just the beginning of an idea, I'd love to hear about it. I typically respond within 24 hours.
        </p>

        {/* Primary Contact: Massive Email Link */}
        <a
          href="mailto:Infantjohn2005@gmail.com"
          className="group relative inline-block mb-20"
        >
          <span className="font-heading text-3xl md:text-5xl lg:text-6xl text-charcoal group-hover:text-gold transition-colors duration-500 ease-out">
            Infantjohn2005@gmail.com
          </span>
          <div className="h-[2px] w-full bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left mt-2"></div>
        </a>

        {/* Secondary Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full border-t border-b border-warm-gray/30 py-12">
          {[
            { label: "Phone", value: "+91 90606 87887", href: "tel:+91XXXXXXXXXX" },
            { label: "Instagram", value: "@infant_john.79", href: "https://www.instagram.com/infant_john.79" },
            { label: "Behance", value: "INFANT JOHN A", href: "https://www.behance.net/infantjohn" },
            { label: "YouTube", value: "@infantjohna", href: "https://www.youtube.com/@infantjohna" },
          ].map(({ label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex flex-col items-center gap-2 group"
            >
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 group-hover:text-gold transition-colors duration-300">
                {label}
              </span>
              <span className="font-body text-base md:text-lg text-charcoal group-hover:-translate-y-1 transition-transform duration-300 ease-out">
                {value}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-24 text-center">
          <p className="font-heading text-xl md:text-2xl text-charcoal/40 italic">
            "Not hiring Infant John A would be a genuine loss."
          </p>
        </div>
      </section>
    </>
  );
}
