/* Parla — setup, key, voice panel, toggles, boot (classic script; shares globals with the other js/ files, load order matters) */
/* ---------- setup / key handling ---------- */
function showApp() {
  el("setup").classList.add("hidden");
  el("stage").classList.remove("hidden");
  chatEl.classList.remove("hidden");
  el("micbar").classList.remove("hidden");
  Avatar.start();
  paintStreak();
  paintReviewBtn();
  if (history.length === 0) newConversation();
}

// Start (or restart) a conversation using the currently selected topic.
function newConversation() {
  speechSynthesis.cancel();
  archiveConvo();                    // keep the previous conversation in 📈 Progress → Past conversations
  startConvo();
  history = [];
  turnsThisTopic = 0;
  chatEl.innerHTML = "";
  const opener = (TOPICS[topic] || TOPICS.free).opener;
  addMessage("assistant", { it: opener.reply_it, hint: opener.hint });
  history.push({ role: "assistant", content: formatTurn({ reply_it: opener.reply_it, hint: opener.hint }) });
  logConvo({ role: "giulia", it: opener.reply_it, en: opener.hint });
  speakParts([{ text: opener.reply_it }]);
}

el("saveKey").addEventListener("click", () => {
  // strip whitespace and any surrounding quotes that sneak in when pasting
  let v = el("keyInput").value.trim().replace(/^["']|["']$/g, "").trim();
  if (v.length < 8) { el("keyErr").textContent = "Please paste your full OpenRouter key (starts with sk-or-…)."; return; }
  if (!v.startsWith("sk-or-")) { el("keyErr").textContent = "Heads up: that doesn't start with sk-or- — starting anyway, but the key may be wrong."; }
  else { el("keyErr").textContent = ""; }
  apiKey = v;
  localStorage.setItem("parla_or_key", v);
  localStorage.setItem("parla_model", model);
  showApp();
});

// model toggle: smarter (accurate) vs faster (quick). Drives every tutor call.
const modelSel = el("modelSel");
if ([...modelSel.options].some(o => o.value === model)) modelSel.value = model;
else { model = modelSel.value; localStorage.setItem("parla_model", model); }
modelSel.addEventListener("change", () => {
  model = modelSel.value;
  localStorage.setItem("parla_model", model);
});

el("keyBtn").addEventListener("click", () => {
  if (window.exActive && window.ParlaExercises) ParlaExercises.close();
  el("voicePanel").classList.add("hidden");
  el("progressPanel").classList.add("hidden");
  if (window.cardsActive && window.ParlaCards) { ParlaCards.close(); el("stage").classList.add("hidden"); chatEl.classList.add("hidden"); el("micbar").classList.add("hidden"); }
  el("keyInput").value = apiKey;
  el("setup").classList.remove("hidden");
  el("stage").classList.add("hidden");
  chatEl.classList.add("hidden");
  el("micbar").classList.add("hidden");
});

el("resetBtn").addEventListener("click", () => { newConversation(); });

/* ---------- 🗣 Voice settings panel ---------- */
const TTS_PRESETS = [
  { label: "OpenAI gpt-4o-mini-tts · nova (female)",  model: "openai/gpt-4o-mini-tts-2025-12-15", voice: "nova" },
  { label: "OpenAI gpt-4o-mini-tts · coral (female)", model: "openai/gpt-4o-mini-tts-2025-12-15", voice: "coral" },
  { label: "OpenAI gpt-4o-mini-tts · onyx (male)",    model: "openai/gpt-4o-mini-tts-2025-12-15", voice: "onyx" },
  { label: "Microsoft MAI-Voice-2 · Isabella it-IT (try)", model: "microsoft/mai-voice-2", voice: "it-IT-IsabellaNeural" },
  { label: "Microsoft MAI-Voice-2 · Diego it-IT (try)",    model: "microsoft/mai-voice-2", voice: "it-IT-DiegoNeural" },
  { label: "Grok Voice TTS · eve (try)", model: "x-ai/grok-voice-tts-1.0", voice: "eve" },
  { label: "Custom — type a model and voice below", model: null, voice: null },
];
const VOICE_SAMPLE = "Ciao! Sono Giulia. Vuoi ordinare un caffè o un cappuccino?";

function fillBrowserVoiceSel() {
  const sel = el("browserVoiceSel"), tip = el("browserVoiceTip");
  if (!sel) return;
  const vs = italianVoices().sort((a, b) => voiceScore(b) - voiceScore(a));
  sel.innerHTML = "";
  if (!vs.length) {
    sel.appendChild(new Option("No Italian voice installed on this device", ""));
    sel.disabled = true;
  } else {
    sel.disabled = false;
    vs.forEach(v => sel.appendChild(new Option((voiceScore(v) >= 10 ? "★ " : "") + v.name + " (" + v.lang + ")", v.voiceURI)));
    sel.value = itVoice ? itVoice.voiceURI : vs[0].voiceURI;
  }
  const good = vs.some(v => voiceScore(v) >= 10);
  const ios = /iPad|iPhone|Macintosh/.test(navigator.userAgent) && "ontouchend" in document;
  tip.className = "pill";
  tip.textContent = good ? "★ = natural-sounding neural voice (recommended)."
    : ios ? "Tip: iPad → Settings → Accessibility → Spoken Content → Voices → Italian → download an Enhanced or Premium voice, then reopen Parla."
    : "Tip: in Microsoft Edge, look for “Microsoft Isabella / Elsa / Diego Online (Natural)” — they sound far better than the standard voices.";
}
function paintVoicePanel() {
  document.querySelectorAll('input[name="ttsEngine"]').forEach(r => { r.checked = r.value === ttsEngine; });
  el("voptBrowser").classList.toggle("on", ttsEngine === "browser");
  el("voptPremium").classList.toggle("on", ttsEngine === "premium");
  el("ttsModel").value = ttsModel;
  el("ttsVoice").value = ttsVoice;
  const ps = el("ttsPreset");
  if (!ps.options.length) TTS_PRESETS.forEach((p, i) => ps.appendChild(new Option(p.label, String(i))));
  const hit = TTS_PRESETS.findIndex(p => p.model === ttsModel && p.voice === ttsVoice);
  ps.value = String(hit >= 0 ? hit : TTS_PRESETS.length - 1);
  fillBrowserVoiceSel();
}
function saveVoiceSettings() {
  ttsModel = el("ttsModel").value.trim() || ttsModel;
  ttsVoice = el("ttsVoice").value.trim() || ttsVoice;
  localStorage.setItem("parla_tts_engine", ttsEngine);
  localStorage.setItem("parla_tts_model", ttsModel);
  localStorage.setItem("parla_tts_voice", ttsVoice);
  ttsWarned = false;
}
document.querySelectorAll('input[name="ttsEngine"]').forEach(r => r.addEventListener("change", () => {
  ttsEngine = r.value; saveVoiceSettings(); paintVoicePanel();
}));
el("browserVoiceSel").addEventListener("change", (e) => {
  browserVoiceURI = e.target.value;
  localStorage.setItem("parla_voice_uri", browserVoiceURI);
  pickItalianVoice();
});
el("ttsPreset").addEventListener("change", (e) => {
  const p = TTS_PRESETS[+e.target.value];
  if (p && p.model) { el("ttsModel").value = p.model; el("ttsVoice").value = p.voice; }
  else el("ttsModel").focus();
  saveVoiceSettings();
  el("ttsErr").textContent = "";
});
["ttsModel", "ttsVoice"].forEach(id => el(id).addEventListener("change", () => { saveVoiceSettings(); paintVoicePanel(); }));
el("testBrowserVoice").addEventListener("click", () => {
  const prev = ttsEngine; ttsEngine = "browser";
  speakParts([{ text: VOICE_SAMPLE }], { autoListen: false });
  ttsEngine = prev;
});
el("testPremiumVoice").addEventListener("click", async () => {
  saveVoiceSettings();
  const err = el("ttsErr"), b = el("testPremiumVoice");
  err.textContent = ""; b.disabled = true; b.textContent = "▶ Loading…";
  try {
    await fetchTTS(VOICE_SAMPLE);
    const prev = ttsEngine; ttsEngine = "premium";
    speakParts([{ text: VOICE_SAMPLE }], { autoListen: false });
    ttsEngine = prev;
  } catch (e) {
    err.textContent = "Didn't work: " + e.message + " — try another preset, or check the voice name on the model's OpenRouter page.";
  } finally { b.disabled = false; b.textContent = "▶ Test"; }
});
el("voiceBtn").addEventListener("click", () => {
  if (window.exActive && window.ParlaExercises) ParlaExercises.close();
  speechSynthesis.cancel();
  el("setup").classList.add("hidden");
  if (window.cardsActive && window.ParlaCards) ParlaCards.close();
  ["stage", "micbar", "progressPanel"].forEach(id => el(id).classList.add("hidden"));
  chatEl.classList.add("hidden");
  paintVoicePanel();
  el("voicePanel").classList.remove("hidden");
});
el("voiceDone").addEventListener("click", () => {
  saveVoiceSettings();
  speechSynthesis.cancel();
  el("voicePanel").classList.add("hidden");
  if (apiKey) { el("stage").classList.remove("hidden"); chatEl.classList.remove("hidden"); el("micbar").classList.remove("hidden"); }
  else el("setup").classList.remove("hidden");
});

// Topic / scenario picker — switching starts that scene fresh, in character.
const topicSel = el("topicSel");
// ✓-mark grammar topics you've practised (3+ exchanges), and show progress in the group label
function paintPracticed() {
  [...topicSel.options].forEach(o => {
    const base = o.dataset.label || (o.dataset.label = o.textContent);
    o.textContent = practiced.has(o.value) ? "✓ " + base : base;
  });
  [...topicSel.querySelectorAll("optgroup")].forEach(g => {
    const base = g.dataset.label || (g.dataset.label = g.label);
    if (!/^Grammar/.test(base)) return;
    const opts = [...g.children];
    const done = opts.filter(o => practiced.has(o.value)).length;
    g.label = `${base} — ${done}/${opts.length} ✓`;
  });
}
paintPracticed();
topicSel.value = topic;
topicSel.addEventListener("change", () => {
  topic = topicSel.value;
  localStorage.setItem("parla_topic", topic);
  newConversation();
});

// "Correct me" toggle — speak the corrected version of what you said.
const correctBtn = el("correctBtn");
function paintCorrect() {
  correctBtn.textContent = correctMe ? "✏️ Correct me: On" : "✏️ Correct me: Off";
  correctBtn.classList.toggle("toggle-on", correctMe);
}
paintCorrect();
correctBtn.addEventListener("click", () => {
  correctMe = !correctMe;
  localStorage.setItem("parla_correct", correctMe ? "1" : "0");
  paintCorrect();
});

// 💡 Suggestions toggle — contextual "you could say…" tips under the conversation.
const suggestBtn = el("suggestBtn");
function paintSuggest() {
  suggestBtn.textContent = suggestOn ? "💡 Suggestions: On" : "💡 Suggestions: Off";
  suggestBtn.classList.toggle("toggle-on", suggestOn);
}
paintSuggest();
suggestBtn.addEventListener("click", () => {
  suggestOn = !suggestOn;
  localStorage.setItem("parla_suggest", suggestOn ? "1" : "0");
  paintSuggest();
  if (!suggestOn) showSuggestion(null);   // hide any tip currently on screen
});

// 📖 Grammar review of the current conversation
el("grammarBtn").addEventListener("click", explainGrammar);

// 📇 spaced-repetition review of saved words (or show the notebook if nothing's due)
el("reviewBtn").addEventListener("click", () => {
  if (recognizing) return;
  const due = vocabDue();
  if (!due.length) { showNotebook(); return; }
  startRecall(
    due.slice(0, 10).map(v => ({ en: v.en || "Ripeti: " + v.it, it: v.it, ref: v })),
    "review"
  );
});

// 📋 session report
el("reportBtn").addEventListener("click", showReport);

// "How do you say…?" lookup — typed, or spoken in English via 🎙 EN
el("askBtn").addEventListener("click", handleAsk);
el("askInput").addEventListener("keydown", (e) => { if (e.key === "Enter") handleAsk(); });
el("askMicBtn").addEventListener("click", () => {
  if (recognizing) return;
  speechSynthesis.cancel();
  recordMode = "askEN";
  startRecording();
});

