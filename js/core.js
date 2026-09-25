/* Parla — state, avatar, voices/TTS, practice, vocabulary & streak, UI helpers (classic script; shares globals with the other js/ files, load order matters) */
let topic = localStorage.getItem("parla_topic") || "free";
let correctMe = localStorage.getItem("parla_correct") !== "0";   // default on
let suggestOn = localStorage.getItem("parla_suggest") !== "0";   // 💡 suggested next phrase, default on
let practiced = new Set(JSON.parse(localStorage.getItem("parla_practiced") || "[]"));  // grammar topics done (✓)
let turnsThisTopic = 0;              // your turns in the current conversation
let recordMode = "chat";             // 'chat' | 'practice' (repeat) | 'askEN' (speak English) | 'recall' (review/drill)
let practiceTarget = null;           // the Italian phrase being practised

/* ---- vocabulary notebook (spaced repetition), streak stats, session log ---- */
let vocab = JSON.parse(localStorage.getItem("parla_vocab") || "[]");   // [{it,en,added,due,interval,reps}]
let stats = JSON.parse(localStorage.getItem("parla_stats") || "{}");   // { "2026-07-03": minutes }
let session = { corrections: [], words: [], turns: 0 };                // this sitting only
let lastActivity = 0;
let recallQueue = [], recallCurrent = null, recallKind = null, recallTotal = 0, recallScore = 0;

const el = (id) => document.getElementById(id);
const chatEl = el("chat"), statusEl = el("status"), micEl = el("mic");

/* ---------- avatar (Giulia's face) ---------- */
const Avatar = (() => {
  const ring = () => el("faceRing");
  const mouth = () => el("mouth");
  const tongue = () => el("tongue");
  const stateLabel = () => el("avatarState");
  let mouthTimer = null;

  function setState(s) {
    const r = ring(); if (!r) return;
    r.classList.remove("listening", "thinking", "speaking");
    if (s !== "idle") r.classList.add(s);
    const labels = { idle: "ready", listening: "listening…", thinking: "thinking…", speaking: "speaking" };
    if (stateLabel()) stateLabel().textContent = labels[s] || "ready";
  }

  // blink loop
  function blink() {
    document.querySelectorAll("#eyes .blink").forEach(g => {
      g.style.transform = "scaleY(0.1)";
      setTimeout(() => { g.style.transform = "scaleY(1)"; }, 110);
    });
  }
  function scheduleBlink() {
    setTimeout(() => { blink(); scheduleBlink(); }, 2200 + Math.random() * 2800);
  }

  // gentle idle eye drift
  function scheduleGaze() {
    setTimeout(() => {
      const dx = (Math.random() * 4 - 2);
      const l = el("pupilL"), rr = el("pupilR");
      if (l && rr) { l.setAttribute("cx", 80 + dx); rr.setAttribute("cx", 120 + dx); }
      scheduleGaze();
    }, 1800 + Math.random() * 2600);
  }

  function startTalking() {
    setState("speaking");
    if (mouthTimer) clearInterval(mouthTimer);
    mouthTimer = setInterval(() => {
      const open = 2 + Math.random() * 9;        // ry: how open
      const wide = 11 + Math.random() * 6;       // rx: how wide
      mouth().setAttribute("ry", open.toFixed(1));
      mouth().setAttribute("rx", wide.toFixed(1));
      mouth().setAttribute("cy", (130 - open * 0.3).toFixed(1));
      tongue().setAttribute("opacity", open > 7 ? "0.8" : "0");
    }, 110);
  }
  function stopTalking() {
    if (mouthTimer) { clearInterval(mouthTimer); mouthTimer = null; }
    mouth().setAttribute("ry", "3");
    mouth().setAttribute("rx", "14");
    mouth().setAttribute("cy", "130");
    tongue().setAttribute("opacity", "0");
    setState("idle");
  }

  let started = false;
  function start() { if (started) return; started = true; scheduleBlink(); scheduleGaze(); }
  return { setState, startTalking, stopTalking, start };
})();

