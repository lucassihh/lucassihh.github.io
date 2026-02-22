(function () {
  // --- Modal Component (WAI-ARIA compliant) ---
  const initializedElements = new WeakSet();

  const initModal = (modalElement) => {
    if (initializedElements.has(modalElement)) return;

    const closeBtn = modalElement.querySelector("[data-modal-close]");
    const overlay = modalElement.querySelector(".modal-overlay");
    const dialog = modalElement.querySelector(".modal-dialog");

    // --- Funções de abertura e fechamento com transição ---
    const open = () => {
      modalElement.classList.remove("hidden");

      // Estado inicial (fade + scale)
      overlay.classList.add("opacity-0");
      dialog.classList.add("opacity-0", "scale-95");

      // Força reflow antes da animação
      requestAnimationFrame(() => {
        overlay.classList.remove("opacity-0");
        dialog.classList.remove("opacity-0", "scale-95");
      });

      document.body.classList.add("overflow-hidden");
      dialog.focus();
    };

    const close = () => {
      // Adiciona classes de saída
      overlay.classList.add("opacity-0");
      dialog.classList.add("opacity-0", "scale-95");

      // Espera a animação terminar antes de esconder
      setTimeout(() => {
        modalElement.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      }, 150); // 150ms = mesma duração da transição CSS
    };

    // --- Eventos ---
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    closeBtn?.addEventListener("click", close);

    modalElement.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    // --- Expor métodos globais ---
    modalElement.open = open;
    modalElement.close = close;

    initializedElements.add(modalElement);
  };

  // --- Inicialização automática ---
  function autoInitModals() {
    document.querySelectorAll(".modal").forEach((modal) => {
      if (!initializedElements.has(modal)) {
        initModal(modal);
      }
    });
  }

  if (typeof window !== "undefined") {
    document.addEventListener("DOMContentLoaded", autoInitModals);
    new MutationObserver(autoInitModals).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
