(function markActiveNav() {
  const page = document.body.getAttribute("data-page");
  if (!page) return;
  document.querySelectorAll(".nav a").forEach((a) => {
    if (a.getAttribute("data-nav") === page) a.classList.add("active");
  });
})();

function singleSelect(containerSelector, itemSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const items = container.querySelectorAll(itemSelector);
  items.forEach((item) => {
    item.addEventListener("click", () => {
      items.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

function multiToggle(containerSelector, itemSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll(itemSelector).forEach((item) => {
    item.addEventListener("click", () => item.classList.toggle("active"));
  });
}

window.SENJA = { singleSelect, multiToggle };

(function responsiveNav() {
  const sidebar = document.querySelector(".sidebar");
  const app = document.querySelector(".app");
  if (!sidebar || !app) return;

  const topbar = document.createElement("div");
  topbar.className = "topbar";
  topbar.innerHTML = `
    <button class="hamburger" id="menuToggle" aria-label="Buka menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <span class="topbar-brand">SENJA</span>`;
  app.parentNode.insertBefore(topbar, app);

  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  document.body.appendChild(overlay);

  const toggleBtn = topbar.querySelector("#menuToggle");

  function openMenu() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
    document.body.classList.add("nav-open");
    toggleBtn.setAttribute("aria-expanded", "true");
    toggleBtn.setAttribute("aria-label", "Tutup menu");
  }
  function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    document.body.classList.remove("nav-open");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-label", "Buka menu");
  }

  toggleBtn.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) closeMenu();
    else openMenu();
  });
  overlay.addEventListener("click", closeMenu);
  sidebar.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();
