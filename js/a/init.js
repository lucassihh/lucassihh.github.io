// init.js (Atualizado)

import { initializeAlphabet } from "./alphabet.js";
import { initializeModuleTable } from "./tableG.js";

// Lista de todos os módulos/arquivos JSON a serem carregados
const MODULES_TO_LOAD = [
  "adjectives",
  "adverbs",
  "articles",
  "f-m",
  "negation",
  "nouns",
  "plural",
  "prefixes",
  "prepositions",
  "pronouns",
  "verbs",
];

/**
 * Mapeamento de idiomas (mantido inalterado)
 */
function getLanguageDetails(langCode) {
  const details = {
    english: {
      name: "English",
      jsonKey: "text_english",
      flagPath: "../../../assets/flag/us.svg",
      voiceLang: "en-US",
    },
    indonesian: {
      name: "Indonesian",
      jsonKey: "text_indonesian",
      flagPath: "../../../assets/flag/id.svg",
      voiceLang: "id-ID",
    },
    // ... (outros idiomas) ...
    portuguese: {
      name: "Portuguese",
      jsonKey: "text_portuguese",
      flagPath: "../../../assets/flag/br.svg",
      voiceLang: "pt-BR",
    },
    spanish: {
      name: "Spanish",
      jsonKey: "text_spanish",
      flagPath: "../../../assets/flag/es.svg",
      voiceLang: "es-ES",
    },
    tagalog: {
      name: "Tagalog",
      jsonKey: "text_tagalog",
      flagPath: "../../../assets/flag/ph.svg",
      voiceLang: "fil-PH",
    },
  };

  return details[langCode] || null;
}

export async function initializeLearningPage(grammarFrom, grammarTo) {
  try {
    // 1. Inicializa o Alfabeto (mantido)
    initializeAlphabet(grammarFrom, grammarTo);

    // 2. Mapeia os detalhes dos idiomas
    const fromDetails = getLanguageDetails(grammarFrom);
    const toDetails = getLanguageDetails(grammarTo);

    if (!fromDetails || !toDetails) {
      console.error(
        `Detalhes dos idiomas: '${grammarFrom}' ou '${grammarTo}' não mapeados. Interrompendo a carga das tabelas.`,
      );
      return;
    }

    // 3. Inicializa TODOS os módulos em paralelo
    // Cria um array de promessas, uma para cada tabela
    const modulePromises = MODULES_TO_LOAD.map((moduleName) =>
      initializeModuleTable(moduleName, fromDetails, toDetails),
    );

    // Aguarda a conclusão de todas as promessas
    await Promise.all(modulePromises);

    console.log(
      "Todos os módulos de gramática foram carregados ou ignorados (se a div não existia).",
    );
  } catch (error) {
    console.error("Error initializing learning page:", error);
    alert("Error initializing learning page: " + error.message);
  }
}
