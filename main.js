// ─── State ──────────────────────────────────────────────────────────────────

const defaultView  = document.getElementById('default-view');
const answerView   = document.getElementById('answer-view');
const resultsEl    = document.getElementById('results');
const noResultsEl  = document.getElementById('no-results');
const searchInput  = document.getElementById('search-input');
const searchBtn    = document.getElementById('search-btn');
const searchInputAnswer = document.getElementById('search-input-answer');
const searchBtnAnswer   = document.getElementById('search-btn-answer');
const closeBtn     = document.getElementById('close-btn');

// ─── Search logic ────────────────────────────────────────────────────────────

function normalise(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

function findMatches(query) {
  const q = normalise(query);
  if (!q) return [];

  return DIRECTORY.filter(item => {
    // Match against what this tool replaces
    if (item.altFor.some(alt => normalise(alt).includes(q) || q.includes(normalise(alt)))) return true;
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
      <div class="card__topbar"></div>
      <div class="card__body">
        <div class="card__namerow">
          <h2 class="card__name">${item.name.toUpperCase()}</h2>
          <span class="card__country">${item.country}</span>
        </div>
        <a href="${item.url}" class="card__link" target="_blank" rel="noopener">
          <img src="assets/external-link-icon.svg" alt="" class="card__link-icon">${item.url.replace(/^https?:\/\//, '')}
        </a>
        <p class="card__text"><strong class="card__inline-label">Perché ci piace:</strong> ${item.description.split('\n\n')[0]}</p>
        <div class="card__more" hidden>
          ${renderParagraphs(item.description.split('\n\n').slice(1).join('\n\n'))}
          ${businessHtml}
          ${caveatHtml}
        </div>
        <button class="card__toggle" aria-expanded="false">Dimmi di più</button>
      </div>
    </article>
  `;
}

function renderCategoryGroup(categoryId, items) {
  const meta = CATEGORY_META[categoryId];
  if (!meta) return '';

  const cardsHtml = items.map(renderCard).join('');

  return `
    <section class="category">
      <div class="category__inner">
        <header class="category__header">
          <h2 class="category__title">${meta.label}</h2>
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

  // Sync query to answer input
  searchInputAnswer.value = query;

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

  resultsEl.innerHTML = Object.entries(grouped)
    .map(([cat, items]) => renderCategoryGroup(cat, items))
    .join('');

  // Bind expand toggles on freshly rendered cards
  bindToggles(resultsEl);
}

// ─── Close / reset ───────────────────────────────────────────────────────────

function resetToDefault() {
  answerView.hidden = true;
  defaultView.hidden = false;
  searchInput.value = '';
  searchInputAnswer.value = '';
  resultsEl.innerHTML = '';
  noResultsEl.hidden = true;
  window.scrollTo(0, 0);
}

// ─── Card expand/collapse ────────────────────────────────────────────────────

function bindToggles(root) {
  root.querySelectorAll('.card__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const more = btn.previousElementSibling;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        more.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = 'Dimmi di più';
      } else {
        more.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = 'Meno';
      }
    });
  });
}

// ─── Chi siamo toggle ────────────────────────────────────────────────────────

function bindChiSiamo() {
  const toggle = document.querySelector('.footer__chi-siamo-toggle');
  const body   = document.querySelector('.footer__chi-siamo-body');
  const closeC = document.querySelector('.footer__chi-siamo-close');

  if (!toggle || !body) return;

  toggle.addEventListener('click', () => {
    body.hidden = !body.hidden;
    toggle.setAttribute('aria-expanded', String(!body.hidden));
  });

  if (closeC) {
    closeC.addEventListener('click', () => {
      body.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });
  }
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

// Close button
closeBtn.addEventListener('click', resetToDefault);

// Chips — works in both views
document.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  const query = chip.dataset.query;
  showResults(query);
});

// ─── Init ────────────────────────────────────────────────────────────────────

bindChiSiamo();
