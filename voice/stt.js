/* =========================================================
   voice/stt.js
   Role: Speech To Text (FINAL, Stable, Hindi)
   Works on: Android Chrome, Samsung Internet
   ========================================================= */

(function (window) {
  "use strict";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("SpeechRecognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "hi-IN";
  recognition.continuous = false;        // 🔴 बहुत महत्वपूर्ण
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let listening = false;

  // ---------- START ----------
  function start() {
    if (listening) return;

    try {
      recognition.start();
      listening = true;
      console.log("STT started");
    } catch (e) {
      console.error("STT start error:", e);
    }
  }

  // ---------- RESULT ----------
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.trim();
    console.log("Heard:", transcript);

    listening = false;

    // बोलकर confirm
    if (window.TTS) {
      TTS.speak("आपने कहा: " + transcript);
    }

    // 👉 यहाँ आगे Knowledge / Answer logic जुड़ सकता है
  };

  // ---------- END ----------
  recognition.onend = function () {
    listening = false;
    console.log("STT ended");
  };

  // ---------- ERROR ----------
  recognition.onerror = function (event) {
    listening = false;
    console.error("STT error:", event.error);

    if (window.TTS) {
      TTS.speak("मैं स्पष्ट नहीं सुन पाई, कृपया दोबारा बोलिए।");
    }
  };

  // ---------- EXPOSE ----------
  window.STT = {
    start
  };

})(window);
