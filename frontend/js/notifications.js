// Notifications Page JavaScript - Kết nối với Backend API

const API_BASE_URL = "http://localhost:5000/api";

// State
let allNotifications = [];
let currentTab = "all";

document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra đăng nhập
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Load thông báo từ database
  loadNotifications();

  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      currentTab = tab;

      // Update active tab
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter và render notifications
      renderNotifications();
    });
  });

  // Mark all as read
  const markAllReadBtn = document.getElementById("mark-all-read");
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", markAllAsRead);
  }
});

// Load notifications từ API
async function loadNotifications() {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      allNotifications = data.data.notifications;
      updateBadgeCounts(data.data.unreadCount, allNotifications.length);
      renderNotifications();
    } else {
      console.error("Failed to load notifications:", data.message);
      showEmptyState();
    }
  } catch (error) {
    console.error("Error loading notifications:", error);
    showEmptyState();
  }
}

// Render notifications dựa trên tab hiện tại
function renderNotifications() {
  const container = document.querySelector(".notifications-container");
  if (!container) return;

  // Clear container
  container.innerHTML = "";

  // Filter notifications theo tab
  let filteredNotifications = allNotifications;

  if (currentTab === "unread") {
    filteredNotifications = allNotifications.filter((n) => !n.isRead);
  } else if (currentTab === "lottery") {
    filteredNotifications = allNotifications.filter(
      (n) => n.type === "lottery" || n.type === "prize"
    );
  } else if (currentTab === "system") {
    filteredNotifications = allNotifications.filter(
      (n) => n.type === "system" || n.type === "info"
    );
  }

  // Show empty state nếu không có thông báo
  if (filteredNotifications.length === 0) {
    container.innerHTML = `
      <div class="empty-state" id="empty-notifications">
        <img src="../icon/chuong.png" alt="No notifications" class="empty-icon" />
        <h3>Không có thông báo</h3>
        <p>Bạn chưa có thông báo nào trong mục này</p>
      </div>
    `;
    return;
  }

  // Render từng notification
  filteredNotifications.forEach((notification) => {
    const notifElement = createNotificationElement(notification);
    container.appendChild(notifElement);
  });
}

// Tạo element cho notification
function createNotificationElement(notification) {
  const div = document.createElement("div");
  div.className = `notification-item ${notification.isRead ? "" : "unread"}`;
  div.dataset.id = notification._id;

  // Chọn icon dựa trên type
  const iconSrc = getIconForType(notification.type, notification.icon);
  const badgeClass = getBadgeClass(notification.type);
  const badgeText = getBadgeText(notification.type);

  div.innerHTML = `
    <div class="stat-icon">
      <img src="${iconSrc}" alt="${notification.type}" />
    </div>
    <div class="notification-content">
      <div class="notification-header">
        <h3>${escapeHtml(notification.title)}</h3>
        ${!notification.isRead ? '<span class="notification-badge new">MỚI</span>' : ""}
        <span class="notification-badge ${badgeClass}">${badgeText}</span>
      </div>
      <p class="notification-message">${escapeHtml(notification.message)}</p>
      <div class="notification-meta">
        <span class="notification-time">${formatTime(notification.createdAt)}</span>
        ${notification.data?.ticketNumber ? `<span class="ticket-info">Vé: ${notification.data.ticketNumber}</span>` : ""}
      </div>
    </div>
    <button class="btn-notification-close" onclick="deleteNotification('${notification._id}')">×</button>
  `;

  // Click to mark as read
  div.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-notification-close")) {
      markAsRead(notification._id);
    }
  });

  return div;
}

// Get icon source based on type
function getIconForType(type, icon) {
  const iconMap = {
    lottery: "../icon/tick.png",
    prize: "../icon/cup.png",
    transaction: "../icon/tui_tien.png",
    system: "../icon/icon_cai_dat.png",
    info: "../icon/loa.png",
    ticket: "../icon/tick.png",
    trophy: "../icon/cup.png",
    megaphone: "../icon/loa.png",
  };

  return iconMap[icon] || iconMap[type] || "../icon/chuong.png";
}

