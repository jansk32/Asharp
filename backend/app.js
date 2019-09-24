const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

// passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;

// passport local config
passport.use(new LocalStrategy(
	{usernameField: 'email',
	passwordField: 'password'},
	function (username, password, done) {
		userModel.findOne({ email: username }, function (err, found) {
			if (err) { return done(err); }
			// if no username found
			if (!found) {
				return done(null, false, { message: 'Incorrect username or password' });
			}
			if (!(found.password === password)) {
				return done(null, false, { message: 'Incorrect username or password' });
			}
			return done(null, found);
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
	done(null,user);
  });

  
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// cookies
app.set('trust proxy', 1);
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))


// app.use(function(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
// 	res.header(
// 		'Access-Control-Allow-Headers',
// 		'Origin, X-Requested-With, Content-Type, Accept'
// 	);
// 	next();
// });


// need to change this later not sure to what though
// '/' should be the home page 
app.get('/', (req, res) => {
	res.send('Hello World');
})

// get a user
app.get('/user', (req, res) => {
	let id = req.session.passport.user._id;
	userModel.find({ _id: id }, (err, resp) => {
		if (err) throw err;
		res.send(resp[0]);
	});
})

// Create a user
app.post('/user/create', ({ body: {
	name,
	userName,
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
		userName,
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
// Get ALL artefacts
app.get('/artefact', (req,res) => {
	artefactModel.find({}, (err,result) => {
		res.send(result);
	})
})
// Get ALL users
app.get('/users', (req,res) => {
	userModel.find({}, (err,result) => {
		res.send(result);
	})
})


// Get a single artefact by id
app.get('/artefact/find/:artefactId', (req, res) => {
	artefactModel.findById(req.params.artefactId, (err, resp) => {
		if (err) throw err;
		console.log(resp);
		res.send(resp);
	})
});

// Create an artefact
app.post('/artefact/create', ({ 
	body: { name, date, value, description, file }, 
	session: {passport: {user: {_id : owner} }}}, res) => {
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

// Assign artefact to a person
app.put('/user/assign/:id', (req, res) => {
	userModel.update({ id: req.params.id }, { $push: { artefact: req.body } }, (err, resp) => {
		if (err) {
			throw err;
		}
		res.send('updated');
	})
});

// Get artefact by owner id
app.get('/artefact/findbyowner/', (req,res) => {
	let id = req.session.passport.user._id;
	artefactModel.find({ owner: id }, (err, resp) => {
		if (err) throw err;
		res.send(resp);
	});
})

// Tim: this will be replaced by the single route called /user/create so
// the front end will make only one request to the back end


// Login page [in progress]
app.get('/login', (req, res) => {

});

// login local
app.post('/login/local', passport.authenticate('local'),(req,res) => {
	console.log("posted");
	console.log(req.user);
	res.send(req.user);
});

// app.post('/login/local', (req,res) => {
// 	console.log(req.body);
// 	userModel.findOne({userName: req.body.userName}, (err, result) => {
// 		if(err) throw err;
// 		console.log(result);
// 	})
// }
// );

// Login success or not 
app.get('login/success/:isFail', (req,res) => {
	console.log(req.params.isFail);
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