/* Parla — listening: recording, silence detection, transcription, hands-free (classic script; shares globals with the other js/ files, load order matters) */
/* ---------- listening: record audio, transcribe via OpenRouter (Whisper) ---------- */
const STT_MODEL = "openai/whisper-large-v3";   // served by Groq/Together; works under a no-training data policy
let mediaRecorder = null, audioChunks = [], mediaStream = null, recordingCancelled = false;
let handsFree = localStorage.getItem("parla_handsfree") === "1";

// Pick an audio format this browser can actually record. Edge/Chrome do webm;
// iPad/Safari does mp4 (→ m4a). Whichever we use, we tell Whisper the matching format.
let recMime = "", recFormat = "webm";
function pickRecMime() {
  if (recMime) return;
  const cands = [["audio/webm", "webm"], ["audio/mp4", "m4a"], ["audio/ogg", "ogg"], ["audio/mpeg", "mp3"]];
  for (const [m, f] of cands) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { recMime = m; recFormat = f; return; }
  }
  recMime = ""; recFormat = "webm";   // fall back to the browser default
}

/* voice-activity detection: auto-stop a moment after the speaker goes quiet */
let audioCtx = null, vadRAF = null;
const SPEAK_THRESHOLD = 0.02;   // mic loudness that counts as "talking"
const SILENCE_CHAT = 2800;      // building a sentence: allow long thinking pauses
const SILENCE_DRILL = 2000;     // repeating a known short phrase: a bit snappier
const NO_SPEECH_MS = 12000;     // give up if nothing is said at all
const MAX_RECORD_MS = 30000;    // hard cap on one turn

function startVAD(stream) {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const src = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  src.connect(analyser);
  const buf = new Uint8Array(analyser.fftSize);
  const silenceMs = recordMode === "chat" ? SILENCE_CHAT : SILENCE_DRILL;
  let spoke = false, lastSound = performance.now(), started = performance.now();
  const tick = () => {
    analyser.getByteTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
    const rms = Math.sqrt(sum / buf.length), now = performance.now();
    if (rms > SPEAK_THRESHOLD) { spoke = true; lastSound = now; }
    if (spoke && now - lastSound > silenceMs) return stopRecording();      // finished after a real pause
    if (!spoke && now - started > NO_SPEECH_MS) return cancelRecording();  // silent the whole time
    if (now - started > MAX_RECORD_MS) return stopRecording();             // safety cap
    vadRAF = requestAnimationFrame(tick);
  };
  vadRAF = requestAnimationFrame(tick);
}
function stopVAD() {
  if (vadRAF) cancelAnimationFrame(vadRAF);
  vadRAF = null;
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
}

async function ensureStream() {
  if (mediaStream && mediaStream.active) return mediaStream;
  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return mediaStream;
}
function releaseStream() {
  if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
}

async function startRecording() {
  let stream;
  try { stream = await ensureStream(); }
  catch (e) { setStatus("Couldn't access the microphone — allow mic access and try again."); return; }
  audioChunks = [];
  recordingCancelled = false;
  pickRecMime();
  mediaRecorder = recMime ? new MediaRecorder(stream, { mimeType: recMime }) : new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size) audioChunks.push(e.data); };
  mediaRecorder.onstop = onRecordingStop;
  mediaRecorder.start();
  recognizing = true;
  micEl.classList.add("listening");
  Avatar.setState("listening");
  const useVAD = handsFree || recordMode !== "chat";   // practice & spoken-English always auto-stop on silence
  if (recordMode === "practice") setStatus("🎙 Your turn — say: “" + practiceTarget + "”");
  else if (recordMode === "recall") setStatus("🎙 In italiano: “" + (recallCurrent ? recallCurrent.en : "") + "”");
  else if (recordMode === "askEN") setStatus("🎙 Say the English word or phrase…");
  else if (recordMode === "exercise") setStatus("🎙 Say your answer…");
  else if (handsFree) setStatus("🎙 Listening… just speak — I'll send automatically when you pause.");
  else setStatus("🔴 Recording… tap the mic again when you've finished speaking.");
  if (useVAD) startVAD(stream);
}

function stopRecording() {           // finish & send
  stopVAD();
  if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
  if (!handsFree) releaseStream();   // in hands-free we keep the mic warm for the next turn
  recognizing = false;
  micEl.classList.remove("listening");
}

