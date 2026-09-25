/* Parla — the tutor: system prompt, API calls, grammar notes, report (classic script; shares globals with the other js/ files, load order matters) */
/* ---------- the tutor (Claude) ---------- */
function systemPrompt() {
  const level = el("level").value;
  const scene = (TOPICS[topic] || TOPICS.free).scene;
  return `You are Giulia, a warm, encouraging Italian tutor having a spoken conversation with a student whose level is: ${level}.
${scene ? `
Scenario: ${scene} Stay in this setting, keep the language at the student's level, and remain an encouraging tutor. If this is grammar coaching, keep the conversation natural — one question at a time, never a grammar lecture — and use the FIX line diligently whenever the target structure is wrong or avoided.

Pacing — the student is now on turn ${turnsThisTopic + 1} of this scene:
- Actively DRIVE the scene forward through its stages; don't linger on one stage or repeat questions.
- Around the student's 3rd–5th turn, spring the scene's twist naturally, so they must improvise.
- Around the student's 8th–10th turn, bring the scene to a warm, natural close in character. On that final turn only: the IT line needn't end with a question, and the EN line should add 1–2 encouraging sentences of English feedback (what they did well + one thing to practise) and suggest picking a new topic from the menu.
` : "\nFree chat: no fixed scene. Keep it varied and personal; if the student seems unsure what to say, offer a couple of concrete subjects to choose from. No wrap-up needed.\n"}
- The student speaks to you; their words arrive via speech-to-text and may be slightly garbled. Respond directly and sensibly to what they most likely meant.
- If the student uses ENGLISH for all or part of their message, they need help saying it: reply naturally in Italian to what they meant, and ALWAYS put the full Italian sentence they were trying to say in FIX so they can practise it.
- If a word or phrase is unintelligible or seems invented (a mis-transcription like "Arrisotto Confumbi"), do NOT guess or pretend to understand: in the IT line kindly ask them to repeat or clarify that part, and put a dash in FIX.
- Keep your Italian short (1–2 sentences), correct, and matched to their level. Always end the IT line with a simple question. Be patient and positive; never lecture.

${(() => { const due = vocabDue().slice(0, 4).map(v => v.it); return due.length ? "\nVocabulary reinforcement: where it fits naturally (never forced), weave these words the student is learning into your replies or questions: " + due.join("; ") + "\n" : ""; })()}
Reply in EXACTLY this format on EVERY turn — six labelled lines, nothing before or after. No matter how long the conversation gets, ALWAYS include every line; never drop one:
IT: <your spoken Italian, 1–2 sentences, ending in a question>
EN: <an accurate, natural English translation of the IT line — NEVER leave this blank>
FIX: <if the student made ANY grammar or word mistake, write the FULL corrected Italian sentence they should have said — Italian only, no English, no quotes (it will be read aloud to them). If they were correct, just a dash ->
KEY: <only if FIX is used: the specific word or short phrase they got wrong, corrected (1–4 Italian words, exactly as in FIX) | its short English meaning. Otherwise a dash ->
AREA: <only if FIX is used: the ONE grammar area of the mistake, as an id from this list: ${exAreaIds()}. If none fits, or there is no FIX, a dash ->
SUG: <a short natural sentence the student could SAY NEXT to move the scene forward, fitting what just happened (e.g. after they order a coffee, suggest asking whether there are pastries) — format: Italian sentence | English translation>`;
}

// Grammar exercise-set ids the tutor can tag a mistake with (links a ✏️ correction to 🏋️ practice).
function exAreaIds() {
  if (typeof EX_SETS === "undefined") return "-";
  const skip = /vocabulary|phrases|food/i;
  return EX_SETS.filter(s => !skip.test(s.group)).map(s => s.id).join(", ");
}
function formatTurn(p) {
  return `IT: ${p.reply_it}\nEN: ${p.hint || ""}\nFIX: ${p.correction || "-"}\nKEY: ${p.keyRaw || "-"}\nAREA: ${p.area || "-"}\nSUG: ${p.sugRaw || "-"}`;
}

