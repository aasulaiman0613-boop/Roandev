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

// 1. FETCH MUSIC FROM GITHUB
async function fetchMusic() {
    // API URL to get contents of the root folder
    const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const data = await response.json();

        // Filter for audio files (mp3, wav, ogg, mpeg)
        const audioFiles = data.filter(file => 
            file.name.match(/\.(mp3|wav|ogg|mpeg)$/i)
        );

        if (audioFiles.length === 0) {
            grid.innerHTML = '<p>No audio files found in the root of the repo.</p>';
            return;
        }

        tracks = audioFiles;
        renderCards();

    } catch (error) {
        console.error("Fetch Error:", error);
        grid.innerHTML = `
            <div style="text-align:center; color:#ff4444; padding:20px;">
                <p><strong>Error connecting to GitHub.</strong></p>
                <p style="font-size:0.8rem">Check if REPO_NAME "${REPO_NAME}" is correct and the repo is Public.</p>
            </div>
        `;
    }
}

// 2. RENDER THE MUSIC CARDS
function renderCards() {
    grid.innerHTML = ''; // Clear the "Loading" text
    
    tracks.forEach((file, index) => {
        const card = document.createElement('div');
        card.className = 'track-card reveal';
        card.innerHTML = `
            <div class="play-icon"><i class="fas fa-play"></i></div>
            <h3>Music ${index + 1}</h3>
            <p>${file.name.replace(/_/g, ' ').split('.')[0]}</p>
        `;
        card.onclick = () => loadAndPlay(index);
        grid.appendChild(card);
    });

    // Trigger animations for the new cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// 3. PLAYER ENGINE
function loadAndPlay(index) {
    currentIndex = index;
    const file = tracks[index];
    
    // We use download_url which is the direct link provided by GitHub API
    audio.src = file.download_url;
    audio.play();
    
    trackNameLabel.innerText = `Playing: Music ${index + 1}`;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Highlight active card UI
    document.querySelectorAll('.track-card').forEach((c, i) => {
        c.style.borderColor = (i === index) ? 'var(--accent)' : 'rgba(255,255,255,0.05)';
        c.style.background = (i === index) ? 'rgba(168, 85, 247, 0.1)' : 'var(--card)';
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

// UI Updates
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
});

audio.addEventListener('ended', nextTrack);

// Start the process
fetchMusic();
