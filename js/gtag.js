/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

const GA_TRACKING_ID = 'G-NCPMG52LYQ'; 

if (!window.dataLayer) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID);

  if (navigator.onLine && GA_TRACKING_ID !== 'G-XXXXXXXX') {
    const scriptGoogleAnalytics = document.createElement('script');
    scriptGoogleAnalytics.async = true;
    scriptGoogleAnalytics.src = 'https://googletagmanager.com' + GA_TRACKING_ID;
    
    const listeScripts = document.getElementsByTagName('script');
    if (listeScripts.length > 0 && listeScripts[0].parentNode) {
      listeScripts[0].parentNode.insertBefore(scriptGoogleAnalytics, listeScripts[0]);
    } else {
      document.head.appendChild(scriptGoogleAnalytics);
    }
  }
}