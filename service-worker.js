// Service Worker pour SESSAD Petit Prince
// Version 1.0.0

const CACHE_NAME = 'sessad-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/logo-petit-prince.webp',
  '/assistant-tdah.html',
  '/assistant-tsa.html',
  '/assistant-dys.html',
  '/outils.html',
  '/ressources.html',
  '/pictogrammes.html',
  '/generateur-documents.html',
  '/espace-parents.html',
  '/espace-professionnels.html',
  '/contact.html',
  '/mentions-legales.html',
  '/rgpd.html',
  '/404.html'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retourne la réponse en cache
        if (response) {
          return response;
        }

        // Clone la requête
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Vérifie si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone la réponse
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Si échec, retourne la page 404 en cache
        return caches.match('/404.html');
      })
  );
});
