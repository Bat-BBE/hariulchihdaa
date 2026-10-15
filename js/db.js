/*
 * Bestie — Өгөгдлийн давхарга (localStorage + сонголтоор Firebase Realtime DB)
 * Бүх тест/хариулт энэ төхөөрөмжийн localStorage-д хадгалагдана.
 * Хэрэв js/firebase-config.js дотор ENABLED:true бол Realtime Database руу
 * давхар бичиж, өөр төхөөрөмжөөс ч уншиж чадна (найз нар өөр утаснаас
 * хариулахад шаардлагатай).
 * Тестүүд үүсгэгдсэнээс хойш 7 хоногийн дараа автоматаар устгагдана.
 */
const DB = (() => {
  const LOCAL_KEY = "bestie_db_v1";
  const MINE_KEY = "bestie_my_quizzes_v1";
  const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 хоног

  let fbApp = null;
  let fbDb = null;
  let fbReady = false;

  function tryInitFirebase() {
    if (fbReady) return;
    fbReady = true;
    try {
      if (
        typeof BESTIE_FIREBASE_CONFIG === "undefined" ||
        !BESTIE_FIREBASE_CONFIG.ENABLED
      ) {
        console.log(
          "[Bestie] Firebase унтраалттай (ENABLED:false) — зөвхөн localStorage ашиглана.",
        );
        return;
      }
      if (
        !BESTIE_FIREBASE_CONFIG.apiKey ||
        !BESTIE_FIREBASE_CONFIG.databaseURL
      ) {
        console.log(
          "[Bestie] Firebase config дутуу (apiKey/databaseURL алга) — localStorage ашиглана.",
        );
        return;
      }
      if (typeof firebase === "undefined") {
        console.warn(
          "[Bestie] Firebase SDK ачаалагдаагүй байна (сүлжээ блоклогдсон байж магадгүй) — localStorage ашиглана.",
        );
        return;
      }
      fbApp = firebase.initializeApp(BESTIE_FIREBASE_CONFIG);
      fbDb = firebase.database();
      console.log(
        "[Bestie] Firebase холбогдлоо ✅ — тест бусад browser-оос ч харагдана.",
      );
    } catch (err) {
      console.warn(
        "[Bestie] Firebase ажиллахгүй байна, localStorage ашиглаж байна.",
        err,
      );
      fbDb = null;
    }
  }

  function isRemoteEnabled() {
    tryInitFirebase();
    return !!fbDb;
  }

  function readLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : { quizzes: {} };
    } catch (err) {
      return { quizzes: {} };
    }
  }

  function writeLocal(data) {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn("[Bestie] localStorage бичихэд алдаа гарлаа", err);
    }
  }

  function readMine() {
    try {
      const raw = localStorage.getItem(MINE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function writeMine(list) {
    try {
      localStorage.setItem(MINE_KEY, JSON.stringify(list));
    } catch (err) {
      /* noop */
    }
  }

  function rememberMine(quiz) {
    const list = readMine().filter((q) => q.code !== quiz.code);
    list.unshift({
      code: quiz.code,
      token: quiz.ownerToken,
      title: quiz.title,
      emoji: quiz.emoji,
      createdAt: quiz.createdAt,
    });
    writeMine(list);
  }

  function purgeExpired() {
    const data = readLocal();
    const now = Date.now();
    let changed = false;
    Object.keys(data.quizzes).forEach((code) => {
      const q = data.quizzes[code];
      if (q.expiresAt && q.expiresAt < now) {
        delete data.quizzes[code];
        changed = true;
      }
    });
    if (changed) writeLocal(data);
    const mine = readMine().filter((q) => {
      const full = data.quizzes[q.code];
      return !q.createdAt || now - q.createdAt < EXPIRY_MS;
    });
    writeMine(mine);
  }

  function genCode(len = 6) {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789";
    let out = "";
    for (let i = 0; i < len; i++)
      out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  function genToken() {
    return genCode(8) + genCode(8) + Date.now().toString(36);
  }

  function saveQuizLocal(quiz) {
    const data = readLocal();
    data.quizzes[quiz.code] = quiz;
    writeLocal(data);
  }

  function getQuizLocal(code) {
    const data = readLocal();
    return data.quizzes[code] || null;
  }

  function pushRemote(quiz) {
    if (!isRemoteEnabled()) return Promise.resolve();
    return fbDb
      .ref("quizzes/" + quiz.code)
      .set(quiz)
      .catch((err) => console.warn("[Bestie] Firebase бичилт амжилтгүй", err));
  }

  function fetchRemote(code) {
    if (!isRemoteEnabled()) return Promise.resolve(null);
    return fbDb
      .ref("quizzes/" + code)
      .get()
      .then((snap) => (snap.exists() ? snap.val() : null))
      .catch((err) => {
        console.warn("[Bestie] Firebase унших амжилтгүй", err);
        return null;
      });
  }

  async function createQuiz({
    title,
    emoji,
    creatorName,
    creatorAvatar,
    questions,
    showRanking = true,
  }) {
    const now = Date.now();
    const code = genCode();
    const quiz = {
      code,
      title: title && title.trim() ? title.trim() : "Намайг хэр сайн мэдэх вэ?",
      emoji: emoji || "💗",
      creatorName:
        creatorName && creatorName.trim() ? creatorName.trim() : "Нэргүй найз",
      creatorAvatar: creatorAvatar || "ohin1.png",
      ownerToken: genToken(),
      createdAt: now,
      expiresAt: now + EXPIRY_MS,
      isOpen: true,
      showRanking,
      questions: questions.map((q, i) => ({
        id: q.id || "c" + i,
        emoji: q.emoji || "💭",
        text: q.text,
        options: q.options,
        correctOptionId: q.correctOptionId,
      })),
      attempts: [],
    };
    saveQuizLocal(quiz);
    rememberMine(quiz);
    await pushRemote(quiz);
    return quiz;
  }

  async function getQuiz(code) {
    const local = getQuizLocal(code);
    if (isRemoteEnabled()) {
      const remote = await fetchRemote(code);
      if (remote) {
        saveQuizLocal(remote);
        return remote;
      }
    }
    return local;
  }

  async function addAttempt(code, { nickname, avatar, answers, durationMs }) {
    const quiz = await getQuiz(code);
    if (!quiz) throw new Error("Тест олдсонгүй");
    let score = 0;
    const gradedAnswers = answers.map((a) => {
      const q = quiz.questions.find((qq) => qq.id === a.questionId);
      const correct = q && q.correctOptionId === a.optionId;
      if (correct) score++;
      return {
        questionId: a.questionId,
        optionId: a.optionId,
        correct: !!correct,
      };
    });
    const attempt = {
      id: genCode(10),
      nickname: nickname && nickname.trim() ? nickname.trim() : "Нэргүй найз",
      avatar: avatar || "💗",
      score,
      total: quiz.questions.length,
      durationMs: durationMs || 0,
      answers: gradedAnswers,
      createdAt: Date.now(),
    };
    quiz.attempts = quiz.attempts || [];
    quiz.attempts.push(attempt);
    saveQuizLocal(quiz);
    await pushRemote(quiz);
    return { quiz, attempt };
  }

  async function closeQuiz(code, token, isOpen) {
    const quiz = await getQuiz(code);
    if (!quiz || quiz.ownerToken !== token)
      throw new Error("Эрх хүрэлцэхгүй байна");
    quiz.isOpen = isOpen;
    saveQuizLocal(quiz);
    await pushRemote(quiz);
    return quiz;
  }

  async function toggleRanking(code, token, showRanking) {
    const quiz = await getQuiz(code);
    if (!quiz || quiz.ownerToken !== token)
      throw new Error("Эрх хүрэлцэхгүй байна");
    quiz.showRanking = showRanking;
    saveQuizLocal(quiz);
    await pushRemote(quiz);
    return quiz;
  }

  async function deleteQuiz(code, token) {
    const quiz = await getQuiz(code);
    if (!quiz || quiz.ownerToken !== token)
      throw new Error("Эрх хүрэлцэхгүй байна");
    const data = readLocal();
    delete data.quizzes[code];
    writeLocal(data);
    writeMine(readMine().filter((q) => q.code !== code));
    if (isRemoteEnabled()) {
      await fbDb
        .ref("quizzes/" + code)
        .remove()
        .catch(() => {});
    }
  }

  function myQuizzes() {
    return readMine();
  }

  /* ---------- Match (Таарал) тест — хоёр хүн тус бүрийн тухай хариулж,
     хариултууд хэр таарч байгааг харьцуулдаг горим. ---------- */
  async function createMatchQuiz({
    category,
    creatorName,
    creatorAvatar,
    answers,
  }) {
    const now = Date.now();
    const code = genCode();
    const bankQuestions =
      (typeof MATCH_QUESTION_BANK !== "undefined"
        ? MATCH_QUESTION_BANK[category]
        : []) || [];
    const cat = (typeof MATCH_CATEGORIES !== "undefined"
      ? MATCH_CATEGORIES.find((c) => c.id === category)
      : null) || { label: "Тохирол асуулт", emoji: "💞" };
    const name =
      creatorName && creatorName.trim() ? creatorName.trim() : "Нэргүй найз";
    const quiz = {
      code,
      type: "match",
      category,
      title: cat.label,
      emoji: cat.emoji,
      creatorName: name,
      creatorAvatar: creatorAvatar || "ohin1.png",
      ownerToken: genToken(),
      createdAt: now,
      expiresAt: now + EXPIRY_MS,
      questions: bankQuestions.map((q) => ({
        id: q.id,
        emoji: q.emoji || "💭",
        text: q.text,
        options: q.options,
      })),
      participantA: {
        nickname: name,
        avatar: creatorAvatar || "ohin1.png",
        answers,
        completedAt: now,
      },
      participantB: null,
    };
    saveQuizLocal(quiz);
    rememberMine(quiz);
    await pushRemote(quiz);
    return quiz;
  }

  async function submitMatchAnswer(code, { nickname, avatar, answers }) {
    const quiz = await getQuiz(code);
    if (!quiz || quiz.type !== "match") throw new Error("Тест олдсонгүй");
    if (quiz.participantB)
      throw new Error("Энэ тестийг аль хэдийн бөглөсөн байна");
    let matchCount = 0;
    quiz.questions.forEach((q) => {
      const aAns = quiz.participantA.answers.find((a) => a.questionId === q.id);
      const bAns = answers.find((a) => a.questionId === q.id);
      if (aAns && bAns && aAns.optionId === bAns.optionId) matchCount++;
    });
    quiz.participantB = {
      nickname: nickname && nickname.trim() ? nickname.trim() : "Нэргүй найз",
      avatar: avatar || "ohin1.png",
      answers,
      completedAt: Date.now(),
    };
    quiz.matchScore = quiz.questions.length
      ? Math.round((matchCount / quiz.questions.length) * 100)
      : 0;
    saveQuizLocal(quiz);
    await pushRemote(quiz);
    return quiz;
  }

  purgeExpired();

  return {
    isRemoteEnabled,
    createQuiz,
    getQuiz,
    addAttempt,
    closeQuiz,
    toggleRanking,
    deleteQuiz,
    myQuizzes,
    createMatchQuiz,
    submitMatchAnswer,
    genCode,
    EXPIRY_MS,
  };
})();