let apiKey = localStorage.getItem("parla_or_key") || "";
let model = localStorage.getItem("parla_model") || DEFAULT_MODEL;
let history = [];          // [{role:'user'|'assistant', content:'...'}]
let recognizing = false;
let itVoice = null;

/* ---------- voices (text-to-speech) ---------- */
// Voice settings (🗣 Voice panel): browser voice, or a premium OpenRouter voice.
let ttsEngine = localStorage.getItem("parla_tts_engine") || "browser";
let ttsModel  = localStorage.getItem("parla_tts_model")  || "openai/gpt-4o-mini-tts-2025-12-15";
let ttsVoice  = localStorage.getItem("parla_tts_voice")  || "nova";
let browserVoiceURI = localStorage.getItem("parla_voice_uri") || "";

function italianVoices() { return speechSynthesis.getVoices().filter(v => /^it([-_]|$)/i.test(v.lang)); }
// Prefer the natural-sounding neural voices (Edge "Online (Natural)", Apple "Enhanced/Premium").
function voiceScore(v) {
  let s = 0;
  if (/it[-_]IT/i.test(v.lang)) s += 2;
  if (/natural|online|neural|premium|enhanced|siri/i.test(v.name)) s += 10;
  if (/isabella|elsa|federica|alice|diego/i.test(v.name)) s += 1;
  return s;
}
function pickItalianVoice() {
  const vs = italianVoices().sort((a, b) => voiceScore(b) - voiceScore(a));
  itVoice = vs.find(v => v.voiceURI === browserVoiceURI) || vs[0] || null;
  if (typeof fillBrowserVoiceSel === "function") fillBrowserVoiceSel();
}
speechSynthesis.onvoiceschanged = pickItalianVoice;
pickItalianVoice();

// iOS/iPad: Safari mutes the voice until speech is first triggered during a real
// tap. Unlock it on the first touch anywhere so Giulia can be heard afterwards.
let _speechUnlocked = false;
function unlockSpeech() {
  if (_speechUnlocked) return;
  _speechUnlocked = true;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    speechSynthesis.speak(u);
  } catch (e) {}
  try { ttsAudio.src = SILENT_WAV; ttsAudio.play().catch(() => {}); } catch (e) {}   // lets premium audio play later on iPad
  pickItalianVoice();
}
["touchend", "pointerup", "mousedown"].forEach(ev =>
  document.addEventListener(ev, unlockSpeech, { once: true, passive: true }));

function cleanItalian(text) {
  // Voice ONLY the Italian: strip any leaked label / English / correction / suggestion text.
  return String(text || "").replace(/^\s*IT:\s*/i, "").split(/\s*\b(?:EN|FIX|KEY|AREA|SUG)\s*:/i)[0].trim();
}

// Speak one or more Italian phrases in order. The mouth animates throughout and
// hands-free only resumes after the LAST phrase. parts: [{ text, rate }].
let _utterRefs = [];        // hold references: browsers GC utterances and then never fire onend
let _speakAbandon = null;   // lets a newer speakParts silence an older one's callbacks

