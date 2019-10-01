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


// need to change this later not sure to what though
// '/' should be the home page 
app.get('/', (req, res) => {
	res.send('Hello World');
})

// Get a user
app.get('/user', (req, res) => {
	let id = req.session.passport.user._id;
	userModel.find({ _id: id }, (err, resp) => {
		if (err) throw err;
		res.send(resp[0]);
	});
})

// Get user by id for artefacts
app.get('/user/artefact', (req,res) => {
	userModel.findOne(req.query, (err, result) => {
		if(err) throw err;
		res.send(result);
	})
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
	pictureUrl,
	isUser} }, res) => {
	let user = userModel({
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
		pictureUrl,
		isUser
	});
	user.save((err, resp) => {
		if (err) {
			throw err;
		}
		res.send(resp);
	})
})

// Update user
app.put('/user/update', (req,res) => {
	let id = req.session.passport.user._id;
	console.log(req.body);
	console.log(req.params);
	console.log(req.query);
	userModel.findOneAndUpdate({_id: id}, req.body, (err,result) => {
		if(err) throw err;
		res.send(result);
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

// // Assign artefact to a person
// app.put('/user/assign/:id', (req, res) => {
// 	// Update the user with new artefact
// 	userModel.update({ id: req.params.id }, { $push: { artefact: req.body.id } }, (err, resp) => {
// 		if (err) {
// 			throw err;
// 		}
// 		res.send('updated');
// 	})
// });

// Re-assign artefact to certain user
app.put('/artefact/assign', (req,res) => {
	// Request should include id of artefact, and id of new owner
	artefactModel.updateOne({_id: req.body.id}, {owner : req.body.owner}, (err, resp) => {
		if (err) throw err;
		res.send(resp);
	})
})

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


// login local
app.post('/login/local', passport.authenticate('local'),(req,res) => {
	res.send(req.user);
});

// login success or not 
// app.get('login/success/:isFail', (req,res) => {
// 	console.log(req.params.isFail);
// 	res.send(req.params.isFail);
// })

app.get('/logout', (req,res) => {
	console.log("logging out");
	if (req.session) {
		// delete session object
		req.session.destroy(function(err) {
		  if(err) {
			return next(err);
		  } else {
			return res.send("Success");
		  }
		});
	  }
})

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening to port ' + port);

module.exports = app;


// login Facebook
// app.get('/login/facebook',
// 	passport.authenticate('facebook'));

// app.get('/login/facebook/callback',
// 	passport.authenticate('facebook', { failureRedirect: '/login' }),
// 	function (req, res) {
// 		// Successful authentication, redirect home.
// 		res.redirect('/');
// 	});