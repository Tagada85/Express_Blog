'use strict';
const express = require('express');
const router = express.Router();
const Post = require('./models/Post');


router.param('postId', (req, res, next, id) => {
	Post.findById(id, (err, post) => {
		if(err) return next(err);
		if(!post){
			err = new Error('Not found!');
			err.status = 404;
			return  next(err);
		}
		req.post = post;
		next();
	})
})

router.get('/', (req, res, next)=> {
	Post.find({}, (err, posts) => {
		if(err) return next(err);
		posts.sort((postA, postB) => {
			if(postA.createdAt > postB.createdAt){
				return -1;
			}else{
				return 1;
			}
		});
		res.render('index', {posts: posts, title: 'HomePage', scripts: ['scripts/deletePost.js']});
	});
});

router.get('/contact', (req, res, next) => {	
	res.render('contact', {title: 'Contact Page'});
	next();
});

router.get('/post/:postId', (req, res, next) => {
	Post.findById(req.params.postId, (err, post) => {
		if(err) return next(err);
		res.render('post', {title: 'Blog Post', post: post});
	});
});

router.get('/new_post', (req, res, next) => {
	res.render('new_post', {title: 'Add new post'});
	next();
});

router.post('/new_post', (req, res, next) => {
	let post = new Post(req.body);
	post.save((err, post) => {
		if(err) return next(err);
		res.status = 201;
		res.redirect('/');
	});
});

router.put('/post/:postId', (req, res, next) => {
	let title = req.body.title;
	let author = req.body.author;
	let postBody = req.body.postBody;
	Post.update({_id : req.params.postId}, 
		{title : title, author: 
		author, 
		postBody: postBody, 
		updatedAt: Date.now()},
		 (err, result)=>{
		if(err) return next(err);
		res.json(result);
	});
});

router.delete('/post/:postId', (req, res, next) => {
	req.post.remove((err) => {
		if(err) return next(err);
		res.json({message: 'Post was deleted'});
	});
});



module.exports = router;