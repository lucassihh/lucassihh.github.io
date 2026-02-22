// Import the Init
import { initializeLearningPage } from "./init.js";

document.addEventListener("DOMContentLoaded", () => {
  //  Read the attributes
  const body = document.body;
  const topicSlug = body.dataset.topicSlug;
  const fromLanguage = body.dataset.fromLang;
  const toLanguage = body.dataset.toLang;

  // Convert the string
  const imageQuiz = body.dataset.imageQuiz === "true";

  const numQuestions = parseInt(body.dataset.numQuestions) || 0;

  // Initialization function
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
