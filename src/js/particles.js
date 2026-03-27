// Particle Network Animation — Felipe M. Affonso Signature Style
(function() {
  function getBgColor() {
    return document.documentElement.classList.contains('dark') ? '#121212' : '#f8f9fa';
  }

  function createParticleSystem(canvas, opts) {
    if (!canvas) return;
    // Don't double-init
    if (canvas.dataset.particlesInit) return;
    canvas.dataset.particlesInit = 'true';

    const ctx = canvas.getContext('2d');
    let particles = [];

    const config = {
      particleColor: 'rgba(218, 119, 86, 0.6)',
      lineAlpha: 0.2,
      maxParticles: opts.maxParticles || 80,
      densityDivisor: opts.densityDivisor || 8000,
      maxDistance: opts.maxDistance || 150,
      speed: opts.speed || 0.4
    };

    function resize() {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      initParticles();
    }

    function initParticles() {
      particles = [];
      const num = Math.min(config.maxParticles,
        Math.floor((canvas.width * canvas.height) / config.densityDivisor));
      for (let i = 0; i < num; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * config.speed,
          vy: (Math.random() - 0.5) * config.speed,
          r: Math.random() * 2 + 1
        });
      }
    }

    function draw() {
      ctx.fillStyle = getBgColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < config.maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(218, 119, 86, ${config.lineAlpha * (1 - d / config.maxDistance)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = config.particleColor;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
  }

  // Expose globally so the SPA router can reinit
  window.initParticleSystem = createParticleSystem;

  // Hero canvas (home page)
  createParticleSystem(document.getElementById('particles'), {
    maxParticles: 80,
    densityDivisor: 8000,
    maxDistance: 150,
    speed: 0.4
  });

  // Nav bar canvas (all pages)
  createParticleSystem(document.getElementById('nav-particles'), {
    maxParticles: 50,
    densityDivisor: 2000,
    maxDistance: 120,
    speed: 0.3
  });
})();
