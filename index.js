'use strict';
const express = require('express');
const router = require('./routes');
const bodyParser = require('body-parser');
const jsonParser = require('body-parser').json;
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github').Strategy;
const MongoStore = require('connect-mongo')(session);
const User = require('./models/User');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/return",
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log(profile);
    User.findOneAndUpdate({ email: profile.emails[0].value },{
    	email: profile.emails[0].value,
    	name: profile.displayName,
    	username: profile.username
    },{
    	upsert: true
    }, done);
  }
));

passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(userId, done){
  User.findById(userId, done);
});

mongoose.connect("mongodb://localhost:27017/blogApp");
const db = mongoose.connection;
mongoose.Promise = global.Promise;

db.on('error', (err) => {
	console.error('Sorry an error occured:' + err );
});

db.once('open', () => {
	console.log('Connection successfull');
});

var sessionOptions = {
  secret: "this is a super secret dadada",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db
  })
};
const app = express();
app.use(session(sessionOptions));

//initialize passport
app.use(passport.initialize());

//Restore Session
app.use(passport.session());



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

