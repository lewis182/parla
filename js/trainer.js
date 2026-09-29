/* Parla — 🎙 Conjugation trainer (📘 Grammatica → Trainer).
   Learn one verb in one tense at a time, using Grammatica's checked verb tables:
   parlare (-are), credere (-ere), dormire (-ire), capire (-ire isc) and the 14 irregulars,
   in presente, passato prossimo, imperfetto, futuro, condizionale and congiuntivo.
   Five steps per square:
     1 Listen   — Giulia reads the six forms (endings highlighted), slowly then at normal speed
     2 Repeat   — she says each form, you say it back; the mic checks you (hands-free)
     3 Say it   — she says only the person (noi…), you say the form from memory
     4 Write    — type all six forms
     5 Test     — 10 mixed questions (written, listening, 🎤)
   (classic script; shares globals with the other js/ files; loads after grammatica.js) */
(function () {
  const $ = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const stripAcc = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "");
  const P = GRAM.PRONOUNS, TL = GRAM.tenseLabels;
  const TENSES = ["presente", "passato", "imperfetto", "futuro", "condizionale", "congiuntivo"];
  const say = (p) => (p === "lui / lei" ? "lui" : p);
  const STEPS = [["listen", "1 · Listen"], ["repeat", "2 · Repeat"], ["say", "3 · Say it"], ["write", "4 · Write"], ["test", "5 · Test"]];
  const PASS = 80;
  let prog = load("parla_trainer", {});              // { "parlare|presente": { listen: 100, repeat: 83, … } }
  const key = (inf, t) => inf + "|" + t;
  const cell = (inf, t) => prog[key(inf, t)] || (prog[key(inf, t)] = {});
  const doneCount = (inf, t) => STEPS.filter(([s]) => (prog[key(inf, t)] || {})[s] >= PASS).length;
  const famOf = (v) => !v.badge ? "irr" : v.badge.startsWith("-are") ? "are" : v.badge.startsWith("-ere") ? "ere" : "ire";

  /* ---------- a verb's six forms, split into stem + ending ---------- */
  function rows(v, tense) {
    const forms = GRAM.formsFor(v, tense);
    return forms.map((f, i) => {
      const alts = f.includes(" / ") ? (() => { const [a, b] = f.split(" / "); const lead = a.split(" ").slice(0, -1).join(" "); return [a, (lead ? lead + " " : "") + b]; })() : [f];
      let stem = f, end = "";
      if (tense === "passato") { const sp = alts[0].split(" "); stem = sp[0] + " "; end = f.slice(stem.length); }
      else if (v.badge) {
        const E = GRAM.ENDINGS[tense];
        const col = v.badge.includes("isc") && E.cols.includes("-ire (isc)") ? E.cols.indexOf("-ire (isc)") : E.cols.indexOf("-" + famOf(v));
        const e = col >= 0 ? E.rows[i][col].replace(/^-/, "") : "";
        if (e && f.endsWith(e)) { stem = f.slice(0, f.length - e.length); end = e; }
      }
      const pre = tense === "congiuntivo" ? "che " : "";          // subjunctive is practised as "che io parli"
      return { who: pre + P[i], pron: say(P[i]), form: f, alts, stem, end, speak: `${pre}${say(P[i])} ${alts[0]}` };
    });
  }
  function endingsLine(v, tense) {
    if (tense === "passato") return v.aux === "essere"
      ? `essere (sono, sei, è, siamo, siete, sono) + ${v.part} — agrees: -o / -a / -i / -e`
      : `avere (ho, hai, ha, abbiamo, avete, hanno) + ${v.part}`;
    if (!v.badge) return "Irregular — learn the six forms as a set.";
    return "Endings: " + rows(v, tense).map(r => "-" + r.end).join(", ");
  }

  /* ---------- the grid ---------- */
  function render(body) {
    stop();
    body.appendChild($("p", "ex-intro", "Learn each verb one tense at a time: listen, repeat aloud, say it from memory, write it, then a short test. Pick any square — do them in any order. Uses Grammatica's verb tables."));
    const next = (() => { for (const v of GRAM.ALL) for (const t of TENSES) if (doneCount(v.inf, t) < STEPS.length) return [v, t]; return null; })();
    if (next) { const b = $("button", "primary", `▶ Continue: ${next[0].inf} · ${TL[next[1]]}`); b.onclick = () => showLesson(next[0].inf, next[1]); body.appendChild(b); }
    [["Regular families", GRAM.REGULAR], ["Irregular verbs", GRAM.IRREGULAR]].forEach(([title, verbs]) => {
      body.appendChild($("div", "section-label", title));
      const wrap = $("div", "tr-wrap");
      const t = $("table", "tr-grid");
      const hr = $("tr"); hr.appendChild($("th", null, ""));
      TENSES.forEach(tn => hr.appendChild($("th", null, TL[tn].replace("Passato prossimo", "Passato"))));
      t.appendChild(hr);
      verbs.forEach(v => {
        const tr = $("tr");
        const th = $("th", "v fam-" + famOf(v));
        th.appendChild($("b", null, v.inf)); th.appendChild($("span", null, v.badge || "irregular"));
        tr.appendChild(th);
        TENSES.forEach(tn => {
          const n = doneCount(v.inf, tn);
          const b = $("button", "tr-cell" + (n === STEPS.length ? " done" : n ? " part" : ""), n === STEPS.length ? "✓" : n ? `${n}/5` : "·");
          b.title = `${v.inf} · ${TL[tn]} — ${n}/5 steps`;
          b.onclick = () => showLesson(v.inf, tn);
          const td = $("td"); td.appendChild(b); tr.appendChild(td);
        });
        t.appendChild(tr);
      });
      wrap.appendChild(t);
      body.appendChild(wrap);
    });
  }

  /* ---------- a lesson: one verb, one tense ---------- */
  let cur = null, running = false, heardHandler = null, rowEls = [], statusEl = null;
  function stop() {
    running = false; heardHandler = null;
    try { if (recognizing) cancelRecording(); } catch {}
    try { speechSynthesis.cancel(); } catch {}
    rowEls.forEach(r => r.classList.remove("now"));
  }
  const setStatus2 = (t) => { if (statusEl) statusEl.textContent = t; };
  function showLesson(inf, tense, step) {
    stop();
    const v = GRAM.ALL.find(x => x.inf === inf);
    const R = rows(v, tense);
    cur = { v, tense, R, step: step || firstOpenStep(inf, tense) };
    const p = el("gramPanel"); p.innerHTML = "";
    const top = $("div", "ex-top");
    top.appendChild($("h2", null, `🎙 ${inf} · ${TL[tense]}`));
    const bk = $("button", "ghost", "← Trainer"); bk.onclick = () => { stop(); ParlaGram.open("trainer"); }; top.appendChild(bk);
    p.appendChild(top);
    // tense navigation
    const nav = $("div", "cd-nav");
    const ti = TENSES.indexOf(tense);
    const pv = $("button", "ghost", "‹ " + (ti ? TL[TENSES[ti - 1]] : "")); pv.disabled = !ti; pv.onclick = () => showLesson(inf, TENSES[ti - 1]);
    const nx = $("button", "ghost", (ti < 5 ? TL[TENSES[ti + 1]] : "") + " ›"); nx.disabled = ti === 5; nx.onclick = () => showLesson(inf, TENSES[ti + 1]);
    nav.appendChild(pv); nav.appendChild($("span", "cd-pos", `${v.gloss} · ${v.badge || "irregular"}`)); nav.appendChild(nx);
    p.appendChild(nav);
    // the table
    const card = $("div", "tr-card fam-" + famOf(v));
    card.appendChild($("div", "tr-sub", tense === "passato" ? endingsLine(v, tense) : (GRAM.TENSE_INTRO[tense] ? GRAM.TENSE_INTRO[tense] + " " : "") + (v.badge ? "" : "")));
    if (tense !== "passato" && v.badge) card.appendChild($("div", "tr-ends", endingsLine(v, tense)));
    const tb = $("div", "tr-table");
    rowEls = R.map((r, i) => {
      const row = $("div", "tr-row");
      row.appendChild($("span", "who", r.who));
      const f = $("span", "tform");
      f.appendChild($("span", "stem", r.stem)); f.appendChild($("span", "end", r.end));
      row.appendChild(f);
      const mark = $("span", "mark"); row.appendChild(mark);
      row.appendChild(makeReplay(r.speak));
      tb.appendChild(row);
      return row;
    });
    card.appendChild(tb);
    p.appendChild(card);
    // step tabs
    const steps = $("div", "tr-steps");
    STEPS.forEach(([s, label]) => {
      const sc = cell(inf, tense)[s];
      const b = $("button", (s === cur.step ? "active " : "") + (sc >= PASS ? "ok" : ""), label + (sc >= PASS ? " ✓" : sc != null ? ` ${sc}%` : ""));
      b.onclick = () => { stop(); cur.step = s; showLesson(inf, tense, s); };
      steps.appendChild(b);
    });
    p.appendChild(steps);
    const area = $("div", "tr-area"); p.appendChild(area);
    statusEl = $("div", "tr-status"); p.appendChild(statusEl);
    ({ listen: stepListen, repeat: () => stepEcho("repeat"), say: () => stepEcho("say"), write: stepWrite, test: stepTest })[cur.step](area);
    window.scrollTo(0, 0);
  }
  const firstOpenStep = (inf, t) => (STEPS.find(([s]) => !((prog[key(inf, t)] || {})[s] >= PASS)) || STEPS[0])[0];
  function record(step, score) {
    const c = cell(cur.v.inf, cur.tense);
    c[step] = Math.max(c[step] || 0, score);
    c.when = Date.now();
    save("parla_trainer", prog);
    try { bumpActivity(); } catch {}
  }
  function afterStep(area, score, step) {
    record(step, score);
    document.querySelectorAll("#gramPanel .tr-steps button").forEach((b, j) => {         // refresh the step tabs
      const [s, label] = STEPS[j], sc = cell(cur.v.inf, cur.tense)[s];
      b.textContent = label + (sc >= PASS ? " ✓" : sc != null ? ` ${sc}%` : ""); b.classList.toggle("ok", sc >= PASS);
    });
    const i = STEPS.findIndex(([s]) => s === step);
    const box = $("div", "tr-after");
    box.appendChild($("div", score >= PASS ? "ok" : "no", score >= PASS ? `✓ ${score}% — well done.` : `${score}% — ${PASS}% completes this step. Have another go.`));
    const again = $("button", "ghost", "↻ Again"); again.onclick = () => showLesson(cur.v.inf, cur.tense, step);
    box.appendChild(again);
    if (i < STEPS.length - 1) { const n = $("button", "primary", `Next: ${STEPS[i + 1][1]} ›`); n.onclick = () => showLesson(cur.v.inf, cur.tense, STEPS[i + 1][0]); box.appendChild(n); }
    else { const n = $("button", "primary", "Back to the trainer"); n.onclick = () => ParlaGram.open("trainer"); box.appendChild(n); }
    area.appendChild(box);
  }
  const hi = (i) => rowEls.forEach((r, j) => r.classList.toggle("now", j === i));
  const speak1 = (text, rate, cb) => speakParts([{ text, rate }], { autoListen: false, onDone: cb });

  /* 1 · Listen */
  function stepListen(area) {
    area.appendChild($("p", "tr-help", "Listen to the six forms in order and follow the table — notice how only the ending changes. Say them quietly along with Giulia."));
    const bar = $("div", "row");
    const play = (rate, after) => {
      stop(); running = true;
      let i = 0;
      const nextRow = () => {
        if (!running) return;
        if (i >= 6) { hi(-1); running = false; after && after(); return; }
        hi(i); speak1(cur.R[i].speak, rate, () => setTimeout(nextRow, rate < .8 ? 450 : 250));
        i++;
      };
      nextRow();
    };
    const slow = $("button", "primary", "▶ Slowly, then normal speed");
    slow.onclick = () => play(0.7, () => setTimeout(() => { running = true; play(0.95, () => { setStatus2("Heard it twice. Now step 2 — repeat after Giulia."); afterStep(area, 100, "listen"); }); }, 600));
    const normal = $("button", "ghost", "▶ Normal speed"); normal.onclick = () => play(0.95, () => afterStep(area, 100, "listen"));
    const st = $("button", "ghost", "■ Stop"); st.onclick = stop;
    bar.appendChild(slow); bar.appendChild(normal); bar.appendChild(st);
    area.appendChild(bar);
  }

  /* 2 · Repeat  and  3 · Say it — hands-free, mic-checked */
  function matches(heard, r) {
    const h = normalizePhrase(stripAcc(heard));
    const cands = r.alts.flatMap(a => [`che ${r.pron} ${a}`, `${r.pron} ${a}`, a]).map(c => normalizePhrase(stripAcc(c)));
    return Math.max(...cands.map(c => similarity(h, c))) >= 0.8;
  }
  function stepEcho(mode) {
    const area = document.querySelector("#gramPanel .tr-area");
    const hide = mode === "say";
    if (hide) rowEls.forEach(r => r.classList.add("hide"));
    area.appendChild($("p", "tr-help", mode === "repeat"
      ? "Giulia says each form; you say it back straight after. The mic stops by itself when you pause. Two tries per form."
      : "Now from memory: Giulia says the person (io, tu…) and you say the whole form. If you miss it she says it and you try again."));
    const bar = $("div", "row");
    const go = $("button", "primary", mode === "repeat" ? "▶ Start repeating" : "▶ Start");
    const st = $("button", "ghost", "■ Stop"); st.onclick = () => { stop(); setStatus2("Stopped."); };
    bar.appendChild(go); bar.appendChild(st); area.appendChild(bar);
    if (!navigator.mediaDevices || !window.MediaRecorder) { area.appendChild($("p", "err", "This browser can't record audio — use Edge, Chrome or Safari.")); go.disabled = true; return; }
    go.onclick = () => {
      stop(); running = true; go.disabled = true;
      rowEls.forEach(r => { r.classList.remove("ok", "no"); r.querySelector(".mark").textContent = ""; });
      let i = 0, attempt = 0, score = 0;
      const finish = () => {
        running = false; hi(-1); go.disabled = false;
        rowEls.forEach(r => r.classList.remove("hide"));
        const pct = Math.round(score / 6 * 100);
        setStatus2(`${Math.round(score * 10) / 10} / 6`);
        afterStep(area, pct, mode);
      };
      const turn = () => {
        if (!running) return;
        if (i >= 6) return finish();
        const r = cur.R[i];
        hi(i);
        if (mode === "repeat") speak1(r.speak, attempt ? 0.7 : 0.85, listen);
        else if (attempt) speak1(r.speak, 0.75, listen);           // she gives the answer, you repeat it
        else speak1(r.who.replace("lui / lei", "lui"), 0.95, listen);
      };
      const listen = () => {
        if (!running) return;
        setStatus2(`🎙 Your turn — ${mode === "say" && !attempt ? cur.R[i].who + " …?" : "say: " + cur.R[i].speak}`);
        heardHandler = (text) => {
          if (!running) return;
          const r = cur.R[i], row = rowEls[i];
          if (text && matches(text, r)) {
            score += attempt ? 0.5 : 1;
            row.classList.add("ok"); row.classList.remove("hide");
            row.querySelector(".mark").textContent = attempt ? "✓ (2nd go)" : "✓";
            setStatus2(`✓ ${text}`);
            i++; attempt = 0; setTimeout(turn, 350);
            return;
          }
          const tips = text ? pronTips(r.speak, text) : [];
          attempt++;
          if (attempt < 2) {
            setStatus2(text ? `Heard “${text}”${tips.length ? " — " + tips[0] : ""}. Listen and try again.` : "Didn't hear you — listen and try again.");
            setTimeout(turn, 400);
          } else {
            row.classList.add("no"); row.classList.remove("hide");
            row.querySelector(".mark").textContent = text ? `✗ heard “${text}”` : "✗";
            i++; attempt = 0; setTimeout(turn, 500);
          }
        };
        recordMode = "trainer";
        startRecording();
      };
      turn();
    };
  }

  /* 4 · Write */
  function stepWrite(area) {
    area.appendChild($("p", "tr-help", "Cover the table (it's hidden now) and type all six forms. Accents: use the buttons, or leave them off — you'll be told."));
    rowEls.forEach(r => r.classList.add("hide"));
    const grid = $("div", "tr-write");
    const inputs = cur.R.map(r => {
      const l = $("label", null); l.appendChild($("span", "who", r.who));
      const inp = $("input", "ex-in"); Object.assign(inp, { type: "text", autocomplete: "off", spellcheck: false }); inp.setAttribute("autocapitalize", "off"); inp.setAttribute("autocorrect", "off"); inp.lang = "it";
      l.appendChild(inp); grid.appendChild(l); return inp;
    });
    let focused = inputs[0];
    inputs.forEach((inp, i) => { inp.onfocus = () => { focused = inp; }; inp.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); (inputs[i + 1] || chk).focus(); } }; });
    area.appendChild(grid);
    const acc = $("div", "ex-acc");
    ["à", "è", "é", "ì", "ò", "ù"].forEach(ch => { const b = $("button", "ghost", ch); b.onmousedown = e => e.preventDefault(); b.onclick = () => { const s = focused.selectionStart ?? focused.value.length; focused.value = focused.value.slice(0, s) + ch + focused.value.slice(focused.selectionEnd ?? s); focused.focus(); focused.setSelectionRange(s + 1, s + 1); }; acc.appendChild(b); });
    area.appendChild(acc);
    const chk = $("button", "primary", "Check");
    chk.onclick = () => {
      let score = 0;
      inputs.forEach((inp, i) => {
        const r = cur.R[i], g = normalizePhrase(inp.value), row = rowEls[i];
        const exact = r.alts.some(a => normalizePhrase(a) === g), near = r.alts.some(a => stripAcc(normalizePhrase(a)) === stripAcc(g));
        inp.disabled = true;
        row.classList.remove("hide");
        if (exact || near) { score += 1; row.classList.add("ok"); row.querySelector(".mark").textContent = exact ? "✓" : "✓ watch the accent"; }
        else { row.classList.add("no"); row.querySelector(".mark").textContent = inp.value ? `✗ you wrote “${inp.value}”` : "✗"; }
      });
      chk.disabled = true;
      afterStep(area, Math.round(score / 6 * 100), "write");
    };
    area.appendChild(chk);
    setTimeout(() => inputs[0].focus(), 50);
  }

  /* 5 · Test — mixed questions on the exercise engine */
  function stepTest(area) {
    area.appendChild($("p", "tr-help", "Ten mixed questions on this verb and tense: type the form, fill the table, pick the ending, who is it?, listen and type. 🎤 works on typed questions too."));
    const go = $("button", "primary", "▶ Start the test");
    const { inf } = cur.v, tense = cur.tense;
    const Q = ParlaGram._q;
    const gen = () => Q.mix(10, [Q.formQ, Q.formQ, Q.tableQ, Q.personQ, Q.listenQ].concat(cur.v.badge && tense !== "passato" ? [Q.endingQ, Q.endingQ] : []), [inf], [tense]);
    go.onclick = () => ParlaExercises.startCustom(`🎙 ${inf} · ${TL[tense]}`, gen(), {
      sheet: "Grammatica verb tables",
      back: () => { ParlaGram.open("trainer"); showLesson(inf, tense, "test"); }, backLabel: "🎙 Back to the trainer",
      onDone: (pct) => { const c = cell(inf, tense); c.test = Math.max(c.test || 0, pct); c.when = Date.now(); save("parla_trainer", prog); },
    }, gen);
    area.appendChild(go);
  }

  window.ParlaTrainer = {
    render, showLesson, stop, rows,
    heard: (text) => { const fn = heardHandler; heardHandler = null; if (fn) fn(text); },
  };
})();
