// ─── Hero: Creation of Adam — Three.js Cube Particle System ───
import * as THREE from 'three';

const COLS_DESKTOP = 260;
const COLS_MOBILE  = 80;

const SPRING_XY      = 0.055;
const SPRING_Z       = 0.028;
const DAMPING        = 0.80;
const BREATHE_AMP    = 1.2;
const BREATHE_SPD    = 0.50;
const REPEL_STRENGTH = 6;
const REPEL_RADIUS_F = 0.07;

// Assembly intro
const ASSEMBLY_MAX_DELAY = 1.6;   // max per-cube stagger (seconds)
const ASSEMBLY_SCALE_DUR = 0.28;  // scale-in duration per cube (seconds)
const ASSEMBLY_Z_SPREAD  = 820;   // how far behind origin cubes start

// Heartbeat pulse
const PULSE_PERIOD   = 4.2;   // seconds between pulses
const PULSE_SPEED    = 1050;  // world-units / second
const PULSE_WIDTH    = 88;    // wave ring half-width (world units)
const PULSE_FORCE    = 1.7;   // peak velocity kick per frame at wave centre
const PULSE_START_T  = ASSEMBLY_MAX_DELAY + 2.0; // wait for assembly to settle

// Gap between the two fingertips (image-space fractions)
const GAP_FX     = 0.593;
const GAP_FY     = 0.455;
const FINGER_R_F = 0.18;

