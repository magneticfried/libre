/* Centralized common scripts: theme toggle + reveal observer */
(function () {
  function applySavedTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") document.documentElement.classList.add("dark-mode");
    else if (saved === "light") document.documentElement.classList.remove("dark-mode");
  }

  function syncToggleState(toggle) {
    if (!toggle) return;
    const isDark = document.documentElement.classList.contains("dark-mode");
    toggle.checked = isDark;
    toggle.setAttribute("aria-checked", isDark.toString());
  }

  function toggleThemeHandler(e) {
    const isDark = e.target.checked;
    document.documentElement.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    e.target.setAttribute("aria-checked", isDark.toString());
  }

  function setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Keep a small inline pre-check in each page to avoid FOUC.
    // Here we enforce stored preference and wire up controls.
    applySavedTheme();

    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      syncToggleState(toggle);
      toggle.addEventListener("change", toggleThemeHandler);
    }

    setupObserver();
  });

  // When navigating via back/forward, some browsers restore DOM from bfcache
  // without firing DOMContentLoaded. Use `pageshow` to re-sync UI state.
  window.addEventListener("pageshow", (ev) => {
    applySavedTheme();
    const toggle = document.getElementById("themeToggle");
    if (toggle) syncToggleState(toggle);
  });
})();
