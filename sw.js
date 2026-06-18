// sw.js - 離線引擎防彈版 (v4)
const CACHE_NAME = 'assistive-tech-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './data.csv',
  './manifest.json',
  './icon.png',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    // ignoreSearch: true 讓系統在離線時能忽略網址後面的隨機亂碼，精準拿出快取檔案
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
