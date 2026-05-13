// ─── Commercial Image Craft — Category Page ───

import '../styles/commercial-image-craft.scss';

// CSS is injected by the line above — reveal the page now to avoid FOUC
const reveal = () => document.body.classList.add('ready');
if (document.body) reveal();
else document.addEventListener('DOMContentLoaded', reveal);

import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, openLightbox, injectLightbox } from './work-filter.js';

gsap.registerPlugin(ScrollTrigger);

// ─── Smooth scroll ───────────────────────────────────────────────────────────
const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
(function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);

// ─── Nav — collapse to logo-only pill when reading, expand on hover ──────────
function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    let lastY = 0;
    let ticking = false;

    function tick() {
        const y = window.scrollY;
        if (y > 220) {
            if (y > lastY + 4) {
                nav.classList.add('nav--collapsed');
            } else if (y < lastY - 4) {
                nav.classList.remove('nav--collapsed');
            }
        } else {
            nav.classList.remove('nav--collapsed');
        }
        lastY = y;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(tick); ticking = true; }
    }, { passive: true });

    requestAnimationFrame(() => { nav.style.opacity = '1'; });
}

// ─── Project data ────────────────────────────────────────────────────────────
const R = PROJECTS.retouching;

// idx within PROJECTS.retouching
const FEATURED_IDX = 25; // Vogue × Mercedes-Maybach

// widePortrait: true → 16:9 ratio (less extreme crop for portrait subjects)
// widePos: override object-position for wide crop
// pos: override object-position for normal 3:2 crop
const PRIMARY = [
    { idx: 0,  wide: true,  widePortrait: true,  widePos: 'center 10%'  },  // Isha Ambani — face, upper frame
    { idx: 4,  wide: false, pos: 'center 22%'                            },  // AJIO — fashion, face focus
    { idx: 7,  wide: false, pos: '80% 5%'                                },  // Reebok — sports energy, crop tight
    { idx: 5,  wide: true,  widePos: '62% 38%'                          },  // AZORTE group campaign — landscape
    { idx: 11, wide: false, pos: '50% 44%'                               },  // TITAN — product centred
    { idx: 9,  wide: false, pos: 'center 15%'                            },  // Money Heist — character faces
    { idx: 28, wide: true,  widePortrait: true,  widePos: '38% 18%'     },  // Pooja Hegde — celeb, face & figure
    { idx: 29, wide: false, pos: 'center 14%'                            },  // GIVA Anushka — jewellery portrait
    { idx: 2,  wide: false, pos: 'center 10%'                            },  // Janhvi Kapoor TIFF — face, upper frame
];

// arcPos: manual override for archive card object-position (overrides thumbFocus from data)
const ARCHIVE = [
    { idx: 1  },                          // center 20% — couple portrait, good
    { idx: 3  },                          // 50% 25% — phone + model, good
    { idx: 6  },                          // 25% 50% — product CGI, good
    { idx: 8  },                          // 40% 50% — beauty/hair, good
    { idx: 10 },                          // center 10% — beauty face, good
    { idx: 12 },                          // 35% 50% — phone campaign, good
    { idx: 13 },                          // 80% 15% — Money Heist character, good
    { idx: 14, arcPos: 'center 18%' },   // Malavika — override 50% 50% → face focus
    { idx: 15 },                          // center 10% — beauty face, good
    { idx: 16 },                          // 65% 50% — menswear, good
    { idx: 17 },                          // center 15% — Kiara portrait, good
    { idx: 18 },                          // center 18% — fashion editorial, good
    { idx: 19 },                          // center 12% — Femina portrait, good
    { idx: 20 },                          // center 12% — Kartik portrait, good
    { idx: 21 },                          // 55% 50% — product watch, good
    { idx: 22 },                          // center 16% — wedding portrait, good
    { idx: 24, arcPos: 'center 28%' },   // Hollywood Reporter — override from 95% bottom to upper body
    { idx: 26 },                          // center 16% — fashion editorial, good
    { idx: 27 },                          // center 16% — fashion editorial, good
];

