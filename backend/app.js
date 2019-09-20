const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;

// passport local config
passport.use(new LocalStrategy(
	function (username, password, done) {
		userModel.findOne({ userName: username }, function (err, found) {
			console.log(found);
			if (err) { return done(err); }
			// if no username found
			if (!found) {
				return done(null, false, { message: 'Incorrect username or password' });
			}
			if (!found.validPassword(password)) {
				return done(null, false, { message: 'Incorrect username or password' });
			}
			return done(null, user);
		});
	}
));

// passport Facebook config
// passport.use(new FacebookStrategy({
// 	clientID: FACEBOOK_APP_ID,
// 	clientSecret: FACEBOOK_APP_SECRET,
// 	callbackURL: 'http://localhost:3000/auth/facebook/callback'
// },
// 	function (accessToken, refreshToken, profile, cb) {
// 		User.findOrCreate({ facebookId: profile.id }, function (err, user) {
// 			return cb(err, user);
// 		});
// 	}
// ));

// schemas
const userSchema = require('../schema/userSchema');
const artSchema = require('../schema/artefactSchema');

// creates the mongoose model 
let userModel = mongoose.model('user', userSchema);
let artefactModel = mongoose.model('artefact', artSchema);

// to connect to mongodb
require('../controller/mongooseController');

// app.use
app.use(bodyParser.json({ type: 'application/json' }));

// need to change this later not sure to what though
// '/' should be the home page 
app.get('/', (req, res) => {
	res.send('Hello World');
})

// get a user
app.get('/user', (req, res) => {
	// change later
	userModel.find({ name: 'Jansen' }, (err, resp) => {
		if (err) throw err;
		res.json(resp[0]);
	});
})

// Create a user
app.post('/user/create', ({ body: {
	name,
	dob,
	email,
	password,
	gender,
	spouse,
	father,
	mother,
	artefact,
	pictureUrl } }, res) => {
	const user = userModel({
		name,
		dob,
		email,
		password,
		gender,
		spouse,
		father,
		mother,
		artefact,
		pictureUrl
	});

	user.save((err, resp) => {
		if (err) {
			throw err;
		}
		res.send(resp);
	})
})

// get an artefact
app.get('/artefact', (req, res) => {
	console.log(req);
	artefactModel.find(req.body, (err, resp) => {
		if (err) throw err;
		console.log(req);
		res.json(resp);
	})
});

// create an artefact
app.post('/artefact/create', ({ body: { name, date, owner, value, description, file } }, res) => {
	const artefact = artefactModel({
		name,
		date,
		owner,
		value,
		description,
		file
	});

	artefact.save((err, resp) => {
		if (err) {
			throw err;
		}
		res.send(resp);
	})
});

// assign artefact to a person
app.put('/user/assign/:id', (req, res) => {
	userModel.update({ id: req.params.id }, { $push: { artefact: req.body } }, (err, resp) => {
		if (err) {
			throw err;
		}
		res.send('updated');
	})
});

// Tim: this will be replaced by the single route called /user/create so
// the front end will make only one request to the back end
// multiple page sign up
// not very good practice tbh 
let newUser = {};

// first page
app.post('/user/create/1', (req, res) => {
	newUser.email = req.body.email;
});

// second page
app.post('/user/create/2', ({ body: { name, dob, password } }, res) => {
	newUser.name = name;
	newUser.dob = dob;
	newUser.password = password;
});

// third page
app.post('/user/create/3', (req, res) => {
	newUser.picture = req.body.file;
	console.log(newUser);
	let newUserModel = new userModel(newUser);
	newUserModel.save().then((doc) => {
		
	}).catch((err) => {
		console.log(err);
	});
});

// login page [in progress]
app.get('/login', (req, res) => {

});

// login local
app.post('/login/local', passport.authenticate('local', {
	successRedirect: '/login/success/true',
	failureRedirect: '/login/success/false'
}));

// login success or not 
app.get('login/success/:isFail', (req,res) => {
	res.send(req.params.isFail);
})

// login Facebook
// app.get('/login/facebook',
// 	passport.authenticate('facebook'));

// app.get('/login/facebook/callback',
// 	passport.authenticate('facebook', { failureRedirect: '/login' }),
// 	function (req, res) {
// 		// Successful authentication, redirect home.
// 		res.redirect('/');
// 	});

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening to port ' + port);

module.exports = app;