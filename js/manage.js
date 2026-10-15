/* Bestie — Эзэмшигчийн удирдлагын хуудас */
let mQuiz = null;
let mCode = null;
let mToken = null;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

async function init() {
  const params = new URLSearchParams(location.search);
  mCode = params.get("code");
  mToken = params.get("token");
  if (!mCode || !mToken) {
    showScreen("screen-error");
    return;
  }
  mQuiz = await DB.getQuiz(mCode);
  if (!mQuiz || mQuiz.ownerToken !== mToken) {
    showScreen("screen-error");
    return;
  }
  render();
  showScreen("screen-manage");
}

function render() {
  document.getElementById("m-emoji").textContent = mQuiz.emoji || "💗";
  document.getElementById("m-title").textContent = mQuiz.title;
  document.getElementById("m-meta").textContent = `${mQuiz.questions.length} асуулт · ${(mQuiz.attempts || []).length} хариулсан`;
  const shareUrl = quizUrl("play.html", { code: mCode });
  document.getElementById("m-share-url").textContent = shareUrl;
  window._shareUrl = shareUrl;

  document.getElementById("toggle-open").classList.toggle("on", !!mQuiz.isOpen);
  document.getElementById("toggle-open").classList.toggle("off", !mQuiz.isOpen);
  document.getElementById("toggle-ranking").classList.toggle("on", mQuiz.showRanking !== false);
  document.getElementById("toggle-ranking").classList.toggle("off", mQuiz.showRanking === false);
  document.getElementById("open-icon").textContent = mQuiz.isOpen ? "🔓" : "🔒";
  document.getElementById("ranking-icon").textContent = mQuiz.showRanking !== false ? "👁️" : "🙈";
  document.getElementById("pill-open").textContent = mQuiz.isOpen ? "🟢 Нээлттэй" : "🔒 Хаалттай";
  document.getElementById("pill-open").classList.toggle("text-primary-fixed", !!mQuiz.isOpen);
  document.getElementById("pill-open").classList.toggle("text-on-surface-variant", !mQuiz.isOpen);
  document.getElementById("pill-ranking").textContent = mQuiz.showRanking !== false ? "👁️ Ranking харагдана" : "🙈 Ranking нуугдсан";

  const attempts = mQuiz.attempts || [];
  document.getElementById("stat-attempts").textContent = attempts.length;
  const avg = attempts.length
    ? Math.round((attempts.reduce((sum, a) => sum + (a.total ? a.score / a.total : 0), 0) / attempts.length) * 100)
    : 0;
  document.getElementById("stat-avg").textContent = `${avg}%`;
  const topPct = attempts.length ? Math.max(...attempts.map((a) => (a.total ? a.score / a.total : 0))) : null;
  document.getElementById("stat-top").textContent = topPct === null ? "—" : `${Math.round(topPct * 100)}%`;

  const sorted = [...attempts].sort((a, b) => b.score - a.score || a.durationMs - b.durationMs);
  const medals = ["👑", "🥈", "🥉"];
  const host = document.getElementById("ranking-list");
  const empty = document.getElementById("ranking-empty");
  if (!sorted.length) {
    empty.classList.remove("hidden");
    host.innerHTML = "";
    host.appendChild(empty);
  } else {
    empty.classList.add("hidden");
    host.innerHTML = sorted
      .map(
        (a, i) => `<div class="p-space-md rounded ${i === 0 ? "rank-1" : "bg-surface-container"} flex items-center gap-3">
        <span class="w-8 text-center font-display text-label-lg shrink-0">${medals[i] || i + 1}</span>
        <img src="${a.avatar || "ohin1.png"}" alt="" class="w-10 h-10 rounded-full object-cover object-top shrink-0" />
        <div class="flex flex-col flex-1 min-w-0">
          <span class="font-label-lg text-label-lg text-on-surface truncate">${escapeHtml(a.nickname)}</span>
          <span class="font-body text-body-sm text-on-surface-variant">${formatRelativeTime(a.createdAt)}</span>
        </div>
        <span class="font-label-lg text-label-lg text-primary-fixed shrink-0">${a.score}/${a.total}</span>
      </div>`
      )
      .join("");
  }
}

function copyShare() {
  navigator.clipboard.writeText(window._shareUrl).then(() => showToast("Линк хууллаа ✅"));
}

function shareQuiz() {
  shareLink(window._shareUrl, { title: "Bestie 💗", text: `${mQuiz.title} — хариулаад үз!` });
}

async function toggleOpen() {
  try {
    mQuiz = await DB.closeQuiz(mCode, mToken, !mQuiz.isOpen);
    render();
    showToast(mQuiz.isOpen ? "Линк нээлттэй боллоо" : "Линк хаагдлаа");
  } catch (err) {
    showToast("Алдаа гарлаа, дахин оролдоно уу");
  }
}

async function toggleRankingVis() {
  try {
    mQuiz = await DB.toggleRanking(mCode, mToken, mQuiz.showRanking === false);
    render();
  } catch (err) {
    showToast("Алдаа гарлаа, дахин оролдоно уу");
  }
}

async function confirmDelete() {
  if (!confirm("Энэ тестийг бүр мөсөн устгах уу? Буцаах боломжгүй.")) return;
  try {
    await DB.deleteQuiz(mCode, mToken);
    showToast("Тест устгагдлаа");
    setTimeout(() => (location.href = "index.html"), 800);
  } catch (err) {
    showToast("Алдаа гарлаа, дахин оролдоно уу");
  }
}

document.addEventListener("DOMContentLoaded", init);
