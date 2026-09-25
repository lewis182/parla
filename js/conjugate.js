/* Parla — verb conjugator for the endless 🔁 Verb drill (present, passato prossimo,
   imperfetto, futuro). Regular patterns + the irregular verbs from the sheets.
   (classic script; shares globals with the other js/ files, load order matters) */
const CONJ_PERSONS = ["io", "tu", "lui/lei", "noi", "voi", "loro"];
const CONJ_TENSES = { presente: "presente", passato: "passato prossimo", imperfetto: "imperfetto", futuro: "futuro" };

// [infinitive, English, options]. e = uses essere in the passato prossimo; pp = irregular participle;
// isc = -isc- verb; fut = irregular future stem; pres = irregular present; imp = imperfetto stem.
const CONJ_VERBS = [
  ["essere", "to be", { e: 1, pp: "stato", fut: "sar", pres: "sono sei è siamo siete sono", impFull: "ero eri era eravamo eravate erano" }],
  ["avere", "to have", { pp: "avuto", fut: "avr", pres: "ho hai ha abbiamo avete hanno" }],
  ["fare", "to do / make", { pp: "fatto", fut: "far", pres: "faccio fai fa facciamo fate fanno", imp: "fac", impType: "ere" }],
  ["andare", "to go", { e: 1, fut: "andr", pres: "vado vai va andiamo andate vanno" }],
  ["venire", "to come", { e: 1, pp: "venuto", fut: "verr", pres: "vengo vieni viene veniamo venite vengono" }],
  ["dire", "to say", { pp: "detto", fut: "dir", pres: "dico dici dice diciamo dite dicono", imp: "dic", impType: "ere" }],
  ["dare", "to give", { fut: "dar", pres: "do dai dà diamo date danno" }],
  ["stare", "to stay / be", { e: 1, fut: "star", pres: "sto stai sta stiamo state stanno" }],
  ["sapere", "to know", { fut: "sapr", pres: "so sai sa sappiamo sapete sanno" }],
  ["potere", "to be able to", { fut: "potr", pres: "posso puoi può possiamo potete possono" }],
  ["dovere", "to have to", { fut: "dovr", pres: "devo devi deve dobbiamo dovete devono" }],
  ["volere", "to want", { fut: "vorr", pres: "voglio vuoi vuole vogliamo volete vogliono" }],
  ["bere", "to drink", { pp: "bevuto", fut: "berr", pres: "bevo bevi beve beviamo bevete bevono", imp: "bev", impType: "ere" }],
  ["uscire", "to go out", { e: 1, pres: "esco esci esce usciamo uscite escono" }],
  ["rimanere", "to stay / remain", { e: 1, pp: "rimasto", fut: "rimarr", pres: "rimango rimani rimane rimaniamo rimanete rimangono" }],
  ["scegliere", "to choose", { pp: "scelto", pres: "scelgo scegli sceglie scegliamo scegliete scelgono" }],
  ["tenere", "to hold / keep", { fut: "terr", pres: "tengo tieni tiene teniamo tenete tengono" }],
  ["salire", "to go up", { e: 1, pres: "salgo sali sale saliamo salite salgono" }],
  ["parlare", "to speak", {}], ["mangiare", "to eat", {}], ["lavorare", "to work", {}], ["studiare", "to study", {}],
  ["abitare", "to live (reside)", {}], ["comprare", "to buy", {}], ["cercare", "to look for", {}], ["pagare", "to pay", {}],
  ["arrivare", "to arrive", { e: 1 }], ["tornare", "to return", { e: 1 }], ["entrare", "to enter", { e: 1 }],
  ["giocare", "to play", {}], ["cominciare", "to begin", {}], ["ascoltare", "to listen", {}], ["guardare", "to watch", {}],
  ["prendere", "to take", { pp: "preso" }], ["leggere", "to read", { pp: "letto" }], ["scrivere", "to write", { pp: "scritto" }],
  ["vedere", "to see", { pp: "visto", fut: "vedr" }], ["vivere", "to live", { pp: "vissuto", fut: "vivr" }],
  ["credere", "to believe", {}], ["chiudere", "to close", { pp: "chiuso" }], ["rispondere", "to answer", { pp: "risposto" }],
  ["perdere", "to lose", { pp: "perso" }], ["mettere", "to put", { pp: "messo" }],
  ["dormire", "to sleep", {}], ["partire", "to leave", { e: 1 }], ["aprire", "to open", { pp: "aperto" }], ["sentire", "to hear / feel", {}],
  ["finire", "to finish", { isc: 1 }], ["capire", "to understand", { isc: 1 }], ["pulire", "to clean", { isc: 1 }], ["preferire", "to prefer", { isc: 1 }],
];

