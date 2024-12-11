const btnPlayPause = document.querySelectorAll(".btnplaypause");
const divTopAudioPlayer = document.querySelectorAll(".div-audioplayer-btn__p");

const PSoundsOnGeneralControls = document.querySelector(".p__sounds-on__generals-controls");
const spanPlayPauseGeneral = document.querySelector(".spanplaypause-general");
const btnPlayPauseGeneral = document.querySelector(".btnplaypause-general");
const spanVolumeGeneral = document.querySelector(".spanvolume-general");
const volumeGeneralInput = document.querySelector(".generals-controls-input");
const beachAudio = document.querySelector(".beach-audio")
const birdsAudio = document.querySelector(".birds-audio")
const fireAudio = document.querySelector(".fire-audio")

const mixSounds = [beachAudio, birdsAudio, fireAudio]

let volumeGeneralNumber = 1.0;
let activeSounds = [];
let listGeneralSounds = [];
let songAudio;
const userVolumes = new Map();
let activeMix = null; // Stocke les sons d'un mix actif
let isGeneralPause = false;


listGeneralSounds.forEach((audio, index) => {
  audio.dataset.id = `audio-${index}`
})

divTopAudioPlayer.forEach((div) => {
  div.addEventListener("click", handlePlayAudio);
});

btnPlayPause.forEach((btn) => {
  btn.addEventListener("click", handlePlayAudio);
});

function handlePlayAudio(e) {
  const btn = e.currentTarget;
  const audioPlayer = btn.closest(".audio-player");
  const songAudio = audioPlayer.querySelector(".audio-player-song");

  if (activeMix && !mixSounds.includes(songAudio)) {
    // Si un son hors du mix est activé, désactiver le mix
    deactivateMix();
  }

  if (songAudio.paused) {
    songAudio.play();
    updateAudioPlayerUI(audioPlayer, true)
    
    // Ajouter à la liste générale
    if (!listGeneralSounds.includes(songAudio)) {
      listGeneralSounds.push(songAudio);
      // activeSounds.push(nameSound);
    }

  } else {
    songAudio.pause();
    updateAudioPlayerUI(audioPlayer, false)

    setTimeout(() => {
      listGeneralSounds = listGeneralSounds.filter(sound => sound !== songAudio);
    }, 50);
  }
   // Vérifiez les sons du mix
   if (mixSounds.some(s => s.paused) && activeMix) {
    deactivateMix();
  }
  updateSoundsOnGeneralControls()
}

const inputVolume = document.querySelectorAll(".volumeControl__audioplayer");

inputVolume.forEach((input) => {
  input.addEventListener("input", handleVolumeControle);
});

function handleVolumeControle(e) {
  const input = e.currentTarget;
  const audioPlayer = input.closest(".audio-player");
  const songAudio = audioPlayer.querySelector(".audio-player-song");
  const volumeIcon = audioPlayer.querySelector(".span-vol-for-input");

  const volumeMapping = {
    0: 0, // 0% de volume
    1: 0.15, // 15% de volume
    2: 0.30, // 30% de volume
    3: 0.50, // 50% de volume
    4: 0.70, // 70% de volume
    5: 1.0, // 100% de volume
  };

  // converti la valeur la string en number, ex: "2" => 2
  let volumeValue = parseInt(input.value, 10);
  const individualVolume = volumeMapping[volumeValue];

  const songId = songAudio.dataset.id;
  userVolumes.set(songId, individualVolume)

  const effectiveVolume = individualVolume * volumeGeneralNumber;
  songAudio.volume = effectiveVolume;

  console.log(volumeValue);
  
  if (volumeValue === 0) {
    volumeIcon.textContent = "volume_off";
  } else if (volumeValue >= 1 && volumeValue <= 2) {
    volumeIcon.textContent = "volume_down";
  } else {
    volumeIcon.textContent = "volume_up";
  }
}

const btnRemove = document.querySelectorAll(".btnremove");

