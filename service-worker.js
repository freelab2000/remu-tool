const CACHE_NAME = "remu-tool-cache-v2"; // <-- sube a v3, v4... cada vez que quieras forzar update

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // toma control más rápido
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("remu-tool-cache-") && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim(); // controla pestañas abiertas
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
