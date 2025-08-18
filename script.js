console.log("Lets write JavaScript!");
let currentSong=new Audio();

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

const playmusic=(track, pause=false)=>{
    //let audio=new Audio("/songs/" + track + ".mp3");
    currentSong.src="/songs/" + track + ".mp3"
    if (!pause){
        currentSong.play()
        play.src="pause.svg";
    }
    document.querySelector(".songinfo").innerHTML=track;
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";
}

async function main() {
  let songs = await getSongs();
  playmusic(songs[0],true)
  //display all the song in the play list
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
  //attach event listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element =>{
        //console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playmusic(e.querySelector(".info").firstElementChild.innerHTML);
    })
    
  });
  //attach an event listner to play next and pre song
  
  play.addEventListener("click", ()=>{
    if(currentSong.paused){
        currentSong.play();
        play.src="pause.svg"
    }
    else{
        currentSong.pause();
        play.src="play.svg";
    }
  });

  //listen for time update event
  currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime,currentSong.duration);
    document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
  })

  //add event listner to seek bar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+"%";
    currentSong.currentTime=(currentSong.duration)*percent/100;
  })

  /* Create audio object for the first song
  let audio = new Audio("/songs/" + songs[0] + ".mp3"); // ✅ Need full path back

  let playButton = document.querySelector(".playbtn");

  // When user clicks play button → play song
  playButton.addEventListener("click", () => {
    audio.play();
    console.log("Now Playing:", songs[0]);
  });

  audio.addEventListener("loadeddata", () => {
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });*/
}

main();
