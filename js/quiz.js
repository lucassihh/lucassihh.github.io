function initializeQuiz({ topic, questionLang, optionsLang, imageQuiz = false }) {
  const modal = document.getElementById('quiz-modal');
  const modalContent = document.getElementById('quiz-modal-content');
  const closeBtn = document.getElementById('close-quiz-modal');
  const progressBar = document.getElementById('progress-bar');
  const timerBar = document.getElementById('timer-bar');

  const questionContainer = document.getElementById('quiz-question-container');
  const resultsContainer = document.getElementById('quiz-results-container');
  
  const wordEl = document.getElementById('quiz-word');
  const optionsEl = document.getElementById('quiz-options');
  const feedbackEl = document.getElementById('quiz-feedback');
  const muteBtn = document.getElementById('quiz-mute');
  const finalScoreEl = document.getElementById('quiz-score');
  const restartBtn = document.getElementById('quiz-restart');
  const audioCorrect = document.getElementById('audio-correct');
  const audioIncorrect = document.getElementById('audio-incorrect');

  const iconSoundOn = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
              <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
          </svg>`;
  
  const iconSoundOff = `
      <svg xmlns="http://www.w3.org/2000/svg" class="size-6" viewBox="0 0 24 24" fill="currentColor">
             <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
        </svg>`;

  let quizData = [];
  let current = 0;
  let score = 0;
  let wrongAnswers = [];
  let answerTimeout = null;
  let startTime = null;
  const TIMER_DURATION = 8000;
  
  function stopQuiz() {
    clearTimeout(answerTimeout);
    stopCurrentAudio();
    resetTimer();
  }

  function updateProgressBar() {
    const progress = (current / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function resetTimer() {
    timerBar.style.transition = 'none';
    timerBar.style.width = '100%';
  }

  function startTimer() {
    resetTimer();
    void timerBar.offsetWidth;
    timerBar.style.transition = `width ${TIMER_DURATION}ms linear`;
    timerBar.style.width = '0%';

    answerTimeout = setTimeout(() => {
      handleAnswer(null, quizData[current].correct_answer, quizData[current].question_text, null);
    }, TIMER_DURATION);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  
  
  
function showQuestion() {
    clearTimeout(answerTimeout);
    resetTimer();

    feedbackEl.classList.add('hidden');
    feedbackEl.textContent = '';

    if (current >= quizData.length) {
      showResults();
      return;
    }

    updateProgressBar();
    const q = quizData[current];
    const question = q['question_text'];
    let options = q['options'].slice();
    const correct = q['correct_answer'];
    const audioSrc = q['audio_path'];

    options = shuffleArray(options);

    wordEl.textContent = question;
    wordEl.style.position = 'relative';
    wordEl.style.zIndex = '10';
    wordEl.onclick = () => {
      if (audioSrc) {
        window.stopAllComponents(); 
        playAudio(audioSrc);
      }
    };
    optionsEl.innerHTML = '';
    
    if (imageQuiz) {
      optionsEl.className = 'grid grid-cols-2 gap-8 justify-center';
    } else {
      optionsEl.className = 'flex flex-col space-y-4 w-full max-w-3xl items-center px-4';
    }
    
    playAudio(audioSrc);

    options.forEach((option) => {
      const btn = document.createElement('button');
      
      // ImageQuiz grid
      if (imageQuiz && option.image) {
        btn.className = 'relative overflow-hidden bg-gradient-to-br from-void to-gray-900 w-48 md:w-56 text-white aspect-square shadow-lg rounded-xl border-2 border-border/50 hover:scale-105 transition-all p-4';
      } else {
        // Text quiz flex col
        btn.className = 'relative overflow-hidden w-full rounded-xl text-white border-2 border-border/50 hover:scale-105 transition-all p-6 flex flex-col items-center justify-center';
      }
      
      btn.onclick = () => handleAnswer(option.text, correct, question, btn);
      let overlay;
      const span = document.createElement('span'); // Move the span declaration here
      
      if (imageQuiz && option.image) {
        const img = document.createElement('img');
        img.src = option.image;
        img.alt = option.text;
        img.className = 'absolute inset-0 w-full h-full object-cover';
        btn.appendChild(img);
        overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-transparent transition-colors duration-300 rounded-xl';
        btn.appendChild(overlay);
        span.textContent = option.text;
        span.className = 'absolute bottom-0 left-0 right-0 text-white text-lg font-bold px-4 py-2 bg-black rounded-b-xl';
        btn.appendChild(span);
      } else {
        // Renderiza o texto e o overlay para o modo de texto
        span.textContent = option.text;
        span.className = 'text-xl font-bold text-white';
        btn.appendChild(span);
        overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 rounded-xl';
        btn.appendChild(overlay);
      }
      btn._overlay = overlay;
      btn._textSpan = span; // Store a reference to the text span
      optionsEl.appendChild(btn);
    });

    startTimer();
  }

function showCorrectAnswer(correctAnswer, selectedButton) {
  [...optionsEl.children].forEach((button) => {
    const btnText = button.querySelector('span')?.textContent.trim() || button.textContent.trim();
    if (btnText === correctAnswer) {
      if (button._overlay) {
        button._overlay.className = 'absolute inset-0 bg-green-100/40 transition-all duration-300';
      }
      if (button._textSpan) {
        button._textSpan.className = button._textSpan.className.replace('text-white', 'text-green-600');
      }
      button.className = button.className.replace('border-2 border-border/50', 'border-none');
    } else {
      button.style.opacity = '0.5';
    }
    if (selectedButton && button === selectedButton) {
      button.style.opacity = '1';
    }
  });
  
  feedbackEl.innerHTML = `<span class="text-2xl text-white">Answer:</span> <span class="text-2xl font-semibold text-primary ml-2">${correctAnswer}</span>`;
  feedbackEl.classList.remove('hidden');
}

function handleAnswer(selected, correct, questionText, btn) {
  stopQuiz();
  [...optionsEl.children].forEach((b) => (b.disabled = true));

  const isCorrect = selected === correct;
  
  if (isCorrect) {
    score++;
    audioCorrect.currentTime = 0;
    audioCorrect.play();
    if (btn) {
      btn.className = btn.className.replace('border-2 border-border/50', 'border-none');
      if (btn._overlay) {
        btn._overlay.className = 'absolute inset-0 bg-green-100/40 transition-all duration-300';
      }
      if (btn._textSpan) {
        btn._textSpan.className = btn._textSpan.className.replace('text-white', 'text-green-600');
      }
    }
  } else {
    audioIncorrect.currentTime = 0;
    audioIncorrect.play();
    wrongAnswers.push({ question: questionText, correct, selected });
    
    if (btn) {
      btn.className = btn.className.replace('border-2 border-border/50', 'border-none');
      if (btn._overlay) {
        btn._overlay.className = 'absolute inset-0 bg-red-100/40 transition-all duration-300';
      }
      if (btn._textSpan) {
        btn._textSpan.className = btn._textSpan.className.replace('text-white', 'text-red-600');
      }
    }
    showCorrectAnswer(correct, btn);
  }
  
  // if (isCorrect) {
  //  showCorrectAnswer(correct, btn);
  // }

  answerTimeout = setTimeout(() => {
    [...optionsEl.children].forEach((button) => {
      if (button._overlay) {
        button._overlay.classList.remove('animate-pulse');
      }
      button.style.opacity = '1';
      button.disabled = false;
    });

    current++;
    showQuestion();
  }, 2000);
}







  function showResults() {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const percent = Math.round((score / quizData.length) * 100);
    questionContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    muteBtn.classList.add('hidden');
    progressBar.style.width = '100%';
    resetTimer();
    finalScoreEl.innerHTML = `
      <p>Score ${score} / ${quizData.length}</p>
      <p>Time: ${totalTime}s</p>
    `;
    if (percent >= 80) {
      import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js')
        .then(({ default: confetti }) => {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        })
        .catch(() => {});
    }
  }

  restartBtn.onclick = () => {
    window.stopAllComponents(); 
    current = 0;
    score = 0;
    wrongAnswers = [];
    muteBtn.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    startTime = Date.now();
    showQuestion();
  };
  
  muteBtn.innerHTML = isMuted ? iconSoundOff : iconSoundOn;
  muteBtn.onclick = () => {
    isMuted = toggleGlobalMute();
    muteBtn.innerHTML = isMuted ? iconSoundOff : iconSoundOn;
  };

  function openModal() {
    modal.classList.remove('hidden');
    modalContent.classList.add('scale-95', 'opacity-20');
    requestAnimationFrame(() => {
      modalContent.classList.remove('scale-95', 'opacity-20');
      modalContent.classList.add('scale-100', 'opacity-100');
    });
  }

  function closeModal() {
    modal.classList.add('hidden');
    stopQuiz();
  }
  
  closeBtn.onclick = closeModal;
    
  async function loadAndStartQuiz() {
  try {
    // Stop all components when the quiz start's
    window.stopAllComponents();

    const response = await fetch(
      `../../../data/get_quiz_data.php?topic=${topic}&question_lang=${questionLang}&options_lang=${optionsLang}`
    );
    if (!response.ok) throw new Error('Failed to load quiz data.');
    const data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    quizData = data;
    if (quizData.length === 0) {
      alert('There are no questions for this topic.');
      return;
    }
    current = 0;
    score = 0;
    wrongAnswers = [];
    startTime = Date.now();
    resultsContainer.classList.add('hidden');
    openModal();
    showQuestion();
  } catch (err) {
    console.error(err);
    alert('Error loading quiz.');
  }
}

  return {
    open: loadAndStartQuiz,
    close: closeModal,
    stop: stopQuiz,
  };
}

window.initializeQuiz = initializeQuiz;
