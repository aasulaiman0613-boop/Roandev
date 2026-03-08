// CONFIGURATION
const GITHUB_USERNAME = 'aasulaiman0613-boop';
const REPO_NAME = 'Roandev'; // <--- MUST MATCH GITHUB EXACTLY

const grid = document.getElementById('music-grid');
const audio = new Audio();
const playPauseBtn = document.getElementById('play-pause');
const trackNameLabel = document.getElementById('current-track-name');
const progressBar = document.getElementById('progress');

let tracks = [];
let currentIndex = 0;

// FETCH FROM GITHUB
async function fetchMusic() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/`);
        const data = await response.json();

        // Filter for audio files
        const audioFiles = data.filter(file => file.name.match(/\.(mp3|wav|ogg|mpeg)$/i));

        if (audioFiles.length === 0) {
            grid.innerHTML = '<p>No music files found in the root directory.</p>';
            return;
        }

        tracks = audioFiles;
        grid.innerHTML = ''; // Clear loader

        tracks.forEach((file, index) => {
            const card = document.createElement('div');
            card.className = 'track-card reveal';
            card.innerHTML = `
                <div class="play-icon"><i class="fas fa-play"></i></div>
                <h3>Music ${index + 1}</h3>
                <p>${file.name.split('.')[0].replace(/_/g, ' ')}</p>
            `;
            card.onclick = () => loadAndPlay(index);
            grid.appendChild(card);
        });

        // Initialize animations for new cards
        initScrollReveal();

    } catch (error) {
        console.error(error);
        grid.innerHTML = `<p style="color:red">Error: Ensure Repo name is correct and Public.</p>`;
    }
}

function loadAndPlay(index) {
    currentIndex = index;
    const file = tracks[index];
    audio.src = file.download_url;
    audio.play();
    
    trackNameLabel.innerText = `Playing: Music ${index + 1}`;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Highlight active card
    document.querySelectorAll('.track-card').forEach((c, i) => {
        c.style.borderColor = (i === index) ? 'var(--accent)' : 'rgba(255,255,255,0.05)';
    });
}

function togglePlay() {
    if (!audio.src) return;
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function nextTrack() {
    currentIndex = (currentIndex + 1) % tracks.length;
    loadAndPlay(currentIndex);
}

function prevTrack() {
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadAndPlay(currentIndex);
}

// Progress Bar
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
});

audio.addEventListener('ended', nextTrack);

// Scroll Animations
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

fetchMusic();
