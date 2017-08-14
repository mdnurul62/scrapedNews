
var cheerio = require('cheerio');
var request = require('request');

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from nytimes site:" +
            "\n***********************************\n");

//Making a request for new york times latest news articles

var request = require('request');
request('http://www.nytimes.com', function (error, response, html) {
	var $ = cheerio.load(html);
	var results = [];
	$("h2.story-heading").each(function(i, element) {
		var title = $(element).children().text();
		var link = $(element).children().attr("href");
		results.push({
			title: title,
			link: link
		});
	});
  //console.log('error:', error); // Print the error if one occurred 
  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
  console.log(results); // Print the HTML for the Google homepage. 
});