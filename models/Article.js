//Require mongoose
var mongoose = require('mongoose');
//Schema class
var Schema = mongoose.Schema;
//Article schema
var ArticleSchema = new Schema({
	//title is a required string
	title: {
		type: String,
		required: true
	},
	//link is a required string
	link: {
		type: String,
		required: true
	},
	//Create reference to Review model
	review: {
		type: Schema.Types.ObjectId,
		ref: "Review"
	}
});

//Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);
//Export the model
module.exports = Article;