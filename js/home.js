SENJA.singleSelect("#homeMoods", ".mood");

(function breathingExercise() {
  const btn = document.getElementById("breathBtn");
  const dot = document.getElementById("breathDot");
  const label = document.getElementById("breathLabel");
  const box = document.getElementById("breathBox");
  if (!btn || !dot || !label) return;

  const PHASES = [
    { name: "Tarik napas…", cls: "inhale", secs: 4 },
    { name: "Tahan…", cls: "hold", secs: 4 },
    { name: "Hembuskan…", cls: "exhale", secs: 4 },
  ];
  const TOTAL_SECONDS = 60; // 1 menit

  let running = false;
  let tickTimer = null;
  let phaseIndex = 0;
  let secsLeftInPhase = 0;
  let totalLeft = 0;

  const defaultLabel = "4 Detik Tarik • 4 Detik Tahan • 4 Detik Hembuskan";

  function setPhase(i) {
    phaseIndex = i;
    const phase = PHASES[i];
    secsLeftInPhase = phase.secs;
    dot.classList.remove("inhale", "hold", "exhale");
    dot.classList.add(phase.cls);
    updateLabel();
  }

  function updateLabel() {
    const phase = PHASES[phaseIndex];
    label.textContent = `${phase.name} ${secsLeftInPhase}  ·  sisa ${totalLeft} dtk`;
  }

  function stop() {
    running = false;
    clearInterval(tickTimer);
    tickTimer = null;
    dot.classList.remove("inhale", "hold", "exhale");
    label.textContent = defaultLabel;
    btn.textContent = "Mulai 1 Menit";
    box?.classList.remove("active");
  }

  function tick() {
    totalLeft -= 1;
    secsLeftInPhase -= 1;

    if (totalLeft <= 0) {
      label.textContent = "Selesai 🌙 Semoga lebih tenang.";
      running = false;
      clearInterval(tickTimer);
      tickTimer = null;
      dot.classList.remove("inhale", "hold", "exhale");
      btn.textContent = "Mulai lagi";
      box?.classList.remove("active");
      return;
    }

    if (secsLeftInPhase <= 0) {
      setPhase((phaseIndex + 1) % PHASES.length);
    } else {
      updateLabel();
    }
  }

  function start() {
    running = true;
    totalLeft = TOTAL_SECONDS;
    btn.textContent = "Hentikan";
    box?.classList.add("active");
    setPhase(0);
    tickTimer = setInterval(tick, 1000);
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (running) stop();
    else start();
  });
})();
