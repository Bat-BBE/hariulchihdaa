/* Bestie — Тест бөглөх логик */
let quiz = null;
let isDemo = false;
let qIndex = 0;
let answers = {}; // questionId -> optionId
let startTime = 0;
let selectedAvatar = AVATAR_POOL[0];

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function goBackOrHome() {
  const active = document.querySelector(".screen.active");
  if (active && active.id === "screen-question" && qIndex > 0) {
    prevQuestion();
    return;
  }
  if (document.referrer && document.referrer.includes(location.host)) {
    history.back();
  } else {
    location.href = "index.html";
  }
}

function buildDemoQuiz() {
  const demoQuestions = QUESTION_BANK.slice(0, 5).map((q) => ({ ...q, correctOptionId: q.options[0].id }));
  return {
    code: "demo",
    title: "Жишээ тест",
    emoji: "💗",
    creatorName: "Bestie баг",
    isOpen: true,
    showRanking: true,
    questions: demoQuestions,
    attempts: [],
  };
}

async function init() {
  const params = new URLSearchParams(location.search);
  isDemo = params.get("demo") === "1";

  if (isDemo) {
    quiz = buildDemoQuiz();
  } else {
    const code = params.get("code");
    if (!code) {
      showErrorScreen("Тест олдсонгүй", "Линкээ дахин шалгана уу.");
      return;
    }
    try {
      quiz = await DB.getQuiz(code);
    } catch (err) {
      quiz = null;
    }
    if (!quiz) {
      showErrorScreen("Тест олдсонгүй", "Линк буруу эсвэл тест устгагдсан байж магадгүй.");
      return;
    }
    if (quiz.isOpen === false) {
      showErrorScreen("Тест хаагдсан байна", "Энэ тестийн эзэмшигч линкийг хаасан байна.");
      return;
    }

    // Guard: the creator's own browser remembers quizzes it made (DB.myQuizzes()).
    // If this is that quiz, block answering it so ranking only reflects real friends.
    const mine = DB.myQuizzes().find((m) => m.code === quiz.code);
    if (mine) {
      const manageUrl = quizUrl("manage.html", { code: mine.code, token: mine.token });
      const shareUrl = quizUrl("play.html", { code: mine.code });
      document.getElementById("own-manage-link").href = manageUrl;
      window._ownShareUrl = shareUrl;
      window._ownQuizTitle = quiz.title;
      showScreen("screen-own");
      return;
    }
  }

  document.getElementById("header-title").textContent = quiz.title;
  document.getElementById("intro-emoji").textContent = quiz.emoji || "💗";
  document.getElementById("intro-creator").textContent = quiz.creatorName ? `${quiz.creatorName}-н тест` : "Найзын тест";
  document.getElementById("intro-title").textContent = quiz.title;
  document.getElementById("intro-qcount").textContent = `${quiz.questions.length} асуулт`;
  if (quiz.creatorAvatar) {
    const creatorAvatarImg = document.getElementById("intro-creator-avatar");
    creatorAvatarImg.src = quiz.creatorAvatar;
    creatorAvatarImg.classList.remove("hidden");
  }

  const remembered = getIdentity();
  renderAvatarPicker(remembered ? remembered.avatarId : null);
  const nicknameInput = document.getElementById("nickname");
  if (remembered && remembered.nickname) {
    nicknameInput.value = remembered.nickname;
  }
  nicknameInput.addEventListener("input", () => {
    document.getElementById("nickname-error").classList.add("hidden");
    nicknameInput.classList.remove("ring-2", "ring-error");
  });

  showScreen("screen-intro");
}

function shareOwnQuiz() {
  if (window._ownShareUrl) {
    shareLink(window._ownShareUrl, { title: "Bestie 💗", text: `${window._ownQuizTitle} — хариулаад үз!` });
  }
}

function showErrorScreen(title, text) {
  document.getElementById("error-title").textContent = title;
  document.getElementById("error-text").textContent = text;
  showScreen("screen-error");
}

function renderAvatarPicker(preferredAvatarId) {
  const host = document.getElementById("avatar-picker");
  let startIndex = AVATAR_POOL.findIndex((a) => a.id === preferredAvatarId);
  if (startIndex < 0) startIndex = 0;
  selectedAvatar = AVATAR_POOL[startIndex];

  host.innerHTML = AVATAR_POOL.map(
    (a, i) => `<button type="button" data-i="${i}" class="avatar-btn ${i === startIndex ? "is-active ring-[3px] ring-primary-fixed scale-105 shadow-glow" : "ring-2 ring-transparent"} relative shrink-0 w-16 h-16 rounded-full overflow-hidden bg-surface-container transition-all">
      <img src="${a.src}" alt="" class="w-full h-full object-cover object-top" />
      <span class="avatar-check hidden absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary-fixed text-on-primary-fixed items-center justify-center shadow-md">
        <span class="material-symbols-outlined text-[12px]">check</span>
      </span>
    </button>`
  ).join("");
  host.querySelectorAll(".avatar-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedAvatar = AVATAR_POOL[Number(btn.dataset.i)];
      host.querySelectorAll(".avatar-btn").forEach((b) => b.classList.remove("is-active", "ring-[3px]", "ring-primary-fixed", "scale-105", "shadow-glow"));
      host.querySelectorAll(".avatar-btn").forEach((b) => b.classList.add("ring-2", "ring-transparent"));
      btn.classList.remove("ring-2", "ring-transparent");
      btn.classList.add("is-active", "ring-[3px]", "ring-primary-fixed", "scale-105", "shadow-glow");
    });
  });
}

