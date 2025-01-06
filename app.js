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

    // Si des sons étaient précédemment actifs et qu'on active un nouveau son
    if (previouslyActiveSounds.length > 0) {
      // Désactiver tous les autres sons
      previouslyActiveSounds.forEach(audio => {
        if (audio !== songAudio) {
          audio.pause();
          const otherPlayer = audio.closest(".audio-player");
          updateAudioPlayerUI(otherPlayer, false);
        }
      });
      // Réinitialiser la liste des sons précédents
      previouslyActiveSounds = [];
      listGeneralSounds = [];
    }

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

let previouslyActiveSounds = [];
btnPlayPauseGeneral.addEventListener("click", handleBtnPlayPauseGeneral);

function handleBtnPlayPauseGeneral() {
  isGeneralPause = true;

  if (listGeneralSounds.length <= 0) {
    return;
  }

  const isAnyPlaying = listGeneralSounds.some((audio) => !audio.paused);

  if (isAnyPlaying) {
    previouslyActiveSounds = [...listGeneralSounds];
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
    previouslyActiveSounds.forEach((audio) => {
      audio.play();
      const AudioPlayer = audio.closest(".audio-player");
      const spanAudioPlayer = AudioPlayer.querySelector(".spanplaypause");
      spanAudioPlayer.textContent = "pause";
    });
    
    spanPlayPauseGeneral.textContent = "pause";
    previouslyActiveSounds = [];
  } 

  setTimeout(() => {
    isGeneralPause = false;
  }, 100);
}


volumeGeneralInput.addEventListener("input", triggerVolumeGeneral);


function triggerVolumeGeneral(e) {
  const newVolume = parseFloat(e.target.value);
  volumeGeneralNumber = newVolume;

  // Appliquer le nouveau volume à tous les sons actifs
  listGeneralSounds.forEach((songAudio) => {
    const songId = songAudio.dataset.id;
    const individualVolume = userVolumes.get(songId) || 1.0;
    songAudio.volume = individualVolume * volumeGeneralNumber;
  });

  // Mettre à jour l'icône de volume
  updateVolumeIcon(newVolume);
}

function updateVolumeIcon(volume) {
  if (volume === 0) {
    spanVolumeGeneral.textContent = "volume_off";
  } else if (volume < 0.5) {
    spanVolumeGeneral.textContent = "volume_down";
  } else {
    spanVolumeGeneral.textContent = "volume_up";
  }
}

const btnRemoveGeneral = document.querySelector(".btnremove-general");
btnRemoveGeneral.addEventListener("click", triggerBtnRemoveGeneral);

function triggerBtnRemoveGeneral() {
  const currentVolume = parseFloat(volumeGeneralInput.value);
  const newVolume = Math.max(0, currentVolume - 0.01);
  
  // Mettre à jour la valeur de l'input
  volumeGeneralInput.value = newVolume.toFixed(2);
  
  // Utiliser triggerVolumeGeneral pour appliquer les changements
  triggerVolumeGeneral({ target: volumeGeneralInput });
}

const btnAddGeneral = document.querySelector(".btnadd-general");
btnAddGeneral.addEventListener("click", triggerBtnAddGeneral);

function triggerBtnAddGeneral() {
  const currentVolume = parseFloat(volumeGeneralInput.value);
  const newVolume = Math.min(1, currentVolume + 0.01);
  
  volumeGeneralInput.value = newVolume.toFixed(2);
  
  triggerVolumeGeneral({ target: volumeGeneralInput });
}

// MouseDown volume general
let intervalGeneralRemove;
let setTimeoutGeneralRemove;
btnRemoveGeneral.addEventListener("mousedown", handleMouseDownBtnRemove)
btnRemoveGeneral.addEventListener("touchstart", handleMouseDownBtnRemove)
function handleMouseDownBtnRemove(e) {
  e.preventDefault()
  setTimeoutGeneralRemove = setTimeout(() => {    
    intervalGeneralRemove = setInterval(() => {
      triggerBtnRemoveGeneral()
  }, 10);  
  }, 200);
}