btnRemove.forEach((btn) => {
  btn.addEventListener("click", handleBtnRemove);
});
function handleBtnRemove(e) {
  const btn = e.currentTarget;
  const audioPlayer = btn.closest(".audio-player");
  const input = audioPlayer.querySelector(".volumeControl__audioplayer");
  input.value--;
  handleVolumeControle({ currentTarget: input });
}

const btnAdd = document.querySelectorAll(".btnadd");

btnAdd.forEach((btn) => {
  btn.addEventListener("click", handleBtnAdd);
});

function handleBtnAdd(e) {
  const btn = e.currentTarget;
  const audioPlayer = btn.closest(".audio-player");
  const input = audioPlayer.querySelector(".volumeControl__audioplayer");
  input.value++;
  handleVolumeControle({ currentTarget: input });
}


function updateSoundsOnGeneralControls() {
  if (activeSounds.length > 0) {
    PSoundsOnGeneralControls.textContent = `Sounds On : ${activeSounds.join(
      ", "
    )}`;
    spanPlayPauseGeneral.textContent = "pause";
    PSoundsOnGeneralControls.style.background = "#39ff004d";
  } else {
    PSoundsOnGeneralControls.textContent = `No sounds are currently playing.`;
    spanPlayPauseGeneral.textContent = "play_arrow";
    PSoundsOnGeneralControls.style.background = "#ff00004d";
  }
}

btnPlayPauseGeneral.addEventListener("click", handleBtnPlayPauseGeneral);

function handleBtnPlayPauseGeneral() {
  isGeneralPause = true;

  if (listGeneralSounds.length <= 0) {
    console.log("Aucun son sélectionné.");
    return;
  }

  const isAnyPlaying = listGeneralSounds.some((audio) => !audio.paused);

  if (isAnyPlaying) {
    // Mettre tous les sons en pause
    listGeneralSounds.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        console.log(`Son mis en pause : ${audio.src}`);
        const AudioPlayer = audio.closest(".audio-player");
        const spanAudioPlayer = AudioPlayer.querySelector(".spanplaypause");
        spanAudioPlayer.textContent = "play_arrow";
      }
    });

    spanPlayPauseGeneral.textContent = "play_arrow";
  } else {
    // Relancer tous les sons
    listGeneralSounds.forEach((audio) => {
      audio.play();
      console.log(`Son relancé : ${audio.src}`);
      const AudioPlayer = audio.closest(".audio-player");
      const spanAudioPlayer = AudioPlayer.querySelector(".spanplaypause");
      spanAudioPlayer.textContent = "pause";
    });

    spanPlayPauseGeneral.textContent = "pause";
  } 

  setTimeout(() => {
    isGeneralPause = false;
  }, 100);
}


volumeGeneralInput.addEventListener("input", triggerVolumeGeneral);

function triggerVolumeGeneral(e) {
  volumeGeneralNumber = parseFloat(e.target.value);
  console.log(`volume general réglé à : ${volumeGeneralNumber * 100}%`);

  listGeneralSounds.forEach((songAudio) => {
    const songId = songAudio.dataset.id;
    const individualVolume = userVolumes.get(songId) || 1.0;
    songAudio.volume = individualVolume * volumeGeneralNumber;
  });

  if (volumeGeneralNumber === 0) {
    spanVolumeGeneral.textContent = "volume_off";
  } else if (volumeGeneralNumber < 0.5) {
    spanVolumeGeneral.textContent = "volume_down";
  } else if (volumeGeneralNumber >= 0.5) {
    spanVolumeGeneral.textContent = "volume_up";
  }
}

listGeneralSounds.forEach((songAudio, index) => {
  songAudio.dataset.id = `audio-${index}`; // Ajout de l'ID unique
  userVolumes.set(songAudio.dataset.id, 1.0); // Volume par défaut
});


const btnRemoveGeneral = document.querySelector(".btnremove-general");
btnRemoveGeneral.addEventListener("click", triggerBtnRemoveGeneral);

