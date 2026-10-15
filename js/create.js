/* Bestie — Тест үүсгэх логик */
const EMOJI_CHOICES = ["💗", "✨", "🏆", "🎀", "🔥", "🌈", "🎮", "🍕", "🎵", "🌙", "🤫", "👑"];

let selectedEmoji = EMOJI_CHOICES[0];
let selected = []; // chosen questions, each with correctOptionId
let activeCat = "all";
let currentStep = 1;

function init() {
  const params = new URLSearchParams(location.search);
  const template = params.get("template");

  renderEmojiPicker();
  renderCatChips();
  renderQuestionList();
  renderCustomOptionInputs();

  if (template) {
    const tpl = TEMPLATE_QUIZZES.find((t) => t.id === template);
    if (tpl) {
      const picked = getQuestionsByIds(tpl.questionIds);
      picked.forEach((q) => selected.push({ ...q, correctOptionId: null, custom: false }));
      selectedEmoji = tpl.emoji;
      const titleInput = document.getElementById("quiz-title");
      if (titleInput && !titleInput.value) titleInput.value = tpl.title;
      renderEmojiPicker();
      updateSelectedCount();
      showToast(`"${tpl.title}" загвар бэлдэгдлээ ✨`);
    }
    renderCatChips();
    renderQuestionList();
  }
}

function renderEmojiPicker() {
  const host = document.getElementById("emoji-picker");
  host.innerHTML = EMOJI_CHOICES.map(
    (e) => `<button type="button" data-emoji="${e}" class="emoji-btn w-12 h-12 rounded bg-surface-container text-xl flex items-center justify-center transition-all ${e === selectedEmoji ? "ring-2 ring-primary-fixed bg-surface-container-high" : ""}">${e}</button>`
  ).join("");
  host.querySelectorAll(".emoji-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedEmoji = btn.dataset.emoji;
      renderEmojiPicker();
    });
  });
}

function renderCatChips() {
  const host = document.getElementById("cat-chips");
  const all = [{ id: "all", label: "Бүгд", emoji: "🗂️" }, ...QUESTION_CATEGORIES];
  host.innerHTML = all
    .map(
      (c) =>
        `<button type="button" data-cat="${c.id}" class="chip ${c.id === activeCat ? "active" : ""} shrink-0 flex items-center gap-1 px-3.5 py-2 rounded-full bg-surface-container-high text-on-surface text-label-sm text-label-sm font-bold whitespace-nowrap">${c.emoji} ${c.label}</button>`
    )
    .join("");
  host.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCat = btn.dataset.cat;
      renderCatChips();
      renderQuestionList();
    });
  });
}

function isSelected(id) {
  return selected.some((q) => q.id === id);
}

function renderQuestionList() {
  const host = document.getElementById("question-list");
  const list = activeCat === "all" ? QUESTION_BANK : getQuestionsByCategory(activeCat);
  const customOnes = selected.filter((q) => q.custom);

  const bankHtml = list
    .map((q) => {
      const sel = isSelected(q.id);
      return `<button type="button" data-id="${q.id}" class="qcard ${sel ? "selected" : ""} text-left w-full p-space-md rounded bg-surface-container flex items-center gap-3 transition-all active:scale-[0.99]">
        <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-lg shrink-0">${q.emoji}</div>
        <span class="font-body text-body-md text-on-surface flex-1 min-w-0">${escapeHtml(q.text)}</span>
        <span class="material-symbols-outlined text-[20px] ${sel ? "text-primary-fixed" : "text-on-surface-variant"}">${sel ? "check_circle" : "radio_button_unchecked"}</span>
      </button>`;
    })
    .join("");

  const customHtml = customOnes.length
    ? `<div class="flex items-center gap-1.5 pt-1"><span class="font-label-sm text-label-sm text-secondary-fixed-dim">✍️ Миний асуултууд</span></div>` +
      customOnes
        .map(
          (q) => `<div class="w-full p-space-md rounded bg-surface-container-high flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-lg shrink-0">${q.emoji}</div>
          <span class="font-body text-body-md text-on-surface flex-1 min-w-0">${escapeHtml(q.text)}</span>
          <button type="button" data-remove="${q.id}" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-error shrink-0"><span class="material-symbols-outlined text-[16px]">delete</span></button>
        </div>`
        )
        .join("")
    : "";

  host.innerHTML = customHtml + bankHtml;

  host.querySelectorAll("[data-id]").forEach((card) => {
    card.addEventListener("click", () => {
      const q = QUESTION_BANK.find((x) => x.id === card.dataset.id);
      toggleSelect(q);
    });
  });
  host.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selected = selected.filter((q) => q.id !== btn.dataset.remove);
      renderQuestionList();
      updateSelectedCount();
    });
  });
}

function toggleSelect(q) {
  if (isSelected(q.id)) {
    selected = selected.filter((x) => x.id !== q.id);
  } else {
    if (selected.length >= 20) {
      showToast("Дээд тал нь 20 асуулт сонгоно уу 🙏");
      return;
    }
    selected.push({ ...q, correctOptionId: null, custom: false });
  }
  renderQuestionList();
  updateSelectedCount();
}

function updateSelectedCount() {
  document.getElementById("selected-count").textContent = `${selected.length} асуулт сонгогдсон`;
  document.getElementById("step2-next").disabled = selected.length < 3;
}

