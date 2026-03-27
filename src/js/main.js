// Nav scroll effect
(function() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile hamburger
  const btn = document.querySelector('.nav-hamburger');
  const links = document.querySelector('.nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Dark mode toggle
  var toggle = document.getElementById('themeToggle');
  var icon = document.getElementById('themeIcon');
  if (toggle && icon) {
    // Set initial icon
    function updateIcon() {
      var isDark = document.documentElement.classList.contains('dark');
      icon.innerHTML = isDark ? '&#9728;' : '&#9790;';
    }
    updateIcon();

    toggle.addEventListener('click', function() {
      var isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
      updateIcon();
    });
  }
})();
