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