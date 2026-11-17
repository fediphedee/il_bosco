/* ============================================================
   ilBosco — notizie.html: footer "Chi siamo" toggle
   ============================================================ */
(function () {
  'use strict';
  document.querySelectorAll('.footer__chi-siamo-toggle').forEach(toggle => {
    const body = toggle.nextElementSibling;
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      body.hidden = open;
    });
  });
})();
