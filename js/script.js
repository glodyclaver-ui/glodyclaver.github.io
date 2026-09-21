/*
  TEMPLATED
  @glody claver
  3.0 license (glody_claver/license)
*/

// ==================== VARIABLES GLOBALES PARTAGÉES (SÉCURITÉ & PERFORMANCE) ====================
const globalBody = document.querySelector('body');
const globalHeader = document.querySelector("header");
const globalScrollUpBtn = document.querySelector('.scrollUp-btn');
const globalNavMenu = globalBody ? globalBody.querySelector('.menu-content') : null;
const globalSplashScreen = document.getElementById('splash-screen'); // Optimisation : mis en cache ici

// Cache et liaison des sections (évite les querySelector répétés dans le scroll)
const portfolioSections = document.querySelectorAll('section[id]');
const cachedNavLinks = [];

if (portfolioSections.length > 0) {
  portfolioSections.forEach(section => {
    const navLink = document.querySelector(`.menu-content a[href='#${section.id}']`);
    if (navLink) {
      cachedNavLinks.push({ section, navLink });
      
      // Liaison permanente unique du clic (optimisé hors scroll)
      navLink.addEventListener("click", () => {
        if (globalNavMenu) globalNavMenu.classList.remove("open");
        if (globalBody) globalBody.style.overflowY = ""; 
      });
    }
  });
}

// ==================== 1. ANIMATION D'OUVERTURE SPLASH SCREEN (STYLE NETFLIX) ====================
function handleSplashScreen() {
  if (globalSplashScreen && globalBody) {
    globalBody.classList.add('hide-scrollbar');
    
    setTimeout(() => {
      globalSplashScreen.classList.add('fade-out');
      globalBody.classList.remove('hide-scrollbar');
      
      // Supprime l'affichage après transition CSS (500ms) pour libérer les clics arrière-plan
      setTimeout(() => { globalSplashScreen.style.display = 'none'; }, 500);
    }, 2100); 
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
    typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 30 : 60;

  if (!isDeleting && charIndex === currentWord.length) {
    typeSpeed = 2000; 
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typeSpeed = 500; 
  }

  setTimeout(typeEffect, typeSpeed);
}

// ==================== 3. ANIMATION AU DEFILEMENT DES PROJETS (INTERSECTION OBSERVER) ====================
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
    if (globalBody) globalBody.style.overflowY = "hidden";
  });
}

if (globalNavMenu && navCloseBtn) {
  navCloseBtn.addEventListener("click", () => {
    globalNavMenu.classList.remove("open");
    if (globalBody) globalBody.style.overflowY = ""; 
  });
}
// ==================== 5. ÉVÉNEMENT AU DÉFILEMENT PERFORMANCE-BOOSTED ====================
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


// ==================== 6. GESTION DU PORTFOLIO, FILTRES ET LIGHTBOX ====================
document.addEventListener('DOMContentLoaded', () => {
    handleSplashScreen();
    typeEffect(); 
    initPortfolioScrollAnimation(); 

    // ---- 1. GESTION DES CHANGEMENTS DE FILTRES DYNAMIQUES ----
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
                    card.offsetHeight; // Force le reflow

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

    // ---- 2. GESTION DE LA VISIONNEUSE DU PORTFOLIO ----
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
                if (globalBody) globalBody.style.overflow = 'hidden'; 
            });
        });

        if (lightboxCloseButton) {
            lightboxCloseButton.addEventListener('click', () => closeLightboxView(lightboxModal));
        }
        
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightboxView(lightboxModal);
        });
    }
});

// ==================== GESTION DE LA GALERIE DE TRAVAIL UNIQUE ====================
const uniqueLightboxModal = document.getElementById('galerie-travail-modal-unique');
const uniqueLightboxImg = document.getElementById('galerie-travail-img-unique');

function ouvrirAperçuGalerie(cheminImage) {
  if (uniqueLightboxModal && uniqueLightboxImg) {
    uniqueLightboxImg.src = cheminImage;
    uniqueLightboxModal.classList.add('galerie-travail-active');
    if (globalBody) globalBody.style.overflow = 'hidden';
  }
}

function fermerGalerieEtRetourFormulaire(redirigerFormulaire = true) {
  if (uniqueLightboxModal) {
    uniqueLightboxModal.classList.remove('galerie-travail-active');
    if (globalBody) globalBody.style.overflow = '';
  }
  
  if (redirigerFormulaire) {
    const formulaire = document.getElementById('mon-formulaire'); 
    if (formulaire) {
      formulaire.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

if (uniqueLightboxModal) {
  uniqueLightboxModal.addEventListener('click', function(event) {
    if (event.target === uniqueLightboxModal) {
      fermerGalerieEtRetourFormulaire(false);
    }
  });
}

// Accessibilité Globale : Touche Échap pour fermer les modales ouvertes
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const portfolioModal = document.getElementById('portfolio-lightbox');
        if (portfolioModal && portfolioModal.classList.contains('lightbox-active')) {
            closeLightboxView(portfolioModal);
        }
        if (uniqueLightboxModal && uniqueLightboxModal.classList.contains('galerie-travail-active')) {
            fermerGalerieEtRetourFormulaire(false);
        }
    }
});

function closeLightboxView(modalElement) {
    if (modalElement) {
        modalElement.classList.remove('lightbox-active');
        if (globalBody) globalBody.style.overflow = ''; 
    }
}

/* ======================================================== */
/* PERSPECTIVE CINÉTIQUE DES LOGOS (PC SEULEMENT)           */
/* ======================================================== */
const pisteLogosCinétique = document.getElementById('pisteLogosTravailUnique');
const zoneDecorsCinétique = document.querySelector('.partenaires-decor-3d');

if (zoneDecorsCinétique && pisteLogosCinétique && window.innerWidth > 576) {
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

// ==================== 7. ANIMATIONS SCROLLREVEAL SÉCURISÉES ====================
if (typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({
    origin: 'top', distance: '60px', duration: 2500, delay: 400, 
    easing: 'ease-out', reset: true, interval: 150, viewFactor: 0.2, mobile: true 
  });

  sr.reveal(`.section-subtitle, .brand-image, .tesitmonial, .newsletter, .Codeur .section-title, .resume-section .section-title,
  .newsletter-inputBox, .box, .newsletter-mediaIcon, .menu-items, .menu-contentt, .certlang-section-header, .pf-details .section-title,
  .responsive-column, .about-content, .skill-section-header, .skills-column, .services-section-header, .portfolio-filters-wrapper, .Feautes .section-title, .clearfix .section-header`, { interval: 100 });

  sr.reveal(`.about-imageContent, .card-blog, .pf-details .fadeInLeft, .Feautes .fadeInLeft, .interets-activites-section .section-header`, { origin: 'left' });
  sr.reveal(`.about-details, .time-table, .single-widget, .pf-details .fadeInRight, .Feautes .fadeInRight, .certlang-track-node, .certlang-inner-block-white , .timeline-item, .interets-activites-section .interets-grid`, { origin: 'right' });
  sr.reveal(`.CodeurV, .clients-wrap, .error-inner, .pf-details .zoomIn, .Feautes .zoomIn, .certlang-column-headline, .column-title`, { scale: 0.85, opacity: 0 });
}
