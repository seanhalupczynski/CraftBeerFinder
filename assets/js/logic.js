$(document).ready(function(){
  var appId = "a14e56b9";
  var appKey = "f8fa949610a90e86f7508bbf80978218";

  var searchTerms = [];
  var searchString = "";


  function displayIngredients() {
    $("#ingredient-list").empty();
    for (var i = 0; i < searchTerms.length; i++) {
      var p = $("<p>").text(searchTerms[i]);
      var b = $("<button class='delete'>").text("x").attr("data-index", i);
      p.prepend(b);
      $("#ingredient-list").prepend(p);
    }
  }


  function recipeSearch () {
    searchString = "";
    $("#recipe-list").empty();

    if (searchTerms.length === 0) {
      return false;
    }

    for (var i = 0; i < searchTerms.length; i++) {
      searchString = searchString + searchTerms[i] + "+";
    }

    var queryURL = "https://api.yummly.com/v1/api/recipes?" +
        "_app_id=" + appId +
        "&_app_key=" + appKey + 
        "&q=" + searchString + 
        "&requirePictures=true";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      
      console.log(response);

      $("#recipe-list").empty();

      for (var j = 0; j < response.matches.length; j++) {
        if (response.matches[j].smallImageUrls) {
          var recipeDiv = $("<div>");
          var recipeTitle = $("<div>");
          var recipeIngredients = $("<div>");
          var recipeImage = $("<img>");
          var ul = $("<ul>");

          for (var i = 0; i < response.matches[j].ingredients.length; i++) {
            // console.log(response.matches[j].ingredients[i]);
            var li = $("<li>");
            li.attr("class", "recipe-ingredient");
            li.text(response.matches[j].ingredients[i]);

            for (var k = 0; k < searchTerms.length; k++) {
              if (new RegExp(searchTerms[k]).test(response.matches[j].ingredients[i])) {
                li.css("text-decoration-line", "line-through");
                // alert(searchTerms[k]);
              }
            }
            ul.append(li);
          }

          recipeIngredients.append(ul);

          recipeDiv.text(response.matches[j].recipeName);
          recipeDiv.attr("id", response.matches[j].id)        

          recipeImage.attr("src", response.matches[j].smallImageUrls[0]);
          recipeDiv.append(recipeTitle).append(recipeImage).append(recipeIngredients);

          $("#recipe-list").append(recipeDiv);
        }
      }
    });
  }

  
  $(document).on("click", "button.delete", function(){
    event.preventDefault();
    var currentIndex = $(this).attr("data-index");
    searchTerms.splice(currentIndex, 1);
    displayIngredients();
    recipeSearch();
  });

  
  $("#add-ingredient").on("click", function(){
    event.preventDefault();
    var ingredient = $("#input-ingredient").val().trim()
    if(ingredient){
      searchTerms.push(ingredient);
      $("#input-ingredient").val("");
      displayIngredients();
      recipeSearch();
    }
  });
});