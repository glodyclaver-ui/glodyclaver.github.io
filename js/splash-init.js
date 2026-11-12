/* Splash : affiche une seule fois par session.
   Chargé dans le <head> AVANT le CSS pour éviter l'éclair noir à l'actualisation. */
try {
    if (sessionStorage.getItem('gc_splash_seen') === '1') {
        document.documentElement.classList.add('splash-seen');
    }
} catch (e) {}

/* Arrivée via une transition de page : le rideau repart vers le haut. */
try {
    if (sessionStorage.getItem('gc_page_transition') === '1') {
        sessionStorage.removeItem('gc_page_transition');
        document.documentElement.classList.add('page-entering', 'splash-seen');
    }
} catch (e) {}

/* "Version pour ordinateur" sur telephone : le navigateur annonce ~980px alors que l'ecran
   fait ~400px. On marque la page pour garder STRICTEMENT la mise en page PC (jamais "tablette"). */
try {
    var smallSide = Math.min(screen.width || 9999, screen.height || 9999);
    if (smallSide < 600 && window.innerWidth >= 700 && window.matchMedia('(pointer: coarse)').matches) {
        document.documentElement.classList.add('desktop-mode');
    }
} catch (e) {}