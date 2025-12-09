// Theme Management Script - Load this on every page

(function () {
  // Apply Theme Function
  function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === "light") {
      // Light theme colors
      root.style.setProperty("--bg-main", "#FFFFFF");
      root.style.setProperty("--bg-card", "#F9FAFB");
      root.style.setProperty("--bg-secondary", "#F3F4F6");
      root.style.setProperty("--border-color", "#E5E7EB");
      root.style.setProperty("--text-dark", "#111827");
      root.style.setProperty("--text-gray", "#6B7280");
      root.style.setProperty("--nav-bg", "#FFFFFF");
      root.style.setProperty("--nav-border", "#E5E7EB");
    } else if (theme === "dark") {
      // Dark theme colors (default)
      root.style.setProperty("--bg-main", "#0A0A0A");
      root.style.setProperty("--bg-card", "#1A1A1A");
      root.style.setProperty("--bg-secondary", "#212121");
      root.style.setProperty("--border-color", "#2A2A2A");
      root.style.setProperty("--text-dark", "#FFFFFF");
      root.style.setProperty("--text-gray", "#9CA3AF");
      root.style.setProperty("--nav-bg", "#000000");
      root.style.setProperty("--nav-border", "#FFD700");
    } else if (theme === "auto") {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(prefersDark ? "dark" : "light");

      // Listen for system theme changes
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          const savedTheme = localStorage.getItem("theme") || "dark";
          if (savedTheme === "auto") {
            applyTheme(e.matches ? "dark" : "light");
          }
        });
      return;
    }
  }

  // Load and apply theme immediately on page load
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  // Export to window for use in other scripts
  window.applyTheme = applyTheme;
})();
