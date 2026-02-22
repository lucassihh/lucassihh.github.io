// Imports Grammar components
import { initializeAlphabet } from "./alphabet.js";
import { initializeModuleTable } from "./table.js";

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
    initializeAlphabet(grammarFrom, grammarTo);
    
    const fromDetails = getLanguageDetails(grammarFrom);
    const toDetails = getLanguageDetails(grammarTo);

    if (!fromDetails || !toDetails) {
      console.error(
        `Detalhes dos idiomas: '${grammarFrom}' ou '${grammarTo}' não mapeados`,
      );
      return;
    }

    const modulePromises = MODULES_TO_LOAD.map((moduleName) =>
      initializeModuleTable(moduleName, fromDetails, toDetails),
    );

    await Promise.all(modulePromises);
  } catch (error) {
    console.error("Error initializing learning page:", error);
    alert("Error initializing learning page: " + error.message);
  }
}
