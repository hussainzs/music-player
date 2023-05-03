// data for songs
const songs = [
  {
    title: "Electric Chill Machine",
    artist: "Jacinto",
    audioFile: "music/jacinto-1.mp3",
    image: "img/jacinto-1.jpg",
  },
  {
    title: "Seven Nation Army",
    artist: "Jacinto",
    audioFile: "music/jacinto-2.mp3",
    image: "img/jacinto-2.jpg",
  },
  {
    title: "Night Disco",
    artist: "Jacinto",
    audioFile: "music/jacinto-3.mp3",
    image: "img/jacinto-3.jpg",
  },
  {
    title: "Metric 1",
    artist: "Jacinto",
    audioFile: "music/metric-1.mp3",
    image: "img/metric-1.jpg",
  },
  {
    title: "Coffee Break",
    artist: "Joystock",
    audioFile: "music/coffee-break.mp3",
    image: "img/coffee-break.jpg",
  },
  {
    title: "Divinity",
    artist: "Joystock",
    audioFile: "music/joystock-divinity.mp3",
    image: "img/joystock-divinity.jpg",
  },
  {
    title: "Tarantino Western",
    artist: "Joystock",
    audioFile: "music/tarantino-western.mp3",
    image: "img/tarantino-western.jpg",
  },
  {
    title: "liveoff",
    artist: "Royalty Free",
    audioFile: "music/liveoff.mp3",
    image: "img/liveoff.jpg",
  },
  {
    title: "Business World",
    artist: "Royalty Free",
    audioFile: "music/BusinessTime.mp3",
    image: "img/BusinessTime.jpg",
  },
];

// buttons variables
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
// player container variables
const audio = document.getElementById("audio");
const musicImg = document.getElementById("music-img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
// progress container variable
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
let currentTimeEl = document.getElementById("current-time");
let durationEl = document.getElementById("duration");

// boolean to track if song is playing or not
let isPlaying = false;
let currentSongIndex = 0;

/**play and pause functions*/
function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
}

// random song picker
function returnRandomSongIndex() {
  currentSongIndex = Math.floor(Math.random() * songs.length);
  return currentSongIndex;
}

// load song
function loadSong(songIndex) {
  let song = songs[songIndex];
  //set current song index to the song index passed in and add it to the songs played indices array
  currentSongIndex = songIndex;
  console.log("current song index = ", currentSongIndex);

  //Update DOM
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.audioFile;
  musicImg.src = song.image;
}

// next song
function nextSong() {
  if (currentSongIndex + 1 > songs.length - 1) {
    currentSongIndex = 0;
  } else {
    currentSongIndex++;
  }
  loadSong(currentSongIndex);
  playSong();
}
// previous song
function prevSong() {
  if (currentSongIndex - 1 < 0) {
    currentSongIndex = songs.length - 1;
  } else {
    currentSongIndex--;
  }
  loadSong(currentSongIndex);
  playSong();
}

/**Update progress bar functionality*/
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${minutes}:${formattedSeconds}`;
}

/**
 * This function will update the progress bar width and the current time of the song as it plays
 * e.srcElement is the audio element which has a duration and current time property that we can use to calculate the progress bar width
 * @param {*} e event object that contains the duration and current time of the audio file
 */
function updateProgressBar(e) {
  const { duration, currentTime } = e.srcElement;
  // update progress bar width
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  // calculate display for duration
  currentTimeEl.textContent = formatTime(currentTime);
}

/**
 * This function will set the current time of the song to the time that the user clicked on the progress bar
 *
 * e.offsetX gives us the number of pixels from the left of the progress bar that the user clicked on
 * (clickX / width) gives us the fraction of the progress bar that the user clicked on, as a decimal number between 0 and 1.
 * Multiplying (clickX / width) by duration gives us the number of seconds that the user clicked on, relative to the total duration of the audio file.
 * basically: fraction of progress bar * duration = current time = seconds elapsed in song at that point
 * @param {*} e
 */
function setProgressBar(e) {
  // this refers to the progress container
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = audio;
  // when current time is updated the updateProgressBar function is called due to the event listener on timeupdate
  // so that function will update the progress bar width automatically
  audio.currentTime = (clickX / width) * duration;
}

// event listeners
playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
audio.addEventListener("ended", nextSong);
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});
// event listener for prgoress bar
// update the progress bar as the song plays
audio.addEventListener("timeupdate", updateProgressBar);
let isDragging = false;
// update the progress bar when the user clicks on some part of the progress bar
progressContainer.addEventListener("click", setProgressBar);
progressContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
});
progressContainer.addEventListener("mouseup", () => (isDragging = false));
progressContainer.addEventListener("mousemove", (e) => {
  if (isDragging) {
    setProgressBar(e);
  }
});

// function to go to the top of the page
function goToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

/**
 * function to load html cards for each song on the DOM
 */
const songContainer = document.querySelector(".song-container");

function loadSongCards() {
  songs.forEach((song, index) => {
    // to get the duration of a song we need to create an audio element and set the src to the audio file
    // we need to add an event listener to the audio element to listen for the loadedmetadata event
    // because the duration of the song is not available until the metadata is loaded
    const audio = new Audio(song.audioFile);
    let song_duration;
    audio.addEventListener("loadedmetadata", () => {
      song_duration = formatTime(audio.duration);
      durationSpan.innerText = song_duration;
    });
    // create a song card
    let songCard = document.createElement("div");
    songCard.classList.add("song-card");
    songCard.innerHTML = `
      <div class="song-img">
      <img src="${song.image}" alt="${
      song.title
    }" class="song-card-img" loading="lazy">
      <span class="duration"></span>
      </div>
      <div id="song-index" hidden>${index + 1}</div>
      <div class="song-details">
        <h3 class="song-title">${song.title}</h3>
        <p class="artist-name">${song.artist}</p>
      </div>
      `;
    const durationSpan = songCard.querySelector(".duration");
    // add event listener to song card to load the song when clicked
    songCard.addEventListener("click", () => {
      loadSong(index);
      goToTop();
      playSong();
    });
    songContainer.appendChild(songCard);
  });
}

// Run on page load
function init() {
  loadSongCards();
  intialSongIndex = returnRandomSongIndex();
  loadSong(intialSongIndex);
}
window.onload = init;
