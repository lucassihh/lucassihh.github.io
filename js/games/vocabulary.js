/* eslint-disable no-console */

// Constante para o ícone de reprodução
const ICON_PLAY = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="flex items-center justify-center transition-all duration-300 text-white hover:text-primary hover:bg-primary hover:ring hover:ring-primary/30 size-6 rounded-full">
    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clip-rule="evenodd" />
  </svg>
`;

// Esta função já está presente e não foi alterada.
function stopVocabularyAudio() {
    stopCurrentAudio();
}

window.registerStopFunction(stopVocabularyAudio);

// Esta função já está presente e não foi alterada.
async function checkAudioExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error verifying audio file:', error);
    return false;
  }
}

/**
 * Cria um elemento div para um item de vocabulário.
 * Usa métodos DOM como `createElement` e `appendChild` para maior segurança e performance.
 * @param {object} item - O objeto de dados do vocabulário.
 * @param {string} fromLang - Idioma de origem.
 * @param {string} toLang - Idioma de destino.
 * @returns {Promise<HTMLDivElement>} - Uma promessa que resolve para o elemento DOM.
 */
async function createVocabItemElement(item, fromLang, toLang) {
    const fromText = item[`text_${fromLang}`] || '';
    const toText = item[`text_${toLang}`] || '';
    const audioSrc = item[`audio_${fromLang}`] || null;

    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col bg-white/10 border border-border/30 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-white transition-all duration-300 relative';

    const fromTextElem = document.createElement('p');
    fromTextElem.className = 'font-bold text-white';
    fromTextElem.textContent = fromText;
    
    const toTextElem = document.createElement('p');
    toTextElem.className = 'text-sm text-white/80';
    toTextElem.textContent = toText;

    wrapper.appendChild(fromTextElem);
    wrapper.appendChild(toTextElem);

    if (audioSrc && audioSrc !== 'vazio') {
        const hasAudio = await checkAudioExists(audioSrc);
        if (hasAudio) {
            const playButton = document.createElement('div');
            playButton.className = 'absolute right-2 top-1/2 -translate-y-1/2 play-audio-btn cursor-pointer';
            playButton.innerHTML = ICON_PLAY;

            playButton.addEventListener('click', () => {
                if (window.stopAllComponents) {
                    window.stopAllComponents();
                }
                playAudio(audioSrc);
            });
            wrapper.appendChild(playButton);
        }
    }

    return wrapper;
}

/**
 * Renderiza a lista de vocabulário na página.
 * A função é assíncrona para permitir a verificação de áudio.
 * @param {object} params - Parâmetros para a renderização.
 */
async function renderVocabulario({
    vocabulario,
    containerId,
    fromLang = 'indonesian',
    toLang = 'portuguese',
}) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
    }

    const vocabularyItems = Array.isArray(vocabulario) ? vocabulario : [];

    if (vocabularyItems.length === 0) {
        container.innerHTML = '<p class="text-gray-700">No vocabulary items found for this topic.</p>';
        return;
    }

    container.innerHTML = '';
    
    // Renderização assíncrona dos itens
    for (const item of vocabularyItems) {
        const element = await createVocabItemElement(item, fromLang, toLang);
        container.appendChild(element);
    }
}

window.renderVocabulario = renderVocabulario;
