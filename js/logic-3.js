$(document).ready(function(){
  // Edamam API
  var appId = "8666c2e4";
  var appKey = "5e7ed41f54702cd0b4a05804a1699162";

  var chopUrl = "https://choppingboard.recipes/api/v0/recipe?key=";
  var chopKey = "616a792487dea73d933609aaa6e40ea0";

  var searchTerms = [];
  var searchString = "";

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDpXqN21PSdLJmBHk8L6wnfr41qaHgkAco",
    authDomain: "fridgetotable-1525215123924.firebaseapp.com",
    databaseURL: "https://fridgetotable-1525215123924.firebaseio.com",
    projectId: "fridgetotable-1525215123924",
    storageBucket: "fridgetotable-1525215123924.appspot.com",
    messagingSenderId: "123114667394"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //////////////////////////////////////////////////////////////////////////
  //  FUNCTIONS
  //////////////////////////////////////////////////////////////////////////

  function displayIngredients() {
    $("#ingredient-list").empty();
    for (var i = 0; i < searchTerms.length; i++) {
      // var p = $("<p>").text(searchTerms[i]);
      // var b = $("<button class='delete'>").text("x").attr("data-index", i);
      var b = $("<button>")
            .attr("type", "submit")
            .attr("data-index", i)
            .attr("class", "delete btn btn-primary")
            .text(searchTerms[i]);
      // p.prepend(b);
      $("#ingredient-list").prepend(b);
    }
  }

  function findRecipes () {
    // Clear ajax "q" search string
    searchString = "";
    // Clear displayed recipes
    $("#recipe-list").empty();
    console.log(searchTerms);

    // Stop function if there are no search terms
    if (searchTerms.length <= 0) { searchTerms = []; return; }    

    // Build ajax "q" search string
    for (var i = 0; i < searchTerms.length; i++) {
      searchString += searchTerms[i] + "+"; //?
    }

    // Build ajax query
    var queryURL = "https://api.edamam.com/search?" +
          "q=" + searchString + 
          "&app_id=" + appId +
          "&app_key=" + appKey +
          "&to=12";

    // Call Edamam API
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      var results = response.hits;
      var colCount = 0;
      var colMax = 4;
      var recipeList = $("#recipe-list");
      var row = $('<div class="row">');
      console.log(response);

      // Iterate through recipe search response
      for (var j = 0; j < results.length; j++) {
 
        // First build Card to hold the recipe
        var col = $('<div class="col-lg-3 col-md-6 mb-4">');
        var card = $('<div class="card h-100">');
        var image = $('<img class="card-img-top img-crop">')
              .attr('src', results[j].recipe.image);
        var cardBody = $('<div class="card-body">');
        var title = $('<h4 class="card-title">')
              .text(results[j].recipe.label);
        var ingredients = $('<p class="card-text">');
        var ul = $("<ul>");
        var footer = $('<div class="card-footer">' +
              '<button type="submit" class="get-instructions btn btn-primary" data-toggle="modal" data-target="#exampleModal" ' + 
              'value="' + results[j].recipe.url + '">Instructions</button>' +
              '<button type="submit" class="save-recipe btn btn-primary"  ' + 
              'value="' + results[j].recipe.url + '" ' + 
              '>Save Recipe</button>'
            );
 
        var modal = $('<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Recipe Instructions</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body">...</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div>');

        // Display recipe ingredients
        for (var i = 0; i < results[j].recipe.ingredientLines.length; i++) {
          var li = $("<li>");
          li.text(results[j].recipe.ingredientLines[i]);
          ul.append(li);
        }

        // Build recipe bootstrap card
        ingredients.append(ul);
        cardBody.append(title).append(ingredients);
        footer.append(modal);
        card.append(image).append(cardBody).append(footer);
        col.append(card);
        row.append(col);

        colCount++;        

        // If reached max columns, append row and start a new one
        if (colCount === colMax) {
          recipeList.append(row);
          row = $('<div class="row">');
          colCount = 0;
        }        
      }
    });
  }

  // function getRecipe(recipe) {
  //   var recipeUrl = "";

  //   var queryURL = "https://api.yummly.com/v1/api/recipe/" + recipe + "?" +
  //         "_app_id=" + appId +
  //         "&_app_key=" + appKey;

  //   $.ajax({
  //     url: queryURL,
  //     method: "GET"
  //   }).then(function(recipeResponse) {
  //     recipeUrl = recipeResponse.source.sourceRecipeUrl;  
  //     console.log(recipeUrl);
  //     return (recipeUrl);
  //   });
  // }

  // $(document).on("click", "recipeImage recipeTitle", function(){
  //   // event.preventDefault();
  //   var currentRecipe = $(this).attr("data-id");
  //   searchTerms.splice(currentIndex, 1);
  //   displayIngredients();
  //   findRecipes();
  // });


  //////////////////////////////////////////////////////////////////////////
  //  EVENT HANDLERS
  //////////////////////////////////////////////////////////////////////////

  $(document).on("click", ".delete", function(){
    var currentIndex = $(this).attr("data-index");
    searchTerms.splice(currentIndex, 1);
    displayIngredients();
    findRecipes();
  });

  $(document).on("click", ".get-instructions", function(){
    var chopQueryURL = chopUrl + chopKey + "&q=" + $(this).prop("value");
    $.ajax({
      url: chopQueryURL,
      method: "GET"
    }).then(function(values){
      var ul = $("<ul>");
      for (var i = 0; i < values.instructions.length; i++) {
        var li = $("<li>");
        li.text(values.instructions[i]);
        ul.append(li);
      }
      $(".modal-body").empty();
      $(".modal-body").append(ul);
    });
  });

  $(document).on("click", ".save-recipe", function(){

    var chopQueryUrl = chopUrl + chopKey + "&q=" + $(this).prop("value");

    $.ajax({
      url: chopQueryUrl,
      method: "GET"
    }).then(function(values){
      console.log(values);
      var recipeName = values.name;
      console.log(recipeName)
      var ingredients = values.ingredients;
      console.log(ingredients);
      var instructions = values.instructions;
      console.log(values.instructions);
      var servingSize = values.yield;
      console.log(values.yield);
      var prepTime = values.prepTime;
      console.log(values.prepTime);
      var cookTime = values.cookTime;
      console.log(values.cookTime)
      var savedRecipe = {
          recipeName : recipeName,
          recipeIngredients : ingredients,
          recipeInstructions : instructions,
          servingSize : servingSize,
          prepTime : prepTime,
          cookTime : cookTime
      };

      database.ref().push(savedRecipe);
    });
  });

  $("#add-ingredient").on("click", function(){
    event.preventDefault();
    var ingredient = $("#input-ingredient").val().trim();
    if(ingredient){
      searchTerms.push(ingredient);
      $("#input-ingredient").val("");
      displayIngredients();
      findRecipes();
    }
  });


  // Attempt at getting the About link to produce a modal for an About Us instead of a second page
  $("#about").on("click", function(){
    var modalAbout = $('<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">About</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body">We are Fringe To Table. We started trying to find beer, but then we found food.</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div>');
    $("body").append(modalAbout);
  });
});