btnRemoveGeneral.addEventListener("mouseup", handleMouseUpBtnRemove)
btnRemoveGeneral.addEventListener("touchend", handleMouseUpBtnRemove)
btnRemoveGeneral.addEventListener("mouseleave", handleMouseUpBtnRemove)
function handleMouseUpBtnRemove() {
  clearInterval(intervalGeneralRemove);
  clearTimeout(setTimeoutGeneralRemove);
}


let intervalGeneralAdd;
let setTimeoutGeneralAdd;
btnAddGeneral.addEventListener("mousedown", handleMouseDownBtnAdd)
btnAddGeneral.addEventListener("touchstart", handleMouseDownBtnAdd)
function handleMouseDownBtnAdd(e) {
  e.preventDefault()
  setTimeoutGeneralAdd = setTimeout(() => {    
    intervalGeneralAdd = setInterval(() => {
      triggerBtnAddGeneral()
  }, 10);  
  }, 200);
}

btnAddGeneral.addEventListener("mouseup", handleMouseUpBtnAdd)
btnAddGeneral.addEventListener("touchend", handleMouseUpBtnAdd)
btnAddGeneral.addEventListener("mouseleave", handleMouseUpBtnAdd)
function handleMouseUpBtnAdd() {
  clearInterval(intervalGeneralAdd);
  clearTimeout(setTimeoutGeneralAdd);
}
// MouseDown volume general end


function triggerMix(mixArray, buttonElement) {
  deactivateAllSounds();

  // Desactivation de l'ancien mix si il existe et on rpl la func pr joué le mix
  if (activeMix && activeMix !== mixArray) {
    deactivateMix();
    updateSoundsOnGeneralControls();
    setTimeout(() => {
      // Continuer avec le nouveau mix
      if (activeMix !== mixArray) {
        triggerMix(mixArray, buttonElement);
      }
    }, 50);
    return;
  }

  // Desactivation si le mix est cliqué à nouveau
  if (activeMix === mixArray) {
    deactivateMix();
    updateSoundsOnGeneralControls();
    return;
  }


  // On joue les sons du mix
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

  // Si un des sons du mix est mis en pause on le desactive
  mixArray.forEach(sound => {
    sound.addEventListener("pause", () => {
      if (!isGeneralPause && mixArray.some(s => s.paused)) {
        deactivateMix();
        buttonElement.classList.remove(`${buttonElement.className}-clicked`);
        updateSoundsOnGeneralControls();
      }
    });
  });
  // si reclique sur le mix apres avoir mis un son en pause relance le mix
  setTimeout(() => {
    // Continuer avec le nouveau mix
    if (activeMix !== mixArray) {
      triggerMix(mixArray, buttonElement);
    }
  }, 50);
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
 
     if (!activeSounds.includes(nameSound)) {
      activeSounds.push(nameSound);
    }
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
  // si le mix n'est pas crée, supprime les sons actives et go
  if (btnMyMix.textContent.trim() === "Create Your Mix") {

     // Si le bouton est déjà en mode création, appeler handleOutsideClick
     if (btnMyMix.classList.contains("btn__my-mix-clicked")) {
      handleOutsideClick({ target: document.body });
      return;
    }
    
    if (listGeneralSounds.some(sound => !sound.paused)) {
      deactivateAllSounds();
      updateSoundsOnGeneralControls()
    }
        // Container select activé
        btnMyMix.classList.add("btn__my-mix-clicked");
        containerAmbiance.classList.add("clicked-mymix-container1");
        pSelectSounds.style.transform = "translate(-50%, -50%) rotateX(0deg)";
        pSelectSounds.style.transition = "0.3s ease-out";
        btnSaveMyMix.style.display = "block";
        document.addEventListener("click", handleOutsideClick);
  }

    // Desactivation si le mix est cliqué à nouveau
    if (isMyMixActive) {
      deactivateMyMix()
      updateSoundsOnGeneralControls();
      return;
    }

  // sinon si le mix est crée active ou desactive le mix
  else if (btnMyMix.textContent.trim() !== "Create Your Mix") {
    deactivateMix()
    if (isMyMixActive) {
      deactivateMyMix();
    } else {
      activateMyMix();
    }
  }

  if (activeMix) {
    deactivateMix()
    setTimeout(() => {
        activateMyMix()
    }, 50);
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
  isMyMixActive = true;
  updateSoundsOnGeneralControls();
}

function deactivateMyMix() {
  listGeneralSounds.forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
    const audioPlayer = sound.closest(".audio-player");
    updateAudioPlayerUI(audioPlayer, false);
  });

  btnMyMix.classList.remove("btn__my-mix-clicked");
  activeMix = null;
  isMyMixActive = false;
  listGeneralSounds = [];
  activeSounds = [];
  updateSoundsOnGeneralControls();
}


