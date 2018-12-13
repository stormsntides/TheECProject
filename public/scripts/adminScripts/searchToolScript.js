const searchOptions = {
  contextUrl: {
    blogposts: "/admin/blog",
    messages: "/admin/inbox",
    audio: "/admin/audio"
  }
};

const searchResults = {
  data: {},
  displayHtml: ""
};

function createPagination(currentPage, maxPage){
  let $pages = $(".pagination");
  $pages.empty();

  console.log("CurrentPage: " + currentPage + ", MaxPage: " + maxPage);
  for(let i = 1; i <= maxPage; i++){
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
};

function updatePagination(currentPage, maxPage){
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
    createPagination(currentPage, maxPage);
  }
};

function updateRecentSearches(term, listSize=10) {
  let $recent = $(".recent-searches");
  // attach the search term to the recent search list
  $recent.prepend("<li class='right-align'><a href='#!' class='red-text'>" + term + "</a></li>");
  $recent.map(function() {
    // childCount will keep track of how many children have been counted through
    let childCount = 0;
    $(this).children("li").each(function(i) {
      let text = $(this).children().text();
      if (childCount >= listSize || (term === text && i > 0)) {
        $(this).remove();
        // it's possible that the term will match the current text, remove this child from the remaining count
        childCount--;
      }
      // advance the child count to the next child
      childCount++;
    });
  });
};

function loadResults(searchTerm, url, page=1, size=20){
  let term = /\S/.test(searchTerm) ? searchTerm : "all";
  $('.collapsible').collapsible('destroy');

  // send the "none" value as the id to the server; it will be recognized as a search query instead
  $.getJSON(url + "/none?search=" + term + "&page=" + page + "&pagesize=" + size, function(data){
    searchResults.data = data.results;
    searchResults.displayHtml = "<h3 class='grey-text text-darken-3'>Displaying " + data.results.length + " result" + (data.results.length === 1 ? " " : "s ") + "of " + data.count + " found for \"" + term + "\"</h3>";

    if(data.count > size){
      updatePagination(data.pages.currentPage, data.pages.lastPage);
    } else {
      $(".pagination").empty();
    }
  });
};

function search(term) {
  updateRecentSearches(term);
  loadResults(term, searchOptions.contextUrl["blogposts"]);
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
  $('.quick-search, .recent-searches').on("click", "a", function(e) {
    e.preventDefault();
    $('.button-collapse').sideNav('hide');
    // whichever value was clicked will be used as the search term
    search($(this).text());
  });

  const $searchForm = $("#search-form");
  const $search = $("#search");
  const $pages = $(".pagination");

  $searchForm.on("submit", function(e) {
    e.preventDefault();
    search($search.val());
    $search.val("");
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

  // go ahead and populate page with all entries
  // loadResults("all");
  loadResults("all", searchOptions.contextUrl["blogposts"]);
});
