// const audioPlayerContainer = document.getElementById("audio-player");

// document.getElementById("audio-play-control").addEventListener("click", () => {
// 	if (audioPlayerContainer.classList.contains("audio-player--play")) {
// 		audioPlayerContainer.classList.add("audio-player--stop");
// 		audioPlayerContainer.classList.remove("audio-player--play");
// 	} else {
// 		audioPlayerContainer.classList.remove("audio-player--stop");
// 		audioPlayerContainer.classList.add("audio-player--play");
// 	}
// });

class Audio {
	playing = false;
	list = [];
	currentId = 0;

	classes = {
		played: "audio-player--play",
		paused: "audio-player--pause",
	};

	elements = {
		audioPlayer: null,
		imgs: [],
		songName: null,
		artist: null,
		progressBar: null,
		progressBarControl: null,
		audioPlayControl: null,
		ctrlNext: null,
		ctrlPrev: null,
		audio: null,

		timeProgress: null,
		timeDuration: null,

		progressVolume: null,
		progressVolumeControl: null,

		volumeUp: null,
		volumeDown: null,
	};

	constructor({ data }) {
		this.list = data;

		const g = (id) => document.getElementById(id);

		this.elements.audioPlayer = g("audio-player");

		this.elements.imgs.push(g("audio-player"));
		this.elements.imgs.push(g("imgBg2"));

		this.elements.songName = g("songName");
		this.elements.artist = g("artist");
		this.elements.progressBar = g("progressBar");
		this.elements.progressBarControl = g("progressBarControl");

		this.elements.progressVolume = g("progressVolume");
		this.elements.progressVolumeControl = g("progressVolumeControl");

		this.elements.audioPlayControl = g("audioPlayControl");
		this.elements.ctrlNext = g("ctrlNext");
		this.elements.ctrlPrev = g("ctrlPrev");

		this.elements.timeProgress = g("timeProgress");
		this.elements.timeDuration = g("timeDuration");

		this.elements.volumeUp = g("volumeUp");
		this.elements.volumeDown = g("volumeDown");

		this.elements.audio = g("audio");

		this.initEvents();
		this.setAudio(0);
	}

	initEvents() {
		this.elements.audioPlayControl.addEventListener("click", () => {
			this.changePlayState();
		});

		this.elements.ctrlNext.addEventListener("click", () => this.next());
		this.elements.ctrlPrev.addEventListener("click", () => this.prev());

		const seek = (event) => {
			const width = this.elements.progressBar.offsetWidth;
			const clickedIn = event.offsetX;

			this.elements.audio.currentTime =
				audio.duration * (clickedIn / width);
		};
		let dragStatus = false;
		this.elements.progressBar.addEventListener("mousedown", (event) => {
			dragStatus = true;
			seek(event);
		});
		document.body.addEventListener("mouseup", () => {
			dragStatus = false;
		});

		this.elements.progressBar.addEventListener("mousemove", (event) => {
			if (!dragStatus) return;
			seek(event);
		});

		const seekVolume = (event) => {
			const width = this.elements.progressVolume.offsetWidth;
			const clickedIn = event.offsetX;

			this.elements.audio.volume = clickedIn / width;
		};
		let dragVolumeStatus = false;
		this.elements.progressVolume.addEventListener("mousedown", (event) => {
			dragVolumeStatus = true;

			seekVolume(event);
		});
		document.body.addEventListener("mouseup", () => {
			dragVolumeStatus = false;
		});

		this.elements.progressVolume.addEventListener("mousemove", (event) => {
			if (!dragVolumeStatus) return;
			seekVolume(event);
		});

		this.elements.audio.addEventListener("ended", () => {
			this.next();
		});

		this.elements.volumeUp.addEventListener("click", () => {
			const volume = this.elements.audio.volume + 0.05;
			if (volume > 1) {
				this.elements.audio.volume = 1;
			} else {
				this.elements.audio.volume = volume;
			}
		});
		this.elements.volumeDown.addEventListener("click", () => {
			const volume = this.elements.audio.volume - 0.05;
			if (volume < 0) {
				this.elements.audio.volume = 0;
			} else {
				this.elements.audio.volume = volume;
			}
		});

		this.interval = setInterval(() => {
			this.updatePosition();
		}, 150);
	}

	updatePosition() {
		const current = this.elements.audio.currentTime;
		const duration = this.elements.audio.duration;
		this.elements.progressBarControl.style.width = `${
			(current / duration) * 100
		}%`;

		this.elements.timeProgress.textContent = this.secToTime(current);
		this.elements.timeDuration.textContent = this.secToTime(duration);

		const currentVolume = this.elements.audio.volume;
		this.elements.progressVolumeControl.style.width = `${
			currentVolume * 100
		}%`;
	}

	current() {
		return this.list[this.currentId];
	}

	secToTime(duration) {
		if (Number.isNaN(duration)) {
			return "00:00";
		}

		let seconds = Math.floor(duration % 60),
			minutes = Math.floor((duration / 60) % 60),
			hours = Math.floor((duration / (60 * 60)) % 24);
		hours = hours < 10 ? "0" + hours : hours;
		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		return hours !== "00"
			? hours + ":" + minutes + ":" + seconds
			: minutes + ":" + seconds;
	}

	setAudio(index) {
		this.currentId = index;

		this.elements.audio.src = this.current().img;
		this.elements.songName.textContent = this.current().subtitle;
		this.elements.artist.textContent = this.current().title;

		this.elements.imgs.forEach((e) => {
			e.style.backgroundImage = `url('${this.current().img}')`;
		});

		this.elements.audio.src = this.current().audio;
	}

	next() {
		this.currentId++;
		if (this.currentId >= this.list.length) {
			this.currentId = 0;
		}
		this.setAudio(this.currentId);
		this.play();
	}

	prev() {
		this.currentId--;
		if (this.currentId < 0) {
			this.currentId = this.list.length - 1;
		}
		this.setAudio(this.currentId);
		this.play();
	}

	play() {
		this.playing = true;
		this.elements.audio.play();
		this.elements.audioPlayer.classList.remove(this.classes.paused);
		this.elements.audioPlayer.classList.add(this.classes.played);
	}
	pause() {
		this.playing = false;
		this.elements.audio.pause();
		this.elements.audioPlayer.classList.add(this.classes.paused);
		this.elements.audioPlayer.classList.remove(this.classes.played);
	}
	changePlayState() {
		if (this.playing) {
			this.pause();
		} else {
			this.play();
		}
	}
}

new Audio({
	data: [
		{
			title: "Beyonce",
			subtitle: "Don't Hurt Yourself",
			audio: "./assets/audio/beyonce.mp3",
			img: "./assets/img/lemonade.png",
		},
		{
			title: "Dua Lipa",
			subtitle: "Don't Start Now",
			audio: "./assets/audio/dontstartnow.mp3",
			img: "./assets/img/dontstartnow.png",
		},
	],
});
