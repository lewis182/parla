/* Parla — 📈 Progress: stats, weakest areas, spending, past conversations, backup/restore
   (classic script; shares globals with the other js/ files, load order matters) */

/* ---------- saved conversations ---------- */
const LS_CONVOS = "parla_convos", MAX_CONVOS = 30;
let currentConvo = null;
function loadJSON(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } }
function saveJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

function startConvo() {
  currentConvo = { id: Date.now(), when: Date.now(), topic, level: el("level").value, msgs: [] };
}
function logConvo(m) {
  if (!currentConvo) startConvo();
  currentConvo.msgs.push(m);
  if (m.role === "user") archiveConvo();          // save as you go, so nothing is lost if the tab closes
}
// Store (or update) the current conversation — only once you've actually said something.
function archiveConvo() {
  if (!currentConvo || !currentConvo.msgs.some(m => m.role === "user")) return;
  const all = loadJSON(LS_CONVOS, []).filter(c => c.id !== currentConvo.id);
  all.unshift(JSON.parse(JSON.stringify(currentConvo)));
  saveJSON(LS_CONVOS, all.slice(0, MAX_CONVOS));
}

/* ---------- which grammar areas trip you up in conversation ---------- */
function countMistakeArea(id) {
  const m = loadJSON("parla_mistake_areas", {});
  m[id] = (m[id] || 0) + 1;
  saveJSON("parla_mistake_areas", m);
}

