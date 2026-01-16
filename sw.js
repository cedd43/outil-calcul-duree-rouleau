
// sw.js  (v3)
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

// Permet au SW de passer immédiatement en mode "activate" si on le demande
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) // active vite la nouvelle version
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE)  // supprime tous les anciens caches
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim()) // prend la main sur toutes les pages
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Cache-first avec mise à jour silencieuse pour les ressources
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req)
       
