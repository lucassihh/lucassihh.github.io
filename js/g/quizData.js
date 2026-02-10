// Função para buscar o JSON
export async function fetchTopicData(topic) {
  try {
    const response = await fetch(`../../../data/vocabulary/${topic}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load topic data for: ${topic}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching topic data:", error);
    return [];
  }
}

// Embaralhar um array (modifica in-place)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Preparar os dados do quiz
export async function getQuizData(
  topic,
  questionLang,
  optionsLang,
  numQuestions = 10,
) {
  const allData = await fetchTopicData(topic);

  // Definir o número de questões
  let actualNumQuestions = numQuestions;

  // Verifica se tem 4 ou mais itens no JSON
  if (allData.length < 4) {
    console.error(
      "Não há dados suficientes (mínimo de 4 itens) para criar o quiz.",
    );
    return [];
  }

  // Se numQuestions for 0 ou negativo, ou maior que o total, usa TODAS as questões.
  if (numQuestions <= 0 || numQuestions > allData.length) {
    actualNumQuestions = allData.length;
  }

  // Seleciona o número correto de perguntas
  const selectedQuestions = shuffleArray([...allData]).slice(
    0,
    actualNumQuestions,
  );

  const preparedQuizData = selectedQuestions.map((q) => {
    const correctAnswer = q[`text_${optionsLang}`];
    // Garante que as opções erradas são de itens diferentes
    const otherOptions = allData.filter((item) => item.id !== q.id);

    // Usa uma cópia para o shuffle não afetar o array 'otherOptions'
    const selectedWrongOptions = shuffleArray([...otherOptions]).slice(0, 3);

    const options = [
      {
        text: correctAnswer,
        image: q.image_english,
      },
      ...selectedWrongOptions.map((opt) => ({
        text: opt[`text_${optionsLang}`],
        image: opt.image_english,
      })),
    ];

    // Embaralha as opções finais (correta + erradas)
    const finalOptions = shuffleArray([...options]);

    return {
      question_text: q[`text_${questionLang}`],
      audio_path: q[`audio_${questionLang}`],
      correct_answer: correctAnswer,
      options: finalOptions,
    };
  });

  return preparedQuizData;
}
