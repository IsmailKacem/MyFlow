const btnPlayPause = document.querySelectorAll(".btnplaypause");
const divTopAudioPlayer = document.querySelectorAll(".div-audioplayer-btn__p");

const PSoundsOnGeneralControls = document.querySelector(".p__sounds-on__generals-controls");
const spanPlayPauseGeneral = document.querySelector(".spanplaypause-general");
const btnPlayPauseGeneral = document.querySelector(".btnplaypause-general");
const spanVolumeGeneral = document.querySelector(".spanvolume-general");
const volumeGeneralInput = document.querySelector(".generals-controls-input");

const bgNeonTop = document.querySelector(".bg-neon-top")

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
  btn.addEventListener("touchstart", handleBtnRemove);
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
  btn.addEventListener("touchstart", handleBtnAdd);
});
function handleBtnAdd(e) {
  const btn = e.currentTarget;
  const audioPlayer = btn.closest(".audio-player");
  const input = audioPlayer.querySelector(".volumeControl__audioplayer");
  input.value++;
  handleVolumeControle({ currentTarget: input });
}

// MouseDown volume individuel
let setTimeoutBtnRemove;
let intervalBtnRemove;
let currentBtnRemove;
btnRemove.forEach((btn) => {
  btn.addEventListener("mousedown", handleBtnRemoveMouseDown);
  btn.addEventListener("touchstart", handleBtnRemoveMouseDown);
});
function handleBtnRemoveMouseDown(e) {
  e.preventDefault()
  document.body.style.userSelect = "none";
  currentBtnRemove = e.currentTarget;
  const delay = e.type === "touchstart" ? 400 : 200;
      setTimeoutBtnRemove = setTimeout(() => {    
      intervalBtnRemove = setInterval(() => {
        const syntheticEvent = { currentTarget: currentBtnRemove };
        handleBtnRemove(syntheticEvent)
  }, 100);  
  }, delay);
}
btnRemove.forEach((btn) => {
  btn.addEventListener("mouseup", handleBtnRemoveMouseUp);
  btn.addEventListener("touchend", handleBtnRemoveMouseUp);
  btn.addEventListener("mouseleave", handleBtnRemoveMouseUp);
});
function handleBtnRemoveMouseUp() {
  clearInterval(intervalBtnRemove);
  clearTimeout(setTimeoutBtnRemove);
  currentBtnRemove = null;
  document.body.style.userSelect = "auto";
}


let setTimeoutBtnAdd;
let intervalBtnAdd;
let currentBtnAdd;
btnAdd.forEach((btn) => {
  btn.addEventListener("mousedown", handleBtnAddMouseDown);
  btn.addEventListener("touchstart", handleBtnAddMouseDown);
});
function handleBtnAddMouseDown(e) {
  e.preventDefault()
  document.body.style.userSelect = "none";
  currentBtnAdd = e.currentTarget;
  const delay = e.type === "touchstart" ? 400 : 200;
      setTimeoutBtnAdd = setTimeout(() => {    
      intervalBtnAdd = setInterval(() => {
        const syntheticEvent = { currentTarget: currentBtnAdd };
        handleBtnAdd(syntheticEvent)
  }, 100);  
  }, delay);
}
btnAdd.forEach((btn) => {
  btn.addEventListener("mouseup", handleBtnAddMouseUp);
  btn.addEventListener("touchend", handleBtnAddMouseUp);
  btn.addEventListener("mouseleave", handleBtnAddMouseUp);
});
function handleBtnAddMouseUp() {
  clearInterval(intervalBtnAdd);
  clearTimeout(setTimeoutBtnAdd);
  currentBtnAdd = null;
  document.body.style.userSelect = "auto";
}
// MouseDown volume individuel END

