// ─── Transition Block: scroll reveal + mouse parallax ───

export function initTransitionBlock() {
    const section = document.querySelector('.transition-block');
    if (!section) return;

    const words   = section.querySelectorAll('.tb-word');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initGrain(section);

    if (reduced) {
        section.classList.add('is-revealed');
        return;
    }

    // Consistent with site pattern: IntersectionObserver for CSS-class reveals
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            section.classList.add('is-revealed');
            io.unobserve(section);

            // Parallax only on desktop; starts after all reveal transitions settle
            // (max delay 0.44s + duration 1.25s = 1.69s — safe at 1.9s)
            if (window.innerWidth >= 1024) {
                setTimeout(() => initParallax(section, words), 1900);
            }
        });
    }, { threshold: 0.12 });

    io.observe(section);
}

// ─── One-shot static grain texture via canvas ───
function initGrain(section) {
    const grain = section.querySelector('.tb-grain');
    if (!grain) return;
    const c   = document.createElement('canvas');
    const s   = 300;
    c.width   = c.height = s;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(s, s);
    for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    grain.style.backgroundImage = `url(${c.toDataURL()})`;
}

// ─── Lerp-based mouse parallax ───
// Takes over transform from CSS after reveal transitions complete.
function initParallax(section, words) {
    // Release CSS transform transitions; keep opacity + letter-spacing
    words.forEach(w => {
        w.style.transition = 'opacity 0.35s ease, letter-spacing 0.5s ease';
    });

    const targets = Array.from(words).map(w => ({
        el: w,
        px: parseFloat(w.dataset.px || 0),  // max x drift in px
        py: parseFloat(w.dataset.py || 0),  // max y drift in px
        cx: 0, cy: 0,                        // current (lerped)
        tx: 0, ty: 0,                        // target
    }));

    let active = false;
    const EASE = 0.05;
    const lerp = (a, b, t) => a + (b - a) * t;

    function tick() {
        let settled = true;
        targets.forEach(t => {
            t.cx = lerp(t.cx, t.tx, EASE);
            t.cy = lerp(t.cy, t.ty, EASE);
            t.el.style.transform = `translate(${t.cx.toFixed(2)}px, ${t.cy.toFixed(2)}px)`;
            if (Math.abs(t.cx - t.tx) > 0.04 || Math.abs(t.cy - t.ty) > 0.04) settled = false;
        });
        if (!settled) requestAnimationFrame(tick);
        else active = false;
    }

    section.addEventListener('mousemove', e => {
        const r  = section.getBoundingClientRect();
        const nx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
        const ny = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
        targets.forEach(t => { t.tx = nx * t.px; t.ty = ny * t.py; });
        if (!active) { active = true; requestAnimationFrame(tick); }
    });

    section.addEventListener('mouseleave', () => {
        targets.forEach(t => { t.tx = 0; t.ty = 0; });
        if (!active) { active = true; requestAnimationFrame(tick); }
    });
}
