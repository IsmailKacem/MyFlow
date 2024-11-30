const btnPlayPause = document.querySelectorAll(".btnplaypause")
const divTopAudioPlayer = document.querySelectorAll(".div-audioplayer-btn__p")

const PSoundsOnGeneralControls = document.querySelector(".p__sounds-on__generals-controls")
const spanPlayPauseGeneral = document.querySelector(".spanplaypause-general")
const btnPlayPauseGeneral = document.querySelector(".btnplaypause-general")
const spanVolumeGeneral = document.querySelector(".spanvolume-general")
const volumeGeneralInput = document.querySelector(".generals-controls-input")


let activeSounds = []
let listGeneralSounds = []
let songAudio;

divTopAudioPlayer.forEach(div => {
    div.addEventListener("click", handlePlayAudio)
});

btnPlayPause.forEach(btn => {
    btn.addEventListener("click", handlePlayAudio)
});

function handlePlayAudio(e) {
    const btn = e.currentTarget
    // on recup le parent du btn clicked
    const audioPlayer = btn.closest(".audio-player")
    console.log(audioPlayer);
    console.log(btn);
    
    songAudio = audioPlayer.querySelector(".audio-player-song")
    const spanPlayPause = audioPlayer.querySelector(".spanplaypause")
    const nameSound = audioPlayer.querySelector(".p-audioplayer").textContent
    const divIcon = audioPlayer.querySelector(".div-icon")
    
    if (songAudio.paused) {
        songAudio.play()
        spanPlayPause.textContent = "pause"
        activeSounds.push(nameSound)            
        listGeneralSounds.push(songAudio)
        divIcon.style.background = "#ffffffe3"
        divIcon.style.color = "#1e1d1d"
        
    } else {
        songAudio.pause()
        spanPlayPause.textContent = "play_arrow"
        activeSounds = activeSounds.filter(sound => sound !== nameSound)
        listGeneralSounds = listGeneralSounds.filter(sound => sound !== songAudio);
        divIcon.style.background = "#00000085"
        divIcon.style.color = "white"

        }

    console.log(listGeneralSounds);
        
    updateSoundsOnGeneralControls()
}

const inputVolume = document.querySelectorAll(".volumeControl__audioplayer")

inputVolume.forEach(input => {
    input.addEventListener("input", handleVolumeControle)
});

function handleVolumeControle(e) {
    const input = e.currentTarget
    const audioPlayer = input.closest(".audio-player")
    const songAudio = audioPlayer.querySelector(".audio-player-song")

    
    const volumeMapping = {
        0: 0, // 0% de volume
        1: 0.15, // 15% de volume
        2: 0.30, // 30% de volume
        3: 0.60, // 60% de volume
        4: 0.80, // 80% de volume
        5: 1.00  // 100% de volume
    };

    // converti la valeur la string en number, ex: "2" => 2
    let volumeValue = parseInt(input.value, 10);
    songAudio.volume = volumeMapping[volumeValue];
    
    console.log(`volume : ${volumeValue}`);

    if (songAudio.volume === 0) {
        audioPlayer.querySelector(".span-vol-for-input").textContent = "volume_off"
    } else if (songAudio.volume >= 0.15 && songAudio.volume <= 0.30) {
        audioPlayer.querySelector(".span-vol-for-input").textContent = "volume_down"
    }
     else {
        audioPlayer.querySelector(".span-vol-for-input").textContent = "volume_up"
    }
}


const btnRemove = document.querySelectorAll(".btnremove")

btnRemove.forEach(btn => {
    btn.addEventListener("click", handleBtnRemove)
});
function handleBtnRemove(e){
    const btn = e.currentTarget
    const audioPlayer = btn.closest(".audio-player")
    const input = audioPlayer.querySelector(".volumeControl__audioplayer")
    input.value--
    handleVolumeControle({currentTarget: input})
}


const btnAdd = document.querySelectorAll(".btnadd")

btnAdd.forEach(btn => {
    btn.addEventListener("click", handleBtnAdd)
});

