/* Bestie — Нийтлэг UI тусламж функцууд */
const AVATAR_POOL = [
  { id: "ohin1", emoji: "👧", src: "ohin1.png" },
  { id: "ohin2", emoji: "👧", src: "ohin2.png" },
  { id: "ohin3", emoji: "👧", src: "ohin3.png" },
  { id: "ohin4", emoji: "👧", src: "ohin4.png" },
  { id: "huvguun", emoji: "🧑", src: "huvguun.png" },
  { id: "huvguun1", emoji: "🧑", src: "huvguun1.png" },
];

function showToast(message, opts = {}) {
  let host = document.getElementById("bestie-toast-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "bestie-toast-host";
    host.className = "fixed left-1/2 -translate-x-1/2 bottom-24 z-[100] flex flex-col gap-2 items-center pointer-events-none w-full px-margin";
    document.body.appendChild(host);
  }
  const toast = document.createElement("div");
  toast.className =
    "pointer-events-auto max-w-sm px-4 py-3 rounded-full bg-surface-container-highest text-on-surface shadow-card text-label-md text-label-md flex items-center gap-2 opacity-0 translate-y-2 transition-all duration-300";
  toast.innerHTML = `<span>${opts.emoji || "💗"}</span><span>${message}</span>`;
  host.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
  });
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, opts.duration || 2200);
}

async function shareLink(url, { title = "Bestie", text = "" } = {}) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (err) {
      return false;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    showToast("Линк хууллаа ✅");
    return true;
  } catch (err) {
    showToast("Линкийг гараар хуулна уу");
    return false;
  }
}

function quizUrl(page, params) {
  const url = new URL(page, window.location.href);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

function formatRelativeTime(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "дөнгөж сая";
  if (min < 60) return `${min} мин өмнө`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} цаг өмнө`;
  const day = Math.floor(hr / 24);
  return `${day} хоног өмнө`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