// ─── Lazy load ────────────────────────────────────────────────────────────────
function initLazy() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const img = e.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                delete img.dataset.src;
                img.classList.remove('cic-lazy');
            }
            obs.unobserve(img);
        });
    }, { rootMargin: '0px 0px 600px 0px' });

    document.querySelectorAll('.cic-lazy').forEach(img => obs.observe(img));
}

// ─── Build featured card ──────────────────────────────────────────────────────
function buildFeaturedCard() {
    const p = R[FEATURED_IDX];
    if (!p) return null;

    const wrap = document.createElement('div');
    wrap.className = 'cic-feat-card';

    wrap.innerHTML = `
        <div class="cic-feat-card__visual">
            <img class="cic-feat-card__img cic-lazy"
                 data-src="${p.cover}"
                 alt="${p.title}" />
            <div class="cic-feat-card__overlay" aria-hidden="true"></div>
        </div>
        <div class="cic-feat-card__body">
            <span class="cic-feat-card__label">Featured Project</span>
            <h2 class="cic-feat-card__title">${p.title}</h2>
            <p class="cic-feat-card__role">${p.tag}</p>
            <p class="cic-feat-card__note">${p.desc}</p>
            <button class="cic-feat-card__cta" type="button">
                View Project <span class="cic-feat-card__arrow" aria-hidden="true">→</span>
            </button>
        </div>
    `;

    const handler = () => openLightbox(p, 0, 'retouching', FEATURED_IDX);
    wrap.querySelector('.cic-feat-card__visual').addEventListener('click', handler);
    wrap.querySelector('.cic-feat-card__cta').addEventListener('click', handler);

    return wrap;
}

