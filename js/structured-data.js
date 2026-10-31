/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

// ============================================================
// SCHEMA.ORG — DONNÉES STRUCTURÉES COMPLÈTES
// IDENTITÉ PROFESSIONNELLE, PORTFOLIO ET RÉALISATIONS
// ============================================================

(() => {

  'use strict';

  // ==========================================================
  // 1. CONFIGURATION GÉNÉRALE
  // ==========================================================

  const SITE_URL =
    'https://glodyclaver-ui.github.io/glodyclaver.github.io/';

  const LOGO_URL =
    SITE_URL + 'images/CLAVER%20LOGO.png';

  // ==========================================================
  // 2. DONNÉES STRUCTURÉES
  // ==========================================================

  const structuredData = {

    "@context": "https://schema.org",

    "@graph": [

      // ======================================================
      // 1. IDENTITÉ PROFESSIONNELLE — PERSON
      // ======================================================

      {
        "@type": "Person",

        "@id": SITE_URL + "#person",

        "name": "OLEKO DIOMBA Glodi-placide",

        "alternateName": [
          "Glody Claver",
          "Glody-Claver"
        ],

        "url": SITE_URL,

        "image": {
          "@type": "ImageObject",
          "url": LOGO_URL
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

        "description": "Portfolio professionnel de OLEKO DIOMBA Glodi-placide, connu sous le nom de Glody Claver. Spécialisé dans l'analyse de données, le développement logiciel, l'administration de bases de données et réseaux, le support informatique, la conception UX/UI et le développement web.",

        "knowsAbout": [
          "Data Analysis",
          "Data Analytics",
          "Développement logiciel",
          "Développement web",
          "PHP",
          "JavaScript",
          "C++",
          "HTML",
          "CSS",
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

      },

      // ======================================================
      // 2. SITE WEB — WEBSITE
      // ======================================================

      {
        "@type": "WebSite",

        "@id": SITE_URL + "#website",

        "url": SITE_URL,

        "name": "Glody-Claver | Consultant Tech",

        "alternateName": "Glody Portfolio",

        "description": "Portfolio professionnel de Glody Claver présentant ses compétences, ses réalisations et ses projets dans les domaines des technologies, du développement logiciel et des réseaux.",

        "inLanguage": "fr-FR",

        "publisher": {
          "@id": SITE_URL + "#person"
        }

      },

      // ======================================================
      // 3. PAGE PRINCIPALE — WEBPAGE
      // ======================================================

      {
        "@type": "ProfilePage",

        "@id": SITE_URL + "#webpage",

        "url": SITE_URL,

        "name": "Portfolio professionnel de Glody Claver",

        "description": "Découvrez le parcours professionnel, les compétences techniques et les réalisations de Glody Claver.",

        "isPartOf": {
          "@id": SITE_URL + "#website"
        },

        "about": {
          "@id": SITE_URL + "#person"
        },

        "mainEntity": {
          "@id": SITE_URL + "#person"
        },

        "inLanguage": "fr-FR"

      },

      // ======================================================
      // 4. PORTFOLIO ET RÉALISATIONS — CREATIVEWORK
      // ======================================================

      {
        "@type": "CreativeWork",

        "@id": SITE_URL + "#portfolio",

        "name": "Réalisations professionnelles de Glody Claver",

        "description": "Collection de réalisations professionnelles comprenant des projets de développement logiciel, de conception web, de création graphique, de bases de données et de solutions informatiques.",

        "url": SITE_URL + "#portfolio",

        "creator": {
          "@id": SITE_URL + "#person"
        },

        "author": {
          "@id": SITE_URL + "#person"
        },

        "image": LOGO_URL,

        "inLanguage": "fr-FR"

      },

      // ======================================================
      // 5. QUESTIONS FRÉQUENTES — FAQPAGE
      // ======================================================

      {
        "@type": "FAQPage",

        "@id": SITE_URL + "#faq",

        "url": SITE_URL + "#faq",

        "name": "Questions fréquentes — Glody Claver",

        "inLanguage": "fr-FR",

        "mainEntity": [

          {
            "@type": "Question",

            "name": "Quelles sont les compétences professionnelles de Glody Claver ?",

            "acceptedAnswer": {
              "@type": "Answer",

              "text": "Glody Claver possède des compétences dans l'analyse de données, le développement logiciel, la programmation, l'administration de bases de données et réseaux, le support informatique, le développement web et la conception UX/UI."
            }

          },

          {
            "@type": "Question",

            "name": "Quelles technologies sont utilisées dans ses projets ?",

            "acceptedAnswer": {
              "@type": "Answer",

              "text": "Les technologies utilisées dépendent des besoins de chaque projet. Elles comprennent notamment PHP, JavaScript, C++, HTML, CSS et MySQL."
            }

          },

          {
            "@type": "Question",

            "name": "Quels types de projets réalise Glody Claver ?",

            "acceptedAnswer": {
              "@type": "Answer",

              "text": "Ses réalisations couvrent notamment le développement de logiciels, la conception de sites web, la création graphique, la gestion de bases de données et les solutions informatiques."
            }

          },

          {
            "@type": "Question",

            "name": "Comment contacter Glody Claver pour une collaboration ?",

            "acceptedAnswer": {
              "@type": "Answer",

              "text": "Les personnes intéressées peuvent utiliser le formulaire de contact disponible sur son portfolio professionnel pour présenter leur besoin ou proposer une collaboration."
            }

          }

        ]

      }

    ]

  };

  // ==========================================================
  // 3. INJECTION DES DONNÉES STRUCTURÉES DANS LE HTML
  // ==========================================================

  // Éviter les injections multiples.
  if (
    document.querySelector(
      'script[data-schema="glody-structured-data"]'
    )
  ) {
    return;
  }

  // Création du script JSON-LD.
  const schemaScript = document.createElement('script');

  schemaScript.type = 'application/ld+json';

  schemaScript.dataset.schema = 'glody-structured-data';

  schemaScript.textContent = JSON.stringify(structuredData);

  // Insertion dans le document.
  (document.head || document.documentElement)
    .appendChild(schemaScript);

  console.info(
    '[Schema.org] Données structurées chargées avec succès.'
  );

})();