// Notifications Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn");
  const notifications = document.querySelectorAll(".notification-item");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;

      // Update active tab
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter notifications
      filterNotifications(tab);
    });
  });

  // Filter notifications by tab
  function filterNotifications(tab) {
    const emptyState = document.getElementById("empty-notifications");
    let visibleCount = 0;

    notifications.forEach((notification) => {
      let show = true;

      if (tab === "unread") {
        show = notification.classList.contains("unread");
      } else if (tab === "lottery") {
        const badge = notification.querySelector(".notification-badge");
        show = badge && badge.textContent.includes("XỔ SỐ");
      } else if (tab === "system") {
        const badge = notification.querySelector(".notification-badge");
        show = badge && badge.classList.contains("system");
      }
      // tab === 'all' shows everything

      notification.style.display = show ? "grid" : "none";
      if (show) visibleCount++;
    });

    // Show empty state if no notifications
    if (visibleCount === 0) {
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
    }
  }

  // Mark all as read
  const markAllReadBtn = document.getElementById("mark-all-read");
  markAllReadBtn.addEventListener("click", () => {
    notifications.forEach((notification) => {
      notification.classList.remove("unread");
    });

    // Update unread badge
    const unreadTab = document.querySelector('[data-tab="unread"]');
    const badge = unreadTab.querySelector(".badge");
    if (badge) {
      badge.textContent = "0";
    }

    // Show toast
    showToast("Đã đánh dấu tất cả thông báo là đã đọc", "success");
  });

  // Close notification
  const closeBtns = document.querySelectorAll(".btn-notification-close");
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const notification = e.target.closest(".notification-item");
      notification.style.animation = "slideOut 0.3s ease";

      setTimeout(() => {
        notification.remove();
        updateBadgeCounts();

        // Check if all notifications are removed
        const remaining =
          document.querySelectorAll(".notification-item").length;
        if (remaining === 0) {
          document
            .getElementById("empty-notifications")
            .classList.remove("hidden");
        }
      }, 300);
    });
  });

  // Update badge counts
  function updateBadgeCounts() {
    const allCount = document.querySelectorAll(".notification-item").length;
    const unreadCount = document.querySelectorAll(
      ".notification-item.unread"
    ).length;

    const allBadge = document.querySelector('[data-tab="all"] .badge');
    const unreadBadge = document.querySelector('[data-tab="unread"] .badge');

    if (allBadge) allBadge.textContent = allCount;
    if (unreadBadge) unreadBadge.textContent = unreadCount;
  }

  // Mark as read on click
  notifications.forEach((notification) => {
    notification.addEventListener("click", (e) => {
      // Don't mark as read if clicking close button
      if (e.target.classList.contains("btn-notification-close")) return;

      if (notification.classList.contains("unread")) {
        notification.classList.remove("unread");
        updateBadgeCounts();
      }
    });
  });

  // Toast notification
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === "success" ? "✓" : "ℹ"}</span>
      <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("toast-show"), 100);

    setTimeout(() => {
      toast.classList.remove("toast-show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});

// Animation for slide out
const style = document.createElement("style");
style.textContent = `
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);
