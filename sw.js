const CACHE_NAME = 'outil-duree-v1.0';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './bg-pem.jpg',
  './logo-192.png',
  './logo-512.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(res => res || fetch(req).then(netRes => {
      const copy = netRes.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
      return netRes;
    }).catch(() => caches.match('./index.html')))
  );
});
