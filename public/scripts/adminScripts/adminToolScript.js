var context = {
  current: "blogposts",
  tools: []
};

function setContextMenu(){
  let $tools = $(".context-menu");
  $tools.empty();

  switch(context.current){
    case "blogposts":
      $tools.append($("<li class='right-align'><a href='#!' class='teal-text'>Add Post</a></li>"));
      $tools.append($("<li class='right-align'><a href='#!' class='teal-text'>Sort By Order</a></li>"));
      $tools.append($("<li class='right-align'><a href='#!' class='teal-text'>Sort By Date</a></li>"));
      break;
    case "messages":
      $tools.append($("<li class='right-align'><a href='#!' class='teal-text'>Sort By Date</a></li>"));
      break;
    case "audio":
      $tools.append($("<li class='right-align'><a href='#!' class='teal-text'>Add Audio</a></li>"));
      break;
    default:
      $tools.append($("<li class='right-align'><a href='#!' class='teal-text'>No Tools</a></li>"));
  }
}

function setContext(newContext){
  context.current = newContext;
  setContextMenu();
}

$(function(){
  $(".context-select").on("click", function(e){
    e.preventDefault();
    setContext($(this).data("display"));
  });
});