export function initHeroCreation() {
    const hero = document.getElementById('hero');
    if (!hero) return { start: () => {}, cleanup: () => {} };

    // ── Container ─────────────────────────────────────────────────────────────
    const wrap = document.createElement('div');
    wrap.id = 'heroCreationWrap';
    wrap.style.cssText = 'position:absolute;inset:0;z-index:0;overflow:hidden;';
    hero.prepend(wrap);

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060606, 1);
    renderer.dithering = true;
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'position:absolute;top:0;left:0;';

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera — perspective so 1 unit ≈ 1 CSS-px at z=0 ─────────────────────
    const FOV = 45;
    let W = window.innerWidth;
    let H = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 1, 10000);

    function updateCamera() {
        camera.position.z = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
    }
    updateCamera();
    renderer.setSize(W, H);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x3d2810, 0.65));

    const key = new THREE.DirectionalLight(0xffe8c0, 1.6);
    key.position.set(1.5, 2.0, 3.0);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x0d1520, 0.5);
    rim.position.set(-2.0, -0.5, -1.0);
    scene.add(rim);

    const spark = new THREE.PointLight(0xff5510, 0, 400);
    scene.add(spark);

    // ── Particle state ────────────────────────────────────────────────────────
    let mesh    = null;
    let COUNT   = 0, COLS = 0, ROWS = 0, CUBE_SIZE = 0;
    let gapWX   = 0, gapWY = 0;
    let ready   = false;

    let origX, origY, origZ, posX, posY, posZ, velX, velY, velZ;
    let bScale, phase, assemblyDelay;
    let assemblyDone = false;
    let lastPulse    = 0;

    const dummy = new THREE.Object3D();
    const col3  = new THREE.Color();

    // ── Build from pixels ─────────────────────────────────────────────────────
    function build(pixels, iW, iH) {
        const mob       = W < 768;
        const imgAspect = iW / iH;
        COLS            = mob ? COLS_MOBILE : COLS_DESKTOP;
        ROWS            = Math.round(COLS / imgAspect);
        COUNT      = COLS * ROWS;
        // object-fit: cover — scale whichever axis would leave a black gap
        // Viewport wider than image → fit to width; otherwise fit to height
        CUBE_SIZE  = (W / H > imgAspect) ? W / COLS : H / ROWS;

        const halfW = (CUBE_SIZE * COLS) / 2;
        const halfH = (CUBE_SIZE * ROWS) / 2;
        const sx0   = -halfW + CUBE_SIZE * 0.5;
        const sy0   =  halfH - CUBE_SIZE * 0.5;

        gapWX = sx0 + COLS * GAP_FX * CUBE_SIZE;
        gapWY = sy0 - ROWS * GAP_FY * CUBE_SIZE;
        spark.position.set(gapWX, gapWY, 60);

        origX = new Float32Array(COUNT); origY = new Float32Array(COUNT); origZ = new Float32Array(COUNT);
        posX  = new Float32Array(COUNT); posY  = new Float32Array(COUNT); posZ  = new Float32Array(COUNT);
        velX  = new Float32Array(COUNT); velY  = new Float32Array(COUNT); velZ  = new Float32Array(COUNT);
        bScale        = new Float32Array(COUNT);
        phase         = new Float32Array(COUNT);
        assemblyDelay = new Float32Array(COUNT);
        assemblyDone  = false;
        lastPulse     = 0;

        const gap   = 0.12;
        const side  = CUBE_SIZE * (1 - gap);
        const depth = side * 0.55;
        const geo   = new THREE.BoxGeometry(side, side, depth);
        const mat   = new THREE.MeshPhongMaterial({ shininess: 20, specular: 0x111111 });

        if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); }
        mesh = new THREE.InstancedMesh(geo, mat, COUNT);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(mesh);

        let visible = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const i  = r * COLS + c;
                const px = Math.floor((c / COLS) * iW);
                const py = Math.floor((r / ROWS) * iH);
                const pi = (py * iW + px) * 4;

                const R   = pixels[pi]     / 255;
                const G   = pixels[pi + 1] / 255;
                const B   = pixels[pi + 2] / 255;
                const lum = R * 0.299 + G * 0.587 + B * 0.114;

                bScale[i] = lum < 0.05 ? 0 : Math.pow(lum, 0.36);
                phase[i]  = Math.random() * Math.PI * 2;
                if (bScale[i] > 0) visible++;

                const wx = sx0 + c * CUBE_SIZE;
                const wy = sy0 - r * CUBE_SIZE;
                const wz = (lum - 0.30) * 42;

                origX[i] = wx;
                origY[i] = wy;
                origZ[i] = wz;
                // Scatter: start deep behind the scene, small XY jitter
                const sA  = Math.random() * Math.PI * 2;
                const sR  = 120 + Math.random() * 260;
                posX[i]   = wx + Math.cos(sA) * sR;
                posY[i]   = wy + Math.sin(sA) * sR;
                posZ[i]   = wz - ASSEMBLY_Z_SPREAD * (0.35 + Math.random() * 0.65);
                assemblyDelay[i] = Math.random() * ASSEMBLY_MAX_DELAY;

                dummy.position.set(posX[i], posY[i], posZ[i]);
                dummy.scale.setScalar(0); // start invisible
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);

                // Ember Grade — lift blacks (prevents banding), warm the palette
                // Shadow lift: R gets the most warmth, B the least
                const lift = 0.028;
                const rL = R * (1 - lift) + lift;
                const gL = G * (1 - lift * 0.70) + lift * 0.70;
                const bL = B * (1 - lift * 0.28) + lift * 0.28;
                // Gamma curve: reds lifted, blues pulled down → warm amber mids
                const gR = Math.min(1, Math.pow(rL, 0.88));
                const gG = Math.min(1, Math.pow(gL, 0.96));
                const gB = Math.min(1, Math.pow(bL, 1.18));
                // Per-cube dither jitter — decorrelates flat dark patches that cause banding
                // Amplitude exceeds the 8-bit quantisation step (1/255 ≈ 0.004) by ~12×
                const jitter = (Math.random() - 0.5) * 0.052;
                col3.setRGB(
                    Math.max(0, Math.min(1, gR + jitter)),
                    Math.max(0, Math.min(1, gG + jitter * 0.88)),
                    Math.max(0, Math.min(1, gB + jitter * 0.76))
                );
                mesh.setColorAt(i, col3);
            }
        }

        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        ready = true;
        console.log(`[hero-creation] built ${visible}/${COUNT} visible cubes — CUBE_SIZE=${CUBE_SIZE.toFixed(1)}px`);
    }

    // ── Load image ────────────────────────────────────────────────────────────
    function loadImage() {
        const img = new Image();
        img.onload = () => {
            console.log('[hero-creation] image loaded:', img.naturalWidth, 'x', img.naturalHeight);
            const off = document.createElement('canvas');
            off.width  = img.naturalWidth;
            off.height = img.naturalHeight;
            const ctx  = off.getContext('2d');
            ctx.drawImage(img, 0, 0);
            build(ctx.getImageData(0, 0, off.width, off.height).data, off.width, off.height);
        };
        img.onerror = (e) => {
            console.error('[hero-creation] FAILED to load image. Make sure creation.jpg is in public/images/', e);
        };
        img.src = '/images/creation.jpg';
        console.log('[hero-creation] loading image from /images/creation.jpg');
    }

    // ── Cursor ────────────────────────────────────────────────────────────────
    let mwx = 99999, mwy = 99999;
    let camTX = 0, camTY = 0, camSX = 0, camSY = 0;

    function toWorld(cx, cy) {
        const rect = renderer.domElement.getBoundingClientRect();
        const nx = ((cx - rect.left) / rect.width)  * 2 - 1;
        const ny = -((cy - rect.top)  / rect.height) * 2 + 1;
        return { wx: camSX + nx * (W / 2), wy: camSY + ny * (H / 2) };
    }

    function onMouseMove(e) {
        const { wx, wy } = toWorld(e.clientX, e.clientY);
        mwx = wx; mwy = wy;
        camTX = (e.clientX / W - 0.5) * -20;
        camTY = (e.clientY / H - 0.5) *  12;
    }
    function onTouchMove(e) {
        if (e.touches[0]) {
            const { wx, wy } = toWorld(e.touches[0].clientX, e.touches[0].clientY);
            mwx = wx; mwy = wy;
        }
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // ── RAF loop ──────────────────────────────────────────────────────────────
    let rafId  = null;
    let sTime  = 0;
    let lastTs = 0;

    function tick(ts) {
        rafId = requestAnimationFrame(tick);
        const dt = Math.min((ts - lastTs) / 1000, 0.033);
        lastTs = ts;
        sTime += dt;

        // Smooth camera parallax
        camSX += (camTX - camSX) * 0.04;
        camSY += (camTY - camSY) * 0.04;
        camera.position.x = camSX;
        camera.position.y = camSY;

        if (!ready || !mesh) {
            renderer.render(scene, camera);
            return;
        }

        // Repel radius & gap detection
        const repR    = Math.min(W, H) * REPEL_RADIUS_F;
        const fingerR = COLS * CUBE_SIZE * FINGER_R_F;
        const gdx = mwx - gapWX, gdy = mwy - gapWY;
        const inGap = Math.sqrt(gdx * gdx + gdy * gdy) < repR * 1.4;
        spark.intensity += ((inGap ? 3.5 : 0) - spark.intensity) * 0.09;

        // ── Assembly completion gate ───────────────────────────────────────────
        if (!assemblyDone && sTime >= PULSE_START_T) {
            assemblyDone = true;
            lastPulse    = sTime;
        }

        // ── Heartbeat pulse radius ─────────────────────────────────────────────
        let pulseRadius = -1;
        if (assemblyDone) {
            const tSincePulse = sTime - lastPulse;
            if (tSincePulse >= PULSE_PERIOD) lastPulse = sTime;
            pulseRadius = (sTime - lastPulse) * PULSE_SPEED;
        }

        for (let i = 0; i < COUNT; i++) {
            if (bScale[i] < 0.01) continue;

            const age = sTime - assemblyDelay[i];

            // ── Pre-assembly: cube sits hidden at scatter position ─────────────
            if (age < 0) {
                dummy.position.set(posX[i], posY[i], posZ[i]);
                dummy.scale.setScalar(0);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
                continue;
            }

            // Scale in from 0→1 over ASSEMBLY_SCALE_DUR
            const aScale = Math.min(1, age / ASSEMBLY_SCALE_DUR);

            const dx = posX[i] - mwx;
            const dy = posY[i] - mwy;
            const d  = Math.sqrt(dx * dx + dy * dy);

            // Repulsion
            if (d < repR && d > 0.1) {
                const t = 1.0 - d / repR;
                const f = t * t * REPEL_STRENGTH;
                velX[i] += (dx / d) * f;
                velY[i] += (dy / d) * f;
                velZ[i] += t * 8;
            }

            // Gap spark — cubes near fingertips lean toward gap center
            if (inGap) {
                const gx = gapWX - origX[i];
                const gy = gapWY - origY[i];
                const gd = Math.sqrt(gx * gx + gy * gy);
                if (gd < fingerR && gd > 0.1) {
                    const p = (1.0 - gd / fingerR) * 0.6;
                    velX[i] += (gx / gd) * p;
                    velY[i] += (gy / gd) * p;
                    velZ[i] += p * 5;
                }
            }

            // ── Heartbeat Z-wave ───────────────────────────────────────────────
            if (pulseRadius >= 0) {
                const pdx   = origX[i] - gapWX;
                const pdy   = origY[i] - gapWY;
                const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
                const wDist = Math.abs(pDist - pulseRadius);
                if (wDist < PULSE_WIDTH) {
                    const env = Math.sin((1 - wDist / PULSE_WIDTH) * Math.PI);
                    velZ[i] += env * PULSE_FORCE;
                }
            }

            // Spring back
            velX[i] += (origX[i] - posX[i]) * SPRING_XY;
            velY[i] += (origY[i] - posY[i]) * SPRING_XY;
            velZ[i] += (origZ[i] - posZ[i]) * SPRING_Z;

            // Damp + integrate
            velX[i] *= DAMPING; velY[i] *= DAMPING; velZ[i] *= DAMPING;
            posX[i] += velX[i]; posY[i] += velY[i]; posZ[i] += velZ[i];

            // Cube tilt follows velocity — very subtle
            dummy.rotation.x =  velY[i] * 0.010;
            dummy.rotation.y = -velX[i] * 0.010;
            dummy.rotation.z =  velX[i] * 0.005;

            const disp    = Math.sqrt((posX[i] - origX[i]) ** 2 + (posY[i] - origY[i]) ** 2);
            const sBoost  = 1.0 + Math.min(disp / 120, 0.15);
            const breathZ = Math.sin(sTime * BREATHE_SPD + phase[i]) * BREATHE_AMP;

            dummy.position.set(posX[i], posY[i], posZ[i] + breathZ);
            dummy.scale.setScalar(bScale[i] * sBoost * aScale);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }

        mesh.instanceMatrix.needsUpdate = true;
        renderer.render(scene, camera);
    }

    // ── Resize ────────────────────────────────────────────────────────────────
    let resizeTimer = null;
    function onResize() {
        W = window.innerWidth;
        H = window.innerHeight;
        renderer.setSize(W, H);
        updateCamera();
        // Debounce rebuild — only triggers if image already loaded
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (ready) { ready = false; loadImage(); }
        }, 300);
    }
    window.addEventListener('resize', onResize);

    // ── Public ────────────────────────────────────────────────────────────────
    function start() {
        console.log('[hero-creation] start() called — W:', W, 'H:', H);
        loadImage();
        lastTs = performance.now();
        rafId  = requestAnimationFrame(tick);
    }

    function cleanup() {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('resize', onResize);
        if (mesh) { mesh.geometry.dispose(); mesh.material.dispose(); }
        renderer.dispose();
        wrap.remove();
    }

    return { start, cleanup };
}
