// SPA Router — swap page content without full reload
// Keeps nav bar + particles alive across navigations
(function() {
  async function navigate(url, pushState) {
    try {
      var resp = await fetch(url);
      var html = await resp.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');

      var newContent = doc.getElementById('page-content');
      var newBanner = doc.getElementById('page-banner');
      var currentContent = document.getElementById('page-content');
      var currentBanner = document.getElementById('page-banner');
      var isHome = url === '/' || url === '/index.html';

      // Fade out, swap content, fade in
      if (newContent && currentContent) {
        currentContent.classList.add('fade-out');
        await new Promise(function(r) { setTimeout(r, 200); });
        currentContent.innerHTML = newContent.innerHTML;
        currentContent.classList.remove('fade-out');
      }

      // Handle banner
      if (currentBanner) {
        if (newBanner && newBanner.style.display !== 'none') {
          currentBanner.innerHTML = newBanner.innerHTML;
          currentBanner.style.display = '';
        } else {
          currentBanner.style.display = 'none';
        }
      }

      // Init hero particles if navigating to home
      if (isHome) {
        var heroCanvas = document.querySelector('#page-content .hero-full canvas');
        if (heroCanvas && window.initParticleSystem) {
          heroCanvas.removeAttribute('data-particles-init');
          window.initParticleSystem(heroCanvas, {
            maxParticles: 80,
            densityDivisor: 8000,
            maxDistance: 150,
            speed: 0.4
          });
        }
      }

      // Update page title
      var newTitle = doc.querySelector('title');
      if (newTitle) document.title = newTitle.textContent;

      // Update active nav link
      document.querySelectorAll('.nav-links a').forEach(function(a) {
        var href = a.getAttribute('href');
        a.classList.toggle('active',
          href === url || (href === '/' && isHome));
      });

      if (pushState) {
        history.pushState({}, '', url);
      }

      window.scrollTo(0, 0);
    } catch (e) {
      window.location.href = url;
    }
  }

  // Intercept nav link clicks
  document.addEventListener('click', function(e) {
    var link = e.target.closest('.nav-links a');
    if (!link) return;
    var url = link.getAttribute('href');
    if (!url || url.startsWith('http') || url.startsWith('#')) return;
    e.preventDefault();
    if (url !== window.location.pathname) {
      navigate(url, true);
    }
  });

  window.addEventListener('popstate', function() {
    navigate(window.location.pathname, false);
  });
})();
