/*
 * Bestie — Match (Таарал) тест логик
 * -----------------------------------
 * Энгийн тестээс ялгаатай нь: энд "зөв хариулт" гэж байхгүй. Хоёр хүн
 * ХОЁУЛАА ижил асуултад өөрийнхөөрөө хариулаад, хариултууд хэр таарч
 * байгааг (match %) харьцуулна.
 */
let matchMode = null; // "create" | "answer"
let matchCategory = null;
let matchQuiz = null;
let matchQuestions = [];
let matchQIndex = 0;
let matchAnswers = {};
let matchSelectedAvatar = AVATAR_POOL[0];
let matchCode = null;

const MATCH_SEEN_KEY = "bestie_match_seen_v1";

function getMatchSeen() {
  try {
    return JSON.parse(localStorage.getItem(MATCH_SEEN_KEY) || "{}");
  } catch (err) {
    return {};
  }
}

function setMatchSeen(code) {
  const m = getMatchSeen();
  m[code] = true;
  try {
    localStorage.setItem(MATCH_SEEN_KEY, JSON.stringify(m));
  } catch (err) {
    /* noop */
  }
}

function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function goBackOrHome() {
  const active = document.querySelector(".screen.active");
  if (active && active.id === "screen-question" && matchQIndex > 0) {
    prevMatchQuestion();
    return;
  }
  location.href = "index.html";
}

function renderCategoryScreen() {
  const host = document.getElementById("category-grid");
  if (!host) return;
  host.innerHTML = MATCH_CATEGORIES.map(
    (
      c,
    ) => `<button type="button" onclick="selectCategory('${c.id}')" class="fade-up flex flex-col items-start gap-2 p-space-lg rounded-lg bg-surface-container-low shadow-card text-left active:scale-[0.97] transition-transform w-full">
      <span class="w-14 h-14 rounded-full bg-primary-fixed/15 flex items-center justify-center text-3xl">${c.emoji}</span>
      <span class="font-display text-headline-md text-on-surface">${c.label}</span>
      <span class="font-body text-body-sm text-on-surface-variant">${c.desc}</span>
    </button>`,
  ).join("");
}

async function init() {
  renderCategoryScreen();
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const presetCategory = params.get("category");

  if (!code) {
    matchMode = "create";
    if (presetCategory && MATCH_QUESTION_BANK[presetCategory]) {
      selectCategory(presetCategory);
    } else {
      showScreen("screen-category");
    }
    return;
  }

  matchCode = code;
  let quiz = null;
  try {
    quiz = await DB.getQuiz(code);
  } catch (err) {
    quiz = null;
  }
  if (!quiz || quiz.type !== "match") {
    showErrorScreen(
      "Тест олдсонгүй",
      "Линк буруу эсвэл тест устгагдсан байж магадгүй.",
    );
    return;
  }
  matchQuiz = quiz;
  matchQuestions = quiz.questions;

  const mine = DB.myQuizzes().find((m) => m.code === quiz.code);
  const tokenParam = params.get("token");
  const isOwner = !!mine || (tokenParam && tokenParam === quiz.ownerToken);
  const seen = getMatchSeen();

  if (isOwner) {
    if (quiz.participantB) {
      renderMatchResult(quiz);
      showScreen("screen-result");
    } else {
      renderShareScreen(quiz);
      showScreen("screen-share");
    }
    return;
  }

  if (seen[code] && quiz.participantB) {
    renderMatchResult(quiz);
    showScreen("screen-result");
    return;
  }

  if (quiz.participantB) {
    document.getElementById("full-title").textContent =
      "Энэ тест аль хэдийн дууссан байна";
    document.getElementById("full-text").textContent =
      "Тохирол асуулт зөвхөн хоёр хүний хооронд ажилладаг — энэ линкийг аль хэдийн нөгөө хүн бөглөсөн байна.";
    showScreen("screen-full");
    return;
  }

  matchMode = "answer";
  document.getElementById("header-title").textContent = quiz.title;
  document.getElementById("identity-cat-emoji").textContent =
    quiz.emoji || "💞";
  document.getElementById("identity-cat-title").textContent = quiz.title;
  document.getElementById("identity-cat-sub").textContent =
    `${quiz.creatorName || "Найз"} чамайг энэ тестэд урьж байна. Хоёулаа өөрийнхөөрөө хариулаад, хэр таарч байгаагаа мэдээрэй.`;
  prefillIdentity();
  showScreen("screen-identity");
}

