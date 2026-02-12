// V4
// Icons
const ICON_PLAY = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones-icon lucide-headphones"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
`;

const ICON_PAUSE = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
`;

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
  playButton.className =
    "p-3 rounded-full bg-white/5 group-hover:bg-white text-white group-hover:text-black transition-all flex-shrink-0";
  playButton.innerHTML = ICON_PLAY;

  playButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentAudio && currentButton === playButton) {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();
    const audio = new Audio(audioSrc);
    currentAudio = audio;
    currentButton = playButton;
    playButton.innerHTML = ICON_PAUSE;

    audio.play().catch(() => stopCurrentAudio());
    audio.addEventListener("ended", stopCurrentAudio);
    audio.addEventListener("pause", stopCurrentAudio);
  });

  return playButton;
}

// Cria o item
function createVocabItemElement(item, fromLang, toLang) {
  const fromText = sanitizeText(item[`text_${fromLang}`] || "");
  const toText = sanitizeText(item[`text_${toLang}`] || "");
  const audioSrc = item[`audio_${toLang}`] || null;

  // Container Principal
  const wrapper = document.createElement("div");
  wrapper.className =
    "glass-card p-5 rounded-[2rem] flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer";

  // Lado Esquerdo => Textos e Indicador
  const infoContainer = document.createElement("div");
  infoContainer.className = "flex items-center gap-4";

  const textGroup = document.createElement("div");

  // Toque para ouvir
  const hintText = document.createElement("p");
  hintText.className = "text-xs text-gray-400 flex items-center gap-1";
  hintText.innerHTML =
    '<span class="w-2 h-2 rounded-full bg-green-500"></span> Toque para ouvir';

  // Se não houver SRC de áudio, ocultamos a frase de dica
  if (!audioSrc || audioSrc === "vazio") {
    hintText.style.display = "none";
  }

  // Texto Principal
  const mainText = document.createElement("h4");
  mainText.className = "font-bold text-lg text-primary capitalize";
  mainText.textContent = toText;

  // Tradução
  const subText = document.createElement("p");
  subText.className = "text-sm text-gray-500 italic capitalize";
  subText.textContent = fromText;

  textGroup.append(hintText, mainText, subText);
  infoContainer.append(textGroup);
  wrapper.append(infoContainer);

  // Armazenamento para verificação
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
      '<p class="text-primary p-4">Nenhum item encontrado.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  const elements = vocabulario.map((item) =>
    createVocabItemElement(item, fromLang, toLang),
  );

  elements.forEach((el) => fragment.appendChild(el));
  container.innerHTML = "";
  container.appendChild(fragment);

  // Verificação de áudios
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
    } else {
      // Se o arquivo não existir remove a dica de áudio
      const hint = card.querySelector("p");
      if (hint) hint.style.display = "none";
    }

    delete card.dataset.audioSrc;
    card.classList.remove("has-audio");
  });

  Promise.allSettled(checks);
}

window.renderVocabulario = renderVocabulario;
