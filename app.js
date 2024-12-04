const btnPlayPause = document.querySelectorAll(".btnplaypause");
const divTopAudioPlayer = document.querySelectorAll(".div-audioplayer-btn__p");

const PSoundsOnGeneralControls = document.querySelector(".p__sounds-on__generals-controls");
const spanPlayPauseGeneral = document.querySelector(".spanplaypause-general");
const btnPlayPauseGeneral = document.querySelector(".btnplaypause-general");
const spanVolumeGeneral = document.querySelector(".spanvolume-general");
const volumeGeneralInput = document.querySelector(".generals-controls-input");

let volumeGeneralNumber = 1.0;
let activeSounds = [];
let listGeneralSounds = [];
let songAudio;
const userVolumes = new Map();

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
  // on recup le parent du btn clicked
  const audioPlayer = btn.closest(".audio-player");
  console.log(audioPlayer);
  console.log(btn);

  songAudio = audioPlayer.querySelector(".audio-player-song");
  const spanPlayPause = audioPlayer.querySelector(".spanplaypause");
  const nameSound = audioPlayer.querySelector(".p-audioplayer").textContent;
  const divIcon = audioPlayer.querySelector(".div-icon");

  if (songAudio.paused) {
    songAudio.play();
    spanPlayPause.textContent = "pause";
    activeSounds.push(nameSound);
    listGeneralSounds.push(songAudio);
    divIcon.style.background = "#ffffffe3";
    divIcon.style.color = "#1e1d1d";

    listGeneralSounds.forEach(sound => {
      sound.play()
      const AudioPlayer2 = sound.closest(".audio-player");
      const spanAudioPlayer = AudioPlayer2.querySelector(".spanplaypause");
      spanAudioPlayer.textContent = "pause";

      const btnPlayPause2 = AudioPlayer2.querySelector(".btnplaypause");
      btnPlayPause2.addEventListener("click", handlePlayAudio);
      const divTopAudioPlayer2 = AudioPlayer2.querySelector(".div-audioplayer-btn__p");
      divTopAudioPlayer2.addEventListener("click", handlePlayAudio);
    });

  } else {
    songAudio.pause();
    spanPlayPause.textContent = "play_arrow";
    activeSounds = activeSounds.filter((sound) => sound !== nameSound);
    listGeneralSounds = listGeneralSounds.filter((sound) => sound !== songAudio);
    divIcon.style.background = "#00000085";
    divIcon.style.color = "white";
  }

  console.log(listGeneralSounds);

  updateSoundsOnGeneralControls();
}

const inputVolume = document.querySelectorAll(".volumeControl__audioplayer");

inputVolume.forEach((input) => {
  input.addEventListener("input", handleVolumeControle);
});

function handleVolumeControle(e) {
  const input = e.currentTarget;
  const audioPlayer = input.closest(".audio-player");
  const songAudio = audioPlayer.querySelector(".audio-player-song");

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

  if (songAudio.volume === 0) {
    audioPlayer.querySelector(".span-vol-for-input").textContent = "volume_off";
  } else if (songAudio.volume >= 0.15 && songAudio.volume <= 0.3) {
    audioPlayer.querySelector(".span-vol-for-input").textContent = "volume_down";
  } else {
    audioPlayer.querySelector(".span-vol-for-input").textContent = "volume_up";
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

        const btnPlayPause = AudioPlayer.querySelector(".btnplaypause");
        btnPlayPause.removeEventListener("click", handlePlayAudio);
        const divTopAudioPlayer = AudioPlayer.querySelector(".div-audioplayer-btn__p");
        divTopAudioPlayer.removeEventListener("click", handlePlayAudio);
      }
    });

    spanPlayPauseGeneral.textContent = "play_arrow";
    console.log("Tous les sons mis en pause.");
  } else {
    // Relancer tous les sons
    listGeneralSounds.forEach((audio) => {
      audio.play();
      console.log(`Son relancé : ${audio.src}`);
      const AudioPlayer = audio.closest(".audio-player");
      const spanAudioPlayer = AudioPlayer.querySelector(".spanplaypause");
      spanAudioPlayer.textContent = "pause";

      const btnPlayPause = AudioPlayer.querySelector(".btnplaypause");
      btnPlayPause.addEventListener("click", handlePlayAudio);
      const divTopAudioPlayer = AudioPlayer.querySelector(".div-audioplayer-btn__p");
      divTopAudioPlayer.addEventListener("click", handlePlayAudio);
    });

    spanPlayPauseGeneral.textContent = "pause";
    console.log("Tous les sons relancés.");
  } 
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
  // inputVolume.value = volumeGeneralNumber
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