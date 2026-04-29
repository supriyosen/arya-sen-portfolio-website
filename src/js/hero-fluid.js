// ─── Hero: WebGL2 Fluid Ink Simulation ───

const VS_QUAD = `#version 300 es
precision highp float;
in vec2 aPos;
out vec2 vUV;
void main() {
    vUV = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FS_ADVECT = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform float uDt;
uniform float uDissipation;
in vec2 vUV;
out vec4 fragColor;
void main() {
    vec2 vel   = texture(uVelocity, vUV).xy;
    vec2 coord = vUV - uDt * vel;
    fragColor  = uDissipation * texture(uSource, coord);
}`;

const FS_SPLAT = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec3  uColor;
uniform vec2  uPoint;
uniform float uRadius;
in vec2 vUV;
out vec4 fragColor;
void main() {
    vec2  p    = vUV - uPoint;
    p.x       *= uAspect;
    float v    = exp(-dot(p, p) / uRadius);
    vec4  base = texture(uTarget, vUV);
    fragColor  = vec4(base.xyz + v * uColor, 1.0);
}`;

const FS_CURL = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
in vec2 vUV;
out vec4 fragColor;
void main() {
    float L = texture(uVelocity, vUV - vec2(uTexelSize.x, 0.0)).y;
    float R = texture(uVelocity, vUV + vec2(uTexelSize.x, 0.0)).y;
    float T = texture(uVelocity, vUV + vec2(0.0, uTexelSize.y)).x;
    float B = texture(uVelocity, vUV - vec2(0.0, uTexelSize.y)).x;
    fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`;

const FS_VORTICITY = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2  uTexelSize;
uniform float uCurlStrength;
uniform float uDt;
in vec2 vUV;
out vec4 fragColor;
void main() {
    float L = abs(texture(uCurl, vUV - vec2(uTexelSize.x, 0.0)).x);
    float R = abs(texture(uCurl, vUV + vec2(uTexelSize.x, 0.0)).x);
    float T = abs(texture(uCurl, vUV + vec2(0.0, uTexelSize.y)).x);
    float B = abs(texture(uCurl, vUV - vec2(0.0, uTexelSize.y)).x);
    float C = texture(uCurl, vUV).x;
    vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= max(length(force), 0.0001);
    force *= uCurlStrength * C;
    vec2 vel = texture(uVelocity, vUV).xy;
    fragColor = vec4(vel + force * uDt, 0.0, 1.0);
}`;

const FS_DIVERGENCE = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
in vec2 vUV;
out vec4 fragColor;
void main() {
    float L = texture(uVelocity, vUV - vec2(uTexelSize.x, 0.0)).x;
    float R = texture(uVelocity, vUV + vec2(uTexelSize.x, 0.0)).x;
    float T = texture(uVelocity, vUV + vec2(0.0, uTexelSize.y)).y;
    float B = texture(uVelocity, vUV - vec2(0.0, uTexelSize.y)).y;
    fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

const FS_PRESSURE = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;
in vec2 vUV;
out vec4 fragColor;
void main() {
    float L   = texture(uPressure,   vUV - vec2(uTexelSize.x, 0.0)).x;
    float R   = texture(uPressure,   vUV + vec2(uTexelSize.x, 0.0)).x;
    float T   = texture(uPressure,   vUV + vec2(0.0, uTexelSize.y)).x;
    float B   = texture(uPressure,   vUV - vec2(0.0, uTexelSize.y)).x;
    float div = texture(uDivergence, vUV).x;
    fragColor = vec4((L + R + T + B - div) * 0.25, 0.0, 0.0, 1.0);
}`;

