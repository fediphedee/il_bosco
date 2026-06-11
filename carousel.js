/* ============================================================
   ilBosco — ARTICOLI CAROUSEL (progressive enhancement)

   WITHOUT this script the section already works: the cards are a native
   horizontally-scrollable, scroll-snapping row (see .articoli__track in CSS).
   This script only ENHANCES that:
     • seamless infinite loop  (clones the set on both sides; resets scrollLeft
       at the midpoints, where clone and original pixels are identical)
     • thin prev/next arrows (real <button>s, ≥768px)
     • mouse drag-to-scroll on desktop (touch already scrolls natively)
   ============================================================ */
(function () {
  'use strict';

  const section  = document.querySelector('.articoli');
  if (!section) return;
  const track    = section.querySelector('.articoli__track');
  const prevBtn  = section.querySelector('.articoli__arrow--prev');
  const nextBtn  = section.querySelector('.articoli__arrow--next');
  if (!track) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const originals = Array.from(track.children);
  if (originals.length === 0) return;

  // ─── Geometry helpers ────────────────────────────────────────────────────────
  const gapPx = () => parseFloat(getComputedStyle(track).columnGap || '0') || 0;
  const cardStep = () => {
    const card = track.querySelector('.articolo-card');
    return card ? card.getBoundingClientRect().width + gapPx() : 0;
  };
  // Width of one full set of original cards (clones are identical width).
  const setWidth = () => originals.length * cardStep();

  // ─── Build the infinite loop: clone the set before AND after the originals ───
  // Layout becomes [cloneSet A][originals B][cloneSet C]. We park the viewport on
  // B and, whenever scrollLeft drifts a half-set away from B's centre, snap it
  // back by exactly one set width — invisible because the pixels are identical.
  function buildClones() {
    const before = document.createDocumentFragment();
    const after  = document.createDocumentFragment();
    originals.forEach((node) => {
      [before, after].forEach((frag) => {
        const clone = node.cloneNode(true);
        clone.classList.add('is-clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.inert = true; // keep clones out of focus order (and AT)
        // Fallback for browsers without `inert`: defang focusable descendants.
        clone.querySelectorAll('a, button').forEach((el) => { el.tabIndex = -1; });
        frag.appendChild(clone);
      });
    });
    track.insertBefore(before, originals[0]);
    track.appendChild(after);
  }

  // Park scrollLeft at the start of the middle (original) set.
  function recentre() {
    track.scrollLeft = setWidth();
  }

  // Keep scrollLeft within [0.5·set, 1.5·set] by jumping a whole set when it strays.
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sw = setWidth();
      if (sw > 0) {
        if (track.scrollLeft < sw * 0.5)      track.scrollLeft += sw;
        else if (track.scrollLeft > sw * 1.5) track.scrollLeft -= sw;
      }
      ticking = false;
    });
  }

  // ─── Arrow controls ──────────────────────────────────────────────────────────
  function nudge(dir) {
    track.scrollBy({ left: dir * cardStep(), behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  if (prevBtn) prevBtn.addEventListener('click', () => nudge(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => nudge(1));

  // ─── Mouse drag-to-scroll (desktop nicety; touch scrolls natively) ───────────
  const DRAG_THRESHOLD = 5; // px before a press counts as a drag (not a click)
  let dragging = false, captured = false, pointerId = null, startX = 0, startLeft = 0, moved = false;

  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return; // let touch use native scrolling
    dragging = true;
    moved = false;
    captured = false;
    pointerId = e.pointerId;
    startX = e.clientX;
    startLeft = track.scrollLeft;
    // NB: do NOT capture the pointer here — that would redirect the click away
    // from the card link so it never opens. We only capture once a real drag starts.
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > DRAG_THRESHOLD) {
      moved = true;
      track.classList.add('is-dragging'); // suspends scroll-snap while dragging
      try { track.setPointerCapture(pointerId); captured = true; } catch (_) {}
    }
    if (moved) track.scrollLeft = startLeft - dx;
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    if (captured) { try { track.releasePointerCapture(pointerId); } catch (_) {} captured = false; }
    track.classList.remove('is-dragging'); // re-enables scroll-snap → snaps to nearest
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  // If the press turned into a drag, swallow the click so the link doesn't open.
  // A plain click (no drag) passes through and opens the article in a new tab.
  track.addEventListener('click', (e) => {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);

  // ─── Re-centre on resize (card width changes → set width changes) ────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(recentre, 150);
  });

  // ─── Init ─────────────────────────────────────────────────────────────────────
  buildClones();
  section.classList.add('is-enhanced'); // reveals arrows (≥768px) + hides scrollbar
  // Wait one frame so layout is settled before measuring/parking.
  requestAnimationFrame(() => {
    recentre();
    track.addEventListener('scroll', onScroll, { passive: true });
  });
})();