async function askTutor(userText) {
  history.push({ role: "user", content: userText });
  if (history.length > MAX_TURNS) history = history.slice(-MAX_TURNS);

  let raw;
  try {
    raw = await callModel([{ role: "system", content: systemPrompt() }, ...history], { maxTokens: 450 });
  } catch (e) {
    history.pop();                     // forget the unanswered turn so "Try again" re-sends it cleanly
    throw e;
  }
  const parsed = parseTutor(raw);
  // Store the assistant turn in the SAME labelled format we want back, so the model
  // keeps producing the EN/FIX lines deep into the conversation. (If we store plain
  // Italian, after a few turns it mimics that and drops the English translation.)
  history.push({ role: "assistant", content: formatTurn(parsed) });
  return parsed;
}

// Parse the tutor's labelled reply (IT / EN / FIX / KEY / AREA / SUG). Robust: labels may
// share a line or be missing; falls back to JSON or raw text if the model ignored the format.
function parseTutor(raw) {
  const f = {};
  const rx = /\b(IT|EN|FIX|KEY|AREA|SUG)\s*:\s*/gi;
  const marks = [];
  let m;
  while ((m = rx.exec(raw))) marks.push({ label: m[1].toUpperCase(), start: m.index, body: m.index + m[0].length });
  marks.forEach((mk, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].start : raw.length;
    if (!(mk.label in f)) f[mk.label] = raw.slice(mk.body, end).trim();
  });
  let reply_it = f.IT || "", hint = f.EN || "", correction = f.FIX || "";
  if (!reply_it && raw.indexOf("{") !== -1) {            // fallback: model replied in JSON
    try {
      const j = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
      reply_it = j.reply_it || ""; hint = j.hint || ""; correction = j.correction || "";
    } catch {}
  }
  const isDash = (x) => !x || /^[-–—\s]*$/.test(x) || /^(none|n\/a|nessun)/i.test(x);
  if (isDash(correction)) correction = "";
  const pair = (x) => { if (isDash(x)) return ["", ""]; const sp = x.split("|"); return [(sp[0] || "").trim(), (sp[1] || "").trim()]; };
  const [sug_it, sug_en] = pair(f.SUG);
  let [key_it, key_en] = correction ? pair(f.KEY) : ["", ""];
  if (key_it.split(/\s+/).length > 6) key_it = "";      // not a fragment — ignore
  let area = correction && !isDash(f.AREA) ? f.AREA.replace(/[^a-z0-9_]/gi, "") : "";
  if (area && typeof EX_SETS !== "undefined" && !EX_SETS.some(s => s.id === area)) area = "";
  if (!reply_it) reply_it = (raw.split(/\s*\b(?:EN|FIX|KEY|AREA|SUG)\s*:/i)[0].replace(/^\s*IT:\s*/i, "").trim()) || raw.trim();
  return { reply_it, hint, correction, sug_it, sug_en, sugRaw: f.SUG || "", key_it, key_en, keyRaw: key_it ? f.KEY : "", area };
}

// "How do you say…?" — translate an English phrase to Italian. Stateless (not part
// of the conversation history), so it doesn't disturb the current role-play.
async function translateToItalian(englishPhrase) {
  return callModel([
    { role: "system", content: "You translate for an English speaker learning Italian. Given an English phrase, reply with ONLY the natural, conversational Italian translation — no quotes, no explanation, no English." },
    { role: "user", content: englishPhrase },
  ], { maxTokens: 200 });
}

