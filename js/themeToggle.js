// themeToggle
const toggleBtn = document.querySelector("#theme-toggle");
const toggleBtnDesk = document.querySelector("#theme-toggledesk");

toggleBtn.addEventListener("click", themeToggle);
toggleBtnDesk.addEventListener("click", themeToggle);

function themeToggle() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Fade
document.addEventListener("DOMContentLoaded", () => {
  // 1. Seleciona todos os elementos que queremos animar
  const elements = document.querySelectorAll(".fade-element");

  // 2. Cria a função de callback (o que acontece quando um elemento entra na tela)
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      // Se o elemento estiver visível (ou seja, cruzando a margem)
      if (entry.isIntersecting) {
        // Adiciona a classe 'visible' para disparar a animação CSS
        entry.target.classList.add("visible");
        // Para de observar o elemento, pois ele já apareceu
        observer.unobserve(entry.target);
      }
    });
  };

  // 3. Define as opções para o Observador
  const observerOptions = {
    // A animação será disparada quando 10% do elemento estiver visível
    threshold: 0.1,
    // Permite que a animação seja disparada um pouco antes (10px antes) ou depois
    rootMargin: "0px 0px -10px 0px",
  };

  // 4. Cria o Observador de Interseção
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // 5. Inicia a observação em cada elemento
  elements.forEach((element) => {
    observer.observe(element);
  });
});
