SENJA.singleSelect("#moodMoods", ".mood");
SENJA.multiToggle("#factors", ".chip");

const saveBtn = document.getElementById("saveBtn");
const noteEl = document.getElementById("moodNote");
const recentList = document.getElementById("recentList");

const hintEl = document.createElement("p");
hintEl.className = "today-hint small muted";
saveBtn.insertAdjacentElement("beforebegin", hintEl);

function formatWhen(iso) {
  const d = new Date(iso);
  const today = new Date();
  const diffDays = Math.floor(
    (today.setHours(0, 0, 0, 0) - new Date(iso).setHours(0, 0, 0, 0)) / 86400000
  );
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  return SENJA_STORE.DAY_NAMES[d.getDay()];
}

function renderRecent() {
  const items = SENJA_STORE.recentMoods(5);
  if (!items.length) {
    recentList.innerHTML =
      '<p class="muted small">Belum ada catatan. Mood yang kamu simpan akan muncul di sini.</p>';
    return;
  }
  recentList.innerHTML = items
    .map((it) => {
      const label = SENJA_STORE.LABELS[it.mood] || it.mood;
      const note = it.note
        ? `<p class="muted">${escapeHtml(it.note)}</p>`
        : '<p class="muted">—</p>';
      return `<div class="recent-item">
        <strong>${formatWhen(it.date)} · ${label}</strong>
        ${note}
      </div>`;
    })
    .join("");
}

function applyEntryToForm(entry) {
  document.querySelectorAll("#moodMoods .mood").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-mood") === entry.mood);
  });
  document.querySelectorAll("#factors .chip").forEach((chip) => {
    chip.classList.toggle("active", entry.factors.includes(chip.textContent.trim()));
  });
  noteEl.value = entry.note || "";
}

function refreshTodayState() {
  const today = SENJA_STORE.getTodayMood();
  if (today) {
    const label = SENJA_STORE.LABELS[today.mood] || today.mood;
    hintEl.textContent = `Kamu sudah mengisi mood hari ini (${label}). Menyimpan lagi akan memperbarui catatan ini.`;
    saveBtn.textContent = "Perbarui";
  } else {
    hintEl.textContent = "Belum ada catatan untuk hari ini.";
    saveBtn.textContent = "Simpan";
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;");
}

saveBtn.addEventListener("click", () => {
  const activeMood = document.querySelector("#moodMoods .mood.active");
  const mood = activeMood?.getAttribute("data-mood") || "biasa";
  const factors = [...document.querySelectorAll("#factors .chip.active")].map(
    (c) => c.textContent.trim()
  );
  const note = noteEl.value.trim();

  const { updated } = SENJA_STORE.addMood({ mood, factors, note });

  renderRecent();
  refreshTodayState();

  saveBtn.disabled = true;
  saveBtn.textContent = updated ? "Diperbarui ✓" : "Tersimpan ✓";
  setTimeout(() => {
    saveBtn.disabled = false;
    refreshTodayState();
  }, 1400);
});

const todayEntry = SENJA_STORE.getTodayMood();
if (todayEntry) applyEntryToForm(todayEntry);
refreshTodayState();
renderRecent();
