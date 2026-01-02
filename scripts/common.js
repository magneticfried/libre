/* Centralized common scripts: theme toggle + reveal observer */
(function () {
  // avoid initial slider animation until we sync the checked state
  document.documentElement.classList.add("no-toggle-transition");
  function safeGetItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      // ignore (e.g. incognito)
    }
  }

  function applySavedTheme() {
    const saved = safeGetItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }

  // Apply immediately to prevent flash
  applySavedTheme();

  function syncToggleState(toggle) {
    if (!toggle) return;
    const isDark = document.documentElement.classList.contains("dark-mode");
    toggle.checked = isDark;
    toggle.setAttribute("aria-checked", isDark.toString());
  }

  function toggleThemeHandler(e) {
    const input = e.currentTarget || e.target;
    const isDark = !!input.checked;
    document.documentElement.classList.toggle("dark-mode", isDark);
    safeSetItem("theme", isDark ? "dark" : "light");
    input.setAttribute("aria-checked", isDark.toString());
  }

  function setupObserver() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // reveal without animation when user prefers reduced motion
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("active"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    // enforce stored preference and wire up controls
    applySavedTheme();

    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      if (!toggle.hasAttribute("aria-label") && !toggle.hasAttribute("aria-labelledby")) {
        toggle.setAttribute("aria-label", "Toggle dark mode");
      }
      if (!toggle.hasAttribute("role")) toggle.setAttribute("role", "switch");

      syncToggleState(toggle);
      // remove temporary class after browser paints with synced state
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.documentElement.classList.remove("no-toggle-transition");
        }, 50);
      });
      toggle.addEventListener("change", toggleThemeHandler);

      toggle.addEventListener("keyup", () => toggle.classList.add("keyboard-focus"));
      toggle.addEventListener("blur", () => toggle.classList.remove("keyboard-focus"));
    }

    setupObserver();
  });

  // pageshow handles bfcache restores
  window.addEventListener("pageshow", () => {
    applySavedTheme();
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      syncToggleState(toggle);
    }
    // remove no-toggle-transition after syncing (bfcache restores)
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.documentElement.classList.remove("no-toggle-transition");
      }, 50);
    });
  });
})();