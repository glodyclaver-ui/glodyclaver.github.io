/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

// ============================================================
// ENREGISTREMENT ET GESTION DU SERVICE WORKER PWA
// ============================================================

if ('serviceWorker' in navigator) {

  window.addEventListener('load', async function () {

    try {

      // Vérifier si un Service Worker contrôle déjà la page.
      const hadController = !!navigator.serviceWorker.controller;

      // Enregistrement du Service Worker.
      const registration = await navigator.serviceWorker.register(
        './sw.js',
        {
          scope: './',
          updateViaCache: 'none'
        }
      );

      console.info(
        '[PWA] Service Worker enregistré avec succès.',
        registration.scope
      );

      // ======================================================
      // DÉTECTION DES NOUVELLES VERSIONS
      // ======================================================

      registration.addEventListener('updatefound', function () {

        const newWorker = registration.installing;

        if (!newWorker) return;

        console.info('[PWA] Nouvelle version détectée.');

        newWorker.addEventListener('statechange', function () {

          if (newWorker.state === 'installed') {

            if (navigator.serviceWorker.controller) {

              console.info(
                '[PWA] Nouvelle version installée et prête.'
              );

            } else {

              console.info(
                '[PWA] Application installée pour la première fois.'
              );

            }

          }

        });

      });

      // ======================================================
      // ACTUALISATION AUTOMATIQUE DU SERVICE WORKER
      // ======================================================

      await registration.update();

      // Vérification périodique des mises à jour.
      const UPDATE_INTERVAL = 60 * 60 * 1000;

      setInterval(function () {

        registration.update().catch(function (error) {

          console.warn(
            '[PWA] Vérification de mise à jour impossible :',
            error
          );

        });

      }, UPDATE_INTERVAL);

      // ======================================================
      // GESTION DU CHANGEMENT DE CONTRÔLEUR
      // ======================================================

      let refreshing = false;

      navigator.serviceWorker.addEventListener(
        'controllerchange',
        function () {

          if (!hadController || refreshing) return;

          refreshing = true;

          console.info(
            '[PWA] Nouvelle version activée. Actualisation de la page.'
          );

          window.location.reload();

        }
      );

    } catch (error) {

      console.error(
        "[PWA] Échec de l'enregistrement :",
        error
      );

    }

  });

}