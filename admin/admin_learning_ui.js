/* =========================================================
   admin_learning_ui.js
   Role: Admin Learning UI (Single Q&A)
   GUARANTEED WORKING VERSION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  if (!window.KnowledgeBase) {
    alert("KnowledgeBase लोड नहीं हुआ");
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
    z-index:99999;
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

      <textarea id="learnQuestion"
        placeholder="प्रश्न लिखें"
        style="width:100%;min-height:70px;margin-bottom:8px;
        padding:10px;border-radius:10px;background:#121212;color:#eee;border:1px solid #333"></textarea>

      <textarea id="learnAnswer"
        placeholder="उत्तर लिखें"
        style="width:100%;min-height:90px;margin-bottom:8px;
        padding:10px;border-radius:10px;background:#121212;color:#eee;border:1px solid #333"></textarea>

      <input id="learnTags"
        placeholder="टैग (कॉमा से अलग करें)"
        style="width:100%;padding:10px;border-radius:10px;
        background:#121212;color:#eee;border:1px solid #333">

      <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end;">
        <button id="learnCancel"
          style="padding:10px 14px;border-radius:12px;
          background:#2a2a2a;color:#eee;border:1px solid #333">
          रद्द
        </button>
        <button id="learnSave"
          style="padding:10px 14px;border-radius:12px;
          background:linear-gradient(180deg,#ffd6d6,#ffb3b3);
          color:#1b1b1b;border:none">
          सेव करें
        </button>
      </div>

      <div id="learnMsg" style="margin-top:8px;font-size:12px;"></div>
    </div>
  `;

  document.body.appendChild(modal);

  // ---------- OPEN BUTTON (GUARANTEED) ----------
  const openBtn = document.getElementById("learnBtn");
  if (!openBtn) {
    alert("learnBtn नहीं मिला (HTML जाँचें)");
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
      .split(",").map(t => t.trim()).filter(Boolean);

    if (!question || !answer) {
      msg.style.color = "#ff9f9f";
      msg.textContent = "प्रश्न और उत्तर दोनों आवश्यक हैं।";
      return;
    }

    try {
      await KnowledgeBase.init();
      await KnowledgeBase.saveOne({ question, answer, tags });

      msg.style.color = "#9fdf9f";
      msg.textContent = "✔️ प्रश्न–उत्तर सुरक्षित हो गया";

      document.getElementById("learnQuestion").value = "";
      document.getElementById("learnAnswer").value = "";
      document.getElementById("learnTags").value = "";

    } catch (e) {
      msg.style.color = "#ff9f9f";
      msg.textContent = "❌ सेव में त्रुटि";
    }
  };

});
