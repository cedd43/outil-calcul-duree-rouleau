
const SW_VERSION='v8';
const CACHE=`outil-duree-${SW_VERSION}`;
const ASSETS=['./','./index.html','./manifest.webmanifest?v=4','./bg-pem.jpg','./logo-192.png','./logo-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return; e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(net=>{if(net&&net.status===200){let clone=net.clone(); caches.open(CACHE).then(c=>c.put(e.request,clone));}return net;}).catch(()=>r)));});
