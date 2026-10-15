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
  }

  document.getElementById("header-title").textContent = quiz.title;
  document.getElementById("intro-emoji").textContent = quiz.emoji || "💗";
  document.getElementById("intro-creator").textContent = `${quiz.creatorName || "Найз"}-н тест`;
  document.getElementById("intro-title").textContent = quiz.title;
  document.getElementById("intro-qcount").textContent = `${quiz.questions.length} асуулт`;
  renderAvatarPicker();
  showScreen("screen-intro");
}

function showErrorScreen(title, text) {
  document.getElementById("error-title").textContent = title;
  document.getElementById("error-text").textContent = text;
  showScreen("screen-error");
}

function renderAvatarPicker() {
  const host = document.getElementById("avatar-picker");
  host.innerHTML = AVATAR_POOL.map(
    (a, i) => `<button type="button" data-i="${i}" class="avatar-btn shrink-0 w-16 h-16 rounded-full overflow-hidden bg-surface-container ${i === 0 ? "ring-2 ring-primary-fixed" : ""}">
      <img src="${a.src}" alt="" class="w-full h-full object-cover object-top" />
    </button>`
  ).join("");
  host.querySelectorAll(".avatar-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedAvatar = AVATAR_POOL[Number(btn.dataset.i)];
      host.querySelectorAll(".avatar-btn").forEach((b) => b.classList.remove("ring-2", "ring-primary-fixed"));
      btn.classList.add("ring-2", "ring-primary-fixed");
    });
  });
}

function startQuiz() {
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
      <span class="flex items-center gap-3 min-w-0">
        <span class="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-xl shrink-0">${o.emoji}</span>
        <span class="font-label-lg text-label-lg ${chosen === o.id ? "text-primary-fixed" : "text-on-surface"} truncate">${escapeHtml(o.text)}</span>
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
