// ─── Websites & Digital Products — Category Page ───

import '../styles/websites-page.scss';

// CSS is injected by the line above — reveal the page now to avoid FOUC
const reveal = () => document.body.classList.add('ready');
if (document.body) reveal();
else document.addEventListener('DOMContentLoaded', reveal);

import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Smooth scroll ────────────────────────────────────────────────────────────
const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
(function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);

// ─── Nav hide/show on scroll ──────────────────────────────────────────────────
function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    let lastY = 0, ticking = false;
    function tick() {
        const y = window.scrollY;
        if (y > 220) {
            if (y > lastY + 4)       nav.classList.add('nav--collapsed');
            else if (y < lastY - 4) nav.classList.remove('nav--collapsed');
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
const WEBSITES = [
    {
        id: 'arvion',
        title: 'ARVION',
        subtitle: 'Painted Silence',
        category: 'Brand Site',
        year: '2026',
        status: 'Live',
        desc: 'A minimalist art studio website for an oil painting collection — 27 landscape works across three chapters. Designed to let the paintings command the space.',
        challenge: 'A 27-painting collection needed a digital home that let the work speak — no gallery clutter, no commerce noise. The site had to feel like visiting a private exhibition.',
        approach: 'Minimal chrome, editorial typography, full-bleed painting presentation structured across three chapter-based navigation flows.',
        result: 'A contemplative brand site that treats the browser as a gallery wall.',
        tags: ['Next.js', 'Vercel', 'Editorial', 'Art Direction'],
        url: 'https://arvion-ten.vercel.app/',
        urlDisplay: 'arvion-ten.vercel.app',
        cover: '/images/portfolio/websites/arvion/01.webp',
        screens: [
            '/images/portfolio/vibe-coding/arvion/02.webp',
            '/images/portfolio/vibe-coding/arvion/03.webp',
            '/images/portfolio/vibe-coding/arvion/04.webp',
        ],
        caseStudyHref: null,
        featured: false,
        showcase: true,
    },
    {
        id: 'orange-velvet',
        title: 'Orange Velvet',
        subtitle: 'A Cinematic Experience',
        category: 'Digital Experience',
        year: '2025',
        status: 'Live',
        desc: 'A premium cinematic web experience — high-fashion portraiture, deep shadow, and vivid light assembled into a sweeping visual narrative.',
        challenge: 'Fashion portraiture across three cities needed to feel like one coherent editorial narrative, not a disconnected shoot archive.',
        approach: 'Cinematic scroll sequencing via GSAP — images revealed in controlled rhythm, shadow grading matched to shoot aesthetics.',
        result: 'An immersive experience where photography direction and web motion feel unified.',
        tags: ['GSAP', 'Cinematic', 'Editorial', 'Photography'],
        url: 'https://orange-velvet-cinematic.vercel.app',
        urlDisplay: 'orange-velvet-cinematic.vercel.app',
        cover: '/images/portfolio/websites/orange-velvet/01.webp',
        screens: [
            '/images/portfolio/websites/orange-velvet/02.webp',
            '/images/portfolio/websites/orange-velvet/03.webp',
            '/images/portfolio/websites/orange-velvet/04.webp',
        ],
        caseStudyHref: null,
        featured: true,
        showcase: false,
    },
    {
        id: 'flowkit',
        title: 'FlowKit',
        subtitle: 'Premium Animated UI Components',
        category: 'Developer Tool',
        year: '2025',
        status: 'Live',
        desc: 'A curated library of premium animated UI components for React — browse, preview, and copy production-ready components instantly. Free to use.',
        challenge: 'Developer component libraries feel cold and technical. FlowKit needed to feel premium and immediately useful to both developers and designers.',
        approach: 'Live-preview-first layout, component isolation, one-click copy — minimal friction from browse to build.',
        result: 'A developer tool that designers actually want to use.',
        tags: ['Next.js', 'React', 'Tailwind', 'Framer Motion'],
        url: 'https://flowkit-beta.vercel.app',
        urlDisplay: 'flowkit-beta.vercel.app',
        cover: '/images/portfolio/websites/flowkit/01.webp',
        screens: [],
        caseStudyHref: null,
        featured: false,
        showcase: true,
    },
    {
        id: 'the-glitch',
        title: 'THE GLITCH',
        subtitle: 'A Digital Artifact',
        category: 'Digital Experience',
        year: '2025',
        status: 'Live',
        desc: 'A digital event where physical reality is overwritten by geometric data structures — an immersive visual experience at the edge of code and art.',
        challenge: 'Translate the sensation of physical reality overwritten by data — an artistic concept that resists conventional web presentation.',
        approach: 'WebGL shader layers over real photography, user-interaction-driven distortion, geometric data overlays.',
        result: 'An interactive artifact at the boundary between code art and exhibition.',
        tags: ['WebGL', 'Immersive', 'Interactive', 'Art Direction'],
        url: 'https://the-glitch-gold.vercel.app',
        urlDisplay: 'the-glitch-gold.vercel.app',
        cover: '/images/portfolio/websites/the-glitch/01.webp',
        screens: [],
        caseStudyHref: null,
        featured: false,
        showcase: false,
    },
    {
        id: 'chain-reaction',
        title: 'Chain Reaction',
        subtitle: 'Next Generation',
        category: 'Web Game',
        year: '2025',
        status: 'Live',
        desc: 'A next-generation Chain Reaction strategy game with stunning visuals, AI opponents, and explosive chain reactions — playable in the browser.',
        challenge: 'Reimagine a classic strategy game for modern visual standards — premium aesthetics in a browser game context without sacrificing playability.',
        approach: 'GPU-accelerated chain animations, AI opponent logic, a dark premium UI that elevates the strategy layer.',
        result: 'A browser game that feels like a premium product, not a prototype.',
        tags: ['Game', 'AI', 'Interactive', 'JavaScript'],
        url: 'https://chain-reaction-game-phi.vercel.app',
        urlDisplay: 'chain-reaction-game-phi.vercel.app',
        cover: '/images/portfolio/websites/chain-reaction/01.webp',
        screens: [],
        caseStudyHref: null,
        featured: false,
        showcase: false,
    },
    {
        id: 'atomic-atlas',
        title: 'Atomic Atlas',
        subtitle: 'Chemistry Atom Structure',
        category: 'Web App',
        year: '2025',
        status: 'Live',
        desc: 'An interactive atlas of atomic structures — explore elements and their electron configurations through clean, precise visual presentation.',
        challenge: 'Atomic structure data is typically presented in dry academic formats. The goal was visual clarity and wonder, simultaneously.',
        approach: 'Precise vector rendering of electron shell models, element-driven color palette, frictionless element navigation.',
        result: 'An educational tool that makes chemistry feel elegant.',
        tags: ['Interactive', 'Science', 'Educational', 'Web App'],
        url: 'https://chemistry-atom-structure.vercel.app',
        urlDisplay: 'chemistry-atom-structure.vercel.app',
        cover: '/images/portfolio/websites/atomic-atlas/01.webp',
        screens: [],
        caseStudyHref: null,
        featured: false,
        showcase: false,
    },
];

// ─── Shared component builders ────────────────────────────────────────────────

function buildBrowser(src, alt, urlDisplay) {
    const screenContent = src
        ? `<img class="wdp-browser__img wdp-lazy" data-src="${src}" alt="${alt}" />`
        : `<div class="wdp-browser__placeholder" aria-hidden="true">
             <span class="wdp-browser__placeholder-project">${alt}</span>
             <span class="wdp-browser__placeholder-label">Preview coming soon</span>
           </div>`;
    return `
        <div class="wdp-browser">
          <div class="wdp-browser__chrome">
            <div class="wdp-browser__dots"><span></span><span></span><span></span></div>
            <div class="wdp-browser__url">${urlDisplay}</div>
            <div class="wdp-browser__spacer"></div>
          </div>
          <div class="wdp-browser__screen">${screenContent}</div>
        </div>`;
}

function buildVisitHint() {
    return `<div class="wdp-visit-hint" aria-hidden="true">
        Visit Site
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M7 17L17 7"/><polyline points="7 7 17 7 17 17"/>
        </svg>
    </div>`;
}

// Archive teasers show only Challenge + Approach, 1-line each. Result is for case-study pages only.
function buildCaseTeaser(site) {
    if (!site.challenge && !site.approach) return '';
    const items = [
        site.challenge && { label: 'Challenge', text: site.challenge },
        site.approach  && { label: 'Approach',  text: site.approach  },
    ].filter(Boolean);
    return `<div class="wdp-teaser">
        ${items.map(({ label, text }) => `
          <div class="wdp-teaser__item">
            <span class="wdp-teaser__label">${label}</span>
            <p class="wdp-teaser__text">${text}</p>
          </div>`).join('')}
    </div>`;
}

function buildCTAs(site) {
    const visit = site.url
        ? `<a class="wdp-cta wdp-cta--primary" href="${site.url}" target="_blank" rel="noopener noreferrer">
             Visit Site <span class="wdp-cta__arrow" aria-hidden="true">→</span></a>`
        : '';
    const cs = site.caseStudyHref
        ? `<a class="wdp-cta wdp-cta--secondary" href="${site.caseStudyHref}">
             View Case Study <span class="wdp-cta__arrow" aria-hidden="true">→</span></a>`
        : '';
    return visit + cs;
}

// ─── Featured card (full-width 16:9 stage + 2-col content below) ──────────────
function buildFeaturedCard(site) {
    const screensHtml = site.screens.length > 0
        ? `<div class="wdp-feat-card__screens">
             ${site.screens.map(s => `
               <div class="wdp-feat-card__screen-thumb">
                 <img class="wdp-feat-card__screen-img wdp-lazy" data-src="${s}" alt="${site.title} screen" />
               </div>`).join('')}
           </div>`
        : '';

    const stageOpen = site.cover
        ? `<a class="wdp-feat-card__stage" href="${site.url}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${site.title} — open live site">`
        : `<div class="wdp-feat-card__stage wdp-feat-card__stage--placeholder">`;
    const stageClose = site.cover ? `</a>` : `</div>`;
    const hint = site.cover ? buildVisitHint() : '';

    const el = document.createElement('article');
    el.className = 'wdp-feat-card';
    el.dataset.animate = 'feat';
    el.innerHTML = `
      ${stageOpen}
        ${buildBrowser(site.cover, site.title, site.urlDisplay)}
        ${hint}
      ${stageClose}

      <div class="wdp-feat-card__body">
        <div class="wdp-feat-card__identity">
          <div class="wdp-feat-card__meta">
            <span class="wdp-cat-tag">${site.category}</span>
            <span class="wdp-feat-card__year">${site.year}</span>
            ${site.status ? `<span class="wdp-status-dot" title="${site.status}"></span>` : ''}
          </div>
          <div class="wdp-feat-card__titles">
            <h2 class="wdp-feat-card__title">${site.title}</h2>
            <p class="wdp-feat-card__subtitle">${site.subtitle}</p>
          </div>
          <p class="wdp-feat-card__desc">${site.desc}</p>
          ${screensHtml}
        </div>

        <div class="wdp-feat-card__details">
          <p class="wdp-feat-card__cs-heading">Case Study</p>
          ${buildCaseTeaser(site)}
          <div class="wdp-feat-card__footer">${buildCTAs(site)}</div>
        </div>
      </div>`;
    return el;
}

// ─── Showcase block (alternating 60 / 40 split) ───────────────────────────────
function buildShowcaseBlock(site, altLayout = false) {
    const tags = site.tags.map(t => `<span class="wdp-tag">${t}</span>`).join('');
    const scOpen = site.cover
        ? `<a class="wdp-showcase-block__visual" href="${site.url}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${site.title} — open live site">`
        : `<div class="wdp-showcase-block__visual wdp-showcase-block__visual--placeholder">`;
    const scClose = site.cover ? `</a>` : `</div>`;

    const el = document.createElement('article');
    el.className = `wdp-showcase-block${altLayout ? ' wdp-showcase-block--alt' : ''}`;
    el.dataset.animate = 'showcase';
    el.innerHTML = `
      ${scOpen}
        ${buildBrowser(site.cover, site.title, site.urlDisplay)}
        ${site.cover ? buildVisitHint() : ''}
      ${scClose}

      <div class="wdp-showcase-block__content">
        <div class="wdp-showcase-block__meta">
          <span class="wdp-cat-tag">${site.category}</span>
          <span class="wdp-showcase-block__year">${site.year}</span>
          ${site.status ? `<span class="wdp-status-dot" title="${site.status}"></span>` : ''}
        </div>
        <div class="wdp-showcase-block__titles">
          <h3 class="wdp-showcase-block__title">${site.title}</h3>
          <p class="wdp-showcase-block__subtitle">${site.subtitle}</p>
        </div>
        <p class="wdp-showcase-block__desc">${site.desc}</p>
        ${buildCaseTeaser(site)}
        <div class="wdp-showcase-block__tags">${tags}</div>

        <div class="wdp-showcase-block__footer">${buildCTAs(site)}</div>
      </div>`;
    return el;
}

// ─── Index-specific CTAs: always shows visit + case study or "coming soon" ────
function buildIndexCTAs(site) {
    const visit = site.url
        ? `<a class="wdp-cta wdp-cta--primary" href="${site.url}" target="_blank" rel="noopener noreferrer">
             Visit Site <span class="wdp-cta__arrow" aria-hidden="true">→</span></a>`
        : '';
    const cs = site.caseStudyHref
        ? `<a class="wdp-cta wdp-cta--secondary" href="${site.caseStudyHref}">
             Case Study <span class="wdp-cta__arrow" aria-hidden="true">→</span></a>`
        : `<span class="wdp-cta wdp-cta--coming" aria-hidden="true">Case Study Coming Soon</span>`;
    return visit + cs;
}

// ─── Index card (stacked: 16:9 browser + compact content, 2-col grid) ────────
function buildIndexCard(site, index) {
    const num = String(index + 1).padStart(2, '0');
    const tags = site.tags.slice(0, 3).map(t => `<span class="wdp-tag">${t}</span>`).join('');
    const visualEl = (site.url && site.cover)
        ? `<a class="wdp-idx-card__visual" href="${site.url}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${site.title}">
             ${buildBrowser(site.cover, site.title, site.urlDisplay)}
             ${buildVisitHint()}
           </a>`
        : `<div class="wdp-idx-card__visual wdp-idx-card__visual--placeholder">
             ${buildBrowser(site.cover, site.title, site.urlDisplay)}
           </div>`;

    const el = document.createElement('article');
    el.className = 'wdp-idx-card';
    el.dataset.animate = 'index';
    el.innerHTML = `
      ${visualEl}
      <div class="wdp-idx-card__body">
        <div class="wdp-idx-card__top">
          <span class="wdp-idx-card__num">${num}</span>
          <span class="wdp-cat-tag">${site.category}</span>
          <span class="wdp-idx-card__year">${site.year}</span>
        </div>
        <h3 class="wdp-idx-card__title">${site.title}</h3>
        <p class="wdp-idx-card__subtitle">${site.subtitle}</p>
        <div class="wdp-idx-card__tags">${tags}</div>
        <div class="wdp-idx-card__actions">${buildIndexCTAs(site)}</div>
      </div>`;
    return el;
}

// ─── Lazy-load with 404 fallback ──────────────────────────────────────────────
function initLazy() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const img = e.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                delete img.dataset.src;
                img.classList.remove('wdp-lazy');
                img.addEventListener('error', () => {
                    const ph = document.createElement('div');
                    ph.className = 'wdp-browser__placeholder';
                    ph.setAttribute('aria-hidden', 'true');
                    ph.innerHTML = `
                        <span class="wdp-browser__placeholder-project">${img.alt || ''}</span>
                        <span class="wdp-browser__placeholder-label">Preview coming soon</span>`;
                    img.replaceWith(ph);
                }, { once: true });
            }
            obs.unobserve(img);
        });
    }, { rootMargin: '0px 0px 600px 0px' });
    document.querySelectorAll('.wdp-lazy').forEach(img => obs.observe(img));
}

