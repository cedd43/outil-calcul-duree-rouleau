
const CACHE = "outil-duree-v3";
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "bg-pem.jpg",
  "logo-192.png",
  "logo-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then(res =>
      res ||
      fetch(e.request).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return r;
      })
    )
  );
});

