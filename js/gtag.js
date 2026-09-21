/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

/* ==========================================================================
CONFIGURATION SÉCURISÉE GOOGLE ANALYTICS (COMPATIBLE PWA & OFFLINE)
========================================================================= */

// Votre ID de mesure GA4 officiel configuré avec succès !
const GA_TRACKING_ID = 'G-NCPMG52LYQ'; 

if (!window.dataLayer) {
  window.dataLayer = window.dataLayer || [];
  function gtag(){
    window.dataLayer.push(arguments);
  }

  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID);

  /* SÉCURITÉ PWA : Ne charge le script externe Google que si l'utilisateur a du réseau ET si la clé a été modifiée */
  if (navigator.onLine && GA_TRACKING_ID !== 'G-XXXXXXXX') {
    const scriptGoogleAnalytics = document.createElement('script');
    scriptGoogleAnalytics.async = true;
    
    /* URL officielle et structure exacte */
    scriptGoogleAnalytics.src = 'https://googletagmanager.com' + GA_TRACKING_ID;
    
    /* Injection dynamique et asynchrone ultra-performante */
    const listeScripts = document.getElementsByTagName('script');
    if (listeScripts.length > 0 && listeScripts.parentNode) {
      listeScripts.parentNode.insertBefore(scriptGoogleAnalytics, listeScripts);
    } else {
      document.head.appendChild(scriptGoogleAnalytics);
    }
  }
}
