// ─── Selected Work — Unified Portfolio System ───

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, openLightbox, injectLightbox, toThumb } from './work-filter.js';

// ─── Curated Homepage Gallery ───────────────────────────────────────────────
// Image-only. No project titles, categories, or metadata rendered here.
// Edit this array to swap / add / remove images.
// size: 'wide' (7/12 cols) | 'narrow' (5/12 cols) | 'third' (4/12 cols)
// aspect: CSS aspect-ratio string — matches the natural image ratio
export const SELECTED_IMAGES = [
    // ── Row 1 ──
    {
        src: '/images/portfolio/ai-design/loewe-lego/02.webp',
        alt: '',
        size: 'wide',
        aspect: '16/10',
    },
    {
        src: '/images/portfolio/ai-design/corona/01.webp',
        alt: '',
        size: 'narrow',
        aspect: '3/4',
    },
    // ── Row 2 ──
    {
        src: '/images/portfolio/ai-design/crystal-bloom/01.webp',
        alt: '',
        size: 'narrow',
        aspect: '3/4',
    },
    {
        src: '/images/portfolio/ai-design/melon-kings/04.webp',
        alt: '',
        size: 'wide',
        aspect: '16/10',
    },
    // ── Row 3 ──
    {
        src: '/images/portfolio/ai-design/aeris-wearables/01.webp',
        alt: '',
        size: 'wide',
        aspect: '16/10',
    },
    {
        src: '/images/portfolio/ai-design/versace-barilla/01.webp',
        alt: '',
        size: 'narrow',
        aspect: '3/4',
    },
];

// ─── Build Curated Image Gallery ───────────────────────────────────────────
function buildImageGallery(images) {
    const gallery = document.createElement('div');
    gallery.className = 'sw-gallery';

    images.forEach((imgData) => {
        const item = document.createElement('div');
        item.className = `sw-gallery-item sw-gallery-item--${imgData.size}`;

        const inner = document.createElement('div');
        inner.className = 'sw-gallery-item__inner';
        inner.style.aspectRatio = imgData.aspect;

        const img = document.createElement('img');
        img.className = 'sw-gallery-item__img lazy-sw';
        img.dataset.src = imgData.src;
        img.alt = imgData.alt || '';
        img.loading = 'lazy';

        inner.appendChild(img);
        item.appendChild(inner);
        gallery.appendChild(item);
    });

    return gallery;
}

// ─── Practice Areas Configuration ──────────────────────────────────────────
const PRACTICES = [
    {
        num: '01',
        title: 'Commercial Image Craft',
        desc: 'High-end retouching, compositing, beauty, fashion, product, and campaign finishing. Sixteen years of commercial visual work for global brands.',
        ctaLabel: 'VIEW COMMERCIAL WORK',
        ctaHref: '/work/commercial-image-craft',
        ctaExternal: false,
        thumbs: [
            { project: PROJECTS.retouching[0],  cat: 'retouching', idx: 0  },
            { project: PROJECTS.retouching[2],  cat: 'retouching', idx: 2  },
            { project: PROJECTS.retouching[9],  cat: 'retouching', idx: 9  },
            { project: PROJECTS.retouching[25], cat: 'retouching', idx: 25 },
        ],
        thumbAspect: '4 / 5',
    },
    {
        num: '02',
        title: 'AI Campaign Systems',
        desc: 'AI-led campaign visuals, product worlds, fashion and editorial concepts, and generative ad systems — from brief to final frame.',
        ctaLabel: 'VIEW AI CAMPAIGNS',
        ctaHref: '/work/ai-campaigns',
        ctaExternal: false,
        thumbs: [
            { project: PROJECTS['ai-design'][0], cat: 'ai-design', idx: 0 },
            { project: PROJECTS['ai-design'][3], cat: 'ai-design', idx: 3 },
            { project: PROJECTS['ai-design'][7], cat: 'ai-design', idx: 7 },
            { project: PROJECTS['ai-design'][9], cat: 'ai-design', idx: 9 },
        ],
        thumbAspect: '3 / 2',
    },
    {
        num: '03',
        title: 'Websites & Digital Products',
        desc: 'Brand sites, portfolio websites, landing pages, digital experiences, and product-facing web systems — coded, deployed, and live.',
        ctaLabel: 'VIEW DIGITAL WORK',
        ctaHref: '/work/websites',
        ctaExternal: false,
        website: {
            title: 'Orange Velvet',
            subtitle: 'A Cinematic Experience',
            category: 'Digital Experience',
            year: '2025',
            url: 'https://orange-velvet-cinematic.vercel.app',
            urlDisplay: 'orange-velvet-cinematic.vercel.app',
            cover: '/images/portfolio/websites/orange-velvet/01.webp',
        },
    },
    {
        num: '04',
        title: 'Apps & Creative Tools',
        desc: 'Usable online tools, AI assistants, workflow utilities, and creative productivity products. Built to be used, not just demoed.',
        ctaLabel: 'See All Tools',
        ctaHref: '/tools.html',
        ctaExternal: false,
        tools: [
            { num: '01', type: 'Web App',   label: 'Image tool',     status: 'soon' },
            { num: '02', type: 'AI Tool',   label: 'AI assistant',   status: 'soon' },
            { num: '03', type: 'Visual',    label: 'Visual utility',  status: 'soon' },
        ],
    },
    {
        num: '05',
        title: 'Visual Studies',
        desc: 'Street photography and personal image-making focused on light, timing, framing, and observation. A quieter personal archive.',
        ctaLabel: null,
        quiet: true,
        studies: [
            'Kolkata Streets — Dawn Patrol',
            'Monsoon Textures',
            'Faces of the Market',
            'Oil on Canvas — Solitude',
            'Light Painting — Long Exposure',
        ],
    },
];

