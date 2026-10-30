/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

// ============================================================
// GOOGLE ANALYTICS 4 — INITIALISATION OPTIMISÉE POUR PWA
// ============================================================

(() => {

  'use strict';

  // ==========================================================
  // 1. CONFIGURATION
  // ==========================================================

  const GA_TRACKING_ID = 'G-NCPMG52LYQ';

  const GA_SCRIPT_URL =
    'https://www.googletagmanager.com/gtag/js?id=' + GA_TRACKING_ID;

  // Vérification de l'identifiant GA4.
  if (!/^G-[A-Z0-9]+$/.test(GA_TRACKING_ID)) {
    console.warn('[Google Analytics] Identifiant invalide.');
    return;
  }

  // Éviter une double initialisation.
  if (window.__GA4_INITIALIZED__) {
    return;
  }

  window.__GA4_INITIALIZED__ = true;

  // ==========================================================
  // 2. INITIALISATION DU DATALAYER
  // ==========================================================

  window.dataLayer = window.dataLayer || [];

  // ==========================================================
  // 3. INITIALISATION DE GTAG
  // ==========================================================

  window.gtag = window.gtag || function () {

    window.dataLayer.push(arguments);

  };

  // ==========================================================
  // 4. CONFIGURATION GOOGLE ANALYTICS 4
  // ==========================================================

  window.gtag('js', new Date());

  window.gtag('config', GA_TRACKING_ID, {
    send_page_view: true
  });

  // ==========================================================
  // 5. VÉRIFICATION DU SCRIPT GOOGLE ANALYTICS
  // ==========================================================

  let scriptLoading = false;

  let retryTimer = null;

  const RETRY_DELAY = 10000;

  const scriptAlreadyExists = () => {

    return Array.from(document.scripts).some(script => {

      return script.src === GA_SCRIPT_URL;

    });

  };

  // ==========================================================
  // 6. CHARGEMENT DE GOOGLE ANALYTICS
  // ==========================================================

  const loadGoogleAnalytics = () => {

    // Éviter les chargements simultanés.
    if (scriptLoading) {
      return;
    }

    // Vérifier la connexion Internet.
    if (!navigator.onLine) {
      return;
    }

    // Éviter les scripts en double.
    if (scriptAlreadyExists()) {
      return;
    }

    scriptLoading = true;

    // Création du script Google Analytics.
    const script = document.createElement('script');

    script.async = true;

    script.src = GA_SCRIPT_URL;

    // Chargement réussi.
    script.onload = () => {

      scriptLoading = false;

      console.info(
        '[Google Analytics] GA4 chargé avec succès.'
      );

    };

    // Gestion des erreurs.
    script.onerror = () => {

      scriptLoading = false;

      script.remove();

      console.warn(
        '[Google Analytics] Échec du chargement. Nouvelle tentative programmée.'
      );

      // Programmer une nouvelle tentative.
      clearTimeout(retryTimer);

      retryTimer = setTimeout(() => {

        if (navigator.onLine) {
          loadGoogleAnalytics();
        }

      }, RETRY_DELAY);

    };

    // Insertion dans le document.
    (document.head || document.documentElement)
      .appendChild(script);

  };

  // ==========================================================
  // 7. GESTION DE LA CONNEXION INTERNET
  // ==========================================================

  window.addEventListener('online', () => {

    console.info(
      '[Google Analytics] Connexion Internet rétablie.'
    );

    clearTimeout(retryTimer);

    loadGoogleAnalytics();

  });

  window.addEventListener('offline', () => {

    console.info(
      '[Google Analytics] Connexion Internet indisponible.'
    );

  });

  // ==========================================================
  // 8. INITIALISATION AU CHARGEMENT
  // ==========================================================

  if (navigator.onLine) {

    loadGoogleAnalytics();

  }

})();