// 📖 Review the conversation so far and explain its key basic grammar points.
async function explainGrammar() {
  if (history.length < 2) { setStatus("Have a little conversation first — then I can explain the grammar in it."); return; }
  const btn = el("grammarBtn");
  btn.disabled = true;
  btn.textContent = "📖 Reviewing…";
  setStatus("Reviewing the conversation for grammar points…");
  Avatar.setState("thinking");
  try {
    const level = el("level").value;
    const convo = history.map(m => (m.role === "user" ? "Student: " : "Tutor: ") + m.content).join("\n");
    const text = await callModel([
          { role: "system", content: `You are an Italian teacher. Review this conversation and pick the 3–4 most useful BASIC grammar points that actually occur in it, appropriate for a ${level} student. For each point:
- name it simply and quote the word or phrase from the conversation it comes from (in quotes)
- explain it briefly in plain English
- show the basic pattern, e.g. for "abbiamo": avere = to have → ho (I have), hai (you have), ha (he/she has), abbiamo (we have), avete (you all have), hanno (they have); or for endings: -o usually masculine, -a usually feminine.
Keep the whole answer under 250 words. Plain text only: short lines, bullets starting with "•", no markdown symbols like ** or #.` },
          { role: "user", content: convo },
        ], { maxTokens: 700, timeoutMs: 40000 });
    if (!text) throw new Error("empty reply");
    showGrammarCard(text);
    setStatus("Grammar notes added below — carry on when you're ready.");
  } catch (e) {
    addMessage("assistant", { it: "", hint: "⚠️ Couldn't review the grammar: " + e.message });
    setStatus("Grammar review failed (see message above).");
  } finally {
    btn.disabled = false;
    btn.textContent = "📖 Grammar";
    Avatar.setState("idle");
  }
}

function showCard(labelText, text) {
  const d = document.createElement("div");
  d.className = "grammar-card";
  const label = document.createElement("div");
  label.className = "g-label";
  label.textContent = labelText;
  const body = document.createElement("div");
  body.className = "g-body";
  body.textContent = text;
  d.appendChild(label);
  d.appendChild(body);
  chatEl.appendChild(d);
  chatEl.scrollTop = chatEl.scrollHeight;
}
function showGrammarCard(text) { showCard("📖 Grammar notes from this conversation", text); }

// 📋 what happened this sitting: fixes, new words, time — no API call needed.
function showReport() {
  const lines = [];
  lines.push(`⏱ ${minutesToday()} min today · 🔥 ${streakDays()}-day streak · ${session.turns} turns this session`);
  if (session.corrections.length) {
    lines.push("");
    lines.push("Fixes from this session:");
    session.corrections.slice(-8).forEach(c => lines.push(`• You said: ${c.said}\n  ✏️ ${c.fix}`));
  } else {
    lines.push("");
    lines.push("No corrections this session — bravissimo!");
  }
  if (session.words.length) {
    lines.push("");
    lines.push("New words saved: " + session.words.join(" · "));
  }
  const dueTomorrow = vocab.filter(v => v.due <= Date.now() + 86400000).length;
  lines.push("");
  lines.push(`📇 ${dueTomorrow} item(s) due for review by tomorrow — tap the Review button then.`);
  lines.push("");
  lines.push(`💷 This session: ${fmtUSD(sessionCost.usd)} on tutor replies (${sessionCost.calls} calls)` +
    (sessionCost.sttClips ? ` · ${sessionCost.sttClips} voice clips transcribed` : "") +
    (sessionCost.ttsChars ? ` · ${sessionCost.ttsChars.toLocaleString()} characters of premium voice` : "") + ".");
  showCard("📋 Session report", lines.join("\n"));
}

// 📇 the notebook itself, when nothing is due.
function showNotebook() {
  if (!vocab.length) { setStatus("No saved words yet — corrections and lookups are saved automatically."); return; }
  const soonest = vocab.reduce((a, b) => (a.due < b.due ? a : b));
  const hours = Math.max(1, Math.round((soonest.due - Date.now()) / 3600000));
  const list = vocab.slice().sort((a, b) => a.due - b.due).slice(0, 20)
    .map(v => `• ${v.it}${v.en ? " — " + v.en : ""}`).join("\n");
  showCard("📇 Your words (" + vocab.length + ")", list + `\n\nNothing due right now — next review in about ${hours}h.`);
}

