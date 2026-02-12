// V2

const ICONS = {
  play: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>`,
  pause: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>`,
  prev: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>`,
  next: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>`,
  flip: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>`,
};

export function initializeFlashcards(data, fromLang, toLang) {
  if (document.getElementById("flashcards-modal")) return;

  let currentIndex = 0;
  let isFlipped = false;
  let isPlaying = false;
  let currentAudio = null;

  const modalHTML = `
    <div id="flashcards-modal" class="modal fixed inset-0 flex items-center justify-center z-[100] hidden px-4">
     
      <div class="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"></div>
      
      <div class="modal-dialog w-full max-w-2xl relative flex flex-col gap-8 p-8 bg-[#120d1d] rounded-xl border border-white/20 shadow-sm transition-all duration-300">
        
        <div class="flex items-center justify-between">
          <button id="flashcard-play" class="size-12 relative overflow-hidden ripple-btn p-2 rounded-full glass-card">
            ${ICONS.play}
          </button>
          <div id="flashcard-progress" class="text-lg font-black uppercase tracking-[0.2em] text-slate-400"></div>
          <button data-modal-close class="size-12 relative overflow-hidden ripple-btn p-2 rounded-full glass-card">
            ${ICONS.close}
          </button>
        </div>

        <div id="flashcard-scene" class="w-full h-[30rem] cursor-pointer group" style="perspective: 1200px;">
          <div id="flashcard-inner" class="relative w-full h-full transition-transform duration-700 rounded-xl" style="transform-style: preserve-3d;">
            
            <div class="absolute inset-0 w-full h-full flex items-center justify-center p-12" style="backface-visibility: hidden;">
              <span id="flashcard-front-text" class="text-3xl md:text-5xl font-black text-center tracking-tighter text-primary"></span>
            </div>
            
            <div class="absolute inset-0 w-full h-full flex items-center justify-center p-12 bg-primary/80 text-secondary rounded-xl" style="backface-visibility: hidden; transform: rotateY(180deg);">
              <span id="flashcard-back-text" class="text-3xl md:text-5xl font-black text-center tracking-tighter"></span>
            </div>

          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex gap-2">
            <button id="flashcard-prev" class="size-14 flex items-center justify-center rounded-2xl border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
              ${ICONS.prev}
            </button>
            <button id="flashcard-next" class="size-14 flex items-center justify-center rounded-2xl border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
              ${ICONS.next}
            </button>
          </div>
          
          <button id="flashcard-flip" class="flex-1 h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10">
            ${ICONS.flip}
            <span>Flip</span>
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

    // Reset do Flip ao mudar de carta
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
