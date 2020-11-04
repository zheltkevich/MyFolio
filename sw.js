const staticCacheName = 'static-cache-v0.05';
const dynamicCacheName = 'dynamic-cache-v0';

const staticAssets = [
  './',
  './index.html',
  './img/icons/MyFolio__128x128.png',
  './img/icons/MyFolio__192x192.png',
  './offline.html',
  './css/main.css',
  './js/app.js',
  './js/main.js',
  './img/no-image.png'
];

self.addEventListener('install', async event => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(staticAssets);
  console.log('Service worker has been installed');
});

self.addEventListener('activate', async event => {
  const cachesKeys = await caches.keys();
  const checkKeys = cachesKeys.map(async key => {
    if (staticCacheName !== key) {
      await caches.delete(key);
    }
  });
  await Promise.all(checkKeys);
  console.log('Service worker has been activated');
});

self.addEventListener('fetch', event => {
  console.log('Trying to fetch ${event.request.url}');
  event.respondWith(checkCache(event.request));
});

async function checkCache(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || checkOnline(req);
}

async function checkOnline(req) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const res = await fetch(req);
    await cache.put(req, res.clone());
    return res;
  } catch (error) {
    const cachedRes = await cache.match(req);
    if (cachedRes) {
      return cachedRes;
    } else if (req.url.indexOf('.html') !== -1) {
      return caches.match('./offline.html');
    } else {
      return caches.match('./img/no-image.png');
    }
  }
}