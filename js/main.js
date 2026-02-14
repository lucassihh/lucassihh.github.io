// Lucide Icons
if (window.lucide) {
  lucide.createIcons();
}

// Mobile Menu
const menuBtn = document.getElementById("menu-btn");
const closeMenuBtn = document.getElementById("close-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && closeMenuBtn && mobileMenu) {
  const openMenu = () => {
    mobileMenu.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  };

  menuBtn.addEventListener("click", openMenu);
  closeMenuBtn.addEventListener("click", closeMenu);

  document.querySelectorAll("#mobile-menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

// Language Dropdown
const langBtn = document.getElementById("lang-menu-btn");
const langMenu = document.getElementById("lang-menu-options");
const langChevron = document.getElementById("lang-chevron");

if (langBtn && langMenu) {
  const toggleDropdown = (e) => {
    e.stopPropagation();
    const isHidden = langMenu.classList.contains("hidden");

    if (isHidden) {
      // Open
      langMenu.classList.remove("hidden");
      // Timeout for Animation Tailwind
      setTimeout(() => {
        langMenu.classList.remove("opacity-0", "scale-95");
        langMenu.classList.add("opacity-100", "scale-100");
      }, 10);
      langChevron.style.transform = "rotate(180deg)";
    } else {
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    langMenu.classList.add("opacity-0", "scale-95");
    langMenu.classList.remove("opacity-100", "scale-100");
    langChevron.style.transform = "rotate(0deg)";
    // Wait Animation
    setTimeout(() => {
      langMenu.classList.add("hidden");
    }, 200);
  };

  langBtn.addEventListener("click", toggleDropdown);

  // Close When Click Outside
  document.addEventListener("click", (e) => {
    if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
      if (!langMenu.classList.contains("hidden")) closeDropdown();
    }
  });

  // Close Using ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
  });
}

// Ripple Effect
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  const rect = button.getBoundingClientRect();

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.querySelector(".ripple");
  if (ripple) ripple.remove();

  button.appendChild(circle);
}

document.querySelectorAll(".ripple-btn").forEach((btn) => {
  btn.addEventListener("click", createRipple);
});

// <a> Delay for Effect
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // If is a valid link
    if (
      href &&
      !href.startsWith("#") &&
      this.target !== "_blank" &&
      !e.metaKey &&
      !e.ctrlKey
    ) {
      e.preventDefault();

      setTimeout(() => {
        window.location.href = href;
      }, 300); // 300ms
    }
  });
});

// Tabs Effect
const tabButtons = document.querySelectorAll(".tab-btn");

if (tabButtons.length > 0) {
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("tab-active"));
      btn.classList.add("tab-active");
    });
  });
}

// Fullscreen
const fullscreenButton = document.getElementById("fullscreen-button");
if (fullscreenButton) {
  fullscreenButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Erro ao ativar fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });
}

// Theme Toggle
const toggleBtn = document.querySelector("#theme-toggle");
if (toggleBtn) {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }

  toggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}
