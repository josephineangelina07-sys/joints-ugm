const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const DAY_FULL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const moods = window.SENJA_STORE ? SENJA_STORE.getMoods() : [];
const hasData = moods.length > 0;

const last = moods.slice(-14);
const data = last.map((m) => m.value);
const dayLabels = last.map((m) => DAYS_SHORT[new Date(m.date).getDay()]);

const W = 760, H = 300;
const padX = 0, padY = 24;
const innerW = W - padX * 2;
const innerH = H - padY * 2;

function xPct(i) {
  return data.length <= 1 ? 50 : (100 * i) / (data.length - 1);
}
function x(i) { return (xPct(i) / 100) * W; }
function y(v) { return padY + innerH * (1 - (v - 1) / 4); }

function emptyMessage(text) {
  return `<div class="empty-state">
      <span class="empty-ico">🌙</span>
      <p class="muted">${text}</p>
      <a href="mood.html" class="btn btn-primary">Catat mood pertamamu</a>
    </div>`;
}

function renderLineChart() {
  const card = document.getElementById("lineCard");
  const svg = document.getElementById("lineChart");
  if (!svg) return;

  if (!hasData) {
    if (card) {
      card.innerHTML =
        "<h2>Mood 14 hari terakhir</h2>" +
        emptyMessage("Belum ada data mood. Grafik akan muncul setelah kamu mulai mencatat suasana hatimu.");
    }
    return;
  }

  svg.innerHTML = "";
  const ns = "http://www.w3.org/2000/svg";

  if (data.length > 1) {
    let d = "";
    data.forEach((v, i) => { d += (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(v).toFixed(1) + " "; });
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", d.trim());
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#6d57c0");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);
  }

  data.forEach((v, i) => {
    const c = document.createElementNS(ns, "circle");
    c.setAttribute("cx", x(i));
    c.setAttribute("cy", y(v));
    c.setAttribute("r", "6");
    const peak = v >= 4;
    c.setAttribute("fill", peak ? "#f4c84a" : "#8f7fd4");
    c.setAttribute("stroke", "#fff");
    c.setAttribute("stroke-width", "2.5");
    svg.appendChild(c);
  });
}

function renderXLabels() {
  const el = document.getElementById("xLabels");
    if (!el) return;
  if (!hasData) { el.innerHTML = ""; return; }
  el.innerHTML = dayLabels
    .map((d, i) => `<span style="left:${xPct(i).toFixed(2)}%">${d}</span>`)
    .join("");
}

function weekdayAverages() {
  const buckets = Array.from({ length: 7 }, () => []);
  moods.forEach((m) => {
    const jsDay = new Date(m.date).getDay();
    const idx = jsDay === 0 ? 6 : jsDay - 1;
    buckets[idx].push(m.value);
  });
  return buckets.map((b) => (b.length ? b.reduce((s, v) => s + v, 0) / b.length : 0));
}

function renderBars() {
  const el = document.getElementById("bars");
  const card = document.getElementById("barCard");
  if (!el) return;

  if (!hasData) {
    if (card) {
      card.innerHTML =
        "<h2>Rata-rata per hari</h2>" +
        emptyMessage("Rata-rata harianmu akan tampil di sini begitu ada catatan.");
    }
    return;
  }

  const avg = weekdayAverages();
  const max = 5;
  const peakIdx = avg.indexOf(Math.max(...avg));
  el.innerHTML = avg
    .map((v, i) => {
      const h = Math.round((v / max) * 100);
      const peak = v > 0 && i === peakIdx;
      return `<div class="bar${peak ? " peak" : ""}" style="height:${h}%"></div>`;
    })
    .join("");
}

function renderInsight() {
  const card = document.getElementById("insightCard");
  if (!card) return;

  if (!hasData) {
    card.innerHTML = `
      <div class="eyebrow">Belum ada pola</div>
      <h3>Pola akan muncul seiring catatanmu</h3>
      <p class="muted">Catat suasana hatimu beberapa hari, dan SENJA akan membantu
        mengenali kapan kamu cenderung merasa lelah atau lebih baik.</p>
      <a href="mood.html" class="btn btn-primary">Mulai mencatat</a>`;
    return;
  }

  if (moods.length < 3) {
    card.innerHTML = `
      <div class="eyebrow">Mengumpulkan data</div>
      <h3>Sebentar lagi polamu terbaca</h3>
      <p class="muted">Kamu baru punya ${moods.length} catatan. Tambah beberapa lagi
        supaya SENJA bisa mengenali pola suasana hatimu.</p>
      <a href="mood.html" class="btn btn-primary">Catat lagi</a>`;
    return;
  }

  const avg = weekdayAverages();
  let lowIdx = -1, lowVal = Infinity;
  avg.forEach((v, i) => {
    if (v > 0 && v < lowVal) { lowVal = v; lowIdx = i; }
  });
  const lowDayName = DAY_FULL[(lowIdx + 1) % 7];

  card.innerHTML = `
    <div class="eyebrow">Pola ditemukan</div>
    <h3>Moodmu cenderung paling berat di hari ${lowDayName}</h3>
    <p class="muted">Coba sisihkan waktu istirahat ekstra menjelang hari ${lowDayName},
      dan perhatikan apa yang biasanya membuatmu lelah di hari itu.</p>`;
}

renderLineChart();
renderXLabels();
renderBars();
renderInsight();
