/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

// ============================================================
// GOOGLE ANALYTICS 4 — CHARGÉ UNIQUEMENT APRÈS CONSENTEMENT (RGPD)
// Le choix du visiteur est géré par js/site-widgets.js (bandeau cookies).
//   - Aucun script Google ni cookie avant l'acceptation.
//   - window.gcAnalytics.grant() : accepte et charge GA4
//   - window.gcAnalytics.revoke() : refuse et coupe GA4
// ============================================================

(() => {

  'use strict';

  // ==========================================================
  // 1. CONFIGURATION
  // ==========================================================

  const GA_TRACKING_ID = 'G-NCPMG52LYQ';

  const GA_SCRIPT_URL =
    'https://www.googletagmanager.com/gtag/js?id=' + GA_TRACKING_ID;

  const CONSENT_KEY = 'gc_cookie_consent';   // 'granted' | 'denied'

  if (!/^G-[A-Z0-9]+$/.test(GA_TRACKING_ID)) {
    console.warn('[Google Analytics] Identifiant invalide.');
    return;
  }

  if (window.__GA4_INITIALIZED__) {
    return;
  }

  window.__GA4_INITIALIZED__ = true;

  // ==========================================================
  // 2. DATALAYER, GTAG ET CONSENTEMENT PAR DÉFAUT (refusé)
  // ==========================================================

  window.dataLayer = window.dataLayer || [];

  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  // Désactivation côté Google tant que le visiteur n'a pas accepté.
  window['ga-disable-' + GA_TRACKING_ID] = true;

  // ==========================================================
  // 3. CHARGEMENT DU SCRIPT (une seule fois)
  // ==========================================================

  let started = false;
  let scriptLoading = false;
  let retryTimer = null;

  const RETRY_DELAY = 10000;

  const scriptAlreadyExists = () =>
    Array.from(document.scripts).some(script => script.src === GA_SCRIPT_URL);

  const loadScript = () => {

    if (scriptLoading || !navigator.onLine || scriptAlreadyExists()) return;

    scriptLoading = true;

    const script = document.createElement('script');

    script.async = true;
    script.src = GA_SCRIPT_URL;

    script.onload = () => {
      scriptLoading = false;
    };

    script.onerror = () => {
      scriptLoading = false;
      script.remove();

      clearTimeout(retryTimer);

      retryTimer = setTimeout(() => {
        if (navigator.onLine && started) loadScript();
      }, RETRY_DELAY);
    };

    (document.head || document.documentElement).appendChild(script);
  };

  // ==========================================================
  // 4. ACCEPTER / REFUSER
  // ==========================================================

  const grant = () => {

    window['ga-disable-' + GA_TRACKING_ID] = false;

    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    });

    if (!started) {
      started = true;

      window.gtag('js', new Date());
      window.gtag('config', GA_TRACKING_ID, { send_page_view: true });
    }

    loadScript();
  };

  const revoke = () => {

    window['ga-disable-' + GA_TRACKING_ID] = true;

    window.gtag('consent', 'update', {
      analytics_storage: 'denied'
    });

    // Supprime les cookies Google Analytics déjà déposés.
    try {
      const host = location.hostname;

      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();

        if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid') {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + host;
        }
      });
    } catch (error) {}
  };

  window.gcAnalytics = { grant, revoke };

  window.addEventListener('online', () => {
    if (started) {
      clearTimeout(retryTimer);
      loadScript();
    }
  });

  // ==========================================================
  // 5. CONSENTEMENT DÉJÀ ENREGISTRÉ
  // ==========================================================

  try {
    if (localStorage.getItem(CONSENT_KEY) === 'granted') {
      grant();
    }
  } catch (error) {}

})();