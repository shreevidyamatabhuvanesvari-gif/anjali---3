/* =========================================================
   tts.js
   Role: Text To Speech (FINAL, STABLE)
   Works: Android Chrome, Samsung Internet
   ========================================================= */

(function (window, document) {
  "use strict";

  if (!("speechSynthesis" in window)) {
    console.error("SpeechSynthesis not supported");
    return;
  }

  let unlocked = false;

  // 🔓 Mobile audio unlock (MANDATORY)
  function unlockAudio() {
    if (unlocked) return;
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    window.speechSynthesis.speak(u);
    unlocked = true;
  }

  // User gesture unlock
  document.addEventListener("click", unlockAudio, { once: true });
  document.addEventListener("touchstart", unlockAudio, { once: true });

  const TTS = {
    speak(text) {
      if (!text) return;
      unlockAudio();
      window.speechSynthesis.cancel();

      const u = new SpeechSynthesisUtterance(text);
      u.lang = "hi-IN";
      u.rate = 1;
      u.pitch = 1;
      u.volume = 1;

      window.speechSynthesis.speak(u);
    }
  };

  window.TTS = TTS;

})(window, document);