// ─── Build Featured Card ────────────────────────────────────────────────────
function buildFeaturedCard(data, index) {
    const card = document.createElement('article');
    card.className = `sw-feat-card sw-feat-card--${index}`;

    const hasCover = !!data.cover;
    const bgStyle = hasCover
        ? `background-image:url('${data.cover}');background-position:${data.coverFocus || 'center'};`
        : '';

    const ctaEl = data.action === 'href'
        ? `<a class="sw-feat-card__cta" href="${data.href}"${data.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
             ${data.cta}
             <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
               <path d="M7 17L17 7"/><polyline points="7 7 17 7 17 17"/>
             </svg>
           </a>`
        : `<button class="sw-feat-card__cta sw-feat-card__cta--js" type="button">${data.cta} <span aria-hidden="true">→</span></button>`;

    card.innerHTML = `
      <div class="sw-feat-card__visual" style="${bgStyle}" aria-hidden="true">
        ${!hasCover ? '<div class="sw-feat-card__no-img"><span>04</span></div>' : ''}
        <div class="sw-feat-card__visual-overlay"></div>
      </div>
      <div class="sw-feat-card__body">
        <div class="sw-feat-card__cat">${data.category}</div>
        <h3 class="sw-feat-card__title">${data.title}</h3>
        <p class="sw-feat-card__desc">${data.desc}</p>
        <div class="sw-feat-card__footer">
          ${ctaEl}
        </div>
      </div>
    `;

    if (data.action === 'lightbox') {
        const project = PROJECTS[data.projectKey]?.[data.projectIndex];
        if (project) {
            const jsBtn = card.querySelector('.sw-feat-card__cta--js');
            const visual = card.querySelector('.sw-feat-card__visual');
            const handler = () => openLightbox(project, 0, data.projectKey, data.projectIndex);
            if (jsBtn) jsBtn.addEventListener('click', handler);
            if (visual) { visual.style.cursor = 'pointer'; visual.addEventListener('click', handler); }
        }
    }

    return card;
}

// ─── Build Thumbnail Grid (retouching / AI design) ──────────────────────────
function buildThumbGrid(thumbs, aspect) {
    const grid = document.createElement('div');
    grid.className = 'sw-thumbs';

    thumbs.forEach(({ project, cat, idx }) => {
        if (!project?.cover) return;
        const btn = document.createElement('button');
        btn.className = 'sw-thumb';
        btn.type = 'button';
        btn.setAttribute('aria-label', project.title);
        btn.innerHTML = `
          <div class="sw-thumb__inner" style="aspect-ratio:${aspect}">
            <img class="sw-thumb__img lazy-sw" data-src="${toThumb(project.cover)}" alt="" />
          </div>
        `;
        btn.addEventListener('click', () => openLightbox(project, 0, cat, idx));
        grid.appendChild(btn);
    });

    return grid;
}

// ─── Build Website Card ────────────────────────────────────────────────────
function buildWebsiteCard(site) {
    const el = document.createElement('div');
    el.className = 'sw-web-card';
    el.innerHTML = `
      <a class="sw-web-card__visual" href="${site.url}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${site.title}">
        <div class="sw-web-card__chrome">
          <span class="sw-web-card__dot"></span>
          <span class="sw-web-card__dot"></span>
          <span class="sw-web-card__dot"></span>
          <span class="sw-web-card__url">${site.urlDisplay}</span>
        </div>
        <div class="sw-web-card__screen">
          <img class="lazy-sw" data-src="${site.cover}" alt="${site.title}" />
        </div>
        <div class="sw-web-card__hint" aria-hidden="true">
          <span>Visit Site</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M7 17L17 7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </div>
      </a>
      <div class="sw-web-card__info">
        <div class="sw-web-card__meta">
          <span class="sw-web-card__cat">${site.category}</span>
          <span class="sw-web-card__year">${site.year}</span>
        </div>
        <h4 class="sw-web-card__title">${site.title}</h4>
        <p class="sw-web-card__sub">${site.subtitle}</p>
      </div>
    `;
    return el;
}