function triggerBtnRemoveGeneral() {
  const currentVolume = parseFloat(volumeGeneralInput.value);

  const newVolume = Math.max(0, currentVolume - 0.01);
  volumeGeneralInput.value = newVolume.toFixed(2);

  listGeneralSounds.forEach((songAudio) => {
    songAudio.volume = volumeGeneralInput.value;
  });

  if (currentVolume === 0) {
    spanVolumeGeneral.textContent = "volume_off";
  } else if (currentVolume < 0.5) {
    spanVolumeGeneral.textContent = "volume_down";
  } else if (currentVolume >= 0.5) {
    spanVolumeGeneral.textContent = "volume_up";
  }

}


const btnAddGeneral = document.querySelector(".btnadd-general");
btnAddGeneral.addEventListener("click", triggerBtnAddGeneral)

function triggerBtnAddGeneral() {
    const currentVolume = parseFloat(volumeGeneralInput.value)

    const newVolume = Math.max(0, currentVolume + 0.01)
    volumeGeneralInput.value = newVolume.toFixed(2)

    listGeneralSounds.forEach((songAudio) => {
        songAudio.volume = volumeGeneralInput.value;
      });

      if (currentVolume === 0) {
        spanVolumeGeneral.textContent = "volume_off";
      } else if (currentVolume < 0.5) {
        spanVolumeGeneral.textContent = "volume_down";
      } else if (currentVolume >= 0.5) {
        spanVolumeGeneral.textContent = "volume_up";
      }
}


const btnBeachCampFire = document.querySelector(".beach-campfire-btn")
btnBeachCampFire.addEventListener("click", triggerBeachCampFire)

function triggerBeachCampFire() {

  if (activeMix) {
    deactivateMix()
    updateSoundsOnGeneralControls();
    return;
  }

  // Désactiver tous les sons avant d'activer le mix
  deactivateAllSounds();

  // Activer les sons du mix
  mixSounds.forEach((sound) => {
    sound.play();
    const audioPlayer = sound.closest(".audio-player");
    updateAudioPlayerUI(audioPlayer, true);

    // Ajouter à la liste générale si pas déjà présent
    if (!listGeneralSounds.includes(sound)) {
      listGeneralSounds.push(sound);
    }
    
  });

  activeMix = mixSounds; // Définir le mix actif
  btnBeachCampFire.classList.add("beach-campfire-btn-clicked");
  updateSoundsOnGeneralControls()
}

// Fonction : Désactiver le mix
function deactivateMix() {
  if (activeMix) {
    activeMix.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
      const audioPlayer = sound.closest(".audio-player");
      updateAudioPlayerUI(audioPlayer, false);
    });

    listGeneralSounds = [];
    activeSounds = [];
    activeMix = null;
    btnBeachCampFire.classList.remove("beach-campfire-btn-clicked");
  }
}

// Fonction : Désactiver tous les sons
function deactivateAllSounds() {
  listGeneralSounds.forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
    const audioPlayer = sound.closest(".audio-player");
    updateAudioPlayerUI(audioPlayer, false);
  });

  listGeneralSounds = [];
  activeSounds = [];
}

function updateAudioPlayerUI(audioPlayer, isPlaying) {
  const spanPlayPause = audioPlayer.querySelector(".spanplaypause");
  const divIcon = audioPlayer.querySelector(".div-icon");
  const nameSound = audioPlayer.querySelector(".p-audioplayer").textContent;

  if (isPlaying) {
    spanPlayPause.textContent = "pause";
    divIcon.style.background = "#ffffffe3";
    divIcon.style.color = "#1e1d1d";
    audioPlayer.classList.add("clicked-audioplayer");
    activeSounds.push(nameSound)
  } else {
    spanPlayPause.textContent = "play_arrow";
    divIcon.style.background = "#00000085";
    divIcon.style.color = "white";
    audioPlayer.classList.remove("clicked-audioplayer");
    activeSounds = activeSounds.filter((sound) => sound !== nameSound);
  }
}


mixSounds.forEach(sound => {
  sound.addEventListener("pause", () => {
    if (!isGeneralPause && mixSounds.some(s => s.paused)) {
      deactivateMix();
      updateSoundsOnGeneralControls();
    }
  });
});