function updateSoundsOnGeneralControls() {
  if (activeSounds.length > 0) {
    PSoundsOnGeneralControls.textContent = `Sounds On : ${activeSounds.join(", ")}`;
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

let previousVolume = 1.0;
const btnIconVolumeGeneral = document.querySelector(".button-icon__generals-controls")
btnIconVolumeGeneral.addEventListener("click", handleBtnIconVolumeGeneral)
function handleBtnIconVolumeGeneral() {
  if (volumeGeneralNumber > 0) {
    previousVolume = volumeGeneralNumber;
    volumeGeneralInput.value = 0;
  } else {
    volumeGeneralInput.value = previousVolume;
  }
  triggerVolumeGeneral({target : volumeGeneralInput})
}

const btnRemoveGeneral = document.querySelector(".btnremove-general");
btnRemoveGeneral.addEventListener("click", triggerBtnRemoveGeneral);
btnRemoveGeneral.addEventListener("touchstart", triggerBtnRemoveGeneral);

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
btnAddGeneral.addEventListener("touchstart", triggerBtnAddGeneral);

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
  document.body.style.userSelect = "none"
  const delay = e.type === "touchstart" ? 400 : 200;
  setTimeoutGeneralRemove = setTimeout(() => {    
    intervalGeneralRemove = setInterval(() => {
      triggerBtnRemoveGeneral()
  }, 10);  
  }, delay);
}

btnRemoveGeneral.addEventListener("mouseup", handleMouseUpBtnRemove)
btnRemoveGeneral.addEventListener("touchend", handleMouseUpBtnRemove)
btnRemoveGeneral.addEventListener("mouseleave", handleMouseUpBtnRemove)
function handleMouseUpBtnRemove() {
  clearInterval(intervalGeneralRemove);
  clearTimeout(setTimeoutGeneralRemove);
  document.body.style.userSelect = "auto"
}


let intervalGeneralAdd;
let setTimeoutGeneralAdd;
btnAddGeneral.addEventListener("mousedown", handleMouseDownBtnAdd)
btnAddGeneral.addEventListener("touchstart", handleMouseDownBtnAdd)
function handleMouseDownBtnAdd(e) {
  e.preventDefault()
  document.body.style.userSelect = "none";
  const delay = e.type === "touchstart" ? 400 : 200;
  setTimeoutGeneralAdd = setTimeout(() => {    
    intervalGeneralAdd = setInterval(() => {
      triggerBtnAddGeneral()
  }, 10);  
  }, delay);
}

btnAddGeneral.addEventListener("mouseup", handleMouseUpBtnAdd)
btnAddGeneral.addEventListener("touchend", handleMouseUpBtnAdd)
btnAddGeneral.addEventListener("mouseleave", handleMouseUpBtnAdd)
function handleMouseUpBtnAdd() {
  clearInterval(intervalGeneralAdd);
  clearTimeout(setTimeoutGeneralAdd);
  document.body.style.userSelect = "auto";
}
// MouseDown volume general end

const btnMixG = document.querySelector(".btnmix")
const divMixs = document.querySelector(".div__mixs")

btnMixG.addEventListener("click", handleBtnMixG)
function handleBtnMixG() {
  btnTimerPomodoro.classList.remove("clicked-mix-timer")
  divModeTimer.style.display = "none";

  btnMixG.classList.toggle("clicked-mix-timer")
  
  if (btnMixG.classList.contains("clicked-mix-timer")) {
    divMixs.style.display = "flex";    
  } else {
    divMixs.style.display = "none";

  }
}

const btnTimerPomodoro = document.querySelector(".btntimerpomodoro")
const divModeTimer = document.querySelector(".div-mode-timer")
btnTimerPomodoro.addEventListener("click", handleTimerPomodoroMode)
function handleTimerPomodoroMode() {
  btnMixG.classList.remove("clicked-mix-timer")
  divMixs.style.display = "none";    

  btnTimerPomodoro.classList.toggle("clicked-mix-timer")

  if (btnTimerPomodoro.classList.contains("clicked-mix-timer")) {
    divModeTimer.style.display = "flex";
  } else {
    divModeTimer.style.display = "none";

  }
  
}

const timerInput = document.getElementById('input-pomodoro-work');
const timerInputs = document.querySelectorAll(".input-timer");


class Pomodoro {
  constructor(){
    this.inputs = document.querySelectorAll(".input-timer");

    this.checkNumber = this.checkNumber.bind(this);
    this.addZero = this.addZero.bind(this);

    this.inputs.forEach(input => {
      input.addEventListener("input", this.checkNumber);
      input.addEventListener("blur", this.addZero);
  });

  }

  checkNumber(e) {
    // Vérifie si c'est un nombre et s'il est entre 0 et 59
    if (/^\d{1,2}$/.test(e.target.value) && parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= 59) {
 
   } else if (parseInt(e.target.value) > 59) {
     e.target.value = "59";
 
   } else if (e.target.value >= 0 && e.target.value <= 9 && e.target.value !== "") {
     e.target.value = e.target.value.padStart(2, "0");
     // e.target.value = `0${e.target.value}`;
   }
    else {
     // La valeur n'est pas valide, on peut la vider ou la réinitialiser
     e.target.value = "";
   }
 }

 addZero(e) {
  if (e.target.value >= 0 && e.target.value <= 9 && e.target.value !== "") {
    e.target.value = e.target.value.padStart(2, "0");
    // e.target.value = `0${e.target.value}`;
  }

  else if (e.target.value === "") {
    e.target.value = "00"
  }
}
}

const pomodoroTest = new Pomodoro()


const btnPomodoro = document.querySelector(".btn-pomodoro")
const btnSimpleTimer = document.querySelector(".btn-simpletimer")
const divPomodoroScreen = document.querySelector(".div-pomodoro-screen")
const divSimpleTimerScreen = document.querySelector(".div-simpletimer-screen")
const btnsTimer = document.querySelectorAll(".btns-timer")

btnPomodoro.classList.add("clicked-timer")

btnsTimer.forEach(btn => {
  btn.addEventListener("click", handleBtnTabsBg)
})

function handleBtnTabsBg(e) {

  btnsTimer.forEach((btn) => {
    btn.classList.remove("clicked-timer");
  });

  e.target.classList.add("clicked-timer");

  if (e.target.classList.contains("btn-pomodoro")) {    
    divPomodoroScreen.style.display = "flex";
    divSimpleTimerScreen.style.display = "none";

  } else if (e.target.classList.contains("btn-simpletimer")) {
    divSimpleTimerScreen.style.display = "flex";
    divPomodoroScreen.style.display = "none";
  }
  }

  const inputTimerHours = document.querySelector(".input-timer-hours")
  inputTimerHours.addEventListener("input", checkNumberSimpleTimer)
  function checkNumberSimpleTimer(e) {
    // Vérifie si c'est un nombre et s'il est entre 0 et 59
    if (/^\d{1,2}$/.test(e.target.value) && parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= 99) {
 
   } else if (parseInt(e.target.value) > 99) {
     e.target.value = "99";
 
   } else if (e.target.value >= 0 && e.target.value <= 9 && e.target.value !== "") {
     e.target.value = e.target.value.padStart(2, "0");
     // e.target.value = `0${e.target.value}`;
   }
    else {
     // La valeur n'est pas valide, on peut la vider ou la réinitialiser
     e.target.value = "";
   }
 }

 inputTimerHours.addEventListener("blur", addZeroSimpleTimer)
 function addZeroSimpleTimer(e) {
  if (e.target.value >= 0 && e.target.value <= 9 && e.target.value !== "") {
    e.target.value = e.target.value.padStart(2, "0");
    // e.target.value = `0${e.target.value}`;
  }

  else if (e.target.value === "") {
    e.target.value = "00"
  }
}


class StartBtn {
  constructor() {

    this.initialMinutes = 25;
    this.initialSecondes = 0;

    this.initialMinutesBreak = 5;
    this.initialSecondesBreak = 0;

    this.initialHoursTimer = 1;
    this.initialMinutesTimer = 0;
    this.initialSecondesTimer = 0;

    this.interval = null;
    this.intervalBreak = null;
    this.intervalTimer = null;
    this.isRunning = false;

    this.minutesPomodoro = document.querySelector(".minutes-pomodoro")
    this.secondesPomodoro = document.querySelector(".secondes-pomodoro")
    this.minutesPomodoroBreak = document.querySelector(".minutes-pomodoro-break")
    this.secondesPomodoroBreak = document.querySelector(".secondes-pomodoro-break")
    this.hoursTimer = document.querySelector(".hours-simpletimer")
    this.minutesTimer = document.querySelector(".minutes-simpletimer")
    this.secondesTimer = document.querySelector(".secondes-simpletimer")
    this.btnStart = document.querySelector(".btn-timer-start")
    this.btnVoicesBottom = document.querySelector(".btn-voice")
    
    this.btnPomodoro = document.querySelector(".btn-pomodoro");
    this.btnSimpleTimer = document.querySelector(".btn-simpletimer");

    this.handlePomodoroAndTimer = this.handlePomodoroAndTimer.bind(this);
    this.breakTime = this.breakTime.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.btnVoices = this.btnVoices.bind(this);
    this.voiceWork = this.voiceWork.bind(this);
    this.voiceBreak = this.voiceBreak.bind(this);
    this.voiceTimer = this.voiceTimer.bind(this);

    this.btnStart.addEventListener("click", this.handlePomodoroAndTimer);
    this.btnVoicesBottom.addEventListener("click", this.btnVoices);
  }

  resetTimer() {
    document.title = "MyFlow";
    clearInterval(this.interval)
    clearInterval(this.intervalBreak)
    clearInterval(this.intervalTimer)
    this.isRunning = false;

    // Restaurer les valeurs de work
    this.minutesPomodoro.value = String(this.initialMinutes).padStart(2, '0');
    this.secondesPomodoro.value = String(this.initialSecondes).padStart(2, '0');

     // Restauration des valeurs de break
    this.minutesPomodoroBreak.value = String(this.initialMinutesBreak).padStart(2, '0');
    this.secondesPomodoroBreak.value = String(this.initialSecondesBreak).padStart(2, '0');

    this.hoursTimer.value = String(this.initialHoursTimer).padStart(2, '0');
    this.minutesTimer.value = String(this.initialMinutesTimer).padStart(2, '0');
    this.secondesTimer.value = String(this.initialSecondesTimer).padStart(2, '0');
    
    this.btnStart.textContent = "Start";
    this.btnStart.classList.remove("clicked-btn-start");
  }

  handlePomodoroAndTimer(isUserClick = true) {

    if (isUserClick && this.btnStart.textContent === "Stop") {
      this.resetTimer();
      return
    }

    if (isUserClick && this.isRunning) {
      this.resetTimer();
      return
    }

    this.isRunning = true
    this.btnStart.textContent = "Stop";
    this.btnStart.classList.add("clicked-btn-start")

    if (this.btnPomodoro.classList.contains("clicked-timer")) {
      this.initialMinutesBreak = parseInt(this.minutesPomodoroBreak.value)
      this.initialSecondesBreak = parseInt(this.secondesPomodoroBreak.value)

      this.voiceWork()
      this.initialMinutes = parseInt(this.minutesPomodoro.value)
      this.initialSecondes = parseInt(this.secondesPomodoro.value)

      let minutes = this.initialMinutes
      let secondes = this.initialSecondes
    
      this.interval = setInterval(() => {
        if (secondes > 0) {
          secondes--;
        } else if (minutes > 0) {
          minutes--;
          secondes = 59;
        } else {
          // Timer terminé
          clearInterval(this.interval);
          // Restaurer les valeurs initiales
          this.minutesPomodoro.value = String(this.initialMinutes).padStart(2, '0');
          this.secondesPomodoro.value = String(this.initialSecondes).padStart(2, '0');
          this.breakTime()
          return;
        }
        
        // Mise à jour de l'affichage
        this.minutesPomodoro.value = String(minutes).padStart(2, '0');
        this.secondesPomodoro.value = String(secondes).padStart(2, '0');
        document.title = `${this.minutesPomodoro.value}:${this.secondesPomodoro.value} (Work) - MyFlow`;
        
      }, 1000);
      
  
    } else if (this.btnSimpleTimer.classList.contains("clicked-timer")) {
      
      this.initialHoursTimer = parseInt(this.hoursTimer.value)
      this.initialMinutesTimer = parseInt(this.minutesTimer.value)
      this.initialSecondesTimer = parseInt(this.secondesTimer.value)

      let hoursT = this.initialHoursTimer;
      let minutesT = this.initialMinutesTimer;
      let secondesT = this.initialSecondesTimer;

      this.intervalTimer = setInterval(() => {

        if (secondesT > 0) {
          secondesT--
        } else if (minutesT > 0) {
          minutesT--;
          secondesT = 59;
        } else if (hoursT > 0) {
          hoursT--;
          minutesT = 59;
          secondesT = 59;
        } else {
          this.resetTimer();
          this.hoursTimer.value = String(this.initialHoursTimer).padStart(2, '0');
          this.minutesTimer.value = String(this.initialMinutesTimer).padStart(2, '0');
          this.secondesTimer.value = String(this.initialSecondesTimer).padStart(2, '0');
          this.voiceTimer();
          return;
        }

        // Mise à jour de l'affichage
        this.hoursTimer.value = String(hoursT).padStart(2, '0');
        this.minutesTimer.value = String(minutesT).padStart(2, '0');
        this.secondesTimer.value = String(secondesT).padStart(2, '0');
        document.title = `${this.hoursTimer.value}:${this.minutesTimer.value}:${this.secondesTimer.value} - MyFlow`;
      
      }, 1000);
    }
  }

  breakTime() {
      this.isRunning = false;
      this.voiceBreak();
      this.initialMinutesBreak = parseInt(this.minutesPomodoroBreak.value)
      this.initialSecondesBreak = parseInt(this.secondesPomodoroBreak.value)
      
      let minutesBreak = this.initialMinutesBreak
      let secondesBreak = this.initialSecondesBreak
  
      this.intervalBreak = setInterval(() => {
        if (secondesBreak > 0) {
          secondesBreak--;
        } else if (minutesBreak > 0) {
          minutesBreak--;
          secondesBreak = 59;
        } else {
          // Timer terminé
          clearInterval(this.intervalBreak);
          // Restaurer les valeurs initiales
          this.minutesPomodoroBreak.value = String(this.initialMinutesBreak).padStart(2, '0');
          this.secondesPomodoroBreak.value = String(this.initialSecondesBreak).padStart(2, '0');
          this.handlePomodoroAndTimer(false)
          return;
        }
        
        // Mise à jour de l'affichage
        this.minutesPomodoroBreak.value = String(minutesBreak).padStart(2, '0');
        this.secondesPomodoroBreak.value = String(secondesBreak).padStart(2, '0');
        document.title = `${this.minutesPomodoroBreak.value}:${this.secondesPomodoroBreak.value} (Break) - MyFlow`;
      }, 1000);
  }

  voiceWork(){
    const workSounds = ["assets/work1.mp3", "assets/work2.mp3"]
    const randomWorkSound = workSounds[Math.floor(Math.random() * workSounds.length)];
    const voiceWork = new Audio(randomWorkSound)
    
    if (this.btnVoicesBottom.classList.contains("muted")) {
      voiceWork.pause();
    } else {
      voiceWork.play();
    }
  }
  voiceBreak(){
    const breakSounds = ["assets/break1.mp3", "assets/break2.mp3", "assets/break3.mp3"]
    const randomBreakSound = breakSounds[Math.floor(Math.random() * breakSounds.length)]
    const voiceBreak = new Audio(randomBreakSound)
    
    if (this.btnVoicesBottom.classList.contains("muted")) {
      voiceBreak.pause();
    } else {
      voiceBreak.play();
    }
  }

  voiceTimer(){
    const timerSounds = ["assets/timer1.mp3", "assets/timer2.mp3"]
    const randomTimerSound = timerSounds[Math.floor(Math.random() * timerSounds.length)]
    const voiceTimer = new Audio(randomTimerSound)
    
    if (this.btnVoicesBottom.classList.contains("muted")) {
      voiceTimer.pause();
    } else {
      voiceTimer.play();
    }
  }

  btnVoices(){
    this.btnVoicesBottom.classList.toggle("muted")

    if (this.btnVoicesBottom.classList.contains("muted")) {
      this.btnVoicesBottom.textContent = "Voices : OFF"
    } else {
      this.btnVoicesBottom.textContent = "Voices : ON"
    }
  }
}

const newStartBtn = new StartBtn();

const btnFullScreenTimer = document.querySelector(".btn-fullscreen-timer")
const spanFull = document.querySelector(".spanfull")

const divModeTimerF = document.querySelector(".div-mode-timer")
const divInputPomodoro = document.querySelectorAll(".div-inputs-pomodoro")
const inputTimer = document.querySelectorAll(".input-timer")
const pPomodoro = document.querySelectorAll(".p-pomodoro")
const inputTimerHoursF = document.querySelector(".input-timer-hours")
const divInputSimpleTimer = document.querySelector(".div-input-simple-timer")
btnFullScreenTimer.addEventListener("click", fullScreenTimer)

function fullScreenTimer() {
  btnFullScreenTimer.classList.toggle("click-fullscreen-btn")

  if (btnFullScreenTimer.classList.contains("click-fullscreen-btn")) {
    spanFull.textContent = "close_fullscreen";
    
    divModeTimerF.classList.add("timer-fullscreen")
    divInputPomodoro.forEach(div => {
      div.classList.add("fs-div-input-pomodoro");
    });
    inputTimer.forEach(input => {
      input.style.fontSize = "clamp(40px, 12vw, 120px)";
    });
    pPomodoro.forEach(paragraph => {
      paragraph.style.fontSize = "clamp(40px, 12vw, 120px)";
    });
    inputTimerHoursF.style.fontSize = "clamp(40px, 12vw, 120px)";
    divInputSimpleTimer.classList.add("fs-div-input-simple-timer")

    document.addEventListener("keydown", handleEscKey)

  } else {
    spanFull.textContent = "open_in_full";

    divModeTimerF.classList.remove("timer-fullscreen")
    divInputPomodoro.forEach(div => {
      div.classList.remove("fs-div-input-pomodoro");
    });
    inputTimer.forEach(input => {
      input.style.fontSize = "clamp(40px, 5vw, 50px)";
    });
    pPomodoro.forEach(paragraph => {
      paragraph.style.fontSize = "clamp(40px, 5vw, 50px)";
    });
    inputTimerHoursF.style.fontSize = "clamp(40px, 5vw, 50px)";
    divInputSimpleTimer.classList.remove("fs-div-input-simple-timer")
  }
}

function handleEscKey(e){
  if (e.key === "Escape" && btnFullScreenTimer.classList.contains("click-fullscreen-btn")) {
    fullScreenTimer()
  }
}

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
      bgNeonTop.style.background = "linear-gradient(45deg, #ffeb3bd1, #e91e63d4)"
    } else if (mixArray === calmStormMix) {
      btnCalmStorm.classList.add('calm-storm-btn-clicked');
      bgNeonTop.style.background = "linear-gradient(45deg, #9C27B0, #2196F3)"
    } else if (mixArray === seaSideCityMix) {
      btnSeaSideCity.classList.add('seaside-city-btn-clicked');
      bgNeonTop.style.background = "linear-gradient(180deg, #00b8ff, #0756ff)"
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
      bgNeonTop.style.background = "linear-gradient(90deg, #4660ff, #0eccff, #4660ff)"

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
    divIcon.classList.add("hidden");
    divAudioPlayerBtnP.classList.add("clicked-audioplayer-btn-p");
    divAudioPlayerInput.classList.add("clicked-audioplayer-input");
 
     if (!activeSounds.includes(nameSound)) {
      activeSounds.push(nameSound);
    }
  } else {
    spanPlayPause.textContent = "play_arrow";
    divIcon.classList.remove("hidden");
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
  document.body.style.overflow = "auto"
  loadMyMixFromLocalStorage();
}

