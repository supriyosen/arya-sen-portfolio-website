// ─── Custom Cursor ───

export function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  // Check for touch devices
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover detection
  const hoverTargets = 'a, button, [data-cursor="hover"], .work__card, .services__card, .lb-thumb';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('cursor--hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('cursor--hover');
    }
  });

  // Click effect
  document.addEventListener('mousedown', () => cursor.classList.add('cursor--click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('cursor--click'));

  // Smooth follow with lerp
  function animate() {
    const speed = 0.15;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    cursor.style.transform = `translate(${cursorX - cursor.offsetWidth / 2}px, ${cursorY - cursor.offsetHeight / 2}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}
