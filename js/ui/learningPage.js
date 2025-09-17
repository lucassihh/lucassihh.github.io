import { initializeAlphabet } from '../games/alphabet.js';
import { initializeQuiz } from '../games/quiz.js';

export async function initializeLearningPage(topic, fromLang, toLang, imageQuiz, alphabetFile, alphabetLang) {
  try {
    const response = await fetch(`../../../data/vocabulary/${topic}.json`);
    const data = await response.json();

    // Inicializa o Carrossel
    renderCarousel({
      vocabulario: data,
      fromLang: fromLang,
      toLang: toLang,
    });
    
    // Inicializa a lista de Vocabulário
    renderVocabulario({
      vocabulario: data,
      containerId: 'vocab',
      muteBtnId: 'mute-vocab',
      fromLang: fromLang,
      toLang: toLang,
    });
    
    // Inicializa o Quiz
    const openQuizBtn = document.getElementById('open-quiz-modal');
    if (openQuizBtn) {
      openQuizBtn.addEventListener('click', () => {
        const quiz = initializeQuiz({
          topic: topic,
          questionLang: fromLang,
          optionsLang: toLang,
          imageQuiz: imageQuiz,
        });
        quiz.open();
      });
    }

    // Inicializa o Alfabeto
    initializeAlphabet(alphabetFile, alphabetLang);
    
  } catch (error) {
    console.error('Error initializing learning page:', error);
  }
}
