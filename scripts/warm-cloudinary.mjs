/**
 * Cloudinary cache warm-up (one-off maintenance script).
 *
 * Cloudinary generates each resized version of a photo the first time anyone
 * requests it (~1-2s); afterwards it is served in <0.1s. This script requests
 * every size the site uses once, so visitors never pay for generation.
 *
 * Run from the repo root:
 *   node --env-file=.env.local scripts/warm-cloudinary.mjs [options]
 *
 * Options:
 *   --dry-run                 list photos and print what would be requested; no delivery requests
 *   --only=honeycomb,gallery,lightbox   groups to warm (default: honeycomb,gallery)
 *   --concurrency=N           parallel requests (default: 6)
 *
 * Re-run after uploading new photos (existing versions are already stored).
 * Each newly generated version counts against the Cloudinary plan's
 * transformation quota, so avoid running it needlessly; "lightbox" is the
 * largest group and is opt-in.
 *
 * URLs are built with the same function next-cloudinary's CldImage uses, so
 * the paths match what browsers request. The size/crop settings below mirror
 * HoneycombGrid, FilterableGallery and Lightbox: keep them in sync.
 */
import { createRequire } from 'node:module';
import { v2 as cloudinary } from 'cloudinary';
import { constructCloudinaryUrl } from '@cloudinary-util/url-loader';

const require = createRequire(import.meta.url);

// Same asset folders as app/lib/cloudinary.ts
const ROOT_FOLDER = 'INFANT JOHN A';
const CATEGORY_FOLDERS = ['Auto Mobile', 'Family Events', 'Food', 'Potraits', 'Product', 'Pub and Nightlife', 'Wedding'];

// Lightbox sets no crop, so the library applies its default (c_limit).
const GROUPS = {
  honeycomb: { widths: [128, 256], options: { crop: 'fill', gravity: 'auto', format: 'auto', quality: 50 } },
  gallery: { widths: [256, 384, 640], options: { crop: 'fill', gravity: 'auto', format: 'auto', quality: 'auto' } },
  lightbox: { widths: [1080, 1200, 2048], options: { format: 'auto', quality: 'auto' } },
};

// "format auto" is negotiated from the Accept header; each format is generated separately.
const BROWSER_PROFILES = [
  {
    name: 'chrome',
    headers: {
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    },
  },
  {
    name: 'safari',
    headers: {
      Accept: 'image/webp,image/avif,image/jxl,image/heic,image/heic-sequence,video/*;q=0.8,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15',
    },
  },
];

const SLOW_MS = 500;
const PROGRESS_EVERY = 100;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { dryRun: false, only: ['honeycomb', 'gallery'], concurrency: 6 };
  for (const arg of argv) {
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg.startsWith('--only=')) args.only = arg.slice('--only='.length).split(',').filter(Boolean);
    else if (arg.startsWith('--concurrency=')) args.concurrency = Number(arg.slice('--concurrency='.length));
    else fail(`Unknown option: ${arg}`);
  }
  const unknown = args.only.filter((group) => !(group in GROUPS));
  if (args.only.length === 0 || unknown.length > 0) {
    fail(`Invalid --only (${unknown.join(',') || 'empty'}); valid groups: ${Object.keys(GROUPS).join(', ')}`);
  }
  if (!Number.isInteger(args.concurrency) || args.concurrency < 1) fail('--concurrency must be a positive integer');
  return args;
}

function requireEnv() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    fail('Missing env: need NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (run with --env-file=.env.local)');
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  return cloudName;
}

async function listPublicIds() {
  const ids = [];
  for (const folder of CATEGORY_FOLDERS) {
    let cursor;
    do {
      const result = await cloudinary.api.resources_by_asset_folder(`${ROOT_FOLDER}/${folder}`, {
        resource_type: 'image',
        max_results: 500,
        next_cursor: cursor,
      });
      ids.push(...result.resources.map((resource) => resource.public_id));
      cursor = result.next_cursor;
    } while (cursor);
  }
  return ids;
}

// Same values next-cloudinary passes, so the `_a` token matches what browsers request.
const ANALYTICS = {
  product: 'A',
  sdkCode: 'V',
  sdkSemver: require('next-cloudinary/package.json').version,
  techVersion: require('next/package.json').version,
  feature: '',
};

/** Builds the URL exactly as CldImage does. */
function buildUrl(cloudName, src, width, options) {
  return constructCloudinaryUrl({
    options: { src, width, ...options },
    config: { cloud: { cloudName }, url: {} },
    analytics: ANALYTICS,
  });
}

function planRequests(cloudName, publicIds, groupNames) {
  const requests = [];
  for (const group of groupNames) {
    const { widths, options } = GROUPS[group];
    for (const src of publicIds) {
      for (const width of widths) {
        const url = buildUrl(cloudName, src, width, options);
        for (const profile of BROWSER_PROFILES) requests.push({ group, url, profile });
      }
    }
  }
  return requests;
}

function printDryRun(requests, groupNames, photoCount) {
  console.log(`Dry run: ${photoCount} photos, ${requests.length} requests would be made.`);
  for (const group of groupNames) {
    const inGroup = requests.filter((request) => request.group === group);
    console.log(`\n${group}: ${inGroup.length} requests (widths ${GROUPS[group].widths.join(', ')})`);
    const sampleUrls = [...new Set(inGroup.map((request) => request.url))].slice(0, 2);
    for (const url of sampleUrls) console.log(`  ${url}`);
  }
}

async function fetchOnce({ url, profile }) {
  const started = performance.now();
  try {
    const response = await fetch(url, { headers: profile.headers });
    await response.arrayBuffer(); // drain the body so the socket is freed
    return { status: response.status, ms: performance.now() - started };
  } catch (error) {
    return { status: `network error: ${error.message}`, ms: performance.now() - started };
  }
}

async function warm(requests, concurrency) {
  const startedAt = performance.now();
  const failed = [];
  let next = 0;
  let done = 0;
  let slow = 0;

  async function worker() {
    while (next < requests.length) {
      const request = requests[next++];
      const { status, ms } = await fetchOnce(request);
      if (status !== 200) failed.push({ url: request.url, profile: request.profile.name, status });
      if (ms > SLOW_MS) slow++;
      done++;
      if (done % PROGRESS_EVERY === 0) console.log(`  ${done}/${requests.length} requests done`);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, requests.length) }, worker));

  const seconds = ((performance.now() - startedAt) / 1000).toFixed(1);
  console.log(`\nTotal: ${requests.length}  OK: ${requests.length - failed.length}  Failed: ${failed.length}`);
  console.log(`Slower than ${SLOW_MS}ms (roughly: newly generated): ${slow}`);
  console.log(`Elapsed: ${seconds}s`);
  for (const { url, profile, status } of failed) console.log(`  FAILED [${profile}] ${status} ${url}`);
  return failed.length;
}

const args = parseArgs(process.argv.slice(2));
const cloudName = requireEnv();
const publicIds = await listPublicIds();
const requests = planRequests(cloudName, publicIds, args.only);

if (args.dryRun) {
  printDryRun(requests, args.only, publicIds.length);
} else {
  console.log(`Warming ${publicIds.length} photos: ${requests.length} requests (${args.only.join(', ')}), concurrency ${args.concurrency}`);
  const failures = await warm(requests, args.concurrency);
  if (failures > 0) process.exitCode = 1;
}
