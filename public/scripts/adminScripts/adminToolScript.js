var currentContext = "blogposts";

function setContextMenu(){
  $(".context-tool").remove();

  let $tools = $(".tools");
  switch(currentContext){
    case "blogposts":
      $tools.append($("<li class='right-align context-tool'><a href='#!' class='teal-text'>Add Post</a></li>"));
      $tools.append($("<li class='right-align context-tool'><a href='#!' class='teal-text'>Sort By Order</a></li>"));
      $tools.append($("<li class='right-align context-tool'><a href='#!' class='teal-text'>Sort By Date</a></li>"));
      break;
    case "messages":
      $tools.append($("<li class='right-align context-tool'><a href='#!' class='teal-text'>Sort By Date</a></li>"));
      break;
    case "audio":
      $tools.append($("<li class='right-align context-tool'><a href='#!' class='teal-text'>Add Audio</a></li>"));
      break;
    default:
      $tools.append($("<li class='right-align context-tool'><a href='#!' class='teal-text'>No Tools</a></li>"));
  }
}

function setContext(newContext){
  currentContext = newContext;
  setContextMenu();
}

$(function(){
  $(".context-select").on("click", function(e){
    e.preventDefault();
    setContext($(this).data("display"));
  });
});
