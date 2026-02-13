// V3 ( Optimized )

// Icons
const ICON_PLAY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-10 p-2 bg-white/5 rounded-full group-hover:scale-110 transition-all duration-300"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>`;

const ICON_PAUSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-10 p-2 bg-white text-black rounded-full hover:scale-110 transition-all duration-300 animate-bounce"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>`;

let currentAudio = null;
let currentButton = null;

function sanitizeText(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (currentButton) {
    currentButton.innerHTML = ICON_PLAY;
    
    // Remove bg-white/5 Wrapper When Stop
    const parentWrapper = currentButton.closest('.group');
    if (parentWrapper) {
      parentWrapper.classList.remove('bg-white/5');
    }
    
    currentButton = null;
  }
}

if (typeof window.registerStopFunction === "function") {
  window.registerStopFunction(stopCurrentAudio);
}

async function checkAudioExists(url) {
  try {
    if (!url || typeof url !== "string") return false;
    const response = await fetch(url, { method: "HEAD" });
    return (
      response.ok && response.headers.get("content-type")?.includes("audio")
    );
  } catch {
    return false;
  }
}

function createPlayButton(audioSrc) {
  const playButton = document.createElement("button");
  playButton.className = "flex items-center justify-center flex-shrink-0";
  playButton.innerHTML = ICON_PLAY;

  playButton.addEventListener("click", (e) => {
    e.stopPropagation();
    
    // Reference to Wrapper(Main Div)
    const parentWrapper = playButton.closest('.group');

    if (currentAudio && currentButton === playButton) {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();
    
    const audio = new Audio(audioSrc);
    currentAudio = audio;
    currentButton = playButton;
    playButton.innerHTML = ICON_PAUSE;

    // Set bg-white/5 if Playing
    if (parentWrapper) {
      parentWrapper.classList.add('bg-white/5');
    }

    audio.play().catch(() => stopCurrentAudio());
    audio.addEventListener("ended", stopCurrentAudio);
    audio.addEventListener("pause", stopCurrentAudio);
  });

  return playButton;
}

// Create Item
function createVocabItemElement(item, fromLang, toLang) {
  const fromText = sanitizeText(item[`text_${fromLang}`] || "");
  const toText = sanitizeText(item[`text_${toLang}`] || "");
  const audioSrc = item[`audio_${toLang}`] || null;

  // Main Div
  const wrapper = document.createElement("div");
  wrapper.className =
    "p-5 rounded-[2rem] flex items-center justify-between group hover:bg-white/5 transition-all duration-300 cursor-pointer";

  // Left => 
  const infoContainer = document.createElement("div");
  infoContainer.className = "flex items-center gap-4";

  const textGroup = document.createElement("div");

  // Click to Listen
  const hintText = document.createElement("p");
  hintText.className = "text-xs text-gray-400 flex items-center gap-1";
  hintText.innerHTML =
    '<span class="size-2 rounded-full bg-green-500"></span>Toque para ouvir';

  // If dont have audio SRC => hidden 
  if (!audioSrc || audioSrc === "vazio") {
    hintText.style.display = "none";
  }

  // Main Text
  const mainText = document.createElement("h4");
  mainText.className = "font-bold text-lg text-white capitalize";
  mainText.textContent = toText;

  // Translate
  const subText = document.createElement("p");
  subText.className = "text-sm text-gray-500 italic capitalize";
  subText.textContent = fromText;

  textGroup.append(hintText, mainText, subText);
  infoContainer.append(textGroup);
  wrapper.append(infoContainer);

  // Verifying Audio
  if (audioSrc && audioSrc !== "vazio") {
    wrapper.dataset.audioSrc = audioSrc;
    wrapper.classList.add("has-audio");
  }

  return wrapper;
}

export async function renderVocabulario({
  vocabulario,
  containerId,
  fromLang = "indonesian",
  toLang = "portuguese",
}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!Array.isArray(vocabulario) || vocabulario.length === 0) {
    container.innerHTML =
      '<p class="text-primary p-4">Item not found</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  const elements = vocabulario.map((item) =>
    createVocabItemElement(item, fromLang, toLang),
  );

  elements.forEach((el) => fragment.appendChild(el));
  container.innerHTML = "";
  container.appendChild(fragment);

  // Verifying if has audio
  const audioItems = elements.filter((el) =>
    el.classList.contains("has-audio"),
  );

  const checks = audioItems.map(async (card) => {
    const src = card.dataset.audioSrc;
    const exists = await checkAudioExists(src);

    if (exists) {
      const playBtn = createPlayButton(src);
      card.appendChild(playBtn);
      const hint = card.querySelector("p");
      if (hint) hint.style.display = "flex";
      // card.addEventListener("click", () => playBtn.click());
    } else {
      // If dont have audio file, hidden the text
      const hint = card.querySelector("p");
      if (hint) hint.style.display = "none";
    }

    delete card.dataset.audioSrc;
    card.classList.remove("has-audio");
  });

  Promise.allSettled(checks);
}

window.renderVocabulario = renderVocabulario;
