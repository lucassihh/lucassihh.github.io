let globalAudioPlayer = new Audio();
let isMuted = false;

function playAudio(src) {
  if (globalAudioPlayer.src === src && !globalAudioPlayer.paused) {
    // Se o mesmo áudio já estiver tocando, apenas o pausa
    globalAudioPlayer.pause();
    return;
  }
  
  if (globalAudioPlayer.src && !globalAudioPlayer.paused) {
    // Para qualquer áudio que estiver tocando
    globalAudioPlayer.pause();
    globalAudioPlayer.currentTime = 0;
  }
  
  if (!isMuted && src && src !== "vazio") {
    globalAudioPlayer.src = src;
    globalAudioPlayer.muted = false; // Desativa o mute se o áudio global não estiver mudo
    globalAudioPlayer.play();
  }
}

function stopCurrentAudio() {
  globalAudioPlayer.pause();
  globalAudioPlayer.currentTime = 0;
}

function toggleGlobalMute() {
  isMuted = !isMuted;
  globalAudioPlayer.muted = isMuted;
  return isMuted;
}