/* ---- premium voice (OpenRouter /audio/speech) ---- */
const SILENT_WAV = "data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==";
const ttsAudio = new Audio();
const ttsCache = new Map();          // "model|voice|text" → Promise<blob URL>  (replays are free)
let ttsWarned = false;
function fetchTTS(text) {
  const key = ttsModel + "|" + ttsVoice + "|" + text;
  if (ttsCache.has(key)) return ttsCache.get(key);
  const p = (async () => {
    const res = await apiFetch("/audio/speech", { model: ttsModel, voice: ttsVoice, input: text, response_format: "mp3" }, { timeoutMs: 15000 });
    const blob = await res.blob();
    if (!blob.size) throw new Error("empty audio");
    logCost("tts", text.length);
    return URL.createObjectURL(blob);
  })();
  ttsCache.set(key, p);
  p.catch(() => ttsCache.delete(key));   // don't cache failures
  return p;
}
function ttsFailed(e) {
  if (ttsWarned) return;
  ttsWarned = true;
  setStatus("⚠️ Premium voice unavailable (" + e.message + ") — using the browser voice. Check 🗣 Voice settings.");
}
function audioPlaying() { return !ttsAudio.paused && !ttsAudio.ended; }
function isSpeaking() { return speechSynthesis.speaking || audioPlaying(); }
// Every existing speechSynthesis.cancel() in the app should also stop premium audio.
(() => {
  const orig = speechSynthesis.cancel.bind(speechSynthesis);
  speechSynthesis.cancel = () => { orig(); try { ttsAudio.pause(); } catch (e) {} };
})();

// One phrase with the browser voice. Own onend + watchdog, so a lost onend
// event (Edge/Chrome bug) can't stall the chain.
function sayBrowser(p, next) {
  const u = new SpeechSynthesisUtterance(p.text);
  u.lang = "it-IT";
  if (itVoice) u.voice = itVoice;
  u.rate = p.rate;
  _utterRefs = [u];                         // keep a live reference (prevents GC losing onend)
  let fired = false, watch = null, sawSpeaking = false;
  const t0 = Date.now();
  const fin = () => { if (fired) return; fired = true; clearInterval(watch); next(); };
  u.onend = fin;
  u.onerror = fin;
  speechSynthesis.speak(u);
  watch = setInterval(() => {
    if (speechSynthesis.speaking || speechSynthesis.pending) { sawSpeaking = true; return; }
    if (sawSpeaking || Date.now() - t0 > 2500) fin();   // finished, or never started → move on
  }, 250);
}
// One phrase with premium audio; the rate maps to playback speed (pitch preserved).
function sayPremium(p, url, next, fallback) {
  let fired = false, wd = null;
  const release = () => { if (ttsAudio.onended === fin) ttsAudio.onended = ttsAudio.onerror = null; };   // never clear a newer phrase's handlers
  const fin = () => { if (fired) return; fired = true; clearTimeout(wd); release(); next(); };
  const fail = () => { if (fired) return; fired = true; clearTimeout(wd); release(); fallback(); };
  ttsAudio.onended = fin;
  ttsAudio.onerror = fail;
  ttsAudio.src = url;
  ttsAudio.preservesPitch = true;
  ttsAudio.playbackRate = Math.max(0.5, Math.min(2, p.rate / 0.95));
  wd = setTimeout(fin, 45000);             // safety net
  ttsAudio.play().catch((e) => { if (e && e.name === "AbortError") return; fail(); });   // AbortError = interrupted by a newer phrase
}

function speakParts(parts, opts) {
  const autoListen = !opts || opts.autoListen !== false;   // replay buttons pass {autoListen:false}
  const onDone = opts && opts.onDone;                      // e.g. start listening for a repeat
  if (_speakAbandon) _speakAbandon();                      // an older sequence must never fire its onDone now
  speechSynthesis.cancel();                                // (also stops premium audio)
  const items = parts.map(p => ({ text: cleanItalian(p.text), rate: p.rate || 0.95 })).filter(p => p.text);
  const done = () => { _speakAbandon = null; Avatar.stopTalking(); if (onDone) onDone(); else if (autoListen) maybeAutoListen(); };
  if (!items.length) { done(); return; }

  let abandoned = false;
  _speakAbandon = () => { abandoned = true; };
  Avatar.startTalking();

  // Premium: request every phrase's audio at once so there's no gap between them.
  const premium = ttsEngine === "premium" && !!apiKey;
  const urls = premium ? items.map(p => fetchTTS(p.text)) : null;
  if (urls) urls.forEach(u => u.catch(() => {}));

  // Speak phrases ONE AT A TIME, so the gap between phrases is never mistaken
  // for the end of the sequence.
  let idx = 0;
  const speakOne = () => {
    if (abandoned) return;
    if (idx >= items.length) { done(); return; }
    const i = idx++, p = items[i];
    let advanced = false;
    const next = () => { if (advanced || abandoned) return; advanced = true; speakOne(); };
    if (!premium) { sayBrowser(p, next); return; }
    urls[i].then(
      url => { if (!abandoned) sayPremium(p, url, next, () => { if (!abandoned) sayBrowser(p, next); }); },
      e => { if (abandoned) return; ttsFailed(e); sayBrowser(p, next); }
    );
  };
  speakOne();
}
function speak(text) { speakParts([{ text }]); }

