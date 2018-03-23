function loadSongByName($audioPlayer, nameToLoad){
  stop($audioPlayer);
  $audioPlayer.find("audio.active").removeClass("active");
  $audioPlayer.find("audio[name='" + nameToLoad + "']").addClass("active");
  initDisplays($audioPlayer);
}

function validateActiveAudio($obj) {
  //check to see if passed in jQuery object is an audio player; otherwise, find it
  let $audioPlayer = ($obj.hasClass("audio-player") ? $obj : $obj.parents(".audio-player"));

  //check for active audio; if none, set first audio in audio player to active
  let $audio = $audioPlayer.find("audio.active");
  if(!$audio[0]){
    $audio = $audioPlayer.find("audio").first();
    $audio.addClass("active");
    loadSongByName($audioPlayer, $audio.attr("name"));
  }

  //return the audio player for easy chaining in event listeners
  return $audioPlayer;
}

//Does a switch of the play/pause with one button.
function playToggle($audioPlayer) {
  let $audio = $audioPlayer.find("audio.active");

  //Checks to see if the song is paused, if it is, play it from where it left off otherwise pause it.
  if ($audio[0].paused){
    play($audioPlayer);
  } else {
    pause($audioPlayer);
  }
}

function play($audioPlayer){
  let $audio = $audioPlayer.find("audio.active");
  $audio[0].play();
  $audioPlayer.find(".audio-control.play .play-icon").text("pause");
  $audioPlayer.find(".audio-control.label[for='title']").text($audio.attr("name") + " (Now Playing)");
}

function pause($audioPlayer){
  let $audio = $audioPlayer.find("audio.active");
  $audio[0].pause();
  $audioPlayer.find(".audio-control.play .play-icon").text("play_arrow");
  $audioPlayer.find(".audio-control.label[for='title']").text($audio.attr("name") + " (Paused)");
}

//Stop song by setting the current time to 0 and pausing the song.
function stop($audioPlayer){
  let $audio = $audioPlayer.find("audio.active");
  $audio[0].currentTime = 0;
  $audio[0].pause();
  $audioPlayer.find(".audio-control.time").val($audio[0].currentTime);
  $audioPlayer.find(".audio-control.play .play-icon").text("play_arrow");
  $audioPlayer.find(".audio-control.label[for='title']").text($audio.attr("name") + " (Paused)");
  $audioPlayer.find(".audio-control.select[for='" + $audio.attr("name") + "'] .audio-control.label[for='playing']").text("");
}

function displayTime($audioPlayer){
  let $audio = $audioPlayer.find("audio.active");

  let currentSeconds = (Math.floor($audio[0].currentTime % 60) < 10 ? '0' : '') + Math.floor($audio[0].currentTime % 60);
  let currentMinutes = Math.floor($audio[0].currentTime / 60);
  let totalSeconds = (Math.floor($audio[0].duration % 60) < 10 ? '0' : '') + Math.floor($audio[0].duration % 60);
  let totalMinutes = Math.floor($audio[0].duration / 60);

  //Sets the current song location compared to the song duration.
  $audioPlayer.find(".audio-control.label[for='time']").html(currentMinutes + ":" + currentSeconds + ' / ' + totalMinutes + ":" + totalSeconds);
}

function updatePlayingIcon($audioPlayer){
  let $audio = $audioPlayer.find("audio.active");

  let $playingIcon = $audioPlayer.find(".audio-control.select[for='" + $audio.attr("name") + "'] .audio-control.label[for='playing']");

  if($playingIcon.text() === "volume_mute"){
    $playingIcon.text("volume_down");
  } else if($playingIcon.text() === "volume_down"){
    $playingIcon.text("volume_up");
  } else if($playingIcon.text() === "volume_up"){
    $playingIcon.text("volume_mute");
  } else {
    $playingIcon.text("volume_up");
  }
}

//Updates the current time function so it reflects where the user is in the song.
//This function is called whenever the time is updated. This keeps the visual in sync with the actual time.
function updateTime($audioPlayer){
  let $audio = $audioPlayer.find("audio.active");

  displayTime($audioPlayer);
  let $time = $audioPlayer.find(".audio-control.time");
  $time.val($audio[0].currentTime);
  $time.trigger("change");

  updatePlayingIcon($audioPlayer);

  if($audio[0].ended){
    stop($audioPlayer);
  }
}

//Sets the location of the song based off of the percentage of the slider clicked.
function setProgress($audioPlayer, $time){
  let $audio = $audioPlayer.find("audio.active");
  displayTime($audioPlayer);

  $audio[0].currentTime = $time.val();

  //this line updates all time control sliders so that everything is in sync
  $audioPlayer.find(".audio-control.time").val($audio[0].currentTime);
}

