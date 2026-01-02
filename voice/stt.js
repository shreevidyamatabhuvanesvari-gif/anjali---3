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

  recognition.onresult = async function (event) {
  const transcript = event.results[0][0].transcript.trim();
  console.log("👂 Heard:", transcript);

  // 🔊 पुष्टि कि अंजली ने सुना
  if (window.TTS) {
    TTS.speak("आपने पूछा: " + transcript);
  }

  // 🧠 AnswerEngine से उत्तर निकालना
  if (window.AnswerEngine) {
    const reply = await AnswerEngine.answer(transcript);

    if (window.TTS) {
      TTS.speak(reply);
    }
  } else if (window.TTS) {
    TTS.speak("उत्तर प्रणाली उपलब्ध नहीं है।");
  }
};
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
