import { unstable_cache } from 'next/cache';

export interface BunnyVideo {
  guid: string;
  title: string;
  description: string;
  /** Name of the Bunny collection the video sits in — empty when it is in none */
  category: string;
  orientation: 'landscape' | 'portrait';
  /** Runtime in seconds */
  duration: number;
  embedUrl: string;
  thumbUrl: string;
}

interface BunnyApiVideo {
  guid: string;
  title: string;
  description: string | null;
  status: number;
  length: number;
  width: number;
  height: number;
  collectionId: string | null;
  thumbnailFileName: string | null;
}

interface BunnyApiCollection {
  guid: string;
  name: string | null;
}

interface BunnyApiList<T> {
  totalItems: number;
  items: T[];
}

const API_BASE = 'https://video.bunnycdn.com/library';
const EMBED_BASE = 'https://iframe.mediadelivery.net/embed';
const PAGE_SIZE = 100;
// Bunny's status code for a video that has finished encoding and is playable
const STATUS_FINISHED = 4;

/** Returns false when any required Bunny Stream env var is missing. */
function isBunnyConfigured(): boolean {
  return Boolean(
    process.env.BUNNY_STREAM_LIBRARY_ID &&
    process.env.BUNNY_STREAM_CDN_HOSTNAME &&
    process.env.BUNNY_STREAM_API_KEY,
  );
}

async function fetchAll<T>(resource: 'videos' | 'collections'): Promise<T[]> {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const items: T[] = [];

  for (let page = 1; ; page++) {
    const res = await fetch(
      `${API_BASE}/${libraryId}/${resource}?page=${page}&itemsPerPage=${PAGE_SIZE}&orderBy=date`,
      {
        headers: {
          AccessKey: process.env.BUNNY_STREAM_API_KEY ?? '',
          accept: 'application/json',
        },
      },
    );
    if (!res.ok) throw new Error(`Bunny Stream ${resource} request failed: ${res.status}`);

    const data = (await res.json()) as BunnyApiList<T>;
    items.push(...data.items);
    if (data.items.length === 0 || items.length >= data.totalItems) break;
  }

  return items;
}

// "HOSKOTE BIRIYANI.mov" → "HOSKOTE BIRIYANI"
function cleanTitle(title: string): string {
  return title.replace(/\.[a-z0-9]{2,4}$/i, '').trim();
}

const fetchBunnyVideos = unstable_cache(
  async (): Promise<BunnyVideo[]> => {
    const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
    const hostname = process.env.BUNNY_STREAM_CDN_HOSTNAME;

    const [videos, collections] = await Promise.all([
      fetchAll<BunnyApiVideo>('videos'),
      fetchAll<BunnyApiCollection>('collections'),
    ]);
    const collectionNames = new Map(collections.map((c) => [c.guid, c.name ?? '']));

    return videos
      .filter((v) => v.status === STATUS_FINISHED)
      .map((v) => ({
        guid: v.guid,
        title: cleanTitle(v.title),
        description: v.description ?? '',
        category: (v.collectionId && collectionNames.get(v.collectionId)) || '',
        orientation: v.height > v.width ? 'portrait' : 'landscape',
        duration: Math.round(v.length),
        embedUrl: `${EMBED_BASE}/${libraryId}/${v.guid}`,
        thumbUrl: `https://${hostname}/${v.guid}/${v.thumbnailFileName || 'thumbnail.jpg'}`,
      }));
  },
  ['bunny-stream-videos-v2'],
  { revalidate: 3600 }
);

// Every finished video in the Bunny Stream library, newest first.
// A failed request is not cached, so the page recovers on the next render.
export async function getBunnyVideos(): Promise<BunnyVideo[]> {
  if (!isBunnyConfigured()) return [];
  try {
    return await fetchBunnyVideos();
  } catch {
    return [];
  }
}
