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

  "name": "OLEKO DIOMBA Glodi-placide",

  "alternateName": [
    "Glody Claver",
    "Glody-Claver"
  ],

  "url": "https://glodyclaver-ui.github.io/glodyclaver.github.io/",

  "image": {
    "@type": "ImageObject",
    "url": "https://glodyclaver-ui.github.io/glodyclaver.github.io/images/CLAVER%20LOGO.png"
  },

  "jobTitle": [
    "Data Analyst",
    "Développeur logiciel",
    "Analyste programmeur",
    "Administrateur de bases de données",
    "Administrateur réseaux",
    "IT Support",
    "UX/UI Designer",
    "Web Designer"
  ],

  "description": "Portfolio professionnel de OLEKO DIOMBA Glodi-placide, connu sous le nom de Glody Claver. Spécialiste en analyse de données, développement logiciel, administration de bases de données et réseaux, support informatique, conception UX/UI et développement web.",

  "knowsAbout": [
    "Data Analysis",
    "Data Analytics",
    "Développement logiciel",
    "Développement web",
    "PHP",
    "JavaScript",
    "C++",
    "MySQL",
    "Administration de bases de données",
    "Administration réseaux",
    "Cybersécurité",
    "UX Design",
    "UI Design",
    "Web Design",
    "Support informatique"
  ],

  "sameAs": []

};

  // Création du script JSON-LD.
  const script = document.createElement('script');

  script.type = 'application/ld+json';

  script.textContent = JSON.stringify(structuredData);

  // Insertion dans le document.
  document.head.appendChild(script);

})();