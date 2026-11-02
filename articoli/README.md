# Articoli — rassegna stampa

## Flusso automatizzato (curation settimanale)

Un agente cloud gira ogni **lunedì alle 8:00 (Madrid)** e aggiunge candidati a
`articoli/candidates.json`. Per gestirli:

```bash
# Vedi i candidati in coda
node articoli/review.js --list

# Revisione interattiva: approva / rifiuta / modifica commento
node articoli/review.js
```

`review.js` aggiunge gli approvati a `articoli.json`, rimuove i più vecchi se si
supera il limite di 10, e regenera automaticamente `index.html`.

Il prompt dell'agente è in [`search-prompt.md`](search-prompt.md) e si può modificare
per cambiare i temi o le query di ricerca.

> Per creare o modificare la routine schedulata: `claude.ai/code/routines`

---


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
  external AI tools and drops them in **`articoli/images/`**.
- The site never hotlinks third-party images (no third-party requests, no rights ambiguity).
- No image yet → the card shows the branded placeholder and still looks intentional.

### Naming convention (how an image is matched to its article)

**Name the file exactly after the article `id`.** That id is the unique, stable key, so the
filename is what links the image to the article — no JSON editing required.

```
articoli/images/<id>.webp        e.g. articoli/images/ilpost-parlamento-ue-qwant-2026-06.webp
```

`generate.js` resolves each card's image like this:

1. If the article has an explicit `immagine` path in `articoli.json`, that wins (override).
2. Otherwise it looks for `articoli/images/<id>.{webp,jpg,jpeg,png}` (in that order).
3. If neither exists, the card renders the branded placeholder.

So the full flow to add an image:

1. Export it as **WebP** (jpg/png also work), ~**720px+** wide. The card crops it to **3:2**
   (`object-fit: cover`), so the subject should sit roughly centred.
2. Save it as `articoli/images/<id>.<ext>`.
3. Run `node articoli/generate.js --write` — the card switches from placeholder to `<img>`.

`alt` defaults to empty (the image is decorative — its link is already labelled by the headline).
Set the article's `alt` field only if the illustration needs its own description.
