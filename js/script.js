/*
  JavaScript Global Modifié & Optimisé
  Author Name: OLEKO DIOMBA Glodi-placide glody-claver
  3.0 license (glody_claver/license)
*/

// ==================== VARIABLES GLOBALES PARTAGÉES ====================
const globalBody = document.querySelector('body');
const globalHeader = document.querySelector("header");
const globalScrollUpBtn = document.querySelector('.scrollUp-btn');
const globalNavMenu = globalBody ? globalBody.querySelector('.menu-content') : null;
const globalSplashScreen = document.getElementById('splash-screen'); 

const portfolioSections = document.querySelectorAll('section[id]');
const cachedNavLinks = [];

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual'; // Empêche le navigateur de restaurer l'ancienne position au refresh
}
window.scrollTo(0, 0);

if (portfolioSections.length > 0) {
  portfolioSections.forEach(section => {
    const navLink = document.querySelector(`.menu-content a[href='#${section.id}']`);
    if (navLink) {
      cachedNavLinks.push({ section, navLink });
      
      navLink.addEventListener("click", () => {
        if (globalNavMenu) globalNavMenu.classList.remove("open");
        if (globalBody) globalBody.classList.remove('hide-scrollbar'); 
      });
    }
  });
}

// ==================== 1. ANIMATION D'OUVERTURE SPLASH SCREEN ====================
function handleSplashScreen() {
  if (globalSplashScreen && globalBody) {
    globalBody.classList.add('hide-scrollbar');
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    globalSplashScreen.addEventListener('animationend', (e) => {
      if (e.animationName === 'vanishOut') {
        globalSplashScreen.style.display = 'none';
        globalBody.classList.remove('hide-scrollbar');
        document.documentElement.style.overflow = '';
        document.documentElement.style.overflowX = 'hidden';
        globalBody.style.overflowX = 'hidden';
        window.scrollTo(0, 0);
      }
    });

    setTimeout(() => {
      if (globalSplashScreen.style.display !== 'none') {
        globalSplashScreen.style.display = 'none';
        globalBody.classList.remove('hide-scrollbar');
        document.documentElement.style.overflow = '';
        document.documentElement.style.overflowX = 'hidden';
        globalBody.style.overflowX = 'hidden';
        window.scrollTo(0, 0);
      }
    }, 2800); 
  }
}

// ==================== 2. EFFET D'ÉCRITURE AUTOMATIQUE SÉCURISÉ ====================
const words = [
  "DATA ANALYST", "DIGITAL MARKETING", "GRAPHISTE", "IT SUPPORT", "WEBDESIGNER",
  "ANALYSTE PROGRAMMEUR", "DÉVELOPPEUR LOGICIEL", "CONCEPTEUR DE BDD",
  "ADMINISTRATEUR RÉSEAU", "UX-UI DESIGNER"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextElement = document.getElementById('typed-text');

function typeEffect() {
  if (!typedTextElement) return;
  
  const currentWord = words[wordIndex];
  
  if (isDeleting) {
    typedTextElement.textContent = currentWord.substring(0, charIndex);
    charIndex--;
  } else {
    typedTextElement.textContent = currentWord.substring(0, charIndex);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 35 : 70;

  if (!isDeleting && charIndex > currentWord.length) {
    typeSpeed = 2000; 
    isDeleting = true;
  } else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    charIndex = 0;
    wordIndex = (wordIndex + 1) % words.length;
    typeSpeed = 500; 
  }

  setTimeout(typeEffect, typeSpeed);
}

// ==================== 3. ANIMATION AU DEFILEMENT DES PROJETS ====================
function initPortfolioScrollAnimation() {
  const portfolioItems = document.querySelectorAll('#portfolio .portfolio-item');
  if (portfolioItems.length === 0) return;

  portfolioItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(35px)';
    item.style.transition = 'opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1), transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px', 
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries, observer) => {
    let delayCounter = 0;
    const visibleEntries = entries.filter(entry => entry.isIntersecting);

    visibleEntries.forEach(entry => {
      const item = entry.target;
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, delayCounter * 120); 

      delayCounter++;
      observer.unobserve(item); 
    });
  }, observerOptions);

  portfolioItems.forEach(item => observer.observe(item));
}

