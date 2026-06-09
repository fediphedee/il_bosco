/* ============================================================
   ilBosco — INTRO LOADER

   A full-viewport dark-green overlay holds the mascot centred and
   walking. When assets are ready, the SAME mascot node FLIPs into
   the hero logo's measured position (one continuous motion, no cut),
   the overlay dissolves into the page background (same colour, so no
   curtain), and the wordmark rises line-by-line followed by the copy
   and nav — with a soft bouncy ease to match the hand-drawn art.

   • Plays once per session (sessionStorage).
   • Dismissible early on click / key / scroll (snaps to end, no half-states).
   • prefers-reduced-motion → no sequence, a 300ms hero fade + static mascot.
   • Progressive enhancement: the hero is visible by default; this overlay
     only ever exists when JS runs.

   ─── TUNE EVERYTHING IN `CONFIG` BELOW ───
   ============================================================ */
(function () {
  'use strict';

  // ─── CONFIG — durations (ms), easings, assets ──────────────────────────────
  const CONFIG = {
    // Gating: how long the loader is shown
    MIN_MS:        1500,   // minimum on-screen time (counter ticks 0→100 over this)
    MAX_MS:        4000,   // hard timeout — hand off even if assets aren't ready

    // Mascot hand-off (loader centre → hero logo position)
    HANDOFF_MS:    760,
    HANDOFF_EASE:  'cubic-bezier(0.34, 1.4, 0.64, 1)',  // soft bounce ≈ back.out

    // Element reveal (wordmark lines, copy, nav)
    REVEAL_DUR:    640,
    REVEAL_EASE:   'cubic-bezier(0.34, 1.4, 0.64, 1)',

    // Overlay dissolving into the page background
    BG_FADE_MS:    560,
    COUNT_OUT_MS:  200,    // counter fades out as the hand-off begins

    // Reduced-motion path
    REDUCED_MS:    300,

    // Assets
    MASCOT:        'assets/bosco_animated_logo.gif',
    STATIC_MASCOT: 'assets/Bosco_logo_green.png',  // first-frame fallback (reduced motion)
    // ↑ Swap MASCOT to an APNG / animated WebP / Lottie here when you have one —
    //   sharper + lighter than GIF. Everything else stays the same.
    HERO_ASSETS:   ['assets/bosco_animated_logo.gif', 'assets/nav-wordmark.svg', 'assets/Footer%20V2.svg'],

    SS_KEY:        'boscoIntroPlayed',
  };

  // ─── Derived timeline — offsets in ms from GO (t=0) ────────────────────────
  // Tweaked so the page begins arriving as the mascot settles, not after it.
  const T = {
    COUNT_OUT:  0,                       // counter starts fading immediately
    FLIP:       0,                       // mascot starts its flight
    BG_FADE:    CONFIG.HANDOFF_MS - 240,  // overlay dissolves as mascot nears home
    LINE1:      CONFIG.HANDOFF_MS - 140,  // first wordmark line rises
    LINE2:      CONFIG.HANDOFF_MS - 140 + 120,
    NAV:        CONFIG.HANDOFF_MS - 140 + 120,
    MANIFESTO:  CONFIG.HANDOFF_MS - 140 + 260,
  };
  // Everything has finished arriving here → swap mascot, tear the overlay down.
  T.CLEANUP = Math.max(
    CONFIG.HANDOFF_MS,
    T.BG_FADE + CONFIG.BG_FADE_MS,
    T.MANIFESTO + CONFIG.REVEAL_DUR
  ) + 40;

  // ─── Tiny helpers ───────────────────────────────────────────────────────────
  const root  = document.documentElement;
  const $      = (sel) => document.querySelector(sel);
  const delay  = (ms) => new Promise((res) => setTimeout(res, ms));
  const now    = () => performance.now();

  const state  = { going: false, done: false };
  const timers = [];
  const after  = (ms, fn) => timers.push(setTimeout(fn, ms));

  let overlay = null;
  let heroEls = [];  // [logo, line1, line2, manifesto, nav] — resolved at run time

  // ─── Decide what to do ───────────────────────────────────────────────────────
  function init() {
    // Repeat visit this session → skip entirely, hero appears as normal.
    if (sessionStorage.getItem(CONFIG.SS_KEY)) {
      root.classList.remove('bosco-loading');
      return;
    }
    try { sessionStorage.setItem(CONFIG.SS_KEY, '1'); } catch (e) { /* private mode */ }

    heroEls = [
      $('.hero__logo'),
      ...document.querySelectorAll('#default-view .hero__line'),
      $('#default-view .hero__manifesto'),
      $('#default-view .answer-nav'),
    ].filter(Boolean);

    root.classList.remove('bosco-loading');
    root.classList.add('bosco-intro');

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      runReduced();
    } else {
      runFull();
    }
  }

  // ─── Reduced motion: no choreography, just a gentle fade + static mascot ─────
  function runReduced() {
    const logo = $('.hero__logo');
    if (logo) logo.src = CONFIG.STATIC_MASCOT;  // freeze the walk-cycle

    requestAnimationFrame(() => {
      heroEls.forEach((el) => {
        el.style.transition = `opacity ${CONFIG.REDUCED_MS}ms ease`;
        el.style.transform  = 'none';
        el.style.opacity    = '1';
      });
      after(CONFIG.REDUCED_MS + 40, complete);
    });
  }

  // ─── Full intro ──────────────────────────────────────────────────────────────
  function runFull() {
    buildOverlay();
    startCounter();
    addDismiss();

    const start = now();
    Promise.race([
      Promise.all([preloadFonts(), preloadImages(CONFIG.HERO_ASSETS)]),
      delay(CONFIG.MAX_MS),
    ])
      .then(() => delay(Math.max(0, CONFIG.MIN_MS - (now() - start)))) // honour MIN
      .then(go);
  }

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'loader';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<img class="loader__mascot" src="' + CONFIG.MASCOT + '" alt="">' +
      '<p class="loader__count">[ <b>0</b> ]</p>';
    document.body.appendChild(overlay);
  }

  function startCounter() {
    const el = overlay && overlay.querySelector('.loader__count b');
    if (!el) return;
    const t0 = now();
    (function tick() {
      if (state.done) return;
      const p = Math.min(1, (now() - t0) / CONFIG.MIN_MS);
      el.textContent = Math.round(p * 100);
      if (p < 1) requestAnimationFrame(tick);
    })();
  }

  // ─── GO: hand off the mascot, then bring the page in around it ───────────────
  function go() {
    if (state.done || state.going) return;
    state.going = true;

    flipMascot();

    // Counter fades out as the flight starts.
    after(T.COUNT_OUT, () => {
      const c = overlay && overlay.querySelector('.loader__count');
      if (c) {
        c.style.transition = `opacity ${CONFIG.COUNT_OUT_MS}ms ease`;
        c.style.opacity = '0';
      }
    });

    // Overlay dissolves into the page background; page becomes usable.
    after(T.BG_FADE, () => {
      if (!overlay) return;
      overlay.style.transition = `background-color ${CONFIG.BG_FADE_MS}ms ease`;
      overlay.style.backgroundColor = 'transparent';
      overlay.style.pointerEvents = 'none';
    });

    // Wordmark rises line-by-line, then copy + nav.
    const [logo, line1, line2, manifesto, nav] = heroEls;
    after(T.LINE1,     () => rise(line1));
    after(T.LINE2,     () => rise(line2));
    after(T.NAV,       () => rise(nav));
    after(T.MANIFESTO, () => rise(manifesto));

    // Hand-off done: swap the loader mascot for the real hero logo + tear down.
    after(T.CLEANUP, complete);
  }

  // FLIP: transform the loader mascot from its centred state into the hero rect.
  function flipMascot() {
    const mascot = overlay && overlay.querySelector('.loader__mascot');
    const logo   = $('.hero__logo');
    if (!mascot || !logo) return;

    const a = mascot.getBoundingClientRect();        // centred, ~160px
    const b = logo.getBoundingClientRect();          // final hero spot (opacity:0 but laid out)
    const scale = b.width / a.width;
    const dx = (b.left + b.width  / 2) - (a.left + a.width  / 2);
    const dy = (b.top  + b.height / 2) - (a.top  + a.height / 2);

    mascot.style.transition = `transform ${CONFIG.HANDOFF_MS}ms ${CONFIG.HANDOFF_EASE}`;
    requestAnimationFrame(() => {
      mascot.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    });
  }

  // Soft rise + fade for a single element.
  function rise(el) {
    if (!el || state.done) return;
    el.style.transition = `opacity ${CONFIG.REVEAL_DUR}ms ${CONFIG.REVEAL_EASE}, ` +
                          `transform ${CONFIG.REVEAL_DUR}ms ${CONFIG.REVEAL_EASE}`;
    requestAnimationFrame(() => {
      if (state.done) return; // an early dismiss may have cleaned up between frames
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  // ─── Finish — single funnel for both graceful end and early dismiss ──────────
  // Idempotent. Drops the hidden-state classes + inline styles so every element
  // lands at its natural, fully-visible state with no broken half-states, and
  // removes the overlay (revealing the identical hero logo underneath = a
  // frame-perfect swap of the one mascot).
  function complete() {
    if (state.done) return;
    state.done = true;

    timers.forEach(clearTimeout);
    removeDismiss();

    heroEls.forEach((el) => {
      el.style.transition = '';
      el.style.transform  = '';
      el.style.opacity     = '';
      el.style.willChange  = '';
    });
    root.classList.remove('bosco-intro');

    if (overlay) { overlay.remove(); overlay = null; }
  }

  // ─── Early dismiss ────────────────────────────────────────────────────────────
  // Genuine user intent only. 'scroll' is deliberately excluded — browsers fire it
  // on reload via scroll-position restoration, which would dismiss before we play.
  // 'wheel' / 'touchstart' capture the same intent without that false trigger.
  const DISMISS_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  function onDismiss() { complete(); }
  function addDismiss() {
    DISMISS_EVENTS.forEach((ev) =>
      window.addEventListener(ev, onDismiss, { passive: true, once: true })
    );
  }
  function removeDismiss() {
    DISMISS_EVENTS.forEach((ev) => window.removeEventListener(ev, onDismiss));
  }

  // ─── Preloading ───────────────────────────────────────────────────────────────
  function preloadFonts() {
    if (!document.fonts || !document.fonts.ready) return Promise.resolve();
    try {
      document.fonts.load('700 9rem Akshar');
      document.fonts.load('400 1rem "Instrument Sans"');
      document.fonts.load('400 0.8rem "JetBrains Mono"');
    } catch (e) { /* non-fatal */ }
    return document.fonts.ready;
  }
  function preloadImages(srcs) {
    return Promise.all(srcs.map((src) => new Promise((res) => {
      const img = new Image();
      img.onload = img.onerror = () => res();
      img.src = src;
    })));
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────────
  // This script tag sits after every view in the body, so the hero DOM is already
  // parsed — run synchronously (and crucially BEFORE main.js's initDefaultReveal,
  // so .bosco-intro is set and main.js hands the hero reveal to us). The only
  // fallback is the unlikely case of a missing <body>.
  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
