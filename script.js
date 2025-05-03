const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeControl = document.getElementById('volume');

let songs = [];
let currentSongIndex = 0;
let isPlaying = false;

// Get a song from Jamendo api

async function loadSongs() {
    try {
        const response = await fetch('https://api.jamendo.com/v3.0/tracks/?client_id=d123f33e&format=jsonpretty&limit=10');
        const data = await response.json();
        console.log(data.results);
        songs = data.results;
        loadSong(currentSongIndex);
    } catch (error) {
        console.error("Failed to load songs", error);
    }
}


function loadSong(index) {
    const song = songs[index];
    title.textContent = song.name;
    artist.textContent = song.artist_name;
    cover.src = song.album_image;
    audio.src = song.audio;
}

function playSong() {
    isPlaying = true;
    audio.play();
    playBtn.innerHTML = "⏸️";
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playBtn.innerHTML = "▶️";
}

playBtn.addEventListener("click", () => {
    isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playSong();
});

nextBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playSong();
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateTimer() {
    const current = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);
    currentTimeEl.textContent = current;
    durationEl.textContent = duration;
}


audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress || 0;
    updateTimer();
});

audio.addEventListener('ended', () => {
    nextBtn.click();
});


progressBar.addEventListener('input', (e) => {
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

function populatePlaylist() {
    playlistList.innerHTML = "";
    songs.forEach((song, index) => {
      const li = document.createElement('li');
      li.textContent = `${song.name} - ${song.artist_name}`;
      li.addEventListener('click', () => {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        playSong();
      });
      playlistList.appendChild(li);
    });
};

/**toggleTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
      toggleTheme.textContent = "☀️ Light Mode";
    } else {
      toggleTheme.textContent = "🌙 Dark Mode";
    }
});**/

loadSongs();