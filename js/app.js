// SENJA — shared behavior

// Highlight the active nav link based on the current page.
(function markActiveNav() {
  const page = document.body.getAttribute("data-page");
  if (!page) return;
  document.querySelectorAll(".nav a").forEach((a) => {
    if (a.getAttribute("data-nav") === page) a.classList.add("active");
  });
})();

// Generic single-select helper: within a container, clicking one item
// activates it and deactivates its siblings.
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

// Multi-toggle helper: clicking toggles active on each item independently.
function multiToggle(containerSelector, itemSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll(itemSelector).forEach((item) => {
    item.addEventListener("click", () => item.classList.toggle("active"));
  });
}

window.SENJA = { singleSelect, multiToggle };
