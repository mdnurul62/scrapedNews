//Dependencies
var cheerio = require('cheerio');
var request = require('request');
var express = require('express');
var mongojs = require('mongojs');

//Initializes express
var app = express();

//Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

//Hook up mongojs configuration to the db variables
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
	console.log("Database Error", error);
});

//Main route
app.get("/", function(req, res) {
	res.send("Hello data base!");
})

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from nytimes site:" +
            "\n***********************************\n");

//Making a request for new york times latest all news articles
app.get("/all", function(req, res) {
	//Find all results from the srapedData collection in the db
	db.scrapedData.find({}, function(error, found) {
		if(error) {
			console.log(error);
		} else {
			res.json(found);
		}
	});
});

//Making a request for new york times scraped data
app.get("/scrape", function(req, res) {
	var request = require('request');
	request('http://www.nytimes.com', function (error, response, html) {
		var $ = cheerio.load(html);
		var results = [];
		$("h2.story-heading").each(function(i, element) {
			var title = $(element).children().text();
			var link = $(element).children().attr("href");
			db.scrapedData.insert(
				{
					title: title,
					link: link
				}, function(error, inserted) {
					if(error) {
						console.log(error);
					} else {
						console.log(inserted);
					}

				}
			);
		});
	});
	//Send message to browser 
	res.send("Scrape completed!")
});

//Listen on port 3000
app.listen(3000, function() {
	console.log("App running on port 3000!!!");

});
