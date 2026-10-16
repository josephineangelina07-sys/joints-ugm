// Skrining — alur 10 pertanyaan yang digerakkan oleh data.

const QUESTIONS = [
  { text: "Dalam 2 minggu terakhir, seberapa sulit kamu merasa rileks?",
    options: ["Tidak sama sekali", "Beberapa hari", "Lebih dari separuh hari", "Hampir setiap hari"] },
  { text: "Seberapa sering kamu merasa cemas atau khawatir berlebihan?",
    options: ["Tidak sama sekali", "Beberapa hari", "Lebih dari separuh hari", "Hampir setiap hari"] },
  { text: "Dalam 2 minggu terakhir, seberapa sering kamu merasa lelah atau kurang berenergi?",
    options: ["Tidak sama sekali", "Beberapa hari", "Lebih dari separuh hari", "Hampir setiap hari"] },
  { text: "Seberapa sering kamu kehilangan minat pada hal yang biasanya menyenangkan?",
    options: ["Tidak sama sekali", "Beberapa hari", "Lebih dari separuh hari", "Hampir setiap hari"] },
  { text: "Seberapa sering kamu sulit tidur atau tidur terlalu banyak?",
    options: ["Tidak sama sekali", "Beberapa hari", "Lebih dari separuh hari", "Hampir setiap hari"] },
  { text: "Seberapa sering kamu merasa mudah tersinggung atau marah?",
    options: ["Tidak sama sekali", "Beberapa hari", "Lebih dari separuh hari", "Hampir setiap hari"] },
  { text: "Seberapa sering kamu sulit berkonsentrasi pada tugas?",
    options: ["Tidak sama sekali", "Beberapa hari", "Lebih dari separuh hari", "Hampir setiap hari"] },
  { text: "Seberapa sering kamu merasa gelisah dan sulit untuk diam?",
    options: ["Tidak sama sekali", "Beberapa hari", "Lebih dari separuh hari", "Hampir setiap hari"] },
  { text: "Seberapa sering kamu merasa putus asa tentang masa depan?",
    options: ["Tidak sama sekali", "Beberapa hari", "Lebih dari separuh hari", "Hampir setiap hari"] },
  { text: "Seberapa sering kamu merasa tidak berharga?",
    options: ["Tidak sama sekali", "Beberapa hari", "Lebih dari separuh hari", "Hampir setiap hari"] },
];

// Teks hasil per tingkat.
const LEVEL_INFO = {
  Rendah: {
    title: "Tingkat: Rendah",
    desc: "Kondisimu tampak cukup stabil saat ini. Tetap rawat dirimu dengan istirahat cukup dan hal-hal yang kamu sukai.",
  },
  Sedang: {
    title: "Tingkat: Sedang",
    desc: "Ada beberapa tanda tekanan. Coba beri ruang untuk jeda, dan pertimbangkan berbicara dengan orang yang kamu percaya.",
  },
  Tinggi: {
    title: "Tingkat: Tinggi",
    desc: "Kamu tampak sedang memikul banyak hal. Kamu tidak sendirian — mempertimbangkan bantuan profesional bisa sangat membantu.",
  },
};

const answers = new Array(QUESTIONS.length).fill(null);
let current = 0;

const stepEl = document.getElementById("qStep");
const barEl = document.getElementById("progressBar");
const qTextEl = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const questionCard = document.getElementById("questionCard");
const resultCard = document.getElementById("resultCard");

function render() {
  const q = QUESTIONS[current];
  stepEl.textContent = `Skrining · Pertanyaan ${current + 1} / ${QUESTIONS.length}`;
  barEl.style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;
  qTextEl.textContent = q.text;

  optionsEl.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option" + (answers[current] === i ? " active" : "");
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      answers[current] = i;
      render();
    });
    optionsEl.appendChild(btn);
  });

  backBtn.disabled = current === 0;
  backBtn.style.opacity = current === 0 ? "0.5" : "1";

  const isLast = current === QUESTIONS.length - 1;
  nextBtn.textContent = isLast ? "Selesai" : "Lanjut";
  // Tombol lanjut nonaktif sampai pertanyaan dijawab.
  const answered = answers[current] !== null;
  nextBtn.disabled = !answered;
  nextBtn.style.opacity = answered ? "1" : "0.5";
}

function finish() {
  const score = answers.reduce((s, a) => s + (a ?? 0), 0);
  const level = score <= 10 ? "Rendah" : score <= 20 ? "Sedang" : "Tinggi";

  // Simpan hasil ke penyimpanan lokal.
  if (window.SENJA_STORE) {
    window.SENJA_STORE.addScreening({ score, level, answers: [...answers] });
  }

  const info = LEVEL_INFO[level];
  const maxScore = QUESTIONS.length * 3; // 30

  // Tampilkan hasil menggantikan kartu pertanyaan.
  questionCard.innerHTML = `
    <div class="result">
      <div class="eyebrow">Skrining selesai</div>
      <div class="result-score">
        <span class="score-num">${score}</span>
        <span class="score-max">/ ${maxScore}</span>
      </div>
      <h2 class="result-level level-${level.toLowerCase()}">${info.title}</h2>
      <p class="muted">${info.desc}</p>
      <p class="small muted" style="margin-top:14px">
        Ini <strong>bukan diagnosis</strong>, hanya langkah awal mengenali dirimu.
        Hasil tersimpan privat di perangkatmu.
      </p>
      <div class="row" style="margin-top:22px; flex-wrap:wrap">
        <button class="btn btn-primary" id="retakeBtn">Ulangi skrining</button>
        <a class="btn btn-ghost" href="mood.html">Catat mood</a>
        <a class="btn btn-muted" href="index.html">Kembali ke Beranda</a>
      </div>
    </div>`;

  // Perbarui panel samping jadi ringkasan singkat.
  if (resultCard) {
    resultCard.innerHTML = `
      <h2>Ringkasan</h2>
      <p class="muted">Skor kamu: <strong>${score} / ${maxScore}</strong></p>
      <div class="row" style="flex-wrap:wrap; margin:14px 0 18px;">
        <span class="chip-static">${level}</span>
      </div>
      <p class="muted">Jawabanmu privat dan tersimpan hanya di perangkatmu.</p>`;
  }

  document.getElementById("retakeBtn").addEventListener("click", () => {
    location.reload();
  });
}

backBtn.addEventListener("click", () => {
  if (current > 0) { current--; render(); }
});

nextBtn.addEventListener("click", () => {
  if (answers[current] === null) return; // belum dijawab
  if (current < QUESTIONS.length - 1) {
    current++;
    render();
  } else {
    finish();
  }
});

render();