function handleBtnAdd(e){
    const btn = e.currentTarget
    const audioPlayer = btn.closest(".audio-player")
    const input = audioPlayer.querySelector(".volumeControl__audioplayer")
    input.value++
    handleVolumeControle({currentTarget: input})
}

function updateSoundsOnGeneralControls() {    
    if (activeSounds.length > 0) {
        PSoundsOnGeneralControls.textContent = `Sounds On : ${activeSounds.join(", ")}`
        spanPlayPauseGeneral.textContent = "pause"
        PSoundsOnGeneralControls.style.background = "#39ff004d"
        
    } else {
        PSoundsOnGeneralControls.textContent = `No sounds are currently playing.`;
        spanPlayPauseGeneral.textContent = "play_arrow"
        PSoundsOnGeneralControls.style.background = "#ff00004d"
    }
}


btnPlayPauseGeneral.addEventListener("click", handleBtnPlayPauseGeneral)

function handleBtnPlayPauseGeneral() {
    if (listGeneralSounds.length <= 0) {
        console.log("Aucun son sélectionné.");
        return;
    }

    const isAnyPlaying = listGeneralSounds.some(audio => !audio.paused);

    if (isAnyPlaying) {
        // Mettre tous les sons en pause
        listGeneralSounds.forEach(audio => {
            if (!audio.paused) {
                audio.pause();
                console.log(`Son mis en pause : ${audio.src}`);
                const AudioPlayer = audio.closest(".audio-player")
                const spanAudioPlayer = AudioPlayer.querySelector(".spanplaypause")
                spanAudioPlayer.textContent = "play_arrow"

                const btnPlayPause = AudioPlayer.querySelector(".btnplaypause")
                btnPlayPause.removeEventListener("click", handlePlayAudio)
            }
        });

        spanPlayPauseGeneral.textContent = "play_arrow";
        console.log("Tous les sons mis en pause.");

    } else {
        // Relancer tous les sons
        listGeneralSounds.forEach(audio => {
            audio.play();
            console.log(`Son relancé : ${audio.src}`);
            const AudioPlayer = audio.closest(".audio-player")
            const spanAudioPlayer = AudioPlayer.querySelector(".spanplaypause")
            spanAudioPlayer.textContent = "pause"

            const btnPlayPause = AudioPlayer.querySelector(".btnplaypause")
            btnPlayPause.addEventListener("click", handlePlayAudio)
        });

        spanPlayPauseGeneral.textContent = "pause";
        console.log("Tous les sons relancés.");
    }
}

let volumeGeneralNumber;

volumeGeneralInput.addEventListener("input", triggerVolumeGeneral)

function triggerVolumeGeneral(e){
    
    volumeGeneralNumber = parseFloat(e.target.value)
    console.log(e.target.value * 100);

    listGeneralSounds.forEach(songAudio => {
        songAudio.volume = volumeGeneralNumber
    });


    if (volumeGeneralNumber === 0) {
        spanVolumeGeneral.textContent = "volume_off"
    } else if (volumeGeneralNumber < 0.5) {
        spanVolumeGeneral.textContent = "volume_down"
    } else if (volumeGeneralNumber >= 0.5){
        spanVolumeGeneral.textContent = "volume_up"
    }

    // inputVolume.value = volumeGeneralNumber
}



const btnRemoveGeneral = document.querySelector(".btnremove-general")
btnRemoveGeneral.addEventListener("click", triggerBtnRemoveGeneral)

function triggerBtnRemoveGeneral() {
    const currentVolume = parseFloat(volumeGeneralInput.value)
   
    if (currentVolume > 0) {
        const newVolume = Math.max(0, currentVolume - 0.01)
        volumeGeneralInput.value = newVolume.toFixed(2)
        
        listGeneralSounds.forEach(songAudio => {
            songAudio.volume = volumeGeneralInput.value
        });

    } else if (currentVolume <= 0) {
        spanVolumeGeneral.textContent = "volume_off"
    }

    console.log(volumeGeneralInput.value);
    
}