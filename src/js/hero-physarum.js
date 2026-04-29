// ─── Hero: Physarum Polycephalum Simulation (WebGL2) ───
// Agent-based slime mold simulation. Agents sense a chemo-attractant trail,
// steer toward it, and deposit more trail — producing self-organizing networks.
// Food sources are sampled from the hero title letterforms so the network
// grows through the text.

const TITLE_LINES = ['The Eye Trains', 'the Machine.', 'Not the Other Way.'];

// ── Shader Sources ──────────────────────────────────────────────────────────

const VS_QUAD = `#version 300 es
precision highp float;
in vec2 aPos;
out vec2 vUV;
void main() {
    vUV = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Reads current agent state (pos + angle), senses the trail + food texture
// in three directions, steers, then moves one step forward.
const FS_AGENT = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uAgentTex;
uniform sampler2D uTrailTex;
uniform sampler2D uFoodTex;
uniform vec2  uTrailSize;
uniform float uTime;
uniform float uSensorAngle;
uniform float uSensorDist;
uniform float uRotSpeed;
uniform float uMoveSpeed;
uniform vec2  uMouse;
uniform float uMouseActive;
uniform float uFoodStrength;
uniform float uCursorBoost;
in  vec2 vUV;
out vec4 fragColor;

float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float sense(vec2 pos, float a, float sd) {
    vec2 uv  = fract(pos + vec2(cos(a), sin(a)) * sd / uTrailSize);
    float t  = texture(uTrailTex, uv).r;
    // Aspect-corrected cursor attractor. uCursorBoost amplifies it when the
    // cursor is moving fast — slow/idle = subtle glow, fast swipe = intense streak.
    vec2  d2 = (uv - uMouse) * vec2(uTrailSize.x / uTrailSize.y, 1.0);
    float m  = uMouseActive * (2.2 + uCursorBoost * 6.0) * exp(-dot(d2, d2) * 6.0);
    return t + m;
}

void main() {
    vec4  ag    = texture(uAgentTex, vUV);
    float x     = ag.r;
    float y     = ag.g;
    float angle = ag.b;
    vec2  pos   = vec2(x, y);

    float F = sense(pos, angle,               uSensorDist);
    float L = sense(pos, angle - uSensorAngle, uSensorDist);
    float R = sense(pos, angle + uSensorAngle, uSensorDist);

    float rng = rand(vUV + fract(uTime * 0.001));

    if (F >= L && F >= R) {
        // straight — no turn
    } else if (F < L && F < R) {
        angle += (rng > 0.5 ? 1.0 : -1.0) * uRotSpeed;
    } else if (L > R) {
        angle -= uRotSpeed;
    } else {
        angle += uRotSpeed;
    }

    // Always-on jitter — prevents agents from locking into straight lines
    // in empty regions (where F=L=R=0) and keeps the network exploring.
    angle += (rand(vUV + fract(uTime * 0.0017)) - 0.5) * 0.18;

    x = fract(x + cos(angle) * uMoveSpeed / uTrailSize.x + 1.0);
    y = fract(y + sin(angle) * uMoveSpeed / uTrailSize.y + 1.0);

    fragColor = vec4(x, y, angle, 1.0);
}`;

// 3×3 blur + exponential decay each frame.
const FS_DIFFUSE = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uTrailTex;
uniform vec2  uTrailSize;
uniform float uDecay;
uniform float uDiffuseWeight;
in  vec2 vUV;
out vec4 fragColor;
void main() {
    vec2  px  = 1.0 / uTrailSize;
    float ctr = texture(uTrailTex, vUV).r;
    float sum = 0.0;
    for (int dx = -1; dx <= 1; dx++)
        for (int dy = -1; dy <= 1; dy++)
            sum += texture(uTrailTex, vUV + vec2(float(dx), float(dy)) * px).r;
    fragColor = vec4(mix(ctr, sum / 9.0, uDiffuseWeight) * uDecay, 0.0, 0.0, 1.0);
}`;

// Each agent is drawn as a 1×1 point at its position; additive blended
// into the trail texture so overlapping agents accumulate.
const VS_DEPOSIT = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uAgentTex;
uniform vec2 uAgentTexSize;
void main() {
    float idx    = float(gl_VertexID);
    vec2  agUV   = (vec2(mod(idx, uAgentTexSize.x),
                         floor(idx / uAgentTexSize.x)) + 0.5) / uAgentTexSize;
    vec4  ag     = texture(uAgentTex, agUV);
    gl_Position  = vec4(ag.r * 2.0 - 1.0, ag.g * 2.0 - 1.0, 0.0, 1.0);
    gl_PointSize = 1.0;
}`;

