//Require mongoose
var mongoose = require('mongoose');
//Create a schema class
var Schema = mongoose.Schema;

//Create a Review schema
var ReviewSchema = new Schema({
	title: {
		type: String
	},
	body: {
		type: String
	}
});

//Create Review model
var Review = mongoose.model("Review", ReviewSchema);

//Export the Review model
module.exports = Review;
