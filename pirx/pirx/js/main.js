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

  /* ---------- Własny <select> (kalkulator, formularz kontaktowy) ---------- */
  const selects = document.querySelectorAll('[data-select]');

  function closeAllSelects(except) {
    selects.forEach(function (s) { if (s !== except && s._close) s._close(); });
  }

  selects.forEach(function (sel) {
    const btn = sel.querySelector('.select__btn');
    const list = sel.querySelector('.select__list');
    const valueEl = sel.querySelector('.select__value');
    const hidden = sel.querySelector('input[type="hidden"]');
    const options = Array.from(list.querySelectorAll('[role="option"]'));
    const placeholder = valueEl.textContent;
    let active = -1;

    options.forEach(function (o, i) { o.id = o.id || (list.id || 'sel') + '-opt-' + i + '-' + Math.random().toString(36).slice(2, 7); });

    function setActive(i) {
      options.forEach(function (o) { o.classList.remove('is-active'); });
      active = Math.max(0, Math.min(options.length - 1, i));
      options[active].classList.add('is-active');
      btn.setAttribute('aria-activedescendant', options[active].id);
      options[active].scrollIntoView({ block: 'nearest' });
    }
    function open() {
      closeAllSelects(sel);
      sel.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      const cur = options.findIndex(function (o) { return o.getAttribute('aria-selected') === 'true'; });
      setActive(cur >= 0 ? cur : 0);
    }
    function close() {
      sel.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.removeAttribute('aria-activedescendant');
    }
    function choose(i) {
      options.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
      options[i].setAttribute('aria-selected', 'true');
      valueEl.textContent = options[i].textContent;
      valueEl.classList.add('has-value');
      if (hidden) { hidden.value = options[i].dataset.value || options[i].textContent; }
      sel.classList.remove('is-invalid');
      sel.dispatchEvent(new CustomEvent('select:change', { bubbles: true, detail: hidden ? hidden.value : null }));
      close();
      btn.focus();
    }
    sel._close = close;
    sel._reset = function () {
      options.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
      valueEl.textContent = placeholder; valueEl.classList.remove('has-value');
      if (hidden) hidden.value = '';
    };

    sel.addEventListener('click', function (e) {
      const opt = e.target.closest('[role="option"]');
      if (opt) { choose(options.indexOf(opt)); return; }
      sel.classList.contains('is-open') ? close() : open();
    });

    btn.addEventListener('keydown', function (e) {
      const isOpen = sel.classList.contains('is-open');
      switch (e.key) {
        case 'ArrowDown': e.preventDefault(); isOpen ? setActive(active + 1) : open(); break;
        case 'ArrowUp': e.preventDefault(); isOpen ? setActive(active - 1) : open(); break;
        case 'Home': if (isOpen) { e.preventDefault(); setActive(0); } break;
        case 'End': if (isOpen) { e.preventDefault(); setActive(options.length - 1); } break;
        case 'Enter': case ' ':
          e.preventDefault(); isOpen ? choose(active) : open(); break;
        case 'Escape': if (isOpen) { e.preventDefault(); close(); } break;
        case 'Tab': close(); break;
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-select]')) closeAllSelects();
  });

})();