function prefillIdentity() {
  const remembered = getIdentity();
  renderMatchAvatarPicker(remembered ? remembered.avatarId : null);
  const nicknameInput = document.getElementById("m-nickname");
  if (remembered && remembered.nickname)
    nicknameInput.value = remembered.nickname;
  nicknameInput.addEventListener("input", () => {
    document.getElementById("m-nickname-error").classList.add("hidden");
    nicknameInput.classList.remove("ring-2", "ring-error");
  });
}

function selectCategory(category) {
  matchCategory = category;
  matchQuestions = MATCH_QUESTION_BANK[category] || [];
  const cat = MATCH_CATEGORIES.find((c) => c.id === category);
  document.getElementById("identity-cat-emoji").textContent = cat.emoji;
  document.getElementById("identity-cat-title").textContent = cat.label;
  document.getElementById("identity-cat-sub").textContent =
    "Эхлээд өөрийнхөө тухай хариулаарай, дараа нь найзаа/хайртанаа урьж оролцуулна.";
  prefillIdentity();
  showScreen("screen-identity");
}

function renderMatchAvatarPicker(preferredAvatarId) {
  const host = document.getElementById("m-avatar-picker");
  let startIndex = AVATAR_POOL.findIndex((a) => a.id === preferredAvatarId);
  if (startIndex < 0) startIndex = 0;
  matchSelectedAvatar = AVATAR_POOL[startIndex];

  host.innerHTML = AVATAR_POOL.map(
    (
      a,
      i,
    ) => `<button type="button" data-i="${i}" class="m-avatar-btn ${i === startIndex ? "is-active ring-[3px] ring-primary-fixed scale-105 shadow-glow" : "ring-2 ring-transparent"} relative shrink-0 w-16 h-16 rounded-full overflow-hidden bg-surface-container transition-all">
      <img src="${a.src}" alt="" class="w-full h-full object-cover object-top" />
      <span class="avatar-check hidden absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary-fixed text-on-primary-fixed items-center justify-center shadow-md">
        <span class="material-symbols-outlined text-[12px]">check</span>
      </span>
    </button>`,
  ).join("");
  host.querySelectorAll(".m-avatar-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      matchSelectedAvatar = AVATAR_POOL[Number(btn.dataset.i)];
      host
        .querySelectorAll(".m-avatar-btn")
        .forEach((b) =>
          b.classList.remove(
            "is-active",
            "ring-[3px]",
            "ring-primary-fixed",
            "scale-105",
            "shadow-glow",
          ),
        );
      host
        .querySelectorAll(".m-avatar-btn")
        .forEach((b) => b.classList.add("ring-2", "ring-transparent"));
      btn.classList.remove("ring-2", "ring-transparent");
      btn.classList.add(
        "is-active",
        "ring-[3px]",
        "ring-primary-fixed",
        "scale-105",
        "shadow-glow",
      );
    });
  });
}

function startMatchQuestions() {
  const nicknameInput = document.getElementById("m-nickname");
  const nickname = nicknameInput.value.trim();
  const errorEl = document.getElementById("m-nickname-error");

  if (!nickname) {
    errorEl.classList.remove("hidden");
    nicknameInput.classList.add("ring-2", "ring-error");
    nicknameInput.focus();
    return;
  }
  errorEl.classList.add("hidden");
  nicknameInput.classList.remove("ring-2", "ring-error");

  saveIdentity({ nickname, avatarId: matchSelectedAvatar.id });

  matchQIndex = 0;
  matchAnswers = {};
  document.getElementById("qcounter").classList.remove("hidden");
  showScreen("screen-question");
  renderMatchQuestion();
}

