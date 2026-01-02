/* =========================================================
   voice/stt.js
   Role: Speech To Text (LISTENING ENABLED + AUTO RESTART)
   FINAL – Cross-Verified
   ========================================================= */

(function (window) {
  "use strict";

  // ---------- SUPPORT CHECK ----------
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("❌ SpeechRecognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  // ---------- CONFIG ----------
  recognition.lang = "hi-IN";
  recognition.interimResults = false;
  recognition.continuous = false; 
  // ⚠️ Chrome में true unstable है, इसलिए auto-restart logic यूज़ कर रहे हैं

  let listening = false;
  let manualStop = false;

  // ---------- START ----------
  function start() {
    if (listening) return;

    manualStop = false;

    try {
      recognition.start();
      listening = true;
      console.log("🎤 STT STARTED – Listening...");
    } catch (e) {
      console.error("STT start error", e);
    }
  }

  // ---------- STOP (अगर भविष्य में चाहिए) ----------
  function stop() {
    manualStop = true;
    try {
      recognition.stop();
    } catch (e) {}
    listening = false;
  }

  // ---------- RESULT ----------
  recognition.onresult = async function (event) {
    listening = false;

    const transcript =
      event.results[0][0].transcript.trim();

    console.log("👂 Heard:", transcript);

    // 🔊 बोलकर पुष्टि
    if (window.TTS) {
      TTS.speak("आपने पूछा: " + transcript);
    }

    // ---------- ANSWER FROM KNOWLEDGE ----------
    if (!window.KnowledgeBase) {
      TTS && TTS.speak("ज्ञान प्रणाली उपलब्ध नहीं है।");
      return;
    }

    try {
      await KnowledgeBase.init();
      const all = await KnowledgeBase.getAll();

      const found = all.find(k =>
        transcript.includes(k.question) ||
        k.question.includes(transcript)
      );

      if (found) {
        TTS && TTS.speak(found.answer);
      } else {
        TTS && TTS.speak("इस प्रश्न का उत्तर अभी मेरे ज्ञान में नहीं है।");
      }

    } catch (e) {
      console.error(e);
      TTS && TTS.speak("उत्तर खोजने में त्रुटि हुई।");
    }
  };

  // ---------- AUTO RESTART (यही सुनने की शक्ति है) ----------
  recognition.onend = function () {
    listening = false;
    console.log("🎤 STT ended");

    // 👇 जब तक यूज़र ने रोका नहीं, फिर से सुनो
    if (!manualStop) {
      setTimeout(() => {
        try {
          recognition.start();
          listening = true;
          console.log("🔁 STT restarted – Listening again");
        } catch (e) {}
      }, 400);
    }
  };

  // ---------- ERROR ----------
  recognition.onerror = function (e) {
    listening = false;
    console.error("STT error:", e);

    if (window.TTS) {
      TTS.speak("माइक से सुनने में समस्या आ रही है।");
    }
  };

  // ---------- EXPOSE ----------
  window.STT = {
    start,
    stop
  };

})(window);