function handleOutsideClick(event) {
  // Vérifie si le clic est en dehors du container select sounds
  if (!containerAmbiance.contains(event.target) && event.target !== btnMyMix) {
    btnMyMix.classList.remove("btn__my-mix-clicked")
    containerAmbiance.classList.remove("clicked-mymix-container1")
    pSelectSounds.style.transform = "translate(-50%, -50%) rotateX(90deg)";
    pSelectSounds.style.transition = "none";
    btnSaveMyMix.style.display = "none";
    // Retirer l'écouteur une fois que l'action est effectuée
    document.removeEventListener("click", handleOutsideClick);
  }
}

const popupNameMix = document.querySelector(".popup-namemix")

btnSaveMyMix.addEventListener("click", triggerBtnSave)
function triggerBtnSave() {
  MyMixArray = [...listGeneralSounds];
  
  if (MyMixArray.length > 0) {
    popupNameMix.style.display = "flex"
  }
  
  btnMyMix.classList.remove("btn__my-mix-clicked");
  containerAmbiance.classList.remove("clicked-mymix-container1");
  pSelectSounds.style.transform = "translate(-50%, -50%) rotateX(90deg)";
  btnSaveMyMix.style.display = "none";
  
  deactivateAllSounds();
  updateSoundsOnGeneralControls();
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

const crossPopUpNameMix = document.querySelector(".crosspopup-namemix")
crossPopUpNameMix.addEventListener("click", triggerCrossNameMix)
function triggerCrossNameMix() {
  popupNameMix.style.display = "none"
}

// Ajouter un bouton delete mix
const pMyMix = document.querySelector('.p__my-mix');
const btnDeleteMix = document.createElement('button');
btnDeleteMix.className = 'btn-delete-mix material-symbols-outlined';
btnDeleteMix.textContent = 'manufacturing';
btnDeleteMix.setAttribute('translate', 'no');
// Insérer le bouton après btnMyMix
pMyMix.parentNode.insertBefore(btnDeleteMix, pMyMix.nextSibling);
btnDeleteMix.style.display = 'none';

btnDeleteMix.addEventListener("click", triggerBtnDeleteMyMix)

function triggerBtnDeleteMyMix (e) {
  e.stopPropagation();

  const btnPopUPDeleteYes = document.querySelector(".btn-popop-delete__yes")
  const btnPopUPDeleteNo = document.querySelector(".btn-popop-delete__no")
  const popUpDeleteDiv = document.querySelector(".popup-delete-div")
  popUpDeleteDiv.style.display = "flex"

  btnPopUPDeleteYes.addEventListener('click', () => {
    clearMyMixFromLocalStorage();
    deactivateMyMix();
    popUpDeleteDiv.style.display = "none";
  });

  btnPopUPDeleteNo.addEventListener('click', () => {
    popUpDeleteDiv.style.display = "none";
  });

   // Fermer la popup si l'utilisateur clique en dehors
   document.addEventListener('click', (event) => {
    // Vérifie si le clic est à l'extérieur de la popup
    if (!popUpDeleteDiv.contains(event.target) && popUpDeleteDiv.style.display === "flex") {
      popUpDeleteDiv.style.display = "none";
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
