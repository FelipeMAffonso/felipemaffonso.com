// SPA Router — swap page content without full reload
// Keeps nav bar + particles alive across navigations
(function() {
  function getContentArea() {
    // Everything after .nav-bar (and .page-banner if present) is content
    return document.getElementById('page-content');
  }

  function getBanner() {
    return document.getElementById('page-banner');
  }

  function updateActiveLink(url) {
    document.querySelectorAll('.nav-links a').forEach(function(a) {
      var href = a.getAttribute('href');
      if (href === url || (url.startsWith(href) && href !== '/')) {
        a.classList.add('active');
      } else if (href === '/' && url === '/') {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  function isHomePage(url) {
    return url === '/' || url === '/index.html';
  }

  async function navigate(url, pushState) {
    try {
      var resp = await fetch(url);
      var html = await resp.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');

      // Get new page content
      var newContent = doc.getElementById('page-content');
      var newBanner = doc.getElementById('page-banner');
      var currentContent = getContentArea();
      var currentBanner = getBanner();

      if (newContent && currentContent) {
        currentContent.innerHTML = newContent.innerHTML;
      }

      // Handle banner: show/hide and update title
      if (newBanner) {
        if (currentBanner) {
          currentBanner.innerHTML = newBanner.innerHTML;
          currentBanner.style.display = '';
        }
      } else {
        if (currentBanner) {
          currentBanner.style.display = 'none';
        }
      }

      // Handle home hero: show/hide
      var currentHero = document.querySelector('.hero-full');
      var newHero = doc.querySelector('.hero-full');
      if (currentHero) {
        currentHero.style.display = newHero ? '' : 'none';
      } else if (newHero) {
        // Going back to home from subpage — need the hero
        // Insert it before page-content
        var navBar = document.querySelector('.nav-bar');
        var heroClone = newHero.cloneNode(true);
        navBar.after(heroClone);
        // Initialize hero particles
        if (window.initParticleSystem) {
          window.initParticleSystem(heroClone.querySelector('canvas'), {
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
      updateActiveLink(url);

      // Run any inline scripts in new content (like research.js toggle setup)
      var scripts = currentContent.querySelectorAll('script');
      scripts.forEach(function(s) {
        var ns = document.createElement('script');
        ns.textContent = s.textContent;
        if (s.src) ns.src = s.src;
        s.replaceWith(ns);
      });

      // Load page-specific scripts
      var newScripts = doc.querySelectorAll('script[src]');
      var currentScripts = new Set();
      document.querySelectorAll('script[src]').forEach(function(s) {
        currentScripts.add(s.getAttribute('src'));
      });
      newScripts.forEach(function(s) {
        var src = s.getAttribute('src');
        if (src && !currentScripts.has(src) && src !== '/js/main.js' && src !== '/js/particles.js' && src !== '/js/router.js') {
          var ns = document.createElement('script');
          ns.src = src;
          document.body.appendChild(ns);
        }
      });

      // Re-run research toggles if on research page
      if (url.indexOf('/research') !== -1 && window.initResearchToggles) {
        window.initResearchToggles();
      }

      if (pushState) {
        history.pushState({}, '', url);
      }

      window.scrollTo(0, 0);
    } catch (e) {
      // Fallback to normal navigation
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

  // Handle browser back/forward
  window.addEventListener('popstate', function() {
    navigate(window.location.pathname, false);
  });
})();
