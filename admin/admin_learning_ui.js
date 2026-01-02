/* =========================================================
   admin_learning_ui.js
   Role: Learning UI Logic (HTML Modal Based)
   ========================================================= */

(function () {
  "use strict";

  if (!window.KnowledgeBase) return;

  const modal = document.getElementById("learningModal");
  const openBtn = document.getElementById("learnBtn");

  if (openBtn) {
    openBtn.onclick = () => {
      modal.style.display = "flex";
      document.getElementById("learnMsg").textContent = "";
    };
  }

  document.getElementById("learnCancel").onclick = () => {
    modal.style.display = "none";
  };

  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  document.getElementById("learnSave").onclick = async () => {
    const msg = document.getElementById("learnMsg");

    const question = document.getElementById("learnQuestion").value.trim();
    const answer = document.getElementById("learnAnswer").value.trim();
    const tags = document.getElementById("learnTags").value
      .split(",").map(t => t.trim()).filter(Boolean);

    if (!question || !answer) {
      msg.style.color = "red";
      msg.textContent = "प्रश्न और उत्तर आवश्यक हैं।";
      return;
    }

    try {
      await KnowledgeBase.init();
      await KnowledgeBase.saveOne({ question, answer, tags });

      msg.style.color = "lightgreen";
      msg.textContent = "✅ सफलतापूर्वक सेव हुआ";

      document.getElementById("learnQuestion").value = "";
      document.getElementById("learnAnswer").value = "";
      document.getElementById("learnTags").value = "";

    } catch {
      msg.style.color = "red";
      msg.textContent = "❌ सेव में त्रुटि";
    }
  };
})();
