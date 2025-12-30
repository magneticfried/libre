document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle")

  if (toggle) {
    toggle.addEventListener("click", toggleTheme)
  }

  setupObserver()
})

function toggleTheme() {
  // theme code
}

function setupObserver() {
  // intersectionobserver code
}
