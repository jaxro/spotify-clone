console.log("Lets write JavaScript!");
let currentSong = new Audio();
let songs;
let currFolder;
function formatTime(seconds) {
  // Ensure non-negative and integer
  seconds = Math.floor(seconds);

  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;

  // Pad with leading zeros
  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(secs).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`); // live server folder
  currFolder = folder;
  let response = await a.text();

  // Create temp div to parse HTML
  let div = document.createElement("div");
  div.innerHTML = response;

  // Get all <a> links
  let as = div.getElementsByTagName("a");
  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    let href = element.getAttribute("href");

    // Only push mp3 files
    if (href.endsWith(".mp3")) {
      // Get just the filename (remove the /songs/ part)
      let songName = href.split(`/${folder}/`).pop();

      // Decode spaces and special characters
      songName = decodeURIComponent(songName);

      // Remove the ".mp3" extension
      songName = songName.replace(".mp3", "");

      songs.push(songName);
    }
  }

  return songs; // ✅ You forgot this!
}

const playmusic = (track, pause = false) => {
  //let audio=new Audio("/songs/" + track + ".mp3");
  currentSong.src = `/${currFolder}/` + track + ".mp3";
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  songs = await getSongs("songs/cs");
  playmusic(songs[0], true);
  //display all the song in the play list
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  // [0] because getElementsByTagName returns an HTMLCollection

  for (const song of songs) {
    songUL.innerHTML += `
        <li>
            <img src="music.svg" alt="" class="music-img invert">
            <div class="info">
                <div>${song}</div>
                <div>Abhay Negi</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img src="play.svg" alt="" class="invert music-play"> 
            </div>
        </li>
    `;
  }
  //attach event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      //console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playmusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  //attach an event listner to play next and pre song

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  //listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentSong.currentTime
    )} / ${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //add event listner to seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  //add event listener for ham burger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //add event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //add eventlistnenr to previous and next
  previous.addEventListener("click", () => {
    console.log("Previous clicked");

    let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
    currentTrack = currentTrack.replace(".mp3", "");

    let index = songs.indexOf(currentTrack);
    console.log("Current track:", currentTrack, "Index:", index);

    if (index > 0) {
      playmusic(songs[index - 1]); // Play previous song
    } else {
      console.log("No previous song!");
    }
  });

  next.addEventListener("click", () => {
    let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
    currentTrack = currentTrack.replace(".mp3", "");

    // Find index in songs array
    let index = songs.indexOf(currentTrack);
    console.log("Current track:", currentTrack, "Index:", index);
    if (index !== -1 && index < songs.length - 1) {
      playmusic(songs[index + 1]); // Play next song
    } else {
      console.log("No next song!");
    }
  });

  //add event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log(`${item.currentTarget.dataset.folder}`);

      // 1. get songs from clicked folder
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

      // 2. clear old playlist
      let songUL = document.querySelector(".songList ul");
      songUL.innerHTML = "";

      // 3. render new playlist
      for (const song of songs) {
        songUL.innerHTML += `
        <li>
          <img src="music.svg" alt="" class="music-img invert">
          <div class="info">
              <div>${song}</div>
              <div>Abhay Negi</div>
          </div>
          <div class="playnow">
              <span>Play Now</span>
              <img src="play.svg" alt="" class="invert music-play"> 
          </div>
        </li>
      `;
      }

      // 4. attach click event to play new songs
      Array.from(songUL.getElementsByTagName("li")).forEach((li) => {
        li.addEventListener("click", () => {
          playmusic(li.querySelector(".info").firstElementChild.innerHTML);
        });
      });

      // 5. play first song by default (optional)
      playmusic(songs[0],true);
    });
  });
}

main();
