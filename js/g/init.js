import { initializeQuiz } from "./quiz.js";
import { initializeFlashcards } from "./flashcards.js";
import { renderVocabulario } from "./vocabulary.js";

export async function initializeLearningPage(
  topic,
  fromLang,
  toLang,
  imageQuiz,
  numQuestions,
) {
  try {
    const response = await fetch(`../../../data/vocabulary/${topic}.json`);
    const data = await response.json();

    // Inicializa o sistema do Vocabulário
    renderVocabulario({
      vocabulario: data,
      containerId: "vocab",
      muteBtnId: "mute-vocab",
      fromLang: fromLang,
      toLang: toLang,
    });

    // Inicializa o quiz
    const quiz = initializeQuiz({
      topic: topic,
      questionLang: toLang,
      optionsLang: fromLang,
      imageQuiz: imageQuiz,
      numQuestions: numQuestions, // NOVO: Passa o número de questões para o quiz
    });

    const openQuizBtn = document.getElementById("open-quiz-modal");
    if (openQuizBtn) {
      openQuizBtn.addEventListener("click", () => {
        quiz.open(); // Não cria um novo quiz, apenas abre o que foi criado.
      });
    }

    // Inicializa o sistema de Flashcards
    initializeFlashcards(data, fromLang, toLang);
  } catch (error) {
    console.error("Error initializing learning page:", error);
  }
}
