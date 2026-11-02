# ilBosco — istruzioni per l'agente di curation articoli

## Obiettivo

Trovare **1–2 articoli** (massimo) da proporre alla rassegna stampa di ilBosco.
Meglio uno ottimo che due mediocri. Qualità sulla quantità.

ilBosco è una guida italiana alle alternative digitali europee e indipendenti — browser, email,
motori di ricerca, messaggistica, musica, streaming, AI — con un'attenzione alla sovranità
digitale, alla privacy e all'indipendenza dalle Big Tech americane.

## Criteri di rilevanza (TUTTI devono essere soddisfatti)

1. **Originale**: non un aggregatore (non Google News, non Ansa Rassegna Stampa, ecc.).
2. **Recente**: pubblicato negli ultimi 30 giorni.
3. **Tema pertinente** — almeno uno tra:
   - Alternative europee o indipendenti a prodotti Big Tech (browser, email, VPN, cloud, AI, musica, streaming, mappe, ecc.)
   - Sovranità digitale in Europa, regolamentazione Big Tech (DMA, DSA, GDPR enforcement)
   - Privacy, tracciamento, sorveglianza di massa
   - Open source come scelta consapevole
   - Modelli di business etici nell'industria tech (cooperative, no-profit, community-owned)
   - Dipendenza tecnologica dell'Europa dagli USA (cloud, semiconduttori, AI)
4. **Pubblico italiano o europeo**: preferire testata italiana, o articolo in italiano.
   Un articolo in inglese va bene solo se molto rilevante e non coperto in italiano.
5. **Non già presente** in articoli.json o candidates.json (controlla gli URL e i titoli).

## Query di ricerca suggerite

Esegui almeno 3–4 ricerche tra queste (o varianti):

- "alternative europee Big Tech 2026" (o anno corrente)
- "sovranità digitale Europa"
- "privacy alternativa Google 2026"
- "alternativa WhatsApp Signal Threema"
- "DMA Digital Markets Act applicazione"
- "cloud europeo alternativa AWS Azure"
- "open source alternativa Microsoft"
- "IA europea alternativa ChatGPT"
- "streaming musica alternativa Spotify"
- "browser privacy alternativa Chrome"

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
2. Leggi `articoli/candidates.json` → lista URL e titoli già in coda.
3. Esegui 3–4 query WebSearch.
4. Per ogni risultato promettente, verifica la pagina con WebFetch: controlla che sia
   l'editore originale, estrai testata/titolo/data esatti.
5. Scarta duplicati e articoli fuori tema.
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
   - **message**: per ogni articolo trovato, una riga con `• Testata — Titolo (commento)`.
     Esempio: `• Il Post — Vivere senza le tecnologie statunitensi · "Si può davvero vivere senza tech americana? Più di quanto pensiamo."\n\nEsegui: node articoli/review.js`

Se non hai trovato nessun articolo valido, non fare commit né invia notifiche.
