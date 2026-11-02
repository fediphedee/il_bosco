# ilBosco — istruzioni per l'agente di curation articoli

## Obiettivo

Trovare **1–2 articoli** (massimo) da proporre alla rassegna stampa di ilBosco.
Meglio uno ottimo che due mediocri.

ilBosco è una guida italiana alle alternative digitali europee e indipendenti — browser, email,
motori di ricerca, messaggistica, musica, streaming, AI — con un'attenzione alla sovranità
digitale, alla privacy e all'indipendenza dalle Big Tech americane.

## Criteri di rilevanza (TUTTI devono essere soddisfatti)

1. **Originale**: non un aggregatore (non Google News, non Ansa Rassegna Stampa, ecc.).
2. **Recente**: pubblicato negli ultimi 30 giorni.
3. **Fatto concreto**: preferire notizie di eventi reali — un'istituzione che cambia
   strumento, una legge approvata, un modello rilasciato, uno studio pubblicato, un'azienda
   che lancia qualcosa. Evitare articoli divulgativi generici ("come passare da X a Y") o
   listicle senza notizia ("le 10 alternative a...").
4. **Tema pertinente** — almeno uno tra:
   - Alternative europee o indipendenti a prodotti Big Tech (browser, email, VPN, cloud, AI, musica, streaming, mappe, ecc.)
   - Sovranità digitale in Europa, regolamentazione Big Tech (DMA, DSA, GDPR enforcement)
   - Privacy, tracciamento, sorveglianza di massa
   - Open source come scelta consapevole
   - Modelli di business etici nell'industria tech (cooperative, no-profit, community-owned)
   - Dipendenza tecnologica dell'Europa dagli USA (cloud, semiconduttori, AI)
   - **AI open source**: nuovi modelli open weight rilasciati, framework open source per AI, iniziative di AI aperta e riproducibile
   - **Legislazione e regolamentazione sull'AI**: AI Act europeo e sua applicazione, normative nazionali, decisioni di autorità di regolamentazione sull'uso dell'AI
5. **Pubblico italiano o europeo**: preferire testata italiana, o articolo in italiano.
   Un articolo in inglese va bene solo se molto rilevante e non coperto in italiano.
6. **Non già presente** in articoli.json, candidates.json o **rejected.json** (controlla gli URL e i titoli).
   Gli URL in `articoli/rejected.json` sono stati scartati dalla redazione: non riproporli mai.
7. **Liberamente accessibile**: niente paywall, login, aree riservate a soci/iscritti o pagine
   bloccate. Se WebFetch restituisce 401/403, una pagina di login o un paywall, scarta l'articolo.

## Query di ricerca suggerite

Esegui almeno 4–5 ricerche tra queste (o varianti, con l'anno corrente):

**Alternative tech e sovranità digitale:**
- "alternative europee Big Tech 2026"
- "sovranità digitale Europa"
- "cloud europeo alternativa AWS Azure"
- "browser privacy alternativa Chrome"

**AI open source:**
- "modello AI open source rilasciato 2026"
- "intelligenza artificiale open weight Europa"
- "AI open source alternativa ChatGPT 2026"
- "modello linguistico open source italiano"

**Legislazione e regolamentazione AI:**
- "AI Act applicazione 2026 Italia"
- "regolamentazione intelligenza artificiale Europa"
- "AI Act europeo obbligo norma"
- "autorità garante intelligenza artificiale decisione"

## Voce ilBosco (commento)

Il commento deve essere scritto in prima persona plurale ("noi di ilBosco"),
opinionato ma non predicatorio. Mai "queste aziende sono il male". Mai copiare il testo
del publisher. Max ~220 caratteri. Tono: diretto, curioso, a volte ironico, mai catastrofista.

Esempi di tono:

> "Un cambio di default che dice molto: le alternative europee esistono e qualcuno comincia
> a sceglierle sul serio, partendo da chi scrive le regole."

> "Quattro alternative europee, concrete e già usabili, per chi vuole iniziare a sganciarsi
> da Google e Microsoft. Non teoria: nomi su cui mettere le mani oggi."

## Procedura

1. Leggi `articoli.json` → lista URL e titoli già pubblicati.
2. Leggi `articoli/candidates.json` → lista URL e titoli già in coda. Se non esiste, trattalo come `{"candidates": []}`.
   Leggi `articoli/rejected.json` → URL scartati dalla redazione. Se non esiste, trattalo come `{"rejected": []}`.
3. Esegui 4–5 query WebSearch.
4. Per ogni risultato promettente, **prova** a usare WebFetch per visitare la pagina originale
   e confermare testata, titolo esatto e data. **Se WebFetch fallisce** (errore di rete,
   timeout): non bloccare la run — usa i dati dal snippet WebSearch e continua.
5. Scarta duplicati, aggregatori e articoli divulgativi senza notizia concreta.
6. Scegli i **migliori 1–2**. Per ciascuno, compila:
   ```json
   {
     "id": "testata-slug-YYYY-MM",
     "testata": "Nome Testata",
     "titolo": "Titolo originale non modificato",
     "url": "https://...",
     "data": "YYYY-MM-DD",
     "commento": "...",
     "alt": ""
   }
   ```
7. Aggiungi i candidati a `candidates.json` (append, non sovrascrivere).
   Mantieni max 20 candidati totali; scarta i più vecchi se necessario.
8. Esegui commit e push:
   ```bash
   git add articoli/candidates.json
   git commit -m "chore: aggiunti candidati articoli [automatico]"
   git push
   ```
9. Invia una PushNotification con:
   - **title**: `ilBosco — nuovi articoli`
   - **message**: per ogni articolo trovato: testata e titolo, poi l'**URL completo su una
     riga a sé** (con `https://`, così è cliccabile per la revisione), poi il commento.
     Esempio: `• Il Post — Titolo articolo\n  https://www.ilpost.it/...\n  "Commento in voce ilBosco..."\n\nEsegui: node articoli/review.js`

Se non hai trovato nessun articolo valido, non fare commit né invia notifiche.
