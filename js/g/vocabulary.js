// Icons
const ICON_PLAY = `
<svg xmlns="http://www.w3.org/2000/svg" class="size-6" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2"/><path stroke-dasharray="4 3" stroke-linecap="round" d="M12 22C6.477 22 2 17.523 2 12S6.977 2 12.5 2" opacity="0.5"/><path d="M15.414 10.941c.781.462.781 1.656 0 2.118l-4.72 2.787C9.934 16.294 9 15.71 9 14.786V9.214c0-.924.934-1.507 1.694-1.059z"/></g></svg>

`;

const ICON_PAUSE = `
<svg xmlns="http://www.w3.org/2000/svg" class="size-6" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6c0-1.886 0-2.828.586-3.414S4.114 2 6 2s2.828 0 3.414.586S10 4.114 10 6v12c0 1.886 0 2.828-.586 3.414S7.886 22 6 22s-2.828 0-3.414-.586S2 19.886 2 18z"/><path fill="currentColor" d="M14 6c0-1.886 0-2.828.586-3.414S16.114 2 18 2s2.828 0 3.414.586S22 4.114 22 6v12c0 1.886 0 2.828-.586 3.414S19.886 22 18 22s-2.828 0-3.414-.586S14 19.886 14 18z" opacity="0.5"/></svg>
`;

let currentAudio = null;
let currentButton = null;

const FLAG_MAP = {
  indonesian: "id",
  tagalog: "ph",
  portuguese: "br",
  english: "us",
  spanish: "es",
};

function getFlagSrc(lang) {
  const flagCode = FLAG_MAP[lang.toLowerCase()] || "us";
  // Flag folder
  return `../../../assets/flag/${flagCode}.svg`;
}

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
} else {
  // console.warn('window.registerStopFunction não está definida. A função de parada global não foi registrada.');
}

// Verifica se arquivo existe
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
  const playButton = document.createElement("div");
  playButton.className =
    "text-primary rounded-full p-1 play-audio-btn flex-shrink-0 hover:scale-105 transition-all duration-200";
  playButton.innerHTML = ICON_PLAY;

  playButton.addEventListener("click", () => {
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

// Cria rapidamente o item (sem esperar áudio)
function createVocabItemElement(item, fromLang, toLang) {
  const fromText = sanitizeText(item[`text_${fromLang}`] || "");
  const toText = sanitizeText(item[`text_${toLang}`] || "");
  const audioSrc = item[`audio_${toLang}`] || null;

  // Div principal para as Frases
  const wrapper = document.createElement("div");
  wrapper.className =
    "relative flex flex-col items-center p-4 border-4 border-gray-200/70 rounded-full bg-secondary/50";

  // fromLang (Idioma de Origem)
  const fromContainer = document.createElement("div");
  fromContainer.className = "flex items-center gap-2";

  const fromFlag = document.createElement("img");

  fromFlag.className =
    "size-4 border border-white rounded-full object-cover shadow-sm";
  fromFlag.src = getFlagSrc(fromLang);

  const fromTextElem = document.createElement("p");
  fromTextElem.className = "text-md capitalize text-primary/80";
  fromTextElem.textContent = fromText;

  fromContainer.append(fromFlag, fromTextElem);

  // toLang (Tradução e Áudio)
  const toContainer = document.createElement("div");
  toContainer.className = "flex items-center gap-2 mt-1";

  const toFlag = document.createElement("img");
  toFlag.className =
    "size-5 border border-white rounded-full object-cover shadow-sm";
  toFlag.src = getFlagSrc(toLang);

  const toTextElem = document.createElement("p");
  toTextElem.className = "text-lg text-primary capitalize"; // flex-grow para empurrar o botão para o final
  toTextElem.textContent = toText;

  // Bandeira e texto da tradução
  toContainer.append(toFlag, toTextElem);

  // Anexar os containers ao wrapper principal
  wrapper.append(fromContainer, toContainer);

  // Adiciona atributo temporário
  // ALTERAÇÃO 3: Armazenamos o SRC no toContainer para que o check assíncrono possa injetar o botão no local correto
  if (audioSrc && audioSrc !== "vazio") {
    toContainer.dataset.audioSrc = audioSrc;
    // Adiciona classe para indicar que terá um botão (útil para estilos ou testes)
    toContainer.classList.add("has-audio");
  }

  return wrapper;
}

// Renderização otimizada com verificação assíncrona
export async function renderVocabulario({
  vocabulario,
  containerId,
  fromLang = "indonesian",
  toLang = "portuguese",
}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID '${containerId}' not found.`);
    return;
  }

  if (!Array.isArray(vocabulario) || vocabulario.length === 0) {
    container.innerHTML =
      '<p class="text-primary p-4">No vocabulary items found for this topic.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  const elements = vocabulario.map((item) =>
    createVocabItemElement(item, fromLang, toLang),
  );

  for (const el of elements) fragment.appendChild(el);
  container.appendChild(fragment);

  // Verifica os áudios em segundo plano
  // ALTERAÇÃO 4: Busca os elementos que serão o alvo do botão de play
  const audioTargetContainers = elements
    .map((el) => el.querySelector(".has-audio"))
    .filter((c) => c);

  const checks = audioTargetContainers.map(async (targetContainer) => {
    const src = targetContainer.dataset.audioSrc;
    if (src) {
      const exists = await checkAudioExists(src);
      if (exists) {
        const playBtn = createPlayButton(src);
        // Insere o botão no final do contêiner flex
        targetContainer.appendChild(playBtn);
      }
      // Limpa os atributos temporários
      delete targetContainer.dataset.audioSrc;
      targetContainer.classList.remove("has-audio");
    }
  });

  // Não bloqueia a interface
  Promise.allSettled(checks);
}

window.renderVocabulario = renderVocabulario;
