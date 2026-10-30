/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

if ('serviceWorker' in navigator) {

  window.addEventListener('load', function () {

    // L'enregistrement intègre la portée racine.
    navigator.serviceWorker.register('./sw.js', {
      scope: './'
    })

    .then(function (registration) {

      console.log(
        'Service Worker enregistré avec succès ! Portée (Scope) :',
        registration.scope
      );

      // Vérification de la disponibilité d'une mise à jour.
      registration.addEventListener('updatefound', function () {

        const newWorker = registration.installing;

        if (newWorker) {

          newWorker.addEventListener('statechange', function () {

            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {

              console.log(
                'Nouveau contenu disponible, veuillez rafraîchir la page.'
              );

            }

          });

        }

      });

    })

    .catch(function (error) {

      console.warn(
        'Échec de l\'enregistrement du Service Worker :',
        error
      );

    });

  });

}

