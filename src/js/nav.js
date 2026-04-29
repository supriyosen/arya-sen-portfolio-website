// ─── Navigation ───

export function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const navLinks = nav.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');
    let lastScroll = 0;
    let ticking = false;

    // Auto-hide on scroll
    function handleScroll() {
        const currentScroll = window.scrollY;

        if (currentScroll > 200) {
            if (currentScroll > lastScroll + 5) {
                // Scrolling down
                nav.classList.add('nav--hidden');
            } else if (currentScroll < lastScroll - 5) {
                // Scrolling up
                nav.classList.remove('nav--hidden');
            }
        } else {
            nav.classList.remove('nav--hidden');
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });

    // Active link tracking
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.dataset.nav === id);
                    });
                }
            });
        },
        { rootMargin: '-40% 0px -40% 0px' }
    );

    sections.forEach(section => observer.observe(section));

    // Smooth scroll on click — only for same-page anchor links
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // CTA smooth scroll
    const cta = nav.querySelector('.nav__cta');
    if (cta) {
        cta.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(cta.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}
