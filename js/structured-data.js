"use strict";

// ============================================================
// STRUCTURED DATA - PORTFOLIO PROFESSIONNEL GLODY CLAVER
// Schema.org / JSON-LD
// Version dynamique optimisée
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
    // 2. STRUCTURE PRINCIPALE SCHEMA.ORG
    // ========================================================

    const structuredData = {

        "@context": "https://schema.org",

        "@graph": [

            // =================================================
            // 2.1 PERSON - IDENTITÉ PROFESSIONNELLE
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
                    "@id": SITE_URL + "#logo",
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
                    "R",
                    "SQL",
                    "C Sharp",
                    "Pythonp",
                    "Visual Basic.Net",
                    "Typescript",
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
                    "Support informatique",
                    "Digital Marketing",
                    "Design graphique",
                    "Conception de logos",
                    "Création graphique"

                ]

            },


            // =================================================
            // 2.2 WEBSITE - SITE INTERNET
            // =================================================

            {
                "@type": "WebSite",

                "@id": SITE_URL + "#website",

                "url": SITE_URL,

                "name": "Glody-Claver | Consultant Tech",

                "alternateName": "Glody Portfolio",

                "description":
                    "Portfolio professionnel de Glody Claver présentant ses compétences, ses projets et ses réalisations dans les domaines de l'informatique, du développement logiciel, de l'analyse de données, du design et des technologies numériques.",

                "inLanguage": "fr-FR",

                "publisher": {
                    "@id": SITE_URL + "#person"
                }

            },


            // =================================================
            // 2.3 PROFILEPAGE - PAGE PROFESSIONNELLE
            // =================================================

            {
                "@type": "ProfilePage",

                "@id": SITE_URL + "#webpage",

                "url": SITE_URL,

                "name": "Portfolio professionnel de Glody Claver",

                "description":
                    "Découvrez le profil professionnel, les compétences techniques, les services et les réalisations de Glody Claver dans les domaines de l'informatique, du développement, du design et des technologies numériques.",

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

            }

        ]

    };


    // ========================================================
    // 3. FONCTION DE NETTOYAGE DU TEXTE
    // ========================================================

    function extractText(element) {

        if (!element) {
            return "";
        }

        return element.textContent
            .replace(/\s+/g, " ")
            .trim();

    }


    // ========================================================
    // 4. FONCTION DE VALIDATION DES URL
    // ========================================================

    function getValidURL(value) {

        if (!value) {
            return null;
        }

        const cleanValue = value.trim();

        if (
            !cleanValue ||
            cleanValue === "#" ||
            cleanValue.startsWith("mailto:") ||
            cleanValue.startsWith("tel:") ||
            cleanValue.startsWith("javascript:")
        ) {
            return null;
        }

        try {

            const url = new URL(cleanValue, document.baseURI);

            if (
                url.protocol === "https:" ||
                url.protocol === "http:"
            ) {
                return url.href;
            }

        } catch (error) {

            console.warn(
                "[Schema.org] URL invalide :",
                cleanValue
            );

        }

        return null;

    }


    // ========================================================
    // 5. FAQPAGE - GÉNÉRATION AUTOMATIQUE
    // ========================================================

    function generateFAQStructuredData() {

        // Recherche de tous les éléments FAQ
        const faqItems = Array.from(
            document.querySelectorAll(
                "#faq-zone .faq-accordion-group .faq-item"
            )
        );

        if (faqItems.length === 0) {

            console.warn(
                "[Schema.org] Aucun élément FAQ détecté."
            );

            return;

        }


        // Extraction des questions et réponses
        const faqQuestions = faqItems

            .map(function (item) {

                const questionElement = item.querySelector(
                    ".faq-title-text"
                );

                const answerElement = item.querySelector(
                    ".faq-content"
                );


                if (!questionElement || !answerElement) {
                    return null;
                }


                const question = extractText(questionElement);

                const answer = extractText(answerElement);


                if (!question || !answer) {
                    return null;
                }


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


        if (faqQuestions.length === 0) {

            console.warn(
                "[Schema.org] Aucune question FAQ valide."
            );

            return;

        }


        // Suppression d'une ancienne FAQPage
        structuredData["@graph"] = structuredData["@graph"].filter(
            function (entity) {

                return entity["@type"] !== "FAQPage";

            }
        );


        // Construction de la FAQPage
        const faqSchema = {

            "@type": "FAQPage",

            "@id": SITE_URL + "#faq",

            "url": SITE_URL + "#faq",

            "name": "Questions fréquentes - Glody Claver",

            "description":
                "Questions fréquentes concernant le profil professionnel, les compétences, les technologies, les services et les réalisations de Glody Claver.",

            "inLanguage": "fr-FR",

            "mainEntity": faqQuestions

        };


        // Ajout au graphe
        structuredData["@graph"].push(faqSchema);


        console.info(
            "[Schema.org] Questions FAQ détectées :",
            faqQuestions.length
        );

    }


    // ========================================================
    // 6. PORTFOLIO - RÉCUPÉRATION DES CATÉGORIES
    // ========================================================

    function getProjectCategories(item) {

        const categoryNames = {

            "app": "Design",

            "card": "Development",

            "web": "Marketing"

        };


        return Array.from(item.classList)

            .filter(function (className) {

                return className.startsWith("filter-");

            })

            .map(function (className) {

                const category = className.replace(
                    "filter-",
                    ""
                );

                return categoryNames[category] || category;

            });

    }


    // ========================================================
    // 7. CREATIVEWORK - GÉNÉRATION AUTOMATIQUE DES PROJETS
    // ========================================================

    function generatePortfolioStructuredData() {

        // Recherche de la grille du portfolio
        const portfolioContainer = document.querySelector(
            "#portfolio .portfolio-container"
        );


        if (!portfolioContainer) {

            console.warn(
                "[Schema.org] Grille du portfolio introuvable."
            );

            return;

        }


        // Récupération de TOUS les projets
        const portfolioItems = Array.from(
            portfolioContainer.querySelectorAll(".portfolio-item")
        );


        // Création des entités individuelles
        const projects = portfolioItems

            .map(function (item, index) {

                // --------------------------------------------
                // TITRE DU PROJET
                // --------------------------------------------

                const titleElement = item.querySelector(
                    ".portfolio-info h4 a"
                );


                // --------------------------------------------
                // DESCRIPTION DU PROJET
                // --------------------------------------------

                const descriptionElement = item.querySelector(
                    ".portfolio-info p"
                );


                // --------------------------------------------
                // IMAGE DU PROJET
                // --------------------------------------------

                const imageElement = item.querySelector(
                    ".portfolio-wrap img"
                );


                // --------------------------------------------
                // LIEN DE DÉTAILS
                // --------------------------------------------

                const linkElement = item.querySelector(
                    ".portfolio-info .link-details"
                );


                // --------------------------------------------
                // VÉRIFICATION DES ÉLÉMENTS
                // --------------------------------------------

                if (!titleElement || !descriptionElement) {

                    console.warn(
                        "[Schema.org] Projet ignoré : titre ou description manquant.",
                        index + 1
                    );

                    return null;

                }


                // --------------------------------------------
                // EXTRACTION DU TITRE
                // --------------------------------------------

                const title = extractText(titleElement);


                // --------------------------------------------
                // EXTRACTION DE LA DESCRIPTION
                // --------------------------------------------

                const description = extractText(
                    descriptionElement
                );


                if (!title || !description) {
                    return null;
                }


                // --------------------------------------------
                // RÉCUPÉRATION DE L'IMAGE
                // --------------------------------------------

                let imageURL = null;

                let imageAlt = "";


                if (imageElement) {

                    const imageSource =
                        imageElement.currentSrc ||
                        imageElement.getAttribute("src");

                    imageAlt =
                        imageElement.getAttribute("alt") || "";


                    imageURL = getValidURL(imageSource);

                }


                // --------------------------------------------
                // RÉCUPÉRATION DU LIEN EXTERNE
                // --------------------------------------------

                let projectURL = null;


                if (linkElement) {

                    const href = linkElement.getAttribute("href");

                    projectURL = getValidURL(href);

                }


                // --------------------------------------------
                // RÉCUPÉRATION DES CATÉGORIES
                // --------------------------------------------

                const categories = getProjectCategories(item);


                // --------------------------------------------
                // IDENTIFIANT UNIQUE DU PROJET
                // --------------------------------------------

                const projectID =
                    SITE_URL + "#portfolio-project-" + (index + 1);


                // --------------------------------------------
                // CONSTRUCTION DE CREATIVEWORK
                // --------------------------------------------

                const project = {

                    "@type": "CreativeWork",

                    "@id": projectID,

                    "name": title,

                    "description": description,

                    "creator": {
                        "@id": SITE_URL + "#person"
                    },

                    "author": {
                        "@id": SITE_URL + "#person"
                    },

                    "inLanguage": "fr-FR"

                };


                // --------------------------------------------
                // AJOUT DE L'IMAGE
                // --------------------------------------------

                if (imageURL) {

                    project.image = {

                        "@type": "ImageObject",

                        "url": imageURL

                    };

                    if (imageAlt.trim()) {

                        project.image.description =
                            imageAlt.trim();

                    }

                }


                // --------------------------------------------
                // AJOUT DU LIEN DU PROJET
                // --------------------------------------------

                if (projectURL) {

                    project.url = projectURL;

                }


                // --------------------------------------------
                // AJOUT DES CATÉGORIES
                // --------------------------------------------

                if (categories.length > 0) {

                    project.genre = categories;

                }


                // Retour du projet
                return project;

            })

            .filter(Boolean);


        // ====================================================
        // SUPPRESSION DES ANCIENNES ENTITÉS PORTFOLIO
        // ====================================================

        structuredData["@graph"] = structuredData["@graph"].filter(
            function (entity) {

                return !(
                    entity["@type"] === "CreativeWork" &&
                    entity["@id"] &&
                    entity["@id"].startsWith(
                        SITE_URL + "#portfolio-project-"
                    )
                );

            }
        );


        // ====================================================
        // AJOUT DE TOUS LES PROJETS AU GRAPHE
        // ====================================================

        structuredData["@graph"].push(...projects);


        // ====================================================
        // INFORMATIONS DE CONTRÔLE
        // ====================================================

        console.info(
            "[Schema.org] Projets détectés :",
            portfolioItems.length
        );

        console.info(
            "[Schema.org] Projets valides :",
            projects.length
        );

    }


    // ========================================================
    // 8. INITIALISATION GÉNÉRALE
    // ========================================================

    function initializeStructuredData() {

        // --------------------------------------------
        // GÉNÉRATION DE LA FAQ
        // --------------------------------------------

        generateFAQStructuredData();


        // --------------------------------------------
        // GÉNÉRATION DU PORTFOLIO
        // --------------------------------------------

        generatePortfolioStructuredData();


        // --------------------------------------------
        // PROTECTION CONTRE LES DOUBLONS
        // --------------------------------------------

        if (
            document.querySelector(
                'script[data-schema="glody-structured-data"]'
            )
        ) {

            console.warn(
                "[Schema.org] Le JSON-LD existe déjà."
            );

            return;

        }


        // --------------------------------------------
        // CRÉATION DU SCRIPT JSON-LD
        // --------------------------------------------

        const schemaScript = document.createElement("script");

        schemaScript.type = "application/ld+json";

        schemaScript.dataset.schema =
            "glody-structured-data";


        // --------------------------------------------
        // CONVERSION EN JSON
        // --------------------------------------------

        schemaScript.textContent = JSON.stringify(
            structuredData
        );


        // --------------------------------------------
        // INJECTION DANS LE DOCUMENT
        // --------------------------------------------

        (document.head || document.documentElement)
            .appendChild(schemaScript);


        // --------------------------------------------
        // CONFIRMATION
        // --------------------------------------------

        console.info(
            "[Schema.org] Données structurées initialisées avec succès."
        );

        console.info(
            "[Schema.org] Total des entités :",
            structuredData["@graph"].length
        );

    }


    // ========================================================
    // 9. DÉMARRAGE APRÈS CHARGEMENT DU DOM
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