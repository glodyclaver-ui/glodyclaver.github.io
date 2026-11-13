/*
  ============================================================
  CONFIGURATION DU SITE  —  le seul fichier à modifier
  pour changer les liens, le numéro WhatsApp ou le message.
  ============================================================
*/
window.GC_CONFIG = {

    // Numéro WhatsApp au format international, SANS "+" ni espaces ni zéros.
    // Exemple RDC : +243 81 234 5678  ->  '243812345678'
    whatsappNumber: '243814405182',   // <-- À REMPLACER PAR TON NUMÉRO

    // Message pré-rempli (selon la langue choisie par le visiteur)
    whatsappMessage: {
        fr: 'Bonjour Glody-Claver, je vous contacte depuis votre portfolio. J\'aimerais discuter d\'un projet.',
        en: 'Hello Glody-Claver, I am contacting you from your portfolio. I would like to discuss a project.'
    },

    // Lien de réservation d'appel (Calendly, Cal.com, Google Agenda...).
    // (Google Agenda). Tant qu'il contient "VOTRE-LIEN", le bouton ouvre WhatsApp à la place.
    bookingUrl: 'https://calendar.app.google/8i1sWRdcGB71MSkz5',

    // E-mail de contact (devis, secours)
    email: 'glodyclaver@gmail.com',

    // Badge "Disponible pour missions" (true = visible, false = masqué)
    available: true,

    // Page de politique de confidentialité (bandeau cookies)
    privacyUrl: 'privacy.html#gestion-cookies'
};