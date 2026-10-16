(function () {
  const KEY_MOODS = "senja.moods";       
  const KEY_SCREEN = "senja.screenings"; 

  const MOOD_SCALE = { berat: 1, kurang: 2, biasa: 3, baik: 4, cerah: 5 };

  const LABELS = {
    berat: "Berat",
    kurang: "Kurang baik",
    biasa: "Biasa",
    baik: "Baik",
    cerah: "Cerah",
  };

  const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  function dayKey(d) {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

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

  function dedupeByDay(entries) {
    const byDay = new Map();
    entries.forEach((e) => {
      const k = dayKey(e.date);
      const prev = byDay.get(k);
      // Simpan yang paling baru untuk hari itu.
      if (!prev || new Date(e.date) >= new Date(prev.date)) {
        byDay.set(k, e);
      }
    });
    return [...byDay.values()].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  function getMoods() {
    const raw = read(KEY_MOODS);
    const clean = dedupeByDay(raw);
    if (clean.length !== raw.length) {
      write(KEY_MOODS, clean);
    }
    return clean;
  }

  function addMood({ mood, factors = [], note = "" }) {
    const entries = getMoods();
    const now = new Date();
    const todayKey = dayKey(now);

    const existing = entries.find((e) => dayKey(e.date) === todayKey);

    if (existing) {
      existing.mood = mood;
      existing.value = MOOD_SCALE[mood] ?? 3;
      existing.factors = factors;
      existing.note = note;
      existing.date = now.toISOString();
      existing.dayName = DAY_NAMES[now.getDay()];
      write(KEY_MOODS, entries);
      return { entries, updated: true };
    }

    entries.push({
      id: now.getTime(),
      mood,
      value: MOOD_SCALE[mood] ?? 3,
      factors,
      note,
      date: now.toISOString(),
      dayName: DAY_NAMES[now.getDay()],
    });
    write(KEY_MOODS, entries);
    return { entries, updated: false };
  }

  function getTodayMood() {
    const todayKey = dayKey(new Date());
    return getMoods().find((e) => dayKey(e.date) === todayKey) || null;
  }

  function recentMoods(n = 5) {
    return getMoods().slice(-n).reverse();
  }

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
    getTodayMood,
    recentMoods,
    getScreenings,
    addScreening,
  };
})();