// 🔊 normal + 🐢 slow replay buttons for an Italian phrase (never resumes hands-free).
function makeReplay(text) {
  const wrap = document.createElement("span");
  const b = document.createElement("button");
  b.className = "replay";
  b.title = "Hear it again";
  b.textContent = "🔊";
  b.addEventListener("click", () => speakParts([{ text }], { autoListen: false }));
  const slow = document.createElement("button");
  slow.className = "replay";
  slow.title = "Hear it slowly";
  slow.textContent = "🐢";
  slow.addEventListener("click", () => speakParts([{ text, rate: 0.65 }], { autoListen: false }));
  wrap.appendChild(b);
  wrap.appendChild(slow);
  return wrap;
}

// Start listening for the student to repeat a phrase.
let practiceAttempts = 0;
let resumeAfterPractice = false;   // true = this drill sits inside the conversation; resume chat when done
function beginPractice(target) {
  if (recognizing) return;
  if (micEl.disabled) { setTimeout(() => beginPractice(target), 200); return; }   // mic busy for a beat — retry
  practiceTarget = target;
  recordMode = "practice";
  startRecording();
}

// A "say it back" button: records you repeating the phrase, then checks you.
function makePracticeBtn(target, label = "🎤 Say it back") {
  const b = document.createElement("button");
  b.className = "replay";
  b.title = "Repeat the phrase out loud — I'll check you";
  b.textContent = label;
  b.addEventListener("click", () => {
    if (recognizing) return;
    speechSynthesis.cancel();
    practiceAttempts = 0;
    resumeAfterPractice = false;   // manual drill — don't auto-resume the chat afterwards
    beginPractice(target);
  });
  return b;
}

