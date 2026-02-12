// V3
// Data
import { getQuizData } from "./quizData.js";

// Template
const QUIZ_MODAL_HTML = `
    <div
      id="quiz-modal"
      class="modal fixed inset-0 flex items-center justify-center z-20 hidden px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-word"
    >
      <div class="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"></div>
      
      <div class="modal-dialog w-full max-w-2xl relative flex flex-col gap-8 p-8 md:p-12 bg-background rounded-xl border border-border shadow-sm transition-all duration-300">
        
        <div class="flex items-center justify-between gap-6">
          <div id="progress-bar-container" class="flex-1 bg-primary/5 h-2 rounded-full overflow-hidden">
             <div id="progress-bar" class="bg-green-400 h-full transition-all duration-500" style="width: 0%"></div>
          </div>
          
          <div class="flex items-center gap-2">
            <button id="quiz-mute" class="size-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"></button>
            <button id="close-quiz-modal" data-modal-close class="size-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
              <i class="bi bi-x-lg text-sm"></i>
            </button>
          </div>
        </div>

        <div class="w-full bg-primary/5 h-2 rounded-full overflow-hidden">
           <div id="timer-bar" class="bg-orange-400 h-full transition-all duration-1000"></div>
        </div>
        
        <div id="quiz-question-container" class="flex flex-col items-center gap-10">
          <div class="text-center">
            <span class="text-lg font-black capitalize text-blue-400 mb-4">Traduza</span>
            <h3 id="quiz-word" class="text-4xl md:text-5xl font-black tracking-tighter text-black dark:text-white cursor-pointer active:scale-95 transition-transform"></h3>
          </div>
          
          <div id="quiz-options" class="w-full"></div>
        </div>
        
        <div id="quiz-results-container" class="flex-1 flex flex-col items-center justify-center text-center hidden py-10">
          <div class="mb-8">
            <div id="quiz-score" class="text-5xl font-black tracking-tighter text-black dark:text-white"></div>
          </div>
          
          <button id="quiz-restart" class="group flex items-center justify-center bg-primary text-secondary p-2 rounded-full hover:scale-105 transition-all shadow-sm">
            <i class="size-8 bi bi-arrow-clockwise text-lg group-hover:rotate-180 transition-transform duration-500"></i>
          </button>
        </div>

        <audio id="audio-correct" src="../../../assets/sound/correct_selection.mp3"></audio>
        <audio id="audio-incorrect" src="../../../assets/sound/wrong_selection.mp3"></audio>
      </div>
    </div>
`;

