const AUDIOPLAYER_LIST = [];
const PROGRESS_INNER = "<div class='audio-buffered'><span class='audio-buffered-bar'></span></div><div class='audio-played'><span class='audio-played-bar'></span></div>";
const TIME_INNER = "<span class='audio-label' name='current'>-:--</span> / <span class='audio-label' name='duration'>-:--</span>"
const PLAYBACK_INNER = "<span class='audio-control' name='play'><i class='material-icons'>play_arrow</i></span><span class='audio-control' name='pause' style='display: none'><i class='material-icons'>pause</i></span><span class='audio-control' name='replay' style='display: none'><i class='material-icons'>refresh</i></span>";

var mouseIsDown = false;

function addClass(ele, classNames){
  if(ele.classList) { ele.classList.add(classNames); }
  else { ele.className += ' ' + classNames; }
}

function removeClass(ele, classNames){
  if(ele.classList) { ele.classList.remove(classNames); }
  else { ele.className = ele.className.replace(new RegExp('(^|\\b)' + classNames.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); }
}

function setProgress(ev, progress, activeSong){
  let bounds = progress.getBoundingClientRect();
  // calculate the normalized position clicked
  var clickPosition = (ev.screenX  - bounds.left) / bounds.width;
  var clickTime = clickPosition * parseFloat(activeSong.dataset.duration);

  // move the playhead to the correct position
  activeSong.currentTime = clickTime;
}

function setPlaybackButton(type, ap_obj){
  if(type === "play"){
    ap_obj.getControls("pause").forEach(function(ctrl) { ctrl.style.display = "none"; });
    ap_obj.getControls("replay").forEach(function(ctrl) { ctrl.style.display = "none"; });
    ap_obj.getControls("play").forEach(function(ctrl) { ctrl.style.display = "inline"; });
  } else if(type === "pause"){
    ap_obj.getControls("play").forEach(function(ctrl) { ctrl.style.display = "none"; });
    ap_obj.getControls("replay").forEach(function(ctrl) { ctrl.style.display = "none"; });
    ap_obj.getControls("pause").forEach(function(ctrl) { ctrl.style.display = "inline"; });
  } else if(type === "replay"){
    ap_obj.getControls("play").forEach(function(ctrl) { ctrl.style.display = "none"; });
    ap_obj.getControls("pause").forEach(function(ctrl) { ctrl.style.display = "none"; });
    ap_obj.getControls("replay").forEach(function(ctrl) { ctrl.style.display = "inline"; });
  }
}

function updateTimeDisplay(timeDisplay, ev, progress, activeSong){
  let bounds = progress.getBoundingClientRect();
  // get the current time where pointer is currently at
  let currentPosition = (ev.screenX  - bounds.left) / bounds.width;
  let currentTime = currentPosition * parseFloat(activeSong.dataset.duration);
  // convert current time to readable minutes : seconds format
  let seconds = Math.floor(currentTime % 60);
  timeDisplay.textContent = Math.floor(currentTime / 60) + ":" + (seconds < 10 ? "0" + seconds : seconds);
  // set position of element and attach it to audio player
  timeDisplay.style.top = (window.scrollY + bounds.top - 20) + "px";
  timeDisplay.style.left = (ev.screenX - timeDisplay.getBoundingClientRect().width / 2) + "px";
}

function updateDurationTime(duration, activeSong){
  let seconds = Math.floor(parseFloat(activeSong.dataset.duration) % 60);
  let durationTime = Math.floor(parseFloat(activeSong.dataset.duration) / 60) + ":" + (seconds < 10 ? "0" + seconds : seconds);
  duration.textContent = durationTime;
}

function updateCurrentTime(current, activeSong){
  let seconds = Math.floor(activeSong.currentTime % 60);
  let currentTime = Math.floor(activeSong.currentTime / 60) + ":" + (seconds < 10 ? "0" + seconds : seconds);
  current.textContent = currentTime;
}

function updateAllLabels(ap_obj){
  ap_obj.getLabels().forEach(function(label) {
    let labelName = label.getAttribute("name");
    let activeSong = ap_obj.playerData.activeSong;
    if(labelName === "title" || labelName === "album" || labelName === "artist" || labelName === "producer"){
      label.textContent = activeSong.dataset[labelName];
    } else if(labelName === "current") {
      updateCurrentTime(label, activeSong);
    } else if(labelName === "duration") {
      updateDurationTime(label, activeSong);
    }
  });
}

function createAudioPlayerObject(audioPlayer){
  let ap_obj = {
    html_ref: audioPlayer,
    playlist: audioPlayer.querySelectorAll("audio"),
    progress: audioPlayer.querySelectorAll(".audio-progress"),
    playerData: {
      activeSong: audioPlayer.querySelector("audio"),
      activeSongPosition: 0,
      wasPlaying: false,
      settingProgress: false
    },
    getControls: function(controlName) {
      if(controlName) { return this.html_ref.querySelectorAll(".audio-control[name='" + controlName + "']"); }
      else { return this.html_ref.querySelectorAll(".audio-control"); }
    },
    getLabels: function(labelName) {
      if(labelName) { return this.html_ref.querySelectorAll(".audio-label[name='" + labelName + "']"); }
      else { return this.html_ref.querySelectorAll(".audio-label"); }
    }
  };
  ap_obj.progress.forEach(function(progress) {
    progress.innerHTML = PROGRESS_INNER;
    if(progress.dataset.playedClass) { addClass(progress.querySelector(".audio-played-bar"), progress.dataset.playedClass); }
    if(progress.dataset.color) { progress.querySelector(".audio-played-bar").style.backgroundColor = progress.dataset.color; }
  });
  ap_obj.getLabels("time").forEach(function(time) { time.innerHTML = TIME_INNER; });
  ap_obj.getControls("playback").forEach(function(playback) {
    playback.innerHTML = PLAYBACK_INNER;
    if(playback.getAttribute("disabled")) {
      playback.childNodes.forEach(function(node) { node.setAttribute("disabled", "true"); });
    }
    if(playback.dataset.innerClass) {
      playback.childNodes.forEach(function(node) { addClass(node, playback.dataset.innerClass); });
    }
    if(playback.dataset.iconClass) {
      playback.querySelectorAll("i").forEach(function(icon) { addClass(icon, playback.dataset.iconClass); });
    }
  });
  return ap_obj;
}

function addAudioPlayerEventListeners(ap_obj){
  // get each control the audio player has and add its event listener
  ap_obj.getControls().forEach(function(control) {
    let controlName = control.getAttribute("name");
    let controlDisabled = control.getAttribute("disabled");
    if(!controlDisabled && controlName === "play"){
      // play audio when play button is clicked; display pause button after
      control.addEventListener('click', function(e) {
        e.preventDefault();
        if(ap_obj.playerData.activeSong.readyState >= 2){
          ap_obj.playerData.activeSong.play();
          setPlaybackButton("pause", ap_obj);
        }
      });
    } else if(!controlDisabled && controlName === "replay"){
      control.addEventListener('click', function(e) {
        e.preventDefault();
        ap_obj.playerData.activeSong.currentTime = 0;
        ap_obj.playerData.activeSong.play();
        setPlaybackButton("pause", ap_obj);
      });
    } else if(!controlDisabled && controlName === "pause"){
      // pause audio when pause button is clicked; display play button after
      control.addEventListener('click', function(e) {
        e.preventDefault();
        ap_obj.playerData.activeSong.pause();
        setPlaybackButton("play", ap_obj);
      });
    } else if(!controlDisabled && controlName === "stop") {
      // stop audio when stop button is clicked
      control.addEventListener('click', function(e) {
        e.preventDefault();
        ap_obj.playerData.activeSong.pause();
        ap_obj.playerData.activeSong.currentTime = 0;
        setPlaybackButton("play", ap_obj);
      });
    } else if(!controlDisabled && controlName === "playback-wrapper") {
      control.addEventListener('click', function(e) {
        e.preventDefault();
        let activeSong = ap_obj.playerData.activeSong;
        if(activeSong.readyState >= 2) {
          if(activeSong.paused) { activeSong.play(); setPlaybackButton("pause", ap_obj); }
          else { activeSong.pause(); setPlaybackButton("play", ap_obj); }
        }
      });
    } else if(!controlDisabled && controlName === "skip-previous") {
      control.addEventListener('click', function(e) {
        e.preventDefault();
        // check to see if audio is playing and store previous state
        ap_obj.playerData.wasPlaying = !ap_obj.playerData.activeSong.paused;
        // pause audio if previously playing and set current time back to beginning
        if(ap_obj.playerData.wasPlaying){
          ap_obj.playerData.activeSong.pause();
        }
        ap_obj.playerData.activeSong.currentTime = 0;
        // move to previous song in playlist
        ap_obj.playerData.activeSongPosition = (ap_obj.playlist.length + ap_obj.playerData.activeSongPosition - 1) % ap_obj.playlist.length;
        ap_obj.playerData.activeSong = ap_obj.playlist[ap_obj.playerData.activeSongPosition];
        // begin playing audio if player was previously playing
        if(ap_obj.playerData.wasPlaying && ap_obj.playerData.activeSong.readyState >= 2){
          ap_obj.playerData.activeSong.play();
        } else {
          setPlaybackButton("play", ap_obj);
        }
      });
    } else if(!controlDisabled && controlName === "skip-next") {
      control.addEventListener('click', function(e) {
        e.preventDefault();
        // check to see if audio is playing and store previous state
        ap_obj.playerData.wasPlaying = !ap_obj.playerData.activeSong.paused;
        // pause audio if previously playing and set current time back to beginning
        if(ap_obj.playerData.wasPlaying){
          ap_obj.playerData.activeSong.pause();
        }
        ap_obj.playerData.activeSong.currentTime = 0;
        // move to next song in playlist
        ap_obj.playerData.activeSongPosition = (ap_obj.playerData.activeSongPosition + 1) % ap_obj.playlist.length;
        ap_obj.playerData.activeSong = ap_obj.playlist[ap_obj.playerData.activeSongPosition];
        // begin playing audio if player was previously playing
        if(ap_obj.playerData.wasPlaying && ap_obj.playerData.activeSong.readyState >= 2){
          ap_obj.playerData.activeSong.play();
        } else {
          setPlaybackButton("play", ap_obj);
        }
      });
    } else if(!controlDisabled && controlName === "select") {
      control.addEventListener('click', function(e) {
        e.preventDefault();
        // check to see if audio is playing and store previous state
        ap_obj.playerData.wasPlaying = !ap_obj.playerData.activeSong.paused;
        // pause audio if previously playing and set current time back to beginning
        if(ap_obj.playerData.wasPlaying){
          ap_obj.playerData.activeSong.pause();
        }
        ap_obj.playerData.activeSong.currentTime = 0;
        // cycle through all audio and find selected song
        for(let i = 0; i < ap_obj.playlist.length; i++){
          if(ap_obj.playlist[i].dataset.title === this.getAttribute("for")){
            // move to selected song in playlist
            ap_obj.playerData.activeSongPosition = i;
            ap_obj.playerData.activeSong = ap_obj.playlist[i];
            // begin playing audio if player was previously playing
            if(ap_obj.playerData.wasPlaying && ap_obj.playerData.activeSong.readyState >= 2){
              ap_obj.playerData.activeSong.play();
            } else {
              setPlaybackButton("play", ap_obj);
            }
            break;
          }
        }
      });
    }
  });
  // get each progress element and add its event listener
  ap_obj.progress.forEach(function(progress) {
    // adjust media progress on initial down press
    progress.addEventListener('pointerdown', function(e) {
      e.preventDefault();
      // keep track of audio player's last playing state; pause if playing
      ap_obj.playerData.wasPlaying = !ap_obj.playerData.activeSong.paused;
      if(!ap_obj.playerData.activeSong.paused){
        ap_obj.playerData.activeSong.pause();
      }
      // this is for letting the player know the mouse can be dragged
      mouseIsDown = true;
      ap_obj.playerData.settingProgress = true;
      // add hover styles as class
      addClass(progress, "inflate");
      setProgress(e, progress, ap_obj.playerData.activeSong);
    });
    // display current time at cursor when pointer enters progress bar area
    progress.addEventListener('pointerenter', function(e) {
      e.preventDefault();
      // check to see if when user hovers over progress that time should be displayed
      if(progress.dataset.showTime){
        // create time display element
        let timeDisplay = document.createElement("span");
        addClass(timeDisplay, "audio-label");
        timeDisplay.setAttribute("name", "time-display");
        timeDisplay.setAttribute("for", ap_obj.playerData.activeSong.dataset.title);
        document.body.appendChild(timeDisplay);
        // update and attach time display element to audio player
        updateTimeDisplay(timeDisplay, e, progress, ap_obj.playerData.activeSong);
      }
    });
    // update current time display when pointer moves around progress bar area
    progress.addEventListener('pointermove', function(e) {
      e.preventDefault();
      // check to see if when user hovers over progress that time should be displayed
      if(progress.dataset.showTime){
        // find time display element
        let timeDisplay = document.body.querySelector(".audio-label[name='time-display'][for='" + ap_obj.playerData.activeSong.dataset.title + "']");
        updateTimeDisplay(timeDisplay, e, progress, ap_obj.playerData.activeSong);
      }
    });
    // remove all instances of time display when pointer leaves progress bar area
    progress.addEventListener('pointerleave', function(e) {
      e.preventDefault();
      let timeDisplay = document.body.querySelector(".audio-label[name='time-display'][for='" + ap_obj.playerData.activeSong.dataset.title + "']");
      document.body.removeChild(timeDisplay);
    });
  });
  // add event listeners for all audio in the player
  ap_obj.playlist.forEach(function(song) {
    // update buffered progress display for active song
    song.addEventListener('progress', function(e) {
      let duration =  parseFloat(song.dataset.duration);
      // if the song has loaded, update display
      if (duration > 0) {
        // cycle through each time range in the buffered audio
        for (let i = 0; i < song.buffered.length; i++) {
          if (song.buffered.start(song.buffered.length - 1 - i) < song.currentTime) {
            // set each progress bar
            ap_obj.progress.forEach(function(progress) {
              progress.querySelector('.audio-buffered-bar').style.width = (song.buffered.end(song.buffered.length - 1 - i) / duration) * 100 + "%";
            });
            break;
          }
        }
      }
    });
    // update played progress display for active song
    song.addEventListener('timeupdate', function(e) {
      var duration =  parseFloat(song.dataset.duration);
      if (duration > 0) {
        // update each progress bar
        ap_obj.progress.forEach(function(progress) {
          progress.querySelector('.audio-played-bar').style.width = ((song.currentTime / duration)*100) + "%";
        });
        updateAllLabels(ap_obj);
      }
    });
    // song has ended; display replay button
    song.addEventListener('ended', function(e) {
      setPlaybackButton("replay", ap_obj);
    });
  });
}

window.onload = function() {
  // find all audio players and create functionality
  document.querySelectorAll('.audio-player').forEach(function(audioPlayer) {
    let ap_obj = createAudioPlayerObject(audioPlayer);
    addAudioPlayerEventListeners(ap_obj);
    updateAllLabels(ap_obj);
    AUDIOPLAYER_LIST.push(ap_obj);
  });
  // mouse drag event
  document.body.addEventListener('pointermove', function(e) {
    // check if the mouse is down and being dragged
    if(mouseIsDown){
      e.preventDefault();
      // cycle through audio players to find which is being manipulated
      for(let i = 0; i < AUDIOPLAYER_LIST.length; i++){
        let ap_obj = AUDIOPLAYER_LIST[i];
        // set the progress of the manipulated audio player
        if(ap_obj.playerData.settingProgress){
          // cycle through each progress element
          ap_obj.progress.forEach(function(progress) {
            setProgress(e, progress, ap_obj.playerData.activeSong);
          });
        }
      }
    }
  });
  // mouse drag event finished
  document.body.addEventListener('pointerup', function(e) {
    mouseIsDown = false;
    // cycle through audio players to find which is being manipulated
    for(let i = 0; i < AUDIOPLAYER_LIST.length; i++){
      let ap_obj = AUDIOPLAYER_LIST[i];
      // set appropriate data from manipulated audio player
      if(ap_obj.playerData.settingProgress){
        // no longer setting progress
        ap_obj.playerData.settingProgress = false;
        // begin playback of audio if previous state was playing
        if(ap_obj.playerData.wasPlaying){
          ap_obj.playerData.activeSong.play();
        }
        // remove progress bar expansion class from each progress element
        ap_obj.progress.forEach(function(progress) {
          removeClass(progress, "inflate");
        });
      }
    }
  });
};
