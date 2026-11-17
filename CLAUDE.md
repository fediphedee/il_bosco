# ilBosco

## Brand

Before designing or styling anything, check `brand.html` (open it on the dev server): logo, palette and allowed text/background pairs, type, spacing, imagery and voice, all rendered from the live `style.css` tokens. Specs per component are in `docs/design-system.md`. Use the tokens, never raw hex; if something new is needed, add it to `style.css` and to `brand.html`.

## Writing directory entries (`data.js`)

People skim cards, they don't read them. Keep every entry short.

- **Concise first.** Pick the two or three facts that matter most and cut the rest. If a sentence only adds colour, delete it.
- **`description`**: at most 2 short paragraphs, ~350 characters total. The first paragraph is what shows before the card expands, so it must say on its own why we like it (1–2 sentences).
- **`caveat`**: one or two sentences, ~200 characters. Only the limit that would actually change someone's choice. `null` if there is none.
- **`businessModel`**: one sentence.
- **`CATEGORY_META.percheCambiare`**: 2–3 sentences, ~200 characters.
- Voice: Italian, prima persona plurale, opinionated but not preachy. Facts must be checked against current sources before adding them, with dates when they can go stale.
