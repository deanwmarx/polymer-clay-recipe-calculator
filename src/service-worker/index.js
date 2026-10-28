import { version } from '$app/env';
import { assets, immutable, prerendered } from '$app/manifest';
import { resolve } from '$app/paths';

const worker = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));
// Keep cache ownership scoped to this app on the shared GitHub Pages origin.
const HOME = resolve('/');
const CACHE_PREFIX = `clay-colour:${HOME.replace(/\/$/, '')}:`;
const CACHE = `${CACHE_PREFIX}${version}`;
const ASSETS = new Set([
  ...[...immutable, ...assets, ...prerendered].map(({ path }) =>
    new URL(path, worker.registration.scope).pathname),
  HOME
]);

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
