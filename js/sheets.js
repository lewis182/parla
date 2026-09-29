/* Parla — ➕ Add a sheet: turn a new reference sheet (photo or image) into a 📚 Card with
   exercises. Giulia reads the image (vision model via OpenRouter), writes the card —
   key points, example tables, common mistakes, any errors on the sheet — and 10–16
   self-marking exercises. You review it, then it's added to Cards, Exercises and Charts.
   Everything is stored on this device: the text in localStorage (parla_user_sheets) and the
   image in IndexedDB. 📈 Progress → Export / Import carries both to your other device.
   (classic script; loads after exercises.js and cards-data.js, before cards.js) */
const ParlaSheets = (function () {
  const LS = "parla_user_sheets";
  const $ = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const load = () => { try { return JSON.parse(localStorage.getItem(LS)) || []; } catch { return []; } };
  const save = (list) => { try { localStorage.setItem(LS, JSON.stringify(list)); return true; } catch { return false; } };
  const GROUP = "My added sheets";

  /* ---------- images in IndexedDB ---------- */
  function db() {
    return new Promise((res, rej) => {
      const r = indexedDB.open("parla", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("images");
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function putImage(id, dataUrl) { const d = await db(); return new Promise((res, rej) => { const t = d.transaction("images", "readwrite"); t.objectStore("images").put(dataUrl, id); t.oncomplete = res; t.onerror = () => rej(t.error); }); }
  async function getImage(id) { const d = await db(); return new Promise((res) => { const t = d.transaction("images"); const q = t.objectStore("images").get(id); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); }
  async function delImage(id) { const d = await db(); return new Promise((res) => { const t = d.transaction("images", "readwrite"); t.objectStore("images").delete(id); t.oncomplete = res; t.onerror = res; }); }

  /* ---------- turn a saved sheet into an exercise set + card text ---------- */
  function toSet(s) {
    const c = s.card, items = [];
    (c.exercises || []).forEach(x => {
      try {
        if (x.type === "gap" && x.q && x.q.includes("___") && x.answers && x.answers.length) items.push({ t: "gap", q: x.q, a: x.answers, h: x.hint || null, en: x.en || null, x: x.explain || null });
        else if (x.type === "mc" && x.q && Array.isArray(x.options) && x.options.length >= 2 && new Set(x.options).size === x.options.length) items.push({ t: "mc", q: x.q, o: x.options, en: x.en || null, x: x.explain || null, s: x.say || undefined });
        else if (x.type === "tr" && x.en && x.answers && x.answers.length) items.push({ t: "tr", q: x.en, a: x.answers, x: x.explain || null });
      } catch {}
    });
    const set = { id: s.id, group: GROUP, level: c.level || "", title: c.title || "My sheet", sheet: s.file || "added sheet", topic: "free", userSheet: true };
    if (!items.length && c.vocab && c.vocab.length >= 4) set.vocab = c.vocab;
    else set.items = items.length ? items : [{ t: "mc", q: "(No exercises were created for this sheet — ask Giulia on the card instead.)", o: ["OK", "…"] }];
    return set;
  }
  function inject(s) {
    if (typeof EX_SETS === "undefined" || EX_SETS.some(x => x.id === s.id)) return;
    EX_SETS.push(toSet(s));
    CARD_TEXT[s.id] = {
      intro: s.card.intro || "", points: s.card.points || [], watch: (s.card.corrections || []).map(c => "Correction to the sheet: " + c).concat(s.card.watch || []),
      tables: (s.card.tables || []).filter(t => Array.isArray(t) && Array.isArray(t[1])).map(([t, rows]) => [t || "", rows.filter(r => Array.isArray(r) && r[0]).map(r => [String(r[0]), String(r[1] || "")])]),
    };
  }
  load().forEach(inject);                      // at start-up, before Cards and Exercises are built

  /* ---------- reading the image ---------- */
  function shrink(file) {                       // → JPEG data URL, max 1400px
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1400 / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        res(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => rej(new Error("that file isn't an image Parla can read"));
      img.src = URL.createObjectURL(file);
    });
  }
  const PROMPT = `You are an expert Italian teacher. The image is a reference sheet (grammar or vocabulary) that an English-speaking learner of Italian (British English, beginner to lower-intermediate) wants to study. Read it carefully and turn it into a study card and exercises.
Reply with ONLY a JSON object (no code fences, no comments), in exactly this shape:
{
 "title": "short English title, e.g. 'Direct object pronouns' or 'Fruit'",
 "level": "A1" or "A2" or "B1",
 "intro": "one sentence: what this sheet teaches",
 "points": ["3–6 key rules in plain British English, each with a short Italian example"],
 "tables": [["table title", [["Italian", "English"], ...]]],
 "watch": ["2–4 common mistakes, formatted: wrong ✗ → right ✓"],
 "corrections": ["any ERRORS or misleading statements on the sheet itself, explained briefly — empty list if none"],
 "vocab": [["Italian with article", "English"], ...] (ONLY for vocabulary sheets, else []),
 "exercises": [ 10–16 items, a mix of:
   {"type":"gap","q":"Italian sentence with ___ for the gap","answers":["correct word(s)", "other acceptable answers"],"hint":"e.g. the infinitive","en":"English translation","explain":"one line"},
   {"type":"mc","q":"question or Italian sentence with ___","options":["CORRECT ANSWER FIRST","wrong","wrong"],"en":"English","explain":"one line"},
   {"type":"tr","en":"English sentence to translate","answers":["Italian answer","other acceptable versions"],"explain":"one line"} ]
}
Rules: use ONLY what the sheet teaches (its words, rules and examples) and keep the Italian correct — if the sheet is wrong, teach the correct form and list it in "corrections". Tables: include every conjugation / word list on the sheet. Exercise answers must be unambiguous.`;
  async function readSheet(dataUrl) {
    const raw = await callModel([{ role: "user", content: [{ type: "text", text: PROMPT }, { type: "image_url", image_url: { url: dataUrl } }] }], { maxTokens: 4000, timeoutMs: 120000 });
    const j = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    let card;
    try { card = JSON.parse(j); } catch { throw new Error("Giulia's answer couldn't be read — try again (or switch to 🧠 Smarter)."); }
    if (!card || !card.title) throw new Error("that didn't look like a reference sheet.");
    return card;
  }

  /* ---------- the Add screen (shown in the Cards panel) ---------- */
  function openAdd() {
    ParlaCards.open();
    const p = el("cardsPanel"); p.innerHTML = "";
    const top = $("div", "ex-top"); top.appendChild($("h2", null, "➕ Add a sheet"));
    const bk = $("button", "ghost", "← All cards"); bk.onclick = () => ParlaCards.open(); top.appendChild(bk);
    p.appendChild(top);
    p.appendChild($("p", "ex-intro", "Choose a photo or image of a new reference sheet (on the iPad you can take a photo). Giulia reads it and writes a 📚 Card — key points, examples, mistakes to avoid, and any errors on the sheet — plus 10–16 exercises. You check it, then it's added to Cards, Exercises and Charts. Reading one sheet costs a few pence."));
    const inp = $("input"); inp.type = "file"; inp.accept = "image/*"; inp.style.display = "none";
    const pick = $("button", "primary", "📷 Choose or take a photo…"); pick.onclick = () => inp.click();
    p.appendChild(pick); p.appendChild(inp);
    const area = $("div", "sh-area"); p.appendChild(area);
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      area.innerHTML = "";
      let dataUrl;
      try { dataUrl = await shrink(f); } catch (e) { area.appendChild($("p", "err", "⚠️ " + e.message)); return; }
      const img = $("img", "sh-img"); img.src = dataUrl; area.appendChild(img);
      const go = $("button", "primary", "✨ Read it with Giulia");
      const note = $("div", "ex-hint");
      area.appendChild(go); area.appendChild(note);
      go.onclick = async () => {
        go.disabled = true; note.textContent = "Giulia is reading the sheet… (up to a minute)";
        try {
          const card = await readSheet(dataUrl);
          preview(area, { id: "user_" + Date.now(), created: Date.now(), file: f.name.replace(/\.[^.]+$/, ""), card }, dataUrl, go);
          note.textContent = "";
        } catch (e) { note.textContent = "⚠️ " + e.message; go.disabled = false; }
      };
    };
  }
  function preview(area, s, dataUrl, goBtn) {
    const old = area.querySelector(".sh-prev"); if (old) old.remove();
    const set = toSet(s);
    const box = $("div", "sh-prev");
    box.appendChild($("h3", null, "Check what Giulia made: " + s.card.title));
    const c = s.card;
    const ul = (arr, cls) => { const u = $("ul", cls); (arr || []).forEach(x => u.appendChild($("li", null, String(x)))); return u; };
    if (c.intro) box.appendChild($("p", null, c.intro));
    if ((c.points || []).length) { box.appendChild($("h4", null, "Key points")); box.appendChild(ul(c.points)); }
    if ((c.corrections || []).length) { box.appendChild($("h4", null, "⚠️ Errors found on the sheet")); box.appendChild(ul(c.corrections, "cd-watch")); }
    (c.tables || []).forEach(([t, rows]) => { box.appendChild($("h4", null, t || "Table")); box.appendChild($("div", "ex-hint", (rows || []).slice(0, 8).map(r => r[0] + " — " + r[1]).join(" · ") + ((rows || []).length > 8 ? " …" : ""))); });
    box.appendChild($("h4", null, `Exercises (${set.items ? set.items.length : (set.vocab || []).length + " words"})`));
    if (set.items) box.appendChild(ul(set.items.slice(0, 6).map(q => q.t === "tr" ? `${q.q} → ${q.a[0]}` : q.t === "gap" ? q.q.replace("___", `[${q.a[0]}]`) : `${q.q} → ${q.o[0]}`)));
    const acts = $("div", "gr-actions");
    const ok = $("button", "primary", "✓ Add it to my app");
    ok.onclick = async () => {
      const list = load(); list.push(s);
      if (!save(list)) { alertIn(box, "Not enough storage on this device to save it."); return; }
      try { await putImage(s.id, dataUrl); } catch {}
      inject(s);
      ParlaCards.refresh();
      ParlaCards.open(s.id);
    };
    const again = $("button", "ghost", "↻ Read it again"); again.onclick = () => { box.remove(); goBtn.disabled = false; goBtn.click(); };
    acts.appendChild(ok); acts.appendChild(again);
    box.appendChild(acts);
    area.appendChild(box);
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const alertIn = (box, msg) => box.appendChild($("p", "err", "⚠️ " + msg));

  async function remove(id) {
    const list = load().filter(s => s.id !== id);
    save(list);
    await delImage(id);
    const i = EX_SETS.findIndex(x => x.id === id); if (i >= 0) EX_SETS.splice(i, 1);
    delete CARD_TEXT[id];
    ParlaCards.refresh();
  }
  async function showImage(id) {
    const url = await getImage(id);
    const s = load().find(x => x.id === id);
    const o = $("div", "gr-light"); const box = $("div", "box"); o.appendChild(box);
    o.onclick = (e) => { if (e.target === o) o.remove(); };
    const bar = $("div", "bar"); bar.appendChild($("span", null, s ? s.card.title : "Sheet"));
    const x = $("button", "ghost", "✕ Close"); x.onclick = () => o.remove(); bar.appendChild(x); box.appendChild(bar);
    if (url) { const img = $("img"); img.src = url; box.appendChild(img); } else box.appendChild($("p", null, "The picture isn't on this device (only the card was imported)."));
    document.body.appendChild(o);
  }
  // for 📈 Export / Import
  async function exportImages() { const out = {}; for (const s of load()) { const u = await getImage(s.id); if (u) out[s.id] = u; } return out; }
  async function importImages(map) { for (const [id, u] of Object.entries(map || {})) await putImage(id, u); }

  return { list: load, openAdd, remove, showImage, getImage, exportImages, importImages, isUser: (id) => String(id).startsWith("user_") };
})();
window.ParlaSheets = ParlaSheets;
