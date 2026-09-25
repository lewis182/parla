/* Parla — start-up. Loaded LAST, once every other script has defined its functions. */
if (apiKey) showApp();

// Offline support: cache the app so exercises, flashcards and past conversations work without signal.
// (Service workers need https or localhost — GitHub Pages and "Start Parla.bat" both qualify.)
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  const reg = () => navigator.serviceWorker.register("sw.js").catch(e => console.warn("Offline cache not available:", e.message));
  if (document.readyState === "complete") reg(); else window.addEventListener("load", reg);
}