async function handleAsk() {
  const q = el("askInput").value.trim();
  if (!q) return;
  el("askInput").value = "";
  addMessage("user", { it: "How do you say: " + q });
  setStatus("Finding the Italian…");
  Avatar.setState("thinking");
  try {
    const italian = await translateToItalian(q);
    const bubble = addMessage("assistant", { it: italian, hint: q });   // Italian (with 🔊) + the English underneath
    bubble.appendChild(makePracticeBtn(italian));                        // manual retry any time
    saveVocabItem(italian, q);                                           // looked-up = worth remembering
    bumpActivity();
    practiceAttempts = 0;
    // Speak it, then automatically wait for the student to repeat it back.
    speakParts([{ text: italian }], { autoListen: false, onDone: () => beginPractice(italian) });
    setStatus("Listen… then repeat it — I'll be listening.");
  } catch (e) {
    addMessage("assistant", { it: "", hint: "⚠️ " + e.message });
    setStatus("Couldn't translate (see message above).");
    Avatar.setState("idle");
  }
}

async function handleUserSpeech(text, sttSecs, isRetry) {
  if (!text || !text.trim()) { setStatus("Didn't catch that — tap and try again."); return; }
  showSuggestion(null);              // you've taken your turn — clear the old tip
  if (!isRetry) { addMessage("user", { it: text }); logConvo({ role: "user", it: text }); }
  setStatus("Giulia is thinking…");
  Avatar.setState("thinking");
  micEl.disabled = true;
  try {
    const t0 = performance.now();
    const r = await askTutor(text);
    const replySecs = ((performance.now() - t0) / 1000).toFixed(1);
    addMessage("assistant", { it: r.reply_it, hint: r.hint, correction: r.correction, exSet: r.area });
    logConvo({ role: "giulia", it: r.reply_it, en: r.hint, fix: r.correction });
    showSuggestion(r.sug_it, r.sug_en);
    session.turns++;
    bumpActivity();
    if (r.correction) {
      session.corrections.push({ said: text, fix: r.correction, area: r.area });
      // Flashcard = the corrected fragment + its meaning (short and reviewable);
      // falls back to the whole corrected sentence if the tutor didn't give one.
      if (r.key_it) saveVocabItem(r.key_it, r.key_en);
      else saveVocabItem(r.correction, "");
      if (r.area) countMistakeArea(r.area);
    }
    // grammar tracking: 3 real exchanges in a grammar topic = practised ✓
    turnsThisTopic++;
    if (topic.startsWith("g_") && turnsThisTopic >= 3 && !practiced.has(topic)) {
      practiced.add(topic);
      localStorage.setItem("parla_practiced", JSON.stringify([...practiced]));
      paintPracticed();
    }
    if (correctMe && r.correction) {
      // Speak her reply, then the fix — and then WAIT for the student to repeat the
      // corrected sentence (checked, up to 3 goes) before the conversation moves on.
      practiceAttempts = 0;
      resumeAfterPractice = true;
      setStatus("👂 Listen — then repeat the correction when Giulia finishes.");
      speakParts(
        [{ text: r.reply_it }, { text: "Si dice: " + r.correction, rate: 0.85 }],
        { autoListen: false, onDone: () => beginPractice(r.correction) }
      );
    } else {
      speakParts([{ text: r.reply_it }]);
      setStatus(`Your turn${handsFree ? " — just speak" : " — tap the mic"}.   ⏱ heard ${sttSecs ?? "?"}s · replied ${replySecs}s`);
    }
  } catch (e) {
    Avatar.setState("idle");
    addMessage("assistant", { it: "", hint: "⚠️ Giulia didn't answer: " + e.message, retry: () => handleUserSpeech(text, sttSecs, true) });
    setStatus("Something went wrong — tap ↻ Try again, or just speak again.");
  } finally {
    micEl.disabled = false;
  }
}