//My Mix
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
      
      if (name && sources && sources.length > 0) {
        btnMyMix.textContent = name;
        
        // Récréer MyMixArray avec les éléments audio correspondants
        MyMixArray = sources
          .map(className => document.querySelector(`.${className}`))
          .filter(Boolean); // Filtrer les éléments null/undefined
        
        if (MyMixArray.length > 0) {
          btnDeleteMix.style.display = 'block';
        } else {
          clearMyMixFromLocalStorage();
        }
        
        return true;
      } else {
        clearMyMixFromLocalStorage();
        return false;
      }
    } catch (error) {
      console.error('Error loading mix:', error);
      clearMyMixFromLocalStorage();
      return false;
    }
  } else {
    // Initialisation explicite quand aucun mix n'existe
    btnMyMix.textContent = "Create Your Mix";
    MyMixArray = [];
    btnDeleteMix.style.display = 'none';
    return false;
  }
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
  bgNeonTop.style.background = "white"
  
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

  bgNeonTop.style.background = "linear-gradient(90deg, #4660ff, #0eccff, #4660ff)"
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

const popupNameMix = document.querySelector(".popup-namemix__screen")

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
btnDeleteMix.style.display = 'flex';

btnDeleteMix.addEventListener("click", triggerBtnDeleteMyMix)

function triggerBtnDeleteMyMix (e) {
  e.stopPropagation();

  const btnPopUPDeleteYes = document.querySelector(".btn-popop-delete__yes")
  const btnPopUPDeleteNo = document.querySelector(".btn-popop-delete__no")
  const popUpDeleteDiv = document.querySelector(".popup-delete-div__screen")
  const popUpDeleteDivChild = document.querySelector(".popup-delete-div")
  popUpDeleteDiv.style.display = "flex";

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
    if (!popUpDeleteDivChild.contains(event.target)) {
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