function renderMatchQuestion() {
  const q = matchQuestions[matchQIndex];
  const total = matchQuestions.length;
  document.getElementById("qcounter").textContent =
    `${matchQIndex + 1}/${total}`;
  document.getElementById("progress-bar").style.width =
    `${((matchQIndex + 1) / total) * 100}%`;
  document.getElementById("mq-emoji-pill").textContent = q.emoji || "💭";
  document.getElementById("mq-text").textContent = q.text;
  document.getElementById("mq-back").style.visibility =
    matchQIndex > 0 ? "visible" : "hidden";

  const host = document.getElementById("mq-options");
  const chosen = matchAnswers[q.id];
  host.innerHTML = q.options
    .map(
      (
        o,
      ) => `<button type="button" data-oid="${o.id}" class="mopt-btn w-full text-left p-space-md rounded-lg ${chosen === o.id ? "bg-surface-container-highest ring-2 ring-primary-fixed" : "bg-surface-container-high"} transition-all flex items-center justify-between gap-3">
      <span class="flex items-center gap-3 min-w-0 flex-1">
        <span class="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-xl shrink-0">${o.emoji || "💭"}</span>
        <span class="font-label-lg text-label-lg ${chosen === o.id ? "text-primary-fixed" : "text-on-surface"} flex-1 min-w-0 truncate">${escapeHtml(o.text)}</span>
      </span>
      <span class="material-symbols-outlined text-[20px] ${chosen === o.id ? "text-primary-fixed" : "text-on-surface-variant"} shrink-0">${chosen === o.id ? "check_circle" : "radio_button_unchecked"}</span>
    </button>`,
    )
    .join("");

  host.querySelectorAll(".mopt-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      selectMatchOption(q.id, btn.dataset.oid, btn),
    );
  });
}

function selectMatchOption(questionId, optionId, btnEl) {
  matchAnswers[questionId] = optionId;
  btnEl.classList.add("pop");
  renderMatchQuestion();
  setTimeout(() => {
    if (matchQIndex < matchQuestions.length - 1) {
      matchQIndex++;
      renderMatchQuestion();
    } else {
      finishMatchAnswers();
    }
  }, 260);
}

function prevMatchQuestion() {
  if (matchQIndex === 0) return;
  matchQIndex--;
  renderMatchQuestion();
}

async function finishMatchAnswers() {
  showScreen("screen-submitting");
  const answersArr = Object.entries(matchAnswers).map(
    ([questionId, optionId]) => ({ questionId, optionId }),
  );
  const identity = getIdentity();

  try {
    if (matchMode === "create") {
      const quiz = await DB.createMatchQuiz({
        category: matchCategory,
        creatorName: identity.nickname,
        creatorAvatar: matchSelectedAvatar.src,
        answers: answersArr,
      });
      matchQuiz = quiz;
      setMatchSeen(quiz.code);
      renderShareScreen(quiz);
      showScreen("screen-share");
    } else {
      const quiz = await DB.submitMatchAnswer(matchCode, {
        nickname: identity.nickname,
        avatar: matchSelectedAvatar.src,
        answers: answersArr,
      });
      setMatchSeen(matchCode);
      renderMatchResult(quiz);
      showScreen("screen-result");
    }
  } catch (err) {
    console.error(err);
    showToast("Илгээхэд алдаа гарлаа, дахин оролдоно уу");
    showScreen("screen-question");
  }
}

function renderShareScreen(quiz) {
  const url = quizUrl("match.html", { code: quiz.code });
  document.getElementById("share-emoji").textContent = quiz.emoji || "💞";
  document.getElementById("share-title").textContent = quiz.title;
  document.getElementById("m-share-url").textContent = url;
  window._matchShareUrl = url;
  window._matchShareTitle = quiz.title;
}

