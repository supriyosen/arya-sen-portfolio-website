// ─── Hero Canvas: Floating Shapes Placeholder ───
// This renders abstract floating shapes as a visual placeholder
// until a Spline 3D scene is integrated.

export function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = 0.5, mouseY = 0.5;
    let animFrame;

    function resize() {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
    });

    // Generate shapes
    const shapes = [];
    const shapeCount = 12;

    for (let i = 0; i < shapeCount; i++) {
        shapes.push({
            x: Math.random() * 1.2 - 0.1,
            y: Math.random() * 1.2 - 0.1,
            size: Math.random() * 60 + 20,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.01,
            floatSpeed: Math.random() * 0.0005 + 0.0003,
            floatOffset: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.15 + 0.05,
            type: Math.floor(Math.random() * 3), // 0: circle, 1: square, 2: triangle
            hue: Math.random() * 40 + 230, // blue-purple range
        });
    }

    function draw(time) {
        ctx.clearRect(0, 0, width, height);

        shapes.forEach(shape => {
            const parallaxX = (mouseX - 0.5) * 30 * (shape.size / 60);
            const parallaxY = (mouseY - 0.5) * 30 * (shape.size / 60);
            const floatY = Math.sin(time * shape.floatSpeed + shape.floatOffset) * 20;

            const x = shape.x * width + parallaxX;
            const y = shape.y * height + parallaxY + floatY;

            shape.rotation += shape.rotationSpeed;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(shape.rotation);
            ctx.globalAlpha = shape.opacity;

            // Glow
            ctx.shadowColor = `hsla(${shape.hue}, 80%, 60%, 0.3)`;
            ctx.shadowBlur = 40;

            ctx.strokeStyle = `hsla(${shape.hue}, 60%, 60%, ${shape.opacity * 2})`;
            ctx.lineWidth = 1.5;

            switch (shape.type) {
                case 0: // Circle
                    ctx.beginPath();
                    ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 1: // Square
                    ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                    break;
                case 2: // Triangle
                    ctx.beginPath();
                    ctx.moveTo(0, -shape.size);
                    ctx.lineTo(shape.size * 0.866, shape.size * 0.5);
                    ctx.lineTo(-shape.size * 0.866, shape.size * 0.5);
                    ctx.closePath();
                    ctx.stroke();
                    break;
            }

            ctx.restore();
        });

        animFrame = requestAnimationFrame(draw);
    }

    draw(0);

    // Cleanup hook
    return () => {
        cancelAnimationFrame(animFrame);
        window.removeEventListener('resize', resize);
    };
}
