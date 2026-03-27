// Section toggles
function initResearchToggles() {
  function setupToggle(toggleId, listId) {
    var toggle = document.getElementById(toggleId);
    var list = document.getElementById(listId);
    if (!toggle || !list) return;
    // Remove old listeners by cloning
    var newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);

    var sub = newToggle.nextElementSibling;
    if (sub && !sub.classList.contains('pub-note-sub')) sub = null;

    newToggle.addEventListener('click', function() {
      var hidden = list.style.display === 'none';
      list.style.display = hidden ? '' : 'none';
      if (sub) sub.style.display = hidden ? '' : 'none';
      newToggle.querySelector('.toggle-icon').textContent = hidden ? '\u25BE' : '\u25B8';
    });
  }

  setupToggle('preprints-toggle', 'preprints-list');
  setupToggle('journal-toggle', 'journal-list');
}

window.initResearchToggles = initResearchToggles;
initResearchToggles();
