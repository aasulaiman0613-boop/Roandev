const tracks = [
    { name: "Music 1", url: "http://googleusercontent.com/file_content/0" },
    { name: "Music 2", url: "http://googleusercontent.com/file_content/1" },
    { name: "Music 3", url: "http://googleusercontent.com/file_content/2" },
    { name: "Music 4", url: "http://googleusercontent.com/file_content/3" },
    { name: "Music 5", url: "http://googleusercontent.com/file_content/4" },
    { name: "Music 6", url: "http://googleusercontent.com/file_content/5" }
];

let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();

const playBtn = document.getElementById('play-pause');
const trackNameDisplay = document.getElementById('current-track-name');
const progress = document.getElementById('progress');

function playTrack(index) {
    currentTrackIndex = index;
    audio.src = tracks[index].url;
    trackNameDisplay.innerText = "Playing: " + tracks[index].name;
    audio.play();
    isPlaying = true;
    updatePlayIcon();
}

function togglePlay() {
    if (audio.src === "") { playTrack(0); return; }
    if (isPlaying) { audio.pause(); } else { audio.play(); }
    isPlaying = !isPlaying;
    updatePlayIcon();
}

function updatePlayIcon() {
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(currentTrackIndex);
}

// Update progress bar
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
});
