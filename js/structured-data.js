"use strict";

// ============================================================
// STRUCTURED DATA - PORTFOLIO GLODY CLAVER
// Schema.org / JSON-LD
// ============================================================

(function () {

    // ========================================================
    // 1. CONFIGURATION GÉNÉRALE
    // ========================================================

    const SITE_URL =
        "https://glodyclaver-ui.github.io/glodyclaver.github.io/";

    const LOGO_URL =
        SITE_URL + "images/CLAVER%20LOGO.png";


    // ========================================================
    // 2. DONNÉES STRUCTURÉES PRINCIPALES
    // ========================================================

    const structuredData = {

        "@context": "https://schema.org",

        "@graph": [

            // =================================================
            // PERSON - IDENTITÉ PROFESSIONNELLE
            // =================================================

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

                "description":
                    "Professionnel de l'informatique spécialisé dans l'analyse de données, le développement logiciel et web, l'administration des bases de données et des réseaux informatiques, le support informatique ainsi que la conception UX/UI.",

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


            // =================================================
            // WEBSITE - SITE INTERNET
            // =================================================

            {
                "@type": "WebSite",

                "@id": SITE_URL + "#website",

                "url": SITE_URL,

                "name": "Glody-Claver | Consultant Tech",

                "alternateName": "Glody Portfolio",

                "description":
                    "Portfolio professionnel de Glody Claver présentant ses compétences, ses projets et ses réalisations dans les domaines de l'informatique, du développement logiciel, de l'analyse de données et des technologies numériques.",

                "inLanguage": "fr-FR",

                "publisher": {
                    "@id": SITE_URL + "#person"
                }

            },


            // =================================================
            // PROFILEPAGE - PAGE DU PORTFOLIO
            // =================================================

            {
                "@type": "ProfilePage",

                "@id": SITE_URL + "#webpage",

                "url": SITE_URL,

                "name": "Portfolio professionnel de Glody Claver",

                "description":
                    "Découvrez le profil professionnel, les compétences techniques et les réalisations de Glody Claver dans les domaines de l'informatique et des technologies numériques.",

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


            // =================================================
            // CREATIVEWORK - RÉALISATIONS PROFESSIONNELLES
            // =================================================

            {
                "@type": "CreativeWork",

                "@id": SITE_URL + "#portfolio",

                "name":
                    "Réalisations professionnelles de Glody Claver",

                "description":
                    "Présentation des projets et réalisations professionnelles dans les domaines du développement logiciel, du développement web, de l'analyse de données, de l'administration des bases de données et des réseaux informatiques.",

                "url": SITE_URL + "#portfolio",

                "creator": {
                    "@id": SITE_URL + "#person"
                },

                "author": {
                    "@id": SITE_URL + "#person"
                },

                "image": LOGO_URL,

                "inLanguage": "fr-FR"

            }

        ]

    };


    // ========================================================
    // 3. FAQPAGE - GÉNÉRATION AUTOMATIQUE DES QUESTIONS
    // ========================================================

    function generateFAQStructuredData() {

        // Recherche du conteneur principal de la FAQ
        const faqContainer = document.querySelector(
            "#faq-zone .faq-accordion-group"
        );

        // Vérification de l'existence du conteneur
        if (!faqContainer) {
            return;
        }

        // Récupération de toutes les questions
        const faqItems = Array.from(
            faqContainer.querySelectorAll(".faq-item")
        );

        // Extraction des questions et réponses
        const faqQuestions = faqItems

            .map(function (item) {

                const questionElement = item.querySelector(
                    ".faq-title-text"
                );

                const answerElement = item.querySelector(
                    ".faq-content"
                );

                // Vérification des éléments
                if (!questionElement || !answerElement) {
                    return null;
                }

                // Extraction du texte de la question
                const question = questionElement.textContent
                    .replace(/\s+/g, " ")
                    .trim();

                // Extraction du texte de la réponse
                const answer = answerElement.textContent
                    .replace(/\s+/g, " ")
                    .trim();

                // Ignorer les éléments vides
                if (!question || !answer) {
                    return null;
                }

                // Construction de l'objet Schema.org
                return {

                    "@type": "Question",

                    "name": question,

                    "acceptedAnswer": {

                        "@type": "Answer",

                        "text": answer

                    }

                };

            })

            .filter(Boolean);


        // Aucune FAQ valide : arrêt
        if (faqQuestions.length === 0) {
            return;
        }


        // ====================================================
        // SUPPRESSION D'UNE ANCIENNE FAQPAGE
        // ====================================================

        structuredData["@graph"] = structuredData["@graph"].filter(
            function (entity) {

                return entity["@type"] !== "FAQPage";

            }
        );


        // ====================================================
        // CONSTRUCTION DE LA NOUVELLE FAQPAGE
        // ====================================================

        const faqSchema = {

            "@type": "FAQPage",

            "@id": SITE_URL + "#faq",

            "url": SITE_URL + "#faq",

            "name": "Questions fréquentes - Glody Claver",

            "description":
                "Questions fréquentes concernant le profil professionnel, les compétences, les technologies et les services de Glody Claver.",

            "inLanguage": "fr-FR",

            "mainEntity": faqQuestions

        };


        // Ajout de la FAQ au graphe principal
        structuredData["@graph"].push(faqSchema);

    }


    // ========================================================
    // 4. INITIALISATION DU SCHÉMA FAQ
    // ========================================================

    function initializeStructuredData() {

        generateFAQStructuredData();


        // ====================================================
        // 5. PROTECTION CONTRE LES INJECTIONS MULTIPLES
        // ====================================================

        if (
            document.querySelector(
                'script[data-schema="glody-structured-data"]'
            )
        ) {
            return;
        }


        // ====================================================
        // 6. CRÉATION DU SCRIPT JSON-LD
        // ====================================================

        const schemaScript = document.createElement("script");

        schemaScript.type = "application/ld+json";

        schemaScript.dataset.schema = "glody-structured-data";

        schemaScript.textContent = JSON.stringify(
            structuredData
        );


        // ====================================================
        // 7. INJECTION DANS LE DOCUMENT HTML
        // ====================================================

        (document.head || document.documentElement)
            .appendChild(schemaScript);


        // ====================================================
        // 8. CONFIRMATION DANS LA CONSOLE
        // ====================================================

        console.info(
            "[Schema.org] Données structurées initialisées avec succès."
        );

        console.info(
            "[Schema.org] Questions FAQ détectées :",
            structuredData["@graph"].find(
                function (entity) {
                    return entity["@type"] === "FAQPage";
                }
            )?.mainEntity.length || 0
        );

    }


    // ========================================================
    // 9. LANCEMENT APRÈS CHARGEMENT DU DOM
    // ========================================================

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeStructuredData,
            { once: true }
        );

    } else {

        initializeStructuredData();

    }

})();