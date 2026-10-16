// Mood harian — pilih mood & faktor, simpan ke penyimpanan lokal,
// lalu tampilkan catatan terakhir.

SENJA.singleSelect("#moodMoods", ".mood");
SENJA.multiToggle("#factors", ".chip");

const saveBtn = document.getElementById("saveBtn");
const noteEl = document.getElementById("moodNote");
const recentList = document.getElementById("recentList");

// Format tanggal relatif sederhana (Hari ini / Kemarin / Nama hari).
function formatWhen(iso) {
  const d = new Date(iso);
  const today = new Date();
  const diffDays = Math.floor((today.setHours(0, 0, 0, 0) - new Date(iso).setHours(0, 0, 0, 0)) / 86400000);
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

// Cegah injeksi HTML dari catatan pengguna.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

saveBtn.addEventListener("click", () => {
  const activeMood = document.querySelector("#moodMoods .mood.active");
  const mood = activeMood?.getAttribute("data-mood") || "biasa";
  const factors = [...document.querySelectorAll("#factors .chip.active")].map(
    (c) => c.textContent.trim()
  );
  const note = noteEl.value.trim();

  SENJA_STORE.addMood({ mood, factors, note });

  // Reset catatan & segarkan daftar.
  noteEl.value = "";
  renderRecent();

  // Umpan balik singkat pada tombol.
  const original = saveBtn.textContent;
  saveBtn.textContent = "Tersimpan ✓";
  saveBtn.disabled = true;
  setTimeout(() => {
    saveBtn.textContent = original;
    saveBtn.disabled = false;
  }, 1400);
});

renderRecent();
