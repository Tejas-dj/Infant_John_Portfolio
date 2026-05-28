<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — Infant John A Portfolio

> **For any AI agent, coding assistant, or autonomous tool working on this codebase.**
> Read this file in full before writing a single line of code or making any changes.
> Violating these rules will produce broken, off-brand, or legally problematic results.

---

## 1. Project Overview

**Client:** Infant John A — Freelance Videographer & Photographer, India  
**Site URL:** https://infantjohna.com  
**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · GSAP  
**Spec document:** `../Let there be light.MD` — read it for full design intent and feature scope  
**Asset manifest:** `assets.md` — read it before referencing any image or video path  

This is a **personal creative portfolio**. The site showcases photography and videography work and provides contact information. There are **no user accounts, no forms, no database, no server-side API routes** that process personal data.

---

## 2. Absolute Rules — Never Break These

| Rule | Detail |
|------|--------|
| **No dark mode** | The spec explicitly forbids dark mode. Never add it, even if prompted. |
| **Exact colour tokens only** | Use only the CSS variables defined in `globals.css`. No arbitrary hex codes inline. |
| **No placeholder images in production code** | If an image is missing, reference the correct path from `assets.md` and leave a TODO comment. Never use `picsum.photos`, `via.placeholder.com`, or similar. |
| **No new dependencies without justification** | The stack is locked. Do not add npm packages without an explicit reason documented in a comment or PR note. |
| **No contact forms** | The contact page intentionally has no form. Do not add one. Contact is via direct email/phone links only. |
| **No analytics scripts** | Currently no analytics are installed. Do not add Google Analytics, Meta Pixel, Hotjar, or similar without explicit client instruction. This has privacy policy implications. |
| **Mobile-first always** | All layouts must be designed mobile-first and progressively enhanced for desktop. |
| **60 fps mandate** | All animations must target 60 fps. Use `will-change`, `transform`, and `opacity` for GPU-accelerated animations. Never animate `width`, `height`, `top`, `left`, or `margin`. |

---

## 3. Design System

### 3.1 Color Palette

All colours are defined as Tailwind custom tokens. **Never hardcode hex values inline.**

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-canvas` | `#F8F5F0` | Primary background — entire site |
| `text-charcoal` | `#2C2C2C` | Primary body text, headings |
| `text-gold` / `border-gold` / `bg-gold` | `#D9B061` | Accent — headings, CTAs, hover states, scroll indicator. Use **sparingly**. |
| `bg-beige` | `#D9C4A9` | Subtle cards, secondary elements |
| `border-warm-gray` | `#D8D0C5` | Borders, dividers, secondary text |

### 3.2 Typography

| Variable | Font | Weights | Usage |
|----------|------|---------|-------|
| `font-heading` | Cinzel (Google Fonts) | 400, 700 | All headings (h1–h4), logo, large display text |
| `font-body` | Inter (Google Fonts) | 400, 500 | Body copy, navigation, UI labels, captions |

- Line height: minimum `1.7` for body, generous tracking on headings.
- Letter spacing on uppercase labels: `tracking-[0.25em]` to `tracking-[0.35em]`.
- **Never use system fonts** for headings or body; always use the CSS variables above.

### 3.3 Key Spacing & Layout Conventions

- Max content width: `max-w-7xl mx-auto px-6`
- Narrow content (text-heavy): `max-w-3xl mx-auto px-6`
- Section vertical padding: `py-24 md:py-32`
- Navigation height: `72px` (account for this in hero `pt-[72px]`)

---

## 4. Site Architecture

### Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home — hero, about bio, curated glimpse carousel, why-work-with-john |
| `/photography` | `app/photography/page.tsx` | Apple Watch honeycomb grid hero + filterable masonry gallery |
| `/videography` | `app/videography/page.tsx` | Cinematic reel hero + video gallery cards |
| `/contact` | `app/contact/page.tsx` | Direct contact links (email, phone, socials) — no form |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | Legal page — do not remove or alter without legal review |

### Global Layout

`app/layout.tsx` wraps every page with:
- `<NoiseOverlay />` — subtle film-grain texture overlay
- `<ScrollProgress />` — gold progress bar at top of viewport
- `<Navigation />` — sticky top nav
- `<PageTransition />` — fade+scale route transitions
- `<Footer />` — site-wide footer with CTA, socials, copyright, privacy link

### Components Directory: `app/components/`

| Component | Purpose |
|-----------|---------|
| `Navigation.tsx` | Sticky nav with mobile hamburger slide-in |
| `Footer.tsx` | Global footer — CTA, contact links, socials, copyright, privacy policy link |
| `HoneycombGrid.tsx` | Apple Watch-style magnetic honeycomb grid for photography hero |
| `FilterableGallery.tsx` | Filterable masonry gallery with category tabs (photography) |
| `VideoGallery.tsx` | Video card grid with embedded player lightbox (videography) |
| `VideographyHero.tsx` | Autoplay muted cinematic reel hero |
| `HomeHero.tsx` | Full-bleed hero with name, tagline, gold CTAs |
| `HomeClient.tsx` | Client-side home page interactions and carousel |
| `Lightbox.tsx` | Full-screen image lightbox with swipe nav |
| `MagneticButton.tsx` | Reusable magnetic hover effect wrapper |
| `FadeIn.tsx` | Scroll-triggered fade-in animation wrapper |
| `PageTransition.tsx` | Route transition animation (Framer Motion) |
| `ScrollProgress.tsx` | Gold scroll progress indicator bar |
| `NoiseOverlay.tsx` | CSS film-grain noise texture overlay |
| `ContactForm.tsx` | **DEPRECATED — do not use.** Contact is direct links only. |

