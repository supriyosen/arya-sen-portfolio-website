// ─── AI Campaign Systems — Category Page ───

import '../styles/ai-campaigns.scss';

// CSS is injected by the line above — reveal the page now to avoid FOUC
const reveal = () => document.body.classList.add('ready');
if (document.body) reveal();
else document.addEventListener('DOMContentLoaded', reveal);

import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, openLightbox, injectLightbox } from './work-filter.js';

gsap.registerPlugin(ScrollTrigger);

// ─── Smooth scroll ────────────────────────────────────────────────────────────
const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
(function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);

// ─── Nav — collapse to logo-only pill when scrolling ─────────────────────────
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

// ─── Project data ─────────────────────────────────────────────────────────────
const AI = PROJECTS['ai-design'];

// Index 3: LOEWE × LEGO — Built to Carry (18 visuals, strongest brand campaign)
const FEATURED_IDX = 3;

// Grid — all remaining projects, ordered editorially
// wide: true → spans both columns (18:9 aspect ratio)
const GRID = [
    { idx: 12, wide: true  },   // VERSACE × Barilla — "Al Dente. All Drama." — 23 visuals
    { idx: 0,  wide: false },   // SOLVEA — AI Brand Campaign — 12 visuals
    { idx: 7,  wide: false },   // TRESemmé Hydra Matrix — 16 visuals
    { idx: 5,  wide: true  },   // Bureau of Burdens — 35 visuals
    { idx: 2,  wide: false },   // AERIS Wearables — 13 visuals
    { idx: 9,  wide: false },   // Corona Extra — 7 visuals
    { idx: 8,  wide: true  },   // Crystal Bloom — 20 visuals
    { idx: 10, wide: false },   // Maggi Rebrand — 13 visuals
    { idx: 4,  wide: false },   // Renaissance Reboot — 15 visuals
    { idx: 11, wide: false },   // VIOLETTE — 10 visuals
    { idx: 6,  wide: false },   // Melon Kings — 30 visuals
    { idx: 1,  wide: false },   // Redmi Pad — 14 visuals
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
                img.classList.remove('acs-lazy');
            }
            obs.unobserve(img);
        });
    }, { rootMargin: '0px 0px 600px 0px' });

    document.querySelectorAll('.acs-lazy').forEach(img => obs.observe(img));
}

// ─── Build featured card ──────────────────────────────────────────────────────
function buildFeaturedCard() {
    const p = AI[FEATURED_IDX];
    if (!p) return null;

    const count = p.images?.length ?? 1;

    // Pick 3 supporting thumbnails (skip index 0 which is the cover)
    const thumbSrcs = (p.images || []).slice(1, 4);
    const thumbsHtml = thumbSrcs.map(src => `
        <div class="acs-feat-card__thumb-wrap">
            <img class="acs-feat-card__thumb acs-lazy"
                 data-src="${src}"
                 alt="${p.title}" />
        </div>
    `).join('');

    const wrap = document.createElement('div');
    wrap.className = 'acs-feat-card';

    wrap.innerHTML = `
        <div class="acs-feat-card__visual">
            <img class="acs-feat-card__img acs-lazy"
                 data-src="${p.cover}"
                 alt="${p.title}" />
            <div class="acs-feat-card__overlay" aria-hidden="true"></div>
        </div>
        <div class="acs-feat-card__body">
            <span class="acs-feat-card__label">Featured Campaign System</span>
            <h2 class="acs-feat-card__title">${p.title}</h2>
            <p class="acs-feat-card__type">${p.tag}</p>
            <p class="acs-feat-card__note">${p.desc}</p>
            ${thumbsHtml.length ? `<div class="acs-feat-card__thumbs">${thumbsHtml}</div>` : ''}
            <div class="acs-feat-card__footer">
                <span class="acs-feat-card__count">${count} Visuals</span>
                <button class="acs-feat-card__cta" type="button">
                    View Campaign <span class="acs-feat-card__arrow" aria-hidden="true">→</span>
                </button>
            </div>
        </div>
    `;

    const handler = () => openLightbox(p, 0, 'ai-design', FEATURED_IDX);
    wrap.querySelector('.acs-feat-card__visual').addEventListener('click', handler);
    wrap.querySelector('.acs-feat-card__cta').addEventListener('click', handler);

    return wrap;
}

