'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sortPosts = function(a, b){
	return b.updatedAt - a.updatedAt;
}

const PostSchema = new Schema({
	title : String,
	author: String,
	createdAt : {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	postBody : String
});

// PostSchema.pre("save", (next) => {
// 	this.posts.sort(sortPosts);
// 	next();
// });

// PostSchema.method('update', (updates, callback) => {	
// 	Object.assign(updates, {updatedAt: new Date()});
// 	save(callback);
// });



const Post = mongoose.model('Post', PostSchema);

module.exports = Post;