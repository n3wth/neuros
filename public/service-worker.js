// DISABLED Service Worker - temporarily disabled to fix infinite loops
console.log('Service worker disabled to fix infinite loops');

// Clear all existing caches immediately
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      console.log('All caches cleared');
      return self.clients.claim();
    })
  );
});

// Let all requests pass through without interference
self.addEventListener('fetch', (event) => {
  // Do nothing - let all requests pass through normally
  return;
});

// All other service worker functionality disabled