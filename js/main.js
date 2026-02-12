// Lucide Icons Init
lucide.createIcons();

// Mobile Menu
const menuBtn = document.getElementById("menu-btn");
const closeMenuBtn = document.getElementById("close-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const body = document.body;

function openMenu() {
  mobileMenu.classList.add("open");
  body.style.overflow = "hidden";
}

function closeMenu() {
  mobileMenu.classList.remove("open");
  body.style.overflow = "";
}

menuBtn.addEventListener("click", openMenu);
closeMenuBtn.addEventListener("click", closeMenu);

// Close Menu When Open Link
document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});



// Other

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

  const ripple = button.getElementsByClassName("ripple")[0];
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}

const buttons = document.getElementsByClassName("ripple-btn");
for (const button of buttons) {
  button.addEventListener("click", createRipple);
}

// Tabs Effect
function activateTab(el) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("tab-active"));
  el.classList.add("tab-active");
}

// Fullscreen Feature
const fullscreenButton = document.getElementById("fullscreen-button");

fullscreenButton.addEventListener("click", toggleFullscreen);

function toggleFullscreen() {
  if (document.fullscreenElement) {
    // If already in fullscreen, exit fullscreen
    document.exitFullscreen();
  } else {
    // If not in fullscreen, request fullscreen
    document.documentElement.requestFullscreen();
  }
}

// Theme Toggle Feature
const toggleBtn = document.querySelector("#theme-toggle");
toggleBtn.addEventListener("click", themeToggle);

function themeToggle() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
