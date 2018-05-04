$("document").ready(function(){
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

  // Choppingboard API
  var chopURL = "https://choppingboard.recipes/api/v0/recipe?key=";
  var chopKey = "616a792487dea73d933609aaa6e40ea0";


// onclick function to add ingredients to the ingredients array
    $("body").on("click",".recipe", function(){

        // event.preventDefault();

    // Pushing the new ingredient into the ingredients array
        // ingredients.push($("#ingredient").val().trim());

        // console.log(ingredients);

    // onclick function to push user ingredients to firebase
        // $("#find-recipes").on("click", function(){
        // //   User ingredients object
        //     var yourIngredients = {
        //         ingredientsInFridge : ingredients
        //     };

        // // pushing user ingredients into firebase
        //     database.ref().push(yourIngredients);
        // });
        var chopQueryURL = chopURL + chopKey + "&q=" + $(this).prop("value");

        $.ajax({
          url: chopQueryURL,
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

    // console.log(ingredients);
});
