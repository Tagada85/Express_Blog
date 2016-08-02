'use strict';
const express = require('express');
const router = require('./routes');
const bodyParser = require('body-parser');
const jsonParser = require('body-parser').json;
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/blogApp");
const db = mongoose.connection;
mongoose.Promise = global.Promise;

db.on('error', (err) => {
	console.error('Sorry an error occured:' + err );
});

db.once('open', () => {
	console.log('Connection successfull');
});

const app = express();

app.use(jsonParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/app'));
app.use(router);
app.set('view engine', 'pug');
app.set('views', __dirname + '/app/views/');

const port = process.env.port || 3000;


app.use(function(req, res, next){
	const err = new Error('Not found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) =>{
	res.status(err.status || 500);
	res.json({
		error : {
			message : err.message
		}
	});	
});
app.listen(port, (req, res) =>{
	console.log('Magic happens on port', port);
});

