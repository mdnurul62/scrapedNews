//alert("connection ok");

  //Grab the articles as json
  $.getJSON("/articles", function(data) {
    //For each article
    for (var i = 0; i < data.length; i++) {
      //Display information on page
      
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      $("#articles").append("<hr>");
      
    }
  });

//

//Whenever reader clicks news heading
$(document).on("click", "p", function() { 
  $("#reviews").empty();
  //Save the id from the p tag
  var thisId = $(this).attr("data-id");
  //Ajax cal for the article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).done(function(data) {
    console.log(data);
     // The title of the article
      $("#reviews").append("<h3>" + data.title + "</h3>");
      // An input to enter a new title
      $("#reviews").append("<input id='titleinput' name='title' placeholder='Enter title here----!'>");
      // A textarea to add a new note body
      $("#reviews").append("<textarea id='bodyinput' name='body' placeholder='Enter text here ---!'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#reviews").append("<button data-id='" + data._id + "' id='saveReview'>Save Review</button>");

      // If there's a note in the article
      if (data.review) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.review.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.review.body);
      }
  })
});

// When you click the saveReview button
$(document).on("click", "#saveReview", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the review section
      $("#reviews").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

    