function updateVolumeIcon($audioPlayer){
  let $audio = $audioPlayer.find("audio.active");
  let $volumeIcon = $audioPlayer.find(".audio-control.mute > i");
  if($audio[0].muted) {
    $volumeIcon.text("volume_off");
    $audioPlayer.find(".audio-control.label[for='volume']").html("0%");
  } else {
    if($audio[0].volume < 0.01){
      $volumeIcon.text("volume_mute");
    } else if($audio[0].volume < 0.60){
      $volumeIcon.text("volume_down");
    } else {
      $volumeIcon.text("volume_up");
    }
    let level = Math.round($audio[0].volume * 100);
    $audioPlayer.find(".audio-control.label[for='volume']").html(level + "%");
  }
}

//Set's volume as a percentage of total volume based off of user click.
function setVolume($audioPlayer, $volume){
  let $audio = $audioPlayer.find("audio.active");
  $audio[0].muted = false;
  $audio[0].volume = $volume.val() / 100;
  //this line updates all volume control sliders so that everything is in sync
  $audioPlayer.find(".audio-control.volume").val($audio[0].volume * 100);
  updateVolumeIcon($audioPlayer);
}

function muteToggle($audioPlayer){
  let $audio = $audioPlayer.find("audio.active");
  $audio[0].muted = !$audio[0].muted;
  updateVolumeIcon($audioPlayer);
}

//make it so displays start off with generic data and don't  require $audio[0] to be loaded yet

function initDisplays($audioPlayer){
  let $audio = $audioPlayer.find("audio.active");
  $audioPlayer.find(".audio-control.time").attr("max", $audio[0].duration);
  // $audioPlayer.find(".audio-control.time").attr("max", 100);
  $audioPlayer.find(".audio-control.time").val(0);
  $audioPlayer.find(".audio-control.volume").val(100);
  $audioPlayer.find(".audio-control.play .play-icon").text("play_arrow");
  $audioPlayer.find(".audio-control.label[for='title']").text($audio.attr("name") + " (Paused)");
  displayTime($audioPlayer);
}

function skipTo($audioPlayer, skipTo){
  let $audio = $audioPlayer.find("audio");
  let activePos = 0;
  $audio.each(function(i){
    if($(this).hasClass("active")){
      activePos = i;
      return false;
    }
  });
  if(activePos === 0 && skipTo === "prev"){
    activePos = $audio.length - 1;
  } else if(activePos === $audio.length - 1 && skipTo === "next"){
    activePos = 0;
  } else {
    activePos += (skipTo === "prev" ? -1 : (skipTo === "next" ? 1 : 0));
  }

  let playing = !$audioPlayer.find("audio.active")[0].paused;
  loadSongByName($audioPlayer, $($audio[activePos]).attr("name"));
  if(playing){
    playToggle($audioPlayer);
  }
}

function initAudio(){
  $(".audio-player").each(function(){
    let $audio = $(this).find("audio.active");
    if(!$audio[0]){
      let $first = $(this).find("audio").first();
      $first.addClass("active");
      initDisplays($(this));
    }
  });
}

$(function(){
  initAudio();

  $('.modal').modal();
  $("audio").on("timeupdate", function(e){
    if($(this).hasClass("active")){
      updateTime($(this).parents(".audio-player"));
    }
  });
  $(".audio-control.select").on("click", function(e){
    e.preventDefault();
    let $audioPlayer = validateActiveAudio($(this));

    loadSongByName($audioPlayer, $(this).attr("for"));
    playToggle($audioPlayer);
  });
  $(".audio-control.play").on("click", function(e){
    e.preventDefault();
    playToggle(validateActiveAudio($(this)));
  });
  $(".audio-control.skip").on("click", function(e){
    e.preventDefault();
    skipTo(validateActiveAudio($(this)), $(this).data("skip"));
  });
  $(".audio-control.stop").on("click", function(e){
    e.preventDefault();
    stop(validateActiveAudio($(this)));
  });
  $(".audio-control.mute").on("click", function(e){
    e.preventDefault();
    muteToggle(validateActiveAudio($(this)));
  });
  $(".audio-control.time").on("input", function(e){
    setProgress(validateActiveAudio($(this)), $(this));
  });
  $(".audio-control.time").on("mousedown pointerdown", function(e){
    pause(validateActiveAudio($(this)));
  });
  $(".audio-control.time").on("mouseup pointerup", function(e){
    play(validateActiveAudio($(this)));
  });
  $(".audio-control.time").on("input", function(e){
    setProgress(validateActiveAudio($(this)), $(this));
  });
  $(".audio-control.volume").on("input", function(e){
    setVolume(validateActiveAudio($(this)), $(this));
  });
});
