// ─── GSAP Animations ───
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Universal IntersectionObserver for scroll reveals ───
// We use IntersectionObserver instead of GSAP ScrollTrigger for
// CSS-based reveals because Lenis smooth-scroll doesn't sync with ScrollTrigger.
function initScrollReveals() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Reveal single elements
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Reveal stagger containers
    document.querySelectorAll('.reveal-stagger').forEach(el => revealObserver.observe(el));

    // Services list items
    document.querySelectorAll('.services__item').forEach(el => revealObserver.observe(el));
}

export function initAnimations() {
    // ─── Init all scroll reveals via IntersectionObserver ───
    initScrollReveals();

    // ─── Hero Text Reveal ───
    const heroLabel = document.querySelector('.hero__label');
    const heroTitle = document.querySelector('.hero__title');
    const heroRule  = document.querySelector('.hero__rule');
    const heroMeta  = document.querySelector('.hero__meta');
    const heroScroll = document.querySelector('.hero__scroll-indicator');

    if (heroTitle) {
        const heroTl = gsap.timeline({ delay: 0.1 });

        if (heroLabel) {
            heroTl.to(heroLabel, { opacity: 1, duration: 0.7, ease: 'power2.out' });
        }

        // Split title into masked lines and animate each up
        const titleLines = heroTitle.innerHTML.split('<br>').map(line => line.trim());
        heroTitle.innerHTML = titleLines
            .map(line => `<span class="hero-line"><span class="hero-line__inner">${line}</span></span>`)
            .join('');

        heroTitle.style.visibility = 'visible';

        heroTitle.querySelectorAll('.hero-line').forEach(line => {
            line.style.overflow = 'hidden';
            line.style.display = 'block';
        });

        heroTitle.querySelectorAll('.hero-line__inner').forEach((inner, i) => {
            gsap.set(inner, { y: '110%', display: 'block' });
            heroTl.to(inner, {
                y: '0%',
                duration: 1.15,
                ease: 'expo.out',
            }, `-=${i > 0 ? 0.88 : 0}`);
        });

        // Rule draws left→right
        if (heroRule) {
            heroTl.to(heroRule, {
                scaleX: 1,
                duration: 1.0,
                ease: 'power3.inOut',
            }, '-=0.5');
        }

        // Meta row fades + rises
        if (heroMeta) {
            gsap.set(heroMeta, { opacity: 0, y: 18 });
            heroTl.to(heroMeta, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, '-=0.6');
        }

        if (heroScroll) {
            gsap.set(heroScroll, { opacity: 0 });
            heroTl.to(heroScroll, { opacity: 1, duration: 0.6 }, '-=0.4');
        }
    }

    // ─── About: Year Counter Animation ───
    const yearCounter = document.getElementById('yearCounter');
    if (yearCounter) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    gsap.to({ val: 0 }, {
                        val: 16,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: function () {
                            yearCounter.textContent = Math.round(this.targets()[0].val) + '+';
                        }
                    });
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        counterObserver.observe(yearCounter);
    }

    // ─── About: Muted text reveal on scroll ───
    const aboutText = document.querySelector('.about__text p');
    if (aboutText) {
        const mutedSpans = aboutText.querySelectorAll('.text-muted-inline');
        mutedSpans.forEach((span) => {
            gsap.to(span, {
                color: '#F0EDE6',
                scrollTrigger: {
                    trigger: span,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1,
                },
            });
        });
    }

    // ─── Section Labels ───
    document.querySelectorAll('.section-label').forEach(label => {
        const labelObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    gsap.from(label, {
                        opacity: 0,
                        x: -20,
                        duration: 1,
                        ease: 'power2.out',
                    });
                    labelObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        labelObserver.observe(label);
    });

    // ─── Work Cards Reveal (CSS-based, no GSAP transforms) ───
    document.querySelectorAll('.work__scroll-container').forEach(container => {
        const cards = container.querySelectorAll('.work__card');
        if (cards.length === 0) return;

        const cardsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Stagger the is-visible class on each card
                    cards.forEach((card, i) => {
                        setTimeout(() => card.classList.add('is-visible'), i * 100);
                    });
                    cardsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        cardsObserver.observe(container);
    });
}
