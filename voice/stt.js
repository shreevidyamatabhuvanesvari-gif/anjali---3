/* =========================================================
   voice/stt.js
   Role: Speech To Text (FINAL • SAFE • ISOLATED)
   ========================================================= */

(function (window) {
  "use strict";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("STT not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "hi-IN";
  recognition.interimResults = false;
  recognition.continuous = false;

  let active = false;

  function start() {
    if (active) return;
    try {
      recognition.start();
      active = true;
      console.log("🎤 Listening started");
    } catch (e) {
      console.error(e);
    }
  }

  recognition.onresult = function (event) {
    active = false;
    const text = event.results[0][0].transcript.trim();
    console.log("👂 Heard:", text);

    // अभी सिर्फ सुनने की पुष्टि
    if (window.TTS) {
      TTS.speak("आपने कहा: " + text);
    }
  };

  recognition.onend = function () {
    active = false;
    console.log("🎤 Listening ended");
  };

  recognition.onerror = function () {
    active = false;
  };

  window.STT = { start };

})(window);
