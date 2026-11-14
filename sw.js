// ServiVie Chansons — cache de l'interface pour un lancement rapide
const C = 'svc-v1';
const FICHIERS = ['./', './index.html', './manifest.json', './icon.svg', './lame.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FICHIERS))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // API et audio : toujours en direct
  e.respondWith(fetch(e.request).then(r => { const copie = r.clone(); caches.open(C).then(c => c.put(e.request, copie)); return r; })
    .catch(() => caches.match(e.request)));
});
