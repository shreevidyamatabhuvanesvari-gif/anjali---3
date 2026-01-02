/* =========================================================
   stt.js
   Role: Speech To Text (Browser Native, Simple & Stable)
   Uses: Web Speech API
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

  // 🔑 BASIC SETTINGS (IMPORTANT)
  recognition.lang = "hi-IN";
  recognition.continuous = false;     // एक वाक्य, फिर बंद
  recognition.interimResults = false; // केवल final result

  const STT = {

    start() {
      try {
        recognition.start();
        console.log("🎤 STT started");
      } catch (e) {
        console.warn("STT already running");
      }
    },

    stop() {
      recognition.stop();
      console.log("🛑 STT stopped");
    }
  };

  // ---------- RESULT ----------
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.trim();
    console.log("🎧 सुना गया:", transcript);

    // 🔊 बस इतना ही — बोल कर दिखा दो
    if (window.TTS) {
      TTS.speak("आपने कहा: " + transcript);
    }
  };

  // ---------- ERROR ----------
  recognition.onerror = function (event) {
    console.error("STT error:", event.error);

    if (window.TTS) {
      TTS.speak("माइक्रोफोन में समस्या आ रही है।");
    }
  };

  // ---------- END ----------
  recognition.onend = function () {
    console.log("🎤 STT ended");
  };

  // ---------- EXPOSE ----------
  window.STT = STT;

})(window);
