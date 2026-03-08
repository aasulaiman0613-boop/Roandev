// --- CONFIGURATION ---
const USERNAME = 'aasulaiman0613-boop'; // Your GitHub username
const REPO = 'Roandev'; // Your repository name
const BRANCH = 'main'; // Usually 'main' or 'master'

const trackGrid = document.querySelector('.track-grid');
const audio = new Audio();
const playBtn = document.getElementById('play-pause');
const trackNameDisplay = document.getElementById('current-track-name');
const progressBar = document.getElementById('progress');

let playlist = [];
let currentTrackIndex = 0;
let isPlaying = false;

// 1. FETCH MUSIC FROM GITHUB REPOSITORY
async function loadRepositoryMusic() {
    const url = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/`;
    
    try {
        const response = await fetch(url);
        const files = await response.json();

        // Filter for audio files only
        const audioFiles = files.filter(file => 
            file.name.endsWith('.mp3') || 
            file.name.endsWith('.wav') || 
            file.name.endsWith('.ogg')
        );

        // Map them into our playlist format
        playlist = audioFiles.map((file, index) => ({
            name: `Music ${index + 1}`,
            fileName: file.name,
            url: `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/${file.name}`
        }));

        renderTrackCards();
    } catch (error) {
        console.error("Error fetching repository files:", error);
        trackGrid.innerHTML = "<p>Error loading tracks. Please check repository settings.</p>";
    }
}

// 2. RENDER THE UI CARDS
function renderTrackCards() {
    trackGrid.innerHTML = ''; // Clear placeholder
    
    playlist.forEach((track, index) => {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.innerHTML = `
            <div class="card-icon"><i class="fas fa-play"></i></div>
            <h3>${track.name}</h3>
            <p>${track.fileName}</p>
        `;
        card.onclick = () => playTrack(index);
        trackGrid.appendChild(card);
    });
}

// 3. AUDIO ENGINE LOGIC
function playTrack(index) {
    if (currentTrackIndex === index && audio.src !== "") {
        togglePlay();
        return;
    }

    currentTrackIndex = index;
    audio.src = playlist[index].url;
    trackNameDisplay.innerText = `Playing: ${playlist[index].name}`;
    
    // Visual feedback on cards
    document.querySelectorAll('.track-card').forEach((c, i) => {
        c.style.borderColor = (i === index) ? 'var(--accent)' : 'rgba(255,255,255,0.1)';
    });

    audio.play();
    isPlaying = true;
    updatePlayIcon();
}

function togglePlay() {
    if (!audio.src) return;
    if (isPlaying) audio.pause(); else audio.play();
    isPlaying = !isPlaying;
    updatePlayIcon();
}

function updatePlayIcon() {
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    playTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrack(currentTrackIndex);
}

// Progress Bar Update
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${percent}%`;
});

// Auto-play next track
audio.addEventListener('ended', nextTrack);

// Initialize
loadRepositoryMusic();