const FS_GRAD_SUB = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
in vec2 vUV;
out vec4 fragColor;
void main() {
    float L = texture(uPressure, vUV - vec2(uTexelSize.x, 0.0)).x;
    float R = texture(uPressure, vUV + vec2(uTexelSize.x, 0.0)).x;
    float T = texture(uPressure, vUV + vec2(0.0, uTexelSize.y)).x;
    float B = texture(uPressure, vUV - vec2(0.0, uTexelSize.y)).x;
    vec2 vel = texture(uVelocity, vUV).xy;
    vel -= 0.5 * vec2(R - L, T - B);
    fragColor = vec4(vel, 0.0, 1.0);
}`;

const FS_DISPLAY = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uDye;
uniform float uTime;
in vec2 vUV;
out vec4 fragColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 brand(float t) {
    vec3 bg = vec3(0.024, 0.024, 0.024);
    vec3 r  = vec3(0.757, 0.031, 0.004);
    vec3 o  = vec3(0.914, 0.314, 0.004);
    if (t < 0.001) return bg;
    if (t < 0.55)  return mix(bg, r, t / 0.55);
    return                mix(r,  o, (t - 0.55) / 0.45);
}

void main() {
    float d = max(texture(uDye, vUV).r, 0.0);
    // High knee (3.5) keeps most of the field very dark; only intense
    // cursor bursts nudge into the dark-red zone — never reaching orange.
    float t = pow(d / (d + 3.5), 0.70);
    vec3  col = brand(t);
    vec2  uv  = vUV - 0.5;
    col *= clamp(1.0 - dot(uv, uv) * 0.70, 0.0, 1.0);
    vec2  seed = gl_FragCoord.xy + fract(uTime * 0.07) * 7.3;
    float dith = hash(seed) + hash(seed + 0.5) - 1.0;
    col = clamp(col + dith / 255.0, 0.0, 1.0);
    fragColor = vec4(col, 1.0);
}`;

// ── Helpers ──────────────────────────────────────────────────────────────────

function compileShader(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error('[fluid] shader:', gl.getShaderInfoLog(sh));
        gl.deleteShader(sh); return null;
    }
    return sh;
}

function buildProgram(gl, vsSrc, fsSrc) {
    const vs = compileShader(gl, gl.VERTEX_SHADER,   vsSrc);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    const p = gl.createProgram();
    gl.attachShader(p, vs); gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs); gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error('[fluid] link:', gl.getProgramInfoLog(p)); return null;
    }
    return p;
}

function createFBO(gl, w, h, iFmt, fmt, type, filter) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, iFmt, w, h, 0, fmt, type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex, fbo, w, h };
}

function createDoubleFBO(gl, w, h, iFmt, fmt, type, filter) {
    const a = createFBO(gl, w, h, iFmt, fmt, type, filter);
    const b = createFBO(gl, w, h, iFmt, fmt, type, filter);
    return { read: a, write: b, swap() { const t = this.read; this.read = this.write; this.write = t; } };
}

function initFallback(canvas) {
    const ctx = canvas.getContext('2d');
    return {
        start() { ctx.fillStyle = '#060606'; ctx.fillRect(0, 0, canvas.width, canvas.height); },
        cleanup() {}
    };
}

// ── Main Export ───────────────────────────────────────────────────────────────

