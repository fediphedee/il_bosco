# Articoli — rassegna stampa

The **Articoli** section on the homepage is a curated press review: each card links out
to the original publisher. It is curation, not journalism.

## Source of truth

[`articoli.json`](../articoli.json) (repo root) is the single source of truth. The cards in
[`index.html`](../index.html) are **generated from it** and committed as static markup, so the
section works with JavaScript disabled. `carousel.js` only *enhances* (infinite loop, arrows,
drag) — it never renders the cards.

> ⚠️ Do **not** make the page fetch `articoli.json` client-side as the only render path —
> that would break the no-JS requirement. Client-side hydration is allowed only as an extra.

## Schema (`articoli.json`)

```json
{
  "articoli": [
    {
      "id": "kebab-case-unique-stable",
      "testata": "Publisher name",
      "titolo": "Original headline, unmodified, original language",
      "url": "https://original-publisher/...",
      "data": "2026-06-03",
      "commento": "ilBosco voice, prima persona plurale, ≤ ~220 chars.",
      "immagine": "img/articoli/optional.webp",
      "alt": "Meaningful alt text — required when immagine is present"
    }
  ]
}
```

### Field rules

- **`id`** — kebab-case, unique, stable.
- **`titolo`** — the original headline, unmodified, in its original language.
- **`url`** — the original publisher, never an aggregator.
- **`data`** — ISO 8601 (`YYYY-MM-DD`). The page renders it in Italian (`3 giugno 2026`).
- **`commento`** — written by us, in the ilBosco voice: prima persona plurale, opinionated but
  not preachy. Never "queste aziende sono il male". Never copy publisher text. Max ~220 chars.
- **`immagine`** — **local path only**, never hotlink the publisher's image. **Omit the field**
  if there is no approved branded image yet — the card renders a built-in branded placeholder.
  Image generation/approval is an owner (human) step, not the agent's.
- **`alt`** — required and meaningful when `immagine` is present; otherwise `""`.

## Agent workflow (adding an item)

1. **Verify** the URL resolves and points to the *original* publisher (not an aggregator).
2. **Extract** `testata`, `titolo`, `data` from the page.
3. **Write** the `commento` following the voice rules above.
4. **Add** the entry at the **top** of `articoli.json` (newest first). If the count exceeds **10**,
   remove the oldest entry.
5. **Regenerate** the card markup in `index.html` from the JSON (see below).
6. **Leave `immagine` empty** unless an approved branded image already exists in `img/articoli/`.

## Regenerating the markup

Two options, either is fine:

- **On demand:** ask Claude Code to regenerate the `<!-- BEGIN articoli -->…<!-- END articoli -->`
  block in `index.html` from `articoli.json`.
- **Script (zero dependencies):**

  ```bash
  node articoli/generate.js          # prints the <li> cards to stdout
  node articoli/generate.js --write  # replaces the block in index.html in place
  ```

  The block in `index.html` is delimited by `<!-- BEGIN articoli ... -->` and `<!-- END articoli -->`.

## Images

- Branded **illustrations**, not publisher screenshots/photos. The owner generates them with
  external AI tools and drops them in `img/articoli/`.
- Format: **WebP**, ~**720px** wide, **3:2**.
- The site never hotlinks third-party images (no third-party requests, no rights ambiguity).
- No image yet → omit `immagine`; the card shows the branded placeholder and still looks intentional.
