// ─── Main Entry Point ───
import './styles/main.scss';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initPreloader } from './js/preloader.js';
import { initNav } from './js/nav.js';
import { initWorkFilter } from './js/work-filter.js';
import { initAnimations } from './js/animations.js';
import { initMarquee } from './js/marquee.js';

gsap.registerPlugin(ScrollTrigger);

// ─── Smooth Scroll (Lenis) ───
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2,
});

// Connect Lenis to GSAP ScrollTrigger so scroll-triggered animations work
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Stop Lenis immediately — don't allow scrolling during preloader
lenis.stop();

// Also lock native scroll (belt-and-suspenders — inline style on <html> already does this)
document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';

// ─── Hero Video — no autoplay attribute, so it starts paused at frame 0.
// preloader.js calls play() after the preloader fades out.
const heroVideo = document.getElementById('heroBgVideo');
if (heroVideo) {
  heroVideo.currentTime = 0; // safety: reset in case browser pre-buffered ahead
}

// ─── Init Everything ───
async function init() {
  // Force scroll to absolute top
  window.scrollTo(0, 0);

  // Generate portfolio cards & marquee data
  initWorkFilter();
  initMarquee();

  // Wait for preloader to finish (preloader.js resets the hero video to frame 0 at fade-start)
  await initPreloader();

  // Start Lenis first, jump its internal position to 0, THEN unlock overflow.
  // This order is critical: if overflow is removed before Lenis is running,
  // the browser gets one free frame to show the restored scroll position.
  lenis.start();
  lenis.scrollTo(0, { immediate: true });

  // Now it's safe to unlock — Lenis is already holding position at 0
  window.scrollTo(0, 0);
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';

  // Reveal chrome hidden by inline FOUC-prevention CSS
  document.querySelector('.nav').style.opacity = '1';
  document.querySelector('.footer').style.opacity = '1';

  // Fire animations after preloader
  initAnimations();

  // Start nav
  initNav();

  // Refresh ScrollTrigger after everything is set up
  ScrollTrigger.refresh();
}

init();
