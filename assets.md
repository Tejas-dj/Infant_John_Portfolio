# Asset Manifest – Infant John A Portfolio

All assets live in `/public/`. Drop each file at the listed path and it will be automatically picked up by the site.

---

## Home (`/`)

| Asset | Path | Notes |
|---|---|---|
| Hero background video | `/public/videos/hero-bg.mp4` | Autoplay, muted, loop. Fallback: `hero-bg.jpg` |
| Hero background image | `/public/images/hero-bg.jpg` | Used if video not available |
| About portrait | `/public/images/about.jpg` | Warm, candid — 4:5 ratio preferred |
| Curated card 1 | `/public/images/curated-1.jpg` | Portrait / still |
| Curated card 2 | `/public/images/curated-2.jpg` | Automotive / still |
| Curated card 3 | `/public/images/curated-3.jpg` | Brand reel thumbnail (video card) |
| Curated card 4 | `/public/images/curated-4.jpg` | Event |
| Curated card 5 | `/public/images/curated-5.jpg` | Commercial |
| Curated card 6 | `/public/images/curated-6.jpg` | Cinematic video thumbnail |
| Curated card 7 | `/public/images/curated-7.jpg` | Lifestyle |
| Curated card 8 | `/public/images/curated-8.jpg` | Product |

---

## Photography (`/photography`)

### Honeycomb Hero Grid

| Asset | Path |
|---|---|
| photo-01.jpg … photo-24.jpg | `/public/images/photography/honeycomb/photo-01.jpg` … `/public/images/photography/honeycomb/photo-24.jpg` |

Square crops work best; they'll be clipped to a circle by the grid.

### Category Gallery

| Category | Folder |
|---|---|
| Brand & Influencer | `/public/images/photography/brand/` |
| Automotive | `/public/images/photography/automotive/` |
| Events | `/public/images/photography/events/` |
| Lifestyle & Portraits | `/public/images/photography/lifestyle/` |
| Commercial & Product | `/public/images/photography/commercial/` |

Files in those folders: `photo-01.jpg`, `photo-02.jpg`, … (no limit — the gallery will render however many are provided once wired in Phase 2).

---

## Videography (`/videography`)

| Asset | Path | Notes |
|---|---|---|
| Main reel video | `/public/videos/reel.mp4` | Autoplay muted loop for hero |
| Reel thumbnail | `/public/videos/thumbnails/reel-thumbnail.jpg` | Shown before play |
| Video 01 thumbnail | `/public/videos/thumbnails/video-01.jpg` | Brand Identity Reel |
| Video 02 thumbnail | `/public/videos/thumbnails/video-02.jpg` | Automotive Motion Study |
| Video 03 thumbnail | `/public/videos/thumbnails/video-03.jpg` | Annual Gala Highlights |
| Video 04 thumbnail | `/public/videos/thumbnails/video-04.jpg` | Founders Podcast |
| Video 05 thumbnail | `/public/videos/thumbnails/video-05.jpg` | Venue Showcase |
| Video 06 thumbnail | `/public/videos/thumbnails/video-06.jpg` | Product Launch Film |
| Video 07 thumbnail | `/public/videos/thumbnails/video-07.jpg` | Corporate Event |
| Video 08 thumbnail | `/public/videos/thumbnails/video-08.jpg` | Lifestyle Campaign |

For Phase 2, each video card will embed YouTube / Vimeo URLs or self-hosted `.mp4` files. Add the embed URLs to `app/videography/page.tsx` when ready.

---

## Contact (`/contact`)

| Asset | Path | Notes |
|---|---|---|
| Contact hero image | `/public/images/contact-hero.jpg` | Optional ambient background |

---

## Suggested `/public` Folder Structure

```
public/
├── images/
│   ├── about.jpg
│   ├── hero-bg.jpg
│   ├── contact-hero.jpg
│   ├── curated-1.jpg … curated-8.jpg
│   └── photography/
│       ├── honeycomb/
│       │   ├── photo-01.jpg
│       │   └── … photo-24.jpg
│       ├── brand/
│       ├── automotive/
│       ├── events/
│       ├── lifestyle/
│       └── commercial/
└── videos/
    ├── hero-bg.mp4
    ├── reel.mp4
    └── thumbnails/
        ├── reel-thumbnail.jpg
        ├── video-01.jpg
        └── … video-08.jpg
```
