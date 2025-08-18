console.log("Lets write JavaScript!");

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/"); // live server folder
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
      let songName = href.split("/songs/").pop();

      // Decode spaces and special characters
      songName = decodeURIComponent(songName);

      // Remove the ".mp3" extension
      songName = songName.replace(".mp3", "");

      songs.push(songName);
    }
  }

  return songs; // ✅ You forgot this!
}

async function main() {
  let songs = await getSongs();
  console.log("Songs found:", songs);

  //display all the song in songList
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]; 
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

  // Create audio object for the first song
  let audio = new Audio("/songs/" + songs[0] + ".mp3"); // ✅ Need full path back

  let playButton = document.querySelector(".playbtn");

  // When user clicks play button → play song
  playButton.addEventListener("click", () => {
    audio.play();
    console.log("Now Playing:", songs[0]);
  });

  audio.addEventListener("loadeddata", () => {
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });
}

main();
