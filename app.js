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
const thunderAudio = document.querySelector(".thunder-audio")
const rainAudio = document.querySelector(".rain-audio")
const windAudio = document.querySelector(".wind-audio")
const publicPlaceAudio = document.querySelector(".public-place-audio")

const beachCampFireMix = [beachAudio, birdsAudio, fireAudio]
const calmStormMix = [thunderAudio, rainAudio, windAudio]
const seaSideCityMix = [beachAudio, birdsAudio, publicPlaceAudio]

let volumeGeneralNumber = 1.0;
let activeSounds = [];
let listGeneralSounds = [];
let songAudio;
const userVolumes = new Map();
let activeMix = null; // Stocke les sons d'un mix actif
let isGeneralPause = false;

// Ajouter cette fonction d'initialisation
function initializeAudioPlayers() {
  const allAudioElements = document.querySelectorAll('.audio-player-song');
  allAudioElements.forEach((audio, index) => {
    audio.dataset.id = `audio-${index}`;
    userVolumes.set(audio.dataset.id, 1.0); // Volume par défaut
  });
}

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

  if (activeMix && !MyMixArray.includes(songAudio) && activeMix === MyMixArray) {
    deactivateMyMix();
  }

  if (activeMix && !beachCampFireMix.includes(songAudio)) {
    // Si un son hors du mix est activé, désactiver le mix
    deactivateMix();
  }
  if (activeMix && !seaSideCityMix.includes(songAudio)) {
    // Si un son hors du mix est activé, désactiver le mix
    deactivateMix();
  }
  if (activeMix && !calmStormMix.includes(songAudio)) {
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
   if (beachCampFireMix.some(s => s.paused) && activeMix) {
    deactivateMix();
  }
   // Vérifiez les sons du mix
   if (seaSideCityMix.some(s => s.paused) && activeMix) {
    deactivateMix();
  }
   // Vérifiez les sons du mix
   if (calmStormMix.some(s => s.paused) && activeMix) {
    deactivateMix();
  }
  updateSoundsOnGeneralControls()

  const input = audioPlayer.querySelector(".volumeControl__audioplayer");
  handleVolumeControle({ currentTarget: input });
  
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

   // Vérifier que songAudio.dataset.id existe
   if (!songAudio.dataset.id) {
    console.warn('Audio element missing ID, reinitializing...');
    initializeAudioPlayers();
  }
  
  const songId = songAudio.dataset.id;
  userVolumes.set(songId, individualVolume)

  const effectiveVolume = individualVolume * volumeGeneralNumber;
  songAudio.volume = effectiveVolume;
  
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
    PSoundsOnGeneralControls.style.background = "linear-gradient(45deg, rgb(70 96 255), rgb(14 204 255))";
    PSoundsOnGeneralControls.style.color = "black";
  } else {
    PSoundsOnGeneralControls.textContent = `No sounds are currently playing.`;
    spanPlayPauseGeneral.textContent = "play_arrow";
    PSoundsOnGeneralControls.style.background = "linear-gradient(225deg, #E91E63, #c90b0b)";
    PSoundsOnGeneralControls.style.color = "white";
  }
}

btnPlayPauseGeneral.addEventListener("click", handleBtnPlayPauseGeneral);

