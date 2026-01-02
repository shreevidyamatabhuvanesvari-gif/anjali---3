/* =========================================================
   voice/stt.js
   Role: Speech To Text (FINAL, RELIABLE)
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

  // ---------- CONFIG ----------
  recognition.lang = "hi-IN";
  recognition.continuous = false;     // user बोले → रुके → result
  recognition.interimResults = false; // final result only
  recognition.maxAlternatives = 1;

  let listening = false;

  // ---------- START ----------
  function start() {
    if (listening) return;

    try {
      recognition.start();
      listening = true;
      console.log("🎤 STT started");
    } catch (e) {
      console.error("STT start error", e);
    }
  }

  // ---------- STOP ----------
  function stop() {
    if (!listening) return;
    recognition.stop();
    listening = false;
  }

  // ---------- RESULT ----------
  recognition.onresult = async function (event) {
    listening = false;

    const transcript =
      event.results[0][0].transcript.trim();

    console.log("🗣️ User said:", transcript);

    // बोलकर पुष्टि
    if (window.TTS) {
      TTS.speak("आपने पूछा: " + transcript);
    }

    // --------- ANSWER FROM KNOWLEDGE ----------
    try {
      if (!window.KnowledgeBase) {
        if (window.TTS) {
          TTS.speak("ज्ञान प्रणाली उपलब्ध नहीं है।");
        }
        return;
      }

      const data = await KnowledgeBase.getAll();

      if (!data || !data.length) {
        if (window.TTS) {
          TTS.speak("मेरे पास अभी कोई सिखाया गया ज्ञान नहीं है।");
        }
        return;
      }

      // सरल matching (सबसे भरोसेमंद)
      const found = data.find(item =>
        transcript.includes(item.question) ||
        item.question.includes(transcript)
      );

      if (found) {
        if (window.TTS) {
          TTS.speak(found.answer);
        }
      } else {
        if (window.TTS) {
          TTS.speak("इस प्रश्न का उत्तर अभी मेरे ज्ञान में नहीं है।");
        }
      }

    } catch (err) {
      console.error(err);
      if (window.TTS) {
        TTS.speak("उत्तर खोजने में त्रुटि हुई।");
      }
    }
  };

  // ---------- ERROR ----------
  recognition.onerror = function (event) {
    listening = false;
    console.error("STT error:", event.error);

    if (window.TTS) {
      TTS.speak("मैं ठीक से सुन नहीं पाई। कृपया फिर बोलिए।");
    }
  };

  recognition.onend = function () {
    listening = false;
    console.log("🎤 STT ended");
  };

  // ---------- EXPOSE ----------
  window.STT = {
    start,
    stop
  };

})(window);
