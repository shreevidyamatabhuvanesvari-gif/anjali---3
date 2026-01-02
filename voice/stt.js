/* =========================================================
   voice/tts.js
   FINAL – SIMPLE & WORKING (Android Chrome / Samsung)
   ========================================================= */
(function (window, document) {
  "use strict";

  if (!("speechSynthesis" in window)) return;

  let unlocked = false;

  function unlock() {
    if (unlocked) return;
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    window.speechSynthesis.speak(u);
    unlocked = true;
  }

  document.addEventListener("click", unlock, { once: true });
  document.addEventListener("touchstart", unlock, { once: true });

  window.TTS = {
    init() { unlock(); },
    speak(text) {
      if (!text) return;
      unlock();
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "hi-IN";
      u.rate = 1; u.pitch = 1; u.volume = 1;
      window.speechSynthesis.speak(u);
    },
    stop() { window.speechSynthesis.cancel(); }
  };
})(window, document);