function startQuiz() {
  const nicknameInput = document.getElementById("nickname");
  const nickname = nicknameInput.value.trim();
  const errorEl = document.getElementById("nickname-error");

  if (!nickname) {
    errorEl.classList.remove("hidden");
    nicknameInput.classList.add("ring-2", "ring-error");
    nicknameInput.focus();
    return;
  }
  errorEl.classList.add("hidden");
  nicknameInput.classList.remove("ring-2", "ring-error");

  saveIdentity({ nickname, avatarId: selectedAvatar.id });

  qIndex = 0;
  answers = {};
  startTime = Date.now();
  document.getElementById("qcounter").classList.remove("hidden");
  showScreen("screen-question");
  renderQuestion();
}

function renderQuestion() {
  const q = quiz.questions[qIndex];
  const total = quiz.questions.length;
  document.getElementById("qcounter").textContent = `${qIndex + 1}/${total}`;
  document.getElementById("progress-bar").style.width = `${((qIndex + 1) / total) * 100}%`;
  document.getElementById("q-emoji-pill").textContent = q.emoji || "💭";
  document.getElementById("q-text").textContent = q.text;
  document.getElementById("q-creator-hint").textContent = `${quiz.creatorName || "Найзын"} хариултыг тааж оноо аваарай!`;
  document.getElementById("q-back").style.visibility = qIndex > 0 ? "visible" : "hidden";

  const host = document.getElementById("q-options");
  const chosen = answers[q.id];
  host.innerHTML = q.options
    .map(
      (o) => `<button type="button" data-oid="${o.id}" class="opt-btn w-full text-left p-space-md rounded-lg ${chosen === o.id ? "bg-surface-container-highest ring-2 ring-primary-fixed" : "bg-surface-container-high"} transition-all flex items-center justify-between gap-3">
      <span class="flex items-center gap-3 min-w-0 flex-1">
        <span class="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-xl shrink-0">${o.emoji}</span>
        <span class="font-label-lg text-label-lg ${chosen === o.id ? "text-primary-fixed" : "text-on-surface"} flex-1 min-w-0 truncate">${escapeHtml(o.text)}</span>
      </span>
      <span class="material-symbols-outlined text-[20px] ${chosen === o.id ? "text-primary-fixed" : "text-on-surface-variant"} shrink-0">${chosen === o.id ? "check_circle" : "radio_button_unchecked"}</span>
    </button>`
    )
    .join("");

  host.querySelectorAll(".opt-btn").forEach((btn) => {
    btn.addEventListener("click", () => selectOption(q.id, btn.dataset.oid, btn));
  });
}

function selectOption(questionId, optionId, btnEl) {
  answers[questionId] = optionId;
  btnEl.classList.add("pop");
  renderQuestion();
  setTimeout(() => {
    if (qIndex < quiz.questions.length - 1) {
      qIndex++;
      renderQuestion();
    } else {
      finishAndSubmit();
    }
  }, 260);
}

function prevQuestion() {
  if (qIndex === 0) return;
  qIndex--;
  renderQuestion();
}

async function finishAndSubmit() {
  showScreen("screen-submitting");
  const durationMs = Date.now() - startTime;
  const answersArr = Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId }));
  const nickname = document.getElementById("nickname").value.trim();

  if (isDemo) {
    let score = 0;
    const graded = answersArr.map((a) => {
      const q = quiz.questions.find((qq) => qq.id === a.questionId);
      const correct = q && q.correctOptionId === a.optionId;
      if (correct) score++;
      return { ...a, correct: !!correct };
    });
    const attempt = {
      id: "demo-attempt",
      nickname: nickname || "Нэргүй найз",
      avatar: selectedAvatar.src,
      score,
      total: quiz.questions.length,
      durationMs,
      answers: graded,
      createdAt: Date.now(),
    };
    sessionStorage.setItem("bestie_demo_result", JSON.stringify({ quiz, attempt }));
    location.href = "result.html?demo=1";
    return;
  }

  try {
    const { attempt } = await DB.addAttempt(quiz.code, {
      nickname,
      avatar: selectedAvatar.src,
      answers: answersArr,
      durationMs,
    });
    location.href = quizUrl("result.html", { code: quiz.code, attempt: attempt.id });
  } catch (err) {
    console.error(err);
    showToast("Илгээхэд алдаа гарлаа, дахин оролдоно уу");
    showScreen("screen-question");
  }
}

document.addEventListener("DOMContentLoaded", init);
