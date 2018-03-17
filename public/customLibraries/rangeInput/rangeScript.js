function clamp(num, min, max){
  let trueMin = min <= max ? min : max,
      trueMax = max >= min ? max : min;
  return (num >= trueMin ? (num <= trueMax ? num : trueMax) : trueMin);
}

function getDisplayValue($range, e){
  let boundRect = $range[0].getBoundingClientRect();
  let mouseValue = clamp(
    Math.round(((e.screenX - boundRect.x) / boundRect.width) * $range.attr("max")),
    $range.attr("min"),
    $range.attr("max")
  );

  let value = "";
  if($range.data("display") === "time"){
    let seconds = (Math.floor(mouseValue % 60) < 10 ? '0' : '') + Math.floor(mouseValue % 60),
        minutes = Math.floor(mouseValue / 60);
    value += minutes + ":" + seconds;
  } else {
    value += mouseValue;
  }
  return value;
}

function displayValue($range, e){
  let $display = $(".value-display"),
      boundRect = $range[0].getBoundingClientRect();
  //set up display with proper display type
  $display.text(getDisplayValue($range, e));
  //calculate position after display is set up; proper width can be attained now
  let halfWidth = ($display[0].getBoundingClientRect().width / 2),
      position = clamp((e.clientX - boundRect.left), 0, boundRect.width) - halfWidth;
  //set position of value display
  $display.css({
    "left": position,
    "top": -25
  });
}

function updateRangeBar($range){
  //get components of the track for updating
  let $progress = $range.siblings(".range-track").find(".range-progress");
  //calculate and set the width
  let prevWidth = ($range.val() / $range.attr("max")) * 100;
  $progress.css({"width": prevWidth + "%"});
}

//initial setup of the .custom-range inputs
function modifyRangeInputs(){
  let $range = $("input[type='range'].custom-range");
  $range.each(function(){
    let trackClasses = $(this).data("track-class"),
        progressClasses = $(this).data("progress-class"),
        thumbClasses = $(this).data("thumb-class");

    //create a container to hold all of the necessary parts of the slider
    let $wrapper = $("<div class='custom-range-wrapper'></div>");
    $(this).before($wrapper);
    $wrapper.append($(this));
    //create a container for the track to be displayed beneath the range input
    let $track = $("<span class='range-track'></span>");
    $track.addClass(trackClasses ? trackClasses : "");
    $wrapper.append($track);
    //create the part of the track that comes before the thumb
    let $progress = $("<span class='range-progress'></span>");
    $progress.addClass(progressClasses ? progressClasses : "");
    $track.append($progress);
    $progress.css({
      "width": "0"
    });
    //create the thumb
    let $thumb = $("<span class='range-thumb'></span>");
    $thumb.addClass(thumbClasses ? thumbClasses : "");
    $track.append($thumb);
  });
}

function initRanges(){
  //update each .custom-range that has an initial value
  $("input[type='range'].custom-range").each(function(){
    updateRangeBar($(this));
  });
}

$(function(){
  modifyRangeInputs();
  initRanges();

  $("input[type='range'].custom-range").on("input", function(e){
    $("span.thumb").remove(); //remove materialize css thumb
    $(this).removeClass("active");
    updateRangeBar($(this));
  });
  $("input[type='range'].custom-range").on("change", function(e){
    $(this).removeClass("active-range");
    updateRangeBar($(this));
  });
  $("input[type='range'].custom-range").on("mousedown pointerdown", function(e){
    $(this).addClass("active-range");
  });
  $("input[type='range'].custom-range").on("mouseenter", function(e){
    if($(this).data("display")){
      let displayClasses = $(this).data("display-class");
      let $display = $("<span class='value-display" + (displayClasses ? " " + displayClasses : "") + "' style='position: absolute; z-index: 515'></span>");
      $(this).siblings(".range-track").append($display);
    }
  });
  $("input[type='range'].custom-range").on("mousemove", function(e){
    if($(this).data("display")){
      displayValue($(this), e);
    }
  });
  $("input[type='range'].custom-range").on("mouseleave", function(e){
    if($(this).data("display")){
      $(".value-display").remove();
    }
  });
});