// ==================== 4. OUVERTURE / FERMETURE DU MENU RESPONSIVE ====================
const navOpenBtn = globalBody ? globalBody.querySelector('.navOpen-btn') : null;
const navCloseBtn = globalNavMenu ? globalNavMenu.querySelector('.navClose-btn') : null;

if (globalNavMenu && navOpenBtn) {
  navOpenBtn.addEventListener("click", () => {
    globalNavMenu.classList.add("open");
    if (globalBody) globalBody.classList.add('hide-scrollbar');
  });
}

if (globalNavMenu && navCloseBtn) {
  navCloseBtn.addEventListener("click", () => {
    globalNavMenu.classList.remove("open");
    if (globalBody) globalBody.classList.remove('hide-scrollbar');
  });
}

// ==================== 5. ÉVÉNEMENT AU DÉFILEMENT COMPORTEMENT GENERAL ====================
window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset || window.scrollY;

  if (globalHeader) {
    globalHeader.classList.toggle("header-active", scrollY > 5);
  }

  if (globalScrollUpBtn) {
    globalScrollUpBtn.classList.toggle("scrollUpBtn-active", scrollY > 250);
  }
  
  cachedNavLinks.forEach(({ section, navLink }) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink.classList.add("active-navlink");           
    } else {
      navLink.classList.remove("active-navlink");     
    }
  });
});

// ==================== 6. MODAL GESTIONNAIRES DE VISIONNEUSE (LIGHTBOX) ====================
function closeLightboxView(modalNode) {
  if (!modalNode) return;
  modalNode.classList.remove('lightbox-active');
  if (globalBody) {
    globalBody.classList.remove('hide-scrollbar');
    globalBody.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
  }
}

// ==================== GALERIE DE TRAVAIL UNIQUE ====================
const uniqueLightboxModal = document.getElementById('galerie-travail-modal-unique');
const uniqueLightboxImg = document.getElementById('galerie-travail-img-unique');

function ouvrirAperçuGalerie(cheminImage) {
  if (uniqueLightboxModal && uniqueLightboxImg) {
    uniqueLightboxImg.src = cheminImage;
    uniqueLightboxModal.classList.add('galerie-travail-active');
    if (globalBody) {
      globalBody.classList.add('hide-scrollbar');
      document.documentElement.style.overflowX = 'hidden';
    }
  }
}

function fermerGalerieEtRetourFormulaire(redirigerFormulaire = true) {
  if (uniqueLightboxModal) {
    uniqueLightboxModal.classList.remove('galerie-travail-active');
    if (globalBody) {
      globalBody.classList.remove('hide-scrollbar');
      globalBody.style.overflowX = 'hidden';
    }
  }
  if (redirigerFormulaire) {
    const formulaire = document.getElementById('mon-formulaire'); 
    if (formulaire) formulaire.scrollIntoView({ behavior: 'smooth' });
  }
}

if (uniqueLightboxModal) {
  uniqueLightboxModal.addEventListener('click', function(event) {
    if (event.target === uniqueLightboxModal) fermerGalerieEtRetourFormulaire(false);
  });
}

// Accessibilité Touche Échap Globale
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const portfolioModal = document.getElementById('portfolio-lightbox');
        if (portfolioModal && portfolioModal.classList.contains('lightbox-active')) closeLightboxView(portfolioModal);
        if (uniqueLightboxModal && uniqueLightboxModal.classList.contains('galerie-travail-active')) fermerGalerieEtRetourFormulaire(false);
    }
});

// ==================== PERSPECTIVE CINÉTIQUE DES LOGOS (PC SEULEMENT SÉCURISÉ) ==========================
const pisteLogosCinétique = document.getElementById('pisteLogosTravailUnique');
const zoneDecorsCinétique = document.querySelector('.partenaires-decor-3d');
const isMobileDevice = window.matchMedia("(max-width: 768px)").matches || ('ontouchstart' in window);

if (zoneDecorsCinétique && pisteLogosCinétique && !isMobileDevice) {
  pisteLogosCinétique.style.transition = 'transform 0.15s ease-out';

  zoneDecorsCinétique.addEventListener('mousemove', (e) => {
    const width = zoneDecorsCinétique.clientWidth;
    const mouseX = e.clientX - zoneDecorsCinétique.getBoundingClientRect().left;
    const positionPourcent = (mouseX / width) - 0.5;
    const angleRotationY = positionPourcent * 15; 
    pisteLogosCinétique.style.transform = `rotateX(10deg) rotateY(${angleRotationY}deg)`;
  });

  zoneDecorsCinétique.addEventListener('mouseleave', () => {
    pisteLogosCinétique.style.transform = `rotateX(10deg) rotateY(0deg)`;
  });
}

