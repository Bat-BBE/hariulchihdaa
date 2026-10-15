/*
 * Bestie — "Story" зураг (9:16, Instagram/Snapchat Story-д тохирсон)
 * Эзэмшигч ranking-ээ үзэж байгаад, хэн хамгийн сайн мэддэгийг зурган
 * хуудас болгож татаж/хуваалцаж болно. html2canvas ашиглаж DOM-ийг
 * шууд зурган болгодог тул backend шаардахгүй.
 */
const STORY_MEDALS = ["👑", "🥈", "🥉"];

function buildStoryNode(quiz) {
  const sorted = [...(quiz.attempts || [])].sort((a, b) => b.score - a.score || a.durationMs - b.durationMs).slice(0, 5);

  const rowsHtml = sorted.length
    ? sorted
        .map(
          (a, i) => `<div style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.07);border-radius:18px;padding:13px 18px;${i === 0 ? "box-shadow:0 0 0 2px rgba(216,238,72,.55);" : ""}">
          <span style="font-size:20px;width:26px;text-align:center;flex-shrink:0;">${STORY_MEDALS[i] || i + 1}</span>
          <img src="${a.avatar || "ohin1.png"}" style="width:46px;height:46px;border-radius:50%;object-fit:cover;flex-shrink:0;" />
          <span style="flex:1;font-size:18px;font-weight:700;color:#F1F0FB;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(a.nickname)}</span>
          <span style="font-size:18px;font-weight:800;color:#D8EE48;flex-shrink:0;">${a.score}/${a.total}</span>
        </div>`
        )
        .join("")
    : `<div style="text-align:center;color:#B3B2CC;font-size:16px;padding:20px;">Одоохондоо хариулсан найз алга 🙈</div>`;

  const wrap = document.createElement("div");
  wrap.id = "story-capture-node";
  wrap.style.cssText =
    "position:fixed;top:0;left:-9999px;width:405px;height:720px;overflow:hidden;" +
    "font-family:'Nunito',sans-serif;color:#F1F0FB;box-sizing:border-box;" +
    "background:radial-gradient(circle at 18% 12%,rgba(91,42,158,.55),transparent 42%)," +
    "radial-gradient(circle at 85% 82%,rgba(216,238,72,.28),transparent 45%),#0E0F1F;" +
    "display:flex;flex-direction:column;padding:38px 30px;";

  wrap.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-size:26px;">💗</span>
      <span style="font-size:21px;font-weight:800;">Bestie</span>
    </div>
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;text-align:center;">
      <div style="font-size:54px;line-height:1;">${quiz.emoji || "💗"}</div>
      <div style="font-size:25px;font-weight:800;line-height:1.3;padding:0 8px;">${escapeHtml(quiz.title)}</div>
      <div style="font-size:15px;color:#DBB8FF;font-weight:700;">Хэн намайг хамгийн сайн мэддэг вэ? 👑</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:11px;">${rowsHtml}</div>
    <div style="text-align:center;margin-top:22px;font-size:13px;color:#8D8CA6;">Чи ч бас өөрийн тестээ үүсгээрэй 💗</div>
  `;
  document.body.appendChild(wrap);
  return wrap;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function shareOrDownloadStory(blob, quizTitle) {
  try {
    const file = new File([blob], "bestie-story.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: "Bestie 💗", text: `${quizTitle} — хэн хамгийн сайн мэддэг вэ?` });
      return;
    }
  } catch (err) {
    /* fall through to download */
  }
  downloadBlob(blob, "bestie-story.png");
  showToast("Зураг татагдлаа — Story-д хуулж оруулаарай 💗");
}

async function generateStoryCard(quiz) {
  if (typeof html2canvas === "undefined") {
    showToast("Зураг үүсгэх сан ачааллагдсангүй, дахин оролдоно уу");
    return null;
  }
  const node = buildStoryNode(quiz);
  try {
    const canvas = await html2canvas(node, { backgroundColor: null, scale: 2, useCORS: true });
    return canvas;
  } finally {
    node.remove();
  }
}

/* ---------- Preview overlay (reusable bottom sheet) ---------- */
function ensureStorySheet() {
  if (document.getElementById("story-sheet")) return;
  const wrap = document.createElement("div");
  wrap.id = "story-sheet";
  wrap.className = "fixed inset-0 z-[80] hidden";
  wrap.innerHTML = `
    <div class="absolute inset-0 bg-black/75" onclick="closeStorySheet()"></div>
    <div class="absolute inset-x-0 bottom-0 bg-surface-container-low rounded-t-xl p-space-lg flex flex-col gap-3 max-h-[92vh] overflow-y-auto pb-safe items-center">
      <div class="w-full flex items-center justify-between">
        <h2 class="font-display text-headline-md text-on-surface">Story зураг 🎴</h2>
        <button onclick="closeStorySheet()" class="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">close</span></button>
      </div>
      <img id="story-preview-img" src="" alt="" class="w-full max-w-[280px] rounded-lg shadow-card aspect-[9/16] object-cover bg-surface-container" />
      <div class="w-full flex flex-col gap-2.5 pt-1">
        <button onclick="shareStoryNow()" class="w-full h-13 rounded-full bg-primary-container text-on-primary-fixed font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-glow">
          <span class="material-symbols-outlined text-[18px]">ios_share</span><span>Хуваалцах</span>
        </button>
        <button onclick="downloadStoryNow()" class="w-full h-13 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-[18px]">download</span><span>Татаж авах</span>
        </button>
      </div>
    </div>`;
  document.body.appendChild(wrap);
}

let _storyBlob = null;
let _storyTitle = "";

async function openStorySheetFor(quiz) {
  ensureStorySheet();
  const sheet = document.getElementById("story-sheet");
  sheet.classList.remove("hidden");
  const img = document.getElementById("story-preview-img");
  img.src = "";
  showToast("Зураг бэлдэж байна... 🎨");

  const canvas = await generateStoryCard(quiz);
  if (!canvas) {
    closeStorySheet();
    return;
  }
  canvas.toBlob((blob) => {
    _storyBlob = blob;
    _storyTitle = quiz.title;
    img.src = URL.createObjectURL(blob);
  }, "image/png");
}

function closeStorySheet() {
  const sheet = document.getElementById("story-sheet");
  if (sheet) sheet.classList.add("hidden");
}

function shareStoryNow() {
  if (_storyBlob) shareOrDownloadStory(_storyBlob, _storyTitle);
}

function downloadStoryNow() {
  if (_storyBlob) downloadBlob(_storyBlob, "bestie-story.png");
}