const FS_DEPOSIT = `#version 300 es
precision highp float;
uniform float uDepositAmount;
out vec4 fragColor;
void main() { fragColor = vec4(uDepositAmount, 0.0, 0.0, 1.0); }`;

// Maps trail density to the brand gradient:
// #060606 → #C10801 (dark red) → #F16001 (orange) → #D9C3AB (warm sand)
const FS_DISPLAY = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uTrailTex;
uniform float uBrightness;
uniform float uTime;
in  vec2 vUV;
out vec4 fragColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 brand(float t) {
    vec3 bg  = vec3(0.024, 0.024, 0.024);
    vec3 r   = vec3(0.757, 0.031, 0.004);
    vec3 o   = vec3(0.945, 0.376, 0.004);
    vec3 s   = vec3(0.851, 0.765, 0.671);
    if (t < 0.001) return bg;
    if (t < 0.35)  return mix(bg, r, t / 0.35);
    if (t < 0.70)  return mix(r,  o, (t - 0.35) / 0.35);
    return                mix(o,  s, (t - 0.70) / 0.30);
}

void main() {
    float raw = texture(uTrailTex, vUV).r;
    float t   = pow(raw / (raw + uBrightness), 0.75);
    vec3  col = brand(t);
    vec2  uv  = vUV - 0.5;
    col *= clamp(1.0 - dot(uv, uv) * 0.55, 0.0, 1.0);
    // Triangular dither — kills banding in dark regions by adding
    // sub-pixel noise. Two hash samples cancel bias.
    vec2  seed = gl_FragCoord.xy + fract(uTime * 0.07) * 7.3;
    float d    = hash(seed) + hash(seed + 0.5) - 1.0;
    col = clamp(col + d / 255.0, 0.0, 1.0);
    fragColor = vec4(col, 1.0);
}`;

// ── Helpers ─────────────────────────────────────────────────────────────────

function compileShader(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error('[physarum] shader error:', gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
    }
    return sh;
}

function buildProgram(gl, vsSrc, fsSrc) {
    const vs = compileShader(gl, gl.VERTEX_SHADER,   vsSrc);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error('[physarum] link error:', gl.getProgramInfoLog(p));
        return null;
    }
    return p;
}

function makeFloatTex(gl, w, h, data = null) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
}

function makeHalfTex(gl, w, h) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, w, h, 0, gl.RED, gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
}

function makeFBO(gl, tex) {
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return fbo;
}

// ── Canvas-2D fallback for devices without WebGL2 / EXT_color_buffer_float ──

function initFallback(canvas) {
    let w, h, rafId;
    const ctx = canvas.getContext('2d');
    function resize() {
        w = canvas.width  = canvas.parentElement.clientWidth;
        h = canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    function draw() {
        rafId = requestAnimationFrame(draw);
        ctx.fillStyle = '#060606';
        ctx.fillRect(0, 0, w, h);
    }
    return {
        start:   () => { rafId = requestAnimationFrame(draw); },
        cleanup: () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); },
    };
}

// ── Main Export ──────────────────────────────────────────────────────────────

export function initHeroPhysarum() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return { start: () => {}, cleanup: () => {} };

    const mobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);

    // Agent grid dimensions — each texel = one agent (x, y, angle, _).
    // Fewer agents + fast decay = sparse vivid veins on dark background.
    const AGENT_COLS  = mobile ? 256  : 512;
    const AGENT_ROWS  = mobile ? 128  : 256;
    const AGENT_COUNT = AGENT_COLS * AGENT_ROWS;

    // Separate X/Y simulation scales create organic non-uniform stretching
    // when upsampled to full canvas. X is compressed more → veins appear
    // horizontally wide. Extreme values = "extreme zoom in" look.
    // Mild vertical elongation for organic feel without killing complexity.
    const SIM_SCALE_X = mobile ? 0.07 : 0.10;
    const SIM_SCALE_Y = mobile ? 0.045 : 0.065;

    // ── WebGL2 init ──
    const gl = canvas.getContext('webgl2', {
        alpha: false, antialias: false, depth: false, stencil: false,
    });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) return initFallback(canvas);

    // ── Compile programs ──
    const agentProg   = buildProgram(gl, VS_QUAD,    FS_AGENT);
    const diffuseProg = buildProgram(gl, VS_QUAD,    FS_DIFFUSE);
    const depositProg = buildProgram(gl, VS_DEPOSIT, FS_DEPOSIT);
    const displayProg = buildProgram(gl, VS_QUAD,    FS_DISPLAY);
    if (!agentProg || !diffuseProg || !depositProg || !displayProg) return initFallback(canvas);

    // ── Cache uniform locations ──
    const uA = {
        agentTex:    gl.getUniformLocation(agentProg, 'uAgentTex'),
        trailTex:    gl.getUniformLocation(agentProg, 'uTrailTex'),
        foodTex:     gl.getUniformLocation(agentProg, 'uFoodTex'),
        trailSize:   gl.getUniformLocation(agentProg, 'uTrailSize'),
        time:        gl.getUniformLocation(agentProg, 'uTime'),
        sensorAngle: gl.getUniformLocation(agentProg, 'uSensorAngle'),
        sensorDist:  gl.getUniformLocation(agentProg, 'uSensorDist'),
        rotSpeed:    gl.getUniformLocation(agentProg, 'uRotSpeed'),
        moveSpeed:   gl.getUniformLocation(agentProg, 'uMoveSpeed'),
        mouse:       gl.getUniformLocation(agentProg, 'uMouse'),
        mouseActive: gl.getUniformLocation(agentProg, 'uMouseActive'),
        foodStrength:gl.getUniformLocation(agentProg, 'uFoodStrength'),
        cursorBoost: gl.getUniformLocation(agentProg, 'uCursorBoost'),
    };
    const uD = {
        trailTex:     gl.getUniformLocation(diffuseProg, 'uTrailTex'),
        trailSize:    gl.getUniformLocation(diffuseProg, 'uTrailSize'),
        decay:        gl.getUniformLocation(diffuseProg, 'uDecay'),
        diffuseWeight:gl.getUniformLocation(diffuseProg, 'uDiffuseWeight'),
    };
    const uDep = {
        agentTex: gl.getUniformLocation(depositProg, 'uAgentTex'),
        agentSize:gl.getUniformLocation(depositProg, 'uAgentTexSize'),
        amount:   gl.getUniformLocation(depositProg, 'uDepositAmount'),
    };
    const uDisp = {
        trailTex:  gl.getUniformLocation(displayProg, 'uTrailTex'),
        brightness:gl.getUniformLocation(displayProg, 'uBrightness'),
        time:      gl.getUniformLocation(displayProg, 'uTime'),
    };

    // ── Quad VAO (shared by agent-update, diffuse, display passes) ──
    const quadVAO = gl.createVertexArray();
    gl.bindVertexArray(quadVAO);
    const quadVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    for (const prog of [agentProg, diffuseProg, displayProg]) {
        gl.useProgram(prog);
        const loc = gl.getAttribLocation(prog, 'aPos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }
    gl.bindVertexArray(null);

    // Empty VAO for deposit draw (uses only gl_VertexID, no attribs needed)
    const emptyVAO = gl.createVertexArray();

    // ── Agent textures (ping-pong) ──
    // Uniform viewport-wide distribution — no starting "shape", the network
    // emerges organically from noise and is sculpted by the cursor.
    function makeAgentData() {
        const d = new Float32Array(AGENT_COUNT * 4);
        for (let i = 0; i < AGENT_COUNT; i++) {
            d[i*4]   = Math.random();
            d[i*4+1] = Math.random();
            d[i*4+2] = Math.random() * Math.PI * 2;
            d[i*4+3] = 1.0;
        }
        return d;
    }
    const agentTex = [
        makeFloatTex(gl, AGENT_COLS, AGENT_ROWS, makeAgentData()),
        makeFloatTex(gl, AGENT_COLS, AGENT_ROWS, makeAgentData()),
    ];
    const agentFBO = [makeFBO(gl, agentTex[0]), makeFBO(gl, agentTex[1])];

    // ── Trail textures (ping-pong, created/recreated on resize) ──
    let trailTex = [null, null];
    let trailFBO = [null, null];
    let trailW = 0, trailH = 0;

    function rebuildTrail(w, h) {
        trailW = w; trailH = h;
        for (let i = 0; i < 2; i++) {
            if (trailTex[i]) gl.deleteTexture(trailTex[i]);
            if (trailFBO[i]) gl.deleteFramebuffer(trailFBO[i]);
            trailTex[i] = makeHalfTex(gl, w, h);
            trailFBO[i] = makeFBO(gl, trailTex[i]);
            gl.bindFramebuffer(gl.FRAMEBUFFER, trailFBO[i]);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    // ── Food texture — disabled (kept as 1×1 black stub so uniforms stay wired) ──
    let foodTex = null;

    function buildFoodTexture() {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 0]));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return tex;
    }

    // ── Resize ──
    // Cap DPR at 2 — beyond that the trail buffer gets too large on phones
    // with 3× screens and kills FPS for no visible gain.
    function applySize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cw  = canvas.parentElement.clientWidth;
        const ch  = canvas.parentElement.clientHeight;
        const bufW = Math.max(2, Math.floor(cw * dpr));
        const bufH = Math.max(2, Math.floor(ch * dpr));
        canvas.style.width  = cw + 'px';
        canvas.style.height = ch + 'px';
        canvas.width  = bufW;
        canvas.height = bufH;
        const tw = Math.max(2, Math.floor(bufW * SIM_SCALE_X));
        const th = Math.max(2, Math.floor(bufH * SIM_SCALE_Y));
        return { w: tw, h: th };
    }
    function resize() {
        const { w, h } = applySize();
        if (w === trailW && h === trailH) return;
        rebuildTrail(w, h);
        if (foodTex) { gl.deleteTexture(foodTex); foodTex = buildFoodTexture(); }
    }
    {
        const { w, h } = applySize();
        rebuildTrail(w, h);
    }
    window.addEventListener('resize', resize);

    // ── Simulation state ──
    let agentRead = 0, agentWrite = 1;
    let trailRead = 0, trailWrite = 1;
    let rafId = null, running = false;
    let simTick = 0, lastFrame = 0, targetFPS = 60;

    // Sim params — tuned for a full-viewport atmospheric network that sits
    // behind the text and reacts strongly to the cursor.
    const SENSOR_ANGLE = Math.PI / 4;
    const SENSOR_DIST  = 8.0;
    const ROT_SPEED    = Math.PI / 4;
    const MOVE_SPEED   = mobile ? 1.2 : 1.6;
    const DEPOSIT      = 0.014;
    const DECAY        = 0.936;   // slightly slower fade — ambient structure visible
    const DIFFUSE      = 0.44;
    const FOOD_STR     = 0.0;
    const BRIGHTNESS   = 2.6;    // dark baseline, cursor zone bursts bright

    // Cursor state — `tgtX/tgtY` is the real pointer (or an idle-drift point),
    // `mouseX/mouseY` is the smoothed attractor the shader samples.
    let mouseX = 0.5, mouseY = 0.5;
    let tgtX   = 0.5, tgtY   = 0.5;
    let lastPointerTs = -1e9;
    let prevTgtX = 0.5, prevTgtY = 0.5;
    let cursorBoost = 0; // 0–1 velocity magnitude, smoothed

    // ── Helpers ──
    function bindTex(unit, tex) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
    }
    function drawQuad() {
        gl.bindVertexArray(quadVAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);
    }

    // ── Render loop ──
    function tick(ts) {
        rafId = requestAnimationFrame(tick);

        const interval = 1000 / targetFPS;
        if (ts - lastFrame < interval - 1) return;
        lastFrame = ts;
        simTick++;

        // Idle-drift: if the user hasn't moved in >1.2s, the attractor traces
        // a slow, tight orbit around the hero's center so the focal point of
        // the network stays visually centered.
        const tSec = ts / 1000;
        if (tSec - lastPointerTs > 1.2) {
            tgtX = 0.5 + 0.16 * Math.sin(tSec * 0.22);
            tgtY = 0.5 + 0.12 * Math.sin(tSec * 0.29 + 1.1);
        }
        // Cursor velocity → boost value (fast swipe = intense reaction)
        const rawSpeed = Math.min(1.0, Math.hypot(tgtX - prevTgtX, tgtY - prevTgtY) * 55);
        cursorBoost += (rawSpeed - cursorBoost) * 0.28;
        prevTgtX = tgtX; prevTgtY = tgtY;

        // Smooth follow — gives the cursor "gravity"
        mouseX += (tgtX - mouseX) * 0.08;
        mouseY += (tgtY - mouseY) * 0.08;

        // 1 — Agent step: read trail[read] + agent[read] → agent[write]
        gl.useProgram(agentProg);
        gl.bindFramebuffer(gl.FRAMEBUFFER, agentFBO[agentWrite]);
        gl.viewport(0, 0, AGENT_COLS, AGENT_ROWS);
        bindTex(0, agentTex[agentRead]);
        bindTex(1, trailTex[trailRead]);
        bindTex(2, foodTex);
        gl.uniform1i(uA.agentTex,    0);
        gl.uniform1i(uA.trailTex,    1);
        gl.uniform1i(uA.foodTex,     2);
        gl.uniform2f(uA.trailSize,   trailW, trailH);
        gl.uniform1f(uA.time,        simTick);
        gl.uniform1f(uA.sensorAngle, SENSOR_ANGLE);
        gl.uniform1f(uA.sensorDist,  SENSOR_DIST);
        gl.uniform1f(uA.rotSpeed,    ROT_SPEED);
        gl.uniform1f(uA.moveSpeed,   MOVE_SPEED);
        gl.uniform2f(uA.mouse,       mouseX, mouseY);
        gl.uniform1f(uA.mouseActive, 1.0);
        gl.uniform1f(uA.foodStrength,FOOD_STR);
        gl.uniform1f(uA.cursorBoost, cursorBoost);
        drawQuad();

        agentRead = agentWrite;
        agentWrite = 1 - agentRead;

        // 2 — Diffuse + decay: trail[read] → trail[write]
        gl.useProgram(diffuseProg);
        gl.bindFramebuffer(gl.FRAMEBUFFER, trailFBO[trailWrite]);
        gl.viewport(0, 0, trailW, trailH);
        bindTex(0, trailTex[trailRead]);
        gl.uniform1i(uD.trailTex,      0);
        gl.uniform2f(uD.trailSize,     trailW, trailH);
        gl.uniform1f(uD.decay,         DECAY);
        gl.uniform1f(uD.diffuseWeight, DIFFUSE);
        drawQuad();

        // 3 — Deposit: draw agents as points (additive) into trail[write]
        gl.useProgram(depositProg);
        gl.bindFramebuffer(gl.FRAMEBUFFER, trailFBO[trailWrite]);
        gl.viewport(0, 0, trailW, trailH);
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE);
        bindTex(0, agentTex[agentRead]);
        gl.uniform1i(uDep.agentTex,  0);
        gl.uniform2f(uDep.agentSize, AGENT_COLS, AGENT_ROWS);
        gl.uniform1f(uDep.amount,    DEPOSIT);
        gl.bindVertexArray(emptyVAO);
        gl.drawArrays(gl.POINTS, 0, AGENT_COUNT);
        gl.disable(gl.BLEND);

        // 4 — Display: colorize trail[write] → screen
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(displayProg);
        bindTex(0, trailTex[trailWrite]);
        gl.uniform1i(uDisp.trailTex,   0);
        gl.uniform1f(uDisp.brightness, BRIGHTNESS);
        gl.uniform1f(uDisp.time,       simTick);
        drawQuad();

        trailRead = trailWrite;
        trailWrite = 1 - trailRead;
    }

    // ── IntersectionObserver — gradual GPU throttle ──
    const heroEl = document.getElementById('hero');
    const observer = new IntersectionObserver((entries) => {
        const ratio = entries[0].intersectionRatio;
        if (ratio === 0) {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        } else {
            targetFPS = ratio > 0.5 ? 60 : ratio > 0.25 ? 30 : 15;
            if (!rafId && running) rafId = requestAnimationFrame(tick);
        }
    }, { threshold: [0, 0.1, 0.25, 0.5, 1.0] });
    if (heroEl) observer.observe(heroEl);

    // ── Cursor / touch handlers ──
    // Listen on window so the attractor tracks the pointer across the whole
    // hero even when hovering the text or nav; Y is flipped into UV space.
    function onMove(cx, cy) {
        const rect = canvas.getBoundingClientRect();
        const nx = (cx - rect.left) / rect.width;
        const ny = 1.0 - (cy - rect.top) / rect.height;
        if (nx < -0.1 || nx > 1.1 || ny < -0.1 || ny > 1.1) return;
        tgtX = Math.min(1, Math.max(0, nx));
        tgtY = Math.min(1, Math.max(0, ny));
        lastPointerTs = performance.now() / 1000;
    }
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
        if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // ── warmup() — silently fast-forwards the simulation so the first visible
    // frame is already in a mature, beautiful steady state (no more "startup
    // blob" — users see the network at its best from frame 1).
    function warmup(frames) {
        for (let i = 0; i < frames; i++) {
            simTick++;
            // Agent step
            gl.useProgram(agentProg);
            gl.bindFramebuffer(gl.FRAMEBUFFER, agentFBO[agentWrite]);
            gl.viewport(0, 0, AGENT_COLS, AGENT_ROWS);
            bindTex(0, agentTex[agentRead]);
            bindTex(1, trailTex[trailRead]);
            bindTex(2, foodTex);
            gl.uniform1i(uA.agentTex,    0);
            gl.uniform1i(uA.trailTex,    1);
            gl.uniform1i(uA.foodTex,     2);
            gl.uniform2f(uA.trailSize,   trailW, trailH);
            gl.uniform1f(uA.time,        simTick);
            gl.uniform1f(uA.sensorAngle, SENSOR_ANGLE);
            gl.uniform1f(uA.sensorDist,  SENSOR_DIST);
            gl.uniform1f(uA.rotSpeed,    ROT_SPEED);
            gl.uniform1f(uA.moveSpeed,   MOVE_SPEED);
            gl.uniform2f(uA.mouse,       0.5, 0.5);
            gl.uniform1f(uA.mouseActive, 1.0);
            gl.uniform1f(uA.foodStrength,FOOD_STR);
            drawQuad();
            agentRead = agentWrite; agentWrite = 1 - agentRead;

            // Diffuse
            gl.useProgram(diffuseProg);
            gl.bindFramebuffer(gl.FRAMEBUFFER, trailFBO[trailWrite]);
            gl.viewport(0, 0, trailW, trailH);
            bindTex(0, trailTex[trailRead]);
            gl.uniform1i(uD.trailTex,      0);
            gl.uniform2f(uD.trailSize,     trailW, trailH);
            gl.uniform1f(uD.decay,         DECAY);
            gl.uniform1f(uD.diffuseWeight, DIFFUSE);
            drawQuad();

            // Deposit
            gl.useProgram(depositProg);
            gl.bindFramebuffer(gl.FRAMEBUFFER, trailFBO[trailWrite]);
            gl.viewport(0, 0, trailW, trailH);
            gl.enable(gl.BLEND);
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE);
            bindTex(0, agentTex[agentRead]);
            gl.uniform1i(uDep.agentTex,  0);
            gl.uniform2f(uDep.agentSize, AGENT_COLS, AGENT_ROWS);
            gl.uniform1f(uDep.amount,    DEPOSIT);
            gl.bindVertexArray(emptyVAO);
            gl.drawArrays(gl.POINTS, 0, AGENT_COUNT);
            gl.disable(gl.BLEND);

            trailRead = trailWrite; trailWrite = 1 - trailRead;
        }
    }

    // ── start() — called after preloader exits ──
    function start() {
        running = true;
        foodTex = buildFoodTexture();
        warmup(45); // light warmup — establishes structure without saturating the trail
        rafId = requestAnimationFrame(tick);
    }

    // ── cleanup ──
    function cleanup() {
        if (rafId) cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener('resize', resize);
    }

    return { start, cleanup };
}
