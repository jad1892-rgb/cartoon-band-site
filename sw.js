// Cartoon Band offline helper (made by tools/make-site.py, build c2235f5). Newest page when online; the last one seen offline.
const V = 'cartoon-band-c2235f5', CORE = ['./', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const key = r.mode === 'navigate' ? './' : r;   // every visit to the page (any ?v= or #) shares one saved copy
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(key, cp)); } return res; })
    .catch(() => caches.match(key, {ignoreSearch: true}).then(m => m || caches.match('./'))));
});
