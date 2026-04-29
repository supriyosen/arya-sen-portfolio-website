// ─── Clients — Canvas Ribbon Ticker ───
// Each character is drawn at the wave's tangent angle so text follows the curve.

const CLIENTS = [
    'Netflix', 'Oppo', 'Vivo', 'Redmi', 'Amazon Prime', 'Livon', 'Philips',
    "Levi's", 'Lifestyle', 'Tata', 'Reebok', 'Reliance', 'IPL',
];

const SEP        = '    ✦    ';
const SPEED      = 75;   // CSS px per second (scroll rate)
const AMPLITUDE  = 0.20; // wave amplitude as fraction of canvas height
const THICKNESS  = 0.26; // ribbon half-thickness as fraction of canvas height

export function initMarquee() {
    const canvas = document.getElementById('clients-canvas');
    if (!canvas) return;
    new RibbonTicker(canvas);
}

class RibbonTicker {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');

        const loop    = CLIENTS.map(n => n.toUpperCase()).join(SEP) + SEP;
        this.oneLoop  = loop;
        this.allText  = loop.repeat(6); // enough to fill any viewport

        this.pixelOffset = 0;
        this.lastTime    = null;
        this.cssW = 1; this.cssH = 1;
        this.dpr         = window.devicePixelRatio || 1;
        this.charWidths  = {};
        this.loopW       = 0;
        this.fontSize    = 16;

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Re-measure once Syne is confirmed loaded
        document.fonts.ready.then(() => this.precompute());

        requestAnimationFrame(t => this.frame(t));
    }

    resize() {
        this.dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        if (!rect.width) return;

        this.cssW = rect.width;
        this.cssH = rect.height;
        this.canvas.width  = Math.round(rect.width  * this.dpr);
        this.canvas.height = Math.round(rect.height * this.dpr);

        this.precompute();
    }

    precompute() {
        this.fontSize = Math.round(this.cssH * 0.105);
        const ctx = this.ctx;
        ctx.font = `600 ${this.fontSize}px 'Syne', sans-serif`;

        // Measure unique characters only (fast)
        const unique = [...new Set([...this.oneLoop])];
        this.charWidths = {};
        unique.forEach(c => { this.charWidths[c] = ctx.measureText(c).width; });

        this.loopW = [...this.oneLoop].reduce((s, c) => s + (this.charWidths[c] ?? 0), 0);
    }

    // Centerline Y at a given X
    waveY(x) {
        const A     = this.cssH * AMPLITUDE;
        const phase = (this.pixelOffset / this.cssW) * Math.PI * 2;
        return this.cssH / 2 + Math.sin((x / this.cssW) * Math.PI * 2 - phase) * A;
    }

    // Derivative dy/dx at X (for tangent angle)
    waveDY(x) {
        const A     = this.cssH * AMPLITUDE;
        const phase = (this.pixelOffset / this.cssW) * Math.PI * 2;
        return (A * Math.cos((x / this.cssW) * Math.PI * 2 - phase) * Math.PI * 2) / this.cssW;
    }

    drawRibbon() {
        const { ctx, cssW, cssH } = this;
        const T      = cssH * THICKNESS;
        // Extend the ribbon well beyond canvas edges so its tilted end-caps
        // fall off-screen — the canvas clips them, so the ribbon reads as
        // continuous through the left/right edges.
        const margin = T * 2 + cssH * AMPLITUDE;
        const xStart = -margin;
        const xEnd   = cssW + margin;
        const range  = xEnd - xStart;
        const steps  = Math.ceil(range / 2); // sample every 2px

        const topX = new Float32Array(steps + 1);
        const topY = new Float32Array(steps + 1);
        const botX = new Float32Array(steps + 1);
        const botY = new Float32Array(steps + 1);

        for (let i = 0; i <= steps; i++) {
            const x   = xStart + (i / steps) * range;
            const y   = this.waveY(x);
            const dy  = this.waveDY(x);
            const len = Math.sqrt(1 + dy * dy);

            // Perpendicular normal (-dy/len, 1/len) points "upward" from the curve
            const nx = -dy / len;
            const ny =   1 / len;

            topX[i] = x - nx * T;
            topY[i] = y - ny * T;
            botX[i] = x + nx * T;
            botY[i] = y + ny * T;
        }

        // Ribbon fill — top-to-bottom gradient for 3-D depth illusion
        // Background colors are handled by CSS on .clients, canvas is transparent.
        const grad = ctx.createLinearGradient(0, 0, 0, cssH);
        grad.addColorStop(0,    '#3F20E0');
        grad.addColorStop(0.45, '#2107B4');
        grad.addColorStop(1,    '#1505A0');

        ctx.beginPath();
        ctx.moveTo(topX[0], topY[0]);
        for (let i = 1; i <= steps; i++) ctx.lineTo(topX[i], topY[i]);
        for (let i = steps; i >= 0; i--) ctx.lineTo(botX[i], botY[i]);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Subtle specular highlight along the top edge
        ctx.beginPath();
        ctx.moveTo(topX[0], topY[0]);
        for (let i = 1; i <= steps; i++) ctx.lineTo(topX[i], topY[i]);
        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.lineWidth   = 2;
        ctx.stroke();
    }

    drawText() {
        const { ctx, cssW, fontSize, charWidths, loopW } = this;
        if (!loopW) return;

        ctx.font         = `600 ${fontSize}px 'Syne', sans-serif`;
        ctx.fillStyle    = 'rgba(255,255,255,0.92)';
        ctx.textBaseline = 'middle';

        // Start X scrolls right-to-left, wraps every loopW pixels
        let x = -(this.pixelOffset % loopW);
        if (x > 0) x -= loopW;

        for (const char of this.allText) {
            const w = charWidths[char] ?? ctx.measureText(char).width;
            if (x > cssW + 60) break;

            if (x + w > -60) {
                const cx  = x + w / 2;
                const clampedCX = Math.max(0, Math.min(cx, cssW));
                const y   = this.waveY(clampedCX);
                const dy  = this.waveDY(clampedCX);
                const ang = Math.atan2(dy, 1); // tangent angle

                ctx.save();
                ctx.translate(cx, y);
                ctx.rotate(ang);
                ctx.fillText(char, -w / 2, 0);
                ctx.restore();
            }
            x += w;
        }
    }

    frame(time) {
        if (this.lastTime !== null) {
            const dt = (time - this.lastTime) / 1000;
            this.pixelOffset = (this.pixelOffset + SPEED * dt) % (this.loopW || 1000);
        }
        this.lastTime = time;

        const { ctx, cssW, cssH, dpr } = this;
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, cssW, cssH);

        this.drawRibbon();
        this.drawText();

        ctx.restore();
        requestAnimationFrame(t => this.frame(t));
    }
}
