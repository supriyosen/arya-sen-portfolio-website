// ─── Blog Post Entry ───
import './styles/blog-post.scss';
import Lenis from '@studio-freight/lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function rafLoop(time) {
  lenis.raf(time);
  requestAnimationFrame(rafLoop);
}
requestAnimationFrame(rafLoop);

// ─── Reading progress bar ───
function initProgressBar() {
  const bar = document.getElementById('read-progress');
  if (!bar) return;
  const body = document.querySelector('.post-body');
  if (!body) return;
  window.addEventListener('scroll', () => {
    const total = body.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, window.scrollY - body.offsetTop);
    bar.style.width = Math.min(100, (scrolled / total) * 100) + '%';
  }, { passive: true });
}

// ─── Nav hide/show ───
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 120) {
      nav.classList.toggle('nav--hidden', y > last + 5);
      if (y < last - 5) nav.classList.remove('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }
    last = y;
  }, { passive: true });
}

// ─── Reveal on scroll ───
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.post-reveal').forEach(el => io.observe(el));
}

// ─── Animate stat bars on scroll ───
function initStatBars() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-bar__fill').forEach(bar => {
          bar.style.width = bar.dataset.w;
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stat-bars').forEach(el => io.observe(el));
}

initNav();
initProgressBar();
initReveal();
initStatBars();
