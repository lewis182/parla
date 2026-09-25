/* Parla — offline support. Network first (so you always get the latest version when
   online), falling back to the cached copy when there's no signal. API calls are never cached. */
const CACHE = "parla-v1";
const SHELL = [
  "./", "index.html", "parla.css", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png",
  "exercises.js", "js/topics.js", "js/api.js", "js/core.js", "js/tutor.js", "js/recorder.js",
  "js/ui.js", "js/progress.js", "js/conjugate.js", "js/boot.js",
];

self.addEventListener("install", (e) => {
  // add files one by one, so one missing file can't stop the rest being cached
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;   // OpenRouter etc. go straight to the network
  e.respondWith(
    fetch(req)
      .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
  );
});
