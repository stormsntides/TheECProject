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

    let boundRect = $(this)[0].getBoundingClientRect();
    //create a container to hold all of the necessary parts of the slider
    let $wrapper = $("<div class='custom-range-wrapper'></div>");
    $(this).before($wrapper);
    $wrapper.append($(this));
    //create a container for the track to be displayed beneath the range input
    let $track = $("<span class='range-track'></span>");
    $track.addClass(trackClasses ? trackClasses : "");
    $wrapper.append($track);
    $track.css({
      "width": boundRect.width
    });
    //create the part of the track that comes before the thumb
    let $progress = $("<span class='range-progress'></span>");
    $progress.addClass(progressClasses ? progressClasses : "");
    $track.append($progress);
    $progress.css({
      "width": "0"
    });

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
});
