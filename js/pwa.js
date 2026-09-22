/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js')
      .then(function(registration) {
        console.log('Service Worker enregistré avec succès ! Portée (Scope) : ', registration.scope);
      })
      .catch(function(error) {
        console.warn('Échec de l\'enregistrement du Service Worker : ', error);
      });
  });
}
