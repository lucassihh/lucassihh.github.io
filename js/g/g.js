// Importa o Init
import { initializeLearningPage } from "./init.js";

document.addEventListener("DOMContentLoaded", () => {
  //  Ler os atributos
  const body = document.body;
  const topicSlug = body.dataset.topicSlug;
  const fromLanguage = body.dataset.fromLang;
  const toLanguage = body.dataset.toLang;

  // Converte a string
  const imageQuiz = body.dataset.imageQuiz === "true";

  const numQuestions = parseInt(body.dataset.numQuestions) || 0;

  // Chama a função de inicialização
  if (topicSlug && fromLanguage && toLanguage) {
    initializeLearningPage(
      topicSlug,
      fromLanguage,
      toLanguage,
      imageQuiz,
      numQuestions,
    );
  }
});
