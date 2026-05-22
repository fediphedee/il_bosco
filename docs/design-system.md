# ilBosco — Design System

> Single-file reference for all design tokens, components, and interaction patterns. Stack: vanilla HTML + CSS + JS, no build step.

---

## Table of Contents

1. [Design Tokens](#design-tokens)
   - [Colours](#colours)
   - [Typography](#typography)
   - [Spacing](#spacing)
   - [Layout](#layout)
   - [Transitions](#transitions)
2. [Components](#components)
   - [Navigation](#navigation)
   - [Chip](#chip)
   - [Search Box](#search-box)
   - [Chat Bubble](#chat-bubble)
   - [Card](#card)
   - [Category Section](#category-section)
   - [Perchè Entry](#perchè-entry)
   - [Footer](#footer)
3. [Animations](#animations)
4. [Views & State](#views--state)

---

## Design Tokens

All tokens are CSS custom properties defined on `:root` in `style.css`. Always use these variables — never hardcode raw values.

### Colours

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#044237` | Page background (dark green) |
| `--color-heading` | `#3FEE9A` | Display headings, chip borders, accents |
| `--color-body` | `#E9EBE6` | Body text, nav labels |
| `--color-card-bg` | `#E9EBE6` | Card background (same as body) |
| `--color-card-text` | `#044237` | Text on light card backgrounds |
| `--color-chip-bg` | `#FB7FE0` | Chip fill, search button background |
| `--color-chip-bg-hover` | `#F060CC` | Chip / search button hover |
| `--color-chip-text` | `#59002F` | Text on chip background |
| `--color-footer-bg` | `#59002F` | Footer background (deep burgundy) |
| `--color-footer-text` | `#FB7FE0` | Footer text and links |
| `--color-nav-border` | `#FB7FE0` | Nav link colour (`.nav`) |
| `--color-card-decoration` | `#044237` | Card decorative elements |

**Palette at a glance:**

```
Background  #044237  ████  Dark green
Heading     #3FEE9A  ████  Mint green
Body text   #E9EBE6  ████  Off-white
Accent      #FB7FE0  ████  Pink
Footer bg   #59002F  ████  Burgundy
```

---

### Typography

Three typefaces, loaded as local variable fonts via `@font-face`.

| Token | Family | Use |
|---|---|---|
| `--font-display` | Akshar (variable, 100–900) | Hero titles, card names, category headings, perchè headings |
| `--font-body` | Instrument Sans (variable, 100–900, incl. italic) | Body copy, card text, footer prose |
| `--font-mono` | JetBrains Mono (400 only) | Chips, nav labels, footer metadata |

| Token | Value |
|---|---|
| `--fw-regular` | `400` |
| `--fw-bold` | `700` |

**Type scale quick-reference:**

| Element | Font | Size | Weight | Line-height |
|---|---|---|---|---|
| Hero title | Akshar | `clamp(3.6rem, 14.4vw, 9rem)` | 700 | 1 |
| Category title | Akshar | `clamp(2.6rem, 10.4vw, 4.55rem)` | 700 | 1 |
| Card name | Akshar | `3.125rem` | 700 | 1 |
| Perchè heading | Akshar | `clamp(2.25rem, 9vw, 3.125rem)` | 700 | 1 |
| Body / manifesto | Instrument Sans | `1rem` | 400 | 1.65 |
| Card body text | Instrument Sans | `0.875rem` | 400 | 1.43 |
| Chat bubble | Instrument Sans | `0.9375rem` | 400 | 1.5 |
| Chip label | JetBrains Mono | `0.75rem` | 400 | 1 |
| Nav label | JetBrains Mono | `0.75rem` | 400 | 1 |
| Footer mono | JetBrains Mono | `0.75rem` | 400 | 1.43–1.6 |

---

### Spacing

8-point scale with named steps.

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | `4px` | Tight gaps (icon + label) |
| `--space-sm` | `8px` | Small internal gaps |
| `--space-md` | `16px` | Default component gap |
| `--space-lg` | `24px` | Section-level gaps |
| `--space-xl` | `40px` | Large section padding |
| `--space-2xl` | `64px` | Hero / view top padding |
| `--space-3xl` | `96px` | Between perchè entries |

---

### Layout

| Token | Mobile | Tablet (≥768px) | Desktop (≥1200px) |
|---|---|---|---|
| `--nav-height` | `64px` | `72px` | `72px` |
| `--gutter` | `16px` | `48px` | `64px` |
| `--max-width` | `1200px` | `1200px` | `1200px` |

Content column max-widths used in practice:

| Context | Max-width |
|---|---|
| Hero / search | `680px` |
| Category / results | `814px` |
| Perchè content | `680px` |

---

### Transitions

| Token | Value |
|---|---|
| `--ease` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| `--transition` | `300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` |

Use `var(--transition)` for `color`, `background-color`, `opacity`, `transform` on interactive elements. Use `var(--ease)` when specifying the easing function independently.

---

## Components

---

### Navigation

Sticky top bar present across all three views. Uses flex `space-between` to place the wordmark logo on the left and a contextual action on the right.

**Class:** `.answer-nav`

```html
<!-- Default view & Answer view: shows [→] Perchè? on the right -->
<div class="answer-nav">
  <a href="#" aria-label="Torna alla homepage">
    <img src="assets/nav-wordmark.svg" alt="ilBosco" class="answer-nav__logo">
  </a>
  <button class="answer-nav__perche">[→] Perchè?</button>
</div>

<!-- Perchè view: shows [X] on the right -->
<div class="answer-nav">
  <a href="#" aria-label="Torna alla homepage">
    <img src="assets/nav-wordmark.svg" alt="ilBosco" class="answer-nav__logo">
  </a>
  <button class="answer-nav__perche">[X]</button>
</div>
```

| Class | Role |
|---|---|
| `.answer-nav` | Container — sticky, full-width, `z-index: 200` |
| `.answer-nav__logo` | Wordmark SVG — `height: 13px`, scales width automatically |
| `.answer-nav__perche` | Right-side ghost button — JetBrains Mono 12px, `opacity: 0.65` on hover |

**Behaviour:**
- `[→] Perchè?` calls `showPerche()` — switches to the perchè view
- `[X]` calls `resetToDefault()` — always returns to homepage
- Wordmark `<a>` calls `resetToDefault()` (except on default-view where it scrolls to top)

---

### Chip

Pill-shaped suggestion button used to trigger a pre-set search query. Appears in a wrapping flex group (`.chips`).

**Classes:** `.chips` (group), `.chip` (individual)

```html
<div class="chips">
  <button class="chip" data-query="Gmail">Gmail</button>
  <button class="chip" data-query="Spotify">Spotify</button>
  <button class="chip" data-query="WhatsApp">WhatsApp</button>
</div>
```

| Class | Role |
|---|---|
| `.chips` | Flex wrap group — `gap: 8px`, centred |
| `.chip` | Individual pill button |
| `.chip--active` | Active/selected state (same visual as hover) |

**States:**

| State | Background | Text | Border |
|---|---|---|---|
| Default | Transparent | `--color-heading` | `1.5px solid --color-heading` |
| Hover / Active | `--color-heading` | `--color-bg` | `--color-heading` |

**Interaction:** Clicking any `.chip` reads `data-query` and calls `showResults(query)`. Uses event delegation — no per-chip listeners.

**Note:** `.chips` inside `.answer-query-bar` uses `padding-bottom: 16px` instead of the default `40px`.

---

### Search Box

Pill-shaped input + submit button. Two variants: the default homepage style and the sticky bottom bar variant used in the answer view.

**Classes:** `.search-box`, `.search-box--answer`

```html
<!-- Default (homepage) -->
<div class="search-box">
  <input
    type="text"
    class="search-box__input"
    placeholder="Cerco un'alternativa a…"
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
  >
  <button class="search-box__btn" aria-label="Cerca">
    <!-- arrow SVG -->
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</div>

<!-- Answer view variant (sticky bar) -->
<div class="search-box search-box--answer">
  ...same internals...
</div>
```

| Class | Role |
|---|---|
| `.search-box` | Pill container — transparent bg, `1px solid` border |
| `.search-box__input` | Flex-grow text input — inherits body font, no outline |
| `.search-box__btn` | Pink pill submit button — `min-height: 44px`, `min-width: 52px` |
| `.search-box--answer` | Modifier — subtler border (`rgba(body, 0.3)`) for the sticky bar |
| `.search-box--answer.is-disabled` | Disabled state — `opacity: 0.38`, `pointer-events: none` |

**Focus states:**

| State | Border | Shadow |
|---|---|---|
| Default | `rgba(body, 0.8)` | none |
| Hover (unfocused) | `rgba(body, 1)` | none |
| Focus-within | `--color-heading` | `0 0 0 3px rgba(#3FEE9A, 0.12)` |

**Button ripple:** On `mousedown`, a `.ripple` span is appended to `.search-box__btn` and removed after the `ripple-out` animation completes (`520ms`).

---

### Chat Bubble

Displays the user's search query as a chat message in the answer view. Right-aligned, animates in on render.

**Classes:** `.answer-query-bubble` (wrapper), `.chat-bubble`

```html
<div class="answer-query-bubble">
  <div class="chat-bubble">Cerco un'alternativa a Gmail</div>
</div>
```

| Class | Role |
|---|---|
| `.answer-query-bubble` | Right-aligned wrapper — `padding-top: --space-lg` |
| `.chat-bubble` | The bubble itself |

**Visual spec:**
- Background: `--color-heading` (mint green)
- Text: `--color-bg` (dark green)
- Border-radius: `20px 20px 4px 20px` — tail bottom-left, simulating a sent message
- Max-width: `85%`
- Animation: `bubble-in` — scale from 0.88 + translateY with a spring easing (`cubic-bezier(0.34, 1.4, 0.64, 1)`)

---

### Card

Displays a single tool / alternative. Cards are always rendered inside a [Category Section](#category-section).

**Class:** `.card`

```html
<article class="card">
  <div class="card__body">
    <div class="card__namerow">
      <h2 class="card__name">PROTON MAIL</h2>
      <span class="card__country">🇨🇭 Svizzera</span>
    </div>
    <p class="card__text">
      <strong class="card__inline-label">Perché ci piace:</strong>
      Prima descrizione breve del tool.
    </p>
    <div class="card__more">
      <!-- additional paragraphs -->
      <p class="card__text">
        <strong class="card__inline-label">Modello di business:</strong>
        Freemium con piani a pagamento.
      </p>
      <!-- optional caveat -->
      <div class="card__caveat">
        <p class="card__text">
          <strong class="card__inline-label">Occhio a:</strong>
          Nota importante sull'uso.
        </p>
      </div>
      <a href="https://proton.me" class="card__link" target="_blank" rel="noopener">
        <img src="assets/external-link-icon.svg" alt="" class="card__link-icon">
        proton.me
      </a>
    </div>
  </div>
</article>
```

| Class | Role |
|---|---|
| `.card` | Wrapper — no background, transparent |
| `.card__body` | Flex column with `--space-md` gap, `--space-md` padding top/bottom |
| `.card__namerow` | `space-between` row for name + country badge |
| `.card__name` | Tool name — Akshar Bold `3.125rem`, `letter-spacing: -0.04em` |
| `.card__country` | Pink pill badge — `--color-chip-bg` bg, `--color-chip-text` text |
| `.card__text` | Body paragraph — Instrument Sans `0.875rem`, line-height `1.43` |
| `.card__inline-label` | Bold label prefix within a `.card__text` |
| `.card__more` | Flex column for secondary content |
| `.card__caveat` | Warning wrapper — `margin-top: --space-xs` |
| `.card__link` | External link — underlined, flex row with icon |
| `.card__link-icon` | `20×20px` icon, `filter: brightness(0) invert(1)` to render white |

Cards are generated from `data.js` by `renderCard(item)` in `main.js`.

---

### Category Section

Groups one or more [Cards](#card) under a shared header (what the tool replaces, why to switch, last-updated date).

**Class:** `.category`

```html
<section class="category">
  <div class="category__inner">
    <header class="category__header">
      <p class="category__meta">
        <span class="category__label">Alternativa a:</span> Gmail
      </p>
      <p class="category__meta">
        <span class="category__label">Perché cambiare:</span>
        Motivazione breve.
      </p>
      <p class="category__updated">Aggiornato: Gennaio 2026</p>
    </header>
    <div class="category__cards">
      <!-- one or more .card -->
    </div>
  </div>
</section>
```

| Class | Role |
|---|---|
| `.category` | Outer section — `padding: 32px --gutter` |
| `.category__inner` | Max-width `814px`, centred |
| `.category__header` | Metadata block — `margin-bottom: --space-xl` |
| `.category__meta` | Info row — Instrument Sans `0.9375rem` |
| `.category__label` | Bold prefix within `.category__meta` |
| `.category__updated` | Timestamp — JetBrains Mono `0.75rem`, uppercase, `opacity: 0.55` |
| `.category__cards` | Flex column of cards — `gap: --space-lg` |

Category metadata lives in `CATEGORY_META` (in `data.js`) keyed by category ID.

---

### Perchè Entry

Renders a single Q&A entry from `answers.js` in the Perchè view. All entries are rendered together in `.perche-content`.

**Classes:** `.perche-content` (wrapper), `.perche-entry` (individual entry)

```html
<main class="perche-content">
  <article class="perche-entry">
    <h2 class="perche-entry__title">Perché ilbosco?</h2>
    <div class="perche-entry__body">
      <p class="perche-entry__p">Primo paragrafo del corpo.</p>
      <p class="perche-entry__p">Secondo paragrafo, se presente.</p>
    </div>
  </article>

  <!-- additional entries... -->
</main>
```

| Class | Role |
|---|---|
| `.perche-content` | Flex column — `gap: --space-3xl` between entries, max-width `680px` |
| `.perche-entry` | Individual Q&A block — also receives `.reveal` for scroll animation |
| `.perche-entry__title` | Question heading — Akshar Bold, `clamp(2.25rem, 9vw, 3.125rem)`, `--color-heading` |
| `.perche-entry__body` | Flex column of paragraphs — `gap: --space-md` |
| `.perche-entry__p` | Body paragraph — Instrument Sans `1rem`, line-height `1.65`, `letter-spacing: 0.02em` |

**Content source:** `ANSWERS` array in `answers.js`. Each entry has `id`, `title`, and `body` (use `\n\n` as paragraph separator). Rendered by `renderPerche()` in `main.js`.

**Stagger:** Each `.perche-entry` receives `transition-delay: i * 100ms` for a staggered reveal as the user scrolls.

---

### Footer

Full-width footer with contact info, expandable "Chi siamo" section, legal copy, and the large wordmark SVG.

**Class:** `.footer`

```html
<footer class="footer">
  <div class="footer__top">

    <!-- Left column -->
    <div class="footer__col footer__col--left">
      <a href="mailto:ciao@ilbosco.co" class="footer__email footer__link--italic">
        ciao@ilbosco.co
      </a>
      <button class="footer__chi-siamo-toggle" aria-expanded="false">Chi siamo</button>
      <div class="footer__chi-siamo-body" hidden>
        <p class="footer__chi-siamo-text">Siamo un gruppo di amici...</p>
        <p class="footer__chi-siamo-text">Questa lista è nata...</p>
      </div>
    </div>

    <!-- Right column -->
    <div class="footer__col footer__col--right">
      <p class="footer__legal">@2026 ilbosco.co</p>
      <p class="footer__legal">
        Made in Spain by
        <a href="https://www.federicabonfanti.com/" target="_blank" rel="noopener" class="footer__link">
          Federica Bonfanti
        </a>
      </p>
    </div>

  </div>

  <!-- Full-width wordmark image at bottom -->
  <div class="footer__wordmark">
    <img src="assets/Footer V2.svg" alt="" aria-hidden="true">
  </div>
</footer>
```

| Class | Role |
|---|---|
| `.footer` | Container — `--color-footer-bg` background, `overflow: hidden` |
| `.footer__top` | Two-column row (stacked on mobile, side-by-side ≥768px) |
| `.footer__col` | Flex column with `--space-lg` gap |
| `.footer__col--left` | Left column — email + chi siamo toggle |
| `.footer__col--right` | Right column — legal copy, right-aligned on desktop |
| `.footer__email` | Contact email — JetBrains Mono `0.75rem`, inherits `--color-footer-text` |
| `.footer__legal` | Copyright / credits — JetBrains Mono `0.75rem` |
| `.footer__link` | Underlined link — inherits footer text colour |
| `.footer__link--italic` | Italic modifier for `.footer__link` |
| `.footer__chi-siamo-toggle` | Ghost button — underlined, toggles `.footer__chi-siamo-body` |
| `.footer__chi-siamo-body` | Hidden by default (`hidden` attribute) — revealed on toggle click |
| `.footer__chi-siamo-text` | Body text inside the expanded section — JetBrains Mono `0.75rem`, line-height `1.6`, `text-transform: none` |
| `.footer__wordmark` | Full-width container for the decorative wordmark SVG |

**Behaviour:** `bindChiSiamo()` in `main.js` uses `querySelectorAll` to bind the toggle independently for each footer instance (the footer is duplicated across default-view and perchè-view).

---

## Animations

### Scroll-triggered reveal — `.reveal`

Applied to any element that should fade + slide in when it enters the viewport.

```css
.reveal               /* initial: opacity 0, translateY 20px */
.reveal.is-visible    /* final: opacity 1, translateY 0 */
```

`observeReveal(root)` in `main.js` attaches an `IntersectionObserver` (`threshold: 0.08`) to all `.reveal` children of a given root element and adds `.is-visible` when they enter the viewport. Once visible, the element is un-observed.

**Stagger:** Set `style.transitionDelay` on each element before calling `observeReveal`.

```js
items.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 70}ms`;
});
observeReveal(container);
```

### Chat bubble entry — `bubble-in`

```css
@keyframes bubble-in {
  from { opacity: 0; transform: scale(0.88) translateY(10px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
}
```

Applied automatically to `.chat-bubble` via CSS. Duration: `420ms`. Easing: `cubic-bezier(0.34, 1.4, 0.64, 1)` (spring-like overshoot).

### Search button ripple — `ripple-out`

```css
@keyframes ripple-out {
  from { transform: scale(0); opacity: 0.45; }
  to   { transform: scale(4); opacity: 0; }
}
```

A `.ripple` span is injected into `.search-box__btn` on `mousedown` at the click coordinates. Duration: `520ms`. The span removes itself after the animation ends.

---

## Views & State

ilBosco is a single-page app with three mutually exclusive views, toggled via the `hidden` HTML attribute.

| View | Element ID | Shown when |
|---|---|---|
| Homepage | `#default-view` | On load, and after any reset |
| Answer | `#answer-view` | User submits a search query |
| Perchè | `#perche-view` | User clicks `[→] Perchè?` |

**Key JS functions:**

| Function | Effect |
|---|---|
| `showResults(query)` | Hides default-view, shows answer-view, renders matching cards |
| `showPerche()` | Hides all other views, shows perche-view, re-renders entries |
| `resetToDefault()` | Hides answer-view and perche-view, shows default-view, clears all state |

**Data files:**

| File | Export | Used by |
|---|---|---|
| `data.js` | `DIRECTORY` (array), `CATEGORY_META` (object) | `main.js` → search + card rendering |
| `answers.js` | `ANSWERS` (array) | `main.js` → perchè view rendering |
