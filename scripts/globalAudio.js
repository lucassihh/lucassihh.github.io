let globalAudioPlayer = new Audio();
let isMuted = false;
const stopCallbacks = [];

function registerStopFunction(callback) {
  stopCallbacks.push(callback);
}

// Stop the logic of all componentss
function stopAllComponents() {
  stopCallbacks.forEach((callback) => {
    if (typeof callback === "function") {
      callback();
    }
  });
}

function playAudio(src) {
  if (globalAudioPlayer.src === src && !globalAudioPlayer.paused) {
    globalAudioPlayer.pause();
    return;
  }

  if (!isMuted && src && src !== "vazio") {
    globalAudioPlayer.src = src;
    globalAudioPlayer.muted = false;
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

window.playAudio = playAudio;
window.stopCurrentAudio = stopCurrentAudio;
window.toggleGlobalMute = toggleGlobalMute;
window.registerStopFunction = registerStopFunction;
window.stopAllComponents = stopAllComponents;
