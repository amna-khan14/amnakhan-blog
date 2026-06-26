const menuToggle = document.querySelector(".menu-toggle");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const mainNav = document.querySelector(".main-nav") || document.querySelector(".sidebar-nav");
const siteSidebar = document.querySelector(".sidebar");
const sidebarBackdrop = document.querySelector(".sidebar-backdrop");

function setSidebarOpen(isOpen) {
  siteSidebar?.classList.toggle("open", isOpen);
  sidebarToggle?.setAttribute("aria-expanded", String(isOpen));
  sidebarToggle?.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  mainNav?.classList.toggle("open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("sidebar-open", isOpen);

  if (sidebarBackdrop) {
    sidebarBackdrop.hidden = !isOpen;
    sidebarBackdrop.setAttribute("aria-hidden", String(!isOpen));
  }
}

function closeSidebar() {
  setSidebarOpen(false);
}

function openSidebar() {
  setSidebarOpen(true);
}

function toggleSidebar() {
  const isOpen = !siteSidebar?.classList.contains("open");
  setSidebarOpen(isOpen);
  if (isOpen) sidebarToggle?.focus();
}

sidebarToggle?.addEventListener("click", toggleSidebar);

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav?.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

sidebarBackdrop?.addEventListener("click", closeSidebar);

if (mainNav) {
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });
}

document.addEventListener("click", (event) => {
  if (!siteSidebar?.classList.contains("open")) return;
  const clickedInside =
    siteSidebar.contains(event.target) ||
    sidebarToggle?.contains(event.target) ||
    sidebarBackdrop?.contains(event.target);
  if (!clickedInside) closeSidebar();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteSidebar?.classList.contains("open")) {
    closeSidebar();
    sidebarToggle?.focus();
  }
});

const copyButtons = document.querySelectorAll(".copy-btn");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const codeBlock = button.closest(".code-block");
    const codeElement = codeBlock?.querySelector("code");
    if (!codeElement) return;

    try {
      await navigator.clipboard.writeText(codeElement.innerText);
      const previousText = button.textContent;
      button.textContent = "Copied!";
      button.disabled = true;
      showToast("Code copied to clipboard.");

      setTimeout(() => {
        button.textContent = previousText;
        button.disabled = false;
      }, 1400);
    } catch (error) {
      showToast("Copy failed. Please select and copy manually.");
    }
  });
});

function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1700);
}
