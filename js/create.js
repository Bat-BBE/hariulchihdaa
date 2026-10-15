/* Bestie — Тест үүсгэх логик */
let selectedEmoji = "💗"; // quiz icon — defaults to 💗, or whatever a template sets
let selectedCreatorAvatar = AVATAR_POOL[0]; // the CREATOR's own profile avatar
let selected = []; // chosen questions, each with correctOptionId
let activeCat = "all";
let currentStep = 1;

function init() {
  mountIdentityWidget();

  const params = new URLSearchParams(location.search);
  const template = params.get("template");

  const identity = getIdentity();
  const nameInput = document.getElementById("creator-name");
  if (identity && identity.nickname) {
    nameInput.value = identity.nickname;
  }
  nameInput.addEventListener("input", () => {
    document.getElementById("creator-name-error").classList.add("hidden");
    nameInput.classList.remove("ring-2", "ring-error");
  });
  renderCreatorAvatarPicker(identity ? identity.avatarId : null);

  renderCatChips();
  renderQuestionList();

  if (template) {
    const tpl = TEMPLATE_QUIZZES.find((t) => t.id === template);
    if (tpl) {
      const picked = getQuestionsByIds(tpl.questionIds);
      picked.forEach((q) => selected.push({ ...q, correctOptionId: null, custom: false }));
      selectedEmoji = tpl.emoji;
      const titleInput = document.getElementById("quiz-title");
      if (titleInput && !titleInput.value) titleInput.value = tpl.title;
      updateSelectedCount();
      showToast(`"${tpl.title}" загвар бэлдэгдлээ ✨`);
    }
    renderCatChips();
    renderQuestionList();
  }
}

function renderCreatorAvatarPicker(preferredAvatarId) {
  const host = document.getElementById("creator-avatar-picker");
  let startIndex = AVATAR_POOL.findIndex((a) => a.id === preferredAvatarId);
  if (startIndex < 0) startIndex = 0;
  selectedCreatorAvatar = AVATAR_POOL[startIndex];

  host.innerHTML = AVATAR_POOL.map(
    (a, i) => `<button type="button" data-i="${i}" class="creator-avatar-btn ${i === startIndex ? "ring-[3px] ring-primary-fixed scale-105 shadow-glow" : "ring-2 ring-transparent"} relative shrink-0 w-16 h-16 rounded-full overflow-hidden bg-surface-container transition-all">
      <img src="${a.src}" alt="" class="w-full h-full object-cover object-top" />
    </button>`
  ).join("");
  host.querySelectorAll(".creator-avatar-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedCreatorAvatar = AVATAR_POOL[Number(btn.dataset.i)];
      host.querySelectorAll(".creator-avatar-btn").forEach((b) => b.classList.remove("ring-[3px]", "ring-primary-fixed", "scale-105", "shadow-glow"));
      host.querySelectorAll(".creator-avatar-btn").forEach((b) => b.classList.add("ring-2", "ring-transparent"));
      btn.classList.remove("ring-2", "ring-transparent");
      btn.classList.add("ring-[3px]", "ring-primary-fixed", "scale-105", "shadow-glow");
    });
  });
}