// Join stem + ending with the spelling rules: cerc+i → cerchi, mangi+i → mangi, studi+iamo → studiamo.
function conjJoin(stem, end, type) {
  if (type === "are" && /[cg]$/.test(stem) && /^[ie]/.test(end)) return stem + "h" + end;
  if (/i$/.test(stem) && /^i/.test(end)) return stem + end.slice(1);
  return stem + end;
}
function conjugate(verb, tense, p /* 0..5 */, gender /* "m" | "f" */) {
  const [inf, , o] = verb;
  const type = inf.slice(-3);                          // are / ere / ire
  const stem = inf.slice(0, -3);
  if (tense === "presente") {
    if (o.pres) return o.pres.split(" ")[p];
    const E = { are: ["o", "i", "a", "iamo", "ate", "ano"], ere: ["o", "i", "e", "iamo", "ete", "ono"],
      ire: o.isc ? ["isco", "isci", "isce", "iamo", "ite", "iscono"] : ["o", "i", "e", "iamo", "ite", "ono"] }[type];
    return conjJoin(stem, E[p], type);
  }
  if (tense === "imperfetto") {
    if (o.impFull) return o.impFull.split(" ")[p];
    const t = o.impType || type, s = o.imp || stem;
    const v = { are: "a", ere: "e", ire: "i" }[t];
    return s + v + ["vo", "vi", "va", "vamo", "vate", "vano"][p];
  }
  if (tense === "futuro") {
    let fs = o.fut;
    if (!fs) {
      if (type === "are") fs = /[cg]$/.test(stem) ? stem + "her" : /[cg]i$/.test(stem) ? stem.slice(0, -1) + "er" : stem + "er";
      else fs = stem + (type === "ere" ? "er" : "ir");
    }
    return fs + ["ò", "ai", "à", "emo", "ete", "anno"][p];
  }
  // passato prossimo
  const pp = o.pp || stem + { are: "ato", ere: "uto", ire: "ito" }[type];
  if (!o.e) return ["ho", "hai", "ha", "abbiamo", "avete", "hanno"][p] + " " + pp;
  const aux = ["sono", "sei", "è", "siamo", "siete", "sono"][p];
  const base = pp.slice(0, -1);
  const end = p < 3 ? (gender === "f" ? "a" : "o") : (gender === "f" ? "e" : "i");
  return aux + " " + base + end;
}

// Build one drill question. For essere verbs in the passato the gender is named, and the
// other gender's form is still accepted (you might be answering for yourself).
function conjQuestion(tense) {
  const tenses = tense && tense !== "all" ? [tense] : Object.keys(CONJ_TENSES);
  const t = tenses[Math.floor(Math.random() * tenses.length)];
  const v = CONJ_VERBS[Math.floor(Math.random() * CONJ_VERBS.length)];
  const p = Math.floor(Math.random() * 6);
  let who = CONJ_PERSONS[p], gender = "m";
  if (p === 2) { gender = Math.random() < 0.5 ? "m" : "f"; if (t === "passato") who = gender === "m" ? "lui" : "lei"; }
  else if (Math.random() < 0.3) gender = "f";
  const answer = conjugate(v, t, p, gender);
  const alts = [answer];
  if (t === "passato" && v[2].e && p < 2) alts.push(conjugate(v, t, p, gender === "m" ? "f" : "m"));
  const subj = p === 2 ? (who === "lui/lei" ? "lui" : who) : who;
  const genderNote = t === "passato" && v[2].e && p !== 2 ? (gender === "f" ? " (female)" : p >= 3 ? " (males / mixed)" : " (male)") : "";
  return {
    t: "conj", q: `${v[0]} → ${who}${genderNote}`, h: `${v[1]} · ${CONJ_TENSES[t]}`,
    a: alts, s: `${subj} ${answer}`, x: t === "passato" ? (v[2].e ? `${v[0]} takes essere, so the participle agrees: -o / -a / -i / -e.` : `${v[0]} takes avere.`) : null,
  };
}
