/*
 * Bestie — Мэдэгдэл (найз чиний тестэд хариулахад мэдэгддэг)
 * -----------------------------------------------------------
 * Нүүр хуудас нээлттэй байх хооронд таны үүсгэсэн тестүүдэд шинэ
 * хариулт орж ирсэн эсэхийг тогтмол (15 секунд тутам) шалгаж, header
 * дээрх хонх дээр тоо харуулна. Хэрэв Firebase идэвхтэй бол энэ нь
 * бодит байдалд найз чинь өөр төхөөрөмжөөс хариулахад ч мэдэгдэнэ.
 */
const NOTIF_SEEN_KEY = "bestie_notif_seen_v1"; // { [code]: сүүлд харсан хариултын тоо }
const NOTIF_POLL_MS = 15000;

let _notifPollTimer = null;
let _lastNotifList = [];

function getSeenCounts() {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_SEEN_KEY) || "{}");
  } catch (err) {
    return {};
  }
}

function setSeenCount(code, count) {
  const m = getSeenCounts();
  m[code] = count;
  try {
    localStorage.setItem(NOTIF_SEEN_KEY, JSON.stringify(m));
  } catch (err) {
    /* noop */
  }
}

async function checkNotifications({ announceNew = false } = {}) {
  const mine = typeof DB !== "undefined" ? DB.myQuizzes() : [];
  if (!mine.length) {
    renderNotifBadge(0);
    return;
  }
  const seen = getSeenCounts();
  const prevTotal = _lastNotifList.reduce((sum, n) => sum + n.newCount, 0);
  const unseen = [];

  for (const m of mine) {
    let quiz = null;
    try {
      quiz = await DB.getQuiz(m.code);
    } catch (err) {
      continue;
    }
    if (!quiz) continue;
    const total = (quiz.attempts || []).length;
    const seenCount = seen[m.code] || 0;
    if (total > seenCount) {
      unseen.push({ code: m.code, token: m.token, title: quiz.title, emoji: quiz.emoji, newCount: total - seenCount, total });
    }
  }

  _lastNotifList = unseen;
  const newTotal = unseen.reduce((sum, n) => sum + n.newCount, 0);
  renderNotifBadge(newTotal);

  if (announceNew && newTotal > prevTotal) {
    const top = unseen[0];
    if (top) showToast(`🎉 "${top.title}"-д шинэ хариулт ирлээ!`, { emoji: "🔔" });
  }
}

function renderNotifBadge(count) {
  const host = document.getElementById("notif-badge");
  if (!host) return;
  host.innerHTML = `<button type="button" id="notif-badge-btn" class="relative w-10 h-10 rounded-full bg-surface-container flex items-center justify-center active:scale-95 transition-transform" aria-label="Мэдэгдэл">
    <span class="material-symbols-outlined text-[20px] text-on-surface">notifications</span>
    ${count > 0 ? `<span class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-tertiary-fixed-dim text-on-tertiary-fixed text-[10px] font-extrabold flex items-center justify-center">${count > 9 ? "9+" : count}</span>` : ""}
  </button>`;
  const btn = document.getElementById("notif-badge-btn");
  if (btn) btn.addEventListener("click", openNotifSheet);
}

function ensureNotifSheet() {
  if (document.getElementById("notif-sheet")) return;
  const wrap = document.createElement("div");
  wrap.id = "notif-sheet";
  wrap.className = "fixed inset-0 z-[75] hidden";
  wrap.innerHTML = `
    <div class="absolute inset-0 bg-black/60" onclick="closeNotifSheet()"></div>
    <div class="absolute bottom-0 inset-x-0 bg-surface-container-low rounded-t-xl p-space-lg flex flex-col gap-3 max-h-[80vh] overflow-y-auto pb-safe">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-headline-md text-on-surface">Мэдэгдэл 🔔</h2>
        <button onclick="closeNotifSheet()" class="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">close</span></button>
      </div>
      <div class="flex flex-col gap-2" id="notif-list"></div>
    </div>`;
  document.body.appendChild(wrap);
}

function openNotifSheet() {
  ensureNotifSheet();
  const list = document.getElementById("notif-list");
  if (!_lastNotifList.length) {
    list.innerHTML = `<p class="font-body text-body-md text-on-surface-variant text-center py-6">Одоогоор шинэ хариулт алга 🙈</p>`;
  } else {
    list.innerHTML = _lastNotifList
      .map(
        (n) => `<a href="manage.html?code=${n.code}&token=${n.token}" class="flex items-center gap-3 p-space-md rounded bg-surface-container shadow-sm active:scale-[0.99] transition-transform">
        <div class="w-11 h-11 rounded-full bg-primary-fixed/15 flex items-center justify-center text-xl shrink-0">${n.emoji || "💗"}</div>
        <div class="flex flex-col min-w-0 flex-1">
          <span class="font-label-lg text-label-lg text-on-surface truncate">${escapeHtml(n.title)}</span>
          <span class="font-body text-body-sm text-primary-fixed font-bold">${n.newCount} хүн шинээр хариуллаа 🎉</span>
        </div>
        <span class="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">chevron_right</span>
      </a>`
      )
      .join("");
  }
  document.getElementById("notif-sheet").classList.remove("hidden");

  // Хонхыг нээж үзсэн тул бүгдийг "харсан" гэж тэмдэглэнэ
  _lastNotifList.forEach((n) => setSeenCount(n.code, n.total));
  _lastNotifList = [];
  renderNotifBadge(0);
}

function closeNotifSheet() {
  const sheet = document.getElementById("notif-sheet");
  if (sheet) sheet.classList.add("hidden");
}

function startNotifPolling() {
  renderNotifBadge(0);
  checkNotifications({ announceNew: false });
  if (_notifPollTimer) clearInterval(_notifPollTimer);
  _notifPollTimer = setInterval(() => checkNotifications({ announceNew: true }), NOTIF_POLL_MS);
}
