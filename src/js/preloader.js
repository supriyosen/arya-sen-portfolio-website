// ─── Preloader ───

export function initPreloader() {
    return new Promise((resolve) => {
        const preloader = document.getElementById('preloader');
        if (!preloader) { resolve(); return; }

        // Skip preloader on back/forward navigation or if already shown this session.
        // performance.navigation.type 2 = back/forward (legacy API, wide support).
        // PerformanceNavigationTiming.type = 'back_forward' (modern API).
        const navEntry = performance.getEntriesByType('navigation')[0];
        const isBackForward = navEntry?.type === 'back_forward';
        const alreadyShown = sessionStorage.getItem('aryaPreloaderDone') === '1';

        if (isBackForward || alreadyShown) {
            preloader.remove();
            resolve();
            return;
        }

        // Mark as shown so back-navigation within this tab skips it
        sessionStorage.setItem('aryaPreloaderDone', '1');

        // Wait for fonts to be ready + minimum display time
        const minTime = new Promise(r => setTimeout(r, 2200));
        const fontsReady = document.fonts.ready;

        Promise.all([minTime, fontsReady]).then(() => {
            // Fade the preloader out
            preloader.classList.add('preloader--done');

            // Start hero video from frame 0 exactly when the preloader begins fading.
            // The video was paused at 0 in main.js, so this is a clean cold start.
            const heroVideo = document.getElementById('heroBgVideo');
            if (heroVideo) {
                const startVideo = () => {
                    heroVideo.currentTime = 0;
                    heroVideo.play().catch(() => {
                        // Safari may need a user gesture — attach a one-shot listener
                        const resume = () => { heroVideo.play().catch(() => {}); };
                        ['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
                            document.addEventListener(ev, resume, { once: true, passive: true })
                        );
                    });
                };

                // If the video is ready to seek, start immediately; otherwise wait.
                if (heroVideo.readyState >= 1) {
                    startVideo();
                } else {
                    heroVideo.addEventListener('loadedmetadata', startVideo, { once: true });
                }
            }

            // Remove from DOM after transition completes
            setTimeout(() => {
                preloader.remove();
                resolve();
            }, 800);
        });
    });
}
