/*
  ============================================================
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)

  SERVICE WORKER - VERSION OPTIMISÉE
  PWA / CACHE / OFFLINE / PERFORMANCE / SÉCURITÉ
  ============================================================
*/

'use strict';


// ============================================================
// 1. CONFIGURATION GÉNÉRALE
// ============================================================

const CACHE_PREFIX = 'glody_claver-portfolio-';

const CACHE_VERSION = 'v3';

const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;


// ============================================================
// 2. RESSOURCES À METTRE EN CACHE
// ============================================================

const ASSETS_TO_CACHE = [

  // ==================== PAGES PRINCIPALES ====================

  './',
  './index.html',
  './404.html',

  // ==================== CONFIGURATION PWA ====================

  './sw.json',
  './json/manifest.json',

  // ==================== CSS ====================

  './css/icofont.css',
  './css/ionicons/css/ionicons.css',
  './css/ionicons/css/ionicons.min.css',
  './css/font-awesome.min.css',
  './css/swiper-bundle.min.css',
  './css/style.css',

  // ==================== JAVASCRIPT ====================

  './js/gtag.js',
  './js/scrollreveal.js',
  './js/script.js',

  // ==================== IDENTITÉ VISUELLE ====================

  './images/CLAVER%20LOGO.png',
  './images/CLAVER%20LOGO%201.png',
  './images/CLAVER%20LOGO%202.png',
  './images/CLAVER%20LOGO%203.png',

  './images/about-me-image.png',
  './images/about-me-1.png',

  // ==================== GALERIE DE TRAVAIL ====================

  './images/travail/ton-travail1.jpg',
  './images/travail/ton-travail2.jpg',
  './images/travail/ton-travail3.jpg',
  './images/travail/ton-travail4.jpg',
  './images/travail/ton-travail5.jpg',
  './images/travail/ton-travail6.jpg',
  './images/travail/ton-travail7.jpg',

  './images/clients/logo1.png',

  // ==================== PORTFOLIO : AFFICHES ====================

  './images/portfolio/Affiche/affiche1.png',
  './images/portfolio/Affiche/affiche2.jpg',
  './images/portfolio/Affiche/affiche3.jpg',

  // ==================== BASE DE DONNÉES : IMAGE ====================

  './images/portfolio/BDD/BDD.png',

  // ==================== LOGICIELS ====================

  './images/portfolio/Logiciel/logi1.png',
  './images/portfolio/Logiciel/logi2.png',
  './images/portfolio/Logiciel/logi3.png',
  './images/portfolio/Logiciel/logi4.png',
  './images/portfolio/Logiciel/logi5.png',
  './images/portfolio/Logiciel/logi6.png',
  './images/portfolio/Logiciel/logi7.png',

  // ==================== LOGOS ====================

  './images/portfolio/Logo/Aleron/logo.png',
  './images/portfolio/Logo/Aleron/logo1.png',

  './images/portfolio/Logo/D%C3%A9couverte%20Inspiration/D%C3%A9couverte%20Inspiration.png',

  './images/portfolio/Logo/geriatrie/logo1.png',

  './images/portfolio/Logo/Honnette%20etablissement/LOGO%20HONNETTE%20ETABLISSEMENT%201.png',

  './images/portfolio/Logo/Parcours/Parcours.png',

  './images/portfolio/Logo/Tajir%20monde/logo1.jpg',
  './images/portfolio/Logo/Tajir%20monde/Tajir%20monde%201.png',

  // ==================== SITES WEB ====================

  './images/portfolio/Site%20web/web1.png',

  // ==================== DOCUMENTS ====================

  './documents/cv.pdf'

];


// ============================================================
// 3. OUTILS DE GESTION DU CACHE
// ============================================================

// Vérifier si une requête appartient au domaine du portfolio.

const isSameOrigin = request => {

  return new URL(request.url).origin === self.location.origin;

};


// Vérifier si une réponse peut être mise en cache.

const isCacheableResponse = response => {

  return (
    response &&
    response.status === 200 &&
    response.type === 'basic'
  );

};


// Enregistrer une ressource dans le cache.

const updateCache = async (request, response) => {

  if (!isCacheableResponse(response)) {
    return;
  }

  const cache = await caches.open(CACHE_NAME);

  await cache.put(
    request,
    response.clone()
  );

};


// ============================================================
// 4. INSTALLATION ET PRÉ-CACHE
// ============================================================

self.addEventListener('install', event => {

  event.waitUntil(

    (async () => {

      const cache = await caches.open(CACHE_NAME);

      // Chargement individuel des ressources.
      // Une ressource manquante ne bloque pas toute l'installation.

      const results = await Promise.all(

        ASSETS_TO_CACHE.map(async asset => {

          try {

            const assetURL = new URL(
              asset,
              self.registration.scope
            );

            const response = await fetch(assetURL, {
              cache: 'reload'
            });

            if (!isCacheableResponse(response)) {

              throw new Error(
                `Ressource indisponible : ${asset}`
              );

            }

            await cache.put(
              assetURL.href,
              response.clone()
            );

            return true;

          } catch (error) {

            console.warn(
              '[PWA] Ressource ignorée :',
              asset,
              error
            );

            return false;

          }

        })

      );

      const successCount = results.filter(Boolean).length;

      console.info(
        `[PWA] ${successCount}/${ASSETS_TO_CACHE.length} ressources mises en cache.`
      );

      // Activer immédiatement la nouvelle version.

      await self.skipWaiting();

    })()

  );

});


