import { v2 as cloudinary } from 'cloudinary';
import { unstable_cache } from 'next/cache';
import type { Photo } from '../data/photography';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Returns false when any required Cloudinary env var is missing. */
function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
  );
}

// Everything lives under one top-level asset folder in the Cloudinary account
const ROOT_FOLDER = 'INFANT JOHN A';

function assetFolder(name: string): string {
  return `${ROOT_FOLDER}/${name}`;
}

// Photography category folders — the folder name is also the display label,
// unless overridden in CATEGORY_LABELS
const CATEGORY_FOLDERS = [
  'Auto Mobile',
  'Family Events',
  'Food',
  'Potraits',
  'Product',
  'Pub and Nightlife',
  'Wedding',
];

// Folders whose title on the site differs from their Cloudinary folder name
const CATEGORY_LABELS: Record<string, string> = {
  Product: 'Jewellery',
};

function getOrientation(width: number, height: number): Photo['orientation'] {
  const ratio = width / height;
  if (ratio > 1.2) return 'landscape';
  if (ratio < 0.85) return 'portrait';
  return 'square';
}

async function fetchFolder(folder: string): Promise<Omit<Photo, 'id'>[]> {
  const result = await cloudinary.api.resources_by_asset_folder(assetFolder(folder), {
    resource_type: 'image',
    max_results: 500,
  });
  const category = CATEGORY_LABELS[folder] ?? folder;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.resources.map((r: any, i: number) => ({
    src: r.public_id as string,
    tint: `hsl(${28 + (i * 11) % 28},${18 + (i * 5) % 26}%,${72 + (i * 4) % 18}%)`,
    category,
    orientation: getOrientation(r.width as number, r.height as number),
    filename: (r.display_name as string) || (r.public_id as string).split('/').pop() || '',
    width: r.width as number,
    height: r.height as number,
  }));
}

export const getAllPhotos = unstable_cache(
  async (): Promise<Photo[]> => {
    if (!isCloudinaryConfigured()) return [];
    const results = await Promise.all(CATEGORY_FOLDERS.map(fetchFolder));
    const flat = results.flat();
    // Shuffle so categories are mixed in the honeycomb grid
    for (let i = flat.length - 1; i > 0; i--) {
      const j = (i * 2654435761) % (i + 1);
      [flat[i], flat[j]] = [flat[j], flat[i]];
    }
    // Bias portraits toward the middle of the array (center of grid)
    const portraits = flat.filter(p => p.category === 'Potraits');
    const others = flat.filter(p => p.category !== 'Potraits');
    const total = flat.length;
    const mid = Math.floor(total / 2);
    const spread = Math.floor(total * 0.3);
    const merged: typeof flat = [...others];
    for (let i = 0; i < portraits.length; i++) {
      const offset = Math.floor((i * 2654435761 >>> 0) % (spread * 2)) - spread;
      const pos = Math.max(0, Math.min(merged.length, mid + offset));
      merged.splice(pos, 0, portraits[i]);
    }
    return merged.map((photo, i) => ({ ...photo, id: i + 1 }));
  },
  ['cloudinary-all-photos-v5'],
  { revalidate: 3600 }
);

// Returns Home_Page folder public IDs sorted by the sequence number in the display name
export const getHomepagePhotos = unstable_cache(
  async (): Promise<string[]> => {
    if (!isCloudinaryConfigured()) return [];
    const result = await cloudinary.api.resources_by_asset_folder(assetFolder('Home_Page'), {
      resource_type: 'image',
      max_results: 50,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resources: any[] = result.resources;
    resources.sort((a, b) => {
      const numA = parseInt((a.display_name as string).match(/\d+/)?.[0] ?? '0', 10);
      const numB = parseInt((b.display_name as string).match(/\d+/)?.[0] ?? '0', 10);
      return numA - numB;
    });
    return resources.map((r) => r.public_id as string);
  },
  ['cloudinary-homepage-photos-v2'],
  { revalidate: 3600 }
);

// Returns the public ID of the About-section portrait (first image in the Headshot folder)
export const getHeadshot = unstable_cache(
  async (): Promise<string | null> => {
    if (!isCloudinaryConfigured()) return null;
    const result = await cloudinary.api.resources_by_asset_folder(assetFolder('Headshot'), {
      resource_type: 'image',
      max_results: 1,
    });
    return (result.resources[0]?.public_id as string | undefined) ?? null;
  },
  ['cloudinary-headshot-v1'],
  { revalidate: 3600 }
);

// Returns a map of display_name → public_id for images in the optional Thumbnails folder.
// Videos without a match fall back to their YouTube thumbnail.
export const getVideoThumbnails = unstable_cache(
  async (): Promise<Record<string, string>> => {
    if (!isCloudinaryConfigured()) return {};
    try {
      const result = await cloudinary.api.resources_by_asset_folder(assetFolder('Thumbnails'), {
        resource_type: 'image',
        max_results: 100,
      });
      const map: Record<string, string> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const r of result.resources as any[]) {
        const displayName = (r.display_name as string) || (r.public_id as string).split('/').pop() || '';
        map[displayName] = r.public_id as string;
      }
      return map;
    } catch {
      // Folder not created yet
      return {};
    }
  },
  ['cloudinary-video-thumbnails-v2'],
  { revalidate: 3600 }
);
