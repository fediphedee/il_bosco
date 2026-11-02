#!/usr/bin/env node
/* ============================================================
   ilBosco — candidati articoli: strumento di revisione interattivo

   Mostra i candidati uno a uno e ti chiede di approvare/rifiutare.
   Gli approvati vanno in cima ad articoli.json; poi regenera index.html.

     node articoli/review.js          → revisione interattiva
     node articoli/review.js --list   → solo lista candidati, nessuna azione
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CANDIDATES_PATH = path.join(__dirname, 'candidates.json');
// URLs rejected here are never proposed again by the weekly curation routine.
const REJECTED_PATH = path.join(__dirname, 'rejected.json');
const ARTICOLI_PATH = path.join(ROOT, 'articoli.json');
const GENERATE_SCRIPT = path.join(__dirname, 'generate.js');
const MAX_ARTICOLI = 10;

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}

const MONTHS_IT = [
  'gennaio','febbraio','marzo','aprile','maggio','giugno',
  'luglio','agosto','settembre','ottobre','novembre','dicembre',
];
function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '').trim());
  if (!m) return iso || '';
  const [, y, mo, d] = m;
  return `${parseInt(d,10)} ${MONTHS_IT[parseInt(mo,10)-1]} ${y}`;
}

function printCandidate(c, i, total) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`[${i+1}/${total}]  ${c.testata}  ·  ${formatDate(c.data)}`);
  console.log(`\n  ${c.titolo}`);
  console.log(`\n  ${c.commento || '(nessun commento)'}`);
  console.log(`\n  🔗 ${c.url}`);
  console.log(`${'─'.repeat(60)}`);
}

async function prompt(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  let candidatesData = readJSON(CANDIDATES_PATH);
  const candidates = candidatesData.candidates || [];

  if (candidates.length === 0) {
    console.log('Nessun candidato in coda. Aspetta la prossima ricerca settimanale.');
    process.exit(0);
  }

  if (process.argv.includes('--list')) {
    console.log(`\n${candidates.length} candidat${candidates.length === 1 ? 'o' : 'i'} in coda:\n`);
    candidates.forEach((c, i) => {
      console.log(`  ${i+1}. [${c.data}] ${c.testata} — ${c.titolo}`);
      console.log(`     ${c.url}\n`);
    });
    process.exit(0);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const approved = [];
  const remaining = [];
  const rejected = [];

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    printCandidate(c, i, candidates.length);
    const answer = await prompt(rl, '  [y] approva  [n] rifiuta  [s] salta per ora  [e] modifica commento  [q] esci > ');
    const key = answer.trim().toLowerCase();

    if (key === 'q') {
      remaining.push(...candidates.slice(i));
      break;
    } else if (key === 'y') {
      approved.push(c);
      console.log('  ✓ Approvato');
    } else if (key === 'e') {
      const newCommento = await prompt(rl, '  Nuovo commento: ');
      approved.push({ ...c, commento: newCommento.trim() });
      console.log('  ✓ Approvato con commento modificato');
    } else if (key === 's') {
      remaining.push(c);
      console.log('  ↷ Saltato');
    } else {
      const motivo = await prompt(rl, '  Motivo (opzionale): ');
      rejected.push({
        url: c.url,
        titolo: c.titolo,
        motivo: motivo.trim(),
        data_rifiuto: new Date().toISOString().slice(0, 10),
      });
      console.log('  ✗ Rifiutato');
    }
  }

  rl.close();

  // Write back remaining candidates (skipped ones)
  writeJSON(CANDIDATES_PATH, { candidates: remaining });

  if (rejected.length) {
    const rejectedData = fs.existsSync(REJECTED_PATH) ? readJSON(REJECTED_PATH) : { rejected: [] };
    const known = new Set((rejectedData.rejected || []).map(r => r.url));
    rejectedData.rejected = [...(rejectedData.rejected || []), ...rejected.filter(r => !known.has(r.url))];
    writeJSON(REJECTED_PATH, rejectedData);
  }

  if (approved.length === 0) {
    console.log('\nNessun articolo approvato.');
    process.exit(0);
  }

  // Prepend approved to articoli.json (newest first)
  const articoliData = readJSON(ARTICOLI_PATH);
  let articoli = articoliData.articoli || [];

  // Avoid duplicates by URL
  const existingUrls = new Set(articoli.map(a => a.url));
  const toAdd = approved.filter(a => !existingUrls.has(a.url));

  if (toAdd.length < approved.length) {
    console.log(`\nAttenzione: ${approved.length - toAdd.length} articol${approved.length - toAdd.length === 1 ? 'o già presente' : 'i già presenti'}, ignorat${approved.length - toAdd.length === 1 ? 'o' : 'i'}.`);
  }

  articoli = [...toAdd, ...articoli];
  if (articoli.length > MAX_ARTICOLI) {
    const dropped = articoli.length - MAX_ARTICOLI;
    console.log(`\nTengo i ${MAX_ARTICOLI} più recenti, rimuovo ${dropped} vecch${dropped === 1 ? 'io' : 'i'}.`);
    articoli = articoli.slice(0, MAX_ARTICOLI);
  }

  writeJSON(ARTICOLI_PATH, { articoli });
  console.log(`\n✓ ${toAdd.length} articol${toAdd.length === 1 ? 'o aggiunto' : 'i aggiunti'} ad articoli.json`);

  // Regenerate index.html
  try {
    execSync(`node "${GENERATE_SCRIPT}" --write`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Errore durante la rigenerazione di index.html:', e.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
