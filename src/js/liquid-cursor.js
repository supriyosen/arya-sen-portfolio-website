// ─── Liquid Cursor — WebGL metaball trail with cursor-following spring chain ───
//
// Why WebGL and not an SVG filter on the page:
// Real DOM distortion via feDisplacementMap requires the browser to re-filter
// the entire page paint every frame. On a tall portfolio page, that drops
// frames hard enough to stall the custom-cursor rAF loop. WebGL on a fixed
// overlay runs in its own context, so the page paints freely.
//
// What it looks like: a chain of 24 metaball points where each lags behind
// the previous. They sum into a continuous liquid blob trail. Rendered with
// mix-blend-mode: difference so the trail interacts with whatever's beneath
// (the same blend the existing dot cursor uses).

import * as THREE from 'three';

export function initLiquidCursor() {
  if ('ontouchstart' in window) return;

  const TRAIL_LEN = 24;

  // ─── Renderer ───
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '9998', // above content, below the dot cursor (999999)
  });
  document.body.appendChild(canvas);

  // ─── Scene ───
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  // Trail uniform array — fixed length so the shader can unroll
  const trailUniform = [];
  for (let i = 0; i < TRAIL_LEN; i++) {
    trailUniform.push(new THREE.Vector2(-9999, -9999));
  }

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uRes:    { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTrail:  { value: trailUniform },
      uTime:   { value: 0 },
      uActive: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform vec2  uRes;
      uniform vec2  uTrail[${TRAIL_LEN}];
      uniform float uTime;
      uniform float uActive;
      varying vec2  vUv;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i),               hash(i + vec2(1, 0)), u.x),
                   mix(hash(i + vec2(0, 1)),  hash(i + vec2(1, 1)), u.x), u.y);
      }

      // Distance from p to the segment a->b
      float sdSegment(vec2 p, vec2 a, vec2 b) {
        vec2 pa = p - a, ba = b - a;
        float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
        return length(pa - ba * h);
      }

      void main() {
        vec2 px = vUv * uRes;

        // Subtle organic wobble in sample space — keeps the trail from looking too clean
        vec2 wob = vec2(
          noise(px * 0.012 + uTime * 0.3),
          noise(px * 0.012 + uTime * 0.3 + 31.7)
        ) - 0.5;
        px += wob * 5.0;

        // Distance to the trail polyline, with tapered thickness from head → tail
        float dMin = 1e6;
        for (int i = 0; i < ${TRAIL_LEN} - 1; i++) {
          float t = float(i) / float(${TRAIL_LEN - 1});
          float thick = mix(3.0, 0.6, t);             // head 3px → tail 0.6px
          float d = sdSegment(px, uTrail[i], uTrail[i + 1]);
          dMin = min(dMin, d - thick);
        }

        // Flat fill — no rim, no glow
        float a = (1.0 - smoothstep(-0.5, 0.5, dMin)) * uActive;
        vec3 col = vec3(0.20, 0.55, 1.0);             // flat blue
        gl_FragColor = vec4(col, a);
      }
    `,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  // ─── State ───
  let mouseX = -9999, mouseY = -9999;
  let active = 0, targetActive = 0;
  let seeded = false;

  // Trail: each point lags behind the previous one — a springy chain
  const trail = [];
  for (let i = 0; i < TRAIL_LEN; i++) trail.push({ x: -9999, y: -9999 });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!seeded) {
      // Snap whole chain to first cursor position so it doesn't fly in from off-screen
      for (let i = 0; i < TRAIL_LEN; i++) { trail[i].x = mouseX; trail[i].y = mouseY; }
      seeded = true;
    }
    targetActive = 1;
  });

  document.addEventListener('mouseleave', () => { targetActive = 0; });

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
  });

  // ─── Loop ───
  function tick(t) {
    active += (targetActive - active) * 0.06;

    // Head chases the cursor
    trail[0].x += (mouseX - trail[0].x) * 0.32;
    trail[0].y += (mouseY - trail[0].y) * 0.32;

    // Each link chases the previous; spring weakens down the tail
    for (let i = 1; i < TRAIL_LEN; i++) {
      const k = Math.max(0.10, 0.32 - i * 0.008);
      trail[i].x += (trail[i - 1].x - trail[i].x) * k;
      trail[i].y += (trail[i - 1].y - trail[i].y) * k;
    }

    // Push to GPU — flip Y because WebGL origin is bottom-left
    const arr = material.uniforms.uTrail.value;
    const h = window.innerHeight;
    for (let i = 0; i < TRAIL_LEN; i++) {
      arr[i].x = trail[i].x;
      arr[i].y = h - trail[i].y;
    }

    material.uniforms.uTime.value   = t * 0.001;
    material.uniforms.uActive.value = active;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
