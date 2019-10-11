const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const axios = require('axios');
const moment = require('moment');

// passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// passport local config
passport.use(new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
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

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});


// Schemas
const userSchema = require('./schema/userSchema');
const artefactSchema = require('./schema/artefactSchema');
const notificationSchema = require('./schema/notificationSchema');

// Create the mongoose model 
const userModel = mongoose.model('user', userSchema);
const artefactModel = mongoose.model('artefact', artefactSchema);
const notificationModel = mongoose.model('notification', notificationSchema);

// Connect to mongodb
require('./controller/mongooseController');

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

// Get user by id for artefacts
app.get('/user/artefact', (req, res) => {
	userModel.findOne(req.query, (err, result) => {
		if (err) throw err;
		res.send(result);
	});
});

// Create a user
app.post('/user/create', async ({ body: {
	name,
	dob,
	email,
	password,
	gender,
	spouse,
	father,
	mother,
	artefact,
	pictureUrl,
	isUser } }, res) => {
	let user = userModel({
		name,
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

	// Await save so we can use the new document's id
	const savedUser = await user.save();

	// If new user has a spouse, add them as a spouse to their spouse
	if (spouse) {
		const spouseNode = await userModel.findById(spouse);
		spouseNode.spouse = savedUser._id;
		spouseNode.save();
	}
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

// Update user
app.put('/user/update', (req, res) => {
	const id = req.session.passport.user._id;
	userModel.findOneAndUpdate({ _id: id }, req.body, { new: true }, (err, result) => {
		if (err) throw err;
		res.send(result);
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
	});
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


// Re-assign artefact to certain user
app.put('/artefact/assign', ({ body: { artefactId, recipientId, senderId } }, res) => {
	// Request should include id of artefact, and id of new owner
	artefactModel.updateOne({ _id: artefactId }, { owner: recipientId }, (err, resp) => {
		if (err) throw err;
		res.send(resp);
	});

	// Send notification to recipient
	const ONESIGNAL_ENDPOINT = 'https://onesignal.com/api/v1/notifications';
	const ONESIGNAL_APP_ID = 'f9de7906-8c82-4674-808b-a8048c4955f1';
	axios.post(ONESIGNAL_ENDPOINT, {
		app_id: ONESIGNAL_APP_ID,
		include_external_user_ids: [recipientId],
		contents: {
			en: 'You have received a new artefact'
		},
		headings: {
			en: 'mementos'
		}
	});

	// Add new notification document to database
	const notif = new notificationModel({
		time: moment().toISOString(),
		artefact: artefactId,
		recipient: recipientId,
		sender: senderId,
	});

	notif.save();
});

// Get artefact by owner id
app.get('/artefact/findbyowner/', (req, res) => {
	const id = req.session.passport.user._id;
	artefactModel.find({ owner: id }, (err, resp) => {
		if (err) throw err;
		res.send(resp);
	});
});


/* Notification routes */
// Get all notifications that are meant for a certain user
app.get('/notification/', async ({ query: { recipient } }, res) => {
	try {
		console.log(recipient);
		res.send(await notificationModel.find({ recipient })
			.populate('recipient')
			.populate('sender')
			.populate('artefact'));
	} catch (e) {
		console.error(e);
	}
});

// login local
app.post('/login/local', passport.authenticate('local'), (req, res) => {
	res.send(req.user);
});


app.get('/logout', (req, res) => {
	console.log("logging out");
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.send("Success");
			}
		});
	}
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0");
console.log('Listening to port ' + port);

module.exports = app;