/*
  ============================================================
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)

  SERVICE WORKER - VERSION 4
  PWA / CACHE / OFFLINE / PERFORMANCE

  Stratégies :
    - HTML, CSS, JS ........ Network First (réseau, puis cache si hors ligne
                             ou si le réseau met trop de temps à répondre)
    - Images, polices, PDF . Cache First (instantané, puis réseau si absent)
    - skipWaiting() + clients.claim() : la nouvelle version s'active seule.
  ============================================================
*/

'use strict';


// ============================================================
// 1. CONFIGURATION
// ============================================================

const CACHE_PREFIX = 'glody_claver-portfolio-';
const CACHE_VERSION = 'v5';
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;

// Délai maximum d'attente du réseau avant de servir le cache (ms).
const NETWORK_TIMEOUT = 4000;


// ============================================================
// 2. RESSOURCES ESSENTIELLES (pré-cache)
//    Une ressource manquante ne bloque jamais l'installation.
// ============================================================

const ASSETS_TO_CACHE = [

  // Pages
  './',
  './index.html',
  './privacy.html',
  './404.html',

  // Configuration PWA
  './json/manifest.json',

  // CSS
  './css/icofont.css',
  './css/ionicons/css/ionicons.min.css',
  './css/font-awesome.min.css',
  './css/swiper-bundle.min.css',
  './css/style.css',

  // Polices locales (Poppins)
  './css/fonts/Poppins-Light.ttf',
  './css/fonts/Poppins-Regular.ttf',
  './css/fonts/Poppins-Medium.ttf',
  './css/fonts/Poppins-Bold.ttf',

  // JavaScript
  './js/splash-init.js',
  './js/gtag.js',
  './js/pwa.js',
  './js/structured-data.js',
  './js/scrollreveal.js',
  './js/script.js',

  // Identité visuelle
  './images/CLAVER%20LOGO.png',
  './images/about-me-2.png',

  // Document
  './documents/cv.pdf'

];


// ============================================================
// 3. OUTILS
// ============================================================

const isSameOrigin = request =>
  new URL(request.url).origin === self.location.origin;

const isCacheableResponse = response =>
  Boolean(response) && response.status === 200 && response.type === 'basic';

const updateCache = async (request, response) => {
  if (!isCacheableResponse(response)) return;

  const cache = await caches.open(CACHE_NAME);

  await cache.put(request, response.clone());
};

const matchCache = (request, options = {}) =>
  caches.match(request, Object.assign({ cacheName: CACHE_NAME }, options));

// fetch() avec délai maximum : évite de bloquer la page sur un réseau lent.
const fetchWithTimeout = (request, timeout) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), timeout);

    fetch(request).then(
      response => { clearTimeout(timer); resolve(response); },
      error => { clearTimeout(timer); reject(error); }
    );
  });

const offlineResponse = () =>
  new Response('Vous êtes actuellement hors connexion. Veuillez réessayer ultérieurement.', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });


// ============================================================
// 4. INSTALLATION
// ============================================================

self.addEventListener('install', event => {

  // Activation immédiate de la nouvelle version.
  self.skipWaiting();

  event.waitUntil((async () => {

    const cache = await caches.open(CACHE_NAME);

    const results = await Promise.all(

      ASSETS_TO_CACHE.map(async asset => {

        try {
          const url = new URL(asset, self.registration.scope);
          const response = await fetch(url, { cache: 'reload' });

          if (!isCacheableResponse(response)) {
            throw new Error('Ressource indisponible : ' + asset);
          }

          await cache.put(url.href, response);

          return true;

        } catch (error) {
          console.warn('[PWA] Ressource ignorée :', asset);
          return false;
        }

      })

    );

    console.info(
      '[PWA] ' + results.filter(Boolean).length + '/' +
      ASSETS_TO_CACHE.length + ' ressources mises en cache.'
    );

  })());

});


// ============================================================
// 5. ACTIVATION : nettoyage des anciens caches + prise de contrôle
// ============================================================

self.addEventListener('activate', event => {

  event.waitUntil((async () => {

    try {
      const names = await caches.keys();

      await Promise.all(
        names
          .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    } catch (error) {
      console.error("[PWA] Erreur pendant l'activation :", error);
    }

    // Prendre immédiatement le contrôle des pages ouvertes.
    await self.clients.claim();

  })());

});


// ============================================================
// 6. STRATÉGIE NETWORK FIRST (HTML, CSS, JS)
// ============================================================

const networkFirst = async (event, isNavigation) => {

  const request = event.request;

  try {
    const response = await fetchWithTimeout(request, NETWORK_TIMEOUT);

    if (isCacheableResponse(response)) {
      event.waitUntil(updateCache(request, response.clone()));
    }

    return response;

  } catch (error) {

    // Hors ligne ou réseau trop lent : on sert le cache.
    const cached = await matchCache(request, { ignoreSearch: true });

    if (cached) return cached;

    if (isNavigation) {
      const fallback = await matchCache(
        new URL('./index.html', self.registration.scope).href
      );

      if (fallback) return fallback;
    }

    return offlineResponse();
  }

};


// ============================================================
// 7. STRATÉGIE CACHE FIRST (images, polices, PDF)
// ============================================================

const cacheFirst = async event => {

  const request = event.request;

  const cached = await matchCache(request);

  if (cached) return cached;

  try {
    const response = await fetch(request);

    if (isCacheableResponse(response)) {
      event.waitUntil(updateCache(request, response.clone()));
    }

    return response;

  } catch (error) {
    return offlineResponse();
  }

};


// ============================================================
// 8. INTERCEPTION DES REQUÊTES
// ============================================================

const NETWORK_FIRST_EXTENSIONS = ['.html', '.css', '.js', '.json'];

const CACHE_FIRST_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico', '.avif',
  '.woff', '.woff2', '.ttf', '.otf', '.pdf'
];

self.addEventListener('fetch', event => {

  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Domaines externes (Google Analytics, etc.) et protocoles non HTTP : ignorés.
  if (!isSameOrigin(request)) return;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Fichiers dynamiques et API : ignorés.
  if (url.pathname.endsWith('.php') || url.pathname.includes('/api/')) return;

  const path = url.pathname.toLowerCase();

  // Pages HTML
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(event, true));
    return;
  }

  // HTML / CSS / JS : réseau d'abord
  if (NETWORK_FIRST_EXTENSIONS.some(ext => path.endsWith(ext))) {
    event.respondWith(networkFirst(event, false));
    return;
  }

  // Images / polices / PDF : cache d'abord
  if (CACHE_FIRST_EXTENSIONS.some(ext => path.endsWith(ext))) {
    event.respondWith(cacheFirst(event));
  }

});


// ============================================================
// 9. MESSAGES
// ============================================================

self.addEventListener('message', event => {

  if (event.data && event.data.type === 'SKIP_WAITING') {
    event.waitUntil(self.skipWaiting());
  }

});