/* =========================================================
   stt.js
   Role: Speech To Text → Answer From KnowledgeBase → Speak
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
  recognition.interimResults = false;
  recognition.continuous = false;

  // ---------- START ----------
  function start() {
    try {
      recognition.start();
    } catch (e) {
      console.warn("STT already started");
    }
  }

  // ---------- RESULT ----------
  recognition.onresult = async function (event) {
    const transcript =
      event.results[0][0].transcript.trim();

    console.log("🎤 सुना गया:", transcript);

    // बोलकर पुष्टि
    if (window.TTS) {
      TTS.speak("आपने पूछा: " + transcript);
    }

    // ---- Knowledge lookup ----
    if (!window.KnowledgeBase) {
      if (window.TTS) {
        TTS.speak("मेरा ज्ञान तंत्र अभी उपलब्ध नहीं है।");
      }
      return;
    }

    try {
      await KnowledgeBase.init();
      const knowledge = await KnowledgeBase.getAll();

      if (!knowledge || knowledge.length === 0) {
        TTS.speak("मेरे पास अभी कोई सीखा हुआ ज्ञान नहीं है।");
        return;
      }

      // 🔍 Soft matching (Hindi friendly)
      const found = knowledge.find(k => {
        const q = k.question.toLowerCase();
        const t = transcript.toLowerCase();
        return q.includes(t) || t.includes(q);
      });

      if (found) {
        TTS.speak(found.answer);
      } else {
        TTS.speak("इस प्रश्न का उत्तर अभी मेरे ज्ञान में नहीं है।");
      }

    } catch (e) {
      console.error(e);
      if (window.TTS) {
        TTS.speak("उत्तर खोजने में समस्या आई है।");
      }
    }
  };

  // ---------- ERROR ----------
  recognition.onerror = function (event) {
    console.error("STT Error:", event.error);
    if (window.TTS) {
      TTS.speak("मैं आपको ठीक से सुन नहीं पाई।");
    }
  };

  // ---------- EXPOSE ----------
  window.STT = {
    start
  };

})(window);