// ==================== 7. COMPTEURS DE STATISTIQUES ANIMÉS ====================
function initCounterStatistics() {
  const compteurs = document.querySelectorAll('.compteur');
  if (compteurs.length === 0) return;
  const DURATION = 2000; 

  const animerCompteur = (entrees, observateur) => {
    entrees.forEach(entree => {
      if (entree.isIntersecting) {
        const cible = entree.target;
        const carte = cible.closest('.carte-stat');
        const valeurFinale = parseInt(cible.getAttribute('data-target'), 10);
        
        if(carte) carte.classList.add('active-glow');

        let tempsDebut = null;

        const etape = (tempsActuel) => {
          if (!tempsDebut) tempsDebut = tempsActuel;
          const progression = tempsActuel - tempsDebut;
          
          const valeurActuelle = Math.min(
            Math.ceil((progression / DURATION) * valeurFinale), 
            valeurFinale
          );
          
          cible.innerText = valeurActuelle;

          if (progression < DURATION) {
            requestAnimationFrame(etape); 
          } else {
            cible.innerText = valeurFinale; 
          }
        };

        requestAnimationFrame(etape);
        observateur.unobserve(cible); 
      }
    });
  };

  const options = { threshold: 0.3 };
  const observateur = new IntersectionObserver(animerCompteur, options);
  
  compteurs.forEach(compteur => observateur.observe(compteur));
}

