(function () {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("SpeechRecognition supported नहीं है");
    return;
  }

  const r = new SR();
  r.lang = "hi-IN";
  r.continuous = false;
  r.interimResults = false;

  r.onstart = () => alert("🎤 सुनना शुरू");
  r.onresult = e => alert("सुना: " + e.results[0][0].transcript);
  r.onerror = e => alert("STT error: " + e.error);
  r.onend = () => alert("🛑 सुनना बंद");

  window.STT = {
    start() {
      r.start();
    }
  };
})();
