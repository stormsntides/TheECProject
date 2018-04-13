function createPagination(productCount, currentPage, maxPage){
  let $pages = $(".pagination");
  $pages.empty();

  // let maxPage = Math.ceil(productCount / pageSize);
  // let curPage = (currentPage <= 0 ? maxPage : (currentPage > maxPage ? 1 : currentPage));

  console.log("CurrentPage: " + currentPage + ", MaxPage: " + maxPage);
  // console.log("MaxPage: " + maxPage + ", CurPage: " + curPage);
  for(let i = 1; i <= maxPage; i++){
    // let isActive = (i + 1) === curPage;
    let isActive = i === currentPage;

    let $newPage = $("<li></li>");
    $newPage.addClass((isActive ? "red darken-4 " : "") + "waves-effect");

    let $newLink = $("<a href='#!'>" + i + "</a>");
    $newLink.addClass((isActive ? "active-page " : "") + "grey-text text-lighten-2");
    $newLink.data("page", i);

    $newPage.append($newLink);
    $pages.append($newPage);
  }

  let $prev = $("<li></li>");
  $prev.addClass("waves-effect");
  let $next = $("<li></li>");
  $next.addClass("waves-effect");

  let $prevLink = $("<a href='#!'></a>");
  $prevLink.addClass("grey-text text-lighten-2");
  $prevLink.data("page", "prev");
  $prevLink.html("<i class='material-icons'>chevron_left</i>");
  let $nextLink = $("<a href='#!'></a>");
  $nextLink.addClass("grey-text text-lighten-2");
  $nextLink.data("page", "next");
  $nextLink.html("<i class='material-icons'>chevron_right</i>");

  $prev.append($prevLink);
  $next.append($nextLink);

  $pages.prepend($prev);
  $pages.append($next);
}

function updatePagination(objectCount, currentPage, maxPage){
  if($(".pagination").children("li").length === maxPage + 2){
    console.log("Updating pagination");

    let $oldParent = $(".active-page").parent("li");
    $oldParent.removeClass("red darken-4");
    $oldParent.children("a").removeClass("active-page");

    let $newParent = $(".pagination > li:nth-of-type(" + (currentPage + 1) + ")");
    $newParent.addClass("red darken-4");
    $newParent.children("a").addClass("active-page");
  } else {
    console.log("Creating pagination");
    createPagination(objectCount, currentPage, maxPage);
  }
}

$(function() {
  $(".button-collapse").sideNav({
    edge: "right",
    closeOnClick: true
  });
  $('.modal').modal({
    complete: function() {
      $(".modal").find("input").each(function(i, ele) {
        $(ele).val("");
      });
      $(".modal").find("textarea").each(function(i, ele) {
        $(ele).val("");
      });
      // update the input fields so that labels sit correctly
      Materialize.updateTextFields();
    }
  });

  const $deleteForm = $("#delete-message-form");
  const $results = $("#results");
  const $pages = $(".pagination");
  const $deleteBtn = $(".delete-btn");

  $deleteForm.on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: $deleteForm.attr("action"),
      method: $deleteForm.attr("method"),
      dataType: "JSON"
    }).done(function(){
      // after sending data via AJAX delete form to delete a product, display the most recent search term
      let searchTerm = $(".recent-searches a:first").text();
      loadResults(searchTerm);
    });
  });

  $results.on("click", "a", function(e){
    if($(this).attr("target") !== "_blank"){
      e.preventDefault();
      let blogpostID = $(this).parents("li:first").attr("id");
      updateEditForm(blogpostID);
    }
  });

  $pages.on("click", "a", function(e){
    e.preventDefault();
    let searchTerm = $(".recent-searches a:first").text();

    if($(this).data("page") === "prev"){
      let active = $(".active-page").data("page");
      loadResults(searchTerm, active - 1);
    } else if($(this).data("page") === "next"){
      let active = $(".active-page").data("page");
      loadResults(searchTerm, active + 1);
    } else {
      loadResults(searchTerm, $(this).data("page"));
    }
  });

  $deleteBtn.on("click", function(e){
    e.preventDefault();
    let $messageID = $(this).parents("li").attr("id");
    $deleteForm.attr("action", "/demo/johnny/inbox/" + messageID + "?_method=DELETE");
    $("#delete-message-subject").text($editForm.find("input[name='blogpost[title]']").val());
    $("#delete-blogpost-summary").text($editForm.find("textarea[name='blogpost[summary]']").val());
  });
});
