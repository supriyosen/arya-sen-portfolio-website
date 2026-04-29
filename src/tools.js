// ─── Tools Page Entry ───
import './styles/tools.scss';
import Lenis from '@studio-freight/lenis';

// ─── Smooth Scroll ───
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2,
});

function rafLoop(time) {
  lenis.raf(time);
  requestAnimationFrame(rafLoop);
}
requestAnimationFrame(rafLoop);

// ─── Nav: hide/show on scroll ───
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const current = window.scrollY;
        if (current > 200) {
          if (current > lastScroll + 5)      nav.classList.add('nav--hidden');
          else if (current < lastScroll - 5) nav.classList.remove('nav--hidden');
        } else {
          nav.classList.remove('nav--hidden');
        }
        lastScroll = current;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ─── Card reveal on scroll ───
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.tool-card, .reveal, .reveal-stagger').forEach(el => {
    observer.observe(el);
  });

  // Stagger cards in the grid
  document.querySelectorAll('.tool-card').forEach((card, i) => {
    card.style.transitionDelay = `${(i % 3) * 0.08}s`;
  });
}

// ─── Category Filter ───
function initFilters() {
  const btns  = document.querySelectorAll('.tools-filters__btn');
  const cards = document.querySelectorAll('.tool-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.cat === cat;
        card.style.display = match ? 'flex' : 'none';
      });
    });
  });
}

initNav();
initReveal();
initFilters();
