import Link from "next/link";

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth="0" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-canvas border-t border-warm-gray/40 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* CTA block */}
        <div className="text-center mb-14">
          <h2 className="font-heading text-2xl md:text-3xl text-gold font-bold tracking-[0.15em] uppercase mb-4">
            Infant John A
          </h2>
          <p className="font-body text-charcoal/60 text-base md:text-lg max-w-sm mx-auto leading-relaxed">
            Let's create something beautiful together
          </p>
          <Link
            href="/contact"
            className="inline-block mt-7 px-8 py-3 border border-gold text-gold font-body text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-canvas transition-all duration-300"
          >
            Get In Touch
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-warm-gray/40 pt-8">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <a
              href="tel:+91XXXXXXXXXX"
              className="font-body text-sm text-charcoal/50 hover:text-gold transition-colors"
            >
              +91 90606 87887
            </a>
            <span className="hidden sm:block text-warm-gray">·</span>
            <a
              href="mailto:Infantjohn2005@gmail.com"
              className="font-body text-sm text-charcoal/50 hover:text-gold transition-colors"
            >
              Infantjohn2005@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/infant_john.79"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal/40 hover:text-gold transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.behance.net/infantjohn"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm font-bold text-charcoal/40 hover:text-gold transition-colors tracking-wider"
              aria-label="Behance"
            >
              Bē
            </a>
            <a
              href="https://www.youtube.com/@infantjohna"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal/40 hover:text-gold transition-colors"
              aria-label="YouTube"
            >
              <YouTubeIcon />
            </a>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-5">
              <p className="font-body text-xs text-charcoal/35">
                © {year} Infant John A. All rights reserved.
              </p>
              <Link
                href="/privacy-policy"
                className="font-body text-xs text-charcoal/35 hover:text-gold transition-colors duration-300"
              >
                Privacy Policy
              </Link>
            </div>
            <p className="font-body text-[10.5px] text-charcoal/50 tracking-widest uppercase mt-2">
              Made by{" "}
              <a
                href="https://www.linkedin.com/in/tejas-d-jaiprakash/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-charcoal hover:text-gold transition-colors underline decoration-warm-gray hover:decoration-gold underline-offset-4"
              >
                Tejas D Jaiprakash
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
