/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

/* 1. Chargement officiel et valide de Workbox depuis le CDN sécurisé */
importScripts('https://googleapis.com');

if (typeof workbox !== 'undefined') {
  /* Active la synchronisation en arrière-plan automatique pour Google Analytics */
  workbox.googleAnalytics.initialize();
}

/* AMÉLIORATION CRITIQUE : Version v2 pour forcer la mise à jour immédiate sur les appareils */
const CACHE_NAME = 'glody-portfolio-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './404.html',
  './sw.json', 
  './json/manifest.json',
  
  /* Feuilles de style (CSS) */
  './css/icofont.css',
  './css/ionicons/css/ionicons.css',
  './css/ionicons/css/ionicons.min.css',
  './css/font-awesome.min.css',
  './css/swiper-bundle.min.css',
  './css/style.css',
  
  /* Fichiers JavaScript */
  './js/gtag.js',
  './js/scrollreveal.js',
  './js/script.js',
  
  /* Icônes et images de profil */
  './images/CLAVER%20LOGO.png',
  './images/CLAVER%20LOGO%201.png',
  './images/CLAVER%20LOGO%202.png',
  './images/CLAVER%20LOGO%203.png',
  './images/about-me-image.png',
  './images/about-me-1.png',

  /* Galerie de travail */
  './images/travail/ton-travail1.jpg',
  './images/travail/ton-travail2.jpg',
  './images/travail/ton-travail3.jpg',
  './images/travail/ton-travail4.jpg',
  './images/travail/ton-travail5.jpg',
  './images/travail/ton-travail6.jpg',
  './images/travail/ton-travail7.jpg',
  './images/clients/logo1.png',

  /* Portfolio : Réalisations graphiques et techniques */
  './images/portfolio/Affiche/affiche1.png',
  './images/portfolio/Affiche/affiche2.jpg',
  './images/portfolio/Affiche/affiche3.jpg',
  './images/portfolio/BDD/BDD.png',
  './images/portfolio/Logiciel/logi1.png',
  './images/portfolio/Logiciel/logi2.png',
  './images/portfolio/Logiciel/logi3.png',
  './images/portfolio/Logiciel/logi4.png',
  './images/portfolio/Logiciel/logi5.png',
  './images/portfolio/Logiciel/logi6.png',
  './images/portfolio/Logiciel/logi7.png',
  './images/portfolio/Logo/Aleron/logo.png',
  './images/portfolio/Logo/Aleron/logo1.png',

  /* Encodage sécurisé des accents et espaces */
  './images/portfolio/Logo/D%C3%A9couverte%20Inspiration/D%C3%A9couverte%20Inspiration.png',
  './images/portfolio/Logo/geriatrie/logo1.png',
  './images/portfolio/Logo/Honnette%20etablissement/LOGO%20HONNETTE%20ETABLISSEMENT%201.png',
  './images/portfolio/Logo/Parcours/Parcours.png',
  './images/portfolio/Logo/Tajir%20monde/logo1.jpg',
  './images/portfolio/Logo/Tajir%20monde/Tajir%20monde%201.png',
  './images/portfolio/Site%20web/web1.png',

  /* Fichier Base de données structurelle */
  './BDD/portfolio_messages.sql',

  /* Fichiers et documents téléchargeables */
  './documents/cv.pdf'
];

/* 2. Événement d'installation : Mise en cache immédiate */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* 3. Événement d'activation : Nettoyage automatique des versions obsolètes (v1) */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cache) {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/* 4. Stratégie réseau : Stale-While-Revalidate sécurisée */
self.addEventListener('fetch', function(event) {
  /* CORRECTION CAPITAL : Filtre ciblant le domaine distant pour laisser votre js/gtag.js local aller dans le cache */
  if (event.request.url.includes('google-analytics') || event.request.url.includes('analytics') || event.request.url.includes('googletagmanager.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) {
        /* Mise à jour en tâche de fond de la ressource */
        fetch(event.request).then(function(networkResponse) {
          if (networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          }
        }).catch(function() {
          /* Reste silencieux si l'utilisateur est déconnecté */
        });
        
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
