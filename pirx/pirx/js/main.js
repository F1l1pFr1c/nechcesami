/* pirx.rent — wspólny skrypt (wymaga bootstrap.bundle.js dla offcanvas/collapse/tabs) */
(function () {
  'use strict';

  /* ---------- Dropdowny w nawigacji (desktop) ---------- */
  const dropdowns = document.querySelectorAll('[data-dropdown]');

  function closeAllDropdowns(except) {
    dropdowns.forEach(function (dd) {
      if (dd === except) return;
      dd.querySelector('.submenu').classList.remove('is-open');
      dd.querySelector('button').setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach(function (dd) {
    const btn = dd.querySelector('button');
    const menu = dd.querySelector('.submenu');
    let hoverTimer;

    function open() { closeAllDropdowns(dd); menu.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
    function close() { menu.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }

    btn.addEventListener('click', function (e) {
      // myszka już otworzyła menu na hover — klik nie powinien go od razu zamykać
      const viaHoverMouse = e.detail > 0 && window.matchMedia('(hover: hover)').matches;
      if (viaHoverMouse) { open(); return; }
      menu.classList.contains('is-open') ? close() : open();
    });

    // hover tylko dla myszy
    dd.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { clearTimeout(hoverTimer); open(); } });
    dd.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hoverTimer = setTimeout(close, 150); } });

    dd.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); btn.focus(); }
    });
    dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) close(); });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-dropdown]')) closeAllDropdowns();
  });

})();
