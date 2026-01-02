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

  // 🔍 अगर AnswerEngine उपलब्ध नहीं है
  if (!window.AnswerEngine) {
    if (window.TTS) {
      TTS.speak("उत्तर प्रणाली उपलब्ध नहीं है।");
    }
    return;
  }

  try {
    // 🧠 ज्ञान से उत्तर निकालो
    const reply = await AnswerEngine.answer(transcript);

    // 🔊 केवल उत्तर बोलो (echo नहीं)
    if (window.TTS) {
      TTS.speak(reply);
    }

  } catch (e) {
    console.error(e);
    if (window.TTS) {
      TTS.speak("उत्तर देने में त्रुटि हुई।");
    }
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
