//Scraping tools
var cheerio = require('cheerio');
var request = require('request');
//Dependencies
var express = require('express');
var mongojs = require('mongojs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Requiring two models of Article and reader's Review
var Article = require("./models/Article.js");
var Review = require("./models/Review.js");
//Set mongoose to leverage built in Javascript Promises
mongoose.Promise = Promise;

//Initializes express
var app = express();

//Use body parser with app
app.use(bodyParser.urlencoded({extebded: false}));

//Make public a static dir
app.use(express.static("public"));

//Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

//Hook up mongojs configuration to the db variables
//var db = mongojs(databaseUrl, collections);
//Database configuration mongoose
mongoose.connect("mongodb://heroku_wj713hrb:4s02k3suj2010nkv6kmsd6roj6@ds149373.mlab.com:49373/heroku_wj713hrb");
var db = mongoose.connection;
//Show any mongoose errors
db.on("error", function(error) {
	console.log("Database Error", error);
});

//Once logged in to the db through mongoose, log a success message

db.once("open", function() {
	console.log("Mongoose connect successfully!");
});


// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from nytimes site:" +
            "\n***********************************\n");


//Making a request for new york times scraped data
app.get("/scrape", function(req, res) {
	var request = require('request');
	request('http://www.nytimes.com', function (error, response, html) {
		var $ = cheerio.load(html);
		//var results = [];
		$("h2.story-heading").each(function(i, element) {
      var result = {};
      //loop  through object's result
    //   for (var i in result) {
    //     addIfNotFound(i);
    //   }
    // });

    // function addIfNotFound() {
    //   //var result = {};
      //Adding and saving every text and href as properties of result object
      result.title = $(this).children().text();
      result.link = $(this).children("a").attr("href");
      //Using Article model, create a new entry and passing result objest to entry
      var entry = new Article(result);
      //Save that entry to db
      entry.save(function(error, doc) {
        if (error) {
          console.log(error);
        } else {
          console.log(doc);
        }

      });

    //}
			
		});
    

	});
	//Send message to browser 
    res.send("Scrape successfully completed!");
});

//This route will get saved articles in mongoDB
app.get("/articles", function(req, res) {
	Article.find({}, function(error, doc) {
		if (error) {
			console.log(error);
		} else {
			res.json(doc);
		}

	});
});

app.get("/reviews", function(req, res) {
	Review.find({}, function(err, doc) {
		if(err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("review")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Delete One from the DB
app.get("/delete/:id", function(req, res) {
  // Remove a note using the objectID
  Article.remove({
    "_id": req.params.id
  }, function(error, removed) {
    // Log any errors from mongojs
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the mongojs response to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log(removed);
      res.send(removed);
    }
  });
});

// Delete One from the DB
app.get("/reviews/delete/:_id", function(req, res) {
  // Remove a note using the objectID
  Review.remove({
    "_id": req.params.id
  }, function(error, removed) {
    // Log any errors from mongojs
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the mongojs response to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log(removed);
      res.send(removed);
    }
  });
});


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newReview = new Review(req.body);

  // And save the new review to the db
  newReview.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "review": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});


//Listen on port 3000
app.listen(3000, function() {
	console.log("App running on port 3000!!!");

});
