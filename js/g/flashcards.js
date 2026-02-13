// V3 ( Optimized )

const ICONS = {
  play: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>`,
  pause: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause-icon lucide-pause text-orange-400"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>`,
  prev: `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-big-left-dash-icon lucide-arrow-big-left-dash"><path d="M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h2a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"/><path d="M20 9v6"/></svg>`,
  next: `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-big-right-dash-icon lucide-arrow-big-right-dash"><path d="M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H9a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"/><path d="M4 9v6"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minimize2-icon lucide-minimize-2"><path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/></svg>`,
  flip: `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-copy-icon lucide-book-copy"><path d="M5 7a2 2 0 0 0-2 2v11"/><path d="M5.803 18H5a2 2 0 0 0 0 4h9.5a.5.5 0 0 0 .5-.5V21"/><path d="M9 15V4a2 2 0 0 1 2-2h9.5a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-.5.5H11a2 2 0 0 1 0-4h10"/></svg>`,
};

export function initializeFlashcards(data, fromLang, toLang) {
  if (document.getElementById("flashcards-modal")) return;

  let currentIndex = 0;
  let isFlipped = false;
  let isPlaying = false;
  let currentAudio = null;

  const modalHTML = `
    <div id="flashcards-modal" class="modal fixed inset-0 flex items-center justify-center z-40 hidden px-4">
     
      <div class="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"></div>
      
      <div class="modal-dialog w-full max-w-2xl relative flex flex-col gap-8 bg-[#120d1d]/70 backdrop-blur-lg rounded-[1.5rem] border border-white/20 shadow-sm transition-all duration-300">
        
        <!-- Buttons -->
        <div class="flex items-center justify-between p-8">
          <button id="flashcard-play" class="flex items-center justify-center text-white hover:scale-105 transition-all duration-300">
            ${ICONS.play}
          </button>
          <div id="flashcard-progress" class="text-lg font-black text-white"></div>
          <button data-modal-close class="flex items-center justify-center text-white hover:scale-105 transition-all duration-300">
            ${ICONS.close}
          </button>
        </div>

        <!-- Main Design -->
        <div id="flashcard-scene" class="w-full h-[30rem] group p-4" style="perspective: 1200px;">
          <div id="flashcard-inner" class="relative w-full h-full transition-transform duration-700 rounded-xl" style="transform-style: preserve-3d;">
            <div class="absolute inset-0 w-full h-full flex items-center justify-center p-12" style="backface-visibility: hidden;">
              <span id="flashcard-front-text" class="text-3xl md:text-5xl font-black text-center tracking-tighter text-primary"></span>
            </div>
            
            <div class="absolute inset-0 w-full h-full flex items-center justify-center p-12 bg-orange-400 text-secondary rounded-xl" style="backface-visibility: hidden; transform: rotateY(180deg);">
              <span id="flashcard-back-text" class="text-3xl md:text-5xl font-black text-center tracking-tighter"></span>
            </div>
          </div>
        </div>
       
        <!-- Bottom Buttons -->
        <div class="flex items-center justify-between gap-4 p-6">
          <div class="flex gap-2">
            <button id="flashcard-prev" class="flex items-center justify-center text-white hover:scale-110 hover:bg-orange-400 rounded-full p-1 transition-all duration-300">
              ${ICONS.prev}
            </button>
            <button id="flashcard-next" class="flex items-center justify-center text-white hover:scale-110 hover:bg-orange-400 rounded-full p-1 transition-all duration-300">
              ${ICONS.next}
            </button>
          </div>
          <button id="flashcard-flip" class="flex items-center justify-center text-white hover:scale-110 hover:bg-orange-400 rounded-full p-2 transition-all duration-300">
            ${ICONS.flip}
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const openBtn = document.getElementById("open-flashcards-modal");
  const modal = document.getElementById("flashcards-modal");
  const closeBtn = modal.querySelector("[data-modal-close]");
  const overlay = modal.querySelector(".modal-overlay");
  const cardScene = document.getElementById("flashcard-scene");
  const cardInner = document.getElementById("flashcard-inner");
  const frontText = document.getElementById("flashcard-front-text");
  const backText = document.getElementById("flashcard-back-text");
  const prevBtn = document.getElementById("flashcard-prev");
  const nextBtn = document.getElementById("flashcard-next");
  const playBtn = document.getElementById("flashcard-play");
  const flipBtn = document.getElementById("flashcard-flip");
  const progressIndicator = document.getElementById("flashcard-progress");

  function renderCard(index) {
    const item = data[index];
    if (!item) return;
    frontText.textContent = item[`text_${fromLang}`];
    backText.textContent = item[`text_${toLang}`];
    progressIndicator.textContent = `${index + 1} / ${data.length}`;

    // Reset Flip
    isFlipped = false;
    cardInner.style.transform = "rotateY(0deg)";
  }

  function flipCard() {
    isFlipped = !isFlipped;
    cardInner.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
  }

  function playAudio(audioSrc) {
    return new Promise((resolve) => {
      if (!audioSrc) {
        resolve();
        return;
      }
      currentAudio = new Audio(audioSrc);
      currentAudio.onended = resolve;
      currentAudio.onerror = () => resolve();
      currentAudio.play();
    });
  }

  async function playSequence() {
    isPlaying = true;
    playBtn.innerHTML = ICONS.pause;
    [prevBtn, nextBtn, flipBtn].forEach((el) => (el.style.opacity = "0.5"));

    for (let i = currentIndex; i < data.length; i++) {
      if (!isPlaying) break;

      currentIndex = i;
      renderCard(currentIndex);
      await new Promise((r) => setTimeout(r, 500));

      const item = data[i];
      const frontAudio = item[`audio_${fromLang}`];
      const backAudio = item[`audio_${toLang}`];

      if (isFlipped) flipCard();
      await playAudio(frontAudio);
      if (!isPlaying) break;

      await new Promise((r) => setTimeout(r, 2000));
      if (!isPlaying) break;

      flipCard();
      await new Promise((r) => setTimeout(r, 700));
      if (!isPlaying) break;

      await playAudio(backAudio);
      await new Promise((r) => setTimeout(r, 3000));
    }
    stopPlayback();
  }

  function stopPlayback() {
    isPlaying = false;
    playBtn.innerHTML = ICONS.play;
    [prevBtn, nextBtn, flipBtn].forEach((el) => (el.style.opacity = "1"));

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  }

  function stopAndCloseFlashcards() {
    stopPlayback();
    modal.classList.add("hidden");
    if (typeof modal.close === "function") modal.close();
  }

  if (openBtn) {
    openBtn.onclick = () => {
      currentIndex = 0;
      renderCard(currentIndex);
      modal.classList.remove("hidden");
      if (typeof modal.open === "function") modal.open();
    };
  }

  closeBtn?.addEventListener("click", stopAndCloseFlashcards);
  overlay?.addEventListener("click", stopAndCloseFlashcards);

  function handleInteraction(actionFn) {
    stopPlayback();
    actionFn();
  }

  cardScene.onclick = () => handleInteraction(flipCard);
  flipBtn.onclick = () => handleInteraction(flipCard);

  nextBtn.onclick = () =>
    handleInteraction(() => {
      currentIndex = (currentIndex + 1) % data.length;
      renderCard(currentIndex);
    });

  prevBtn.onclick = () =>
    handleInteraction(() => {
      currentIndex = (currentIndex - 1 + data.length) % data.length;
      renderCard(currentIndex);
    });

  playBtn.onclick = () => (isPlaying ? stopPlayback() : playSequence());

  return {
    open: () => {
      currentIndex = 0;
      renderCard(0);
      modal.classList.remove("hidden");
      if (typeof modal.open === "function") modal.open();
    },
    close: stopAndCloseFlashcards,
    stop: stopPlayback,
  };
}
