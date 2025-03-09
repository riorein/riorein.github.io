self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v2').then(function(cache) {  // Изменили версию на 'v2'
      return cache.addAll([
        './index.html',
        './manifest.json',
        './icon.png',
        './validation.js',
        './calculator.js',
        './ui.js'
      ]).catch(function(error) {
        console.log('Ошибка кэширования:', error);  // Логируем ошибки
      });
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// Очистка старого кэша
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== 'v2';
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});