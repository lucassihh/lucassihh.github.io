// Function to search the JSON
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

// Shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Prepare the quiz data
export async function getQuizData(
  topic,
  questionLang,
  optionsLang,
  numQuestions = 10,
) {
  const allData = await fetchTopicData(topic);

  // Define the number of questions
  let actualNumQuestions = numQuestions;

  // Checks if there are 4 or more items in the JSON
  if (allData.length < 4) {
    console.error(
      "There is not enough data (minimum of 4 items) to create the quiz...",
    );
    return [];
  }

  if (numQuestions <= 0 || numQuestions > allData.length) {
    actualNumQuestions = allData.length;
  }

  // Select the correct number of questions
  const selectedQuestions = shuffleArray([...allData]).slice(
    0,
    actualNumQuestions,
  );

  const preparedQuizData = selectedQuestions.map((q) => {
    const correctAnswer = q[`text_${optionsLang}`];
    const otherOptions = allData.filter((item) => item.id !== q.id);
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

    // Shuffle the final options (correct + incorrect)
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