// ---------- Custom question modal ----------
function renderCustomOptionInputs() {
  const host = document.getElementById("custom-q-options");
  host.innerHTML = [0, 1, 2, 3]
    .map(
      (i) => `<div class="flex items-center gap-2">
        <input maxlength="2" placeholder="🙂" class="custom-opt-emoji w-12 h-12 rounded bg-surface-container text-center text-lg outline-none" />
        <input maxlength="60" placeholder="Сонголт ${i + 1}${i >= 2 ? " (сонголттой)" : ""}" class="custom-opt-text flex-1 h-12 px-4 rounded bg-surface-container text-on-surface outline-none focus:ring-2 focus:ring-primary-fixed" />
      </div>`
    )
    .join("");
}

function openCustomForm() {
  document.getElementById("custom-modal").classList.remove("hidden");
}
function closeCustomForm() {
  document.getElementById("custom-modal").classList.add("hidden");
}

function addCustomQuestion() {
  const emoji = document.getElementById("custom-q-emoji").value.trim() || "💭";
  const text = document.getElementById("custom-q-text").value.trim();
  if (!text) {
    showToast("Асуултаа бичнэ үү");
    return;
  }
  const emojiInputs = Array.from(document.querySelectorAll(".custom-opt-emoji"));
  const textInputs = Array.from(document.querySelectorAll(".custom-opt-text"));
  const options = textInputs
    .map((inp, i) => ({ id: String.fromCharCode(97 + i), emoji: emojiInputs[i].value.trim() || "🔹", text: inp.value.trim() }))
    .filter((o) => o.text);

  if (options.length < 2) {
    showToast("Доод тал нь 2 сонголт бичнэ үү");
    return;
  }
  if (selected.length >= 20) {
    showToast("Дээд тал нь 20 асуулт сонгоно уу 🙏");
    return;
  }

  selected.push({
    id: "custom-" + Date.now(),
    cat: "custom",
    emoji,
    text,
    options,
    correctOptionId: null,
    custom: true,
  });

  document.getElementById("custom-q-emoji").value = "";
  document.getElementById("custom-q-text").value = "";
  renderCustomOptionInputs();
  closeCustomForm();
  renderQuestionList();
  updateSelectedCount();
  showToast("Асуулт нэмэгдлээ ✅");
}

// ---------- Step 3: answers ----------
function renderAnswerList() {
  const host = document.getElementById("answer-list");
  host.innerHTML = selected
    .map(
      (q, qi) => `<div class="p-space-md rounded bg-surface-container flex flex-col gap-2.5">
      <div class="flex items-center gap-2">
        <span class="text-lg">${q.emoji}</span>
        <span class="font-label-lg text-label-lg text-on-surface">${escapeHtml(q.text)}</span>
      </div>
      <div class="grid grid-cols-1 gap-2" data-qindex="${qi}">
        ${q.options
          .map(
            (o) => `<button type="button" data-oid="${o.id}" class="ans-opt w-full p-3 rounded ${q.correctOptionId === o.id ? "bg-primary-container/25 text-primary-fixed ring-2 ring-primary-fixed" : "bg-surface-container-high text-on-surface"} text-left flex items-center gap-2 transition-all">
            <span>${o.emoji}</span><span class="font-body text-body-md flex-1">${escapeHtml(o.text)}</span>
            <span class="material-symbols-outlined text-[18px]">${q.correctOptionId === o.id ? "check_circle" : "radio_button_unchecked"}</span>
          </button>`
          )
          .join("")}
      </div>
    </div>`
    )
    .join("");

  host.querySelectorAll("[data-qindex]").forEach((group) => {
    const qi = Number(group.dataset.qindex);
    group.querySelectorAll(".ans-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        selected[qi].correctOptionId = btn.dataset.oid;
        renderAnswerList();
        updateStep3Next();
      });
    });
  });
}

function updateStep3Next() {
  const allAnswered = selected.every((q) => q.correctOptionId);
  document.getElementById("step3-next").disabled = !allAnswered;
}

// ---------- Step navigation ----------
function goStep(n) {
  currentStep = n;
  document.querySelectorAll(".step").forEach((s) => s.classList.remove("active"));
  document.getElementById("step-" + n).classList.add("active");
  document.getElementById("step-label").textContent = `Алхам ${n} / 4`;
  document.getElementById("progress-bar").style.width = `${n * 25}%`;
  if (n === 3) {
    renderAnswerList();
    updateStep3Next();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function finishQuiz() {
  const title = document.getElementById("quiz-title").value.trim();
  const creatorName = document.getElementById("creator-name").value.trim();
  const btn = document.getElementById("step3-next");
  btn.disabled = true;
  btn.innerHTML = `<span class="material-symbols-outlined text-[20px] animate-spin">progress_activity</span><span>Үүсгэж байна...</span>`;
  try {
    const quiz = await DB.createQuiz({
      title,
      emoji: selectedEmoji,
      creatorName,
      questions: selected,
      showRanking: true,
    });
    const shareUrl = quizUrl("play.html", { code: quiz.code });
    const manageUrl = quizUrl("manage.html", { code: quiz.code, token: quiz.ownerToken });
    document.getElementById("share-url").textContent = shareUrl;
    document.getElementById("manage-link").href = manageUrl;
    window._shareUrl = shareUrl;
    window._quizTitle = quiz.title;
    goStep(4);
  } catch (err) {
    console.error(err);
    showToast("Алдаа гарлаа, дахин оролдоно уу 🙏");
    btn.disabled = false;
    btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">celebration</span><span>Тест үүсгэх</span>`;
  }
}

function copyShareUrl() {
  if (window._shareUrl) {
    navigator.clipboard.writeText(window._shareUrl).then(() => showToast("Линк хууллаа ✅"));
  }
}

function doShare() {
  if (window._shareUrl) {
    shareLink(window._shareUrl, { title: "Bestie 💗", text: `${window._quizTitle} — хариулаад үз!` });
  }
}

document.addEventListener("DOMContentLoaded", init);
