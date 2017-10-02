/*
    Giphy API Access using AJAX

    Dan Orlovsky
    UNCC Bootcamp
*/
'use strict';

// our app object
var giphyAccess = {
    api_key: "YfyxamYpvZdmkE8dW4qmwU2VZWSsB4J1",            // ApiAccess Key
    queryUrl: "https://api.giphy.com/v1/gifs/search",       // Base URL
    // Ratings 0 - 2 will automatically be checked.
    ratings: [ 'y', 'g', 'pg', 'pg-13', 'r'],               // Ratings options MPAA
    default_rating: 1,                                      // Default rating will be G 
    
    // makeApiCall: function(srchStr)
    // Takes a searchString as a paramater, returns the results of an ajax call
    makeApiCall: function(srchStr) {
        return $.ajax({ url: srchStr, method: "GET" });
    },
    
    // performSearch: function(button)
    // Takes the button which was pressed as a parameter, grabs the data-search attribute which contains the search string,
    // and passes that to the makeApiCall.  When the ajax call is finished, we display the results.
    performSearch: function(button) {
        $.when(this.makeApiCall($(button).attr("data-search"))).done(function (results) {
            giphyAccess.displayResults(results);
        });
    },
    // addSearchButton: function()
    // Adds a new search button to the view-buttons div in the DOM.
    addSearchButton: function() {
        var searchTerm = $("#gif-search").val().trim();             // Gets the search term
        var maxRatings = $('input[name=ratings]:checked').val();    // Gets the max checked rating
        var imgLimit = $("#image-limit").val().trim();              // Gets the number inside the image-limit textbox.
        
        // Build the search string
        var searchString = `${this.queryUrl}?q=${searchTerm}&rating=${ maxRatings }&limit=${ imgLimit }&api_key=${ this.api_key }`;
        
        // Creates a button to display on the screen.
        var newButton = $("<button></button>")
            .attr("data-search", searchString) 
            .addClass("search-button").text(` ${ imgLimit } - ${ searchTerm } - ${ maxRatings} `);
        
        // Adds the button to the buttons-view div.
        $("#buttons-view").prepend(newButton);
    },
    
    // displayResults: function(results)
    // Takes the JSon object returned from the ajax call as a parameter.  Displays the images on the screen.
    // Wait until the image is loaded before we display it.
    displayResults: function(results) {
        var container = $("#results-container");        // Gets the container where we're displaying the results
        var images = results.data;                      // Assigns the data to a variable to avoid having to use .data
        container.empty();                              // Empties the results container
        
        // Cycles through each element in the array.
        images.forEach(function(currentValue, index) {
            
            // Creates a new div with the image-display class.
            var imgDiv = $("<div>").addClass("image-display");
            
            // Creates an image element, waits for the image to load.
            var image = $(`<img src="${ currentValue.images.fixed_height.url }" alt="Giphy Gif" />`)
                .on("load", function() {
                
                    // After loaded, add the image to the image div.
                imgDiv.append(this);
                
                // Add the rating to the div
                imgDiv.append(`<h2>Rating: ${ currentValue.rating }</h2>`)
                
                // Add the image div to the results container.
                container.prepend(imgDiv);            
            });
            
        })
    },
}

// Shorten the name of giphyAccess
var ga = giphyAccess;

// addRatings() function
// Adds rating values to the screen as radio buttons
function addRatings() {
    ga.ratings.forEach(function(currentValue, idx) {
        
        // We use prop as a string to add the 'checked' attribute when we are adding the rating which will be default.
        var prop = "";

        // If we're at the default rating, make prop = "checked"
        if(idx === ga.default_rating) {
            prop = "checked";
        }

        // Creates a new radio button
        var newTag = `<input type="radio" class="upto-rating" value="${ currentValue }" name="ratings" ${ prop }> ${currentValue }<br />`;
        
        // Adds the radio button
        $("#ratings-select").append(newTag);
        
    })
}

function startupSite() {
    // Display the acceptable ratings
    addRatings();
    // Clear out the buttons/results views
    $("#buttons-view").empty();
    $("#results-container").empty();
}



// Entry point for when the document is ready.
$(document).ready(startupSite);

// When we've clicked the submit button
$("#search-button").on("click", function(e) {
    e.preventDefault();
    ga.addSearchButton();
});

// When we click on a search button.
$("#buttons-view").on("click", ".search-button", function() {
    ga.performSearch(this);
});