function cancelRecording() {         // stop WITHOUT sending (e.g. nothing was said)
  recordingCancelled = true;
  stopVAD();
  if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
  recognizing = false;
  micEl.classList.remove("listening");
}

async function onRecordingStop() {
  const mode = recordMode;
  recordMode = "chat";                                   // always reset; practiceTarget handled below
  const toExercise = (text, err) => { Avatar.setState("idle"); if (window.ParlaExercises) ParlaExercises.heard(text, err); };
  if (recordingCancelled) {
    if (mode === "exercise") { recordingCancelled = false; toExercise(null); return; }
    recordingCancelled = false;
    practiceTarget = null;
    resumeAfterPractice = false;
    abortRecall("Review paused — tap 📇 to pick it up again.");
    Avatar.setState("idle");
    setStatus(handsFree ? "Didn't hear anything — tap 🎤 or Hands-free to resume." : "I didn't hear anything — tap the mic when you're ready.");
    return;
  }
  const blob = new Blob(audioChunks, { type: recMime || "audio/webm" });
  if (!blob.size && mode === "exercise") { toExercise(null); return; }
  if (!blob.size) { practiceTarget = null; abortRecall(); setStatus("Didn't catch anything — tap and speak."); Avatar.setState("idle"); return; }
  setStatus("Transcribing…");
  Avatar.setState("thinking");
  micEl.disabled = true;
  try {
    const t0 = performance.now();
    const text = await transcribe(blob, mode === "askEN" ? "en" : "it");
    const sttSecs = ((performance.now() - t0) / 1000).toFixed(1);
    micEl.disabled = false;
    if (mode === "exercise") { toExercise(text && text.trim() ? text : null); return; }
    if (!text || !text.trim()) { practiceTarget = null; setStatus("Didn't catch that — tap and try again."); Avatar.setState("idle"); return; }
    if (mode === "practice") finishPractice(text);
    else if (mode === "recall") finishRecall(text);
    else if (mode === "askEN") { el("askInput").value = text; handleAsk(); }
    else handleUserSpeech(text, sttSecs);
  } catch (e) {
    micEl.disabled = false;
    if (mode === "exercise") { toExercise(null, e.message); return; }
    practiceTarget = null;
    abortRecall();
    addMessage("assistant", { it: "", hint: "⚠️ Transcription failed: " + e.message });
    setStatus("Couldn't transcribe (see message above).");
    Avatar.setState("idle");
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => resolve(String(r.result).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

async function transcribe(blob, lang = "it") {
  const b64 = await blobToBase64(blob);
  const res = await apiFetch("/audio/transcriptions", {
    model: STT_MODEL,
    input_audio: { data: b64, format: recFormat },
    language: lang,
    provider: { data_collection: "deny" },   // only route to providers that don't store/train on your audio
  }, { timeoutMs: 30000 });
  const data = await res.json();
  logCost("stt", 1);
  if (data.usage && typeof data.usage.cost === "number") logCost("usd", data.usage.cost);
  return data.text || "";
}

micEl.addEventListener("click", () => {
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    setStatus("This browser can't record audio. Please use Chrome or Edge.");
    return;
  }
  speechSynthesis.cancel();
  if (recognizing) stopRecording();   // tap while recording = finish & send now
  else startRecording();              // tap to start
});

// In hands-free mode, start the next turn automatically once Giulia finishes speaking.
function maybeAutoListen() {
  if (window.exActive) return;       // never start the mic while the Exercises panel is open
  if (handsFree && !recognizing && !micEl.disabled) startRecording();
}

// Hands-free toggle
const handsFreeBtn = el("handsFreeBtn");
function paintHandsFree() {
  handsFreeBtn.textContent = handsFree ? "🤝 Hands-free: On" : "🤝 Hands-free: Off";
  handsFreeBtn.classList.toggle("toggle-on", handsFree);
}
paintHandsFree();
handsFreeBtn.addEventListener("click", () => {
  handsFree = !handsFree;
  localStorage.setItem("parla_handsfree", handsFree ? "1" : "0");
  paintHandsFree();
  if (handsFree) {
    if (!recognizing && !isSpeaking() && !micEl.disabled) startRecording();
    else setStatus("Hands-free on — I'll start listening as soon as Giulia finishes.");
  } else {
    if (recognizing) cancelRecording();
    releaseStream();
    setStatus("Hands-free off — tap the mic to talk.");
  }
});

