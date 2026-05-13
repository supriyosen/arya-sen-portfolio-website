// ─── Websites Showcase Section ───

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const WEBSITES = [
    {
        id: 'arvion',
        title: 'ARVION',
        subtitle: 'Painted Silence',
        category: 'Brand Site',
        type: 'brand',
        year: '2026',
        desc: 'A minimalist art studio website for an oil painting collection — 27 landscape works across three chapters. Designed to let the paintings command the space.',
        tags: ['Next.js', 'Vercel', 'Editorial', 'Art Direction'],
        url: 'https://arvion-ten.vercel.app/',
        urlDisplay: 'arvion-ten.vercel.app',
        cover: '/images/portfolio/vibe-coding/arvion/01.webp',
        featured: true,
    },
];

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Brand', value: 'brand' },
    { label: 'SaaS', value: 'saas' },
    { label: 'AI Tool', value: 'ai' },
    { label: 'Experiment', value: 'experiment' },
];

function buildBrowserMockup(src, alt, urlDisplay) {
    return `
      <div class="wsite-card__browser">
        <div class="wsite-card__chrome">
          <div class="wsite-card__chrome-dots">
            <span></span><span></span><span></span>
          </div>
          <div class="wsite-card__chrome-url">${urlDisplay}</div>
          <div class="wsite-card__chrome-spacer"></div>
        </div>
        <div class="wsite-card__screen">
          <img class="wsite-card__img lazy-wsite" data-src="${src}" alt="${alt}" />
        </div>
      </div>
    `;
}

function buildCard(site, index) {
    const isFeatured = site.featured && index === 0;
    const tags = site.tags.map(t => `<span class="wsite-card__tag">${t}</span>`).join('');
    const indexStr = String(index + 1).padStart(2, '0');

    if (isFeatured) {
        return `
          <article class="wsite-card wsite-card--featured" data-type="${site.type}">
            <a class="wsite-card__visual" href="${site.url}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${site.title}">
              ${buildBrowserMockup(site.cover, site.title, site.urlDisplay)}
              <div class="wsite-card__hover-hint">
                <span>Visit Site</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7"/><polyline points="7 7 17 7 17 17"/></svg>
              </div>
            </a>
            <div class="wsite-card__body">
              <div class="wsite-card__index">${indexStr}</div>
              <div class="wsite-card__meta">
                <span class="wsite-card__category">${site.category}</span>
                <span class="wsite-card__year">${site.year}</span>
              </div>
              <div class="wsite-card__titles">
                <h3 class="wsite-card__title">${site.title}</h3>
                <p class="wsite-card__sub">${site.subtitle}</p>
              </div>
              <p class="wsite-card__desc">${site.desc}</p>
              <div class="wsite-card__tags">${tags}</div>
              <div class="wsite-card__actions">
                <a class="wsite-card__cta" href="${site.url}" target="_blank" rel="noopener noreferrer">
                  Live Site
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7"/><polyline points="7 7 17 7 17 17"/></svg>
                </a>
              </div>
            </div>
          </article>
        `;
    }

    return `
      <article class="wsite-card wsite-card--regular" data-type="${site.type}">
        <a class="wsite-card__visual" href="${site.url}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${site.title}">
          ${buildBrowserMockup(site.cover, site.title, site.urlDisplay)}
          <div class="wsite-card__hover-hint">
            <span>Visit Site</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7"/><polyline points="7 7 17 7 17 17"/></svg>
          </div>
        </a>
        <div class="wsite-card__body">
          <div class="wsite-card__meta">
            <span class="wsite-card__category">${site.category}</span>
            <span class="wsite-card__year">${site.year}</span>
          </div>
          <h3 class="wsite-card__title">${site.title}</h3>
          <p class="wsite-card__desc">${site.desc}</p>
          <div class="wsite-card__tags">${tags}</div>
          <a class="wsite-card__cta" href="${site.url}" target="_blank" rel="noopener noreferrer">
            Live Site
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7"/><polyline points="7 7 17 7 17 17"/></svg>
          </a>
        </div>
      </article>
    `;
}

function initLazyImages(container) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const img = e.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            obs.unobserve(img);
        });
    }, { rootMargin: '0px 0px 300px 0px' });

    container.querySelectorAll('.lazy-wsite').forEach(img => obs.observe(img));
}

function initFilters(section) {
    const btns = section.querySelectorAll('.wsite-filter');
    const cards = section.querySelectorAll('.wsite-card');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.type === filter;
                card.style.display = match ? '' : 'none';
            });
        });
    });
}

function initScrollReveal(section) {
    const header = section.querySelector('.wsite-header');
    const cards = section.querySelectorAll('.wsite-card');

    if (header) {
        gsap.from(header, {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    }

    cards.forEach((card, i) => {
        gsap.from(card, {
            y: 70,
            opacity: 0,
            duration: 1.4,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
        });
    });
}

export function initWebsites() {
    const section = document.getElementById('websites');
    if (!section) return;

    const filterHtml = FILTERS.map((f, i) =>
        `<button class="wsite-filter${i === 0 ? ' active' : ''}" data-filter="${f.value}">${f.label}</button>`
    ).join('');

    const cardsHtml = WEBSITES.map((site, i) => buildCard(site, i)).join('');

    section.innerHTML = `
      <div class="wsite-inner">
        <header class="wsite-header">
          <div class="wsite-header__top">
            <div class="section-label">Websites</div>
            <div class="wsite-filters">${filterHtml}</div>
          </div>
          <div class="wsite-header__bottom">
            <h2 class="wsite-heading">Selected Web<br><em>Experiences.</em></h2>
            <p class="wsite-heading-sub">Live, coded, deployed.</p>
          </div>
        </header>

        <div class="wsite-divider"></div>

        <div class="wsite-list" id="wsite-list">
          ${cardsHtml}
        </div>
      </div>
    `;

    initLazyImages(section);
    initFilters(section);
    initScrollReveal(section);
}
