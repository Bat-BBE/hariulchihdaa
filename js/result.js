/* Bestie — Үр дүнгийн хуудасны логик */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function scoreMessage(pct) {
  if (pct >= 1) return "Чи намайг 100% мэднэ! Жинхэнэ bestie 👑";
  if (pct >= 0.7) return "Маш сайн! Чи намайг үнэхээр сайн мэднэ 😍";
  if (pct >= 0.4) return "Дунд зэрэг тохирлоо — дахин оролдоод үз 😄";
  return "Хөөх, бие биенээ илүү сайн танилцах хэрэгтэй юм байна 🙈";
}

function launchConfetti() {
  if (typeof confetti !== "function") return;
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.4 }, colors: ["#D8EE48", "#DBB8FF", "#FFB0CB", "#FFFFFF"] });
  setTimeout(() => confetti({ particleCount: 50, spread: 100, origin: { y: 0.3 } }), 300);
}

function ringColor(pct) {
  if (pct >= 0.7) return "#D8EE48";
  if (pct >= 0.4) return "#DBB8FF";
  return "#FFB0CB";
}

function animateResultReveal({ scoreEl, pctEl, ring, score, total, onDone }) {
  const duration = 950;
  const start = performance.now();
  const finalPct = total ? score / total : 0;
  const circumference = 2 * Math.PI * 50;

  ring.style.stroke = ringColor(finalPct);
  ring.setAttribute("stroke-dasharray", String(circumference));
  ring.setAttribute("stroke-dashoffset", String(circumference));

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const shownScore = Math.round(eased * score);
    scoreEl.textContent = `${shownScore}/${total}`;
    pctEl.textContent = `${Math.round(eased * finalPct * 100)}%`;
    ring.setAttribute("stroke-dashoffset", String(circumference * (1 - eased * finalPct)));
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      scoreEl.textContent = `${score}/${total}`;
      pctEl.textContent = `${Math.round(finalPct * 100)}%`;
      scoreEl.classList.add("score-pop");
      setTimeout(() => scoreEl.classList.remove("score-pop"), 420);
      if (onDone) onDone();
    }
  }
  requestAnimationFrame(tick);
}

async function init() {
  const params = new URLSearchParams(location.search);
  let quiz = null;
  let attempt = null;
  const isDemo = params.get("demo") === "1";

  if (isDemo) {
    try {
      const raw = sessionStorage.getItem("bestie_demo_result");
      if (raw) {
        const parsed = JSON.parse(raw);
        quiz = parsed.quiz;
        attempt = parsed.attempt;
      }
    } catch (err) {
      quiz = null;
    }
  } else {
    const code = params.get("code");
    const attemptId = params.get("attempt");
    if (code && attemptId) {
      quiz = await DB.getQuiz(code);
      if (quiz) attempt = (quiz.attempts || []).find((a) => a.id === attemptId) || null;
    }
  }

  if (!quiz || !attempt) {
    showScreen("screen-error");
    return;
  }

  renderResult(quiz, attempt, isDemo);
  showScreen("screen-result");
}

