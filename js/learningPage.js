import { initializeAlphabet } from './alphabet.js'; 

export async function initializeLearningPage(topic, fromLang, toLang, imageQuiz, alphabetFile, alphabetLang) {
  try {
    const response = await fetch(`../../../data/${topic}.json`);
    const data = await response.json();

    // 1. Inicializa o Carrossel
    renderCarousel({
      vocabulario: data,
      fromLang: fromLang,
      toLang: toLang,
    });
    
    // 2. Inicializa a lista de Vocabulário
    renderVocabulario({
      vocabulario: data,
      containerId: 'vocab',
      muteBtnId: 'mute-vocab',
      fromLang: fromLang,
      toLang: toLang,
    });
    
    // 3. Inicializa o Quiz
    const openQuizBtn = document.getElementById('open-quiz-modal');
    if (openQuizBtn) {
      openQuizBtn.addEventListener('click', async () => {
        const quiz = await initializeQuiz({
          topic: topic,
          questionLang: fromLang,
          optionsLang: toLang,
          imageQuiz: imageQuiz,
        });
        quiz.open();
      });
    }

    // 4. Inicializa o Alfabeto
    initializeAlphabet(alphabetFile, alphabetLang);
    // Arquivo do alfabeto
    
    
  } catch (error) {
    console.error('Error initializing learning page:', error);
  }
}
