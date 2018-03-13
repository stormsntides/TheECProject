var isDown = false;

function clamp(num, min, max){
  if(min > max) { let temp = min; min = max; max = temp; }
  return (num >= min ? (num <= max ? num : max) : min);
}

function validateData($range){
  let min = $range.data("min"),
      max = $range.data("max"),
      value = $range.data("value");

  if(!min || min < 0){
    $range.data("min", 0);
    min = $range.data("min");
  }
  if(!max || max < min){
    $range.data("max", min + 100);
    max = $range.data("max");
  }
  if(value){
    $range.data("value", clamp(value, min, max));
  } else {
    $range.data("value", min);
  }
}

function updatePosition($range, e){
  e.preventDefault();

  let boundRect = $range[0].getBoundingClientRect();
  let xClick = clamp(e.screenX - boundRect.x, 0, boundRect.width);
  let prWidth = (xClick / boundRect.width) * 100;

  $(".prev-range").css({"width": prWidth + "%"});
  $range.find(".range-thumb").css({"left": (boundRect.x + xClick - 6) + "px"});
}

$(function(){
  let $doc = $("html");
  let $customInput = $(".custom-input");
  let $range = $(".range-input");
  let $prevRange = $("<span class='prev-range' style='width: 0'></span>");
  let $rangeThumb = $("<span class='range-thumb' style='left:" + ($range[0].getBoundingClientRect().x - 6) + "px'></span>");
  $range.attr("tabindex", 0);
  $range.append($prevRange);
  $range.append($rangeThumb);
  validateData($range);

  $customInput.on("mousedown pointerdown", function(e){
    $doc.addClass("active-hover");
    isDown = true;
    updatePosition($range, e);
  });
  $doc.on("mouseup pointerup", function(e){
    if(isDown){
      $doc.removeClass("active-hover");
      isDown = false;
      updatePosition($range, e);
    }
  });
  $doc.on("mousemove pointermove", function(e){
    if(isDown){
      updatePosition($range, e);
    }
  });
});