// ─── Build grid card ──────────────────────────────────────────────────────────
function buildCard(entry) {
    const p = AI[entry.idx];
    if (!p) return null;

    const count = p.images?.length ?? 1;
    const showStrip = count >= 8;

    // 3 supporting thumbnails for strip (skip cover at index 0)
    const stripSrcs = showStrip ? (p.images || []).slice(1, 4) : [];
    const stripHtml = stripSrcs.map(src => `
        <div class="acs-card__strip-wrap">
            <img class="acs-card__strip-img acs-lazy"
                 data-src="${src}"
                 alt="${p.title}" />
        </div>
    `).join('');

    const card = document.createElement('div');
    card.className = `acs-card${entry.wide ? ' acs-card--wide' : ''}`;

    card.innerHTML = `
        <div class="acs-card__visual">
            <img class="acs-card__img acs-lazy"
                 data-src="${p.cover}"
                 alt="${p.title}" />
        </div>
        ${showStrip ? `<div class="acs-card__strip">${stripHtml}</div>` : ''}
        <div class="acs-card__body">
            <div class="acs-card__meta">
                <span class="acs-card__type">${p.tag}</span>
                <span class="acs-card__count">${count} Visuals</span>
            </div>
            <h3 class="acs-card__title">${p.title}</h3>
            <p class="acs-card__desc">${p.desc}</p>
            <div class="acs-card__footer">
                <button class="acs-card__cta" type="button">
                    View Campaign <span class="acs-card__arrow" aria-hidden="true">→</span>
                </button>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openLightbox(p, 0, 'ai-design', entry.idx));

    return card;
}

// ─── Animations ───────────────────────────────────────────────────────────────
function initReveal() {
    const ease = 'power3.out';

    // Hero
    gsap.set('.acs-hero__taxonomy', { y: 20 });
    gsap.set('.acs-hero__title',    { y: 40 });
    gsap.set('.acs-hero__desc',     { y: 24 });
    gsap.set('.acs-hero__sub',      { y: 16 });

    gsap.to('.acs-hero__taxonomy', { y: 0, opacity: 1, duration: 0.8, delay: 0.15, ease });
    gsap.to('.acs-hero__title',    { y: 0, opacity: 1, duration: 1.0, delay: 0.25, ease });
    gsap.to('.acs-hero__desc',     { y: 0, opacity: 1, duration: 0.9, delay: 0.40, ease });
    gsap.to('.acs-hero__sub',      { y: 0, opacity: 1, duration: 0.8, delay: 0.52, ease });

    // Featured card
    gsap.set('.acs-feat-card', { y: 48 });
    ScrollTrigger.create({
        trigger: '.acs-feat-card',
        start: 'top 88%',
        onEnter: () => gsap.to('.acs-feat-card', { y: 0, opacity: 1, duration: 1.1, ease }),
    });

    // Grid header
    gsap.set('.acs-grid__header', { y: 20 });
    ScrollTrigger.create({
        trigger: '.acs-grid__header',
        start: 'top 90%',
        onEnter: () => gsap.to('.acs-grid__header', { y: 0, opacity: 1, duration: 0.8, ease }),
    });

    // Grid cards
    document.querySelectorAll('.acs-card').forEach((el, i) => {
        const isWide = el.classList.contains('acs-card--wide');
        gsap.set(el, { y: 32 });
        ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.9, delay: isWide ? 0 : (i % 2) * 0.07, ease }),
        });
    });

    // Process
    gsap.set('.acs-process__eyebrow', { y: 16 });
    gsap.set('.acs-process__title',   { y: 24 });
    ScrollTrigger.create({
        trigger: '.acs-process',
        start: 'top 88%',
        onEnter: () => {
            gsap.to('.acs-process__eyebrow', { y: 0, opacity: 1, duration: 0.7, ease });
            gsap.to('.acs-process__title',   { y: 0, opacity: 1, duration: 0.8, delay: 0.08, ease });
        },
    });

    document.querySelectorAll('.acs-process__step').forEach((el, i) => {
        gsap.set(el, { y: 20 });
        ScrollTrigger.create({
            trigger: '.acs-process__steps',
            start: 'top 88%',
            onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.7, delay: i * 0.08, ease }),
        });
    });

    // Contact
    gsap.set('.acs-contact__note', { y: 12 });
    gsap.set('.acs-contact__text', { y: 24 });
    gsap.set('.acs-contact__cta',  { y: 16 });
    ScrollTrigger.create({
        trigger: '.acs-contact',
        start: 'top 85%',
        onEnter: () => {
            gsap.to('.acs-contact__note', { y: 0, opacity: 1, duration: 0.7, ease });
            gsap.to('.acs-contact__text', { y: 0, opacity: 1, duration: 0.9, delay: 0.08, ease });
            gsap.to('.acs-contact__cta',  { y: 0, opacity: 1, duration: 0.8, delay: 0.18, ease });
        },
    });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
    injectLightbox();
    initNav();

    // Featured
    const featSlot = document.getElementById('acs-featured-slot');
    const featCard = buildFeaturedCard();
    if (featSlot && featCard) featSlot.appendChild(featCard);

    // Grid
    const gridList = document.getElementById('acs-grid-list');
    if (gridList) {
        GRID.forEach(entry => {
            const card = buildCard(entry);
            if (card) gridList.appendChild(card);
        });
    }

    initLazy();

    requestAnimationFrame(() => {
        initReveal();
        ScrollTrigger.refresh();
    });

    document.body.style.opacity = '1';
}

document.addEventListener('DOMContentLoaded', init);
