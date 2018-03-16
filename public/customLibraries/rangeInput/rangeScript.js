function updateRangeBar($range){
  //get components of the track for updating
  let $prev = $range.siblings(".range-track").find(".range-prev"),
      $next = $prev.siblings(".range-next");
  //calculate the width of each out of 100%
  let prevWidth = ($range.val() / $range.attr("max")) * 100,
      nextWidth = 100 - prevWidth;
  //set each width
  $prev.css({"width": prevWidth + "%"});
  $next.css({"width": nextWidth + "%"});
}

//initial setup of the .custom-range inputs
function modifyRangeInputs(){
  let $range = $("input[type='range'].custom-range");
  $range.each(function(){
    let boundRect = $(this)[0].getBoundingClientRect();
    //create a container to hold all of the necessary parts of the slider
    let $container = $("<div class='custom-range-container'></div>");
    $(this).before($container);
    $container.append($(this));
    //create a container for the track to be displayed beneath the range input
    let $track = $("<span class='range-track'></span>");
    $container.append($track);
    $track.css({
      "left": boundRect.x,
      "width": boundRect.width
    });
    //create the part of the track that comes before the thumb
    let $prev = $("<span class='range-prev'></span>");
    $track.append($prev);
    $prev.css({
      "width": "0"
    });
    //create the part of the track that comes after the thumb
    let $next = $("<span class='range-next'></span>");
    $track.append($next);
    $next.css({
      "width": "100%"
    });
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
});
