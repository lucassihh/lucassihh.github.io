let currentIndex = 0;
let isRunning = false;

function renderCarousel({ vocabulario, fromLang, toLang }) {
  const carousel = document.getElementById("carousel");
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const muteOffBtn = document.getElementById("muteOffBtn");
  const muteOnBtn = document.getElementById("muteOnBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const data = vocabulario.map((item) => ({
    text1: item[`text_${toLang}`] || "[sem texto]",
    text2: item[`text_${fromLang}`] || "[sem tradução]",
    audio: item[`audio_${fromLang}`] || null,
  }));

  const playIconSVG = `<path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />`;
  const pauseIconSVG = `<path fill-rule="evenodd" d="M5.25 4.5A.75.75 0 0 1 6 3.75h3a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75v-15Zm9 0a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-15Z" clip-rule="evenodd"/>`;

  carousel.innerHTML = "";
  data.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "flex-shrink-0 w-full border border-white/5 bg-white bg-opacity-5 backdrop-filter md:backdrop-blur-lg rounded-lg shadow-2xl p-6 text-center flex flex-col justify-between snap-center";
    card.innerHTML = `
      <div class="text-left text-md text-white mb-2">${index + 1}/${data.length}</div>
      <div class="relative mb-2 flex-grow border-b border-gray-200 my-1 flex flex-col justify-center">
        <div id="overlay-${index}" class="text-center text-extrabold text-white opacity-0"></div>
        <div id="text2-${index}" class="text-2xl mb-2 font-semibold gradient-text relative z-0">${item.text2}</div>
      </div>
      <div class="text-base text-md text-white/90 mb-6">${item.text1}</div>
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

  function clearAudio() {
    stopCurrentAudio();
    isRunning = false;
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
      console.error("Erro ao verificar o arquivo:", error);
      return false;
    }
  }

  async function playAudioStep() {
    if (isRunning) {
      clearAudio();
      setPlayIcon();
      return;
    }

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
        updateCarousel();
        await sleep(4000); 
        continue;
      }

      if (overlay) {
        // overlay.textContent = "LISTEN";
        // overlay.classList.remove("opacity-0", "animate-pulse");
      }
      
      playAudio(current.audio);
      await new Promise(resolve => {
        globalAudioPlayer.onended = resolve;
      });

      if (overlay) {
        overlay.textContent = "REPEAT";
        overlay.classList.add("animate-pulse");
      }

      await sleep(3000);

      playAudio(current.audio);
      await new Promise(resolve => {
        globalAudioPlayer.onended = resolve;
      });

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
    clearAudio();
    setPlayIcon();
    currentIndex = (currentIndex + 1) % data.length;
    updateCarousel();
  }

  function prevCard() {
    clearAudio();
    setPlayIcon();
    currentIndex = (currentIndex - 1 + data.length) % data.length;
    updateCarousel();
  }

  // Lógica mute e unmute
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
}