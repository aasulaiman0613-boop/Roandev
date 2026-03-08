// CONFIGURATION
const GITHUB_USERNAME = 'aasulaiman0613-boop';
const REPO_NAME = 'Roandev'; 

const grid = document.getElementById('music-grid');
const audio = new Audio();
const playPauseBtn = document.getElementById('play-pause');
const trackNameLabel = document.getElementById('current-track-name');
const progressBar = document.getElementById('progress');

let tracks = [];
let currentIndex = 0;

// 1. FETCH MUSIC FROM GITHUB
async function fetchMusic() {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        // Filter for audio files
        const audioFiles = data.filter(file => 
            file.name.match(/\.(mp3|wav|ogg|mpeg)$/i)
        );

        if (audioFiles.length === 0) {
            grid.innerHTML = '<p>No audio files found in the root directory.</p>';
            return;
        }

        tracks = audioFiles;
        renderCards();

    } catch (error) {
        console.error("Fetch Error:", error);
        grid.innerHTML = `<p style="color:#ff4444">Connection Error. Check REPO_NAME in script.js</p>`;
    }
}

// 2. RENDER THE MUSIC CARDS (Cleaned up as requested)
function renderCards() {
    grid.innerHTML = ''; 
    
    tracks.forEach((file, index) => {
        const card = document.createElement('div');
        card.className = 'track-card reveal';
        card.innerHTML = `
            <div class="play-icon"><i class="fas fa-play"></i></div>
            <h3>Music ${index + 1}</h3>
        `; // Removed the <p> tag that showed file names
        card.onclick = () => loadAndPlay(index);
        grid.appendChild(card);
    });

    initScrollReveal();
}

// 3. PLAYER ENGINE
function loadAndPlay(index) {
    currentIndex = index;
    const file = tracks[index];
    
    audio.src = file.download_url;
    audio.play();
    
    trackNameLabel.innerText = `Playing: Music ${index + 1}`;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    // UI Active States
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

// 4. UTILITIES
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
});

audio.addEventListener('ended', nextTrack);

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Discord Copy Function
function copyDiscord() {
    const el = document.createElement('textarea');
    el.value = 'roandev';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Discord username "roandev" copied to clipboard!');
}

fetchMusic();