function renderResult(quiz, attempt, isDemo) {
  const pct = attempt.total ? attempt.score / attempt.total : 0;

  document.getElementById("result-avatar").src = attempt.avatar || "ohin1.png";
  document.getElementById("result-nickname").textContent = attempt.nickname;
  document.getElementById("result-message").textContent = scoreMessage(pct);
  document.getElementById("result-quiz-title").textContent = `${quiz.emoji || "💗"} ${quiz.title}`;

  const scoreEl = document.getElementById("result-score");
  const pctEl = document.getElementById("result-pct");
  const ring = document.getElementById("score-ring-fill");
  scoreEl.textContent = `0/${attempt.total}`;
  pctEl.textContent = "0%";
  animateResultReveal({
    scoreEl,
    pctEl,
    ring,
    score: attempt.score,
    total: attempt.total,
    onDone: () => {
      if (pct >= 0.5) {
        const gif = document.getElementById("celebrate-gif");
        gif.src = pct >= 0.8 ? "ohduud.gif" : "ohin.gif";
        gif.loading = "lazy";
        gif.classList.remove("hidden");
      }
      if (pct >= 0.4) launchConfetti();
    },
  });

  // Breakdown
  const breakdownHost = document.getElementById("breakdown-list");
  breakdownHost.innerHTML = quiz.questions
    .map((q) => {
      const a = attempt.answers.find((x) => x.questionId === q.id);
      const chosenOpt = a ? q.options.find((o) => o.id === a.optionId) : null;
      const correctOpt = q.options.find((o) => o.id === q.correctOptionId);
      const correct = a && a.correct;
      return `<div class="p-space-md rounded bg-surface-container flex flex-col gap-1.5">
        <div class="flex items-center gap-2">
          <span class="shrink-0">${q.emoji}</span>
          <span class="font-label-md text-label-md text-on-surface flex-1 min-w-0">${escapeHtml(q.text)}</span>
          <span class="material-symbols-outlined text-[18px] shrink-0 ${correct ? "text-primary-fixed" : "text-tertiary-fixed-dim"}">${correct ? "check_circle" : "cancel"}</span>
        </div>
        <div class="flex items-center gap-1.5 text-body-sm font-body text-on-surface-variant pl-6">
          <span>Хариулсан:</span>
          <span class="text-on-surface font-bold">${chosenOpt ? chosenOpt.emoji + " " + escapeHtml(chosenOpt.text) : "—"}</span>
        </div>
        ${!correct && correctOpt ? `<div class="flex items-center gap-1.5 text-body-sm font-body text-primary-fixed pl-6"><span>Зөв хариулт:</span><span class="font-bold">${correctOpt.emoji} ${escapeHtml(correctOpt.text)}</span></div>` : ""}
      </div>`;
    })
    .join("");

  // Ranking
  const rankingSection = document.getElementById("ranking-section");
  if (isDemo || quiz.showRanking === false) {
    rankingSection.innerHTML = isDemo
      ? `<div class="p-space-md rounded bg-surface-container-high text-center flex flex-col gap-2">
          <p class="font-body text-body-md text-on-surface-variant">Энэ бол жишээ тест — жинхэнэ ranking үзэхийн тулд өөрийн тестээ үүсгээд найзуудаа урь! 💗</p>
        </div>`
      : `<div class="p-space-md rounded bg-surface-container-high text-center"><p class="font-body text-body-sm text-on-surface-variant">Эзэмшигч ranking-ийг нуусан байна 🙈</p></div>`;
    return;
  }

  const sorted = [...(quiz.attempts || [])].sort((a, b) => b.score - a.score || a.durationMs - b.durationMs);
  const medals = ["👑", "🥈", "🥉"];
  const rankingHost = document.getElementById("ranking-list");
  rankingHost.innerHTML = sorted
    .map((a, i) => {
      const isMe = a.id === attempt.id;
      return `<div class="p-space-md rounded ${isMe ? "bg-primary-container/15 ring-2 ring-primary-fixed" : "bg-surface-container"} flex items-center gap-3">
        <span class="w-8 text-center font-display text-label-lg shrink-0">${medals[i] || i + 1}</span>
        <img src="${a.avatar || "ohin1.png"}" alt="" class="w-10 h-10 rounded-full object-cover object-top shrink-0" />
        <span class="font-label-lg text-label-lg text-on-surface flex-1 min-w-0 truncate">${escapeHtml(a.nickname)}${isMe ? " (чи)" : ""}</span>
        <span class="font-label-lg text-label-lg text-primary-fixed shrink-0">${a.score}/${a.total}</span>
      </div>`;
    })
    .join("");
}

function shareResult() {
  const params = new URLSearchParams(location.search);
  if (params.get("demo") === "1") {
    shareLink(quizUrl("index.html", {}), { title: "Bestie 💗", text: "Намайг хэр сайн мэддэгээ сорь!" });
    return;
  }
  const code = params.get("code");
  const scoreText = document.getElementById("result-score").textContent;
  shareLink(quizUrl("play.html", { code }), {
    title: "Bestie 💗",
    text: `Би ${scoreText} оноо авлаа! Чи хэрхэн хариулах бол?`,
  });
}

document.addEventListener("DOMContentLoaded", init);
