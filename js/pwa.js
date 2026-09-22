/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
       L'enregistrement intègre la portée racine et se synchronise avec l'URL du manifest */
    navigator.serviceWorker.register('sw.js', { scope: './' })
      .then(function(registration) {
        console.log('Service Worker enregistré avec succès ! Portée (Scope) : ', registration.scope);
        
        /* Optionnel : Vérifie si une mise à jour du Service Worker (v2) est en attente */
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('Nouveau contenu disponible, veuillez rafraîchir la page.');
            }
          });
        });
      })
      .catch(function(error) {
        console.warn('Échec de l\'enregistrement du Service Worker : ', error);
      });
  });
}