export function initHeroFluid() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return { start: () => {}, cleanup: () => {} };

    const mobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) return initFallback(canvas);

    const linearOK = !!gl.getExtension('OES_texture_float_linear');
    const FILTER   = linearOK ? gl.LINEAR : gl.NEAREST;

    // ── Compile programs ──
    const progAdvect  = buildProgram(gl, VS_QUAD, FS_ADVECT);
    const progSplat   = buildProgram(gl, VS_QUAD, FS_SPLAT);
    const progCurl    = buildProgram(gl, VS_QUAD, FS_CURL);
    const progVort    = buildProgram(gl, VS_QUAD, FS_VORTICITY);
    const progDiv     = buildProgram(gl, VS_QUAD, FS_DIVERGENCE);
    const progPres    = buildProgram(gl, VS_QUAD, FS_PRESSURE);
    const progGrad    = buildProgram(gl, VS_QUAD, FS_GRAD_SUB);
    const progDisplay = buildProgram(gl, VS_QUAD, FS_DISPLAY);
    if (!progAdvect || !progSplat || !progCurl || !progVort ||
        !progDiv   || !progPres  || !progGrad || !progDisplay) return initFallback(canvas);

    // ── Quad VAO ──
    const quadVAO = gl.createVertexArray();
    gl.bindVertexArray(quadVAO);
    const quadVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    for (const prog of [progAdvect, progSplat, progCurl, progVort, progDiv, progPres, progGrad, progDisplay]) {
        gl.useProgram(prog);
        const loc = gl.getAttribLocation(prog, 'aPos');
        if (loc >= 0) { gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0); }
    }
    gl.bindVertexArray(null);

    // ── Cache uniform locations ──
    function U(prog, name) { return gl.getUniformLocation(prog, name); }
    const uA = { vel: U(progAdvect,'uVelocity'), src: U(progAdvect,'uSource'), dt: U(progAdvect,'uDt'), diss: U(progAdvect,'uDissipation') };
    const uS = { tgt: U(progSplat,'uTarget'), asp: U(progSplat,'uAspect'), col: U(progSplat,'uColor'), pt: U(progSplat,'uPoint'), rad: U(progSplat,'uRadius') };
    const uC = { vel: U(progCurl,'uVelocity'), ts: U(progCurl,'uTexelSize') };
    const uV = { vel: U(progVort,'uVelocity'), curl: U(progVort,'uCurl'), ts: U(progVort,'uTexelSize'), cs: U(progVort,'uCurlStrength'), dt: U(progVort,'uDt') };
    const uDv = { vel: U(progDiv,'uVelocity'), ts: U(progDiv,'uTexelSize') };
    const uP = { pres: U(progPres,'uPressure'), div: U(progPres,'uDivergence'), ts: U(progPres,'uTexelSize') };
    const uG = { pres: U(progGrad,'uPressure'), vel: U(progGrad,'uVelocity'), ts: U(progGrad,'uTexelSize') };
    const uDisp = { dye: U(progDisplay,'uDye'), time: U(progDisplay,'uTime') };

    // ── FBOs ──
    const SIM = mobile ? 64  : 128;
    const DYE = mobile ? 256 : 512;
    const SIM_TEXEL = new Float32Array([1 / SIM, 1 / SIM]);

    const velocity = createDoubleFBO(gl, SIM, SIM, gl.RG32F,  gl.RG,  gl.FLOAT, FILTER);
    const pressure = createDoubleFBO(gl, SIM, SIM, gl.R32F,   gl.RED, gl.FLOAT, gl.NEAREST);
    const dye      = createDoubleFBO(gl, DYE, DYE, gl.R32F,   gl.RED, gl.FLOAT, FILTER);
    const divFBO   = createFBO      (gl, SIM, SIM, gl.R32F,   gl.RED, gl.FLOAT, gl.NEAREST);
    const curlFBO  = createFBO      (gl, SIM, SIM, gl.R32F,   gl.RED, gl.FLOAT, gl.NEAREST);

    // ── Helpers ──
    function bindTex(unit, tex) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); }
    function drawQuad() { gl.bindVertexArray(quadVAO); gl.drawArrays(gl.TRIANGLES, 0, 6); }

    // ── Canvas resize ──
    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cw = canvas.parentElement.clientWidth;
        const ch = canvas.parentElement.clientHeight;
        canvas.style.width  = cw + 'px';
        canvas.style.height = ch + 'px';
        canvas.width  = Math.max(2, Math.floor(cw * dpr));
        canvas.height = Math.max(2, Math.floor(ch * dpr));
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Sim params ──
    const PRESSURE_ITERS    = mobile ? 15 : 25;
    const VEL_DISSIPATION   = 0.984;
    const DYE_DISSIPATION   = 0.956;        // faster fade — no colour build-up
    const CURL_STRENGTH     = mobile ? 14 : 24;
    const SPLAT_FORCE       = mobile ? 1800 : 2800;
    const SPLAT_RADIUS_VEL  = 0.0008;
    const SPLAT_RADIUS_DYE  = 0.028;        // large radius → diffuse atmospheric glow

    // ── Cursor ──
    let curX = -1, curY = -1, prevX = -1, prevY = -1;
    let ambientTimer = 0;

    function onMove(cx, cy) {
        const rect = canvas.getBoundingClientRect();
        const nx = (cx - rect.left) / rect.width;
        const ny = 1.0 - (cy - rect.top) / rect.height;
        if (nx < -0.05 || nx > 1.05 || ny < -0.05 || ny > 1.05) return;
        prevX = curX < 0 ? nx : curX;
        prevY = curY < 0 ? ny : curY;
        curX = nx; curY = ny;
    }
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', e => { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });

    // ── Splat ──
    function splat(x, y, dx, dy, dyeAmt) {
        const aspect = canvas.width / canvas.height;
        gl.useProgram(progSplat);
        gl.uniform1f(uS.asp, aspect);
        gl.uniform2f(uS.pt,  x, y);

        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.viewport(0, 0, SIM, SIM);
        bindTex(0, velocity.read.tex);
        gl.uniform1i(uS.tgt, 0);
        gl.uniform3f(uS.col, dx, dy, 0.0);
        gl.uniform1f(uS.rad, SPLAT_RADIUS_VEL);
        drawQuad();
        velocity.swap();

        gl.bindFramebuffer(gl.FRAMEBUFFER, dye.write.fbo);
        gl.viewport(0, 0, DYE, DYE);
        bindTex(0, dye.read.tex);
        gl.uniform1i(uS.tgt, 0);
        gl.uniform3f(uS.col, dyeAmt, 0.0, 0.0);
        gl.uniform1f(uS.rad, SPLAT_RADIUS_DYE);
        drawQuad();
        dye.swap();
    }

    // ── Simulation step ──
    function step(dt) {
        // Curl
        gl.useProgram(progCurl);
        gl.bindFramebuffer(gl.FRAMEBUFFER, curlFBO.fbo);
        gl.viewport(0, 0, SIM, SIM);
        bindTex(0, velocity.read.tex);
        gl.uniform1i(uC.vel, 0);
        gl.uniform2fv(uC.ts, SIM_TEXEL);
        drawQuad();

        // Vorticity confinement
        gl.useProgram(progVort);
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.viewport(0, 0, SIM, SIM);
        bindTex(0, velocity.read.tex);
        bindTex(1, curlFBO.tex);
        gl.uniform1i(uV.vel, 0); gl.uniform1i(uV.curl, 1);
        gl.uniform2fv(uV.ts, SIM_TEXEL);
        gl.uniform1f(uV.cs, CURL_STRENGTH);
        gl.uniform1f(uV.dt, dt);
        drawQuad();
        velocity.swap();

        // Divergence
        gl.useProgram(progDiv);
        gl.bindFramebuffer(gl.FRAMEBUFFER, divFBO.fbo);
        gl.viewport(0, 0, SIM, SIM);
        bindTex(0, velocity.read.tex);
        gl.uniform1i(uDv.vel, 0);
        gl.uniform2fv(uDv.ts, SIM_TEXEL);
        drawQuad();

        // Clear pressure
        gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.read.fbo);
        gl.viewport(0, 0, SIM, SIM);
        gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);

        // Pressure Jacobi
        gl.useProgram(progPres);
        gl.uniform2fv(uP.ts, SIM_TEXEL);
        gl.uniform1i(uP.div, 1);
        bindTex(1, divFBO.tex);
        for (let i = 0; i < PRESSURE_ITERS; i++) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
            gl.viewport(0, 0, SIM, SIM);
            bindTex(0, pressure.read.tex);
            gl.uniform1i(uP.pres, 0);
            drawQuad();
            pressure.swap();
        }

        // Gradient subtraction
        gl.useProgram(progGrad);
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.viewport(0, 0, SIM, SIM);
        bindTex(0, pressure.read.tex);
        bindTex(1, velocity.read.tex);
        gl.uniform1i(uG.pres, 0); gl.uniform1i(uG.vel, 1);
        gl.uniform2fv(uG.ts, SIM_TEXEL);
        drawQuad();
        velocity.swap();

        // Advect velocity
        gl.useProgram(progAdvect);
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.viewport(0, 0, SIM, SIM);
        bindTex(0, velocity.read.tex); bindTex(1, velocity.read.tex);
        gl.uniform1i(uA.vel, 0); gl.uniform1i(uA.src, 1);
        gl.uniform1f(uA.dt, dt); gl.uniform1f(uA.diss, VEL_DISSIPATION);
        drawQuad();
        velocity.swap();

        // Advect dye
        gl.bindFramebuffer(gl.FRAMEBUFFER, dye.write.fbo);
        gl.viewport(0, 0, DYE, DYE);
        bindTex(0, velocity.read.tex); bindTex(1, dye.read.tex);
        gl.uniform1i(uA.vel, 0); gl.uniform1i(uA.src, 1);
        gl.uniform1f(uA.dt, dt); gl.uniform1f(uA.diss, DYE_DISSIPATION);
        drawQuad();
        dye.swap();
    }

    // ── RAF loop ──
    let rafId = null, running = false;
    let lastTs = 0, targetFPS = 60, simTime = 0;

    function tick(ts) {
        rafId = requestAnimationFrame(tick);
        if (ts - lastTs < 1000 / targetFPS - 1) return;
        const dt = Math.min((ts - lastTs) / 1000, 0.02);
        lastTs = ts;
        simTime += dt;

        // Splat on cursor movement — whisper-soft trail, never a blob
        if (curX >= 0) {
            const dx = curX - prevX;
            const dy = curY - prevY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0.0002 && dist < 0.3) {
                const speed  = dist / dt;
                const dyeAmt = 0.06 + Math.min(speed / 2.0, 1.0) * 0.16; // max 0.22
                splat(curX, curY, dx / dt * SPLAT_FORCE, dy / dt * SPLAT_FORCE, dyeAmt);
                prevX = curX; prevY = curY;
            }
        }

        // Ambient splats — slow random pulses keep the field alive without cursor
        ambientTimer += dt;
        if (ambientTimer > 1.8) {
            ambientTimer = 0;
            const ax  = 0.25 + Math.random() * 0.50;
            const ay  = 0.25 + Math.random() * 0.50;
            const ang = Math.random() * Math.PI * 2;
            splat(ax, ay, Math.cos(ang) * 120, Math.sin(ang) * 120, 0.05);
        }

        step(dt);

        // Display
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(progDisplay);
        bindTex(0, dye.read.tex);
        gl.uniform1i(uDisp.dye,  0);
        gl.uniform1f(uDisp.time, simTime);
        drawQuad();
    }

    // ── IntersectionObserver — pause GPU when hero is off-screen ──
    const heroEl = document.getElementById('hero');
    const observer = new IntersectionObserver(entries => {
        const r = entries[0].intersectionRatio;
        if (r === 0) { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
        else {
            targetFPS = r > 0.5 ? 60 : r > 0.25 ? 30 : 15;
            if (!rafId && running) rafId = requestAnimationFrame(tick);
        }
    }, { threshold: [0, 0.1, 0.25, 0.5, 1.0] });
    if (heroEl) observer.observe(heroEl);

    function start() {
        running = true;
        rafId   = requestAnimationFrame(tick);
    }
    function cleanup() {
        if (rafId) cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener('resize', resize);
    }
    return { start, cleanup };
}
