/* Parla — 📚 Cards: study one reference card at a time.
   Learn (the card) → Explain (Giulia teaches it) → Quiz (Giulia tests you in the chat)
   → Test (the card's exercise set) → Ask (any question about the card, typed or spoken).
   The Q&A for each card is saved, so you can come back to it.
   (classic script; shares globals with the other js/ files; loads after exercises.js) */
(function () {
  const LS_STATE = "parla_cards", LS_CHATS = "parla_card_chats";
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const $ = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  let state = load(LS_STATE, {});          // { id: { studied: true, when } }
  let chats = load(LS_CHATS, {});          // { id: [ { role: "user"|"assistant", content } ] }
  let current = null, busy = false, heardHandler = null;

  /* ---------- build the cards: authored text + generated ones for phrases / words / culture ---------- */
  function buildCards() {
    return EX_SETS.map(set => {
      const t = CARD_TEXT[set.id];
      const card = { id: set.id, title: set.title, group: set.group, sheet: set.sheet, level: set.level, topic: set.topic, set };
      if (t) return { ...card, ...t };
      if (set.vocab) return { ...card, intro: "Vocabulary from the sheet. Tap 🔊 to hear each word.", points: [], tables: [["words", set.vocab.map(([it, en]) => [it, en])]], watch: [] };
      const items = set.items || [];
      if (items.every(q => q.t === "tr")) return { ...card, intro: "Useful phrases from the sheet. Tap 🔊, say them aloud, then test yourself.", points: [], tables: [["phrases", items.map(q => [q.a[0], q.q])]], watch: [] };
      // mixed phrase / coffee / culture sets → one row per fact
      const rows = items.map(q => {
        if (q.t === "tr") return [q.a[0], q.q];
        if (q.s && q.s !== q.q) return [q.s.replace(/, per favore\.$/, ""), q.q];
        if (q.t === "gap") return [q.q.replace("___", q.a[0]), q.en || ""];
        const ans = q.o[0];
        return [q.q.includes("…") ? q.q.replace("…", " " + ans).replace(/\s+/g, " ") : q.q + " → " + ans, q.en || ""];
      });
      const notes = items.map(q => q.x).filter(Boolean);
      return { ...card, intro: set.id === "caffe" ? "How to order coffee in Italy." : "Facts from the sheet.", points: notes, tables: [["", rows]], watch: [] };
    });
  }
  let CARDS = null;
  const cards = () => CARDS || (CARDS = buildCards());
  const cardById = (id) => cards().find(c => c.id === id);

  // Plain-text version of a card, given to Giulia so she answers about exactly this card.
  function cardText(c) {
    const out = [`CARD: ${c.title} (from the sheet(s): ${c.sheet}; level ${c.level})`, c.intro || ""];
    if (c.points && c.points.length) out.push("Key points:", ...c.points.map(p => "- " + p));
    (c.tables || []).forEach(([title, rows]) => { out.push((title || "Examples") + ":"); rows.slice(0, 40).forEach(([it, en]) => out.push(`- ${it} = ${en}`)); });
    if (c.watch && c.watch.length) out.push("Watch out:", ...c.watch.map(w => "- " + w));
    return out.join("\n");
  }

  /* ---------- panel plumbing ---------- */
  const panel = () => el("cardsPanel");
  function open(id) {
    if (window.exActive && window.ParlaExercises) ParlaExercises.close();
    speechSynthesis.cancel();
    try { if (recognizing) cancelRecording(); } catch {}
    ["stage", "micbar", "voicePanel", "setup", "progressPanel", "exPanel"].forEach(x => el(x) && el(x).classList.add("hidden"));
    chatEl.classList.add("hidden");
    panel().classList.remove("hidden");
    window.cardsActive = true;
    if (id && cardById(id)) showCard(id); else showList();
  }
  function close() {
    stopMic();
    window.cardsActive = false;
    speechSynthesis.cancel();
    panel().classList.add("hidden");
    ["stage", "micbar"].forEach(x => el(x).classList.remove("hidden"));
    chatEl.classList.remove("hidden");
  }
  const stopMic = () => { heardHandler = null; try { if (recognizing) cancelRecording(); } catch {} };
  function top(title, backLabel, onBack) {
    const t = $("div", "ex-top");
    t.appendChild($("h2", null, title));
    const b = $("button", "ghost", backLabel); b.onclick = onBack; t.appendChild(b);
    return t;
  }

  /* ---------- the list ---------- */
  function showList() {
    current = null; stopMic();
    const p = panel(); p.innerHTML = "";
    p.appendChild(top("📚 Cards", "← Back to Giulia", close));
    const done = cards().filter(c => state[c.id] && state[c.id].studied).length;
    p.appendChild($("p", "ex-intro", `One card per topic from your reference sheets (corrected where the sheets were wrong). Open a card to learn it, have Giulia explain it, get quizzed, do its exercises, and ask questions. ${done}/${cards().length} studied.`));
    const next = cards().find(c => !(state[c.id] && state[c.id].studied));
    if (next) { const b = $("button", "primary", "▶ Next card: " + next.title); b.onclick = () => showCard(next.id); p.appendChild(b); }
    const exScores = load("parla_ex_scores", {});
    [...new Set(cards().map(c => c.group))].forEach(g => {
      const box = $("div", "ex-group");
      box.appendChild($("h3", null, g));
      const grid = $("div", "ex-grid");
      cards().filter(c => c.group === g).forEach(c => {
        const b = $("button", "ex-card");
        b.appendChild($("span", "t", (state[c.id] && state[c.id].studied ? "✓ " : "") + c.title));
        b.appendChild($("span", "s", `${c.level} · ${c.sheet}`));
        const n = (chats[c.id] || []).filter(m => m.role === "user").length, sc = exScores[c.id];
        b.appendChild($("span", "b" + (sc || n ? "" : " none"), [sc ? `exercises best ${sc.best}%` : "", n ? `${n} question${n > 1 ? "s" : ""} asked` : ""].filter(Boolean).join(" · ") || "Not started"));
        b.onclick = () => showCard(c.id);
        grid.appendChild(b);
      });
      box.appendChild(grid);
      p.appendChild(box);
    });
    window.scrollTo(0, 0);
  }

  /* ---------- one card ---------- */
  function showCard(id) {
    const c = cardById(id);
    if (!c) return showList();
    current = c; stopMic();
    const p = panel(); p.innerHTML = "";
    p.appendChild(top("📚 " + c.title, "← All cards", showList));

    const list = cards(), i = list.indexOf(c);
    const nav = $("div", "cd-nav");
    const prev = $("button", "ghost", "‹ Previous"); prev.disabled = i === 0; prev.onclick = () => showCard(list[i - 1].id);
    const pos = $("span", "cd-pos", `${i + 1} / ${list.length} · 📄 ${c.sheet}`);
    const nxt = $("button", "ghost", "Next ›"); nxt.disabled = i === list.length - 1; nxt.onclick = () => showCard(list[i + 1].id);
    nav.appendChild(prev); nav.appendChild(pos); nav.appendChild(nxt);
    p.appendChild(nav);

    // the card itself
    const card = $("div", "cd-card");
    if (c.intro) card.appendChild($("p", "cd-intro", c.intro));
    if (c.points && c.points.length) {
      card.appendChild($("h4", null, "Key points"));
      const ul = $("ul");
      c.points.forEach(pt => ul.appendChild($("li", null, pt)));
      card.appendChild(ul);
    }
    (c.tables || []).forEach(([title, rows]) => {
      if (title) card.appendChild($("h4", null, title));
      const tb = $("div", "cd-table");
      rows.forEach(([it, en]) => {
        const r = $("div", "cd-row");
        const a = $("div", "cd-it", it + " "); a.appendChild(makeReplay(it.replace(/→/g, "…").replace(/ · /g, ", ")));
        r.appendChild(a); r.appendChild($("div", "cd-en", en));
        tb.appendChild(r);
      });
      card.appendChild(tb);
    });
    if (c.watch && c.watch.length) {
      card.appendChild($("h4", null, "⚠️ Watch out"));
      const ul = $("ul", "cd-watch");
      c.watch.forEach(w => ul.appendChild($("li", null, w)));
      card.appendChild(ul);
    }
    p.appendChild(card);

    // actions
    const acts = $("div", "cd-acts");
    const mk = (label, title, fn, cls = "ghost") => { const b = $("button", cls, label); b.title = title; b.onclick = fn; acts.appendChild(b); return b; };
    mk("🧑‍🏫 Explain it", "Giulia teaches this card step by step, then checks you've understood", () => ask("Explain this card to me simply, step by step, with a few everyday examples. Then ask me ONE quick question to check I've understood.", "🧑‍🏫 Explain this card to me"), "primary");
    mk("❓ Quiz me", "Giulia asks you questions about this card, one at a time, and marks your answers", () => ask("Quiz me on this card. Ask me ONE question at a time — mix Italian→English, English→Italian and fill-the-gap — wait for my answer, mark it (✓ or ✗ with the correct answer and a one-line reason), then ask the next. After 5 questions give me a score out of 5 and tell me what to review.", "❓ Quiz me on this card"));
    mk("✏️ Exercises", "The self-marking exercises for this card", () => ParlaExercises.openSet(c.id, () => open(c.id)));
    if (c.topic && TOPICS[c.topic]) mk("🗣 Talk it through", "Practise this in a spoken conversation with Giulia", () => { close(); const sel = el("topicSel"); sel.value = c.topic; sel.dispatchEvent(new Event("change")); });
    const studied = state[c.id] && state[c.id].studied;
    const sb = mk(studied ? "✓ Studied" : "Mark as studied", "Tick this card off", () => {
      state[c.id] = { studied: !(state[c.id] && state[c.id].studied), when: Date.now() };
      save(LS_STATE, state);
      sb.textContent = state[c.id].studied ? "✓ Studied" : "Mark as studied";
      sb.classList.toggle("toggle-on", state[c.id].studied);
    });
    if (studied) sb.classList.add("toggle-on");
    p.appendChild(acts);

    // chat about the card
    const box = $("div", "cd-chat");
    box.appendChild($("h4", null, "💬 Ask Giulia about this card"));
    const thread = $("div", "cd-thread"); thread.id = "cdThread";
    box.appendChild(thread);
    const row = $("div", "ex-inrow");
    const inp = $("input", "ex-in"); inp.id = "cdInput";
    Object.assign(inp, { type: "text", autocomplete: "off", placeholder: "Ask a question, or answer Giulia's…" });
    const mic = $("button", "ghost", "🎙"); mic.title = "Ask out loud (English or Italian)";
    const send = $("button", "primary", "Send");
    const doSend = () => { const t = inp.value.trim(); if (!t || busy) return; inp.value = ""; ask(t); };
    send.onclick = doSend;
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); doSend(); } });
    mic.onclick = () => {
      if (busy) return;
      if (recognizing) { stopRecording(); mic.textContent = "…"; return; }
      speechSynthesis.cancel();
      heardHandler = (text, err) => {
        mic.textContent = "🎙"; mic.classList.remove("rec");
        if (!text) { note.textContent = err ? "⚠️ " + err : "Didn't catch that — tap 🎙 and try again."; return; }
        note.textContent = "";
        ask(text);
      };
      note.textContent = "Listening… tap ■ when you've finished.";
      mic.textContent = "■"; mic.classList.add("rec");
      recordMode = "cardAsk";
      startRecording();
    };
    row.appendChild(inp); row.appendChild(mic); row.appendChild(send);
    box.appendChild(row);
    const note = $("div", "ex-hint"); box.appendChild(note);
    const chips = $("div", "cd-chips");
    ["What's the most important rule here?", "Give me 3 more examples", "What mistakes do English speakers make with this?", "How would I use this in a café?"].forEach(q => {
      const b = $("button", "ghost", q); b.onclick = () => ask(q); chips.appendChild(b);
    });
    box.appendChild(chips);
    if ((chats[c.id] || []).length) {
      const clr = $("button", "ghost cd-clear", "Clear this card's chat");
      clr.onclick = () => { chats[c.id] = []; save(LS_CHATS, chats); showCard(c.id); };
      box.appendChild(clr);
    }
    p.appendChild(box);
    (chats[c.id] || []).forEach(m => renderMsg(thread, m));
    window.scrollTo(0, 0);
  }

  // Giulia's replies: Italian examples come on lines starting "»" and get 🔊.
  function renderMsg(thread, m, label) {
    const d = $("div", "cd-msg " + m.role);
    if (m.role === "user") { d.textContent = label || m.content; thread.appendChild(d); return d; }
    m.content.split("\n").forEach(line => {
      const t = line.trim();
      if (!t) return;
      if (/^[»>]/.test(t)) {
        const body = t.replace(/^[»>]\s*/, "");
        const [it, ...en] = body.split(/\s+[—–-]\s+/);
        const ex = $("div", "cd-ex");
        const itEl = $("span", "cd-it", it + " "); itEl.appendChild(makeReplay(it));
        ex.appendChild(itEl);
        if (en.length) ex.appendChild($("span", "cd-en", en.join(" — ")));
        d.appendChild(ex);
      } else d.appendChild($("p", null, t.replace(/\*\*/g, "")));
    });
    thread.appendChild(d);
    return d;
  }

  function systemFor(c) {
    const level = el("level").value;
    return `You are Giulia, a warm, patient Italian teacher. The student (level: ${level}) is studying ONE reference card, given below. Help them learn it: explain, give examples, answer questions, and test them when asked. Stay on this card's topic unless they ask about something else.
Style: clear British English, short paragraphs, under 170 words. No markdown symbols (no **, #, tables). Put EVERY Italian example on its own line in exactly this form:
» Italian sentence — English meaning
When the student answers a question you asked, mark it first: ✓ (and why) or ✗ with the correct Italian and a one-line reason. Then continue. If something on the card itself is wrong or oversimplified, say so politely.

${cardText(c)}`;
  }

  async function ask(text, label) {
    const c = current;
    if (!c || busy) return;
    const thread = el("cdThread");
    const msgs = chats[c.id] || (chats[c.id] = []);
    const um = { role: "user", content: text };
    msgs.push(um);
    renderMsg(thread, um, label);
    busy = true;
    const wait = renderMsg(thread, { role: "assistant", content: "…" });
    wait.classList.add("cd-wait");
    wait.scrollIntoView({ behavior: "smooth", block: "end" });
    try {
      const reply = await callModel([{ role: "system", content: systemFor(c) }, ...msgs.slice(-14)], { maxTokens: 600, timeoutMs: 40000 });
      wait.remove();
      const am = { role: "assistant", content: reply || "(no reply)" };
      msgs.push(am);
      if (msgs.length > 40) msgs.splice(0, msgs.length - 40);
      save(LS_CHATS, chats);
      const d = renderMsg(thread, am);
      d.scrollIntoView({ behavior: "smooth", block: "start" });
      try { bumpActivity(); } catch {}
    } catch (e) {
      wait.remove();
      msgs.pop();                                      // forget the unanswered question
      const err = $("div", "cd-msg assistant");
      err.appendChild($("p", null, "⚠️ Giulia didn't answer: " + e.message));
      const r = $("button", "ghost", "↻ Try again");
      r.onclick = () => { err.remove(); thread.lastChild && thread.lastChild.classList.contains("user") && thread.lastChild.remove(); ask(text, label); };
      err.appendChild(r);
      thread.appendChild(err);
    } finally {
      busy = false;
    }
  }

  const btn = el("cardsBtn");
  if (btn) btn.addEventListener("click", () => open());
  window.ParlaCards = {
    open, close, cards, cardText,
    heard: (text, err) => { const fn = heardHandler; heardHandler = null; if (fn) fn(text, err); },
  };
})();
