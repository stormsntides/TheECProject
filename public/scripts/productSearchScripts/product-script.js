// const filters = ["Aranjuez", "Augustine", "Curt Mangan", "D'Addario", "Dampit", "Dean Markley", "DR", "Dr Duck's", "Dunlop", "Elixir", "Ernie Ball", "Everly", "Fender", "Fred Kelly", "Godin", "Guitar Grips", "Hannabach", "John Pearse", "La Bella", "Martin", "Newtone", "Page Flip", "Pickboy", "Planet Waves", "Pyramid", "Rotosound", "Savarez", "Spider Capo", "Steve Clayton", "Worth"];

function updateEditForm(productID){
  // need to retrieve the product from the database and input each value into the edit form
  $.getJSON("/product/" + productID, function(data){
    $("#edit-form").attr("action", "/product/" + data._id + "?_method=PUT");
    $("#edit-form input[name='product[code]']").val(data.code);
    $("#edit-form input[name='product[name]']").val(data.info.name);
    $("#edit-form input[name='product[manu]']").val(data.info.manu);
    $("#edit-form textarea[name='product[desc]']").val(data.info.desc);
    $("#edit-form input[name='product[loc]']").val(data.loc);
    $("#edit-form input[name='product[tags]']").val(data.tags.join(", "));
    // make sure input labels don't overlap the values
    Materialize.updateTextFields();
  });
}

function formatFoundProducts(foundProducts) {
  let html = "<ul class='collapsible popout' data-collapsible='accordion'>";
  for (let i = 0; i < foundProducts.length; i++) {
    html += "<li id='" + foundProducts[i]._id + "'>" +
              "<div class='collapsible-header" + (i === 0 ? " active" : "") + "'>" +
                "<i class='material-icons'>list</i>" + foundProducts[i].code + "<span class='margin-left'>" + foundProducts[i].loc + "</span>" +
              "</div>" +
              "<div class='collapsible-body grey lighten-3'>" +
                "<h5>" + foundProducts[i].info.name + " by " + foundProducts[i].info.manu + "</h5>" +
                "<p>" + foundProducts[i].info.desc + "</p>" +
                "<hr>" +
                "<div>" +
                  "<a href='#edit-form' class='modal-trigger btn-flat waves-effect waves-yellow'>Edit</a>" +
                "</div>" +
              "</div>" +
            "</li>";
  }
  html += "</ul>";
  return html;
}

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

function updatePagination(productCount, currentPage, maxPage){
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
    createPagination(productCount, currentPage, maxPage);
  }
}

function updateRecentSearches(term) {
  let $recent = $(".recent-searches");
  // attach the search term to the recent search list
  $recent.prepend("<li class='right-align'><a href='#!' class='red-text'>" + term + "</a></li>");
  $recent.map(function() {
    // childCount will keep track of how many children have been counted through
    let childCount = 0;
    $(this).children("li").each(function(i) {
      let text = $(this).children().text();
      if (childCount >= 10 || (term === text && i > 0)) {
        $(this).remove();
        // it's possible that the term will match the current text, remove this child from the remaining count
        childCount--;
      }
      // advance the child count to the next child
      childCount++;
    });
  });
}

function loadResults(searchTerm, page=1, size=20){
  let term = /\S/.test(searchTerm) ? searchTerm : "all";
  $('.collapsible').collapsible('destroy');
  // send the "none" value as the id to the server; it will be recognized as a search query instead
  $.getJSON("/product/none?search=" + term + "&page=" + page + "&pagesize=" + size, function(data){
    let $results = $("#results");
    $results.fadeOut(300, "linear", function() {
      $results.html(formatFoundProducts(data.results));
      $('.collapsible').collapsible();
      $results.prepend("<h3 class='white-text'>Displaying " + data.results.length + " result" + (data.results.length === 1 ? " " : "s ") + "of " + data.count + " found for \"" + term + "\"</h3>");
      $results.delay(500).fadeIn(300, "linear");
    });
    if(data.count > size){
      updatePagination(data.count, data.pages.currentPage, data.pages.lastPage);
    } else {
      $(".pagination").empty();
    }
  });
}

function search(term) {
  updateRecentSearches(term);
  loadResults(term);
}

$(document).ready(function() {
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
  const $addForm = $("#add-form");
  const $editForm = $("#edit-form");
  const $deleteForm = $("#delete-form");
  const $search = $("#search");
  const $results = $("#results");
  const $pages = $(".pagination");
  const $deleteBtn = $("#delete-product-btn");

  $addForm.on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: $addForm.attr("action"),
      method: $addForm.attr("method"),
      dataType: "JSON",
      data: $addForm.serialize()
    }).done(function(data){
      console.log(data.message); // this was added to give users an update on what's going on, especially when data is maxed out
      // after sending data via AJAX add form to add a new product, display all products in the database
      loadResults("all");
    });
  });
  
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
  
  $editForm.on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: $editForm.attr("action"),
      method: $editForm.attr("method"),
      dataType: "JSON",
      data: $editForm.serialize()
    }).done(function(){
      // after sending data via AJAX edit form to update a product, display the most recent search term
      let searchTerm = $(".recent-searches a:first").text();
      loadResults(searchTerm);
    });
  });

  $searchForm.on("submit", function(e) {
    e.preventDefault();
    search($search.val());
    $search.val("");
  });
  
  $results.on("click", "a", function(e){
    if($(this).attr("target") !== "_blank"){
      e.preventDefault();
      let productID = $(this).parents("li:first").attr("id");
      updateEditForm(productID);
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
    $deleteForm.attr("action", $editForm.attr("action").replace("PUT", "DELETE"));
    $("#delete-product-code").text($editForm.find("input[name='product[code]']").val());
    $("#delete-product-name").text($editForm.find("input[name='product[name]']").val());
  });
  
  // go ahead and populate page with all entries
  loadResults("all");
});