export function initializeQuiz({
  topic,
  questionLang,
  optionsLang,
  imageQuiz = false,
  numQuestions = 10,
}) {
  const TIMER_DURATION = 8000;

  if (!document.getElementById("quiz-modal")) {
    document.body.insertAdjacentHTML("beforeend", QUIZ_MODAL_HTML);
  }

  const modal = document.getElementById("quiz-modal");
  const closeBtn = document.getElementById("close-quiz-modal");
  const progressBar = document.getElementById("progress-bar");
  const timerBar = document.getElementById("timer-bar");
  const questionContainer = document.getElementById("quiz-question-container");
  const resultsContainer = document.getElementById("quiz-results-container");
  const wordEl = document.getElementById("quiz-word");
  const optionsEl = document.getElementById("quiz-options");
  const muteBtn = document.getElementById("quiz-mute");
  const finalScoreEl = document.getElementById("quiz-score");
  const restartBtn = document.getElementById("quiz-restart");
  const audioCorrect = document.getElementById("audio-correct");
  const audioIncorrect = document.getElementById("audio-incorrect");

  const ICONS = {
    soundOn: `<i class="bi bi-volume-up-fill text-xl"></i>`,
    soundOff: `<i class="bi bi-volume-mute-fill text-xl"></i>`,
  };

  let quizData = [];
  let current = 0;
  let score = 0;
  let wrongAnswers = [];
  let questionTimeout = null;
  let transitionTimeout = null;
  let startTime = null;

  // Unificação da limpeza
  const stopQuizLogic = () => {
    clearTimeout(questionTimeout);
    clearTimeout(transitionTimeout);
    questionTimeout = null;
    transitionTimeout = null;
    if (window.stopCurrentAudio) window.stopCurrentAudio();
    timerBar.style.transition = "none";
    timerBar.style.width = "100%";
  };

  const closeQuiz = () => {
    stopQuizLogic();
    modal.classList.add("hidden");
    if (typeof modal.close === "function") modal.close();
  };

  const updateProgressBar = () => {
    progressBar.style.width = `${(current / quizData.length) * 100}%`;
  };

  const startTimer = () => {
    timerBar.style.transition = "none";
    timerBar.style.width = "100%";
    void timerBar.offsetWidth;
    timerBar.style.transition = `width ${TIMER_DURATION}ms linear`;
    timerBar.style.width = "0%";
    questionTimeout = setTimeout(() => {
      handleAnswer(
        null,
        quizData[current].correct_answer,
        quizData[current].question_text,
      );
    }, TIMER_DURATION);
  };

  const showCorrectAnswer = (correctAnswer) => {
    [...optionsEl.children].forEach((button) => {
      const btnText =
        button.querySelector("span")?.textContent.trim() ||
        button.textContent.trim();

      if (btnText === correctAnswer) {
        // Feedback visual da resposta correta
        button.classList.add(
          "border-4",
          "border-green-500",
          "dark:border-green-700",
          "bg-green-200",
          "scale-105",
          "transition-all",
          "duration-300",
          "animate-bounce",
        );
      } else {
        // Esmaece as outras para destacar a correta
        button.style.opacity = "0.5";
      }
    });
  };

  const handleAnswer = (selected, correct, questionText, btn) => {
    stopQuizLogic();
    [...optionsEl.children].forEach((b) => (b.disabled = true));
    const isCorrect = selected === correct;

    if (isCorrect) {
      score++;
      audioCorrect.currentTime = 0;
      audioCorrect.play();
      btn?.classList.add(
        "border-4",
        "border-green-500",
        "dark:border-green-700",
        "bg-green-200",
      );

      // Se acertou, vai para a próxima em 2s
      transitionTimeout = setTimeout(() => {
        current++;
        showQuestion();
      }, 2000);
    } else {
      audioIncorrect.currentTime = 0;
      audioIncorrect.play();
      wrongAnswers.push({ question: questionText, correct, selected });

      // Marca a errada imediatamente
      btn?.classList.add("border-4", "border-red-400", "bg-red-200");

      // Aguarda 300ms para mostrar a correta
      setTimeout(() => {
        showCorrectAnswer(correct);
      }, 300);

      // Dá mais tempo para o usuário ver a correção antes de passar
      transitionTimeout = setTimeout(() => {
        current++;
        showQuestion();
      }, 2000);
    }
  };

  const showQuestion = () => {
    stopQuizLogic(); // Para timers da questão anterior

    if (current >= quizData.length) return showResults();
    updateProgressBar();

    const { question_text, options, correct_answer, audio_path } =
      quizData[current];

    if (audio_path) {
      if (window.playAudio) {
        window.playAudio(audio_path);
      } else {
        const autoAudio = new Audio(audio_path);
        autoAudio
          .play()
          .catch((e) => console.log("Autoplay aguardando interação..."));
      }
    }

    wordEl.textContent = question_text;
    wordEl.onclick = () =>
      audio_path &&
      (window.playAudio
        ? window.playAudio(audio_path)
        : new Audio(audio_path).play());

    optionsEl.innerHTML = "";
    optionsEl.className = imageQuiz
      ? "grid grid-cols-2 gap-4"
      : "flex flex-col gap-3 w-full";

    options.forEach((option) => {
      const btn = document.createElement("button");

      // Options Button Design
      btn.className = imageQuiz
        ? "group relative overflow-hidden bg-slate-50 dark:bg-zinc-800/50 aspect-square rounded-[2rem] border border-slate-100 dark:border-zinc-800 hover:scale-105 transition-all p-2"
        : "group relative w-full text-center bg-background p-6 rounded-xl border-4 border-primary/10 hover:scale-105 transition-all duration-300";

      const span = document.createElement("span");
      span.textContent = option.text;

      // Options Text Design
      span.className =
        "text-sm font-bold tracking-tight text-black dark:text-white";

      if (imageQuiz && option.image) {
        const img = document.createElement("img");
        img.src = option.image;
        img.className = "w-full h-full object-cover rounded-[1.5rem]";
        btn.appendChild(img);
        span.className =
          "absolute bottom-4 left-4 right-4 text-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity";
      }

      btn.appendChild(span);
      btn.onclick = () =>
        handleAnswer(option.text, correct_answer, question_text, btn);
      optionsEl.appendChild(btn);
    });

    startTimer();
  };

  const showResults = () => {
    stopQuizLogic();
    const percent = Math.round((score / quizData.length) * 100);

    questionContainer.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
    muteBtn.classList.add("hidden");
    progressBar.style.width = "100%";

    finalScoreEl.innerHTML = `
      <div class="flex flex-col gap-1">
        <span>${score} / ${quizData.length}</span>
      </div>
    `;

    if (percent >= 80) {
      import("https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js").then(
        ({ default: confetti }) => {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#000000", "#ffffff", "#cccccc"],
          });
        },
      );
    }
  };

  async function loadAndStartQuiz() {
    stopQuizLogic();
    if (window.stopAllComponents) window.stopAllComponents();

    try {
      const data = await getQuizData(
        topic,
        questionLang,
        optionsLang,
        numQuestions,
      );
      if (!data.length) return;
      quizData = data;
      current = 0;
      score = 0;
      wrongAnswers = [];
      startTime = Date.now();

      resultsContainer.classList.add("hidden");
      questionContainer.classList.remove("hidden");
      muteBtn.classList.remove("hidden");
      modal.classList.remove("hidden");
      if (typeof modal.open === "function") modal.open();

      showQuestion();
    } catch (err) {
      console.error(err);
    }
  }

  closeBtn.addEventListener("click", closeQuiz);
  restartBtn.onclick = () => {
    current = 0;
    score = 0;
    startTime = Date.now();
    resultsContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    muteBtn.classList.remove("hidden");
    showQuestion();
  };

  muteBtn.innerHTML = window.isMuted ? ICONS.soundOff : ICONS.soundOn;
  muteBtn.onclick = () => {
    window.isMuted = window.toggleGlobalMute();
    muteBtn.innerHTML = window.isMuted ? ICONS.soundOff : ICONS.soundOn;
  };

  return { open: loadAndStartQuiz, close: closeQuiz, stop: stopQuizLogic };
}
