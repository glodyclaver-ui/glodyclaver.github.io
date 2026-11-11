/* ============================================================
   JAVASCRIPT GLOBAL 4.0 — VERSION OPTIMISÉE
   Auteur : Glody Claver
   Objectif : Performance, accessibilité, stabilité et sécurité
============================================================ */

(() => {
    'use strict';

    /* ========================================================
       1. CONFIGURATION GLOBALE
    ======================================================== */

    const CONFIG = {
        splashDuration: 2100,
        typingSpeed: 65,
        deletingSpeed: 35,
        typingPause: 1800,
        deletingPause: 450,
        counterDuration: 2000,
        portfolioThreshold: 0.08,
        scrollThreshold: 250,
        logoRotation: 15
    };

    const SELECTORS = {
        body: 'body',
        header: 'header',
        splash: '#splash-screen',
        typedText: '#typed-text',
        navMenu: '.menu-content',
        navOpen: '.navOpen-btn',
        navClose: '.navClose-btn',
        scrollUp: '.scrollUp-btn',
        portfolio: '#portfolio',
        portfolioItem: '.portfolio-item',
        portfolioFilters: '#portfolio-flters li',
        portfolioLightbox: '#portfolio-lightbox',
        galleryModal: '#galerie-travail-modal-unique',
        galleryImage: '#galerie-travail-img-unique',
        logoTrack: '#pisteLogosTravailUnique',
        logoZone: '.partenaires-decor-3d',
        counters: '.compteur',
        toggleCertsBtn: '#toggle-certs-btn',
        moreCertsBlock: '#more-certs-block',
        certificationsSection: '#certifications'
    };

    const DOM = {};

    const reducedMotion = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    let scrollFrame = null;
    let typingTimer = null;
    let splashTimer = null;

    const lockedModals = new Set();
    let previousBodyOverflow = '';
    let previousHtmlOverflow = '';

    /* ========================================================
       2. INITIALISATION DOM
    ======================================================== */

    function cacheDOM() {
        DOM.body = document.body;
        DOM.html = document.documentElement;
        DOM.header = document.querySelector(SELECTORS.header);
        DOM.splash = document.querySelector(SELECTORS.splash);
        DOM.typedText = document.querySelector(SELECTORS.typedText);
        DOM.navMenu = document.querySelector(SELECTORS.navMenu);
        DOM.navOpen = document.querySelector(SELECTORS.navOpen);
        DOM.navClose = document.querySelector(SELECTORS.navClose);
        DOM.scrollUp = document.querySelector(SELECTORS.scrollUp);
        
        // Déclaration et mise en cache de la section Formations :
        DOM.toggleCertsBtn = document.querySelector(SELECTORS.toggleCertsBtn);
        DOM.moreCertsBlock = document.querySelector(SELECTORS.moreCertsBlock);
        DOM.certificationsSection = document.querySelector(SELECTORS.certificationsSection);

        DOM.portfolioModal = document.querySelector(
            SELECTORS.portfolioLightbox
        );

        DOM.galleryModal = document.querySelector(
            SELECTORS.galleryModal
        );

        DOM.galleryImage = document.querySelector(
            SELECTORS.galleryImage
        );

        DOM.logoTrack = document.querySelector(
            SELECTORS.logoTrack
        );

        DOM.logoZone = document.querySelector(
            SELECTORS.logoZone
        );
    }

    /* ========================================================
       3. OUTILS UTILITAIRES
    ======================================================== */

    const Utils = {

        exists(element) {
            return element !== null && element !== undefined;
        },

        safeQuery(selector, parent = document) {
            try {
                return parent.querySelector(selector);
            } catch (error) {
                return null;
            }
        },

        safeQueryAll(selector, parent = document) {
            try {
                return Array.from(parent.querySelectorAll(selector));
            } catch (error) {
                return [];
            }
        },

        debounce(callback, delay = 150) {
            let timer;

            return (...args) => {
                clearTimeout(timer);

                timer = setTimeout(() => {
                    callback.apply(null, args);
                }, delay);
            };
        },

        throttleFrame(callback) {
            let frame = null;

            return (...args) => {
                if (frame !== null) return;

                frame = requestAnimationFrame(() => {
                    callback.apply(null, args);
                    frame = null;
                });
            };
        },

        isVisible(element) {
            return !!(
                element &&
                element.getClientRects().length &&
                getComputedStyle(element).visibility !== 'hidden'
            );
        }
    };

    /* ========================================================
       4. VERROUILLAGE DU DÉFILEMENT
    ======================================================== */

    function lockPage(modalName) {
        if (lockedModals.has(modalName)) return;

        if (lockedModals.size === 0) {
            previousBodyOverflow = DOM.body.style.overflow;
            previousHtmlOverflow = DOM.html.style.overflow;

            DOM.body.style.overflow = 'hidden';
            DOM.html.style.overflow = 'hidden';
        }

        lockedModals.add(modalName);
    }

    function unlockPage(modalName) {
        lockedModals.delete(modalName);

        if (lockedModals.size === 0) {
            DOM.body.style.overflow = previousBodyOverflow;
            DOM.html.style.overflow = previousHtmlOverflow;
        }
    }

    /* ========================================================
       5. SPLASH SCREEN
    ======================================================== */

    const SPLASH_KEY = 'gc_splash_seen';

    function hasSeenSplash() {
        try {
            return sessionStorage.getItem(SPLASH_KEY) === '1';
        } catch (error) {
            return false; // stockage bloque : on affiche le splash
        }
    }

    function markSplashSeen() {
        try {
            sessionStorage.setItem(SPLASH_KEY, '1');
        } catch (error) {
            // Pas grave : le splash s'affichera a chaque chargement.
        }
    }

    function handleSplashScreen() {
        const splash = DOM.splash;

        if (!splash) return;

        // Deja vu pendant cette session (actualisation, autre page) ou animations reduites
        if (hasSeenSplash() || reducedMotion) {
            splash.style.display = 'none';
            return;
        }

        // Note des le debut : une actualisation pendant l'animation ne la rejoue pas
        markSplashSeen();

        lockPage('splash');

        let closed = false;

        function closeSplash() {
            if (closed) return;

            closed = true;

            clearTimeout(splashTimer);

            splash.classList.add('fade-out');

            window.setTimeout(() => {
                splash.style.display = 'none';
                unlockPage('splash');
            }, 700);
        }

        splash.addEventListener('animationend', event => {
            if (
                event.target === splash &&
                event.animationName === 'vanishOut'
            ) {
                closeSplash();
            }
        });

        splashTimer = window.setTimeout(
            closeSplash,
            CONFIG.splashDuration
        );
    }

    /* ==========================================================================
   6. EFFET D'ÉCRITURE AUTOMATIQUE AVEC ÉLÉVATION VERTICALE
   ========================================================================== */

    const typingWords = [
        'DATA ANALYST',
        'DIGITAL MARKETING',
        'GRAPHISTE',
        'IT SUPPORT',
        'WEBDESIGNER',
        'ANALYSTE PROGRAMMEUR',
        'DÉVELOPPEUR LOGICIEL',
        'CONCEPTEUR DE BDD',
        'ADMINISTRATEUR RÉSEAU',
        'UX-UI DESIGNER'
    ];

    let typingState = {
        wordIndex: 0,
        charIndex: 0,
        isWaiting: false
    };

    function typeEffect() {
        const container = DOM.typedText;
        if (!container || typingWords.length === 0) return;

        // Mode accessibilité (sans animation)
        if (reducedMotion) {
            container.innerHTML = `<div class="skill-line active-line">${typingWords[0]}</div>`;
            return;
        }

        const currentWord = typingWords[typingState.wordIndex];

        // Initialisation ou récupération de la ligne active
        let activeLine = container.querySelector('.skill-line.active-line');
        if (!activeLine) {
            container.innerHTML = '<div class="skill-line active-line"></div>';
            activeLine = container.querySelector('.skill-line.active-line');
        }

        if (!typingState.isWaiting) {
            typingState.charIndex++;
            activeLine.textContent = currentWord.substring(0, typingState.charIndex);

            // Si le mot est entièrement écrit
            if (typingState.charIndex >= currentWord.length) {
                typingState.isWaiting = true;
                
                // Temps de pause pendant lequel le mot reste fixe et visible en noir
                typingTimer = setTimeout(() => {
                    // 1. L'ancien mot perd son état actif, monte et devient gris clair
                    activeLine.classList.remove('active-line');
                    activeLine.classList.add('blurred-skill');

                    // 2. On prépare l'index du mot suivant
                    typingState.wordIndex = (typingState.wordIndex + 1) % typingWords.length;
                    typingState.charIndex = 0;
                    typingState.isWaiting = false;

                    // 3. On crée la nouvelle ligne en dessous pour le prochain mot
                    const newLine = document.createElement('div');
                    newLine.classList.add('skill-line', 'active-line');
                    container.appendChild(newLine);

                    // 4. Nettoyage : On ne garde que les 3 dernières lignes pour éviter d'encombrer le DOM
                    while (container.children.length > 3) {
                        container.removeChild(container.firstChild);
                    }

                    // Relance immédiate du cycle d'écriture pour le mot suivant
                    typeEffect();
                }, CONFIG.typingPause || 2000);

                return;
            }

            // Vitesse d'écriture lettre par lettre
            typingTimer = setTimeout(typeEffect, CONFIG.typingSpeed || 100);
        }
    }

    /* ==========================================================================
   7. GESTION DE L'AFFICHAGE EXTENSIBLE DES FORMATIONS ("VOIR PLUS")
   ========================================================================== */
    function initCertificationsToggle() {
        const toggleBtn = DOM.toggleCertsBtn;
        const hiddenBlock = DOM.moreCertsBlock;
        const section = DOM.certificationsSection;

        if (!toggleBtn || !hiddenBlock) return;

        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-controls', hiddenBlock.id);

        toggleBtn.addEventListener('click', () => {
            const willOpen = !hiddenBlock.classList.contains('is-open');

            hiddenBlock.classList.toggle('is-open', willOpen);
            toggleBtn.setAttribute('aria-expanded', String(willOpen));
            toggleBtn.innerHTML = willOpen
                ? 'RÉDUIRE <i class="ion-arrow-left-c"></i>'
                : 'VOIR TOUT <i class="ion-arrow-right-c"></i>';

            // A la fermeture, on remonte en haut de la section
            if (!willOpen && section) {
                section.scrollIntoView({
                    behavior: reducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    }

    /* ==========================================================================
       7.b OUVERTURE / FERMETURE DES TABLEAUX DE COMPÉTENCES
       ========================================================================== */
    function initSkillsShowcase() {
        const showcase = document.getElementById('skills-showcase');
        const details = document.getElementById('skills-details');
        const section = document.getElementById('skill');

        if (!showcase || !details) return;

        const panels = Utils.safeQueryAll('[data-skill-panel]', details);
        const openers = Utils.safeQueryAll('[data-skill-open]');
        const backButtons = [
            document.getElementById('skills-back'),
            document.getElementById('skills-back-footer')
        ].filter(Boolean);

        function scrollToSection() {
            if (!section) return;
            section.scrollIntoView({
                behavior: reducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }

        // Animation d'ouverture : compteur + compétences qui sortent une par une
        function animatePanel(panel) {
            if (!panel || reducedMotion) return;

            const items = Utils.safeQueryAll('.skill-item', panel);
            const count = panel.querySelector('.skill-category-count');

            items.forEach((item, index) => {
                item.style.setProperty('--i', index);
            });

            // On relance l'animation CSS à chaque ouverture
            panel.classList.remove('is-entering');
            void panel.offsetWidth;
            panel.classList.add('is-entering');

            if (count) {
                const total = items.length || parseInt(count.textContent, 10) || 0;
                const start = performance.now();
                const duration = 900;

                (function tick(now) {
                    const t = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - t, 3);

                    count.textContent =
                        Math.round(total * eased) + ' compétences';

                    if (t < 1) window.requestAnimationFrame(tick);
                })(start);
            }
        }

        function openPanel(name) {
            panels.forEach(panel => {
                panel.hidden = panel.getAttribute('data-skill-panel') !== name;
            });

            showcase.hidden = true;
            details.hidden = false;
            animatePanel(panels.find(panel => !panel.hidden));
            scrollToSection();
        }

        function closePanels() {
            panels.forEach(panel => { panel.hidden = true; });

            details.hidden = true;
            showcase.hidden = false;
            scrollToSection();
        }

        openers.forEach(button => {
            button.addEventListener('click', () => {
                openPanel(button.getAttribute('data-skill-open'));
            });
        });

        backButtons.forEach(button => {
            button.addEventListener('click', closePanels);
        });
    }

    /* ========================================================
       7. ANIMATIONS DES PROJETS AU SCROLL
    ======================================================== */

    function initPortfolioScrollAnimation() {
        const items = Utils.safeQueryAll(
            '#portfolio .portfolio-item'
        );

        if (!items.length) return;

        if (reducedMotion || !('IntersectionObserver' in window)) {
            items.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'none';
            });

            return;
        }

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {

                entries.forEach((entry, index) => {
                    if (!entry.isIntersecting) return;

                    const item = entry.target;

                    item.style.transition =
                        'opacity .65s ease, transform .65s ease';

                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });

                    currentObserver.unobserve(item);
                });
            },
            {
                root: null,
                rootMargin: '0px 0px -40px 0px',
                threshold: CONFIG.portfolioThreshold
            }
        );

        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';

            observer.observe(item);
        });
    }

    /* ========================================================
       8. MENU RESPONSIVE
    ======================================================== */

    function initResponsiveMenu() {
        const menu = DOM.navMenu;
        const openButton = DOM.navOpen;
        const closeButton = DOM.navClose;

        if (!menu || !openButton) return;

        function openMenu() {
            menu.classList.add('open');

            openButton.setAttribute('aria-expanded', 'true');

            lockPage('navigation');

            if (closeButton) {
                closeButton.focus();
            }
        }

        function closeMenu() {
            menu.classList.remove('open');

            openButton.setAttribute('aria-expanded', 'false');

            unlockPage('navigation');

            openButton.focus();
        }

        openButton.setAttribute('aria-expanded', 'false');

        openButton.addEventListener('click', openMenu);

        if (closeButton) {
            closeButton.addEventListener('click', closeMenu);
        }

        menu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');

                openButton.setAttribute('aria-expanded', 'false');

                unlockPage('navigation');
            });
        });

        document.addEventListener('keydown', event => {
            if (
                event.key === 'Escape' &&
                menu.classList.contains('open')
            ) {
                closeMenu();
            }
        });
    }

    /* ========================================================
       9. NAVIGATION ACTIVE ET HEADER DYNAMIQUE
    ======================================================== */

    function initScrollNavigation() {
        const header = DOM.header;
        const scrollButton = DOM.scrollUp;

        const sections = Utils.safeQueryAll('section[id]');

        const navigationLinks = sections
            .map(section => ({
                section,
                link: Utils.safeQuery(
                    `.menu-content a[href="#${section.id}"]`
                )
            }))
            .filter(item => item.link);

        function updateScrollState() {
            const scrollY = window.scrollY || window.pageYOffset;

            if (header) {
                header.classList.toggle(
                    'header-active',
                    scrollY > 5
                );
            }

            if (scrollButton) {
                scrollButton.classList.toggle(
                    'scrollUpBtn-active',
                    scrollY > CONFIG.scrollThreshold
                );
            }

            let currentSection = null;

            navigationLinks.forEach(({ section, link }) => {
                const top = section.offsetTop - 120;
                const bottom = top + section.offsetHeight;

                const active =
                    scrollY >= top &&
                    scrollY < bottom;

                link.classList.toggle(
                    'active-navlink',
                    active
                );

                if (active) {
                    currentSection = link;
                }
            });

            if (!currentSection && navigationLinks.length) {
                navigationLinks.forEach(({ link }) => {
                    link.classList.remove('active-navlink');
                });
            }
        }

        window.addEventListener(
            'scroll',
            () => {
                if (scrollFrame !== null) return;

                scrollFrame = requestAnimationFrame(() => {
                    updateScrollState();
                    scrollFrame = null;
                });
            },
            { passive: true }
        );

        window.addEventListener(
            'resize',
            Utils.debounce(updateScrollState, 150),
            { passive: true }
        );

        updateScrollState();
    }

    /* ========================================================
       10. BOUTON RETOUR EN HAUT
    ======================================================== */

    function initScrollTop() {
        if (!DOM.scrollUp) return;

        DOM.scrollUp.addEventListener('click', event => {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: reducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    /* ========================================================
       11. FILTRES DU PORTFOLIO
    ======================================================== */

    function initPortfolioFilters() {
        const tabs = Utils.safeQueryAll(
            SELECTORS.portfolioFilters
        );

        const cards = Utils.safeQueryAll(
            '#portfolio .portfolio-item'
        );

        if (!tabs.length || !cards.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {

                const filter = tab.getAttribute('data-filter');

                if (!filter) return;

                tabs.forEach(item => {
                    item.classList.remove('filter-active');
                });

                tab.classList.add('filter-active');

                const cleanFilter = filter.startsWith('.')
                    ? filter.slice(1)
                    : filter;

                cards.forEach(card => {
                    const visible =
                        filter === '*' ||
                        card.classList.contains(cleanFilter);

                    card.style.display = visible ? '' : 'none';

                    if (visible && !reducedMotion) {
                        card.style.animation =
                            'projectFadeInMatrix .4s ease forwards';
                    } else {
                        card.style.animation = '';
                    }
                });
            });
        });
    }

    /* ========================================================
       12. GESTION DES VISIONNEUSES
    ======================================================== */

    function openLightbox(modal, name) {
        if (!modal) return;

        modal.classList.add('lightbox-active');

        lockPage(name);
    }

    function closeLightbox(modal, name) {
        if (!modal) return;

        modal.classList.remove('lightbox-active');

        unlockPage(name);
    }

    function initPortfolioLightbox() {
        const modal = DOM.portfolioModal;

        const image = document.getElementById(
            'lightbox-target-img'
        );

        const title = document.getElementById(
            'lightbox-target-title'
        );

        const closeButton = document.querySelector(
            '.lightbox-close-btn'
        );

        const triggers = Utils.safeQueryAll(
            '.btn-trigger-lightbox'
        );

        if (!modal || !image) return;

        triggers.forEach(trigger => {
            trigger.addEventListener('click', event => {
                event.preventDefault();

                const imageSource = trigger.getAttribute('href');

                if (!imageSource) return;

                const card = trigger.closest('.portfolio-wrap');

                const mainTitle = card
                    ? Utils.safeQuery(
                        '.portfolio-info h4 a',
                        card
                    )
                    : null;

                const subTitle = card
                    ? Utils.safeQuery(
                        '.portfolio-info p',
                        card
                    )
                    : null;

                image.src = imageSource;

                image.alt = mainTitle
                    ? mainTitle.textContent.trim()
                    : 'Aperçu du projet';

                if (title) {
                    const first = mainTitle
                        ? mainTitle.textContent.trim()
                        : '';

                    const second = subTitle
                        ? subTitle.textContent.trim()
                        : '';

                    title.textContent = second
                        ? `${first} — ${second}`
                        : first;
                }

                openLightbox(modal, 'portfolio-lightbox');
            });
        });

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                closeLightbox(modal, 'portfolio-lightbox');
            });
        }

        modal.addEventListener('click', event => {
            if (event.target === modal) {
                closeLightbox(modal, 'portfolio-lightbox');
            }
        });
    }

    /* ========================================================
       13. GALERIE PHOTOS
    ======================================================== */

    function openGalleryPreview(imagePath) {
        if (!DOM.galleryModal || !DOM.galleryImage) return;

        if (!imagePath) return;

        DOM.galleryImage.src = imagePath;

        DOM.galleryImage.alt = 'Aperçu de la photographie';

        DOM.galleryModal.classList.add('galerie-travail-active');

        lockPage('gallery-lightbox');
    }

    function closeGalleryPreview(redirect = false) {
        if (DOM.galleryModal) {
            DOM.galleryModal.classList.remove(
                'galerie-travail-active'
            );
        }

        unlockPage('gallery-lightbox');

        if (redirect) {
            const form = document.getElementById('mon-formulaire');

            if (form) {
                form.scrollIntoView({
                    behavior: reducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        }
    }

    function initGallery() {
        if (!DOM.galleryModal) return;

        DOM.galleryModal.addEventListener('click', event => {
            if (event.target === DOM.galleryModal) {
                closeGalleryPreview(false);
            }
        });
    }

    /* ========================================================
       14. EXPOSITION DES FONCTIONS POUR LE HTML EXISTANT
    ======================================================== */

    window.ouvrirAperçuGalerie = openGalleryPreview;

    window.fermerGalerieEtRetourFormulaire = function(redirect = true) {
        closeGalleryPreview(redirect);
    };

        /* ========================================================
       15. COMPTEURS STATISTIQUES ANIMÉS
    ======================================================== */

    function initCounterStatistics() {
        const counters = Utils.safeQueryAll(
            SELECTORS.counters
        );

        if (!counters.length) return;

        if (!('IntersectionObserver' in window)) {
            counters.forEach(counter => {
                const target = Number(
                    counter.getAttribute('data-target')
                );

                if (Number.isFinite(target)) {
                    counter.textContent = target;
                }
            });

            return;
        }

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {

                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const counter = entry.target;

                    const finalValue = Number(
                        counter.getAttribute('data-target')
                    );

                    if (!Number.isFinite(finalValue)) {
                        currentObserver.unobserve(counter);
                        return;
                    }

                    const card = counter.closest('.carte-stat');

                    if (card) {
                        card.classList.add('active-glow');
                    }

                    if (reducedMotion) {
                        counter.textContent = finalValue;
                        currentObserver.unobserve(counter);
                        return;
                    }

                    const startTime = performance.now();

                    function animateCounter(currentTime) {
                        const elapsed = currentTime - startTime;

                        const progress = Math.min(
                            elapsed / CONFIG.counterDuration,
                            1
                        );

                        const eased = 1 - Math.pow(1 - progress, 3);

                        const currentValue =
                            finalValue * eased;

                        counter.textContent = Number.isInteger(finalValue)
                            ? Math.round(currentValue)
                            : currentValue.toFixed(1);

                        if (progress < 1) {
                            requestAnimationFrame(animateCounter);
                        } else {
                            counter.textContent = finalValue;
                        }
                    }

                    requestAnimationFrame(animateCounter);

                    currentObserver.unobserve(counter);
                });
            },
            {
                threshold: 0.3
            }
        );

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    /* ========================================================
       16. ANIMATION 3D DES LOGOS
    ======================================================== */

    function initLogoAnimation() {
        const zone = DOM.logoZone;
        const track = DOM.logoTrack;

        if (!zone || !track) return;

        const isTouchDevice =
            window.matchMedia('(hover: none)').matches ||
            window.matchMedia('(max-width: 768px)').matches;

        if (isTouchDevice || reducedMotion) return;

        let animationFrame = null;
        let targetAngle = 0;
        let currentAngle = 0;

        function updateRotation() {
            currentAngle += (targetAngle - currentAngle) * 0.12;

            track.style.transform =
                `rotateX(10deg) rotateY(${currentAngle}deg)`;

            if (Math.abs(targetAngle - currentAngle) > 0.01) {
                animationFrame = requestAnimationFrame(updateRotation);
            } else {
                animationFrame = null;
            }
        }

        zone.addEventListener('pointermove', event => {
            const rect = zone.getBoundingClientRect();

            if (!rect.width) return;

            const relativeX = (
                (event.clientX - rect.left) / rect.width
            );

            targetAngle = (
                (relativeX - 0.5) * CONFIG.logoRotation
            );

            if (animationFrame === null) {
                animationFrame = requestAnimationFrame(updateRotation);
            }
        }, { passive: true });

        zone.addEventListener('pointerleave', () => {
            targetAngle = 0;

            if (animationFrame === null) {
                animationFrame = requestAnimationFrame(updateRotation);
            }
        });
    }

    /* ========================================================
       17. GOOGLE ANALYTICS — VERSION RESPECTUEUSE DE LA VIE PRIVÉE
    ======================================================== */

    function trackEvent(eventName, parameters = {}) {
        if (typeof window.gtag !== 'function') return;

        try {
            window.gtag('event', eventName, parameters);
        } catch (error) {
            // Une erreur Analytics ne doit jamais bloquer le site.
        }
    }

    function initAnalytics() {

        // Téléchargement du CV
        const cvButton = document.querySelector(
            'a[href*="cv.pdf"]'
        );

        if (cvButton) {
            cvButton.addEventListener('click', () => {
                trackEvent('download_cv', {
                    event_category: 'Engagement',
                    event_label: 'Téléchargement CV'
                });
            });
        }

        // Bouton de contact
        const contactButton = document.querySelector(
            '.about-actions .link-contact'
        );

        if (contactButton) {
            contactButton.addEventListener('click', () => {
                trackEvent('click_contact_me', {
                    event_category: 'Engagement',
                    event_label: 'Bouton Contact'
                });
            });
        }

        // Réseaux sociaux
        const socialLinks = Utils.safeQueryAll(
            '.single-footer .social a'
        );

        socialLinks.forEach(link => {
            link.addEventListener('click', () => {
                const network =
                    link.getAttribute('aria-label') ||
                    'Réseau social';

                trackEvent('click_social_network', {
                    event_category: 'Social',
                    event_label: network
                });
            });
        });

        // IMPORTANT :
        // Aucun contenu de formulaire n'est transmis.
        // Aucun mot de passe, e-mail ou numéro de téléphone.
        // Aucun texte du presse-papiers.
        // Aucune URL complète contenant des paramètres.

        // État de connexion
        window.addEventListener('online', () => {
            trackEvent('pwa_network_status', {
                status: 'online'
            });
        });

        window.addEventListener('offline', () => {
            trackEvent('pwa_network_status', {
                status: 'offline'
            });
        });

        // Erreurs JavaScript anonymisées
        window.addEventListener('error', event => {
            trackEvent('javascript_error', {
                error_type: 'runtime_error',
                error_line: Number(event.lineno) || 0
            });
        });

        // Promesses rejetées
        window.addEventListener('unhandledrejection', () => {
            trackEvent('javascript_promise_error', {
                error_type: 'unhandled_rejection'
            });
        });
    }

    /* ========================================================
       18. SCROLLREVEAL — ANIMATIONS OPTIMISÉES
    ======================================================== */

    function initScrollReveal() {
        if (reducedMotion) return;

        if (typeof window.ScrollReveal !== 'function') {
            return;
        }

        let sr;

        try {
            const isSmallScreen = window.matchMedia(
                '(max-width: 768px)'
            ).matches;

            sr = window.ScrollReveal({
                origin: 'top',

                // Distance parcourue par les éléments
                distance: isSmallScreen ? '25px' : '55px',

                // Durée des animations
                duration: isSmallScreen ? 1200 : 1500,

                // Délai avant le démarrage
                delay: 200,

                // Transition plus douce
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',

                // Ne pas rejouer les animations
                reset: false,

                // Espacement entre les animations successives
                interval: 180,

                // Déclenchement lorsque l'élément est suffisamment visible
                viewFactor: 0.15,

                mobile: true
            });

        } catch (error) {
            return;
        }

        if (!sr) return;

        /* À PROPOS */
        sr.reveal(
            '.about .about-imageColumn.Slide-In-Left',
            { origin: 'left' }
        );

        sr.reveal(
            '.about .about-detailsColumn.Slide-In-Right',
            { origin: 'right' }
        );

        /* CODEUR */
        sr.reveal(
            '.about-me-section .sec-title, .about-me-section .sec-subtitle',
            { origin: 'top', interval: 200 }
        );

        sr.reveal(
            '.about-me-section .aboutme-tabs',
            { scale: 0.95, opacity: 0 }
        );

        /* SERVICES */
        sr.reveal(
            '.services-section-bg .services-section-title',
            { origin: 'top' }
        );

        sr.reveal(
            '.services-section-bg .services-card',
            { interval: 150 }
        );

        /* FEATURES */
        sr.reveal(
            '.Feautes .section-title',
            { origin: 'top' }
        );

        sr.reveal(
            '.feautes-grid-pure .feautes-item.fadeInLeft',
            { origin: 'left', duration: 1300 }
        );

        sr.reveal(
            '.feautes-grid-pure .feautes-item.fadeInRight',
            { origin: 'right', duration: 1300 }
        );

        sr.reveal(
            '.feautes-grid-pure .feautes-item.zoomIn',
            { scale: 0.9, opacity: 0, distance: '0px' }
        );

        /* PORTFOLIO */
        sr.reveal(
            '.clearfix .section-title',
            { origin: 'top' }
        );

        sr.reveal(
            '.clearfix .portfolio-filters-wrapper',
            { scale: 0.95, opacity: 0 }
        );

        /* RÉALISATIONS */
        sr.reveal(
            '.section-realisations .section-title',
            { origin: 'top' }
        );

        sr.reveal(
            '.section-realisations .carte-stat',
            { origin: 'bottom', interval: 150 }
        );

        /* DÉTAILS PORTFOLIO */
        sr.reveal(
            '.pf-details .section-title',
            { origin: 'top' }
        );

        sr.reveal(
            '.pf-details .aptitudes-card.fadeInLeft',
            { origin: 'left' }
        );

        sr.reveal(
            '.pf-details .aptitudes-card.fadeInRight',
            { origin: 'right' }
        );

        sr.reveal(
            '.pf-details .aptitudes-card.zoomIn',
            { scale: 0.9, opacity: 0 }
        );

        /* PARCOURS */
        sr.reveal(
            '.parcours-section .sec-title, .parcours-section .sec-subtitle',
            { origin: 'top', interval: 150 }
        );

        sr.reveal(
            '.parcours-section .parcours-side',
            { origin: 'left' }
        );

        /* COMPÉTENCES */
        sr.reveal(
            '.skill-section .skill-section-kicker, .skill-section .skill-section-description',
            { origin: 'top', interval: 150 }
        );

        /* CERTIFICATIONS ET LANGUES */
        sr.reveal(
            '.certlang-global-section .certlang-section-title, .certlang-global-section .certlang-column-headline',
            { origin: 'top', interval: 150 }
        );

        // Uniquement le bloc visible : le bloc masque "Voir tout" est anime en CSS
        sr.reveal(
            '.certlang-global-section .certlang-expandable-wrapper > .certlang-sub-grid .certlang-track-node',
            { origin: 'right' }
        );

        sr.reveal(
            '.certlang-global-section .certlang-sidebar-stack .certlang-home-text-row',
            { origin: 'right', interval: 120 }
        );

        /* FAQ ET CARTE */
        sr.reveal(
            '.faq-map-section .faq-column',
            { origin: 'left' }
        );

        sr.reveal(
            '.faq-map-section .map-column',
            { origin: 'right' }
        );

        /* PARTENAIRES ET TIMELINES */
        sr.reveal(
            '.partenaires-logos-section .logo-item-3d',
            { origin: 'bottom', interval: 110, scale: 0.9 }
        );

        sr.reveal(
            '.parcours-section .timeline-viewport',
            { origin: 'right', distance: '50px' }
        );

        sr.reveal(
            '.aboutme-display',
            { origin: 'right', distance: '40px' }
        );
    }

    /* ========================================================
       19. GESTION GLOBALE DE LA TOUCHE ÉCHAP
    ======================================================== */

    function initGlobalKeyboard() {
        document.addEventListener('keydown', event => {

            if (event.key !== 'Escape') return;

            if (
                DOM.portfolioModal &&
                DOM.portfolioModal.classList.contains('lightbox-active')
            ) {
                closeLightbox(
                    DOM.portfolioModal,
                    'portfolio-lightbox'
                );
            }

            if (
                DOM.galleryModal &&
                DOM.galleryModal.classList.contains('galerie-travail-active')
            ) {
                closeGalleryPreview(false);
            }
        });
    }

    /* ========================================================
       20. INITIALISATION GLOBALE
    ======================================================== */

    function initializeWebsite() {

        if (!document.body) return;

        cacheDOM();

        handleSplashScreen();

        typeEffect();                  // un seul appel

        initPortfolioScrollAnimation();

        initResponsiveMenu();

        initScrollNavigation();

        initScrollTop();

        initPortfolioFilters();

        initPortfolioLightbox();

        initGallery();

        initCounterStatistics();

        initLogoAnimation();

        initAnalytics();

        initScrollReveal();

        initGlobalKeyboard();

        initCertificationsToggle();    // bouton "Voir tout" des formations

        initSkillsShowcase();          // cartes / tableaux de compétences

        initAboutTabs();               // à propos : onglets

        initParcoursTimelines();       // expérience / formation

        initScrollEffects();           // barre de progression + accueil recouvert

        initPageTransitions();         // transition entre les pages

        initGalleryFocus();            // galerie : photo centrale agrandie

        document.documentElement.style.overflowX = 'hidden';
    }

    /* ========================================================
       20b. A PROPOS : ONGLETS (identité / profil / vision)
    ======================================================== */

    function initAboutTabs() {
        const root = document.getElementById('aboutme-tabs');

        if (!root) return;

        const tabs = Utils.safeQueryAll('.aboutme-tab', root);
        const panels = Utils.safeQueryAll('.aboutme-content', root);
        const empty = root.querySelector('.aboutme-empty');

        function show(name) {
            tabs.forEach(tab => {
                tab.setAttribute(
                    'aria-selected',
                    String(tab.dataset.tab === name)
                );
            });

            panels.forEach(panel => {
                panel.hidden = panel.dataset.content !== name;
            });

            if (empty) empty.hidden = Boolean(name);
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const active = tab.getAttribute('aria-selected') === 'true';
                show(active ? '' : tab.dataset.tab);
            });
        });

        panels.forEach(panel => {
            const close = panel.querySelector('.aboutme-close');
            if (close) close.addEventListener('click', () => show(''));
        });

        // Echap = retour à l'état par défaut
        root.addEventListener('keydown', event => {
            if (event.key === 'Escape') show('');
        });

        show('');
    }

    /* ========================================================
       20c. EXPERIENCE / FORMATION : TIMELINES DEFILANTES
       - hauteur = 2 éléments visibles
       - la ligne bleue se remplit au défilement
    ======================================================== */

    function initParcoursTimelines() {
        const viewports = Utils.safeQueryAll('[data-timeline]');

        viewports.forEach(viewport => {
            const scroller = viewport.querySelector('.timeline-scroll');
            const timeline = viewport.querySelector('.timeline');
            const fill = viewport.querySelector('.timeline-fill');
            const items = Utils.safeQueryAll('.timeline-item', timeline);

            if (!scroller || !timeline || !fill || !items.length) return;

            function setHeight() {
                // 2 éléments visibles (limité à la hauteur de l'écran sur mobile)
                const last = items[Math.min(2, items.length) - 1];
                let height = last.offsetTop + last.offsetHeight + 8;

                height = Math.min(height, Math.round(window.innerHeight * 0.85));
                scroller.style.maxHeight = height + 'px';
            }

            function update() {
                const max = scroller.scrollHeight - scroller.clientHeight;
                const top = scroller.scrollTop;
                const reach = top + scroller.clientHeight;
                const ratio = Math.min(1, reach / scroller.scrollHeight);

                // Ligne bleue : proportionnelle au bas de la zone visible
                fill.style.height = Math.round(ratio * timeline.offsetHeight) + 'px';

                // Icône colorée une fois atteinte par la ligne
                items.forEach(item => {
                    item.classList.toggle(
                        'is-reached',
                        item.offsetTop + 42 <= reach
                    );
                });

                // Le dégradé du bas disparaît en fin de liste
                viewport.classList.toggle('is-end', max <= 2 || top >= max - 2);
            }

            let ticking = false;

            scroller.addEventListener('scroll', () => {
                if (ticking) return;
                ticking = true;

                window.requestAnimationFrame(() => {
                    update();
                    ticking = false;
                });
            }, { passive: true });

            function refresh() {
                setHeight();
                update();
            }

            window.addEventListener('resize', refresh);
            window.addEventListener('load', refresh);

            refresh();
        });
    }

    /* ========================================================
       20d. TRANSITIONS : progression, accueil recouvert, pages
    ======================================================== */

    function initScrollEffects() {
        // Barre de progression de lecture
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        bar.setAttribute('aria-hidden', 'true');
        document.body.appendChild(bar);

        const home = document.getElementById('home');
        let ticking = false;

        function update() {
            const doc = document.documentElement;
            const max = doc.scrollHeight - window.innerHeight;
            const y = window.pageYOffset || doc.scrollTop || 0;

            bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';

            // L'accueil s'efface légèrement pendant que la section suivante monte dessus
            if (home && !reducedMotion) {
                const cover = Math.max(0, Math.min(1, y / (home.offsetHeight || 1)));
                home.style.setProperty('--cover', cover.toFixed(3));
            }

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        }, { passive: true });

        window.addEventListener('resize', update);
        update();
    }

    function initPageTransitions() {
        if (reducedMotion) return;

        const root = document.documentElement;

        document.addEventListener('click', event => {
            const link = event.target.closest ? event.target.closest('a[href]') : null;

            if (
                !link ||
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
            ) return;

            if (link.target && link.target !== '_self') return;
            if (link.hasAttribute('download')) return;

            let url;

            try {
                url = new URL(link.href, window.location.href);
            } catch (error) {
                return;
            }

            // Pages du même site uniquement (mailto:, liens externes, ancres : rien à faire)
            if (!/^https?:$|^file:$/.test(url.protocol)) return;
            if (url.origin !== window.location.origin) return;
            if (url.pathname === window.location.pathname) return;

            event.preventDefault();

            try {
                sessionStorage.setItem('gc_page_transition', '1');
            } catch (error) {}

            root.classList.add('page-leaving');

            window.setTimeout(() => {
                window.location.href = link.href;
            }, 560);
        });

        // Retour arrière du navigateur : on retire le rideau
        window.addEventListener('pageshow', event => {
            if (event.persisted) {
                root.classList.remove('page-leaving');
            }
        });
    }

    /* ========================================================
       20e. GALERIE : la photo du milieu est la plus grande,
       les côtés rétrécissent et changent de forme.
    ======================================================== */

    function initGalleryFocus() {
        const axis = document.querySelector('.galerie-axe-defilement');

        if (!axis) return;

        const cards = Utils.safeQueryAll('.galerie-carte', axis);

        if (!cards.length || reducedMotion) return;

        let visible = false;
        let rafId = 0;

        function frame() {
            const box = axis.getBoundingClientRect();
            const center = box.left + box.width / 2;
            const reach = Math.max(180, box.width * 0.36);

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const raw = Math.max(0, 1 - Math.abs(cx - center) / reach);
                const p = raw * raw * (3 - 2 * raw);          // lissage

                card.style.setProperty('--p', p.toFixed(3));
                card.style.setProperty('--s', (0.66 + 0.5 * p).toFixed(3));
                // même arrondi sur les 4 coins ; il grandit un peu vers le centre
                // (valeur divisée par l'échelle pour garder un arrondi visuel constant)
                const scale = 0.66 + 0.5 * p;
                card.style.setProperty('--rt', Math.round((40 + 26 * p) / scale) + 'px');
            });

            rafId = visible ? window.requestAnimationFrame(frame) : 0;
        }

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                visible = entries[0].isIntersecting;

                if (visible && !rafId) {
                    rafId = window.requestAnimationFrame(frame);
                }
            }).observe(axis);
        } else {
            visible = true;
            rafId = window.requestAnimationFrame(frame);
        }
    }

    /* ========================================================
       21. DÉMARRAGE COMPATIBLE AVEC TOUS LES CHARGEMENTS
    ======================================================== */

    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            initializeWebsite,
            { once: true }
        );

    } else {

        initializeWebsite();

    }

})();