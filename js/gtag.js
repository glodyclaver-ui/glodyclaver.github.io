/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

const GA_TRACKING_ID = 'G-NCPMG52LYQ'; 

// SÉCURITÉ ACCRUE : On vérifie si window.dataLayer et window.gtag n'existent pas déjà
if (!window.dataLayer) {
  window.dataLayer = window.dataLayer || [];
}

if (typeof window.gtag !== 'function') {
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  
  // Initialisation officielle de Google Analytics
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID);
}

/* SÉCURITÉ PWA STRICTE : Ne charge l'URL externe que si le réseau est actif */
if (navigator.onLine && GA_TRACKING_ID !== 'G-XXXXXXXX') {
  const scriptGoogleAnalytics = document.createElement('script');
  scriptGoogleAnalytics.async = true;
  
  /* LE LIEN BRUT DIRECT INTEGRAL EXIGÉ PAR GOOGLE PLACÉ ICI : */
  scriptGoogleAnalytics.src = 'https://www.googletagmanager.com/gtag/js?id=G-NCPMG52LYQ';
  
  /* CORRECTIF DU BUG D'INJECTION : Ciblage ultra-sécurisé via querySelector */
  const premierScriptDuDOM = document.querySelector('script');
  
  if (premierScriptDuDOM && premierScriptDuDOM.parentNode) {
    // Insertion propre juste avant le tout premier script trouvé dans le HTML
    premierScriptDuDOM.parentNode.insertBefore(scriptGoogleAnalytics, premierScriptDuDOM);
  } else {
    // Solution de secours inviolable si le DOM subit une restriction de sécurité sandbox
    document.head.appendChild(scriptGoogleAnalytics);
  }
}
