let currentIndex = 0;
let isRunning = false;
let setPlayIconCallback;

function stopCarouselSequence() {
  if (isRunning) {
    stopCurrentAudio();
    isRunning = false;
    if (setPlayIconCallback) {
      setPlayIconCallback();
    }
  }
}

function renderCarousel({ vocabulario, fromLang, toLang }) {
  window.registerStopFunction(stopCarouselSequence);
  
  const carousel = document.getElementById("carousel");
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const muteOffBtn = document.getElementById("muteOffBtn");
  const muteOnBtn = document.getElementById("muteOnBtn");
  const prevBtn = document = document.getElementById("prevBtn");
  const nextBtn = document = document.getElementById("nextBtn");

  const data = vocabulario.map((item) => ({
    text1: item[`text_${toLang}`] || "[Translate]]",
    text2: item[`text_${fromLang}`] || "[Text]",
    audio: item[`audio_${fromLang}`] || null,
  }));

  const playIconSVG = `<path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />`;
  const pauseIconSVG = `<path fill-rule="evenodd" d="M5.25 4.5A.75.75 0 0 1 6 3.75h3a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75v-15Zm9 0a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-15Z" clip-rule="evenodd"/>`;

  carousel.innerHTML = "";
  data.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "flex-shrink-0 w-full p-6 bg-gradient-to-br from-gray-800 to-gray-800 overflow-hidden shadow-xl border border-border/50 hover:shadow-2xl rounded-xl transition-all duration-300 text-center flex flex-col justify-between snap-center";
    card.innerHTML = `
    <div class="flex items-center justify-between mb-2">
      <div class="w-8 h-8 bg-gradient-to-r from-accent to-accent/70 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">${index + 1}</div>
      <div id="overlay-${index}" class="text-center font-bold text-accent"></div>
    </div>
    <div class="relative mb-2 flex-grow border-b my-1 flex flex-col justify-center">
      <div id="text2-${index}" class="text-3xl mb-4 font-bold text-white relative z-0">${item.text2}</div>
    </div>
    <div class="text-2xl text-white/80 mb-4 mt-4">${item.text1}</div>
    `;
    carousel.appendChild(card);
  });
  
  function setPlayIcon() {
    playIcon.innerHTML = playIconSVG;
  }

  function setPauseIcon() {
    playIcon.innerHTML = pauseIconSVG;
  }

  function toggleMuteButtons() {
    muteOnBtn.classList.toggle("hidden", isMuted);
    muteOffBtn.classList.toggle("hidden", !isMuted);
  }

  function updateCarousel() {
    const cards = carousel.children;
    if (cards[currentIndex]) {
      cards[currentIndex].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function fileExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error("Error verifying file:", error);
      return false;
    }
  }

  async function playAudioStep() {
    if (isRunning) {
      stopCarouselSequence();
      return;
    }
    
    window.stopAllComponents();

    isRunning = true;
    setPauseIcon();
    
    if (currentIndex >= data.length) {
      currentIndex = 0;
      updateCarousel();
      await sleep(400); 
    }

    while (currentIndex < data.length && isRunning) {
      const current = data[currentIndex];
      const overlay = document.getElementById(`overlay-${currentIndex}`);
      const audioExists = current.audio && await fileExists(current.audio);

      if (!audioExists) {
        if (overlay) overlay.classList.add("opacity-0");
        currentIndex++;
        await sleep(3000); // Wait time for words without sound
        updateCarousel();
        continue;
      }

      playAudio(current.audio);
      await new Promise(resolve => {
        globalAudioPlayer.onended = resolve;
      });

      if (!isRunning) { return; }

      if (overlay) {
        overlay.textContent = "REPEAT";
        overlay.classList.add("animate-pulse");
      }

      await sleep(3000);

      if (!isRunning) { return; }

      playAudio(current.audio);
      await new Promise(resolve => {
        globalAudioPlayer.onended = resolve;
      });

      if (!isRunning) { return; }

      if (overlay) {
        overlay.classList.remove("animate-pulse");
        overlay.classList.add("opacity-0");
      }

      currentIndex++;
      updateCarousel();
      await sleep(400);
    }

    isRunning = false;
    setPlayIcon();
  }

  function nextCard() {
    stopCarouselSequence();
    currentIndex = (currentIndex + 1) % data.length;
    updateCarousel();
  }

  function prevCard() {
    stopCarouselSequence();
    currentIndex = (currentIndex - 1 + data.length) % data.length;
    updateCarousel();
  }

  muteOnBtn.addEventListener("click", () => {
    isMuted = false;
    toggleGlobalMute();
    toggleMuteButtons();
  });

  muteOffBtn.addEventListener("click", () => {
    isMuted = true;
    toggleGlobalMute();
    toggleMuteButtons();
  });

  playBtn.addEventListener("click", playAudioStep);
  nextBtn.addEventListener("click", nextCard);
  prevBtn.addEventListener("click", prevCard);

  updateCarousel();
  toggleMuteButtons();
  setPlayIcon();
  setPlayIconCallback = setPlayIcon;
}

window.renderCarousel = renderCarousel;