/* ---- compare what you said with the target phrase ---- */
function normalizePhrase(s) {
  return String(s || "").toLowerCase().replace(/[^\p{L}\p{N}\s']/gu, " ").replace(/\s+/g, " ").trim();
}
function charSim(a, b) {             // 1 = identical strings (character Levenshtein)
  if (!a || !b) return 0;
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => { const r = new Array(n + 1).fill(0); r[0] = i; return r; });
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - d[m][n] / Math.max(m, n);
}
// Word-level score: each wrong word counts. A near-miss word ("favori"~"favore")
// costs half, so small slips aren't as harsh as missing words entirely.
function similarity(a, b) {
  const wa = a.split(" ").filter(Boolean), wb = b.split(" ").filter(Boolean);
  if (!wa.length || !wb.length) return 0;
  const m = wa.length, n = wb.length;
  const d = Array.from({ length: m + 1 }, (_, i) => { const r = new Array(n + 1).fill(0); r[0] = i; return r; });
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      const cost = wa[i - 1] === wb[j - 1] ? 0 : (charSim(wa[i - 1], wb[j - 1]) >= 0.75 ? 0.5 : 1);
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  return 1 - d[m][n] / Math.max(m, n);
}

// Pronunciation hints from what the transcriber heard: double consonants (pala/palla),
// final vowels (-o/-a), accented endings (città) and words that went missing.
function pronTips(target, heard) {
  const plain = (w) => w.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const single = (w) => plain(w).replace(/([bcdfglmnprstvz])\1/g, "$1");
  const tw = normalizePhrase(target).split(" ").filter(Boolean), hw = normalizePhrase(heard).split(" ").filter(Boolean);
  const tips = [];
  for (const w of tw) {
    if (hw.includes(w)) continue;
    let best = null, bs = 0;
    for (const x of hw) { const sc = charSim(w, x); if (sc > bs) { bs = sc; best = x; } }
    if (best && plain(w).replace(/^h/, "") === plain(best)) continue;   // h is silent (ho / o) — not a mistake
    if (best && single(best) === single(w) && plain(best) !== plain(w))
      tips.push(`“${w}” — ${/([bcdfglmnprstvz])\1/.test(plain(w)) ? "hold the double consonant longer" : "don't double the consonant"} (heard “${best}”)`);
    else if (best && plain(best) === plain(w) && /[àèéìòù]/.test(w))
      tips.push(`“${w}” — stress the accented last syllable`);
    else if (best && best.length === w.length && best.slice(0, -1) === w.slice(0, -1))
      tips.push(`“${w}” — watch the ending: -${w.slice(-1)}, not -${best.slice(-1)}`);
    else if (best && bs >= 0.6)
      tips.push(`“${w}” came out as “${best}”`);
    else
      tips.push(`“${w}” wasn't heard — say it clearly`);
  }
  return tips.slice(0, 3);
}

function finishPractice(heard) {
  const target = practiceTarget;
  practiceTarget = null;
  addMessage("user", { it: heard });
  bumpActivity();
  const score = similarity(normalizePhrase(heard), normalizePhrase(target));
  if (score >= 0.9) {
    const resume = resumeAfterPractice; resumeAfterPractice = false;
    addMessage("assistant", { it: "Perfetto! 👏", hint: "Spot on — that's it!" });
    speakParts([{ text: "Perfetto!" }], { autoListen: resume });   // hands-free: conversation resumes by itself
    setStatus(resume ? "Perfetto! Now answer Giulia — " + (handsFree ? "she's listening." : "tap the mic.") : "Nailed it — keep going!");
    return;
  }
  // Not right yet: say the correct version, then automatically listen for the retry
  // (up to 3 goes, so you're never stuck in a loop).
  practiceAttempts++;
  let retry;
  if (practiceAttempts < 3) {
    retry = { autoListen: false, onDone: () => beginPractice(target) };
  } else {
    const resume = resumeAfterPractice; resumeAfterPractice = false;
    retry = { autoListen: resume };
    setStatus("Good effort — we'll come back to that one. " + (resume ? (handsFree ? "Now answer Giulia — she's listening." : "Now answer Giulia — tap the mic.") : "Carry on!"));
  }
  const tips = pronTips(target, heard);
  const tipText = tips.length ? "  Work on: " + tips.join(" · ") : "";
  if (score >= 0.55) {
    addMessage("assistant", { it: "Quasi! Riprova.", hint: "Almost! Listen — then say it again, I'm listening." + tipText, correction: target });
    speakParts([{ text: "Quasi! Si dice:" }, { text: target, rate: 0.8 }], retry);
  } else {
    addMessage("assistant", { it: "Riproviamo insieme.", hint: "Let's try again together — listen, then repeat." + tipText, correction: target });
    speakParts([{ text: target, rate: 0.75 }], retry);
  }
}

/* ---------- vocabulary notebook + spaced repetition ---------- */
function persistVocab() { localStorage.setItem("parla_vocab", JSON.stringify(vocab)); }
function vocabDue() { const now = Date.now(); return vocab.filter(v => v.due <= now); }

// Save a word/phrase. Corrections and lookups call this automatically.
function saveVocabItem(it, en) {
  it = String(it || "").trim();
  if (!it) return false;
  const key = normalizePhrase(it);
  const existing = vocab.find(v => normalizePhrase(v.it) === key);
  if (existing) { if (en && !existing.en) { existing.en = en; persistVocab(); } return false; }
  const item = { it, en: en || "", added: Date.now(), due: Date.now(), interval: 0, reps: 0 };
  vocab.push(item);
  persistVocab();
  if (!session.words.includes(it)) session.words.push(it);
  paintReviewBtn();
  if (!en) fetchEnFor(item);       // fill in the English quietly in the background
  return true;
}
async function fetchEnFor(item) {
  try {
    const t = await callModel([
      { role: "system", content: "Translate the Italian into natural English. Reply with ONLY the translation." },
      { role: "user", content: item.it },
    ], { maxTokens: 100 });
    if (t) { item.en = t; persistVocab(); }
  } catch {}
}
// Spaced repetition: right → interval grows (1, 3, 8, 20… days); wrong → back in 10 minutes.
function srsGot(item)    { item.reps++; item.interval = item.interval ? Math.round(item.interval * 2.5) : 1; item.due = Date.now() + item.interval * 86400000; persistVocab(); paintReviewBtn(); }
function srsMissed(item) { item.interval = 0; item.due = Date.now() + 10 * 60000; persistVocab(); paintReviewBtn(); }
function paintReviewBtn() {
  const n = vocabDue().length;
  const b = el("reviewBtn");
  if (b) b.textContent = n ? `📇 Review (${n})` : "📇 Words";
}

/* ---------- streak & minutes ---------- */
function dayKey(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function todayKey() { return dayKey(new Date()); }   // local day (UTC made late-night practice count for the wrong day)
function bumpActivity() {
  const now = Date.now();
  const add = lastActivity ? Math.min(now - lastActivity, 120000) : 30000;   // cap gaps at 2 min
  lastActivity = now;
  const k = todayKey();
  stats[k] = (stats[k] || 0) + add / 60000;
  localStorage.setItem("parla_stats", JSON.stringify(stats));
  paintStreak();
}
function minutesToday() { return Math.round(stats[todayKey()] || 0); }
function streakDays() {
  let n = 0;
  const d = new Date();
  for (;;) {
    const k = dayKey(d);
    if ((stats[k] || 0) >= 1) { n++; d.setDate(d.getDate() - 1); }
    else if (k === todayKey()) { d.setDate(d.getDate() - 1); }   // an empty "today" doesn't break the streak
    else break;
  }
  return n;
}
function paintStreak() {
  const s = el("streak");
  if (s) s.textContent = `🔥 ${streakDays()} · ${minutesToday()} min`;
}

/* ---------- recall engine: vocabulary review + pattern drills ---------- */
function startRecall(items, kind) {
  if (recognizing || !items.length) return;
  speechSynthesis.cancel();
  recallQueue = items.slice();
  recallKind = kind;
  recallTotal = items.length;
  recallScore = 0;
  nextRecall();
}
function nextRecall() {
  recallCurrent = recallQueue.shift() || null;
  if (!recallCurrent) {
    const msg = recallKind === "drill" ? `Pattern drilled — ${recallScore}/${recallTotal}!` : `Review done — ${recallScore}/${recallTotal} right.`;
    recallKind = null;
    addMessage("assistant", { it: "Ottimo lavoro!", hint: msg });
    speakParts([{ text: "Ottimo lavoro!" }], { autoListen: false });
    setStatus(msg + "  Carry on with the conversation whenever you like.");
    return;
  }
  addMessage("assistant", { it: "", hint: (recallKind === "drill" ? "🔁 Now say: " : "📇 How do you say: ") + recallCurrent.en });
  beginRecall();
}
function beginRecall() {
  if (micEl.disabled) return;
  recordMode = "recall";
  startRecording();
}
function finishRecall(heard) {
  const cur = recallCurrent;
  if (!cur) return;
  addMessage("user", { it: heard });
  const score = similarity(normalizePhrase(heard), normalizePhrase(cur.it));
  bumpActivity();
  if (score >= 0.8) {
    recallScore++;
    if (cur.ref) srsGot(cur.ref);
    addMessage("assistant", { it: "Perfetto! 👏", hint: "That's it!" });
    speakParts([{ text: "Perfetto!" }], { autoListen: false, onDone: nextRecall });
  } else {
    if (cur.ref) srsMissed(cur.ref);
    addMessage("assistant", { it: "", hint: "Not quite — it's:", correction: cur.it });
    speakParts([{ text: cur.it, rate: 0.8 }], { autoListen: false, onDone: nextRecall });
  }
}
function abortRecall(msg) {
  if (!recallKind) return;
  recallQueue = [];
  recallKind = null;
  recallCurrent = null;
  if (msg) setStatus(msg);
}

// 🔁 variations of a sentence pattern, e.g. "vorrei un caffè" → table / bill / ticket
async function makeVariations(sentence) {
  const raw = await callModel([
    { role: "system", content: "The user gives an Italian sentence. Create 3 SHORT variations that reuse the same sentence pattern but swap the key content word(s), suitable for a beginner. Reply with EXACTLY 3 lines, each formatted as: English cue | Italian sentence. Nothing else." },
    { role: "user", content: sentence },
  ], { maxTokens: 250 });
  return raw.split("\n").map(l => {
    const p = l.split("|");
    return p.length >= 2 ? { en: p[0].replace(/^[\s\d.•-]+/, "").trim(), it: p[1].trim() } : null;
  }).filter(Boolean).slice(0, 3);
}
function makeDrillBtn(sentence) {
  const b = document.createElement("button");
  b.className = "replay";
  b.title = "Practise variations of this pattern";
  b.textContent = "🔁 Drill";
  b.addEventListener("click", async () => {
    if (recognizing) return;
    speechSynthesis.cancel();
    b.disabled = true; b.textContent = "🔁 …";
    try {
      const vars = await makeVariations(sentence);
      if (vars.length) startRecall(vars, "drill");
      else setStatus("Couldn't make variations for that one.");
    } catch (e) { setStatus("Drill failed: " + e.message); }
    b.disabled = false; b.textContent = "🔁 Drill";
  });
  return b;
}

/* ---------- UI helpers ---------- */
function addMessage(role, { it, hint, correction, exSet, retry }) {
  const wrap = document.createElement("div");
  wrap.className = "msg " + role;
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "🙂" : "👩‍🏫";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = `<div class="it"></div>`;
  const itDiv = bubble.querySelector(".it");
  if (role === "assistant" && it) {
    wordify(itDiv, it);                                                // tap any word to look it up
    itDiv.appendChild(makeReplay(it));                                 // 🔊/🐢 hear it again
  } else {
    itDiv.textContent = it || "";
  }
  if (correction) {
    const c = document.createElement("div");
    c.className = "correction";
    c.innerHTML = `<b>✏️ Say:</b> `;
    c.appendChild(document.createTextNode(correction));
    c.appendChild(makeReplay(correction));                            // 🔊/🐢 hear the correct pronunciation
    c.appendChild(makePracticeBtn(correction));                       // 🎤 then say it back for a check
    c.appendChild(makeDrillBtn(correction));                          // 🔁 drill variations of the pattern
    if (exSet && window.ParlaExercises) {                             // 🏋️ jump to the matching exercise set
      const set = ParlaExercises.sets.find(s => s.id === exSet);
      if (set) {
        const b = document.createElement("button");
        b.className = "replay ex-link";
        b.title = "Open the exercises for this grammar point (" + set.sheet + ")";
        b.textContent = "🏋️ Practise: " + set.title;
        b.addEventListener("click", () => ParlaExercises.openSet(set.id));
        c.appendChild(document.createElement("br"));
        c.appendChild(b);
      }
    }
    bubble.appendChild(c);
  }
  if (hint) {
    const h = document.createElement("div");
    h.className = "hint";
    h.textContent = hint;
    bubble.appendChild(h);
  }
  if (retry) {                                                        // failed request → one-tap retry
    const b = document.createElement("button");
    b.className = "ghost";
    b.style.marginTop = "8px";
    b.textContent = "↻ Try again";
    b.addEventListener("click", () => { wrap.remove(); retry(); });
    bubble.appendChild(b);
  }
  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chatEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
  return bubble;
}

function setStatus(t) { statusEl.textContent = t; }

// Wrap each word of an Italian sentence in a clickable span.
function wordify(div, sentence) {
  div.textContent = "";
  div.dataset.sentence = sentence;
  sentence.split(/(\p{L}[\p{L}']*)/gu).forEach(tok => {
    if (/^\p{L}/u.test(tok)) {
      const s = document.createElement("span");
      s.className = "w";
      s.textContent = tok;
      div.appendChild(s);
    } else if (tok) {
      div.appendChild(document.createTextNode(tok));
    }
  });
}

/* ---------- tap-a-word popover: meaning + save to notebook ---------- */
async function wordMeaning(word, sentence) {
  return callModel([
    { role: "system", content: "Give the English meaning of the Italian word as used in the sentence. Reply with ONLY the meaning, max 6 words." },
    { role: "user", content: `Word: ${word}\nSentence: ${sentence}` },
  ], { maxTokens: 60, timeoutMs: 15000 });
}

async function showWordPop(wEl) {
  const pop = el("wordPop");
  const word = wEl.textContent;
  const host = wEl.closest(".it");
  const sentence = host && host.dataset ? (host.dataset.sentence || "") : "";
  const r = wEl.getBoundingClientRect();
  pop.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 290)) + "px";
  pop.style.top = Math.min(r.bottom + 6, window.innerHeight - 140) + "px";
  pop.innerHTML = "";
  const head = document.createElement("div");
  head.className = "wp-word";
  head.textContent = word;
  head.appendChild(makeReplay(word));
  const mean = document.createElement("div");
  mean.className = "wp-mean";
  mean.textContent = "…";
  const save = document.createElement("button");
  save.className = "ghost";
  save.style.marginTop = "8px";
  save.textContent = "＋ Save to my words";
  pop.appendChild(head); pop.appendChild(mean); pop.appendChild(save);
  pop.classList.remove("hidden");
  let m = "";
  try { m = await wordMeaning(word, sentence); } catch { m = "(couldn't look that up)"; }
  mean.textContent = m;
  save.addEventListener("click", () => {
    saveVocabItem(word.toLowerCase(), m.startsWith("(") ? "" : m);
    save.textContent = "✓ Saved";
    save.disabled = true;
  });
}

document.addEventListener("click", (e) => {
  const w = e.target.closest(".w");
  if (w) { showWordPop(w); return; }
  if (!e.target.closest("#wordPop")) el("wordPop").classList.add("hidden");
});

// 💡 contextual "you could say…" box shown beneath the conversation (text only).
function showSuggestion(it, en) {
  const old = chatEl.querySelector(".suggestion");
  if (old) old.remove();
  if (!suggestOn || !it) return;
  const d = document.createElement("div");
  d.className = "suggestion";
  const label = document.createElement("div");
  label.className = "s-label";
  label.textContent = "💡 You could say…";
  const itDiv = document.createElement("div");
  itDiv.className = "s-it";
  itDiv.textContent = it;
  itDiv.appendChild(makeReplay(it));
  d.appendChild(label);
  d.appendChild(itDiv);
  if (en) {
    const enDiv = document.createElement("div");
    enDiv.className = "s-en";
    enDiv.textContent = en;
    d.appendChild(enDiv);
  }
  chatEl.appendChild(d);
  chatEl.scrollTop = chatEl.scrollHeight;
}

