// ─── State ──────────────────────────────────────────────────────────────────

const defaultView   = document.getElementById('default-view');
const answerView    = document.getElementById('answer-view');
const percheView    = document.getElementById('perche-view');
const percheContent = document.getElementById('perche-content');
const resultsEl     = document.getElementById('results');
const noResultsEl  = document.getElementById('no-results');
const searchInput  = document.getElementById('search-input');
const searchBtn    = document.getElementById('search-btn');
const searchInputAnswer = document.getElementById('search-input-answer');
const searchBtnAnswer   = document.getElementById('search-btn-answer');

// ─── Search logic ────────────────────────────────────────────────────────────

function normalise(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

function wordsOf(str) {
  return str.split(/\s+/).filter(Boolean);
}

// Returns true if every word in `needle` appears as a whole word in `haystack`
function wordMatch(haystack, needle) {
  const haystackWords = wordsOf(haystack);
  const needleWords = wordsOf(needle);
  if (needleWords.length === 0) return false;
  return needleWords.every(nw => haystackWords.some(hw => hw === nw));
}

// Returns true if the query matches an altFor entry (or vice versa)
// Uses whole-word logic to avoid "x" matching inside "netflix"
function altForMatch(altFor, q) {
  return altFor.some(alt => {
    const normAlt = normalise(alt);
    // The altFor entry matches the query (e.g. "google chrome" matches "google chrome")
    if (wordMatch(normAlt, q)) return true;
    // The query matches the altFor entry (handles partial queries like "chrome" matching "google chrome")
    if (wordMatch(q, normAlt)) return true;
    return false;
  });
}

function findMatches(query) {
  const q = normalise(query);
  if (!q) return [];

  return DIRECTORY.filter(item => {
    // Match against what this tool replaces (whole-word only)
    if (altForMatch(item.altFor, q)) return true;
    // Match against tool name
    if (normalise(item.name).includes(q)) return true;
    // Match against category
    if (normalise(item.categoryLabel).includes(q)) return true;
    return false;
  });
}

// ─── Card rendering ──────────────────────────────────────────────────────────

function renderParagraphs(text) {
  if (!text) return '';
  return text
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p class="card__text">${p.trim()}</p>`)
    .join('');
}

function renderCard(item) {
  const caveatHtml = item.caveat
    ? `<div class="card__caveat"><p class="card__text"><strong class="card__inline-label">Occhio a:</strong> ${item.caveat}</p></div>`
    : '';

  const businessHtml = item.businessModel
    ? `<p class="card__text"><strong class="card__inline-label">Modello di business:</strong> ${item.businessModel}</p>`
    : '';

  return `
    <article class="card">
      <div class="card__body">
        <div class="card__namerow">
          <h2 class="card__name">${item.name.toUpperCase()}</h2>
          <span class="card__country">${item.country}</span>
        </div>
        <p class="card__text"><strong class="card__inline-label">Perché ci piace:</strong> ${item.description.split('\n\n')[0]}</p>
        <div class="card__more">
          ${renderParagraphs(item.description.split('\n\n').slice(1).join('\n\n'))}
          ${businessHtml}
          ${caveatHtml}
          <a href="${item.url}" class="card__link" target="_blank" rel="noopener">
            <img src="assets/external-link-icon.svg" alt="" class="card__link-icon">${item.url.replace(/^https?:\/\//, '')}
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderCategoryGroup(categoryId, items, bubbleHtml = '') {
  const meta = CATEGORY_META[categoryId];
  if (!meta) return '';

  const cardsHtml = items.map(renderCard).join('');

  return `
    <section class="category">
      <div class="category__inner">
        ${bubbleHtml}
        <header class="category__header">
          <p class="category__meta"><span class="category__label">Alternativa a:</span> ${meta.altFor}</p>
          <p class="category__meta"><span class="category__label">Perché cambiare:</span> ${meta.percheCambiare}</p>
          <p class="category__updated">Aggiornato: ${meta.updated}</p>
        </header>
        <div class="category__cards">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;
}

// ─── Show answer view ────────────────────────────────────────────────────────

function showResults(query) {
  const matches = findMatches(query);

  // Switch views
  defaultView.hidden = true;
  answerView.hidden = false;

  // Clear standalone bubble area (bubble now lives inside category__inner)
  const bubbleArea = document.getElementById('chat-bubble-area');
  if (bubbleArea) bubbleArea.innerHTML = '';

  // Scroll to top
  window.scrollTo(0, 0);

  if (matches.length === 0) {
    resultsEl.innerHTML = '';
    noResultsEl.hidden = false;
    return;
  }

  noResultsEl.hidden = true;

  // Group by category, preserving order
  const grouped = {};
  matches.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  const bubbleHtml = `<div class="chat-bubble">Cerco un'alternativa a ${query}</div>`;

  resultsEl.innerHTML = Object.entries(grouped)
    .map(([cat, items], i) => renderCategoryGroup(cat, items, i === 0 ? bubbleHtml : ''))
    .join('');

  // Staggered reveal for headers and cards
  resultsEl.querySelectorAll('.category__header').forEach(el => {
    el.classList.add('reveal');
  });
  resultsEl.querySelectorAll('.card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${60 + i * 70}ms`;
  });
  observeReveal(resultsEl);

}

// ─── Close / reset ───────────────────────────────────────────────────────────

function resetToDefault() {
  answerView.hidden = true;
  percheView.hidden = true;
  defaultView.hidden = false;
  searchInput.value = '';
  searchInputAnswer.value = '';
  resultsEl.innerHTML = '';
  noResultsEl.hidden = true;
  const bubbleArea = document.getElementById('chat-bubble-area');
  if (bubbleArea) bubbleArea.innerHTML = '';
  window.scrollTo(0, 0);
}


// ─── Perchè view ─────────────────────────────────────────────────────────────

function renderPerche() {
  percheContent.innerHTML = ANSWERS.map((entry, i) => {
    const paragraphs = entry.body
      .split('\n\n')
      .filter(p => p.trim())
      .map(p => `<p class="perche-entry__p">${p.trim()}</p>`)
      .join('');
    return `
      <article class="perche-entry reveal" style="transition-delay: ${i * 100}ms">
        <h2 class="perche-entry__title">${entry.title}</h2>
        <div class="perche-entry__body">${paragraphs}</div>
      </article>
    `;
  }).join('');
  observeReveal(percheContent);
}

function showPerche() {
  defaultView.hidden = true;
  answerView.hidden = true;
  percheView.hidden = false;
  renderPerche();
  window.scrollTo(0, 0);
}


// ─── Chi siamo toggle ────────────────────────────────────────────────────────

function bindChiSiamo() {
  document.querySelectorAll('.footer__chi-siamo-toggle').forEach(toggle => {
    const col  = toggle.closest('.footer__col--left');
    const body = col ? col.querySelector('.footer__chi-siamo-body') : null;
    if (!body) return;
    toggle.addEventListener('click', () => {
      body.hidden = !body.hidden;
      toggle.setAttribute('aria-expanded', String(!body.hidden));
    });
  });
}

// ─── Events ──────────────────────────────────────────────────────────────────

function handleSearch(inputEl) {
  const q = inputEl.value.trim();
  if (q) showResults(q);
}

// Default view search
searchBtn.addEventListener('click', () => handleSearch(searchInput));
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch(searchInput);
});

// Answer view search (re-search from answer state)
searchBtnAnswer.addEventListener('click', () => handleSearch(searchInputAnswer));
searchInputAnswer.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch(searchInputAnswer);
});

