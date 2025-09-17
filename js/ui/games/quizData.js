// Função para buscar o JSON
export async function fetchTopicData(topic) {
  try {
    const response = await fetch(`../../../data/vocabulary/${topic}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load topic data for: ${topic}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching topic data:', error);
    return [];
  }
}

// Função utilitária para embaralhar um array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// A função principal para preparar os dados do quiz
export async function getQuizData(topic, questionLang, optionsLang, numQuestions = 5) {
  const allData = await fetchTopicData(topic);
  
  if (allData.length < numQuestions) {
    console.error('Not enough data to create quiz.');
    return [];
  }
  
  // Seleciona um subconjunto aleatório de perguntas
  const selectedQuestions = shuffleArray([...allData]).slice(0, numQuestions);
  
  const preparedQuizData = selectedQuestions.map(q => {
    const correctAnswer = q[`text_${optionsLang}`];
    const otherOptions = allData.filter(item => item.id !== q.id);
    const selectedWrongOptions = shuffleArray(otherOptions).slice(0, 3);
    
    // Constrói a lista de opções para o quiz
    const options = [
      {
        text: correctAnswer,
        image: q.image_english
      },
      ...selectedWrongOptions.map(opt => ({
        text: opt[`text_${optionsLang}`],
        image: opt.image_english
      }))
    ];
    
    // Embaralha as opções antes de retornar
    shuffleArray(options);
    
    return {
      question_text: q[`text_${questionLang}`],
      audio_path: q[`audio_${questionLang}`],
      correct_answer: correctAnswer,
      options: options
    };
  });
  
  return preparedQuizData;
}
