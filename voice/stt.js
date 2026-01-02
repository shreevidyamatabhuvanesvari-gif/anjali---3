/* =========================================================
   voice/stt.js
   Role: Speech To Text (FINAL – Minimal & Stable)
   Works on: Android Chrome, Samsung Internet
   Language: Hindi (hi-IN)
   ========================================================= */

(function (window) {
  "use strict";

  // ---------- Browser Support ----------
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("STT not supported in this browser");
    return;
  }

  let recognition = null;
  let listening = false;

  // ---------- STT API ----------
  const STT = {

    start() {
      if (listening) return;

      recognition = new SpeechRecognition();
      recognition.lang = "hi-IN";
      recognition.continuous = false;     // 🔑 SINGLE QUESTION MODE
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      listening = true;

      recognition.onstart = function () {
        console.log("🎤 STT started");
      };

      recognition.onresult = function (event) {
        const transcript =
          event.results[0][0].transcript.trim();

        console.log("🗣 Heard:", transcript);

        // बोलकर confirm करो
        if (window.TTS) {
          TTS.speak("आपने पूछा: " + transcript);
        }

        // 🔹 यहाँ future में LearningBridge जोड़ा जा सकता है
        // अभी केवल सुनना + बोलना

      };

      recognition.onerror = function (event) {
        console.error("STT error:", event.error);
        listening = false;

        if (window.TTS) {
          TTS.speak("मुझे स्पष्ट सुनाई नहीं दिया। कृपया फिर से बोलिए।");
        }
      };

      recognition.onend = function () {
        console.log("🛑 STT ended");
        listening = false;
      };

      recognition.start();
    },

    stop() {
      if (recognition && listening) {
        recognition.stop();
        listening = false;
      }
    },

    isListening() {
      return listening;
    }
  };

  // ---------- Expose ----------
  Object.defineProperty(window, "STT", {
    value: STT,
    writable: false,
    configurable: false
  });

})(window);
