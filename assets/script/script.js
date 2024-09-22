const audioPlayerContainer = document.getElementById("audio-player");

document.getElementById("audio-play-control").addEventListener("click", () => {
	if (audioPlayerContainer.classList.contains("audio-player--play")) {
		audioPlayerContainer.classList.add("audio-player--stop");
		audioPlayerContainer.classList.remove("audio-player--play");
	} else {
		audioPlayerContainer.classList.remove("audio-player--stop");
		audioPlayerContainer.classList.add("audio-player--play");
	}
});
