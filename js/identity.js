/*
 * Bestie — Нэг нэгдсэн "хэрэглэгчийн профайл" (nickname + avatar)
 * ---------------------------------------------------------------
 * Тест үүсгэхдээ (create.html) болон тест бөглөхдөө (play.html) ашигладаг
 * нэр/аватар ХООРОНДОО АДИЛХАН ганц профайл байх ёстой тул нэг газар
 * (localStorage, хугацаагүй — 7 хоногийн автомат устгал зөвхөн тестэнд
 * хамаарна, энэ профайлд хамаарахгүй) хадгалж, бүх хуудаснаас ашиглана.
 */
const IDENTITY_KEY = "bestie_identity_v1";

function genIdentityId() {
  return "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getIdentity() {
  try {
    const raw = localStorage.getItem(IDENTITY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function saveIdentity({ nickname, avatarId }) {
  const current = getIdentity() || { id: genIdentityId() };
  const updated = { id: current.id, nickname: nickname || current.nickname || "", avatarId: avatarId || current.avatarId || AVATAR_POOL[0].id };
  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(updated));
  } catch (err) {
    /* noop */
  }
  renderIdentityBadge();
  return updated;
}

function identityAvatar() {
  const idn = getIdentity();
  const found = idn && idn.avatarId ? AVATAR_POOL.find((a) => a.id === idn.avatarId) : null;
  return found || AVATAR_POOL[0];
}

/* ---------- Header badge + edit-profile bottom sheet (reusable) ---------- */
let _identityMounted = false;

function renderIdentityBadge() {
  const host = document.getElementById("identity-badge");
  if (!host) return;
  const idn = getIdentity();
  if (idn && idn.nickname) {
    const avatar = identityAvatar();
    host.innerHTML = `<button type="button" id="identity-badge-btn" class="flex items-center gap-1.5 pl-1 pr-3 py-1 rounded-full bg-surface-container active:scale-95 transition-transform">
      <img src="${avatar.src}" alt="" class="w-7 h-7 rounded-full object-cover object-top shrink-0" />
      <span class="font-label-sm text-label-sm text-on-surface max-w-[72px] min-w-0 truncate">${escapeHtml(idn.nickname)}</span>
    </button>`;
  } else {
    host.innerHTML = `<button type="button" id="identity-badge-btn" class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center active:scale-95 transition-transform" aria-label="Профайл тохируулах">
      <span class="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
    </button>`;
  }
  const btn = document.getElementById("identity-badge-btn");
  if (btn) btn.addEventListener("click", openIdentitySheet);
}

function ensureIdentitySheet() {
  if (document.getElementById("identity-sheet")) return;
  const wrap = document.createElement("div");
  wrap.id = "identity-sheet";
  wrap.className = "fixed inset-0 z-[70] hidden";
  wrap.innerHTML = `
    <div class="absolute inset-0 bg-black/60" onclick="closeIdentitySheet()"></div>
    <div class="absolute bottom-0 inset-x-0 bg-surface-container-low rounded-t-xl p-space-lg flex flex-col gap-3 max-h-[85vh] overflow-y-auto pb-safe">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-headline-md text-on-surface">Миний профайл</h2>
        <button onclick="closeIdentitySheet()" class="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">close</span></button>
      </div>
      <p class="font-body text-body-sm text-on-surface-variant -mt-1">Энэ нэр, аватараар чамайг найзууд болон өөрийн шинэ тестүүд дээр таних болно.</p>
      <div class="flex flex-col gap-2">
        <label class="font-label-md text-label-md text-on-surface-variant">Нэр</label>
        <input id="identity-name-input" maxlength="24" placeholder="Жишээ: Ану" class="w-full h-14 px-5 rounded bg-surface-container text-on-surface font-body text-body-lg placeholder:text-on-surface-variant/60 outline-none focus:ring-2 focus:ring-primary-fixed" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-label-md text-label-md text-on-surface-variant">Аватар</label>
        <div class="flex gap-2.5 overflow-x-auto pb-1" id="identity-avatar-grid"></div>
      </div>
      <button onclick="saveIdentitySheet()" class="w-full h-13 rounded-full bg-primary-fixed text-on-primary-fixed font-label-lg text-label-lg mt-1">Хадгалах</button>
    </div>`;
  document.body.appendChild(wrap);
}

let _identitySheetAvatarId = null;

function renderIdentityAvatarGrid() {
  const host = document.getElementById("identity-avatar-grid");
  host.innerHTML = AVATAR_POOL.map(
    (a) => `<button type="button" data-id="${a.id}" class="identity-avatar-btn ${a.id === _identitySheetAvatarId ? "ring-[3px] ring-primary-fixed scale-105" : "ring-2 ring-transparent"} relative shrink-0 w-16 h-16 rounded-full overflow-hidden bg-surface-container transition-all">
      <img src="${a.src}" alt="" class="w-full h-full object-cover object-top" />
    </button>`
  ).join("");
  host.querySelectorAll(".identity-avatar-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      _identitySheetAvatarId = btn.dataset.id;
      renderIdentityAvatarGrid();
    });
  });
}

function openIdentitySheet() {
  ensureIdentitySheet();
  const idn = getIdentity();
  _identitySheetAvatarId = (idn && idn.avatarId) || AVATAR_POOL[0].id;
  document.getElementById("identity-name-input").value = idn ? idn.nickname || "" : "";
  renderIdentityAvatarGrid();
  document.getElementById("identity-sheet").classList.remove("hidden");
}

function closeIdentitySheet() {
  const sheet = document.getElementById("identity-sheet");
  if (sheet) sheet.classList.add("hidden");
}

function saveIdentitySheet() {
  const name = document.getElementById("identity-name-input").value.trim();
  if (!name) {
    showToast("Нэрээ оруулна уу");
    return;
  }
  saveIdentity({ nickname: name, avatarId: _identitySheetAvatarId });
  closeIdentitySheet();
  showToast("Профайл хадгалагдлаа ✅");
}

function mountIdentityWidget() {
  if (_identityMounted) return;
  _identityMounted = true;
  renderIdentityBadge();
}
