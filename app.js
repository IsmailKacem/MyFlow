const btnPlayPause = document.querySelectorAll(".btnplaypause")
const PSoundsOnGeneralControls = document.querySelector(".p__sounds-on__generals-controls")
let activeSounds = []

btnPlayPause.forEach(btn => {
    btn.addEventListener("click", handlePlayAudio)
});


function handlePlayAudio(e) {
    const btn = e.currentTarget
    // on recup le parent du btn clicked
    const audioPlayer = btn.closest(".audio-player")
    console.log(audioPlayer);
    
    const songAudio = audioPlayer.querySelector(".audio-player-song")
    const spanPlayPause = btn.querySelector(".spanplaypause")
    const nameSound = audioPlayer.querySelector(".p-audioplayer").textContent
    
    if (songAudio.paused) {
        songAudio.play()
        spanPlayPause.textContent = "pause"

        activeSounds.push(nameSound)
        
    } else {
        songAudio.pause()
        spanPlayPause.textContent = "play_arrow"

        activeSounds = activeSounds.filter(sound => sound !== nameSound)
    }

    
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
    // console.log(songAudio);

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
    } else {
        PSoundsOnGeneralControls.textContent = `No sounds are currently playing.`;
    }
}