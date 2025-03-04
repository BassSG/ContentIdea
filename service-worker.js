const CACHE_NAME = 'trip-planner-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://s21-kling.klingai.com/bs2/upload-ylab-stunt-sgp/se/ai_portal_sgp_mmu_txt2img_aiweb_v15/6bc984a1-90de-47a4-b488-24370055d988_image.png?x-kcdn-pid=112372'
];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', event => {

  

  if (event.request.url.includes('script.google.com')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {

          return caches.match('/offline.html');
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // ส่งคืนจาก cache ถ้ามี
          if (response) {
            return response;
          }
          

          return fetch(event.request)
            .then(response => {

              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              

              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            });
        })
    );
  }
});


self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
