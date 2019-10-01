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
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	function (username, password, done) {
		userModel.findOne({ email: username }, function (err, found) {
			console.log(found);
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

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
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

// Schemas
const userSchema = require('../schema/userSchema');
const artSchema = require('../schema/artefactSchema');

// Create the mongoose model 
let userModel = mongoose.model('user', userSchema);
let artefactModel = mongoose.model('artefact', artSchema);

// Connect to mongodb
require('../controller/mongooseController');

// app.use middlewares
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Cookies
app.set('trust proxy', 1);
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true
}));


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
});

/* User routes */

// Get a user
app.get('/user', (req, res) => {
	// Change later
	const id = req.session.passport.user._id;
	console.log(req.session.passport.user._id);
	userModel.find({ _id: id }, (err, resp) => {
		if (err) throw err;
		res.send(resp[0]);
	});
});

// Get limited information about another user
app.get('/user/find/:id', (req, res) => {
	userModel.findById(req.params.id, (err, user) => {
		if (err) {
			throw err;
		}
		delete user.email;
		delete user.password;
		res.send(user);
	});
});

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
	});
});

// Get all users (registered and non-registered)
// The front end will decide which ones are relevant to the user
app.get('/users', (req, res) => {
	const family = [{
		_id: 'th',
		gender: 'm',
		m: 'yb',
		f: 'ah'
	}, {
		_id: 'fh',
		gender: 'f',
		spouse: 'mg',
		m: 'yb',
		f: 'ah'
	}, {
		_id: 'mg',
		gender: 'm',
		spouse: 'fh'
	}, {
		_id: 'yb',
		gender: 'f',
		spouse: 'ah',
		m: 'pp',
		f: 'gg'
	}, {
		_id: 'vb',
		gender: 'f',
		spouse: 'tk',
		m: 'pp',
		f: 'gg'
	}, {
		_id: 'tk',
		gender: 'm',
		spouse: 'vb',
	}, {
		_id: 'j0',
		gender: 'm',
		m: 'vb',
		f: 'tk'
	}, {
		_id: 'j1',
		gender: 'f',
		m: 'vb',
		f: 'tk'
	}, {
		_id: 'j2',
		gender: 'f',
		m: 'vb',
		f: 'tk'
	}, {
		_id: 'lb',
		gender: 'f',
		spouse: 'ak',
		m: 'pp',
		f: 'gg'
	}, {
		_id: 'ak',
		gender: 'm',
		spouse: 'lb',
	}, {
		_id: 'ad',
		gender: 'm',
		m: 'lb',
		f: 'ak'
	}, {
		_id: 'nd',
		gender: 'f',
		m: 'lb',
		f: 'ak'
	}, {
		_id: 'ah',
		gender: 'm',
		spouse: 'yb',
		m: 'gm',
		f: 'gf'
	}, {
		_id: 'lh',
		gender: 'f',
		spouse: 'jk',
		f: 'gf',
		m: 'gm'
	}, {
		_id: 'jk',
		gender: 'm',
		spouse: 'lh'
	}, {
		_id: 'dh',
		gender: 'm',
		spouse: 'yh',
		m: 'gm',
		f: 'gf'
	}, {
		_id: 'yh',
		gender: 'f',
		spouse: 'dh'
	}, {
		_id: 'pp',
		gender: 'f',
		spouse: 'gg'
	},
	{
		_id: 'gg',
		gender: 'm',
		spouse: 'pp'
	},
	{
		_id: 'gm',
		gender: 'f',
		spouse: 'gf',
		f: 'ggf',
		m: 'ggm'
	}, {
		_id: 'ggf',
		gender: 'm',
		spouse: 'ggm'
	}, {
		_id: 'ggm',
		gender: 'f',
		spouse: 'ggf'
	}, {
		_id: 'gf',
		gender: 'm',
		spouse: 'gm'
	},
	];

	// res.send(family);
	// return;

	userModel.find({}, (err, result) => {
		if (err) {
			throw err;
		}
		res.send(result);
	});
});

// Assign artefact to a person
app.put('/user/assign/:id', (req, res) => {
	userModel.update({ id: req.params.id }, { $push: { artefact: req.body } }, (err, resp) => {
		if (err) {
			throw err;
		}
		res.send('updated');
	});
});

/* Artefact routes */
// Get ALL artefacts
app.get('/artefact', (req, res) => {
	artefactModel.find({}, (err, result) => {
		res.send(result);
	});
});


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
	session: { passport: { user: { _id: owner } } } }, res) => {
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
	});
});


// Tim: this will be replaced by the single route called /user/create so
// the front end will make only one request to the back end

// login page [in progress]
app.get('/login', (req, res) => {

});

// login local
app.post('/login/local', passport.authenticate('local'), (req, res) => {
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

// login success or not 
app.get('login/success/:isFail', (req, res) => {
	console.log(req.params.isFail);
	res.send(req.params.isFail);
});

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