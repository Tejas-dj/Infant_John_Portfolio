# ✨ Infant John A — Portfolio Website

> *Light, story, and precision — delivered with heart.*

A cinematic, immersive personal portfolio for **Infant John A** — freelance videographer and photographer based in India. Built to feel less like a website and more like a short film: luxurious, emotionally intelligent, and delightful to explore.

🌐 **Live site:** [infantjohna.com](https://infantjohna.com)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS with custom design tokens |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) |
| **Typography** | Cinzel (headings) + Inter (body) via `next/font` |
| **Hosting** | [Vercel](https://vercel.com) |

---

## 🎨 Design System

### Colour Palette

| Token | Hex | Role |
|---|---|---|
| `canvas` | `#F8F5F0` | Primary background — entire site |
| `charcoal` | `#2C2C2C` | Primary text |
| `gold` | `#D9B061` | Accent — CTAs, hover states, headings (used sparingly) |
| `beige` | `#D9C4A9` | Cards, secondary elements |
| `warm-gray` | `#D8D0C5` | Borders, dividers |

### Typography

| Variable | Font | Usage |
|---|---|---|
| `font-heading` | Cinzel | All headings, logo, display text |
| `font-body` | Inter | Body copy, navigation, UI labels |

---

## 🗺️ Site Map

```
https://infantjohna.com
│
├── /                     → Home
│   ├── Hero (name + tagline + gold CTAs)
│   ├── About John (bio)
│   ├── Curated Glimpse (carousel)
│   └── Why Work With John (3-column)
│
├── /photography          → Photography Portfolio
│   ├── Apple Watch Honeycomb Grid (magnetic, pannable, zoomable)
│   └── Filterable Masonry Gallery
│       ├── Brand & Influencer
│       ├── Automotive
│       ├── Events
│       ├── Lifestyle & Portraits
│       └── Commercial & Product
│
├── /videography          → Videography Portfolio
│   ├── Cinematic Reel Hero (autoplay, muted)
│   └── Video Gallery Cards
│       ├── Brand Reels & Commercials
│       ├── Automotive Motion
│       ├── Event Highlights
│       ├── Podcast & Interviews
│       └── Venue & Interiors
│
├── /contact              → Contact
│   ├── Large email CTA link
│   └── Phone · Instagram · Behance · YouTube
│
└── /privacy-policy       → Privacy Policy (legal)
```

---

## 📁 Folder Structure

```
portfolio/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — nav, footer, transitions
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles + Tailwind base
│   ├── favicon.ico
│   │
│   ├── photography/
│   │   └── page.tsx              # Photography page
│   │
│   ├── videography/
│   │   └── page.tsx              # Videography page
│   │
│   ├── contact/
│   │   └── page.tsx              # Contact page
│   │
│   ├── privacy-policy/
│   │   └── page.tsx              # Privacy Policy (legal)
│   │
│   ├── data/                     # Static data files (gallery items, etc.)
│   │
│   └── components/               # Shared React components
│       ├── Navigation.tsx         # Sticky nav + mobile hamburger
│       ├── Footer.tsx             # Global footer
│       ├── HoneycombGrid.tsx      # Apple Watch-style magnetic photo grid
│       ├── FilterableGallery.tsx  # Filterable masonry gallery
│       ├── VideoGallery.tsx       # Video card grid + embedded player
│       ├── VideographyHero.tsx    # Autoplay reel hero
│       ├── HomeHero.tsx           # Home page hero section
│       ├── HomeClient.tsx         # Home page client interactions + carousel
│       ├── Lightbox.tsx           # Full-screen image lightbox
│       ├── MagneticButton.tsx     # Reusable magnetic hover wrapper
│       ├── FadeIn.tsx             # Scroll-triggered fade-in wrapper
│       ├── PageTransition.tsx     # Route transition (Framer Motion)
│       ├── ScrollProgress.tsx     # Gold scroll progress bar
│       └── NoiseOverlay.tsx       # Film-grain texture overlay
│
├── public/                        # Static assets (served at root URL)
│   ├── robots.txt                 # Crawler rules (see SEO section)
│   ├── sitemap.xml                # XML sitemap for search engines
│   ├── og-image.jpg               # ⚠️ NEEDS UPLOAD — 1200×630px social card
│   ├── apple-touch-icon.png       # ⚠️ NEEDS UPLOAD — 180×180px iOS icon
│   │
│   ├── images/                    # ⚠️ All images need uploading
│   │   ├── about.jpg
│   │   ├── hero-bg.jpg
│   │   ├── contact-hero.jpg
│   │   ├── curated-1.jpg … curated-8.jpg
│   │   └── photography/
│   │       ├── honeycomb/         # photo-01.jpg … photo-24.jpg (square crops)
│   │       ├── brand/
│   │       ├── automotive/
│   │       ├── events/
│   │       ├── lifestyle/
│   │       └── commercial/
│   │
│   └── videos/                    # ⚠️ All videos need uploading
│       ├── hero-bg.mp4
│       ├── reel.mp4
│       └── thumbnails/
│           ├── reel-thumbnail.jpg
│           └── video-01.jpg … video-08.jpg
│
├── AGENTS.md                      # AI agent rules & codebase guide
├── assets.md                      # Complete asset manifest & upload guide
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

> 📋 See [`assets.md`](./assets.md) for the complete asset manifest with exact file paths and specifications.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18.17` or later
- npm (bundled with Node.js)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The site hot-reloads automatically on file save.

### Other Commands

```bash
npm run build       # Production build (run before deploying)
npm run start       # Serve the production build locally
npm run lint        # Run ESLint
```

> ⚠️ Always run `npm run build` before pushing to ensure zero TypeScript and ESLint errors.

---

## 🖼️ Adding Assets

All real images and videos need to be placed in the `/public/` directory. The site code already references the correct paths — just drop the files in and the site picks them up automatically.

**Priority uploads:**

| File | Path | Why |
|---|---|---|
| Social card | `/public/og-image.jpg` | WhatsApp / Twitter / LinkedIn preview image |
| iOS icon | `/public/apple-touch-icon.png` | iOS homescreen bookmark |
| Hero video | `/public/videos/hero-bg.mp4` | Home page hero background |
| About portrait | `/public/images/about.jpg` | About section on home page |
| Honeycomb photos | `/public/images/photography/honeycomb/photo-01.jpg` … `photo-24.jpg` | Photography page grid |

See [`assets.md`](./assets.md) for the full list.

---

## 🔍 SEO & Crawlers

### robots.txt

Located at [`public/robots.txt`](./public/robots.txt).

- ✅ **Allows:** Googlebot, Bingbot, Applebot, Pinterest, Googlebot-Image
- 🚫 **Blocks:** GPTBot, CCBot, ClaudeBot, Bytespider (TikTok), FacebookBot, and other AI training crawlers — protecting John's original creative work

### sitemap.xml

Located at [`public/sitemap.xml`](./public/sitemap.xml).

- Lists all 5 routes with correct priority, `lastmod`, and `changefreq` values
- **Submit to Google Search Console** after first deployment: `https://infantjohna.com/sitemap.xml`

### Per-Page Metadata

Every page exports its own `metadata` object (title, description, Open Graph, Twitter card). The root layout in `app/layout.tsx` sets the global base URL and title template.

---

## ⚖️ Legal

### Privacy Policy

A full privacy policy is live at [`/privacy-policy`](https://infantjohna.com/privacy-policy), covering:
- No direct data collection (no forms, no accounts)
- Passive server/hosting logs (Vercel infrastructure)
- Third-party embeds (YouTube, Vimeo, Google Fonts, Instagram, Behance)
- User rights under GDPR and India's DPDPA 2023

> If analytics are ever added to this site, the Privacy Policy **must be updated** before deployment.

---

## 🤖 For AI Agents & Contributors

Read [`AGENTS.md`](./AGENTS.md) before writing any code. It contains:
- Absolute rules (no dark mode, no forms, exact colour tokens only)
- Full design system reference
- Component inventory
- Animation standards (60 fps mandate)
- Accessibility requirements
- Legal constraints

---

## 📦 Deployment

This project is optimised for **Vercel** (zero-config deployment).

```bash
# Option A — Vercel CLI
npm i -g vercel
vercel

# Option B — GitHub Integration
# Connect the repo on vercel.com → automatic deploys on every push to main
```

The repository root (`portfolio/`) contains `package.json` and `next.config.ts` at the top level — point Vercel's root directory to this folder.

---

## 📸 Credits

**Design, Photography & Videography** — Infant John A  
**Development** — Built with Next.js 15, Tailwind CSS, Framer Motion & GSAP

---

*© 2026 Infant John A. All rights reserved.*
