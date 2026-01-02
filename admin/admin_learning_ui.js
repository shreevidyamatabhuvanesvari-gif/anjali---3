/* =========================================================
   admin_learning_ui.js
   Role: Admin Learning UI (Single Q&A)
   Stage: 2 (Stable, Offline-Safe)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  alert("admin_learning_ui.js READY"); // 🔍 आप चाहें तो बाद में हटा सकते हैं

  if (!window.KnowledgeBase) {
    alert("KnowledgeBase NOT loaded");
    return;
  }

  // ---------- CREATE MODAL ----------
  const modal = document.createElement("div");
  modal.id = "learningModal";
  modal.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.6);
    display:none;
    align-items:center;
    justify-content:center;
    z-index:10000;
  `;

  modal.innerHTML = `
    <div style="
      width:94%;
      max-width:520px;
      background:#1e1e1e;
      color:#eee;
      border-radius:18px;
      padding:16px;
      box-shadow:0 20px 44px rgba(0,0,0,.65)
    ">
      <h3 style="margin:0 0 10px;color:#ffd6d6;">
        🧠 अंजली को सिखाएँ
      </h3>

      <textarea id="learnQuestion" placeholder="प्रश्न"
        style="width:100%;min-height:60px;margin-bottom:8px;"></textarea>

      <textarea id="learnAnswer" placeholder="उत्तर"
        style="width:100%;min-height:80px;margin-bottom:8px;"></textarea>

      <input id="learnTags" placeholder="टैग (कॉमा से अलग करें)"
        style="width:100%;margin-bottom:10px;">

      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button id="learnCancel">रद्द</button>
        <button id="learnSave">सेव करें</button>
      </div>

      <div id="learnMsg" style="margin-top:8px;font-size:12px;"></div>
    </div>
  `;

  document.body.appendChild(modal);

  // ---------- OPEN BUTTON ----------
  const openBtn = document.getElementById("learnBtn");

  if (!openBtn) {
    alert("❌ learnBtn नहीं मिला (ID mismatch)");
    return;
  }

  openBtn.addEventListener("click", function () {
    modal.style.display = "flex";
    document.getElementById("learnMsg").textContent = "";
  });

  // ---------- CLOSE ----------
  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.style.display = "none";
  });

  document.getElementById("learnCancel").onclick = function () {
    modal.style.display = "none";
  };

  // ---------- SAVE ----------
  document.getElementById("learnSave").onclick = async function () {
    const msg = document.getElementById("learnMsg");

    const question = document.getElementById("learnQuestion").value.trim();
    const answer = document.getElementById("learnAnswer").value.trim();
    const tags = document.getElementById("learnTags").value
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    if (!question || !answer) {
      msg.style.color = "red";
      msg.textContent = "प्रश्न और उत्तर दोनों आवश्यक हैं।";
      return;
    }

    try {
      await KnowledgeBase.init();
      await KnowledgeBase.saveOne({ question, answer, tags });

      msg.style.color = "lightgreen";
      msg.textContent = "✅ प्रश्न–उत्तर सेव हो गया";

      document.getElementById("learnQuestion").value = "";
      document.getElementById("learnAnswer").value = "";
      document.getElementById("learnTags").value = "";

    } catch (e) {
      msg.style.color = "red";
      msg.textContent = "❌ सेव करने में त्रुटि";
      console.error(e);
    }
  };
});
