/* CONFIGURATION
-------------------------------------------------------------- */
const config = {
  CORE_CACHE_NAME: 'bioboot-dashboard-core', // Name of cache with all core files
  PAGE_CACHE_NAME: 'bioboot-dashboard-pages', // Name of cache with all catched pages
  CORE_FILES: ['/js/script.js', '/css/style.css', '/'] // Core files to cache
}

console.log('hola')

/* CACHE CORE SITE ASSETS
-------------------------------------------------------------- */
this.addEventListener('install', event => event.waitUntil(
  caches.open(config.CORE_CACHE_NAME) // Open cache with name: moviespot-v1.0.0-core
  .then(cache => cache.addAll(config.CORE_FILES)) // Add all core files to the cache
  .then(this.skipWaiting()) // Create the new active worker
));

this.addEventListener('fetch', event => {
  const request = event.request; // All requests that are made
  if (request.mode === 'navigate') { // These include the pages, not the core files
    event.respondWith(
      fetch(request)
      .then(response => cachePage(request, response)) // Caches page that is not yet cached
      .catch(err => getCachedPage(request)) // Get page from cache on error
    );
  } else { // Core files
    event.respondWith(
      fetch(request)
      .catch(err => fetchCoreFile(request.url)) // Get core files from cache on error
    );
  }
});

/* HANDLE THE CORE FILES ON ERROR [OFFLINE]
-------------------------------------------------------------- */
const fetchCoreFile = (URL) => {
  return caches.open(config.CORE_CACHE_NAME)
    .then(cache => cache.match(URL)) // Check if requested core file is cached
    .then(response => response ? response : Promise.reject());
}

/* GET PAGE IF IT IS IN THE CACHE
-------------------------------------------------------------- */
const getCachedPage = (request) => {
  return caches.open(config.PAGE_CACHE_NAME)
    .then(cache => cache.match(request)) // Check if requested page is cached
    .then(response => response ? response : Promise.reject());
}

/* CACHE PAGE IF IT'S NOT CACHED YET
-------------------------------------------------------------- */
const cachePage = (request, response) => {
  const clonedResponse = response.clone(); // Clone the response
  caches.open(config.PAGE_CACHE_NAME) // Open the cache with all pages, not the core-files
    .then(cache => cache.put(request, clonedResponse)); // Add clone of file to cache
  return response;
}