// Get badge class based on type
function getBadgeClass(type) {
  const classMap = {
    lottery: "",
    prize: "prize",
    transaction: "transaction",
    system: "system",
    info: "system",
  };
  return classMap[type] || "";
}

// Get badge text based on type
function getBadgeText(type) {
  const textMap = {
    lottery: "XỔ SỐ",
    prize: "TRÚNG THƯỞNG",
    transaction: "GIAO DỊCH",
    system: "HỆ THỐNG",
    info: "THÔNG TIN",
  };
  return textMap[type] || "THÔNG BÁO";
}

// Format time relative
function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;

  return date.toLocaleDateString("vi-VN");
}

// Escape HTML để tránh XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Mark notification as read
async function markAsRead(id) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      // Update local state
      const notification = allNotifications.find((n) => n._id === id);
      if (notification) {
        notification.isRead = true;
      }

      // Update UI
      const element = document.querySelector(`[data-id="${id}"]`);
      if (element) {
        element.classList.remove("unread");
        const newBadge = element.querySelector(".notification-badge.new");
        if (newBadge) newBadge.remove();
      }

      // Update counts
      const unreadCount = allNotifications.filter((n) => !n.isRead).length;
      updateBadgeCounts(unreadCount, allNotifications.length);
    }
  } catch (error) {
    console.error("Error marking as read:", error);
  }
}

// Mark all as read
async function markAllAsRead() {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      // Update local state
      allNotifications.forEach((n) => (n.isRead = true));

      // Re-render
      renderNotifications();
      updateBadgeCounts(0, allNotifications.length);

      showToast("Đã đánh dấu tất cả thông báo là đã đọc", "success");
    }
  } catch (error) {
    console.error("Error marking all as read:", error);
    showToast("Có lỗi xảy ra", "error");
  }
}

// Delete notification
async function deleteNotification(id) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      // Remove from local state
      allNotifications = allNotifications.filter((n) => n._id !== id);

      // Animate and remove element
      const element = document.querySelector(`[data-id="${id}"]`);
      if (element) {
        element.style.animation = "slideOut 0.3s ease";
        setTimeout(() => {
          element.remove();

          // Check if empty
          if (allNotifications.length === 0) {
            showEmptyState();
          }
        }, 300);
      }

      // Update counts
      const unreadCount = allNotifications.filter((n) => !n.isRead).length;
      updateBadgeCounts(unreadCount, allNotifications.length);

      showToast("Đã xóa thông báo", "success");
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    showToast("Có lỗi xảy ra", "error");
  }
}

// Update badge counts in tabs
function updateBadgeCounts(unreadCount, totalCount) {
  const allBadge = document.querySelector('[data-tab="all"] .badge');
  const unreadBadge = document.querySelector('[data-tab="unread"] .badge');

  if (allBadge) allBadge.textContent = totalCount;
  if (unreadBadge) unreadBadge.textContent = unreadCount;
}

// Show empty state
function showEmptyState() {
  const container = document.querySelector(".notifications-container");
  if (container) {
    container.innerHTML = `
      <div class="empty-state" id="empty-notifications">
        <img src="../icon/chuong.png" alt="No notifications" class="empty-icon" />
        <h3>Không có thông báo</h3>
        <p>Bạn chưa có thông báo nào</p>
      </div>
    `;
  }
}

// Toast notification
function showToast(message, type = "info") {
  // Remove existing toast
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
    <span class="toast-message">${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("toast-show"), 100);

  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

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
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
  }
  
  .empty-state .empty-icon {
    width: 80px;
    height: 80px;
    opacity: 0.5;
    margin-bottom: 1rem;
  }
  
  .empty-state h3 {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
  
  .ticket-info {
    background: var(--bg-tertiary);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.85rem;
  }
  
  .notification-badge.prize {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
  }
  
  .notification-badge.transaction {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
  }
`;
document.head.appendChild(style);
