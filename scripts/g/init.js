// Import Vocabulary & Mini Games
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

    // Initializes the Vocabulary
    renderVocabulario({
      vocabulario: data,
      containerId: "vocab",
      muteBtnId: "mute-vocab",
      fromLang: fromLang,
      toLang: toLang,
    });

    // Start the quiz
    const quiz = initializeQuiz({
      topic: topic,
      questionLang: toLang,
      optionsLang: fromLang,
      imageQuiz: imageQuiz,
      numQuestions: numQuestions,
    });

    const openQuizBtn = document.getElementById("open-quiz-modal");
    if (openQuizBtn) {
      openQuizBtn.addEventListener("click", () => {
        quiz.open();
      });
    }

    // Initialize the Flashcard
    initializeFlashcards(data, fromLang, toLang);
  } catch (error) {
    console.error("Error initializing learning page:", error);
  }
}
