const CACHE_NAME = 'prize-calculator-v1';
const ASSETS = [
  '/', // Основной HTML-файл
  '/index.html', // Если приложение находится в корне
  '/styles.css', // Если у вас отдельный файл стилей
  '/icon.png' // Иконка приложения
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});