function handleBtnPlayPauseGeneral() {
  isGeneralPause = true;

  if (listGeneralSounds.length <= 0) {
    return;
  }

  const isAnyPlaying = listGeneralSounds.some((audio) => !audio.paused);

  if (isAnyPlaying) {
    // Mettre tous les sons en pause
    listGeneralSounds.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
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
  // console.log(`volume general réglé à : ${volumeGeneralNumber * 100}%`);

  listGeneralSounds.forEach((songAudio) => {
    const songId = songAudio.dataset.id;
    const individualVolume = userVolumes.get(songId) || 1.0;

     // Vérifier si le volume individuel est à 0
    if (songAudio.volume === 0) {
      songAudio.volume = 0; // Le son reste désactivé
      volumeGeneralNumber === 0;
    } else {
      songAudio.volume = individualVolume * volumeGeneralNumber; // Appliquer le volume ajusté
    }
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


function triggerMix(mixArray, buttonElement) {
  if (activeMix && activeMix !== mixArray) {
    deactivateMix();
    updateSoundsOnGeneralControls();
    return;
  }

  if (activeMix === mixArray) {
    deactivateMix();
    updateSoundsOnGeneralControls();
    return;
  }

  deactivateAllSounds();

  mixArray.forEach((sound) => {
    sound.play();
    const audioPlayer = sound.closest(".audio-player");
    updateAudioPlayerUI(audioPlayer, true);

    const input = audioPlayer.querySelector(".volumeControl__audioplayer");
    input.value = 2
    handleVolumeControle({ currentTarget: input });

    if (!listGeneralSounds.includes(sound)) {
      listGeneralSounds.push(sound);
    }
  });

    // Ajouter la classe clicked au bon bouton
    if (mixArray === beachCampFireMix) {
      btnBeachCampFire.classList.add('beach-campfire-btn-clicked');
    } else if (mixArray === calmStormMix) {
      btnCalmStorm.classList.add('calm-storm-btn-clicked');
    } else if (mixArray === seaSideCityMix) {
      btnSeaSideCity.classList.add('seaside-city-btn-clicked');
    }
  activeMix = mixArray;
  updateSoundsOnGeneralControls();

  mixArray.forEach(sound => {
    sound.addEventListener("pause", () => {
      if (!isGeneralPause && mixArray.some(s => s.paused)) {
        deactivateMix();
        buttonElement.classList.remove(`${buttonElement.className}-clicked`);
        updateSoundsOnGeneralControls();
      }
    });
  });
}

const btnBeachCampFire = document.querySelector(".beach-campfire-btn");
btnBeachCampFire.addEventListener("click", () => triggerMix(beachCampFireMix, btnBeachCampFire));

const btnCalmStorm = document.querySelector(".calmstorm-btn");
btnCalmStorm.addEventListener("click", () => triggerMix(calmStormMix, btnCalmStorm));

const btnSeaSideCity = document.querySelector(".seaside-city-btn");
btnSeaSideCity.addEventListener("click", () => triggerMix(seaSideCityMix, btnSeaSideCity));

// Fonction : Désactiver le mix
function deactivateMix() {
   if (activeMix) {
    if (activeMix === MyMixArray) {
      deactivateMyMix();
    } else {
      // Code existant pour les autres mix
      activeMix.forEach((sound) => {
        sound.pause();
        sound.currentTime = 0;
        const audioPlayer = sound.closest(".audio-player");
        updateAudioPlayerUI(audioPlayer, false);
      });

      btnBeachCampFire.classList.remove("beach-campfire-btn-clicked");
      btnCalmStorm.classList.remove("calm-storm-btn-clicked");
      btnSeaSideCity.classList.remove("seaside-city-btn-clicked");

      listGeneralSounds = [];
      activeSounds = [];
      activeMix = null;
    }
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
  const divAudioPlayerBtnP = audioPlayer.querySelector(".div-audioplayer-btn__p")
  const divAudioPlayerInput = audioPlayer.querySelector(".div-audioplayer-input")

  if (isPlaying) {
    spanPlayPause.textContent = "pause";
    divIcon.style.background = "#ffffffe3";
    divIcon.style.color = "#282a2c";
    divAudioPlayerBtnP.classList.add("clicked-audioplayer-btn-p");
    divAudioPlayerInput.classList.add("clicked-audioplayer-input");
    activeSounds.push(nameSound)
  } else {
    spanPlayPause.textContent = "play_arrow";
    divIcon.style.background = "#282a2c";
    divIcon.style.color = "white";
    divAudioPlayerBtnP.classList.remove("clicked-audioplayer-btn-p");
    divAudioPlayerInput.classList.remove("clicked-audioplayer-input");
    activeSounds = activeSounds.filter((sound) => sound !== nameSound);
  }
}


window.addEventListener("load", triggerLoad)

function triggerLoad() {
  const divLoad = document.querySelector(".div-loading-page")
  divLoad.style.display = "none"
  divLoad.remove()

  loadMyMixFromLocalStorage();
}


//My Mix
// Ajout des fonctions de gestion du localStorage
function saveMyMixToLocalStorage(mixName, mixSources) {
  const myMixData = {
    name: mixName,
    sources: mixSources.map(audio => {
      // Sauvegarder la classe audio spécifique (beach-audio, birds-audio, etc.)
      return Array.from(audio.classList).find(cls => cls.endsWith('-audio'));
    })
  };
  localStorage.setItem('myMixData', JSON.stringify(myMixData));
}

function loadMyMixFromLocalStorage() {
  const savedMixData = localStorage.getItem('myMixData');
  if (savedMixData) {
    try {
      const { name, sources } = JSON.parse(savedMixData);
      btnMyMix.textContent = name;
      
      // Récréer MyMixArray avec les éléments audio correspondants
      MyMixArray = sources
        .map(className => document.querySelector(`.${className}`))
        .filter(Boolean); // Filtrer les éléments null/undefined
      
      // Afficher le bouton de suppression si le mix existe
      if (MyMixArray.length > 0) {
        btnDeleteMix.style.display = 'block';
      }
      
      return true;
    } catch (error) {
      console.error('Error loading mix:', error);
      clearMyMixFromLocalStorage();
      return false;
    }
  }
  return false;
}

function clearMyMixFromLocalStorage() {
  localStorage.removeItem('myMixData');
  btnMyMix.textContent = "Create Your Mix";
  MyMixArray = [];
  btnDeleteMix.style.display = 'none';
}


let MyMixArray = [];
let isMyMixActive = false;
const btnMyMix = document.querySelector(".btn__my-mix")
const btnSaveMyMix = document.querySelector(".btn-save-mymix")
const containerAmbiance = document.querySelector(".container__ambiance")
const pSelectSounds = document.querySelector(".p-select-sounds")

btnMyMix.addEventListener("click", triggerMyMix1)

function triggerMyMix1() {
  if (activeMix) {
    deactivateMix();
    updateSoundsOnGeneralControls();
    return;
  }

  if (btnMyMix.textContent.trim() !== "Create Your Mix") {
    if (isMyMixActive) {
      // Désactiver le mix
      deactivateMyMix();
    } else {
      // Activer le mix
      activateMyMix();
    }
  } else {
    // Processus de création du mix
    btnMyMix.classList.add("btn__my-mix-clicked");
    containerAmbiance.classList.add("clicked-mymix-container1");
    pSelectSounds.style.display = "block";
    btnSaveMyMix.style.display = "block";
    document.addEventListener("click", handleOutsideClick);
  }
}

function activateMyMix() {
  deactivateAllSounds();
  
  MyMixArray.forEach((sound) => {
    sound.play();
    const audioPlayer = sound.closest(".audio-player");
    updateAudioPlayerUI(audioPlayer, true);

    const input = audioPlayer.querySelector(".volumeControl__audioplayer");
    input.value = 2;
    handleVolumeControle({ currentTarget: input });

    if (!listGeneralSounds.includes(sound)) {
      listGeneralSounds.push(sound);
    }
  });

  btnMyMix.classList.add("btn__my-mix-clicked");
  activeMix = MyMixArray;
  updateSoundsOnGeneralControls();
}

function deactivateMyMix() {
  MyMixArray.forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
    const audioPlayer = sound.closest(".audio-player");
    updateAudioPlayerUI(audioPlayer, false);
  });

  btnMyMix.classList.remove("btn__my-mix-clicked");
  activeMix = null;
  listGeneralSounds = [];
  activeSounds = [];
  updateSoundsOnGeneralControls();
}


function handleOutsideClick(event) {
  // Vérifie si le clic est en dehors de containerAmbiance
  if (!containerAmbiance.contains(event.target) && event.target !== btnMyMix) {
    btnMyMix.classList.remove("btn__my-mix-clicked")
    containerAmbiance.classList.remove("clicked-mymix-container1")
    pSelectSounds.style.display = "none";
    btnSaveMyMix.style.display = "none";
    // Retirer l'écouteur une fois que l'action est effectuée
    document.removeEventListener("click", handleOutsideClick);
  }
}

btnSaveMyMix.addEventListener("click", triggerBtnSave)
function triggerBtnSave() {
  MyMixArray = [...listGeneralSounds]; // Créer une copie de listGeneralSounds
  
  if (MyMixArray.length > 0) {
    triggerNameMix();
    btnDeleteMix.style.display = 'block';
  }
  
  btnMyMix.classList.remove("btn__my-mix-clicked");
  containerAmbiance.classList.remove("clicked-mymix-container1");
  pSelectSounds.style.display = "none";
  btnSaveMyMix.style.display = "none";
  
  deactivateAllSounds();
  updateSoundsOnGeneralControls();
}

const popupNameMix = document.querySelector(".popup-namemix")
function triggerNameMix() {
popupNameMix.style.display = "flex"
}

const formNameMix = document.querySelector(".form-namemix")
formNameMix.addEventListener("submit", triggerSubmitNameMix)
function triggerSubmitNameMix(e){
  e.preventDefault()
  let inputValue = document.querySelector(".input-namemix").value;
  console.log(inputValue);
  
  if (inputValue.trim() === "") {
    inputValue = "Custom Mix";
  }
  btnMyMix.textContent = inputValue;
  popupNameMix.style.display = "none"
  
  saveMyMixToLocalStorage(inputValue, MyMixArray);
  btnDeleteMix.style.display = 'block';

  updateSoundsOnGeneralControls()
}

const pMyMix = document.querySelector('.p__my-mix');
// Ajouter un bouton de suppression du mix
const btnDeleteMix = document.createElement('button');
btnDeleteMix.className = 'btn-delete-mix material-symbols-outlined';
btnDeleteMix.textContent = 'manufacturing';
btnDeleteMix.setAttribute('translate', 'no');
// Insérer le bouton après btnMyMix
pMyMix.parentNode.insertBefore(btnDeleteMix, pMyMix.nextSibling);
btnDeleteMix.style.display = 'none';

btnDeleteMix.addEventListener("click", triggerBtnDeleteMyMix)

function triggerBtnDeleteMyMix (e) {
  e.stopPropagation(); // Empêcher la propagation au document

  const btnPopUPDeleteYes = document.querySelector(".btn-popop-delete__yes")
  const btnPopUPDeleteNo = document.querySelector(".btn-popop-delete__no")
  const popUpDeleteDiv = document.querySelector(".popup-delete-div")
  popUpDeleteDiv.style.display = "flex"

  // Ajouter un gestionnaire pour le bouton "Oui"
  btnPopUPDeleteYes.addEventListener('click', () => {
    clearMyMixFromLocalStorage(); // Supprimer le mix du stockage local
    deactivateMyMix(); // Désactiver le mix actif
    popUpDeleteDiv.style.display = "none"; // Fermer la popup
  });

  // Ajouter un gestionnaire pour le bouton "Non"
  btnPopUPDeleteNo.addEventListener('click', () => {
    popUpDeleteDiv.style.display = "none"; // Fermer la popup sans rien faire
  });

   // Fermer la popup si l'utilisateur clique en dehors
   document.addEventListener('click', (event) => {
    // Vérifie si le clic est à l'extérieur de la popup
    if (!popUpDeleteDiv.contains(event.target) && popUpDeleteDiv.style.display === "flex") {
      popUpDeleteDiv.style.display = "none"; // Fermer la popup
    }
  });

};

window.addEventListener('error', (e) => {
  if (e.target.tagName === 'AUDIO') {
    console.warn('Audio source not available:', e.target);
    // Supprimer l'audio non disponible du mix
    MyMixArray = MyMixArray.filter(audio => audio !== e.target);
    if (MyMixArray.length === 0) {
      clearMyMixFromLocalStorage();
      btnDeleteMix.style.display = 'none';
    } else {
      // Mettre à jour le storage avec les sources restantes
      saveMyMixToLocalStorage(btnMyMix.textContent, MyMixArray);
    }
  }
}, true);
