// Cloudflare Worker — кеширующий прокси для Supabase Storage
// Формат: Service Worker (для вставки в Cloudflare Dashboard Editor)
//
// cdn.steeldrakestudio.com/storage/... → кеш Cloudflare → Supabase

const SUPABASE_STORAGE = 'https://hniqpnuqqsmqpolxgbav.supabase.co';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const request = event.request;
  const url = new URL(request.url);
  const supabaseUrl = SUPABASE_STORAGE + url.pathname + url.search;

  const cache = caches.default;

  // Пробуем отдать из кеша Cloudflare
  let response = await cache.match(request);
  
  if (!response) {
    // Промах — идём в Supabase
    response = await fetch(supabaseUrl);
    
    if (response.ok) {
      // Добавляем заголовки кеширования
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      response.headers.set('Access-Control-Allow-Origin', '*');
      
      // Сохраняем в кеш Cloudflare
      event.waitUntil(cache.put(request, response.clone()));
    }
  }
  
  return response;
}
