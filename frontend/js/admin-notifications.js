// Admin Notifications JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Filter tabs
  const filterTabs = document.querySelectorAll(".tab");
  const notifications = document.querySelectorAll(".notification-item");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      filterTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      // Filter notifications
      notifications.forEach((notif) => {
        if (filter === "all") {
          notif.style.display = "flex";
        } else {
          const type = notif.getAttribute("data-type");
          notif.style.display = type === filter ? "flex" : "none";
        }
      });
    });
  });

  // Mark all as read
  const markAllReadBtn = document.getElementById("mark-all-read");
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", function () {
      notifications.forEach((notif) => {
        notif.classList.remove("unread");
      });

      // Update notification badge
      const badge = document.querySelector(".notification-badge");
      if (badge) {
        badge.style.display = "none";
      }

      showToast("Đã đánh dấu tất cả thông báo là đã đọc", "success");
    });
  }

  // Mark individual notification as read
  const markReadBtns = document.querySelectorAll(".btn-mark-read");
  markReadBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const notifItem = this.closest(".notification-item");
      notifItem.classList.remove("unread");

      // Update badge count
      updateBadgeCount();
    });
  });

  // Update notification badge count
  function updateBadgeCount() {
    const unreadCount = document.querySelectorAll(
      ".notification-item.unread"
    ).length;
    const badge = document.querySelector(".notification-badge");

    if (badge) {
      if (unreadCount === 0) {
        badge.style.display = "none";
      } else {
        badge.textContent = unreadCount;
        badge.style.display = "flex";
      }
    }
  }

  // Toast notification function
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <img src="../icon/${
          type === "success" ? "tick" : "canh_bao"
        }.png" alt="${type}" class="toast-icon" />
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    // Hide and remove toast
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // Initialize badge count
  updateBadgeCount();
});
