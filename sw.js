// sw.js - 離線引擎加強版
const CACHE_NAME = 'assistive-tech-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './data.csv',
  './manifest.json',
  './icon.png',
  // 核心套件 CDN：沒網路時就靠這些快取運作
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js'
];

// 1. 安裝階段：強制下載所有必要資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在預載入離線資源...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. 激活階段：清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. 抓取階段：採「快取優先」策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 如果快取有，直接給；沒有的話才去網路抓
      return cachedResponse || fetch(event.request);
    })
  );
});
