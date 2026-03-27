// SPA Router — swap page content without full reload
// Keeps nav bar + particles alive across navigations
(function() {
  // Store the original home hero on first load (if on home page)
  var homeHero = document.querySelector('.hero-full');

  // If we started on home, detach the hero so it persists
  if (homeHero) {
    homeHero._isHome = true;
  }

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

      // Swap page content
      if (newContent && currentContent) {
        currentContent.innerHTML = newContent.innerHTML;
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

      // Handle home hero
      if (isHome) {
        if (homeHero) {
          homeHero.style.display = '';
        } else {
          // First time visiting home via SPA — inject hero from fetched page
          var newHero = doc.querySelector('.hero-full');
          if (newHero) {
            var banner = document.getElementById('page-banner');
            homeHero = newHero.cloneNode(true);
            banner.parentNode.insertBefore(homeHero, banner);
            // Init particles on the new canvas
            var canvas = homeHero.querySelector('canvas');
            if (canvas && window.initParticleSystem) {
              window.initParticleSystem(canvas, {
                maxParticles: 80,
                densityDivisor: 8000,
                maxDistance: 150,
                speed: 0.4
              });
            }
          }
        }
      } else {
        if (homeHero) {
          homeHero.style.display = 'none';
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

      // Re-run research toggles if on research page
      if (url.indexOf('/research') !== -1 && window.initResearchToggles) {
        setTimeout(window.initResearchToggles, 0);
      }

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