// ==================== 8. POINT D'ENTRÉE DOMContentLoaded EXCLUSIF UNIQUE ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation immédiate des structures graphiques
    handleSplashScreen();
    typeEffect(); 
    initPortfolioScrollAnimation(); 
    initCounterStatistics();

    // ---- FILTRES PORTFOLIO ----
    const filterTabs = document.querySelectorAll('#portfolio-flters li');
    const portfolioCards = document.querySelectorAll('.portfolio-item'); 

    if (filterTabs.length > 0 && portfolioCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('filter-active'));
                tab.classList.add('filter-active');

                const classTarget = tab.getAttribute('data-filter');

                portfolioCards.forEach(card => {
                    card.style.animation = 'none';
                    card.offsetHeight; 

                    const cleanClass = classTarget.startsWith('.') ? classTarget.substring(1) : classTarget;

                    if (classTarget === '*' || card.classList.contains(cleanClass)) {
                        card.style.display = 'block';
                        card.style.animation = 'projectFadeInMatrix 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ---- VISIONNEUSE / LIGHTBOX PORTFOLIO ----
    const lightboxModal = document.getElementById('portfolio-lightbox');
    const lightboxImageNode = document.getElementById('lightbox-target-img');
    const lightboxTitleNode = document.getElementById('lightbox-target-title');
    const lightboxCloseButton = document.querySelector('.lightbox-close-btn');
    const previewTriggers = document.querySelectorAll('.btn-trigger-lightbox');

    if (lightboxModal && lightboxImageNode && previewTriggers.length > 0) {
        previewTriggers.forEach(trigger => {
            trigger.addEventListener('click', (event) => {
                event.preventDefault(); 
                const imageSource = trigger.getAttribute('href');
                const wrapperCard = trigger.closest('.portfolio-wrap');
                
                if (wrapperCard) {
                    const mainTitleEl = wrapperCard.querySelector('.portfolio-info h4 a');
                    const subTitleEl = wrapperCard.querySelector('.portfolio-info p');
                    const mainTitleText = mainTitleEl ? mainTitleEl.textContent : '';
                    const subTitleText = subTitleEl ? subTitleEl.textContent : '';

                    if (lightboxTitleNode) {
                        lightboxTitleNode.textContent = subTitleText ? `${mainTitleText} — ${subTitleText}` : mainTitleText;
                    }
                }

                lightboxImageNode.src = imageSource;
                lightboxModal.classList.add('lightbox-active');
                if (globalBody) {
                    globalBody.classList.add('hide-scrollbar');
                    document.documentElement.style.overflowX = 'hidden';
                }
            });
        });

        if (lightboxCloseButton) {
            lightboxCloseButton.addEventListener('click', () => closeLightboxView(lightboxModal));
        }
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightboxView(lightboxModal);
        });
    }

    // ---- CONFIGURATION DES ÉVÉNEMENTS GOOGLE ANALYTICS (GA4) ----
    
    // 1. Téléchargement du CV
    const boutonCV = document.querySelector('a[href*="cv.pdf"]');
    if (boutonCV) {
        boutonCV.addEventListener('click', function() {
            if (typeof gtag === 'function') {
                gtag('event', 'download_cv', {
                    'event_category': 'Engagement',
                    'event_label': 'Téléchargement CV Glody-Claver'
                });
            }
        });
    }

    // 2. Clic Contact (Correctif de syntaxe inclus)
    const boutonContactAbout = document.querySelector('.about-actions .link-contact');
    if (boutonContactAbout) {
        boutonContactAbout.addEventListener('click', function() {
            if (typeof gtag === 'function') {
                gtag('event', 'click_contact_me', {
                    'event_category': 'Engagement',
                    'event_label': 'Bouton Contactez-moi Section About'
                });
            }
        });
    }

    // 3. Clic sur les Réseaux Sociaux
    const liensSociaux = document.querySelectorAll('.single-footer .social a');
    liensSociaux.forEach(function(lien) {
        lien.addEventListener('click', function() {
            const nomReseau = lien.getAttribute('aria-label') || 'Réseau Inconnu';
            if (typeof gtag === 'function') {
                gtag('event', 'click_social_network', {
                    'event_category': 'Social',
                    'event_label': 'Clic Reseau : ' + nomReseau
                });
            }
        });
    });

    // 4. Détection des Saisies et Chemins Suspects (Ex: /.github, .env, ../)
    // Fonction de sécurité locale pour éviter d'envoyer des e-mails par accident à Google
    function isSafeToLog(inputValue) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        return !emailRegex.test(inputValue);
    }

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const inputElement = form.querySelector('input[type="text"], input[type="search"]');
            if (!inputElement) return;
            
            const inputValue = inputElement.value.trim();
            
            if (isSafeToLog(inputValue)) {
                if (inputValue.includes('/.github') || inputValue.includes('.env') || inputValue.includes('../') || inputValue.includes('wp-admin')) {
                    if (typeof gtag === 'function') {
                        gtag('event', 'suspect_input_detected', {
                            'input_value': inputValue,
                            'page_location': window.location.href
                        });
                    }
                }
            }
        });
    });

    // 5. Détection des Erreurs de Scripts (Bugs ou plantages JavaScript)
    window.addEventListener('error', function(event) {
        if (typeof gtag === 'function') {
            gtag('event', 'javascript_error', {
                'error_message': event.message,
                'error_url': event.filename,
                'error_line': event.lineno
            });
        }
    });

    // 6. Détection des Erreurs de Connexion Internet (PWA Hors-ligne)
    window.addEventListener('offline', function() {
        if (typeof gtag === 'function') {
            gtag('event', 'pwa_network_status', { 'status': 'offline', 'page_url': window.location.href });
        }
    });
    window.addEventListener('online', function() {
        if (typeof gtag === 'function') {
            gtag('event', 'pwa_network_status', { 'status': 'online', 'page_url': window.location.href });
        }
    });

    // 7. Détection du Copier Sauvage (Vol de contenu important)
    document.addEventListener('copy', function() {
        const selectedText = window.getSelection().toString();
        if (selectedText.length > 120 && isSafeToLog(selectedText)) {
            if (typeof gtag === 'function') {
                gtag('event', 'content_copied', { 'text_length': selectedText.length, 'page_location': window.location.href });
            }
        }
    });

}); // <--- Cette accolade ferme TRÈS PROPREMENT le bloc 'DOMContentLoaded' principal


