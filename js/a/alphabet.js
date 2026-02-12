export async function initializeAlphabet(alphabetFile, language) {
  try {
    const response = await fetch(`../../../data/alphabet/${alphabetFile}.json`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const allAlphabetData = await response.json();

    // Inicia a lógica do alfabeto com os dados carregados
    setupAlphabet(allAlphabetData, language);
  } catch (error) {
    console.error("Failed to load alphabet data:", error);
  }
}

const ICONS = {
  play: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
  `,
  pause: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
           d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
  `,
};

function setupAlphabet(allAlphabetData, language) {
  const currentAlphabet = allAlphabetData[language];
  if (!currentAlphabet) {
    console.error(`Alphabet data not found for language: ${language}`);
    return;
  }

  // DOM Elements
  const alphabetGrid = document.getElementById("alphabetGrid");

  // State
  let selectedLetter = null;
  let playingButton = null;

  // Function to stop all playing sounds and reset buttons
  function stopAndResetButtons() {
    updateAllPlayButtons(false);
    playingButton = null;
    window.stopCurrentAudio?.();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Register the stop function globally
  window.registerStopFunction?.(stopAndResetButtons);

  // Generate Alphabet Grid
  function generateAlphabetGrid() {
    currentAlphabet.letters.forEach((item, index) => {
      const button = document.createElement("button");
      button.className = `
        letter-button relative p-4 rounded-xl
        text-white font-semibold text-xl border-2 border-transparent
        hover:scale-105 hover:border-purple-400 hover:text-purple-400 transition-colors
      `;
      button.textContent = item.letter;
      button.style.animationDelay = `${index * 50}ms`;

      button.addEventListener("click", () => {
        selectLetter(item.letter);
        playLetterSound(item.letter);
      });

      alphabetGrid.appendChild(button);
    });
  }

  // Select Letter
  function selectLetter(letter) {
    selectedLetter = letter;
    const letterData = currentAlphabet.letters.find(
      (item) => item.letter === letter,
    );

    if (letterData) {
      updateLetterDetails(letterData);

      const modal = document.getElementById("letterModal");
      if (modal && typeof modal.open === "function") {
        modal.open();
      }
    }
  }

  // Update Letter Details inside Modal
  function updateLetterDetails(letterData) {
    const modalContent = document.getElementById("modalLetterContent");

    modalContent.innerHTML = `
      <div class="mt-4 space-y-2">
        ${letterData.examples
          .map(
            (example) => `
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 p-3">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <h1 class="text-2xl font-bold text-purple-400">${example.word}</h1>
                    <button class="play-button p-1 bg-purple-400 text-white rounded-full flex items-center justify-center" data-word="${example.word}">
                      ${ICONS.play} 
                    </button>
                  </div>
                  <span class="text-md text-primary/80">${example.pronunciation}</span>
                </div>
              </div>
              <div class="bg-white/5 p-3 rounded-lg m-2">
                <p class="text-lg font-medium text-primary">${example.description}</p>
              </div>
            </div>
          `,
          )
          .join("")}
      </div>
    `;

    // Resetamos o estado do botão global ao trocar o conteúdo do modal
    playingButton = null;

    // Reanexa os eventos de áudio
    modalContent.querySelectorAll(".play-button").forEach((btn) => {
      const word = btn.dataset.word;
      btn.addEventListener("click", () => playWordSound(word, btn));
    });
  }

  // Play Letter Sound
  function playLetterSound(letter) {
    window.stopAllComponents?.();
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = currentAlphabet.langCode;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  //Play Example Word Sound
  function playWordSound(word, button) {
    if (playingButton === button) {
      window.stopAllComponents?.();
      updatePlayButton(button, false);
      playingButton = null;
    } else {
      window.stopAllComponents?.();
      if (playingButton) updatePlayButton(playingButton, false);

      playingButton = button;
      updatePlayButton(button, true);

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = currentAlphabet.langCode;
      utterance.rate = 0.8;

      utterance.onend = () => {
        updatePlayButton(button, false);
        playingButton = null;
      };

      window.speechSynthesis.speak(utterance);
    }
  }
  // Update Play Button State
  function updatePlayButton(button, isPlaying) {
    if (!button) return;
    button.innerHTML = isPlaying ? ICONS.pause : ICONS.play;
  }

  // Reset All Play Buttons
  function updateAllPlayButtons(isPlaying) {
    const allButtons = document.querySelectorAll(".play-button");
    allButtons.forEach((btn) => updatePlayButton(btn, isPlaying));
  }

  generateAlphabetGrid();
}