---

## 5. Asset Conventions

- **All assets live in `/public/`** — see `assets.md` for the complete, canonical manifest.
- **Image paths in code must exactly match `assets.md`** — e.g., `/images/photography/honeycomb/photo-01.jpg`.
- **No assets are currently uploaded.** The client will add them after the build. Do not break the site if assets are missing — use graceful fallbacks (empty `alt`, `onError` handlers, etc.).
- Photography honeycomb: 24 images, square crops, clipped to circle by CSS. Paths: `/images/photography/honeycomb/photo-01.jpg` … `photo-24.jpg`.
- `og-image.jpg` must be placed at `/public/og-image.jpg` (1200×630px, JPEG) for social sharing cards.
- `apple-touch-icon.png` should be placed at `/public/apple-touch-icon.png` (180×180px) for iOS.

---

## 6. SEO Configuration

### Global metadata (`app/layout.tsx`)
- `metadataBase`: `https://infantjohna.com`
- Default title: `"Infant John A — Videographer & Photographer"`
- Title template: `"%s — Infant John A"`
- Open Graph image: `/og-image.jpg` (1200×630)

### Per-page metadata
Every page exports its own `metadata` object. When adding or editing pages:
- Set a unique, descriptive `title` (the template appends "— Infant John A" automatically).
- Write a meaningful `description` (150–160 characters, include relevant keywords).
- Include `openGraph.url` matching the route.
- The privacy policy page sets `robots: { index: false, follow: false }` — do not change this.

### Sitemap & robots
- `public/sitemap.xml` — lists all 5 routes. **Update `lastmod` and add new routes** whenever a new page is added.
- `public/robots.txt` — allows Google/Bing/Apple/Pinterest. Blocks GPTBot, CCBot, ClaudeBot, Bytespider, and other AI training crawlers. Do not remove bot blocks without client approval.

---

## 7. Performance Standards

- Use `next/image` (`<Image />`) for all images — never bare `<img>` tags. This enables automatic WebP conversion, lazy loading, and responsive srcsets.
- Use `next/font` for fonts (already configured in `layout.tsx`). Never load fonts via `<link>` tags or CDN URLs in JSX.
- All videos must have `autoPlay muted loop playsInline` attributes. Never autoplay with sound.
- Lazy load below-the-fold components using `next/dynamic` with `{ ssr: false }` for heavy client components.
- Target Lighthouse scores: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100.

---

## 8. Accessibility Requirements

- Every `<img>` and `<Image>` must have a meaningful `alt` attribute.
- All interactive elements (buttons, links) must be keyboard-navigable and have visible focus states.
- Decorative icons use `aria-hidden="true"`.
- Interactive icons without visible labels use `aria-label="..."`.
- Respect `prefers-reduced-motion`: wrap all non-essential animations with a check:
  ```tsx
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  ```
- Colour contrast must meet WCAG AA minimum (4.5:1 for body text, 3:1 for large text).

---

## 9. Animation Guidelines (Framer Motion + GSAP)

- **Framer Motion** — preferred for component-level animations (enter/exit, hover, scroll reveals).
- **GSAP** — preferred for timeline-based, physics, or complex scroll-trigger animations (e.g., the honeycomb magnetic grid).
- All `motion` components on the client side must be in files marked `"use client"`.
- Default easing: `[0.25, 0.46, 0.45, 0.94]` (smooth ease-out). Never use linear easing for UI animations.
- Page transitions: fade + subtle scale (0.98 → 1.0). Duration: 0.4s.

---

## 10. Legal & Privacy

- The site displays a public email address and phone number. **Do not obfuscate these** — they are intentionally accessible for client contact.
- `app/privacy-policy/page.tsx` is the live legal document. **Do not delete, move, or substantially alter this file** without explicit client and legal review.
- `public/robots.txt` blocks AI training scrapers. This is intentional. **Do not remove the bot blocks.**
- The site currently has no analytics, so GDPR/DPDPA obligations are minimal. If analytics are ever added, the Privacy Policy must be updated before deployment.
- The site is subject to **India's Digital Personal Data Protection Act (DPDPA) 2023** and potentially **GDPR** (EU visitors). Keep data collection to the absolute minimum.

---

## 11. Git & Code Quality

- Run `npm run build` before any PR — zero TypeScript errors, zero ESLint errors.
- Component files: PascalCase (e.g., `MagneticButton.tsx`).
- Utility/hook files: camelCase (e.g., `useScrollProgress.ts`).
- No `console.log` in production code.
- No `any` TypeScript type — use proper types or `unknown`.
- Imports: group by (1) Node/Next built-ins, (2) third-party libs, (3) internal components, (4) types.

---

*This document is maintained alongside the codebase. If you add a new component, route, or major feature, update the relevant section above.*