/* ---------- panel ---------- */
(function () {
  const $ = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const topicLabel = (id) => { const o = document.querySelector(`#topicSel option[value="${id}"]`); return o ? (o.dataset.label || o.textContent).replace(/^✓ /, "") : id; };
  const dayName = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

  function streakBest() {
    const days = Object.keys(stats).filter(k => stats[k] >= 1).sort();
    let best = 0, run = 0, prev = null;
    days.forEach(k => {
      const d = new Date(k + "T12:00:00");
      run = prev && Math.round((d - prev) / 86400000) === 1 ? run + 1 : 1;
      best = Math.max(best, run);
      prev = d;
    });
    return best;
  }
  function lastNDays(n) {
    const out = [];
    for (let i = n - 1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); out.push({ d, k: dayKey(d), min: Math.round(stats[dayKey(d)] || 0) }); }
    return out;
  }

  function open() {
    if (window.exActive && window.ParlaExercises) ParlaExercises.close();
    speechSynthesis.cancel();
    try { if (recognizing) cancelRecording(); } catch {}
    ["stage", "micbar", "voicePanel", "setup"].forEach(id => el(id).classList.add("hidden"));
    chatEl.classList.add("hidden");
    archiveConvo();
    render();
    el("progressPanel").classList.remove("hidden");
    window.scrollTo(0, 0);
  }
  function close() {
    el("progressPanel").classList.add("hidden");
    ["stage", "micbar"].forEach(id => el(id).classList.remove("hidden"));
    chatEl.classList.remove("hidden");
  }

  function tile(value, label, sub) {
    const t = $("div", "pg-tile");
    t.appendChild($("div", "v", value));
    t.appendChild($("div", "l", label));
    if (sub) t.appendChild($("div", "s", sub));
    return t;
  }
  function section(title) { const s = $("section", "pg-sec"); s.appendChild($("h3", null, title)); return s; }

  function render() {
    const p = el("progressPanel");
    p.innerHTML = "";
    const top = $("div", "ex-top");
    top.appendChild($("h2", null, "📈 Your progress"));
    const back = $("button", "ghost", "← Back to Giulia"); back.onclick = close; top.appendChild(back);
    p.appendChild(top);

    /* headline numbers */
    const days14 = lastNDays(14), week = days14.slice(-7).reduce((a, x) => a + x.min, 0);
    const total = Math.round(Object.values(stats).reduce((a, x) => a + x, 0));
    const due = vocabDue().length, mastered = vocab.filter(v => v.interval >= 20).length;
    const exScores = loadJSON("parla_ex_scores", {});
    const sets = (typeof EX_SETS !== "undefined") ? EX_SETS : [];
    const tried = sets.filter(s => exScores[s.id]);
    const avgBest = tried.length ? Math.round(tried.reduce((a, s) => a + exScores[s.id].best, 0) / tried.length) : null;
    const tiles = $("div", "pg-tiles");
    tiles.appendChild(tile("🔥 " + streakDays(), "day streak", "best " + streakBest()));
    tiles.appendChild(tile(week + " min", "this week", total + " min in total"));
    tiles.appendChild(tile(String(vocab.length), "words saved", `${due} due · ${mastered} well known`));
    tiles.appendChild(tile(tried.length + "/" + sets.length, "exercise sets tried", avgBest == null ? "none yet" : "average best " + avgBest + "%"));
    p.appendChild(tiles);

    /* minutes per day — one series, one hue, hover/tap for the value */
    const s1 = section("Minutes practised — last 14 days");
    const chart = $("div", "pg-bars");
    chart.setAttribute("role", "img");
    chart.setAttribute("aria-label", "Minutes practised per day: " + days14.map(x => dayName(x.d) + " " + x.min).join(", "));
    const max = Math.max(10, ...days14.map(x => x.min));
    const tip = $("div", "pg-tip hidden");
    days14.forEach(x => {
      const col = $("div", "pg-col");
      const bar = $("div", "pg-bar" + (x.min ? "" : " zero"));
      bar.style.height = Math.max(x.min ? 4 : 2, Math.round(x.min / max * 100)) + "%";
      col.appendChild(bar);
      col.appendChild($("div", "pg-x", x.d.toLocaleDateString("en-GB", { weekday: "narrow" })));
      const show = () => { tip.textContent = `${dayName(x.d)} — ${x.min} min`; tip.classList.remove("hidden"); tip.style.left = (col.offsetLeft + col.offsetWidth / 2) + "px"; };
      col.addEventListener("mouseenter", show);
      col.addEventListener("click", show);
      col.addEventListener("mouseleave", () => tip.classList.add("hidden"));
      chart.appendChild(col);
    });
    chart.appendChild(tip);
    s1.appendChild(chart);
    s1.appendChild($("div", "pg-note", `Most in one day: ${Math.max(...days14.map(x => x.min))} min. A day counts towards the streak after 1 minute.`));
    p.appendChild(s1);

    /* what to work on */
    const s2 = section("What to work on");
    const areas = loadJSON("parla_mistake_areas", {});
    const rows = [];
    tried.forEach(s => rows.push({ id: s.id, title: s.title, why: `exercise best ${exScores[s.id].best}%`, score: exScores[s.id].best }));
    Object.entries(areas).forEach(([id, n]) => {
      const s = sets.find(x => x.id === id); if (!s) return;
      const r = rows.find(x => x.id === id);
      const why = `${n} slip${n > 1 ? "s" : ""} in conversation`;
      if (r) { r.why += " · " + why; r.score -= n * 5; } else rows.push({ id, title: s.title, why, score: 100 - n * 10 });
    });
    rows.sort((a, b) => a.score - b.score);
    const weak = rows.filter(r => r.score < 90).slice(0, 6);
    if (!weak.length) s2.appendChild($("div", "pg-note", rows.length ? "Nothing weak so far — bravissimo! Try a set you haven't done yet." : "Do a few exercise sets and conversations — the areas that need attention will show up here."));
    weak.forEach(r => {
      const row = $("div", "pg-row");
      const txt = $("div"); txt.appendChild($("div", "t", r.title)); txt.appendChild($("div", "s", r.why));
      row.appendChild(txt);
      const b = $("button", "ghost", "🏋️ Practise"); b.onclick = () => { close(); ParlaExercises.openSet(r.id); };
      row.appendChild(b);
      s2.appendChild(row);
    });
    p.appendChild(s2);

    /* spending */
    const s3 = section("OpenRouter spending (tutor replies)");
    const costLogNow = costLog;
    const sumUSD = (keys) => keys.reduce((a, k) => a + ((costLogNow[k] && costLogNow[k].usd) || 0), 0);
    const allKeys = Object.keys(costLogNow);
    const last7 = lastNDays(7).map(x => x.k);
    const ct = $("div", "pg-tiles");
    ct.appendChild(tile(fmtUSD(sumUSD([todayKey()])), "today"));
    ct.appendChild(tile(fmtUSD(sumUSD(last7)), "last 7 days"));
    ct.appendChild(tile(fmtUSD(sumUSD(allKeys)), "since tracking began"));
    s3.appendChild(ct);
    const tts = allKeys.reduce((a, k) => a + (costLogNow[k].ttsChars || 0), 0), stt = allKeys.reduce((a, k) => a + (costLogNow[k].sttClips || 0), 0);
    s3.appendChild($("div", "pg-note", `Also used: ${stt} voice clips transcribed${tts ? `, ${tts.toLocaleString()} characters of premium voice` : ""}. Those are billed by OpenRouter too — see openrouter.ai/activity for exact totals.`));
    p.appendChild(s3);

    /* past conversations */
    const s4 = section("Past conversations");
    const convos = loadJSON(LS_CONVOS, []);
    if (!convos.length) s4.appendChild($("div", "pg-note", "Your conversations will be kept here (the last " + MAX_CONVOS + ")."));
    const view = $("div");
    convos.forEach(c => {
      const row = $("div", "pg-row");
      const turns = c.msgs.filter(m => m.role === "user").length, fixes = c.msgs.filter(m => m.fix).length;
      const txt = $("div");
      txt.appendChild($("div", "t", topicLabel(c.topic)));
      txt.appendChild($("div", "s", `${new Date(c.when).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · ${turns} turn${turns === 1 ? "" : "s"} · ${fixes} correction${fixes === 1 ? "" : "s"}`));
      row.appendChild(txt);
      const b = $("button", "ghost", "Read");
      b.onclick = () => showConvo(c, view);
      row.appendChild(b);
      s4.appendChild(row);
    });
    s4.appendChild(view);
    p.appendChild(s4);

    /* backup */
    const s5 = section("Move your progress between devices");
    s5.appendChild($("div", "pg-note", "Export saves your words, scores, streak and conversations to a file (your API key is NOT included). Import it on the other device — it replaces that device's progress."));
    const brow = $("div", "row");
    const ex = $("button", "ghost", "⬇ Export progress"); ex.onclick = exportProgress;
    const imp = $("button", "ghost", "⬆ Import progress…");
    const file = $("input"); file.type = "file"; file.accept = ".json,application/json"; file.style.display = "none";
    imp.onclick = () => file.click();
    file.onchange = () => file.files[0] && importProgress(file.files[0]);
    brow.appendChild(ex); brow.appendChild(imp); brow.appendChild(file);
    s5.appendChild(brow);
    p.appendChild(s5);
  }

  function showConvo(c, view) {
    view.innerHTML = "";
    const card = $("div", "grammar-card");
    card.appendChild($("div", "g-label", "🗂 " + topicLabel(c.topic) + " · " + new Date(c.when).toLocaleDateString("en-GB")));
    c.msgs.forEach(m => {
      const line = $("div", "pg-line " + m.role);
      line.appendChild($("b", null, m.role === "user" ? "You: " : "Giulia: "));
      line.appendChild(document.createTextNode(m.it || ""));
      if (m.role !== "user" && m.it) line.appendChild(makeReplay(m.it));
      if (m.en) line.appendChild($("div", "s", m.en));
      if (m.fix) { const f = $("div", "correction"); f.appendChild($("b", null, "✏️ Say: ")); f.appendChild(document.createTextNode(m.fix)); f.appendChild(makeReplay(m.fix)); line.appendChild(f); }
      card.appendChild(line);
    });
    view.appendChild(card);
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function exportProgress() {
    archiveConvo();
    const data = { app: "parla", version: 1, exported: new Date().toISOString(), data: {} };
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith("parla_") && k !== "parla_or_key") data.data[k] = localStorage.getItem(k);
    }
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "parla-progress-" + todayKey() + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
  function importProgress(f) {
    const r = new FileReader();
    r.onload = () => {
      let data;
      try { data = JSON.parse(r.result); } catch { alertBox("That file isn't a Parla progress file."); return; }
      if (!data || data.app !== "parla" || !data.data) { alertBox("That file isn't a Parla progress file."); return; }
      if (!confirm("Replace this device's Parla progress with the file from " + (data.exported || "").slice(0, 10) + "?")) return;
      Object.keys(data.data).forEach(k => { if (k.startsWith("parla_") && k !== "parla_or_key") localStorage.setItem(k, data.data[k]); });
      location.reload();
    };
    r.readAsText(f);
  }
  function alertBox(msg) { const n = el("progressPanel").querySelector(".pg-note:last-of-type"); if (n) n.textContent = "⚠️ " + msg; }

  // save the conversation if the tab is closed or hidden (e.g. switching apps on iPad)
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") archiveConvo(); });
  window.addEventListener("pagehide", archiveConvo);

  const btn = el("progressBtn");
  if (btn) btn.addEventListener("click", open);
  window.ParlaProgress = { open, close, render };
})();