// Ripple on both search buttons
function spawnRipple(btn, e) {
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.left = `${e.clientX - rect.left}px`;
  ripple.style.top  = `${e.clientY - rect.top}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

document.getElementById('search-btn').addEventListener('mousedown', e => spawnRipple(e.currentTarget, e));
searchBtnAnswer.addEventListener('mousedown', e => spawnRipple(e.currentTarget, e));

// Site nav — always goes back to default
document.getElementById('nav-home').addEventListener('click', e => {
  e.preventDefault();
  resetToDefault();
});

document.getElementById('nav-home-default').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo(0, 0);
});

document.getElementById('nav-home-perche').addEventListener('click', e => {
  e.preventDefault();
  resetToDefault();
});

// Perchè nav buttons
document.getElementById('nav-perche-default').addEventListener('click', showPerche);
document.getElementById('nav-perche-answer').addEventListener('click', showPerche);
document.getElementById('nav-close-perche').addEventListener('click', resetToDefault);

// Chips — works in both views
document.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  const query = chip.dataset.query;
  showResults(query);
});

// ─── Reveal animations ───────────────────────────────────────────────────────

function observeReveal(root) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  root.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

function initDefaultReveal() {
  // When the intro loader is playing it owns the hero reveal (logo + wordmark +
  // manifesto); we only set up the below-the-fold items here to avoid a clash.
  const introActive = document.documentElement.classList.contains('bosco-intro');

  const heroTargets = introActive ? [] : [
    document.querySelector('.hero__logo'),
    document.querySelector('.hero__title'),
    document.querySelector('.hero__manifesto'),
  ];
  const belowTargets = [
    document.querySelector('.search-box'),
    document.querySelector('.chips'),
  ];

  [...heroTargets, ...belowTargets].forEach((el, i) => {
    if (!el) return;
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 80}ms`;
  });
  observeReveal(document.getElementById('default-view'));
}

// ─── Init ────────────────────────────────────────────────────────────────────

bindChiSiamo();
initDefaultReveal();
