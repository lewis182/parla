/* Parla — 📘 Grammatica, merged into Parla.
   Tabs: Start here · Reference (verb tables) · Course (step-by-step verb exercises) ·
   Grammar (15 lessons) · Charts (your sheets) · Vocab (four situations).
   Content comes from js/grammatica-data.js (GRAM); exercises run on Parla's exercise engine;
   "Ask Giulia" uses the 📚 Cards chat. Vocab progress is shared with the old Grammatica app
   (same site, same itg.vocab.state key), so nothing learnt there is lost.
   (classic script; shares globals with the other js/ files; loads after exercises.js & cards.js) */
(function () {
  const $ = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const P = GRAM.PRONOUNS;                                     // io, tu, lui / lei, noi, voi, loro
  const say = (p) => (p === "lui / lei" ? "lui" : p);
  const TL = GRAM.tenseLabels;
  const panel = () => el("gramPanel");
  let tab = load("parla_gram_tab", "start");

  /* =================================================================== verbs */
  // Regular verbs from your sheets ("Verbi Italiani al Presente") plus Grammatica's models.
  const EXTRA = [["mangiare", "to eat"], ["vivere", "to live"], ["studiare", "to study"], ["lavorare", "to work"], ["leggere", "to read", { pp: "letto" }],
    ["scrivere", "to write", { pp: "scritto" }], ["ascoltare", "to listen"], ["guardare", "to watch"], ["cucinare", "to cook"], ["viaggiare", "to travel"], ["abitare", "to live (reside)"],
    ["finire", "to finish", { isc: 1 }], ["preferire", "to prefer", { isc: 1 }], ["pulire", "to clean", { isc: 1 }]];
  const gv = (inf) => GRAM.ALL.find(v => v.inf === inf);
  const cv = (inf) => CONJ_VERBS.find(v => v[0] === inf) || EXTRA.map(e => [e[0], e[1], e[2] || {}]).find(v => v[0] === inf);
  const gloss = (inf) => (gv(inf) && gv(inf).gloss) || (cv(inf) && cv(inf)[1]) || "";
  const family = (inf) => inf.slice(-3);
  // Verb learning uses Grammatica's own verbs (your checked tables); the sheets feed Cards & Exercises.
  const REG = ["parlare", "credere", "dormire"];
  const ISC = ["capire"];
  const ESS_VERBS = GRAM.ALL.filter(v => v.aux === "essere").map(v => v.inf);          // essere, andare, stare, venire, uscire
  // infinitives from Grammatica's Vocab sheets — for recognising families and stems
  const VOCAB_VERBS = [...new Set(Object.values(GRAM.VOCAB).flatMap(s => s.words.map(w => w.it)).filter(w => /^[a-z]+(are|ere|ire)$/.test(w)))];
  const IRR_A = ["essere", "avere", "fare", "andare", "stare", "dare"];
  const IRR_B = ["dire", "potere", "volere", "dovere", "sapere", "venire", "uscire", "bere"];
  const GRAM_VERBS = GRAM.ALL.map(v => v.inf);

  // All six forms of a verb in a tense (Grammatica's checked tables first, then Parla's conjugator).
  function forms(inf, tense) {
    const g = gv(inf);
    if (g) return GRAM.formsFor(g, tense);
    const v = cv(inf);
    if (!v || tense === "condizionale" || tense === "congiuntivo") return null;
    return [0, 1, 2, 3, 4, 5].map(p => {
      const m = conjugate(v, tense, p, "m");
      if (tense !== "passato" || !v[2].e) return m;
      const f = conjugate(v, tense, p, "f");
      return m + " / " + f.split(" ").pop();
    });
  }
  // "sono andato / andata" → ["sono andato", "sono andata"]
  function alts(form) {
    if (!form.includes(" / ")) return [form];
    const [a, b] = form.split(" / ");
    const lead = a.split(" ").slice(0, -1).join(" ");
    return [a, (lead ? lead + " " : "") + b];
  }
  const shown = (form) => form;
  const endingOf = (inf, tense, p) => {
    const E = GRAM.ENDINGS[tense]; if (!E) return null;
    const col = ISC.includes(inf) && E.cols.includes("-ire (isc)") ? E.cols.indexOf("-ire (isc)") : E.cols.indexOf("-" + family(inf));
    return col < 0 ? null : { end: E.rows[p][col].replace(/^-/, ""), col, E };
  };

  /* ---------- question builders (items for Parla's exercise engine) ---------- */
  function formQ(inf, tense, p) {
    const f = forms(inf, tense); if (!f) return null;
    const a = alts(f[p]);
    return { t: "conj", q: `${inf} → ${P[p]}`, h: `${gloss(inf)} · ${TL[tense]}`, a, s: `${say(P[p])} ${a[0]}` };
  }
  function tableQ(inf, tense, p) {
    const q = formQ(inf, tense, p); if (!q) return null;
    const f = forms(inf, tense);
    q.tbl = P.map((w, i) => [w, i === p ? null : shown(f[i])]);
    q.q = `${inf} — fill the gap (${P[p]})`;
    return q;
  }
  function endingQ(inf, tense, p) {
    const f = forms(inf, tense), e = endingOf(inf, tense, p);
    if (!f || !e || !f[p].endsWith(e.end)) return null;
    const stem = f[p].slice(0, f[p].length - e.end.length);
    const pool = [...new Set(e.E.rows.map(r => r[e.col].replace(/^-/, "")))].filter(x => x !== e.end);
    return { t: "mc", q: `${P[p]} ${stem}___`, o: ["-" + e.end, ...shuffle(pool).slice(0, 3).map(x => "-" + x)], h: `${inf} · ${TL[tense]}`, s: `${say(P[p])} ${f[p]}`, x: GRAM.TENSE_INTRO[tense] || null };
  }
  function personQ(inf, tense, p) {
    const f = forms(inf, tense); if (!f) return null;
    if (f.filter(x => x === f[p]).length > 1) return null;          // e.g. sono = io AND loro — skip
    return { t: "mc", ask: "Who is doing it?", q: alts(f[p])[0], o: [P[p], ...shuffle(P.filter((_, i) => i !== p)).slice(0, 3)], h: `${inf} · ${TL[tense]}`, s: `${say(P[p])} ${alts(f[p])[0]}` };
  }
  function tenseQ(inf, tense, p, allowed) {
    const f = forms(inf, tense); if (!f) return null;
    const others = allowed.filter(t => t !== tense && forms(inf, t));
    if (others.some(t => forms(inf, t)[p] === f[p])) return null;
    return { t: "mc", ask: "Which tense is it?", q: `${say(P[p])} ${alts(f[p])[0]}`, o: [TL[tense], ...shuffle(others).slice(0, 3).map(t => TL[t])], h: inf, s: `${say(P[p])} ${alts(f[p])[0]}` };
  }
  function listenQ(inf, tense, p) {
    const f = forms(inf, tense); if (!f) return null;
    const a = alts(f[p]).map(x => `${say(P[p])} ${x}`);
    return { t: "dict", q: "", a, s: a[0], en: `${inf} (${gloss(inf)}) · ${TL[tense]}` };
  }
  const vocabGloss = (inf) => { for (const s of Object.values(GRAM.VOCAB)) { const w = s.words.find(x => x.it === inf); if (w) return w.en; } return ""; };
  // n questions from builders, verbs, tenses and persons, with no repeats
  function mix(n, builders, verbs, tenses, persons, extraArg) {
    const out = [], seen = new Set();
    for (let tries = 0; out.length < n && tries < n * 30; tries++) {
      const b = pick(builders), v = pick(verbs), t = pick(tenses), p = pick(persons || [0, 1, 2, 3, 4, 5]);
      const q = b(v, t, p, extraArg);
      if (!q) continue;
      const k = q.t + q.q + (q.ask || "");
      if (seen.has(k)) continue;
      seen.add(k); out.push(q);
    }
    return out;
  }

  /* ---------- the course: one section at a time ---------- */
  const endTable = (tense) => {
    const E = GRAM.ENDINGS[tense]; if (!E) return "";
    const fam = ["fa", "fe", "fi", "fx"];
    return `<table class="pattern"><thead><tr><th>person</th>${E.cols.map((c, i) => `<th class="${fam[i]}">${c}</th>`).join("")}</tr></thead><tbody>` +
      E.rows.map((r, ri) => `<tr><td class="p">${P[ri]}</td>${r.map((v, i) => `<td class="${fam[i]}">${v}</td>`).join("")}</tr>`).join("") + "</tbody></table>";
  };
  const verbTable = (inf, tense) => {
    const f = forms(inf, tense);
    return `<table class="gtable"><tr><th colspan="2">${inf} — ${TL[tense]}</th></tr>` + f.map((x, i) => `<tr><td>${P[i]}</td><td>${x}</td></tr>`).join("") + "</table>";
  };
  const PRES = ["presente"];
  const ALLT = ["presente", "passato", "imperfetto", "futuro", "condizionale", "congiuntivo"];
  const GER_IRR = { fare: "facendo", dire: "dicendo", bere: "bevendo" };
  const gerund = (inf) => GER_IRR[inf] || inf.slice(0, -3) + (inf.endsWith("are") ? "ando" : "endo");
  const REFL = [["lavarsi", "to wash (oneself)"], ["alzarsi", "to get up"], ["svegliarsi", "to wake up"]];       // the lesson's examples
  const RP = ["mi", "ti", "si", "ci", "vi", "si"];
  const CONG_SENT = [                                // all with Grammatica's verbs
    ["Spero che tu ___ bene.", "stia", "stare", "I hope you're well."], ["Voglio che tu ___ con me.", "venga", "venire", "I want you to come with me."],
    ["Non credo che ___ vero.", "sia", "essere", "I don't think it's true."], ["Voglio che tu ___ felice.", "sia", "essere", "I want you to be happy."],
    ["Penso che lei ___ ragione.", "abbia", "avere", "I think she's right."], ["Credo che loro ___ italiano.", "parlino", "parlare", "I think they speak Italian."],
    ["È importante che noi ___ bene.", "dormiamo", "dormire", "It's important that we sleep well."], ["Spero che voi ___ la domanda.", "capiate", "capire", "I hope you (all) understand the question."],
    ["Non credo che lui ___ la verità.", "dica", "dire", "I don't think he's telling the truth."], ["È meglio che tu ___ subito.", "vada", "andare", "It's better that you go straight away."],
    ["Penso che loro ___ venire.", "possano", "potere", "I think they can come."], ["Dubito che lei lo ___.", "sappia", "sapere", "I doubt she knows it."],
  ];
  const U = [
    { id: "u1", title: "The three families & the stem", lesson: "g-families", tier: "t-verb", topic: "g_presente",
      intro: "<p>Every verb ends in <b>-are</b>, <b>-ere</b> or <b>-ire</b> — its family. Take the ending off to find the <b>stem</b>: <i>parlare → parl-</i>. The stem stays; the ending changes for each person.</p>",
      gen: () => shuffle([
        ...shuffle(VOCAB_VERBS.concat(REG, ISC)).slice(0, 6).map(v => ({ t: "mc", ask: "Which family?", q: v, o: ["-" + family(v), ...["-are", "-ere", "-ire"].filter(f => f !== "-" + family(v))], h: gloss(v) || vocabGloss(v) })),
        ...shuffle(VOCAB_VERBS.concat(REG, ISC)).slice(0, 6).map(v => ({ t: "conj", q: `stem of ${v}`, h: gloss(v) || vocabGloss(v), a: [v.slice(0, -3), v.slice(0, -3) + "-"], x: `${v} − ${family(v)} = ${v.slice(0, -3)}-` })),
      ]) },
    { id: "u2", title: "Present: io, tu, noi", lesson: "g-endings", tier: "t-verb", topic: "g_presente", tense: "presente",
      intro: "<p>The shortcut: in the present, <b>io → -o</b>, <b>tu → -i</b> and <b>noi → -iamo</b> in every family: parlo, credo, dormo · parli, credi, dormi · parliamo, crediamo, dormiamo.</p>",
      gen: () => mix(12, [endingQ, endingQ, formQ, tableQ], REG, PRES, [0, 1, 3]) },
    { id: "u3", title: "Present: lui/lei, voi, loro", lesson: "g-endings", tier: "t-verb", topic: "g_presente", tense: "presente",
      intro: "<p>These three change with the family: lui/lei <b>-a</b> (-are) or <b>-e</b> (-ere, -ire); voi <b>-ate / -ete / -ite</b>; loro <b>-ano</b> (-are) or <b>-ono</b> (-ere, -ire).</p>",
      gen: () => mix(12, [endingQ, endingQ, formQ, tableQ, personQ], REG, PRES, [2, 4, 5]) },
    { id: "u4", title: "Present: the -isc- verbs", lesson: "g-families", tier: "t-verb", topic: "g_presente", tense: "presente",
      intro: "<p>Many -ire verbs add <b>-isc-</b> in the present except for noi and voi: capisco, capisci, capisce, capiamo, capite, capiscono (others work the same way: finire, preferire…).</p>",
      gen: () => mix(12, [formQ, tableQ, endingQ, personQ], ISC, PRES) },
    { id: "u5", title: "Present: essere, avere, fare, andare, stare, dare", lesson: "g-pronouns", tier: "t-verb", topic: "g_presente", tense: "presente",
      intro: "<p>The most-used verbs are irregular — learn them as tables. Tip: fare, andare, stare and dare all end in <b>-anno</b> for loro (fanno, vanno, stanno, danno).</p>",
      gen: () => mix(12, [formQ, formQ, tableQ, personQ, listenQ], IRR_A, PRES) },
    { id: "u6", title: "Present: dire, potere, volere, dovere, sapere, venire, uscire, bere", lesson: "g-pronouns", tier: "t-verb", topic: "g_modali", tense: "presente",
      intro: "<p>More key irregulars. Patterns help: <i>vengo / vengono</i> add a g; <i>uscire</i> becomes <i>esc-</i> except noi and voi; <i>bere</i> works from <i>bev-</i>.</p>",
      gen: () => mix(12, [formQ, formQ, tableQ, personQ, listenQ], IRR_B, PRES) },
    { id: "u7", title: "Passato prossimo with avere", lesson: "g-tenses", tier: "t-verb", topic: "g_passato", tense: "passato",
      intro: "<p>What happened: present of <b>avere</b> + the <b>past participle</b>. -are → <b>-ato</b>, -ere → <b>-uto</b>, -ire → <b>-ito</b> (parlato, creduto, dormito). Irregular: fatto, detto, letto, scritto, bevuto.</p>",
      gen: () => shuffle([
        ...shuffle(GRAM.ALL.filter(v => v.aux === "avere").map(v => v.inf)).slice(0, 4).map(v => { const f = forms(v, "passato"); return { t: "conj", q: `${v} → past participle`, h: gloss(v), a: [f[0].split(" ").pop()], s: f[0] }; }),
        ...mix(8, [formQ, formQ, tableQ], GRAM.ALL.filter(v => v.aux === "avere").map(v => v.inf), ["passato"]),
      ]) },
    { id: "u8", title: "Passato prossimo with essere", lesson: "g-essere", tier: "t-verb", topic: "g_passato", tense: "passato",
      intro: "<p>Movement, staying and becoming verbs use <b>essere</b> — and the participle agrees: <i>sono andato / andata, siamo andati / andate</i>. Most other verbs use avere.</p>",
      gen: () => {
        const ess = ESS_VERBS;
        const aux = shuffle(GRAM_VERBS).slice(0, 4).map(v => {
          const e = ess.includes(v); const f = forms(v, "passato")[0];
          return { t: "mc", q: `___ ${alts(f)[0].split(" ").pop()}`, o: e ? ["sono", "ho"] : ["ho", "sono"], h: `${v} · I`, s: alts(f)[0], x: e ? `${v} takes essere.` : `${v} takes avere.` };
        });
        const agree = Array.from({ length: 8 }, () => {
          const v = gv(pick(ess)), p = Math.floor(Math.random() * 6), g = Math.random() < .5 ? "m" : "f";
          const ans = GRAM.ESSERE[p] + " " + v.part.slice(0, -1) + (p < 3 ? (g === "f" ? "a" : "o") : (g === "f" ? "e" : "i"));
          const who = p === 2 ? (g === "f" ? "lei" : "lui") : P[p] + (g === "f" ? " (female)" : p >= 3 ? " (male / mixed)" : " (male)");
          return { t: "conj", q: `${v.inf} → ${who}`, h: `${v.gloss} · passato prossimo`, a: [ans], s: `${say(who.split(" (")[0])} ${ans}`, x: "With essere the participle agrees: -o / -a / -i / -e." };
        });
        return shuffle(aux.concat(agree));
      } },
    { id: "u9", title: "Imperfetto", lesson: "g-tenses", tier: "t-verb", topic: "g_passato", tense: "imperfetto",
      intro: "<p>“Was doing / used to”. Very regular: the theme vowel (a / e / i) + <b>-vo, -vi, -va, -vamo, -vate, -vano</b>: parlavo, credevo, dormivo. essere → ero, eri, era, eravamo, eravate, erano.</p>",
      gen: () => mix(12, [endingQ, formQ, formQ, tableQ, personQ], GRAM_VERBS, ["imperfetto"]) },
    { id: "u10", title: "Passato prossimo vs imperfetto", lesson: "g-ppimp", tier: "t-adv", topic: "g_passato",
      intro: "<p>The imperfetto sets the scene (“was doing / used to”); the passato prossimo is the thing that then happened: <i>Mentre leggevo, è arrivato Marco.</i></p>",
      gen: () => shuffle(EX_SETS.find(s => s.id === "imp_vs_pp").items.map(q => ({ ...q }))).slice(0, 11) },
    { id: "u11", title: "Futuro", lesson: "g-tenses", tier: "t-verb", topic: "g_futuro", tense: "futuro",
      intro: "<p>“Will”: infinitive minus the final -e, with -are → -er-, then <b>-ò, -ai, -à, -emo, -ete, -anno</b>: parlerò, crederò, dormirò. Irregular stems: sarò, avrò, farò, andrò, verrò, potrò, vorrò, dovrò, saprò, berrò.</p>",
      gen: () => mix(12, [endingQ, formQ, formQ, tableQ], GRAM_VERBS, ["futuro"]) },
    { id: "u12", title: "Condizionale", lesson: "g-tenses", tier: "t-verb", topic: "g_vorrei", tense: "condizionale",
      intro: "<p>“Would”: the futuro stem + <b>-ei, -esti, -ebbe, -emmo, -este, -ebbero</b>: parlerei, crederei, dormirei. The polite favourites: <i>vorrei</i> (I'd like), <i>potrei</i> (could I), <i>dovresti</i> (you should).</p>",
      gen: () => shuffle([
        { t: "mc", q: "___ un caffè, per favore.", o: ["Vorrei", "Voglio", "Vorrò"], en: "I'd like a coffee, please.", x: "vorrei is the polite 'I would like'." },
        { t: "mc", q: "___ aiutarmi?", o: ["Potrebbe", "Può", "Potrà"], en: "Could you help me? (polite)", x: "potrebbe = could you (Lei) — softer than può." },
        ...mix(10, [formQ, formQ, tableQ, endingQ], GRAM_VERBS, ["condizionale"]),
      ]) },
    { id: "u13", title: "Present continuous: stare + gerund", lesson: "g-continuous", tier: "t-verb", topic: "g_presente",
      intro: "<p>“I am (right now) doing”: present of <b>stare</b> + the gerund. -are → <b>-ando</b>, -ere / -ire → <b>-endo</b>: sto parlando, stai scrivendo, sta dormendo. Irregular: facendo, dicendo, bevendo.</p>",
      gen: () => {
        const vs = GRAM_VERBS;
        const st = forms("stare", "presente");
        return shuffle([
          ...shuffle(vs).slice(0, 5).map(v => ({ t: "conj", q: `${v} → gerund`, h: gloss(v), a: [gerund(v)], s: "sto " + gerund(v) })),
          ...Array.from({ length: 7 }, () => { const v = pick(vs), p = Math.floor(Math.random() * 6); const a = `${st[p]} ${gerund(v)}`;
            return { t: "conj", q: `${v} → ${P[p]} (right now)`, h: `${gloss(v)} · stare + gerund`, a: [a], s: `${say(P[p])} ${a}` }; }),
        ]);
      } },
    { id: "u14", title: "Reflexive verbs", lesson: "g-reflexive", tier: "t-adv", topic: "g_riflessivi",
      intro: "<p>Verbs like <i>lavarsi</i> put a pronoun before the verb: <b>mi, ti, si, ci, vi, si</b> — mi lavo, ti lavi, si lava… In the passato they use essere: <i>mi sono alzato / alzata</i>.</p>",
      gen: () => shuffle(Array.from({ length: 12 }, (_, i) => {
        const [r, en] = pick(REFL), base = r.slice(0, -2) + "e", v = cv(base) || [base, en, {}], p = Math.floor(Math.random() * 6);
        if (i % 3 === 2 && r !== "chiamarsi") { const g = Math.random() < .5 ? "m" : "f"; const pp = conjugate([base, en, { e: 1 }], "passato", p, g);
          const who = p === 2 ? (g === "f" ? "lei" : "lui") : P[p] + (g === "f" ? " (female)" : p >= 3 ? " (male / mixed)" : " (male)");
          return { t: "conj", q: `${r} → ${who}`, h: `${en} · passato prossimo`, a: [`${RP[p]} ${pp}`], s: `${say(who.split(" (")[0])} ${RP[p]} ${pp}` }; }
        const f = `${RP[p]} ${conjugate(v, "presente", p)}`;
        return { t: "conj", q: `${r} → ${P[p]}`, h: `${en} · presente`, a: [f], s: `${say(P[p])} ${f}` };
      })) },
    { id: "u15", title: "Congiuntivo (subjunctive)", lesson: "g-tenses", tier: "t-adv", topic: "g_passato", tense: "congiuntivo",
      intro: "<p>Used after words of hoping, wanting, thinking and doubting: <i>spero che, voglio che, penso che, è importante che, non credo che</i>. io, tu and lui/lei are the same: che io / tu / lui <b>parli</b>. noi -iamo, voi -iate are shared by every family.</p><p class=\"cu-note\">Note on your “Present Subjunctive” sheet: its mistakes box lists “È importante che noi siamo” as both wrong and right — <i>siamo</i> is correct.</p>",
      gen: () => shuffle([
        ...shuffle(CONG_SENT).slice(0, 6).map(([q, a, h, en]) => ({ t: "gap", q, a: [a], h, en })),
        ...mix(6, [formQ, tableQ], GRAM_VERBS, ["congiuntivo"]).map(q => ({ ...q, q: q.q.replace("→ ", "→ che "), s: "che " + q.s })),
      ]) },
    { id: "u16", title: "Review: all tenses", lesson: "g-tenses", tier: "t-adv", topic: "free",
      intro: "<p>Everything together: recognise the tense, then produce the form.</p>",
      gen: () => shuffle([...mix(6, [tenseQ], GRAM_VERBS, ALLT, null, ALLT), ...mix(6, [formQ], GRAM_VERBS, ALLT)]) },
  ];
  let course = load("parla_course", {});                    // { u1: { best, passed } }
  let unlockAll = load("parla_course_all", false);
  const unlocked = (i) => unlockAll || i === 0 || (course[U[i - 1].id] && course[U[i - 1].id].passed);
  const PASS = 80;

  /* =================================================================== panel */
  function open(which) {
    if (window.exActive && window.ParlaExercises) ParlaExercises.close();
    if (window.cardsActive && window.ParlaCards) ParlaCards.close();
    speechSynthesis.cancel();
    try { if (recognizing) cancelRecording(); } catch {}
    ["stage", "micbar", "voicePanel", "setup", "progressPanel", "exPanel", "cardsPanel"].forEach(x => el(x) && el(x).classList.add("hidden"));
    chatEl.classList.add("hidden");
    panel().classList.remove("hidden");
    window.gramActive = true;
    if (which) tab = which;
    render();
  }
  function close() {
    if (window.ParlaTrainer) ParlaTrainer.stop();
    window.gramActive = false;
    speechSynthesis.cancel();
    panel().classList.add("hidden");
    ["stage", "micbar"].forEach(x => el(x).classList.remove("hidden"));
    chatEl.classList.remove("hidden");
  }
  const TABS = [["start", "Start here"], ["reference", "Reference"], ["trainer", "🎙 Trainer"], ["course", "Course"], ["grammar", "Grammar"], ["charts", "Charts"], ["vocab", "Vocab"]];
  function render(scrollTop = true) {
    if (window.ParlaTrainer) ParlaTrainer.stop();
    const p = panel(); p.innerHTML = "";
    const top = $("div", "ex-top");
    top.appendChild($("h2", null, "📘 Grammatica"));
    const b = $("button", "ghost", "← Back to Giulia"); b.onclick = close; top.appendChild(b);
    p.appendChild(top);
    const tabs = $("div", "gr-tabs");
    TABS.forEach(([k, label]) => { const t = $("button", k === tab ? "active" : null, label); t.onclick = () => { tab = k; save("parla_gram_tab", k); render(); }; tabs.appendChild(t); });
    p.appendChild(tabs);
    const body = $("div"); p.appendChild(body);
    ({ start: renderStart, reference: renderReference, trainer: (b) => ParlaTrainer.render(b), course: renderCourse, grammar: renderGrammar, charts: renderCharts, vocab: renderVocab })[tab](body);
    if (scrollTop) window.scrollTo(0, 0);
  }
  // Re-open the panel on a given tab/state after a round or a card
  const backTo = (t, fn) => () => { open(t); if (fn) fn(); };

  /* ---------- Start here ---------- */
  function renderStart(body) {
    const d = $("div", "prose t-found"); d.innerHTML = GRAM.START_HTML;
    d.querySelectorAll("[data-view]").forEach(b => b.onclick = () => { tab = b.dataset.view; save("parla_gram_tab", tab); render(); });
    body.appendChild(d);
  }

  /* ---------- Reference ---------- */
  let refTense = "presente", refSearch = "";
  function renderReference(body) {
    const bar = $("div", "gr-sticky");
    const seg = $("div", "segmented");
    ALLT.forEach(t => { const b = $("button", t === refTense ? "active" : null, TL[t].replace("Passato prossimo", "Passato pross.")); b.onclick = () => { refTense = t; render(false); }; seg.appendChild(b); });
    bar.appendChild(seg);
    const s = $("input", "gr-search"); s.placeholder = "Find a verb (Italian or English)…"; s.value = refSearch;
    s.oninput = () => { refSearch = s.value; paintCards(); };
    bar.appendChild(s);
    body.appendChild(bar);
    const pat = $("div", "pattern-card");
    if (refTense === "passato") pat.innerHTML = `<h3>How the passato prossimo is built</h3><div class="sub">Present of <b>avere</b> (or <b>essere</b>) + the past participle: -are → <b>-ato</b>, -ere → <b>-uto</b>, -ire → <b>-ito</b>. With essere verbs the participle agrees: sono andato / andata / andati / andate.</div>`;
    else pat.innerHTML = `<h3>${TL[refTense]} endings</h3><div class="sub">${GRAM.TENSE_INTRO[refTense]}</div>${endTable(refTense)}<div class="legend"><span><i style="background:#c7e8d4"></i>-are</span><span><i style="background:#ccd4f4"></i>-ere</span><span><i style="background:#f8d1da"></i>-ire</span></div>`;
    body.appendChild(pat);
    const grid = $("div", "grid"); grid.style.marginTop = "14px";
    body.appendChild(grid);
    function paintCards() {
      grid.innerHTML = "";
      const q = refSearch.trim().toLowerCase();
      GRAM.ALL.filter(v => !q || v.inf.includes(q) || v.gloss.toLowerCase().includes(q)).forEach(v => {
        const fam = v.badge ? ("fam-" + (v.badge.startsWith("-are") ? "are" : v.badge.startsWith("-ere") ? "ere" : "ire")) : "fam-irr";
        const c = $("div", "card " + fam);
        const head = $("div", "card-head");
        const l = $("div"); l.appendChild($("span", "verb", v.inf + " ")); l.appendChild($("span", "gloss", v.gloss));
        head.appendChild(l); head.appendChild($("span", "badge " + fam.slice(4), v.badge || "irregular"));
        c.appendChild(head);
        c.appendChild($("div", "card-tense", TL[refTense]));
        const t = $("table", "conj");
        GRAM.formsFor(v, refTense).forEach((f, i) => { const tr = $("tr"); tr.appendChild($("td", "pron", P[i])); const td = $("td"); const fm = $("div", "form", f + " "); fm.appendChild(makeReplay(`${say(P[i])} ${alts(f)[0]}`)); td.appendChild(fm); tr.appendChild(td); t.appendChild(tr); });
        c.appendChild(t);
        if (refTense === "passato") c.appendChild($("div", "aux-note", `uses ${v.aux}`));
        c.appendChild($("div", "card-hint", "Tap for all tenses"));
        c.addEventListener("click", (e) => { if (!e.target.closest(".replay")) showVerb(v); });
        grid.appendChild(c);
      });
      if (!grid.children.length) grid.appendChild($("div", "empty", "No verb matches — try the Italian infinitive."));
    }
    paintCards();
  }
  function lightbox(build) {
    const o = $("div", "gr-light"); const box = $("div", "box"); o.appendChild(box);
    const close = () => o.remove();
    o.addEventListener("click", e => { if (e.target === o) close(); });
    build(box, close);
    document.body.appendChild(o);
    return o;
  }
  function showVerb(v) {
    lightbox((box, close) => {
      const bar = $("div", "bar"); bar.appendChild($("b", null, `${v.inf} — ${v.gloss}`));
      const x = $("button", "ghost", "✕ Close"); x.onclick = close; bar.appendChild(x); box.appendChild(bar);
      const sc = $("div", "scroll"); const t = $("table", "detail-t");
      const hr = $("tr"); hr.appendChild($("th", null, "")); ALLT.forEach(tn => hr.appendChild($("th", null, TL[tn]))); t.appendChild(hr);
      P.forEach((who, i) => { const tr = $("tr"); tr.appendChild($("td", null, who)); ALLT.forEach(tn => { const f = GRAM.formsFor(v, tn)[i]; const td = $("td", null, f + " "); td.appendChild(makeReplay(`${say(who)} ${alts(f)[0]}`)); tr.appendChild(td); }); t.appendChild(tr); });
      sc.appendChild(t); box.appendChild(sc);
      const acts = $("div", "gr-actions");
      const drill = $("button", "primary", `✏️ Practise ${v.inf}`);
      drill.onclick = () => { close(); ParlaExercises.startCustom(`✏️ ${v.inf}`, mix(12, [formQ, formQ, tableQ, personQ, listenQ], [v.inf], ALLT.filter(t => forms(v.inf, t))), { back: backTo("reference"), backLabel: "📘 Back to Reference", sheet: "Grammatica verb tables" }); };
      acts.appendChild(drill);
      box.appendChild(acts);
    });
  }

  /* ---------- Course ---------- */
  function renderCourse(body) {
    const passed = U.filter(u => course[u.id] && course[u.id].passed).length;
    body.appendChild($("p", "ex-intro", `Learn the verb tenses and endings one section at a time. Read the short explanation, then do 12 questions — score ${PASS}% to unlock the next section. ${passed}/${U.length} passed.`));
    const next = U.find((u, i) => unlocked(i) && !(course[u.id] && course[u.id].passed));
    if (next) { const b = $("button", "primary", "▶ Continue: " + next.title); b.onclick = () => showUnit(next.id); body.appendChild(b); }
    const grid = $("div", "cu-grid"); grid.style.marginTop = "12px";
    U.forEach((u, i) => {
      const st = course[u.id], ok = unlocked(i);
      const c = $("button", "cu-card " + u.tier + (ok ? "" : " locked") + (st && st.passed ? " done" : ""));
      c.appendChild($("span", "t", `${i + 1}. ${u.title}`));
      const s = $("span", "s"); s.innerHTML = !ok ? "🔒 Pass the section before" : st ? `${st.passed ? "<b>✓ passed</b>" : "not passed yet"} · best ${st.best}%` : "Not started";
      c.appendChild(s);
      c.onclick = () => ok ? showUnit(u.id) : null;
      grid.appendChild(c);
    });
    body.appendChild(grid);
    const ul = $("button", "cu-link", unlockAll ? "Lock sections again (follow the order)" : "Unlock all sections");
    ul.style.marginTop = "12px";
    ul.onclick = () => { unlockAll = !unlockAll; save("parla_course_all", unlockAll); render(false); };
    body.appendChild(ul);
  }
  function unitText(u) {
    const d = document.createElement("div"); d.innerHTML = u.intro; let t = d.textContent;
    if (u.tense && GRAM.ENDINGS[u.tense]) t += "\nEndings table (" + TL[u.tense] + "): " + GRAM.ENDINGS[u.tense].rows.map((r, i) => P[i] + " " + r.join(" / ")).join("; ");
    const les = GRAM.LESSONS.find(l => l.id === u.lesson);
    if (les) { const e = document.createElement("div"); e.innerHTML = les.html; t += "\nRelated lesson: " + e.textContent.replace(/\s+/g, " ").slice(0, 1500); }
    return t;
  }
  function showUnit(id) {
    tab = "course";
    const i = U.findIndex(u => u.id === id), u = U[i];
    const p = panel(); p.innerHTML = "";
    const top = $("div", "ex-top"); top.appendChild($("h2", null, `🧭 ${i + 1}. ${u.title}`));
    const bk = $("button", "ghost", "← Course"); bk.onclick = () => render(); top.appendChild(bk);
    p.appendChild(top);
    const pr = $("div", "prose " + u.tier);
    pr.innerHTML = u.intro + (u.tense && !["passato"].includes(u.tense) && !["u5", "u6"].includes(u.id) && GRAM.ENDINGS[u.tense] ? `<h3>${TL[u.tense]} endings</h3>` + endTable(u.tense) : "") +
      (u.id === "u5" || u.id === "u6" ? `<h3>Example</h3>` + verbTable(u.id === "u5" ? "essere" : "venire", "presente") : "") +
      (u.id === "u7" || u.id === "u8" ? verbTable(u.id === "u7" ? "parlare" : "andare", "passato") : "");
    p.appendChild(pr);
    const st = course[u.id];
    if (st) p.appendChild($("div", "cu-note", `Best score ${st.best}%${st.passed ? " — passed ✓" : ` — ${PASS}% unlocks the next section`}`));
    const acts = $("div", "gr-actions");
    const go = $("button", "primary", "▶ Start (12 questions)");
    go.onclick = () => startUnit(u);
    acts.appendChild(go);
    const les = GRAM.LESSONS.find(l => l.id === u.lesson);
    if (les) { const r = $("button", "ghost", "📖 Read the lesson"); r.onclick = () => { tab = "grammar"; lessonId = les.id; render(); }; acts.appendChild(r); }
    const ask = $("button", "ghost", "💬 Ask Giulia"); ask.title = "Explanations, examples and questions about this section";
    ask.onclick = () => ParlaCards.openCustom({ id: "course_" + u.id, icon: "🧭", title: u.title, sheet: "Verb course", html: pr.innerHTML, text: unitText(u), topic: u.topic,
      onExercises: () => startUnit(u), onBack: () => { open("course"); showUnit(u.id); }, backLabel: "← Back to the section" });
    acts.appendChild(ask);
    if (u.topic && TOPICS[u.topic]) { const t = $("button", "ghost", "🗣 Talk it through"); t.onclick = () => { close(); const sel = el("topicSel"); sel.value = u.topic; sel.dispatchEvent(new Event("change")); }; acts.appendChild(t); }
    if (i < U.length - 1 && unlocked(i + 1)) { const n = $("button", "ghost", "Next section ›"); n.onclick = () => showUnit(U[i + 1].id); acts.appendChild(n); }
    p.appendChild(acts);
    window.scrollTo(0, 0);
  }
  function startUnit(u) {
    const i = U.indexOf(u);
    ParlaExercises.startCustom(`🧭 ${i + 1}. ${u.title}`, u.gen(), {
      id: "course_" + u.id, sheet: "Verb course · Grammatica tables",
      back: () => { open("course"); showUnit(u.id); }, backLabel: "🧭 Back to the section",
      onDone: (pct) => {
        const prev = course[u.id] || { best: 0, passed: false };
        course[u.id] = { best: Math.max(prev.best, pct), passed: prev.passed || pct >= PASS, when: Date.now() };
        save("parla_course", course);
      },
      summaryNote: (pct) => pct >= PASS ? (i < U.length - 1 ? `✓ Section passed — “${U[i + 1].title}” is unlocked.` : "✓ Course complete — bravissimo!") : `${PASS}% passes this section — have another go (the questions change each time).`,
    }, u.gen);
  }

  /* ---------- Grammar lessons ---------- */
  let lessonId = load("parla_gram_lesson", "g-gender");
  const LESSON_PRACTICE = {                          // lesson → exercises
    "g-gender": () => genderRound(), "g-genex": () => genderRound(), "g-articles": () => ParlaExercises.openSet("articoli", backTo("grammar")),
    "g-agree": () => agreeRound(), "g-adjpos": () => agreeRound(), "g-pronouns": () => unit("u2"), "g-objposs": () => ParlaExercises.openSet("pron_diretti", backTo("grammar")),
    "g-prep": () => ParlaExercises.openSet("prep_articolate", backTo("grammar")), "g-families": () => unit("u1"), "g-endings": () => unit("u2"),
    "g-tenses": () => unit("u16"), "g-continuous": () => unit("u13"), "g-essere": () => unit("u8"), "g-reflexive": () => unit("u14"), "g-ppimp": () => unit("u10"),
  };
  const unit = (id) => { open("course"); showUnit(id); };
  function renderGrammar(body) {
    const wrap = $("div", "gwrap");
    const menu = $("aside", "gmenu");
    const groups = [...new Set(GRAM.LESSONS.map(l => l.group))];
    groups.forEach(g => {
      const ls = GRAM.LESSONS.filter(l => l.group === g);
      const grp = $("div", "grp " + ls[0].tier);
      grp.appendChild($("h4", null, g));
      ls.forEach(l => { const b = $("button", l.id === lessonId ? "active" : null); b.appendChild($("span", "n", String(l.n))); b.appendChild(document.createTextNode(" " + l.title)); b.onclick = () => { lessonId = l.id; save("parla_gram_lesson", l.id); render(false); document.querySelector("#gramPanel .gcontent").scrollIntoView({ behavior: "smooth", block: "start" }); }; grp.appendChild(b); });
      menu.appendChild(grp);
    });
    const content = $("div", "gcontent");
    const l = GRAM.LESSONS.find(x => x.id === lessonId) || GRAM.LESSONS[0];
    const pr = $("div", "prose " + l.tier); pr.innerHTML = l.html; content.appendChild(pr);
    const acts = $("div", "gr-actions");
    const ask = $("button", "primary", "💬 Ask Giulia about this");
    ask.onclick = () => { const d = document.createElement("div"); d.innerHTML = l.html;
      ParlaCards.openCustom({ id: "lesson_" + l.id, icon: "📘", title: l.title, sheet: "Grammatica lesson " + l.n, html: l.html, text: d.textContent.replace(/\s+/g, " "),
        onExercises: LESSON_PRACTICE[l.id], onBack: () => open("grammar"), backLabel: "← Back to the lesson" }); };
    acts.appendChild(ask);
    if (LESSON_PRACTICE[l.id]) { const pb = $("button", "ghost", "✏️ Practise this"); pb.onclick = LESSON_PRACTICE[l.id]; acts.appendChild(pb); }
    const idx = GRAM.LESSONS.indexOf(l);
    if (idx < GRAM.LESSONS.length - 1) { const nx = $("button", "ghost", `Next: ${GRAM.LESSONS[idx + 1].title} ›`); nx.onclick = () => { lessonId = GRAM.LESSONS[idx + 1].id; save("parla_gram_lesson", lessonId); render(); }; acts.appendChild(nx); }
    content.appendChild(acts);
    wrap.appendChild(menu); wrap.appendChild(content);
    body.appendChild(wrap);
  }
  // Nouns (with their article) from the four vocabulary situations
  function nouns() {
    const out = [], seen = new Set();
    Object.values(GRAM.VOCAB).forEach(s => s.words.forEach(w => {
      const m = w.it.match(/^(il|lo|la|i|gli|le) ([a-zàèéìòù' ]+)$/i);
      if (!m || w.it.includes("/") || seen.has(m[2])) return;
      seen.add(m[2]);
      out.push({ art: m[1].toLowerCase(), noun: m[2], en: w.en, g: /^(il|lo|i|gli)$/.test(m[1].toLowerCase()) ? "m" : "f", pl: /^(i|gli|le)$/.test(m[1].toLowerCase()) });
    }));
    return out;
  }
  function genderRound() {
    const qs = shuffle(nouns().filter(n => !n.pl)).slice(0, 12).map(n => ({
      t: "mc", ask: "Masculine or feminine?", q: n.noun, o: n.g === "m" ? ["masculine", "feminine"] : ["feminine", "masculine"], en: n.en, s: `${n.art} ${n.noun}`,
      x: /[^aeiou]a$|ma$/.test(n.noun) && n.g === "m" ? "An exception: -a but masculine." : /o$/.test(n.noun) && n.g === "f" ? "An exception: -o but feminine." : /e$/.test(n.noun) ? "-e nouns can be either — learn them with the article." : null,
    }));
    ParlaExercises.startCustom("♂♀ Masculine or feminine?", qs, { back: backTo("grammar"), backLabel: "📘 Back to the lesson", sheet: "nouns from your Vocab sheets" }, () => genderRound.gen());
  }
  genderRound.gen = () => shuffle(nouns().filter(n => !n.pl)).slice(0, 12).map(n => ({ t: "mc", ask: "Masculine or feminine?", q: n.noun, o: n.g === "m" ? ["masculine", "feminine"] : ["feminine", "masculine"], en: n.en, s: `${n.art} ${n.noun}` }));
  const ADJ = [["nuovo", "new"], ["rosso", "red"], ["piccolo", "small"], ["alto", "tall / high"], ["caro", "expensive"], ["freddo", "cold"], ["pieno", "full"], ["famoso", "famous"]];
  function agreeGen() {
    return shuffle(nouns()).filter(n => /[oae]$/.test(n.noun) || n.pl).slice(0, 12).map(n => {
      const [adj, aen] = pick(ADJ);
      const end = n.g === "m" ? (n.pl ? "i" : "o") : (n.pl ? "e" : "a");
      const form = adj.slice(0, -1) + end;
      return { t: "gap", q: `${n.art} ${n.noun} ___`, a: [form], h: adj, en: `${n.en} — ${aen}`, x: `${n.g === "m" ? "masculine" : "feminine"} ${n.pl ? "plural" : "singular"} → -${end}` };
    });
  }
  function agreeRound() { ParlaExercises.startCustom("Agreement: make the adjective match", agreeGen(), { back: backTo("grammar"), backLabel: "📘 Back to the lesson", sheet: "nouns from your Vocab sheets" }, agreeGen); }

  /* ---------- Charts ---------- */
  const CHART_CARD = {
    "Containers Vocab.jpg": "voc_contenitori", "La Frutta.jpg": "voc_frutta", "Italian Coffee.jpg": "caffe", "Italian deserts.jpg": "cultura_cibo", "Pasta Dishes.jpg": "cultura_cibo",
    "Pasta Shapes.jpg": "cultura_cibo", "Italian Bread.jpg": "cultura_cibo", "Italian Olive Oil.jpg": "cultura_vino", "Itialian Vines.jpg": "cultura_vino", "Italian Villages.jpg": "cultura_vino",
    "Bologna Train Journeys.jpg": "cultura_vino", "Italian Verbs.jpg": "voc_verbi_base", "Action Words.jpg": "voc_azioni", "Essere Fare Avere.jpg": "essere_avere_fare",
    "Essere and Avere.jpg": "pp_ausiliare", "Sono Faccio verbs.jpg": "essere_avere_fare", "Essere Vs Stare.jpg": "essere_stare", "Stare.jpg": "essere_stare", "Italian articles.jpg": "articoli",
    "Propositions.jpg": "prep_semplici", "Di A Da In Con.jpg": "prep_semplici", "Lo La Li Le.jpg": "pron_diretti", "Mi Ti Gli.jpg": "pron_indiretti", "Ne And Ce.jpg": "ne_ci",
    "Ce Vs Ci Sono.jpg": "ce_ci_vuole", "Voule Voglinono Verbs.jpg": "ce_ci_vuole", "Possesive Adjectives.jpg": "possessivi", "Dopo Vs Dopo Che.jpg": "mentre_dopo",
    "Mentre Durante.jpg": "mentre_dopo", "Imperfect and Perfect tense.jpg": "imp_vs_pp", "Vado.PNG": "andare_a_in_da", "essere.jpg": "essere_tempi", "Sara verbs.jpg": "futuro_prob",
    "Present tenses.jpg": "presente_10",
  };
  const file = (c) => c.f.replace(/^charts\//, "");
  const chartsFor = (cardId) => GRAM.CHARTS.filter(c => CHART_CARD[file(c)] === cardId);
  function showChart(c) {
    lightbox((box, close) => {
      const bar = $("div", "bar"); bar.appendChild($("span", null, `${c.it} — ${c.en}`));
      const r = $("div", "row");
      const cid = CHART_CARD[file(c)];
      if (cid && !window.cardsActive) { const b = $("button", "ghost", "📚 Open the card"); b.onclick = () => { close(); ParlaCards.open(cid); }; r.appendChild(b); }
      if (file(c) === "present subjective.jpg") { const b = $("button", "ghost", "🧭 Course section"); b.onclick = () => { close(); unit("u15"); }; r.appendChild(b); }
      const x = $("button", "ghost", "✕ Close"); x.onclick = close; r.appendChild(x);
      bar.appendChild(r); box.appendChild(bar);
      const img = $("img"); img.src = encodeURI(c.f); img.alt = c.en; box.appendChild(img);
    });
  }
  function renderCharts(body) {
    body.appendChild($("p", "ex-intro", "Your picture guides. Tap one to enlarge it; most open the matching 📚 Card for explanations, exercises and questions."));
    if (window.ParlaSheets) {
      const add = $("button", "ghost", "➕ Add a sheet"); add.onclick = () => ParlaSheets.openAdd(); body.appendChild(add);
      const mine = ParlaSheets.list();
      if (mine.length) {
        body.appendChild($("div", "section-label", "My added sheets"));
        const grid = $("div", "chart-grid");
        mine.forEach(s => {
          const d = $("div", "chart"); const img = $("img"); img.alt = s.card.title; d.appendChild(img);
          ParlaSheets.getImage(s.id).then(u => { if (u) img.src = u; });
          d.appendChild($("div", "chart-cap", s.card.title));
          d.onclick = () => ParlaCards.open(s.id);
          grid.appendChild(d);
        });
        body.appendChild(grid);
      }
    }
    const order = ["Verbs", "Grammar", "Everyday vocabulary", "Food & drink", "Culture & travel"];
    const groups = order.filter(g => GRAM.CHARTS.some(c => c.g === g)).concat([...new Set(GRAM.CHARTS.map(c => c.g))].filter(g => !order.includes(g)));
    groups.forEach(g => {
      body.appendChild($("div", "section-label", g));
      const grid = $("div", "chart-grid");
      GRAM.CHARTS.filter(c => c.g === g).forEach(c => {
        const d = $("div", "chart");
        const img = $("img"); img.loading = "lazy"; img.src = encodeURI(c.f); img.alt = c.en; d.appendChild(img);
        const cap = $("div", "chart-cap"); cap.innerHTML = `<b></b> — `; cap.querySelector("b").textContent = c.it; cap.appendChild(document.createTextNode(c.en));
        d.appendChild(cap);
        d.onclick = () => showChart(c);
        grid.appendChild(d);
      });
      body.appendChild(grid);
    });
  }

  /* ---------- Vocab (shares Grammatica's saved progress) ---------- */
  const V_WPD = 10, V_PPD = 5;
  let vSit = load("parla_gram_vsit", GRAM.V_ORDER[0]);
  let vState = load("itg.vocab.state", {});
  const vst = (k) => vState[k] || (vState[k] = { w: 0, p: 0, lastDate: null });
  const today = () => todayKey();
  const vSpeak = (it) => it.replace(/ \/ /g, " o ");
  function vocabQs(words, phrases, pool) {
    const qs = [];
    words.forEach(w => {
      const others = shuffle(pool.words.filter(x => x !== w)).slice(0, 3);
      const r = Math.random();
      if (r < .4) qs.push({ t: "mc", ask: "What does this mean?", q: w.it, o: [w.en, ...others.map(o => o.en)], s: vSpeak(w.it) });
      else if (r < .75) qs.push({ t: "mc", ask: "How do you say…", q: w.en, o: [w.it, ...others.map(o => o.it)], s: vSpeak(w.it) });
      else qs.push({ t: "tr", voc: true, q: w.en, a: w.it.split(" / ").concat([w.it]), s: vSpeak(w.it), en: null });
    });
    phrases.forEach(ph => {
      const others = shuffle(pool.phrases.filter(x => x !== ph)).slice(0, 3);
      qs.push({ t: "mc", ask: "Which phrase means…", q: ph.en, o: [ph.it, ...others.map(o => o.it)], s: vSpeak(ph.it) });
    });
    return shuffle(qs);
  }
  function renderVocab(body) {
    const seg = $("div", "segmented");
    GRAM.V_ORDER.forEach(k => { const b = $("button", k === vSit ? "active" : null, GRAM.VOCAB[k].menu); b.onclick = () => { vSit = k; save("parla_gram_vsit", k); render(false); }; seg.appendChild(b); });
    body.appendChild(seg);
    const S = GRAM.VOCAB[vSit], st = vst(vSit);
    body.appendChild($("p", "ex-intro", `${S.desc}. Learnt so far: ${Math.min(st.w, S.words.length)}/${S.words.length} words · ${Math.min(st.p, S.phrases.length)}/${S.phrases.length} phrases. Tap a row to reveal the English; 🔊 to hear it.`));
    const words = S.words.slice(st.w, st.w + V_WPD), phrases = S.phrases.slice(st.p, st.p + V_PPD);
    const doneToday = st.lastDate === today();
    if (doneToday) body.appendChild($("div", "v-daynote", "✓ You've learnt today's set here. A new set is ready tomorrow — or carry on now if you like."));
    const list = $("div", "learn-list");
    if (!words.length && !phrases.length) list.appendChild($("div", "v-done", "Bravissimo — you've learnt every word and phrase in this situation! Quiz yourself below."));
    if (words.length) list.appendChild($("div", "learn-sub", "Words"));
    words.forEach(w => list.appendChild(lrow(w, false)));
    if (phrases.length) list.appendChild($("div", "learn-sub", "Phrases"));
    phrases.forEach(p => list.appendChild(lrow(p, true)));
    body.appendChild(list);
    const acts = $("div", "gr-actions");
    if (words.length || phrases.length) {
      const q = $("button", "primary", "✏️ Quiz me on this set");
      q.onclick = () => ParlaExercises.startCustom(`🗣 ${S.menu}: this set`, vocabQs(words, phrases, S), { back: backTo("vocab"), backLabel: "📘 Back to Vocab", sheet: "Vocab-Sheets.xlsx · " + S.menu });
      acts.appendChild(q);
      const n = $("button", "ghost", "✓ Learnt — next set");
      n.onclick = () => { st.w = Math.min(S.words.length, st.w + V_WPD); st.p = Math.min(S.phrases.length, st.p + V_PPD); st.lastDate = today(); save("itg.vocab.state", vState); render(false); };
      acts.appendChild(n);
    }
    const learntW = S.words.slice(0, st.w), learntP = S.phrases.slice(0, st.p);
    if (learntW.length + learntP.length) {
      const all = $("button", "ghost", `✏️ Quiz everything learnt (${learntW.length + learntP.length})`);
      const gen = () => { const w = shuffle(learntW).slice(0, 9), p = shuffle(learntP).slice(0, 3); return vocabQs(w, p, S); };
      all.onclick = () => ParlaExercises.startCustom(`🗣 ${S.menu}: everything learnt`, gen(), { back: backTo("vocab"), backLabel: "📘 Back to Vocab", sheet: "Vocab-Sheets.xlsx · " + S.menu }, gen);
      acts.appendChild(all);
    }
    const ask = $("button", "ghost", "💬 Ask Giulia / all words");
    ask.onclick = () => ParlaCards.openCustom({ id: "vocab_" + vSit, icon: "🗣", title: `${S.menu} — ${S.desc}`, sheet: "Vocab-Sheets.xlsx", intro: `All ${S.words.length} words and ${S.phrases.length} phrases for this situation.`,
      points: [], tables: [["phrases", S.phrases.map(p => [p.it, p.en])], ["words", S.words.map(w => [w.it, w.en])]], watch: [],
      text: `Vocabulary for: ${S.desc}. Phrases: ` + S.phrases.map(p => `${p.it} = ${p.en}`).join("; ") + ". Words: " + S.words.map(w => `${w.it} = ${w.en}`).join("; "),
      topic: { directions: "indicazioni", shopping: "shopping", cafe: "ristorante", meeting: "free" }[vSit], onBack: () => open("vocab"), backLabel: "← Back to Vocab" });
    acts.appendChild(ask);
    body.appendChild(acts);
  }
  function lrow(item, phrase) {
    const r = $("div", "lrow veiled" + (phrase ? " phrase" : ""));
    r.appendChild($("span", "it", item.it));
    r.appendChild($("span", "en", item.en));
    const sp = makeReplay(vSpeak(item.it)); sp.classList.add("spk");
    r.appendChild(sp);
    r.addEventListener("click", (e) => { if (!e.target.closest(".replay")) r.classList.toggle("veiled"); });
    return r;
  }

  const btn = el("gramBtn");
  if (btn) btn.addEventListener("click", () => open());
  window.ParlaGram = { open, close, units: U, forms, chartsFor, showChart, showUnit: unit, _q: { formQ, tableQ, endingQ, personQ, tenseQ, listenQ, mix } };
})();
