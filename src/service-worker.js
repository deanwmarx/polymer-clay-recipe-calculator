/// <reference lib="webworker" />
import { base, build, files, prerendered, version } from '$service-worker';

const worker = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));
// Keep cache ownership scoped to this app on the shared GitHub Pages origin.
const CACHE_PREFIX = `clay-colour:${base}:`;
const CACHE = `${CACHE_PREFIX}${version}`;
const HOME = `${base}/`;
const ASSETS = new Set([...build, ...files, ...prerendered, HOME]);

worker.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([...ASSETS])));
});

worker.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(CACHE_PREFIX) && key !== CACHE) await caches.delete(key);
    }
    await worker.clients.claim();
  })());
});

worker.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== worker.location.origin || !url.pathname.startsWith(HOME)) return;

  // Navigations use fresh HTML when online, with the installed app as fallback.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await fetch(request);
      } catch {
        return (await caches.open(CACHE)).match(HOME).then((response) =>
          response ?? new Response('Polymer Clay Recipe Calculator could not load. Please check your connection and try again.', { status: 503 }),
        );
      }
    })());
  } else if (ASSETS.has(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      return (await cache.match(url.pathname)) ?? fetch(request);
    })());
  }
});
