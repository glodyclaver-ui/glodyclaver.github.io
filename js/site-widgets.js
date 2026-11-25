/*
  ============================================================
  WIDGETS DU SITE  @glody claver
  - Mode sombre (mémorisé)
  - Version anglaise FR / EN (mémorisée)
  - Bouton WhatsApp flottant
  - Bandeau cookies RGPD (Google Analytics après consentement)
  - Réservation d'appel, demandes de devis
  - Études de cas (fenêtre de lecture)
  Chargé sur toutes les pages. Configuration : js/site-config.js
  ============================================================
*/
(function () {
    'use strict';

    var CFG = window.GC_CONFIG || {};
    var DICT = window.GC_I18N_EN || {};
    var root = document.documentElement;

    var KEY_THEME = 'gc_theme';
    var KEY_LANG = 'gc_lang';
    var KEY_CONSENT = 'gc_cookie_consent';

    function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
    function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

    function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

    var lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'fr';

    /* ========================================================
       1. TRADUCTION (dictionnaire FR -> EN)
    ======================================================== */

    var ATTRS = ['alt', 'aria-label', 'title', 'placeholder'];
    var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1 };

    function t(text) {
        if (lang !== 'en') return text;
        var key = norm(text);
        return DICT[key] || text;
    }

    window.gcT = t;
    window.gcLang = function () { return lang; };

    function translateTextNode(node) {
        var raw = node.nodeValue;
        var key = norm(raw);

        if (!key) return;

        if (lang === 'en') {
            var en = DICT[key];

            if (en && en !== key) {
                if (node.__gcFr === undefined) node.__gcFr = raw;
                node.nodeValue = raw.match(/^\s*/)[0] + en + raw.match(/\s*$/)[0];
            }
        } else if (node.__gcFr !== undefined) {
            node.nodeValue = node.__gcFr;
            node.__gcFr = undefined;
        }
    }

    function translateAttrs(el) {
        for (var i = 0; i < ATTRS.length; i++) {
            var attr = ATTRS[i];
            var value = el.getAttribute(attr);

            if (!value) continue;

            el.__gcAttrs = el.__gcAttrs || {};

            if (lang === 'en') {
                var en = DICT[norm(value)];

                if (en && en !== value) {
                    if (el.__gcAttrs[attr] === undefined) el.__gcAttrs[attr] = value;
                    el.setAttribute(attr, en);
                }
            } else if (el.__gcAttrs[attr] !== undefined) {
                el.setAttribute(attr, el.__gcAttrs[attr]);
                el.__gcAttrs[attr] = undefined;
            }
        }
    }

    function translateTree(node) {
        if (!node) return;

        if (node.nodeType === 3) {
            if (node.parentNode && !SKIP[node.parentNode.nodeName]) translateTextNode(node);
            return;
        }

        if (node.nodeType !== 1 || SKIP[node.nodeName]) return;

        translateAttrs(node);

        var walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                if (n.nodeType === 1 && SKIP[n.nodeName]) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        while (walker.nextNode()) {
            var current = walker.currentNode;

            if (current.nodeType === 3) translateTextNode(current);
            else translateAttrs(current);
        }
    }

    var metaOriginal = {};

    function translateMeta() {
        var titleKey = norm(metaOriginal.title || document.title);

        if (!metaOriginal.title) metaOriginal.title = document.title;

        document.title = lang === 'en' ? (DICT[norm(metaOriginal.title)] || metaOriginal.title) : metaOriginal.title;

        var desc = document.querySelector('meta[name="description"]');

        if (desc) {
            if (metaOriginal.desc === undefined) metaOriginal.desc = desc.getAttribute('content');
            desc.setAttribute('content', lang === 'en' ? (DICT[norm(metaOriginal.desc)] || metaOriginal.desc) : metaOriginal.desc);
        }

        return titleKey;
    }

    var observer = null;

    function startObserver() {
        if (observer || !('MutationObserver' in window)) return;

        observer = new MutationObserver(function (mutations) {
            if (lang !== 'en') return;

            mutations.forEach(function (m) {
                if (m.type === 'characterData') {
                    translateTextNode(m.target);
                } else {
                    m.addedNodes.forEach(translateTree);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    function updateLangButton() {
        var btn = document.getElementById('lang-toggle');

        if (!btn) return;

        var label = btn.querySelector('.lang-toggle-label');

        if (label) label.textContent = lang === 'en' ? 'FR' : 'EN';

        btn.setAttribute('aria-label', lang === 'en' ? 'Passer en français' : 'Switch to English');
        btn.setAttribute('title', lang === 'en' ? 'Français' : 'English');
    }

    function setLang(next, save) {
        lang = next === 'en' ? 'en' : 'fr';

        root.setAttribute('lang', lang);
        root.setAttribute('data-lang', lang);

        if (save) store(KEY_LANG, lang);

        translateTree(document.body);
        translateMeta();
        updateLangButton();
        updateThemeButton();
        buildLinks();
        if (window.gcRefreshInstall) window.gcRefreshInstall();
    }

    /* ========================================================
       2. MODE SOMBRE
    ======================================================== */

    function currentTheme() {
        return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function updateThemeButton() {
        var btn = document.getElementById('theme-toggle');

        if (!btn) return;

        var dark = currentTheme() === 'dark';
        var frLabel = dark ? 'Activer le mode clair' : 'Activer le mode sombre';
        var enLabel = dark ? 'Switch to light mode' : 'Switch to dark mode';

        btn.setAttribute('aria-pressed', String(dark));
        btn.setAttribute('aria-label', lang === 'en' ? enLabel : frLabel);
        btn.setAttribute('title', lang === 'en' ? (dark ? 'Light mode' : 'Dark mode') : (dark ? 'Mode clair' : 'Mode sombre'));
    }

    function setTheme(theme, save) {
        if (theme === 'dark') root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');

        if (save) store(KEY_THEME, theme);

        updateThemeButton();
    }

    /* ========================================================
       3. LIENS WHATSAPP / RENDEZ-VOUS / DEVIS
    ======================================================== */

    function waLink(message) {
        return 'https://wa.me/' + encodeURIComponent(CFG.whatsappNumber || '') +
            '?text=' + encodeURIComponent(message);
    }

    function defaultMessage() {
        var m = CFG.whatsappMessage || {};
        return m[lang] || m.fr || '';
    }

    /* Message et libellé du bouton WhatsApp selon la section regardée */
    var TOPICS = {
        quote: {
            fr: { label: 'Demander un devis', msg: 'Bonjour Glody-Claver, je souhaite un devis pour mon projet.' },
            en: { label: 'Request a quote', msg: 'Hello Glody-Claver, I would like a quote for my project.' }
        },
        project: {
            fr: { label: 'Parler de mon projet', msg: "Bonjour Glody-Claver, j'ai vu vos réalisations et j'aimerais discuter d'un projet web ou design." },
            en: { label: 'Discuss my project', msg: 'Hello Glody-Claver, I saw your work and would like to discuss a web or design project.' }
        },
        support: {
            fr: { label: 'Question ou support', msg: "Bonjour Glody-Claver, j'ai une question ou j'aurais besoin d'un support informatique." },
            en: { label: 'Question or support', msg: 'Hello Glody-Claver, I have a question or need IT support.' }
        }
    };

    var SECTION_TOPIC = {
        'offres': 'quote',
        'etudes-de-cas': 'project', 'projet-detail': 'project', 'methode': 'project', 'services': 'project', 'portfolio': 'project',
        'section-realisations': 'project', 'skill': 'project',
        'faq-zone': 'support'
    };

    var topic = null;

    function topicInfo() {
        if (!topic || !TOPICS[topic]) return null;
        return TOPICS[topic][lang] || TOPICS[topic].fr;
    }

    function waMessage() {
        var info = topicInfo();
        return info ? info.msg : defaultMessage();
    }

    function waLabel() {
        var info = topicInfo();
        return info ? info.label : (lang === 'en' ? 'Chat on WhatsApp' : 'Discuter sur WhatsApp');
    }

    function bookingConfigured() {
        return CFG.bookingUrl && CFG.bookingUrl.indexOf('VOTRE-LIEN') === -1;
    }

    function buildLinks() {
        var wa = document.querySelector('.wa-float');

        if (wa) {
            wa.setAttribute('href', waLink(waMessage()));
            wa.setAttribute('aria-label', waLabel());

            var lab = wa.querySelector('.wa-float-label');

            if (lab) lab.textContent = waLabel();
        }

        document.querySelectorAll('[data-book-call]').forEach(function (a) {
            if (bookingConfigured()) {
                a.setAttribute('href', CFG.bookingUrl);
            } else {
                a.setAttribute('href', waLink(lang === 'en'
                    ? 'Hello Glody-Claver, I would like to book a call.'
                    : 'Bonjour Glody-Claver, je souhaiterais réserver un appel.'));
            }
        });

        document.querySelectorAll('[data-quote]').forEach(function (a) {
            var pack = a.getAttribute('data-quote');
            var name = lang === 'en' ? (DICT[norm(pack)] || pack) : pack;

            a.setAttribute('href', waLink(lang === 'en'
                ? 'Hello Glody-Claver, I would like a quote for: ' + name + '.'
                : 'Bonjour Glody-Claver, je souhaite un devis pour : ' + name + '.'));
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        });
    }

    function createWhatsAppButton() {
        if (document.querySelector('.wa-float')) return;

        var a = document.createElement('a');

        a.className = 'wa-float';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', 'Discuter sur WhatsApp');
        a.innerHTML =
            '<svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true" focusable="false">' +
            '<path fill="currentColor" d="M16.04 3C9.4 3 4 8.4 4 15.03c0 2.12.55 4.19 1.6 6.01L4 29l8.1-1.57a12.03 12.03 0 0 0 3.94.66h.01C22.7 28.09 28 22.7 28 16.06 28 9.4 22.7 3 16.04 3zm0 22.06h-.01c-1.2 0-2.37-.32-3.4-.93l-.24-.15-4.81.93.97-4.69-.16-.25a9.93 9.93 0 0 1-1.52-5.3c0-5.5 4.48-9.97 10-9.97 2.66 0 5.16 1.04 7.04 2.92a9.9 9.9 0 0 1 2.92 7.05c0 5.5-4.48 9.4-9.79 9.4zm5.47-7.45c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.5-.5-.68-.5l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.23 5.13 4.53.72.3 1.28.5 1.71.64.72.23 1.37.2 1.89.12.58-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z"/></svg>' +
            '<span class="wa-float-label">Discuter sur WhatsApp</span>';

        document.body.appendChild(a);
    }

    /* ========================================================
       4. BANDEAU COOKIES (RGPD)
    ======================================================== */

    var banner = null;

    function applyConsent(value) {
        store(KEY_CONSENT, value);

        if (window.gcAnalytics) {
            if (value === 'granted') window.gcAnalytics.grant();
            else window.gcAnalytics.revoke();
        }

        hideBanner();
    }

    function hideBanner() {
        if (!banner) return;

        banner.classList.remove('is-visible');

        window.setTimeout(function () {
            if (banner && !banner.classList.contains('is-visible')) banner.hidden = true;
        }, 400);
    }

    function showBanner() {
        if (!banner) createBanner();

        banner.hidden = false;

        window.requestAnimationFrame(function () {
            banner.classList.add('is-visible');
        });
    }

    function createBanner() {
        banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-labelledby', 'cookie-title');
        banner.setAttribute('aria-describedby', 'cookie-text');
        banner.hidden = true;

        banner.innerHTML =
            '<p class="cookie-title" id="cookie-title">Cookies et confidentialité</p>' +
            '<p class="cookie-text" id="cookie-text">J\'utilise Google Analytics pour mesurer l\'audience de ce portfolio et l\'améliorer. Aucun cookie de mesure n\'est déposé sans votre accord. <a href="' + (CFG.privacyUrl || 'privacy.html') + '">En savoir plus</a></p>' +
            '<div class="cookie-actions">' +
            '<button type="button" class="cookie-btn cookie-btn-deny" data-cookie="denied">Refuser</button>' +
            '<button type="button" class="cookie-btn cookie-btn-accept" data-cookie="granted">Accepter</button>' +
            '</div>';

        banner.addEventListener('click', function (event) {
            var btn = event.target.closest('[data-cookie]');

            if (btn) applyConsent(btn.getAttribute('data-cookie'));
        });

        document.body.appendChild(banner);

        // Traduction immédiate si on est en anglais
        translateTree(banner);
    }

    function initCookies() {
        document.addEventListener('click', function (event) {
            var link = event.target.closest('[data-cookie-settings]');

            if (link) {
                event.preventDefault();
                showBanner();
            }
        });

        var saved = load(KEY_CONSENT);

        if (saved === 'granted' || saved === 'denied') return;

        var delay = root.classList.contains('splash-seen') ? 900 : 5200;

        window.setTimeout(showBanner, delay);
    }

    /* ========================================================
       5. ÉTUDES DE CAS (fenêtre de lecture)
    ======================================================== */

    function initCases() {
        var buttons = document.querySelectorAll('.case-open');

        if (!buttons.length) return;

        var modal = document.createElement('div');

        modal.className = 'case-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'case-modal-title');
        modal.hidden = true;

        modal.innerHTML =
            '<div class="case-modal-box" tabindex="-1">' +
            '<button type="button" class="case-modal-close" aria-label="Fermer"><i class="fa fa-times" aria-hidden="true"></i></button>' +
            '<div class="case-modal-media"><img src="" alt=""><span class="case-tag"></span></div>' +
            '<div class="case-modal-content">' +
            '<h3 id="case-modal-title"></h3>' +
            '<div class="case-modal-data"></div>' +
            '<a href="#" class="offer-cta case-modal-cta" data-quote="Projet sur mesure">Discuter d\'un projet similaire <i class="fa fa-arrow-right" aria-hidden="true"></i></a>' +
            '</div></div>';

        document.body.appendChild(modal);

        var box = modal.querySelector('.case-modal-box');
        var closeBtn = modal.querySelector('.case-modal-close');
        var lastFocus = null;

        function close() {
            modal.classList.remove('is-open');
            root.classList.remove('case-modal-open');

            window.setTimeout(function () { modal.hidden = true; }, 250);

            if (lastFocus && lastFocus.focus) lastFocus.focus();
        }

        function open(button) {
            var card = button.closest('.case-card');
            var data = card.querySelector('.case-data');
            var img = card.querySelector('.case-media img');

            lastFocus = button;

            modal.querySelector('#case-modal-title').textContent = card.querySelector('.case-title').textContent;
            modal.querySelector('.case-modal-media img').src = img.getAttribute('src');
            modal.querySelector('.case-modal-media img').alt = img.getAttribute('alt');
            modal.querySelector('.case-modal-media .case-tag').textContent = card.querySelector('.case-tag').textContent;

            var holder = modal.querySelector('.case-modal-data');

            holder.innerHTML = '';

            Array.prototype.forEach.call(data.children, function (child) {
                holder.appendChild(child.cloneNode(true));
            });

            // Les textes copiés repartent du français d'origine
            Array.prototype.forEach.call(holder.querySelectorAll('*'), function (el) {
                el.__gcAttrs = undefined;
            });

            // Retire d'éventuelles traductions copiées avec les noeuds
            if (lang === 'en') {
                translateTree(modal);
            }

            buildLinks();

            modal.hidden = false;
            root.classList.add('case-modal-open');
            modal.querySelector('.case-modal-content').scrollTop = 0;

            window.requestAnimationFrame(function () {
                modal.classList.add('is-open');
                closeBtn.focus();
            });
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () { open(button); });
        });

        closeBtn.addEventListener('click', close);

        modal.addEventListener('click', function (event) {
            if (event.target === modal) close();
        });

        document.addEventListener('keydown', function (event) {
            if (modal.hidden) return;

            if (event.key === 'Escape') {
                close();
            } else if (event.key === 'Tab') {
                var focusables = box.querySelectorAll('a[href], button');

                if (!focusables.length) return;

                var first = focusables[0];
                var last = focusables[focusables.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    }

    /* ========================================================
       6. BADGE DE DISPONIBILITÉ
    ======================================================== */

    function initAvailability() {
        if (CFG.available === false) {
            document.querySelectorAll('.availability-badge').forEach(function (el) {
                el.hidden = true;
            });
        }
    }

    /* ========================================================
       7. DÉMARRAGE
    ======================================================== */

    /* ========================================================
       8. WHATSAPP SELON LA SECTION
    ======================================================== */

    function initWhatsAppContext() {
        var wa = document.querySelector('.wa-float');
        var raf = 0;
        var hintTimer = 0;

        if (!wa) return;

        function sectionTopic() {
            var el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight * 0.5);

            if (!el || !el.closest) return null;

            var sec = el.closest('section, footer');

            if (!sec) return null;
            if (sec.tagName === 'FOOTER') return 'support';

            return SECTION_TOPIC[sec.id] || null;
        }

        function update() {
            raf = 0;

            if (root.classList.contains('case-modal-open')) return;

            var next = sectionTopic();

            if (next === topic) return;

            topic = next;
            buildLinks();

            // Le libellé s'affiche quelques secondes quand le sujet change
            wa.classList.add('is-hinting');
            window.clearTimeout(hintTimer);
            hintTimer = window.setTimeout(function () { wa.classList.remove('is-hinting'); }, 3200);
        }

        window.addEventListener('scroll', function () {
            if (!raf) raf = window.requestAnimationFrame(update);
        }, { passive: true });

        // premier calcul sans afficher le libellé
        topic = sectionTopic();
        buildLinks();
    }

    /* ========================================================
       9. SQUELETTE DE CHARGEMENT DES IMAGES
    ======================================================== */

    function initSkeleton() {
        document.querySelectorAll('main img, footer img').forEach(function (img) {
            if (!img.getAttribute('src') || img.complete) return;

            img.classList.add('gc-skel');

            function done() { img.classList.remove('gc-skel'); }

            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
        });
    }

    /* ========================================================
       10. MÉTHODE DE TRAVAIL (animation à l'apparition)
    ======================================================== */

    function initSkillCards() {
        var cards = Array.prototype.slice.call(document.querySelectorAll('#skill .skill-showcase-card'));

        if (!cards.length) return;

        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function show(card, i) {
            card.style.setProperty('--sk-d', (i * 0.18) + 's');
            card.classList.remove('sk-armed');
            card.classList.add('sk-in');
        }

        if (reduce || !('IntersectionObserver' in window)) return;

        cards.forEach(function (c) { c.classList.add('sk-armed'); });

        var seen = 0;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                io.unobserve(e.target);
                show(e.target, seen++ % cards.length);
            });
        }, { threshold: 0.15 });

        cards.forEach(function (c) { io.observe(c); });
    }

    function initDeepCase() {
        var btn = document.getElementById('deep-toggle');
        var body = document.getElementById('deep-body');

        if (!btn || !body) return;

        var txt = btn.querySelector('.deep-toggle-text');

        function tr(label) { return (window.gcT ? window.gcT(label) : label) || label; }

        function clearVideos() {
            body.querySelectorAll('.deep-video-frame iframe').forEach(function (f) { f.remove(); });
            body.querySelectorAll('.deep-video-frame.is-playing').forEach(function (fr) { fr.classList.remove('is-playing'); });
        }

        function playVideo(frame) {
            var id = frame.getAttribute('data-yt-id');

            if (!id || frame.querySelector('iframe')) return;

            var f = document.createElement('iframe');
            f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&modestbranding=1&playsinline=1&autoplay=1';
            f.title = 'Vidéo de démonstration';
            f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen';
            f.setAttribute('allowfullscreen', '');
            f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            frame.classList.add('is-playing');
            frame.appendChild(f);
        }

        function setOpen(open) {
            body.classList.toggle('is-open', open);
            body.setAttribute('aria-hidden', open ? 'false' : 'true');

            if (open) { body.removeAttribute('inert'); } else { body.setAttribute('inert', ''); }

            btn.setAttribute('aria-expanded', open ? 'true' : 'false');

            if (txt) txt.textContent = tr(open ? btn.getAttribute('data-open-label') : btn.getAttribute('data-closed-label'));

            if (!open) {
                clearVideos();

                var sec = document.getElementById('projet-detail');
                if (sec && sec.getBoundingClientRect().top < 0) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        btn.addEventListener('click', function () {
            setOpen(btn.getAttribute('aria-expanded') !== 'true');
        });

        /* Vidéo : le lecteur YouTube ne se charge qu'au clic */
        body.querySelectorAll('.deep-video-frame[data-yt-id]').forEach(function (frame) {
            frame.addEventListener('click', function () { playVideo(frame); });
            frame.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playVideo(frame); }
            });
        });

        /* Détail déroulable de chaque projet */
        body.querySelectorAll('.deep-more').forEach(function (more) {
            more.addEventListener('click', function () {
                var open = more.getAttribute('aria-expanded') !== 'true';
                var sub = document.getElementById(more.getAttribute('aria-controls'));

                if (!sub) return;

                sub.classList.toggle('is-open', open);
                sub.setAttribute('aria-hidden', open ? 'false' : 'true');

                if (open) { sub.removeAttribute('inert'); } else { sub.setAttribute('inert', ''); }

                more.setAttribute('aria-expanded', open ? 'true' : 'false');

                var t = more.querySelector('.deep-more-text');
                if (t) t.textContent = tr(open ? more.getAttribute('data-open-label') : more.getAttribute('data-closed-label'));
            });
        });
    }

    function initMethod() {
        var list = document.querySelector('[data-method]');

        if (!list) return;

        if (!('IntersectionObserver' in window)) return;

        list.classList.add('is-armed');

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                list.classList.add('is-in');
                io.disconnect();
            });
        }, { threshold: 0.25 });

        io.observe(list);
    }

    /* ========================================================
       11. BOUTON « INSTALLER L'APPLICATION » (PWA)
    ======================================================== */

    function initInstall() {
        var KEY = 'gc_install_dismissed';
        var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
        var deferred = null;
        var btn = null;

        if (standalone) return;

        try {
            var at = parseInt(localStorage.getItem(KEY) || '0', 10);

            if (at && Date.now() - at < 7 * 24 * 3600 * 1000) return;
        } catch (e) {}

        function text() {
            return lang === 'en'
                ? { label: 'Install the app', close: 'Hide', ios: 'On iPhone: tap the Share button, then “Add to Home Screen”.' }
                : { label: "Installer l'application", close: 'Masquer', ios: "Sur iPhone : touchez le bouton Partager, puis « Sur l'écran d'accueil »." };
        }

        function build() {
            if (btn) return;

            btn = document.createElement('div');
            btn.className = 'pwa-install';
            btn.innerHTML =
                '<button type="button" class="pwa-install-main"><i class="fa fa-download" aria-hidden="true"></i><span class="pwa-install-label"></span></button>' +
                '<button type="button" class="pwa-install-close"><i class="fa fa-times" aria-hidden="true"></i></button>' +
                '<p class="pwa-install-hint" role="status" hidden></p>';

            document.body.appendChild(btn);
            refresh();

            btn.querySelector('.pwa-install-main').addEventListener('click', function () {
                track('pwa_install_click', 'install_button');

                if (deferred) {
                    deferred.prompt();

                    deferred.userChoice.then(function () {
                        deferred = null;
                        hide(false);
                    });
                } else if (ios) {
                    var hint = btn.querySelector('.pwa-install-hint');

                    hint.textContent = text().ios;
                    hint.hidden = !hint.hidden;
                }
            });

            btn.querySelector('.pwa-install-close').addEventListener('click', function () { hide(true); });
        }

        function refresh() {
            if (!btn) return;

            var tx = text();

            btn.querySelector('.pwa-install-label').textContent = tx.label;
            btn.querySelector('.pwa-install-close').setAttribute('aria-label', tx.close);
        }

        function hide(remember) {
            if (!btn) return;

            btn.classList.remove('is-visible');

            if (remember) store(KEY, String(Date.now()));
        }

        // Affiche le bouton quand le bandeau cookies n'occupe plus l'écran
        function show() {
            build();

            var tryShow = function () {
                var cb = document.querySelector('.cookie-banner');

                if (cb && !cb.hidden && cb.classList.contains('is-visible')) {
                    window.setTimeout(tryShow, 2000);
                    return;
                }

                btn.classList.add('is-visible');
            };

            window.setTimeout(tryShow, 4000);
        }

        window.addEventListener('beforeinstallprompt', function (event) {
            event.preventDefault();
            deferred = event;
            show();
        });

        window.addEventListener('appinstalled', function () {
            track('pwa_installed', 'app');
            hide(true);
        });

        if (ios) show();

        window.gcRefreshInstall = refresh;
    }

    /* ========================================================
       12. STATISTIQUES : clics utiles (si Google Analytics est accepté)
    ======================================================== */

    function track(name, where) {
        if (load(KEY_CONSENT) !== 'granted') return;
        if (typeof window.gtag !== 'function') return;

        try {
            window.gtag('event', name, { event_category: 'engagement', event_label: where || '', page_location: location.href });
        } catch (e) {}
    }

    function initTracking() {
        document.addEventListener('click', function (event) {
            var a = event.target.closest && event.target.closest('a, button');

            if (!a) return;

            var sec = a.closest('section, footer, header');
            var where = sec ? (sec.id || sec.className.toString().split(' ')[0] || sec.tagName.toLowerCase()) : 'page';

            if (a.classList.contains('wa-float')) track('click_whatsapp', topic || 'general');
            else if (a.hasAttribute('data-book-call')) track('click_book_call', where);
            else if (a.hasAttribute('data-quote')) track('click_quote', a.getAttribute('data-quote'));
            else if (a.classList.contains('btn-cv')) track('click_cv_download', where);
            else if (a.classList.contains('hire-me-btn')) track('click_contact_email', where);
            else if (a.classList.contains('case-open')) track('open_case_study', a.getAttribute('data-case') || '');
        });
    }

    function init() {
        createWhatsAppButton();
        initAvailability();
        initCookies();
        initCases();
        initMethod();
        initDeepCase();
        initSkillCards();
        initSkeleton();
        initInstall();
        initTracking();

        var themeBtn = document.getElementById('theme-toggle');
        var langBtn = document.getElementById('lang-toggle');

        if (themeBtn) {
            themeBtn.addEventListener('click', function () {
                setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
            });
        }

        if (langBtn) {
            langBtn.addEventListener('click', function () {
                setLang(lang === 'en' ? 'fr' : 'en', true);
            });
        }

        startObserver();

        // Langue : choix mémorisé (sinon français)
        var saved = load(KEY_LANG);

        setLang(saved === 'en' ? 'en' : 'fr', false);
        updateThemeButton();
        buildLinks();
        initWhatsAppContext();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();