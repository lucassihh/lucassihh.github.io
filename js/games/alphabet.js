export async function initializeAlphabet(alphabetFile, language) {
  try {
    const response = await fetch(`../../../data/alphabet/${alphabetFile}.json`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const allAlphabetData = await response.json();
    
    // Inicia a lógica do alfabeto com os dados carregados
    setupAlphabet(allAlphabetData, language);
    
  } catch (error) {
    console.error('Failed to load alphabet data:', error);
  }
}

function setupAlphabet(allAlphabetData, language) {
  const currentAlphabet = allAlphabetData[language];
  if (!currentAlphabet) {
    console.error(`Alphabet data not found for language: ${language}`);
    return;
  }
  
  // DOM Elements
  const alphabetGrid = document.getElementById('alphabetGrid');
  const letterDetails = document.getElementById('letterDetails');
  const selectedLetterDisplay = document.getElementById('selectedLetterDisplay');
  const examplesContainer = document.getElementById('examplesContainer');

  // State
  let selectedLetter = null;
  let playingButton = null;

  // Function to stop all playing sounds and reset buttons
  function stopAndResetButtons() {
    updateAllPlayButtons(false);
    playingButton = null;
    window.stopCurrentAudio();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Register the stop function with the global audio player
  window.registerStopFunction(stopAndResetButtons);

  // Generate alphabet grid
  function generateAlphabetGrid() {
    currentAlphabet.letters.forEach((item, index) => {
        const button = document.createElement('button');
        button.className = `
            letter-button relative aspect-square rounded-xl font-bold text-lg bg-white dark:bg-white/20 border-2 border-border dark:border-border/50 text-titleLight dark:text-white
        `;
        button.textContent = item.letter;
        button.style.animationDelay = `${index * 50}ms`;
        
        button.addEventListener('click', () => {
            selectLetter(item.letter);
            playLetterSound(item.letter);
        });
        
        alphabetGrid.appendChild(button);
    });
  }

  // Select letter function
  function selectLetter(letter) {
    document.querySelectorAll('.letter-button').forEach(btn => {
      btn.classList.remove('selected', 'bg-gradient-primary', 'text-white', 'shadow-button');
      btn.classList.add('bg-white', 'border-border', 'text-foreground');
    });

    const buttonElement = document.querySelector(`.letter-button:nth-child(${currentAlphabet.letters.findIndex(item => item.letter === letter) + 1})`);
    if (buttonElement) {
      buttonElement.classList.add('selected', 'bg-gradient-primary', 'text-white', 'shadow-button');
      buttonElement.classList.remove('bg-white', 'border-border', 'text-titleLight');
    }
    
    selectedLetter = letter;
    const letterData = currentAlphabet.letters.find(item => item.letter === letter);
    
    if (letterData) {
      updateLetterDetails(letterData);
      letterDetails.classList.remove('hidden');
    }
  }

  // Update letter details
  function updateLetterDetails(letterData) {
    selectedLetterDisplay.textContent = letterData.letter;
    
    // Remove old examples
    examplesContainer.innerHTML = '';
    
    // Generate new examples list with descriptions
    letterData.examples.forEach(example => {
      const exampleDiv = document.createElement('div');
      exampleDiv.className = 'flex items-center gap-2';
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'flex flex-col flex-1 p-2 rounded-lg bg-background hover:bg-muted/10 transition-colors cursor-pointer';
      contentDiv.innerHTML = `
          <h5 class="font-bold text-primary">${example.word}</h5>
          <span class="text-xs text-white/80 font-inter">${example.pronunciation}</span>
          <p class="text-sm text-white">${example.description}</p>
      `;
      
      const playBtn = document.createElement('button');
      playBtn.className = 'play-button w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors';
      playBtn.innerHTML = `
          <svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5,3 19,12 5,21"></polygon>
          </svg>
          <div class="playing-indicator w-6 h-6 bg-primary rounded-full animate-pulse hidden"></div>
      `;
      
      playBtn.addEventListener('click', () => playWordSound(example.word, playBtn));
      
      exampleDiv.appendChild(contentDiv);
      exampleDiv.appendChild(playBtn);
      examplesContainer.appendChild(exampleDiv);
    });
  }

  // Play letter sound using Speech Synthesis
  function playLetterSound(letter) {
    window.stopAllComponents();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = currentAlphabet.langCode;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }
  
  // Play example word sound using Speech Synthesis
  function playWordSound(word, button) {
    if (playingButton === button) {
      // If the same button is clicked again, stop the audio
      window.stopAllComponents();
    } else {
      // Stop all other components before starting new audio
      window.stopAllComponents();
      
      // Update the button state
      playingButton = button;
      updatePlayButton(button, true);
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = currentAlphabet.langCode;
      utterance.rate = 0.8;

      utterance.onend = () => {
        playingButton = null;
        updatePlayButton(button, false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }

  // Updates the visual state of a specific play button
  function updatePlayButton(button, isPlaying) {
    if (!button) return;
    const playIcon = button.querySelector('.play-icon');
    const playingIndicator = button.querySelector('.playing-indicator');
    if (isPlaying) {
      if (playIcon) playIcon.classList.add('hidden');
      if (playingIndicator) playingIndicator.classList.remove('hidden');
    } else {
      if (playIcon) playIcon.classList.remove('hidden');
      if (playingIndicator) playingIndicator.classList.add('hidden');
    }
  }
  
  // Resets the visual state of all play buttons
  function updateAllPlayButtons(isPlaying) {
      const allButtons = document.querySelectorAll('.play-button');
      allButtons.forEach(btn => updatePlayButton(btn, isPlaying));
  }

  // Add event listener to the main letter to play its sound
  selectedLetterDisplay.addEventListener('click', () => {
    if (selectedLetter) {
      playLetterSound(selectedLetter);
    }
  });

  // Initialize
  generateAlphabetGrid();
}
