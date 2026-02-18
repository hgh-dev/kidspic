const CACHE_NAME = 'kidspic-v3.5.2'; // 여기 버전을 올렸습니다!
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. 설치 (파일 저장)
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] 파일들을 미리 저장합니다.');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // 설치되자마자 대기하지 않고 바로 작동하도록 강제 (업데이트 즉시 반영 도움)
  self.skipWaiting();
});

// 2. 실행 (저장된 파일 꺼내주기)
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return response || fetch(evt.request);
    })
  );
});

// 3. 청소 (새 버전이 나오면 옛날 파일 삭제)
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] 옛날 캐시를 지웁니다.', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // 활성화되자마자 모든 페이지를 제어하도록 설정
  self.clients.claim();
});