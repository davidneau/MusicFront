const CACHE_NAME = "app-cache-v2";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json"
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// FETCH (FIX IMPORTANT)
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // 🚫 1. Ne JAMAIS intercepter les assets critiques
  if (
    req.destination === "script" ||
    req.destination === "style" ||
    req.destination === "worker"
  ) {
    return; // laisse le navigateur gérer
  }

  // 🚫 2. Ne pas casser les requêtes non GET
  if (req.method !== "GET") {
    return;
  }

  // ✅ 3. Navigation (SPA)
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then((cached) => cached || fetch(req))
    );
    return;
  }

  // ✅ 4. Assets / API safe cache
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, res.clone());
            return res;
          });
        })
      );
    })
  );
});