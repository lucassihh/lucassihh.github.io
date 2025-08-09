function renderVocabulario({
  vocabulario,
  containerId,
  muteBtnId,
  fromLang = 'indonesian',
  toLang = 'portuguese',
}) {
  const container = document.getElementById(containerId);
  const muteBtn = document.getElementById(muteBtnId);
  
  if (!container) {
    console.error(`Conteiner com ID '${containerId}' não encontrado.`);
    return;
  }

  const iconSoundOn = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
         <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
         <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
   </svg>
  `;

  const iconSoundOff = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
    </svg>
  `;

  function createVocabItem(item) {
    const fromText = item[`text_${fromLang}`] || '';
    const toText = item[`text_${toLang}`] || '';
    const audioSrc = item[`audio_${fromLang}`] || null;
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
    <div class="flex flex-col justify-center p-2 ounded-lg mb-2">
      <div class="flex space-x-4 ml-4 tocar">
        <span class="inline-flex justify-center items-center w-6 h-6 rounded bg-green-500 text-white font-medium text-md">Q</span>
        <p class="gradient-text text-lg hover:scale-105 font-extrabold">${fromText}</p>
      </div>
      <div class="flex space-x-4 ml-4">
        <span class="inline-flex justify-center items-center w-6 h-6 rounded bg-gray-200 text-gray-800 font-medium text-md">A</span>
        <p class="text-white/90 text-base font-semibold">${toText}</p>
      </div>
    </div>
    `;

    const questionText = wrapper.querySelector('div.tocar');
    if (questionText && audioSrc && audioSrc !== "vazio") {
      questionText.addEventListener('click', () => playAudio(audioSrc));
    }

    return wrapper;
  }

  const vocabularyItems = Array.isArray(vocabulario) ? vocabulario : [];
  
  if (vocabularyItems.length === 0) {
    container.innerHTML = '<p class="text-gray-500">Nenhum item de vocabulário encontrado para este tópico.</p>';
    if (muteBtn) {
      muteBtn.classList.add('hidden');
    }
    return;
  }

  container.innerHTML = '';

  vocabularyItems.forEach((item) => {
    container.appendChild(createVocabItem(item));
  });

  if (muteBtn) {
    muteBtn.innerHTML = isMuted ? iconSoundOff : iconSoundOn;
    muteBtn.addEventListener('click', () => {
      const currentMuteState = toggleGlobalMute();
      muteBtn.innerHTML = currentMuteState ? iconSoundOff : iconSoundOn;
    });
  }
}