function goToStep2() {
  const nameInput = document.getElementById("creator-name");
  const name = nameInput.value.trim();
  const errorEl = document.getElementById("creator-name-error");
  if (!name) {
    errorEl.classList.remove("hidden");
    nameInput.classList.add("ring-2", "ring-error");
    nameInput.focus();
    return;
  }
  errorEl.classList.add("hidden");
  nameInput.classList.remove("ring-2", "ring-error");
  goStep(2);
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

  const selectedHtml = selected.length
    ? `<div class="flex items-center gap-1.5 pt-1">
        <span class="font-label-sm text-label-sm text-primary-fixed">✅ Сонгосон асуултууд (${selected.length})</span>
      </div>` +
      selected
        .map(
          (q, i) => `<div class="w-full p-space-md rounded bg-surface-container-highest flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-lg shrink-0">${q.emoji}</div>
          <span class="font-body text-body-md text-on-surface flex-1 min-w-0 truncate">${escapeHtml(q.text)}</span>
          <button type="button" data-editidx="${i}" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary-fixed shrink-0" aria-label="Засах"><span class="material-symbols-outlined text-[16px]">edit</span></button>
          <button type="button" data-removeidx="${i}" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-error shrink-0" aria-label="Хасах"><span class="material-symbols-outlined text-[16px]">delete</span></button>
        </div>`
        )
        .join("") +
      `<div class="flex items-center gap-1.5 pt-2"><span class="font-label-sm text-label-sm text-on-surface-variant">Сангаас нэмэх</span></div>`
    : "";

  const bankHtml = list
    .map((q) => {
      const sel = isSelected(q.id);
      return `<button type="button" data-id="${q.id}" class="qcard ${sel ? "selected" : ""} text-left w-full p-space-md rounded bg-surface-container flex items-center gap-3 transition-all active:scale-[0.99]">
        <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-lg shrink-0">${q.emoji}</div>
        <span class="font-body text-body-md text-on-surface flex-1 min-w-0">${escapeHtml(q.text)}</span>
        <span class="material-symbols-outlined text-[20px] shrink-0 ${sel ? "text-primary-fixed" : "text-on-surface-variant"}">${sel ? "check_circle" : "radio_button_unchecked"}</span>
      </button>`;
    })
    .join("");

  host.innerHTML = selectedHtml + bankHtml;

  host.querySelectorAll("[data-id]").forEach((card) => {
    card.addEventListener("click", () => {
      const q = QUESTION_BANK.find((x) => x.id === card.dataset.id);
      toggleSelect(q);
    });
  });
  host.querySelectorAll("[data-editidx]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openCustomForm(Number(btn.dataset.editidx));
    });
  });
  host.querySelectorAll("[data-removeidx]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selected.splice(Number(btn.dataset.removeidx), 1);
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

// ---------- Question modal (add new OR edit an already-selected question) ----------
let editingIndex = null; // null = adding a brand-new question; number = index into `selected`

function optionRowHTML() {
  return `<div class="flex items-center gap-2 opt-row">
    <input maxlength="2" placeholder="🙂" class="custom-opt-emoji w-12 h-12 rounded bg-surface-container text-center text-lg outline-none shrink-0 focus:ring-2 focus:ring-primary-fixed" />
    <input maxlength="60" placeholder="Сонголт бичих..." class="custom-opt-text flex-1 h-12 px-4 rounded bg-surface-container text-on-surface outline-none focus:ring-2 focus:ring-primary-fixed" />
    <button type="button" onclick="removeOptionRow(this)" class="opt-remove shrink-0 w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-error" aria-label="Энэ сонголтыг хасах"><span class="material-symbols-outlined text-[16px]">close</span></button>
  </div>`;
}

function renderOptionRows(options) {
  const host = document.getElementById("custom-q-options");
  const count = Math.max(2, options ? options.length : 2);
  host.innerHTML = Array.from({ length: count }, optionRowHTML).join("");
  if (options) {
    const emojiInputs = host.querySelectorAll(".custom-opt-emoji");
    const textInputs = host.querySelectorAll(".custom-opt-text");
    options.forEach((o, i) => {
      if (emojiInputs[i]) emojiInputs[i].value = o.emoji || "";
      if (textInputs[i]) textInputs[i].value = o.text || "";
    });
  }
  updateOptionRowControls();
}

function updateOptionRowControls() {
  const rows = document.querySelectorAll("#custom-q-options .opt-row");
  rows.forEach((row) => {
    row.querySelector(".opt-remove").classList.toggle("invisible", rows.length <= 2);
  });
  document.getElementById("add-option-btn").classList.toggle("hidden", rows.length >= 6);
}

function addOptionRow() {
  const host = document.getElementById("custom-q-options");
  if (host.querySelectorAll(".opt-row").length >= 6) return;
  host.insertAdjacentHTML("beforeend", optionRowHTML());
  updateOptionRowControls();
}

function removeOptionRow(btn) {
  const host = document.getElementById("custom-q-options");
  if (host.querySelectorAll(".opt-row").length <= 2) return;
  btn.closest(".opt-row").remove();
  updateOptionRowControls();
}

function openCustomForm(index) {
  editingIndex = typeof index === "number" ? index : null;
  const titleEl = document.getElementById("custom-modal-title");
  const saveBtn = document.getElementById("custom-save-btn");

  if (editingIndex !== null) {
    const q = selected[editingIndex];
    titleEl.textContent = "Асуулт засах";
    saveBtn.textContent = "Хадгалах";
    document.getElementById("custom-q-emoji").value = q.emoji || "";
    document.getElementById("custom-q-text").value = q.text || "";
    renderOptionRows(q.options);
  } else {
    titleEl.textContent = "Шинэ асуулт";
    saveBtn.textContent = "Асуулт нэмэх";
    document.getElementById("custom-q-emoji").value = "";
    document.getElementById("custom-q-text").value = "";
    renderOptionRows(null);
  }
  document.getElementById("custom-modal").classList.remove("hidden");
}

function closeCustomForm() {
  document.getElementById("custom-modal").classList.add("hidden");
  editingIndex = null;
}

function saveCustomQuestion() {
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

  if (editingIndex !== null) {
    const prev = selected[editingIndex];
    selected[editingIndex] = {
      ...prev,
      emoji,
      text,
      options,
      correctOptionId: null, // хариултууд өөрчлөгдсөн тул зөв хариултаа дахин сонгоно
      custom: true,
    };
    showToast("Асуулт хадгалагдлаа ✅");
  } else {
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
    showToast("Асуулт нэмэгдлээ ✅");
  }

  closeCustomForm();
  renderQuestionList();
  updateSelectedCount();
}

// ---------- Step 3: answers ----------
function renderAnswerList() {
  const host = document.getElementById("answer-list");
  host.innerHTML = selected
    .map(
      (q, qi) => `<div class="p-space-md rounded bg-surface-container flex flex-col gap-2.5">
      <div class="flex items-center gap-2">
        <span class="text-lg shrink-0">${q.emoji}</span>
        <span class="font-label-lg text-label-lg text-on-surface min-w-0">${escapeHtml(q.text)}</span>
      </div>
      <div class="grid grid-cols-1 gap-2" data-qindex="${qi}">
        ${q.options
          .map(
            (o) => `<button type="button" data-oid="${o.id}" class="ans-opt w-full p-3 rounded ${q.correctOptionId === o.id ? "bg-primary-container/25 text-primary-fixed ring-2 ring-primary-fixed" : "bg-surface-container-high text-on-surface"} text-left flex items-center gap-2 transition-all">
            <span class="shrink-0">${o.emoji}</span><span class="font-body text-body-md flex-1 min-w-0">${escapeHtml(o.text)}</span>
            <span class="material-symbols-outlined text-[18px] shrink-0">${q.correctOptionId === o.id ? "check_circle" : "radio_button_unchecked"}</span>
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
  const direction = n > currentStep ? "right" : "left";
  currentStep = n;
  document.querySelectorAll(".step").forEach((s) => s.classList.remove("active", "step-anim-right", "step-anim-left"));
  const target = document.getElementById("step-" + n);
  target.classList.add("active");
  // force a reflow so the animation class replays every time, even if it was used before
  void target.offsetWidth;
  target.classList.add(direction === "right" ? "step-anim-right" : "step-anim-left");
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
    saveIdentity({ nickname: creatorName, avatarId: selectedCreatorAvatar.id });
    const quiz = await DB.createQuiz({
      title,
      emoji: selectedEmoji,
      creatorName,
      creatorAvatar: selectedCreatorAvatar.src,
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
    showToast("Алдаа гарлаа, дахин оролдоно уу");
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
