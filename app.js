const btnPlayPause = document.querySelectorAll(".btnplaypause")

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
    
    if (songAudio.paused) {
        songAudio.play()
        spanPlayPause.textContent = "pause"
    } else {
        songAudio.pause()
        spanPlayPause.textContent = "play_arrow"
    }
}