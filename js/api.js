/* Parla — OpenRouter calls: one helper with a timeout and friendly errors, plus a running cost tally
   (classic script; shares globals with the other js/ files, load order matters) */
const API_BASE = "https://openrouter.ai/api/v1";
const API_TIMEOUT_MS = 25000;

// Spending, per local day: { "2026-09-25": { usd, ttsChars, sttClips } }.
// usd is exact for tutor calls (OpenRouter reports it); voice & transcription are counted, not priced.
let costLog = (() => { try { return JSON.parse(localStorage.getItem("parla_cost") || "{}"); } catch { return {}; } })();
const sessionCost = { usd: 0, ttsChars: 0, sttClips: 0, calls: 0 };
function logCost(kind, amount) {
  if (!amount) return;
  const k = todayKey();
  const d = costLog[k] || (costLog[k] = { usd: 0, ttsChars: 0, sttClips: 0 });
  const field = { usd: "usd", tts: "ttsChars", stt: "sttClips" }[kind];
  d[field] = (d[field] || 0) + amount;
  sessionCost[field] += amount;
  try { localStorage.setItem("parla_cost", JSON.stringify(costLog)); } catch {}
}
function fmtUSD(x) { return !x ? "$0.00" : x < 0.01 ? "<$0.01" : "$" + x.toFixed(2); }

function friendlyApiError(status, body) {
  let msg = body;
  try { msg = JSON.parse(body).error?.message || body; } catch {}
  if (status === 401) return "your OpenRouter key was rejected — tap 🔑 to check it";
  if (status === 402) return "your OpenRouter credit has run out — top up at openrouter.ai";
  if (status === 429) return "too many requests — wait a moment and try again";
  return String(msg).slice(0, 200);
}

// POST to OpenRouter with a time limit. Throws an Error with a readable message.
async function apiFetch(path, body, { timeoutMs = API_TIMEOUT_MS } = {}) {
  if (!apiKey) throw new Error("no OpenRouter key — tap 🔑 to add one");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(API_BASE + path, {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "content-type": "application/json",
        "authorization": "Bearer " + apiKey,
        "HTTP-Referer": location.origin,   // lets OpenRouter attribute the app
        "X-Title": "Parla Italian Tutor",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) { const b = await res.text(); throw new Error(`${res.status}: ${friendlyApiError(res.status, b)}`); }
    return res;
  } catch (e) {
    if (e.name === "AbortError") throw new Error(`no reply after ${Math.round(timeoutMs / 1000)}s — check your connection and try again`);
    if (e instanceof TypeError) throw new Error("network error — are you online?");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// Chat completion → reply text. Every tutor/translation/lookup call goes through here.
async function callModel(messages, { maxTokens = 300, timeoutMs } = {}) {
  const res = await apiFetch("/chat/completions", { model, max_tokens: maxTokens, messages, usage: { include: true } }, { timeoutMs });
  const data = await res.json();
  sessionCost.calls++;
  if (data.usage && typeof data.usage.cost === "number") logCost("usd", data.usage.cost);
  return (data.choices?.[0]?.message?.content || "").trim();
}
