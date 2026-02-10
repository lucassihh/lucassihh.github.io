// Icons
const PLAY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
</svg>
`;

const PAUSE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
`;

const GRAMMAR_NOTE_CLASS = "font-bold text-primary";

function createPlayIconHtml(text, langCode) {
  return `
    <span 
      class="play-icon cursor-pointer ml-2 text-primary/70 hover:text-primary transition-colors"
      data-text="${text}"
      data-lang="${langCode}"
      title="Ouvir"
    >
      ${PLAY_SVG}
    </span>
  `;
}

// Função para formatar e limpar o texto
function formatGrammarNotes(text) {
  if (!text) return "N/A";

  let formattedText = text.replace(
    /(\[[^\]]*\])/g,
    `<span class="${GRAMMAR_NOTE_CLASS}">$1</span>`,
  );

  formattedText = formattedText.replace(
    /(\([^)]*\))/g,
    `<span class="${GRAMMAR_NOTE_CLASS}">$1</span>`,
  );

  return formattedText;
}

function cleanTextForSpeech(text) {
  if (!text) return "";

  let cleanedText = text.replace(/\[[^\]]*\]/g, "");
  cleanedText = cleanedText.replace(/\([^)]*\)/g, "");
  return cleanedText.trim();
}

function generateTableHTML(data, fromDetails, toDetails) {
  const fromKey = fromDetails.jsonKey;
  const toKey = toDetails.jsonKey;
  const toVoiceLang = toDetails.voiceLang;

  const rowsHTML = data
    .map((item) => {
      const fromTextRaw = item[fromKey] || "N/A";
      const fromText = formatGrammarNotes(fromTextRaw);

      const toTextRaw = item[toKey] || "N/A";
      const toText = formatGrammarNotes(toTextRaw);

      const playIcon = createPlayIconHtml(toTextRaw, toVoiceLang);

      return `
      <tr class="hover:bg-primary/10 text-center">
        <td class="py-4 px-2 whitespace-nowrap text-md font-medium text-primary">${fromText}</td>
        <td class="py-4 pl-6 px-2 whitespace-nowrap text-md text-muted-foreground flex items-center">
          ${toText} ${playIcon}
        </td>
      </tr>
    `;
    })
    .join("");

  return `
    <div class="overflow-x-auto relative">
      <table class="w-full text-center">
        <tbody class="text-center">
          ${rowsHTML}
        </tbody>
      </table>
    </div>
  `;
}

function attachSpeechSynthesisListeners(containerId) {
  const playIcons = document.querySelectorAll(`#${containerId} .play-icon`);
  let isSpeaking = false;

  playIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const textRaw = target.dataset.text;
      const lang = target.dataset.lang;
      const text = cleanTextForSpeech(textRaw);

      if (!text || !lang || isSpeaking) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        return;
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text); // Usa o texto limpo

        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find((v) => v.lang === lang) || null;

        if (voice) {
          utterance.voice = voice;
        } else {
          utterance.lang = lang;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
          isSpeaking = true;
          target.innerHTML = PAUSE_SVG;
          target.title = "Falando...";
        };

        utterance.onend = () => {
          isSpeaking = false;
          target.innerHTML = PLAY_SVG;
          target.title = "Ouvir";
        };

        utterance.onerror = (event) => {
          isSpeaking = false;
          console.error("Speech Synthesis Error:", event.error);
          target.innerHTML = PLAY_SVG;
          target.title = "Ouvir (Erro)";
        };

        window.speechSynthesis.speak(utterance);
      } else {
        console.warn(
          "A API de Síntese de Fala não é suportada neste navegador.",
        );
      }
    });
  });
}

export async function initializeModuleTable(
  moduleName,
  fromDetails,
  toDetails,
) {
  const jsonPath = `../../../data/grammar/${moduleName}.json`;
  const container = document.getElementById(moduleName);

  if (!container) {
    console.warn(
      `Div de destino com ID '${moduleName}' não encontrada. Pulando módulo.`,
    );
    return;
  }

  // Mensagem de carregamento
  container.innerHTML = `<p class="p-4 text-muted-foreground">Carregando ${moduleName}...</p>`;

  try {
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(`Erro ao carregar ${jsonPath}: ${response.statusText}`);
    }
    const data = await response.json();

    const tableHTML = generateTableHTML(data, fromDetails, toDetails);
    container.innerHTML = tableHTML;

    attachSpeechSynthesisListeners(moduleName);
  } catch (error) {
    console.error(`Erro ao inicializar a tabela de ${moduleName}:`, error);
    container.innerHTML = `<p class="p-4 text-red-500">Não foi possível carregar o conteúdo de ${moduleName}: ${error.message}</p>`;
  }
}