// ─── Build primary card ───────────────────────────────────────────────────────
function buildCard(entry) {
    const p = R[entry.idx];
    if (!p) return null;

    // Class: wide → full-width; widePortrait → 16:9 instead of 18:9 for face/figure shots
    let cls = 'cic-card';
    if (entry.wide) cls += entry.widePortrait ? ' cic-card--wide-portrait' : ' cic-card--wide';

    const card = document.createElement('div');
    card.className = cls;

    const count = p.images?.length ?? 1;

    // Art-directed position: wide cards use widePos, normal cards use pos, fallback to thumbFocus
    const rawPos = entry.wide
        ? (entry.widePos || p.thumbFocus || 'center center')
        : (entry.pos   || p.thumbFocus || 'center center');
    const focusStyle = `object-position: ${rawPos};`;

    card.innerHTML = `
        <div class="cic-card__visual">
            <img class="cic-card__img cic-lazy"
                 data-src="${p.cover}"
                 alt="${p.title}"
                 style="${focusStyle}" />
        </div>
        <div class="cic-card__body">
            <div class="cic-card__meta">
                <span class="cic-card__role">${p.tag}</span>
                <span class="cic-card__count">${count} Image${count !== 1 ? 's' : ''}</span>
            </div>
            <h3 class="cic-card__title">${p.title}</h3>
            <div class="cic-card__footer">
                <button class="cic-card__cta" type="button">
                    View Project <span class="cic-card__cta-arrow" aria-hidden="true">→</span>
                </button>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openLightbox(p, 0, 'retouching', entry.idx));

    return card;
}

// ─── Build archive card ───────────────────────────────────────────────────────
function buildArchiveCard(entry) {
    const p = R[entry.idx];
    if (!p) return null;

    const card = document.createElement('div');
    card.className = 'cic-arc-card';

    const focusStyle = `object-position: ${entry.arcPos || p.thumbFocus || 'center 20%'};`;

    card.innerHTML = `
        <div class="cic-arc-card__visual">
            <img class="cic-arc-card__img cic-lazy"
                 data-src="${p.cover}"
                 alt="${p.title}"
                 style="${focusStyle}" />
        </div>
        <div class="cic-arc-card__body">
            <div class="cic-arc-card__role">${p.tag}</div>
            <h4 class="cic-arc-card__title">${p.title}</h4>
        </div>
    `;

    card.addEventListener('click', () => openLightbox(p, 0, 'retouching', entry.idx));

    return card;
}

// ─── Animations ───────────────────────────────────────────────────────────────
function initReveal() {
    const ease = 'power3.out';

    // Hero — set start positions, then animate in
    gsap.set('.cic-hero__taxonomy', { y: 20 });
    gsap.set('.cic-hero__title',    { y: 40 });
    gsap.set('.cic-hero__desc',     { y: 24 });
    gsap.set('.cic-hero__years',    { y: 16 });

    gsap.to('.cic-hero__taxonomy', { y: 0, opacity: 1, duration: 0.8, delay: 0.15, ease });
    gsap.to('.cic-hero__title',    { y: 0, opacity: 1, duration: 1.0, delay: 0.25, ease });
    gsap.to('.cic-hero__desc',     { y: 0, opacity: 1, duration: 0.9, delay: 0.40, ease });
    gsap.to('.cic-hero__years',    { y: 0, opacity: 1, duration: 0.8, delay: 0.50, ease });

    // Featured card
    gsap.set('.cic-feat-card', { y: 48 });
    ScrollTrigger.create({
        trigger: '.cic-feat-card',
        start: 'top 88%',
        onEnter: () => gsap.to('.cic-feat-card', { y: 0, opacity: 1, duration: 1.1, ease }),
    });

    // Grid header
    gsap.set('.cic-grid__header', { y: 20 });
    ScrollTrigger.create({
        trigger: '.cic-grid__header',
        start: 'top 90%',
        onEnter: () => gsap.to('.cic-grid__header', { y: 0, opacity: 1, duration: 0.8, ease }),
    });

    // Primary cards — no delay for wide (full-width) cards, slight stagger for paired normal cards
    document.querySelectorAll('.cic-card').forEach((el, i) => {
        const isWide = el.classList.contains('cic-card--wide') || el.classList.contains('cic-card--wide-portrait');
        gsap.set(el, { y: 32 });
        ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.9, delay: isWide ? 0 : (i % 2) * 0.07, ease }),
        });
    });

    // Archive header
    gsap.set('.cic-archive__header', { y: 20 });
    ScrollTrigger.create({
        trigger: '.cic-archive__header',
        start: 'top 90%',
        onEnter: () => gsap.to('.cic-archive__header', { y: 0, opacity: 1, duration: 0.8, ease }),
    });

    // Archive cards — staggered by column
    document.querySelectorAll('.cic-arc-card').forEach((el, i) => {
        gsap.set(el, { y: 24 });
        ScrollTrigger.create({
            trigger: el,
            start: 'top 93%',
            onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.7, delay: (i % 3) * 0.055, ease }),
        });
    });

    // Contact
    gsap.set('.cic-contact__text', { y: 24 });
    gsap.set('.cic-contact__cta',  { y: 16 });
    ScrollTrigger.create({
        trigger: '.cic-contact',
        start: 'top 85%',
        onEnter: () => {
            gsap.to('.cic-contact__text', { y: 0, opacity: 1, duration: 0.9, ease });
            gsap.to('.cic-contact__cta',  { y: 0, opacity: 1, duration: 0.8, delay: 0.12, ease });
        },
    });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
    injectLightbox();
    initNav();

    // Featured
    const featSlot = document.getElementById('cic-featured-slot');
    const featCard = buildFeaturedCard();
    if (featSlot && featCard) featSlot.appendChild(featCard);

    // Primary grid
    const gridList = document.getElementById('cic-grid-list');
    if (gridList) {
        PRIMARY.forEach(entry => {
            const card = buildCard(entry);
            if (card) gridList.appendChild(card);
        });
    }

    // Archive
    const arcList = document.getElementById('cic-archive-list');
    if (arcList) {
        ARCHIVE.forEach(entry => {
            const card = buildArchiveCard(entry);
            if (card) arcList.appendChild(card);
        });
    }

    initLazy();

    requestAnimationFrame(() => {
        initReveal();
        ScrollTrigger.refresh();
    });

    // Reveal page
    document.body.style.opacity = '1';
}

document.addEventListener('DOMContentLoaded', init);