// ─── Scroll-based reveal animations ──────────────────────────────────────────
function initReveal() {
    const ease = 'power3.out';

    // Hero — immediate entrance (CSS sets opacity:0)
    gsap.set('.wdp-hero__taxonomy', { y: 20 });
    gsap.set('.wdp-hero__title',    { y: 40 });
    gsap.set('.wdp-hero__desc',     { y: 24 });
    gsap.set('.wdp-hero__sub',      { y: 16 });
    gsap.to('.wdp-hero__taxonomy', { y: 0, opacity: 1, duration: 0.8,  delay: 0.15, ease });
    gsap.to('.wdp-hero__title',    { y: 0, opacity: 1, duration: 1.0,  delay: 0.25, ease });
    gsap.to('.wdp-hero__desc',     { y: 0, opacity: 1, duration: 0.9,  delay: 0.40, ease });
    gsap.to('.wdp-hero__sub',      { y: 0, opacity: 1, duration: 0.8,  delay: 0.52, ease });

    // Featured card
    const feat = document.querySelector('[data-animate="feat"]');
    if (feat) {
        gsap.fromTo(feat, { opacity: 0, y: 56 }, {
            opacity: 1, y: 0, duration: 1.4, ease,
            scrollTrigger: { trigger: feat, start: 'top 88%', toggleActions: 'play none none none' },
        });
    }

    // Showcase section label
    const showcaseLabel = document.querySelector('.wdp-showcase__header');
    if (showcaseLabel) {
        gsap.fromTo(showcaseLabel, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.9, ease,
            scrollTrigger: { trigger: showcaseLabel, start: 'top 90%', toggleActions: 'play none none none' },
        });
    }

    // Showcase blocks
    document.querySelectorAll('[data-animate="showcase"]').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 44 }, {
            opacity: 1, y: 0, duration: 1.3, ease,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        });
    });

    // Index header
    const idxHeader = document.querySelector('.wdp-index__header');
    if (idxHeader) {
        gsap.fromTo(idxHeader, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.9, ease,
            scrollTrigger: { trigger: idxHeader, start: 'top 90%', toggleActions: 'play none none none' },
        });
    }

    // Index cards — staggered by column (2-col grid)
    document.querySelectorAll('[data-animate="index"]').forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 36 }, {
            opacity: 1, y: 0, duration: 1.1, delay: (i % 2) * 0.09, ease,
            scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' },
        });
    });

    // Process title + steps
    const processTitle = document.querySelector('.wdp-process__title');
    if (processTitle) {
        gsap.fromTo(processTitle, { opacity: 0, y: 24 }, {
            opacity: 1, y: 0, duration: 1.0, ease,
            scrollTrigger: { trigger: processTitle, start: 'top 88%', toggleActions: 'play none none none' },
        });
    }
    const stepsParent = document.querySelector('.wdp-process__steps');
    document.querySelectorAll('.wdp-process__step').forEach((step, i) => {
        gsap.fromTo(step, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.85, delay: i * 0.07, ease,
            scrollTrigger: { trigger: stepsParent, start: 'top 85%', toggleActions: 'play none none none' },
        });
    });

    // Contact CTA
    const contactInner = document.querySelector('.wdp-contact__inner');
    if (contactInner) {
        gsap.fromTo([...contactInner.children], { opacity: 0, y: 28 }, {
            opacity: 1, y: 0, duration: 1.0, stagger: 0.12, ease,
            scrollTrigger: { trigger: contactInner, start: 'top 90%', toggleActions: 'play none none none' },
        });
    }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
    initNav();

    const featSlot     = document.getElementById('wdp-featured-slot');
    const showcaseList = document.getElementById('wdp-showcase-list');
    const indexList    = document.getElementById('wdp-index-list');
    const countEl      = document.getElementById('wdp-count');

    if (!featSlot || !indexList) return;

    const featured = WEBSITES.find(s => s.featured) || WEBSITES[0];
    if (featured) featSlot.appendChild(buildFeaturedCard(featured));

    if (showcaseList) {
        WEBSITES.filter(s => s.showcase).forEach((site, i) => {
            showcaseList.appendChild(buildShowcaseBlock(site, i % 2 === 1));
        });
    }

    WEBSITES.forEach((site, i) => indexList.appendChild(buildIndexCard(site, i)));

    if (countEl) countEl.textContent = `${WEBSITES.length} Project${WEBSITES.length !== 1 ? 's' : ''}`;

    initLazy();
    requestAnimationFrame(() => { initReveal(); ScrollTrigger.refresh(); });
    document.body.style.opacity = '1';
}

document.addEventListener('DOMContentLoaded', init);