function copyMatchShareUrl() {
  navigator.clipboard
    .writeText(window._matchShareUrl || "")
    .then(() => showToast("Линк хууллаа ✅"))
    .catch(() => showToast("Линкийг гараар хуулна уу"));
}

function doMatchShare() {
  if (window._matchShareUrl) {
    shareLink(window._matchShareUrl, {
      title: "Bestie 💗",
      text: `${window._matchShareTitle} — хамт хариулаад хэр таарч байгаагаа мэдээрэй!`,
    });
  }
}

function showErrorScreen(title, text) {
  document.getElementById("error-title").textContent = title;
  document.getElementById("error-text").textContent = text;
  showScreen("screen-error");
}

function renderMatchResult(quiz) {
  const pct = quiz.matchScore != null ? quiz.matchScore : 0;
  document.getElementById("result-title").textContent = quiz.title;
  document.getElementById("result-pct-number").textContent = `${pct}%`;

  const ring = document.getElementById("result-ring-fill");
  const circumference = 314.16;
  const offset = circumference - (pct / 100) * circumference;
  requestAnimationFrame(() => {
    ring.style.strokeDashoffset = String(offset);
  });

  const a = quiz.participantA;
  const b = quiz.participantB;
  document.getElementById("result-a-avatar").src = a.avatar;
  document.getElementById("result-a-name").textContent = a.nickname;
  document.getElementById("result-b-avatar").src = b.avatar;
  document.getElementById("result-b-name").textContent = b.nickname;

  document.getElementById("result-message").textContent =
    pct >= 80
      ? "Та хоёр үнэхээр төстэй! 💞"
      : pct >= 50
        ? "Сайн л таарч байна 👯"
        : "Ялгаатай ч энэ нь сайхан шүү 🌈";

  const host = document.getElementById("result-breakdown");
  host.innerHTML = quiz.questions
    .map((q) => {
      const aAns = a.answers.find((x) => x.questionId === q.id);
      const bAns = b.answers.find((x) => x.questionId === q.id);
      const aOpt = q.options.find((o) => o.id === (aAns && aAns.optionId));
      const bOpt = q.options.find((o) => o.id === (bAns && bAns.optionId));
      const matched = aOpt && bOpt && aOpt.id === bOpt.id;
      return `<div class="p-space-md rounded-lg ${matched ? "bg-primary-fixed/10 ring-1 ring-primary-fixed/30" : "bg-surface-container"} flex flex-col gap-2">
      <p class="font-label-md text-label-md text-on-surface flex items-start gap-1.5"><span class="shrink-0">${q.emoji || "💭"}</span><span class="min-w-0">${escapeHtml(q.text)}</span></p>
      <div class="flex items-center gap-2 text-body-sm font-body-sm">
        <span class="flex-1 min-w-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-surface-container-high text-on-surface"><span class="shrink-0">${aOpt ? aOpt.emoji : "❔"}</span><span class="truncate min-w-0">${aOpt ? escapeHtml(aOpt.text) : "—"}</span></span>
        <span class="shrink-0 text-on-surface-variant">${matched ? "✅" : "↔️"}</span>
        <span class="flex-1 min-w-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-surface-container-high text-on-surface"><span class="shrink-0">${bOpt ? bOpt.emoji : "❔"}</span><span class="truncate min-w-0">${bOpt ? escapeHtml(bOpt.text) : "—"}</span></span>
      </div>
    </div>`;
    })
    .join("");
}

function shareMatchResult() {
  if (!matchQuiz) return;
  const url = quizUrl("match.html", { code: matchQuiz.code });
  shareLink(url, {
    title: "Bestie 💗",
    text: `Бид ${matchQuiz.matchScore}% таарсан! Чи хэр таарахаа шалгаарай 💞`,
  });
}

document.addEventListener("DOMContentLoaded", init);
