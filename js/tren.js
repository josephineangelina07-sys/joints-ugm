// Tren — menggambar grafik garis mood 14 hari & batang rata-rata per hari.
// Membaca data mood asli dari penyimpanan lokal; jika kosong, memakai
// data contoh agar halaman tetap informatif.

// Data contoh (skala mood 1..5) saat pengguna belum punya catatan.
const SAMPLE_14 = [3, 3, 2, 1, 4, 4, 3, 2, 2, 2, 3, 4, 2, 1];
const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// Ambil nilai mood 14 hari terakhir dari store (jika ada).
function getMoodSeries() {
  const moods = window.SENJA_STORE ? SENJA_STORE.getMoods() : [];
  if (!moods.length) {
    return { values: SAMPLE_14.slice(), days: sampleDayLabels(), isSample: true };
  }
  const last = moods.slice(-14);
  return {
    values: last.map((m) => m.value),
    days: last.map((m) => DAYS_SHORT[new Date(m.date).getDay()]),
    isSample: false,
  };
}

// Label hari untuk 14 titik data contoh, berakhir di hari ini.
function sampleDayLabels() {
  const labels = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    labels.push(DAYS_SHORT[d.getDay()]);
  }
  return labels;
}

const series = getMoodSeries();
const data = series.values;

const W = 760, H = 300;
const padX = 20, padY = 24;
const innerW = W - padX * 2;
const innerH = H - padY * 2;

// Petakan nilai mood (1..5) dan indeks ke koordinat svg.
function x(i) {
  return data.length === 1 ? W / 2 : padX + (innerW * i) / (data.length - 1);
}
function y(v) { return padY + innerH * (1 - (v - 1) / 4); }

function renderLineChart() {
  const svg = document.getElementById("lineChart");
  if (!svg) return;
  svg.innerHTML = "";
  const ns = "http://www.w3.org/2000/svg";

  // Garis
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

  // Titik — puncak (nilai >= 4) diberi warna amber.
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
  el.innerHTML = series.days.map((d) => `<span>${d}</span>`).join("");
}

// Rata-rata mood per hari dalam seminggu (Sen..Min).
function renderBars() {
  const el = document.getElementById("bars");
  if (!el) return;

  let avg;
  if (series.isSample) {
    avg = [1.5, 3, 3.2, 3.5, 4, 4.3, 4]; // contoh
  } else {
    // Hitung dari data asli, urut Senin..Minggu.
    const moods = SENJA_STORE.getMoods();
    const buckets = Array.from({ length: 7 }, () => []);
    moods.forEach((m) => {
      const jsDay = new Date(m.date).getDay(); // 0=Min..6=Sab
      const idx = jsDay === 0 ? 6 : jsDay - 1; // 0=Sen..6=Min
      buckets[idx].push(m.value);
    });
    avg = buckets.map((b) => (b.length ? b.reduce((s, v) => s + v, 0) / b.length : 0));
  }

  const max = 5;
  // Puncak = hari dengan rata-rata tertinggi.
  const peakIdx = avg.indexOf(Math.max(...avg));
  el.innerHTML = avg
    .map((v, i) => {
      const h = Math.round((v / max) * 100);
      const peak = v > 0 && i === peakIdx;
      return `<div class="bar${peak ? " peak" : ""}" style="height:${h}%"></div>`;
    })
    .join("");
}

renderLineChart();
renderXLabels();
renderBars();
