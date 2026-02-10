// Importa o Init
import { initializeLearningPage } from "./init.js";

document.addEventListener("DOMContentLoaded", () => {
  //  Ler os atributos
  const body = document.body;
  const grammarFrom = body.dataset.grammarFrom;
  const grammarTo = body.dataset.grammarTo;

  // Chama a função de inicialização
  if (grammarFrom && grammarTo) {
    initializeLearningPage(grammarFrom, grammarTo);
  } else {
    // Mensagem de erro
    console.error(
      "Dados 'data-grammar-from' ou 'data-grammar-to' ausentes no body.",
    );
  }
});
