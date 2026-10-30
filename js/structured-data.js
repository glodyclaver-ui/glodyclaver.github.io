/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

// ============================================================
// DONNÉES STRUCTURÉES SCHEMA.ORG — IDENTITÉ PROFESSIONNELLE
// ============================================================

(() => {

  'use strict';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",

    "@id": "https://glodyclaver-ui.github.io/glodyclaver.github.io/#person",

    "name": "Glody Claver",

    "url": "https://glodyclaver-ui.github.io/glodyclaver.github.io/",

    "image": "https://glodyclaver-ui.github.io/glodyclaver.github.io/images/CLAVER%20LOGO.png",

    "logo": {
      "@type": "ImageObject",
      "url": "https://glodyclaver-ui.github.io/glodyclaver.github.io/images/CLAVER%20LOGO.png"
    },

    "jobTitle": "Consultant Tech, Développeur et Analyste",

    "description": "Portfolio professionnel de Glody Claver, consultant en technologies, développeur et analyste.",

    "sameAs": []

  };

  // Création du script JSON-LD.
  const script = document.createElement('script');

  script.type = 'application/ld+json';

  script.textContent = JSON.stringify(structuredData);

  // Insertion dans le document.
  document.head.appendChild(script);

})();