
// sw.js (v3) - cache bust + immediate activation
const SW_VERSION = 'v3';
const CACHE = `outil-duree-${SW_VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest?v=3',
  './bg-pem.jpg',
  './logo-192.png',
  './logo-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req)
        .then(netRes => {
          if (netRes && netRes.status === 200 && netRes.type === 'basic') {
            const copy = netRes.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return netRes;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