// ==================== 9. INITIALISATION DES ANIMATIONS SCROLLREVEAL ====================
if (typeof ScrollReveal !== 'undefined') {
  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

  const sr = ScrollReveal({
    origin: 'top', 
    distance: isSmallScreen ? '20px' : '60px', 
    duration: 2500, 
    delay: 300, 
    easing: 'ease-out', 
    reset: !isSmallScreen, 
    interval: 150, 
    viewFactor: 0.1, 
    mobile: true 
  });

  /*==================================================
  ANIMATIONS SCROLLREARVAL - CONFIGURATIONS
  ====================================================*/

  // 1. Animation en cascade (Intervalle séquentiel standard)
  sr.reveal(`.skill-section .skill-section-title, .pf-details .section-title, .services-section-bg .services-section-title, .Feautes .section-title, .section-realisations .section-title, .clearfix .section-title`, { interval: 100 });

  // 2. Glissement de la gauche vers la droite (Slide-In-Left)
  sr.reveal(`.about .about-imageColumn.Slide-In-Left, .skill-section .skills-column.Slide-In-Left, .pf-details .aptitudes-card.fadeInLeft, .faq-map-section .faq-column`, { origin: 'left' });

  // 3. Glissement de la droite vers la gauche (Slide-In-Right)
  sr.reveal(`.about .about-detailsColumn.Slide-In-Right, .skill-section .skills-column.Slide-In-Right, .certlang-global-section .certlang-vertical-track .certlang-track-node, .certlang-global-section .certlang-sidebar-stack .certlang-inner-block-white,
  .resume-section .resume-column.experience-col .timeline-item, .resume-section .resume-column.formation-col .timeline-item, .pf-details .aptitudes-card.fadeInRight, .faq-map-section .map-column`, { origin: 'right' });

  // 4. Zoom progressif avec fondu (Fade-In-Scale)
  sr.reveal(`.Codeur .Codeur-layout-fluid, .skill-section .skills-column.Fade-In-Scale, .pf-details .aptitudes-card.zoomIn, .clearfix .portfolio-filters-wrapper`, { scale: 0.85, opacity: 0 });

  // 5. Plongée descendante rythmée (Top-Down Card Stagger)
  sr.reveal('.Codeur .section-title, .Codeur .section-subtitle', { 
    origin: 'top', 
    interval: 300 
  });

  // 6. Plongée descendante rythmée (Top-Down Card Stagger)
  sr.reveal('.resume-section .section-title, .resume-section .resume-columns-wrapper .column-title', { 
    origin: 'top', 
    interval: 200 
  });

  // 7. Plongée descendante rythmée (Top-Down Card Stagger)
  sr.reveal('.certlang-global-section .certlang-section-title, .certlang-global-section .certlang-column-headline', { 
    origin: 'top', 
    interval: 200 
  });

  // 8. Plongée descendante rythmée (Top-Down Card Stagger)
  sr.reveal('.services-section-bg .services-card', { 
    origin: 'top', 
    interval: 200 
  });

  // 10. Grilles montantes rythmées (Grid Elevate Card Stagger)
  sr.reveal('.section-realisations .carte-stat', { 
    origin: 'bottom', 
    interval: 200 
  });

  /* >>> DEBUT : ANIMATIONS PREMIUM SCROLLREVEAL POUR FEATURES <<< */

  // 1. Glissement de la gauche vers la droite pour les cartes à gauche
  sr.reveal('.feautes-grid-pure .feautes-item.fadeInLeft', {
    origin: 'left',
    distance: '60px',
    duration: 1000,
    opacity: 0,
    scale: 1
  });

  // 2. Glissement de la droite vers la gauche pour les cartes à droite
  sr.reveal('.feautes-grid-pure .feautes-item.fadeInRight', {
    origin: 'right',
    distance: '60px',
    duration: 1000,
    opacity: 0,
    scale: 1
  });

  // 3. Zoom progressif avec fondu pour les cartes centrales
  sr.reveal('.feautes-grid-pure .feautes-item.zoomIn', {
    duration: 1100,
    scale: 0.7,
    opacity: 0,
    distance: '0px'
  });

  // 4. DOUBLE ANIMATION EN JS (Zoom "Woume" + Rotation à 360° complète)
  // Cible le <i> qui forme le cercle
  sr.reveal('.feautes-grid-pure .feautes-item .signle-icon i', {
    scale: 0.2,                     // Démarre minuscule au centre (effet Zoom puissant)
    rotate: { x: 0, y: 0, z: 360 }, // Fait un tour complet complet sur lui-même (effet Rotation)
    duration: 1800,                 // Déroulement très fluide sur 1.8 seconde
    delay: 600,                     // Se déclenche juste avant la stabilisation complète de la carte
    distance: '0px'                 // Reste parfaitement centré (ne casse pas tes propriétés CSS d'alignement)
  });

  /* >>> FIN : ANIMATIONS PREMIUM SCROLLREVEAL POUR FEATURES <<< */

}