// ============================================================
// 5. ACTIVATION ET NETTOYAGE DES ANCIENS CACHES
// ============================================================

self.addEventListener('activate', event => {

  event.waitUntil(

    (async () => {

      try {

        const cacheNames = await caches.keys();

        await Promise.all(

          cacheNames.map(async cacheName => {

            // Supprimer uniquement les anciennes versions
            // appartenant à ce portfolio.

            if (
              cacheName.startsWith(CACHE_PREFIX) &&
              cacheName !== CACHE_NAME
            ) {

              await caches.delete(cacheName);

              console.info(
                '[PWA] Ancien cache supprimé :',
                cacheName
              );

            }

          })

        );

        // Prendre immédiatement le contrôle des pages.

        await self.clients.claim();

        console.info(
          '[PWA] Service Worker activé :',
          CACHE_NAME
        );

      } catch (error) {

        console.error(
          '[PWA] Erreur pendant l'activation :',
          error
        );

      }

    })()

  );

});


// ============================================================
// 6. STRATÉGIE CACHE-FIRST AVEC ACTUALISATION
// ============================================================

const cacheFirstWithRefresh = (event) => {

  const request = event.request;

  const cacheUpdate = (async () => {

    try {

      const response = await fetch(request);

      if (isCacheableResponse(response)) {

        await updateCache(
          request,
          response
        );

      }

      return response;

    } catch (error) {

      return null;

    }

  })();

  // Vérifier immédiatement le cache.

  const cachedResponsePromise = caches.match(request, {
    cacheName: CACHE_NAME
  });

  // Actualiser en arrière-plan sans bloquer l'affichage.

  event.waitUntil(
    cacheUpdate.then(() => undefined)
  );

  return cachedResponsePromise.then(async cachedResponse => {

    if (cachedResponse) {

      return cachedResponse;

    }

    // Si le cache ne contient pas la ressource,
    // utiliser la réponse réseau.

    const networkResponse = await cacheUpdate;

    if (networkResponse) {

      return networkResponse;

    }

    return new Response(
      'Ressource indisponible hors connexion.',
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      }
    );

  });

};


// ============================================================
// 7. STRATÉGIE NETWORK-FIRST POUR LES PAGES HTML
// ============================================================

const networkFirst = (event) => {

  const request = event.request;

  const networkRequest = (async () => {

    try {

      const response = await fetch(request);

      if (isCacheableResponse(response)) {

        await updateCache(
          request,
          response
        );

      }

      return response;

    } catch (error) {

      return null;

    }

  })();

  return networkRequest.then(async networkResponse => {

    // Priorité au réseau.

    if (networkResponse) {

      return networkResponse;

    }

    // En cas de déconnexion, rechercher la page demandée.

    const cachedResponse = await caches.match(request, {
      cacheName: CACHE_NAME
    });

    if (cachedResponse) {

      return cachedResponse;

    }

    // Page principale comme solution de secours.

    const indexURL = new URL(
      './index.html',
      self.registration.scope
    );

    const offlineResponse = await caches.match(
      indexURL.href,
      {
        cacheName: CACHE_NAME
      }
    );

    if (offlineResponse) {

      return offlineResponse;

    }

    // Dernier recours.

    return new Response(
      'Vous êtes actuellement hors connexion. Veuillez réessayer ultérieurement.',
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      }
    );

  });

};


// ============================================================
// 8. INTERCEPTION INTELLIGENTE DES REQUÊTES
// ============================================================

self.addEventListener('fetch', event => {

  const request = event.request;

  const url = new URL(request.url);

  // Ignorer les méthodes autres que GET.

  if (request.method !== 'GET') {
    return;
  }

  // Ignorer les domaines externes :
  // Google Analytics, CDN, Google Fonts, etc.

  if (!isSameOrigin(request)) {
    return;
  }

  // Ignorer les fichiers dynamiques et les API.

  if (
    url.pathname.endsWith('.php') ||
    url.pathname.includes('/api/')
  ) {
    return;
  }

  // Ignorer les protocoles non HTTP.

  if (
    url.protocol !== 'http:' &&
    url.protocol !== 'https:'
  ) {
    return;
  }

  // ==================== PAGES HTML ====================

  if (request.mode === 'navigate') {

    event.respondWith(
      networkFirst(event)
    );

    return;

  }

  // ==================== RESSOURCES STATIQUES ====================

  const staticExtensions = [

    '.css',
    '.js',
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.gif',
    '.svg',
    '.ico',
    '.woff',
    '.woff2',
    '.ttf',
    '.otf',
    '.pdf'

  ];

  const isStaticResource = staticExtensions.some(
    extension => url.pathname.toLowerCase().endsWith(extension)
  );

  if (!isStaticResource) {
    return;
  }

  event.respondWith(
    cacheFirstWithRefresh(event)
  );

});


// ============================================================
// 9. GESTION DES MESSAGES ET MISES À JOUR
// ============================================================

self.addEventListener('message', event => {

  if (!event.data) {
    return;
  }

  if (event.data.type === 'SKIP_WAITING') {

    event.waitUntil(
      self.skipWaiting()
    );

  }

});


// ============================================================
// 10. GESTION DES ERREURS
// ============================================================

self.addEventListener('error', event => {

  console.error(
    '[PWA] Erreur Service Worker :',
    event.message
  );

});


self.addEventListener('unhandledrejection', event => {

  console.error(
    '[PWA] Erreur asynchrone :',
    event.reason
  );

});