// ─── Build Tools Preview ────────────────────────────────────────────────────
function buildToolsPreview(tools) {
    const wrap = document.createElement('div');
    wrap.className = 'sw-tools-wrap';

    tools.forEach(t => {
        const el = document.createElement('div');
        el.className = 'sw-tool-row';
        el.innerHTML = `
          <span class="sw-tool-row__num">${t.num}</span>
          <span class="sw-tool-row__type">${t.type}</span>
          <span class="sw-tool-row__label">${t.label}</span>
          <span class="sw-tool-row__status sw-tool-row__status--${t.status}">
            ${t.status === 'live' ? 'Live' : 'Soon'}
          </span>
        `;
        wrap.appendChild(el);
    });

    return wrap;
}

// ─── Build Visual Studies List ──────────────────────────────────────────────
function buildStudiesList(studies) {
    const ul = document.createElement('ul');
    ul.className = 'sw-studies-list';
    studies.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        ul.appendChild(li);
    });
    return ul;
}

// ─── Build Practice Area Row ────────────────────────────────────────────────
function buildPracticeArea(area) {
    const row = document.createElement('div');
    row.className = `sw-practice${area.quiet ? ' sw-practice--quiet' : ''}`;
    row.dataset.area = area.num;

    // CTA element
    let ctaHtml = '';
    if (area.ctaLabel) {
        if (area.ctaHref) {
            const rel = area.ctaExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
            ctaHtml = `<a class="sw-practice__cta" href="${area.ctaHref}"${rel}>${area.ctaLabel} <span class="sw-practice__cta-arrow" aria-hidden="true">→</span></a>`;
        } else {
            ctaHtml = `<button class="sw-practice__cta sw-practice__cta--js" type="button">${area.ctaLabel} <span class="sw-practice__cta-arrow" aria-hidden="true">→</span></button>`;
        }
    }

    const info = document.createElement('div');
    info.className = 'sw-practice__info';
    info.innerHTML = `
      <div class="sw-practice__num">${area.num}</div>
      <h3 class="sw-practice__title">${area.title}</h3>
      <p class="sw-practice__desc">${area.desc}</p>
      ${ctaHtml}
    `;

    // JS CTA action (for lightbox triggers)
    if (area.ctaAction) {
        const btn = info.querySelector('.sw-practice__cta--js');
        if (btn) btn.addEventListener('click', area.ctaAction);
    }

    const visual = document.createElement('div');
    visual.className = 'sw-practice__visual';

    if (area.thumbs) {
        visual.appendChild(buildThumbGrid(area.thumbs, area.thumbAspect));
    } else if (area.website) {
        visual.appendChild(buildWebsiteCard(area.website));
    } else if (area.tools) {
        visual.appendChild(buildToolsPreview(area.tools));
    } else if (area.studies) {
        visual.appendChild(buildStudiesList(area.studies));
    }

    row.appendChild(info);
    row.appendChild(visual);
    return row;
}

// ─── Lazy-load Images ───────────────────────────────────────────────────────
function initLazy() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const img = e.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy-sw');
            }
            obs.unobserve(img);
        });
    }, { rootMargin: '0px 0px 400px 0px' });

    document.querySelectorAll('.lazy-sw').forEach(img => obs.observe(img));
}

// ─── Scroll Reveal ──────────────────────────────────────────────────────────
function initReveal() {
    // Gallery items — stagger fade-lift
    document.querySelectorAll('.sw-gallery-item').forEach((item, i) => {
        gsap.fromTo(item,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 1.1,
                delay: i * 0.06,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 92%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });

    // Section intro
    const intro = document.querySelector('.sw-intro');
    if (intro) {
        gsap.fromTo(intro,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
              scrollTrigger: { trigger: intro, start: 'top 88%', toggleActions: 'play none none none' } }
        );
    }

    // Practice rows — info slides from left, visual from right
    document.querySelectorAll('.sw-practice').forEach((row) => {
        const infoEl  = row.querySelector('.sw-practice__info');
        const visualEl = row.querySelector('.sw-practice__visual');

        if (infoEl) {
            gsap.fromTo(infoEl,
                { x: -32, opacity: 0 },
                {
                    x: 0, opacity: 1,
                    duration: 1.1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' },
                }
            );
        }
        if (visualEl) {
            gsap.fromTo(visualEl,
                { x: 32, opacity: 0 },
                {
                    x: 0, opacity: 1,
                    duration: 1.1,
                    delay: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' },
                }
            );
        }
    });
}

// ─── Public Init ────────────────────────────────────────────────────────────
export function initSelectedWork() {
    injectLightbox();

    const featEl     = document.getElementById('sw-featured');
    const practiceEl = document.getElementById('sw-practices');
    if (!featEl || !practiceEl) return;

    // Render the curated image-only gallery (no project titles / metadata)
    featEl.appendChild(buildImageGallery(SELECTED_IMAGES));

    PRACTICES.forEach(area => practiceEl.appendChild(buildPracticeArea(area)));

    initLazy();

    requestAnimationFrame(() => {
        initReveal();
        ScrollTrigger.refresh();
    });
}
