#!/usr/bin/env node
/* ============================================================
   ilBosco — articoli card generator (zero dependencies)

   Reads articoli.json (source of truth) and produces the <li> card markup
   for the Articoli carousel.

     node articoli/generate.js           → print cards to stdout
     node articoli/generate.js --write   → replace the block in index.html

   The block in index.html is delimited by:
     <!-- BEGIN articoli (...) -->  ...  <!-- END articoli -->
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'articoli.json');
const HTML_PATH = path.join(ROOT, 'index.html');
const IMAGES_DIR = 'articoli/images';            // image files live here
const IMG_EXTS = ['webp', 'jpg', 'jpeg', 'png']; // preference order
const MAX_ITEMS = 10;

// Resolve an article's image: an explicit `immagine` in the JSON wins; otherwise
// look for a file named after the article id (the convention) in articoli/images/.
// Returns a web path or null (→ branded placeholder).
function resolveImage(item) {
  if (item.immagine) return item.immagine;
  for (const ext of IMG_EXTS) {
    const rel = `${IMAGES_DIR}/${item.id}.${ext}`;
    if (fs.existsSync(path.join(ROOT, rel))) return rel;
  }
  return null;
}

const MONTHS_IT = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

// ISO 8601 (YYYY-MM-DD) → "3 giugno 2026"
function formatDateIt(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '').trim());
  if (!m) return String(iso || '');
  const [, y, mo, d] = m;
  return `${parseInt(d, 10)} ${MONTHS_IT[parseInt(mo, 10) - 1]} ${y}`;
}

// Minimal HTML-escaping for text injected into markup.
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mediaMarkup(item) {
  const src = resolveImage(item);
  if (src) {
    // alt="" because the image sits inside a link already labelled by the headline
    // (aria-label), so it's decorative for screen readers; a custom alt can be set
    // via the article's `alt` field if desired.
    return `<img class="articolo-card__media" src="${esc(src)}" alt="${esc(item.alt)}" loading="lazy" width="600" height="360">`;
  }
  return `<div class="articolo-card__media articolo-card__media--placeholder"></div>`;
}

function cardMarkup(item) {
  const url = esc(item.url);
  // The image IS the link. It has no text, so it carries the headline as its
  // accessible name (aria-label). The headline below is plain text.
  return `          <li class="articolo-card">
            <a class="articolo-card__media-link" href="${url}" target="_blank" rel="noopener" aria-label="${esc(item.titolo)}">
              ${mediaMarkup(item)}
            </a>
            <div class="articolo-card__body">
              <p class="articolo-card__testata">${esc(item.testata)}</p>
              <h3 class="articolo-card__titolo">${esc(item.titolo)}</h3>
              <p class="articolo-card__data"><time datetime="${esc(item.data)}">${esc(formatDateIt(item.data))}</time></p>
              <p class="articolo-card__commento">${esc(item.commento)}</p>
            </div>
          </li>`;
}

function buildBlock() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  let items = Array.isArray(data.articoli) ? data.articoli : [];
  // Newest first by `data`, then cap at MAX_ITEMS.
  items = items.slice().sort((a, b) => String(b.data).localeCompare(String(a.data)));
  if (items.length > MAX_ITEMS) {
    console.error(`Note: ${items.length} items; keeping the newest ${MAX_ITEMS}, dropping ${items.length - MAX_ITEMS}.`);
    items = items.slice(0, MAX_ITEMS);
  }
  return items.map(cardMarkup).join('\n\n');
}

function writeIntoHtml(cards) {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const begin = /<!-- BEGIN articoli[^>]*-->/;
  const end = '<!-- END articoli -->';
  const bm = begin.exec(html);
  const ei = html.indexOf(end);
  if (!bm || ei === -1) {
    throw new Error('Could not find the BEGIN/END articoli markers in index.html');
  }
  const before = html.slice(0, bm.index + bm[0].length);
  const after = html.slice(ei);
  const next = `${before}\n${cards}\n          ${after}`;
  fs.writeFileSync(HTML_PATH, next);
  console.error('index.html updated.');
}

const cards = buildBlock();
if (process.argv.includes('--write')) {
  writeIntoHtml(cards);
} else {
  process.stdout.write(cards + '\n');
}
