/*
    Giphy API Access using AJAX

    Dan Orlovsky
    UNCC Bootcamp
*/
'use strict';
 

// We will push this button object into the button array.
function buttonObject(text, searchString) {
    this.text = text;
    this.searchString = searchString;
};

// our app object
var giphyAccess = {
    api_key: "YfyxamYpvZdmkE8dW4qmwU2VZWSsB4J1",        // ApiAccess Key
    queryUrl: "https://api.giphy.com/v1/gifs/search",   // Base URL
    
    // Ratings 0 - 2 will automatically be checked.
    ratings: ['y', 'g', 'pg', 'pg-13', 'r'], // Ratings options MPAA
    
    default_rating: 1,          // Default rating will be G 
    buttons: [],                // Array of buttonObjects, we will display buttons from this array.
    
    
    // makeApiCall: function(srchStr)
    // Takes a searchString as a paramater, returns the results of an ajax call
    makeApiCall: function (srchStr) {
        return $.ajax({
            url: srchStr,
            method: "GET"
        });
    },

    // performSearch: function(button)
    // Takes the button which was pressed as a parameter, grabs the data-search attribute which contains the search string,
    // and passes that to the makeApiCall.  When the ajax call is finished, we display the results.
    performSearch: function (button) {
        $.when(this.makeApiCall($(button).attr("data-search"))).done(function (results) {
            giphyAccess.displayResults(results);
        });
    },
    
    // showButtons: function()
    // Loops through the buttons array, builds a button off each object and displays them on the DOM.
    showButtons: function () {
        // Begins the loop
        $('#buttons-view').empty();
        this.buttons.forEach(function (currentValue, idx) {
            // Creates a button to display on the screen.
            var newButton = $("<button></button>")
                .attr("data-search", currentValue.searchString)
                .addClass("search-button").text(currentValue.text);

            // Adds the button to the buttons-view div.
            $("#buttons-view").prepend(newButton);
        });

    },

    // addSearchButton: function()
    // Adds a new search button to the view-buttons div in the DOM.
    addSearchButton: function () {
        var searchTerm = $("#gif-search").val().trim(); // Gets the search term
        var maxRatings = $('input[name=ratings]:checked').val(); // Gets the max checked rating
        var imgLimit = $("#image-limit").val().trim(); // Gets the number inside the image-limit textbox.

        // Build the search string
        var searchString = `${this.queryUrl}?q=${searchTerm}&rating=${ maxRatings }&limit=${ imgLimit }&api_key=${ this.api_key }`;
        
        // Adds a new button to our buttons array.
        this.buttons.push(new buttonObject(searchTerm, searchString));

        // Calls the function that displays the buttons.
        this.showButtons();
    },

    // displayResults: function(results)
    // Takes the JSon object returned from the ajax call as a parameter.  Displays the images on the screen.
    // Wait until the image is loaded before we display it.
    displayResults: function (results) {
        var container = $("#results-container"); // Gets the container where we're displaying the results
        var images = results.data; // Assigns the data to a variable to avoid having to use .data
        container.empty(); // Empties the results container

        // Cycles through each element in the array.
        images.forEach(function (currentValue, idx) {

            // Creates a new div with the image-display class.
            var imgDiv = $("<div>").addClass("image-display");

            // Creates an image element, waits for the image to load.
            var image = $(`<img src="${ currentValue.images.fixed_height_still.url }" alt="Giphy Gif" class="gif-img" data-alt="${ currentValue.images.fixed_height.url }" />`)

            // After loaded, add the image to the image div.
            imgDiv.append(image);

            // Add the rating to the div
            imgDiv.append(`<h2>Rating: ${ currentValue.rating }</h2>`)

            // Add the image div to the results container.
            container.prepend(imgDiv);

        })
    },

    // swapImages: function(imgContainer)
    // Swaps the src and data-alt attributes.  One will store the uri to a still image, the other to the animated.
    swapImages: function(imgContainer) {
        var tempImg = $(imgContainer).attr("src");
        var oldImg =  $(imgContainer).attr("data-alt");
        $(imgContainer).attr("src", oldImg);
        $(imgContainer).attr("data-alt", tempImg);
    },
}

// Shorten the name of giphyAccess
var ga = giphyAccess;

// addRatings() function
// Adds rating values to the screen as radio buttons
function addRatings() {
    ga.ratings.forEach(function (currentValue, idx) {

        // We use prop as a string to add the 'checked' attribute when we are adding the rating which will be default.
        var prop = "";

        // If we're at the default rating, make prop = "checked"
        if (idx === ga.default_rating) {
            prop = "checked";
        }

        // Creates a new radio button
        var newTag = `<input type="radio" class="upto-rating" value="${ currentValue }" name="ratings" ${ prop }> ${currentValue }<br />`;

        // Adds the radio button
        $("#ratings-select").append(newTag);

    })
}


// Adds ratings to the forms and clears out displays
function startupSite() {
    // Display the acceptable ratings
    addRatings();
    // Clear out the buttons/results views
    $("#buttons-view").empty();
    $("#results-container").empty();
}

// This event listener is fired when the user clicks a gif.
$(document).on("click", ".gif-img", function(e) {
    ga.swapImages(this);
});

// When we've clicked the submit button
$("#search-button").on("click", function (e) {
    e.preventDefault();
    ga.addSearchButton();
    $("#gif-search").val("").focus();
});



// When we click on a search button.
$("#buttons-view").on("click", ".search-button", function () {
    ga.performSearch(this);
}); 

// Entry point for when the document is ready.
$(document).ready(startupSite);
