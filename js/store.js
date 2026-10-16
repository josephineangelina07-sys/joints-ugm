// SENJA — local data store (offline-first, disimpan di perangkat pengguna)
//
// Semua data pengguna disimpan di localStorage browser. Tidak ada data
// yang dikirim ke server mana pun — sesuai janji privasi aplikasi.

(function () {
  const KEY_MOODS = "senja.moods"; // daftar catatan mood harian
  const KEY_SCREEN = "senja.screenings"; // riwayat hasil skrining

  // Skala mood 1 (terberat) .. 5 (paling cerah).
  const MOOD_SCALE = {
    berat: 1,
    kurang: 2,
    biasa: 3,
    baik: 4,
    cerah: 5,
  };

  const LABELS = {
    berat: "Berat",
    kurang: "Kurang baik",
    biasa: "Biasa",
    baik: "Baik",
    cerah: "Cerah",
  };

  const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      return [];
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  // ---------- Mood ----------
  function getMoods() {
    return read(KEY_MOODS);
  }

  function addMood({ mood, factors = [], note = "" }) {
    const entries = getMoods();
    const now = new Date();
    entries.push({
      id: now.getTime(),
      mood, // key: berat|kurang|biasa|baik|cerah
      value: MOOD_SCALE[mood] ?? 3,
      factors,
      note,
      date: now.toISOString(),
      dayName: DAY_NAMES[now.getDay()],
    });
    write(KEY_MOODS, entries);
    return entries;
  }

  // Ambil N catatan terakhir (paling baru di depan).
  function recentMoods(n = 5) {
    return getMoods().slice(-n).reverse();
  }

  // ---------- Skrining ----------
  function getScreenings() {
    return read(KEY_SCREEN);
  }

  function addScreening({ score, level, answers }) {
    const entries = getScreenings();
    entries.push({
      id: Date.now(),
      score,
      level,
      answers,
      date: new Date().toISOString(),
    });
    write(KEY_SCREEN, entries);
    return entries;
  }

  window.SENJA_STORE = {
    MOOD_SCALE,
    LABELS,
    DAY_NAMES,
    getMoods,
    addMood,
    recentMoods,
    getScreenings,
    addScreening,
  };
})();
