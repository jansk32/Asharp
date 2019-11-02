const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const session = require('express-session');


// Environment variables
const constants = require('./server-constants');
const { ONESIGNAL_ENDPOINT, ONESIGNAL_APP_ID } = constants;

const { buildFamilyTree } = require('../build-family-tree');

/* Database */
// Schemas
const notificationSchema = require('./schema/notificationSchema');
const userSchema = require('./schema/userSchema');

// Create the mongoose model 
const Notification = mongoose.model('Notification', notificationSchema);
const User = mongoose.model('User', userSchema);

// Connect to mongodb
require('./controller/mongooseController');

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
		User.findOne({ email: username }, function (err, found) {
			if (err) {
				return done(err);
			}
			// if no username found
			if (!found) {
				return done(null, false, { message: 'Incorrect username or password' });
			}
			if (found.password !== password) {
				return done(null, false, { message: 'Incorrect username or password' });
			}
			console.log('SUCCESSFUL LOG IN');
			return done(null, found);
		});
	}
));

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(async function (_id, done) {
	try {
		const user = await User.findById(_id);
		// console.log('DESERIALIZED: ' + user.name);
		done(null, user);
	} catch (e) {
		// console.log('ERROR IN DESERIALIZE');
		done(e);
	}
});

// Cookies
app.set('trust proxy', 1);

// app.use middlewares
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// need to change this later not sure to what though
// '/' should be the home page 
app.get('/', (req, res) => {
	res.send('Hello World');
});


/* User routes */
const userRoute = require('./routes/userRoute');
app.use('/user', userRoute);
app.get('/users', async (req, res) => {

	try {
		const users = await User.find();
		res.send(users);
	} catch (e) {
		console.error(e);
	}
});

/* Family tree routes */

async function getFamilyTree(id) {
	// Query uses .lean() so query results are plain JS objects instead of mongoose documents
	// This is to allow casting of id from MongoDB ObjectID to String
	const allUsers = await User.find().lean();

	// Cast MongoDB ObjectIDs to strings (self, father, mother, spouse)
	allUsers.forEach(user => user._id = user._id.toString());

	const familyTree = buildFamilyTree(allUsers, id);
	return familyTree;
}

app.get('/family-tree/:id', async ({ params: { id } }, res) => {
	try {
		const familyTree = await getFamilyTree(id);
		res.send(familyTree);
	} catch (e) {
		console.error(e);
	}
});

// Get users who are not in the family tree of a certain user so they can be added
app.get('/family-tree/non-familial/:id', async ({ params: { id } }, res) => {
	const familyTree = await getFamilyTree(id);
	const nonFamilialUsers = await User.find({ _id: { $nin: familyTree.map(person => person._id) } });
	res.send(nonFamilialUsers);
});


/* Artefact routes */
const artefactRoute = require("./routes/artefactRoute")
app.use("/artefact", artefactRoute);

/* Notification routes */
// Get all notifications that are meant for a certain user
app.get('/notification', async ({ query: { recipient } }, res) => {
	try {
		const notifications = await Notification.find({ recipient })
			.populate('recipient')
			.populate('sender')
			.populate('artefact');
		res.send(notifications);
	} catch (e) {
		console.error(e);
	}
});

// Login local
app.post('/login/local', passport.authenticate('local'), (req, res) => {
	res.send(req.user);
});


app.get('/logout', (req, res) => {
	console.log('Logging out');
	req.logOut();
	res.send();
});


process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	// application specific logging, throwing an error, or other logic here
});

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
	app.listen(port, '0.0.0.0');
}
console.log('Listening to port ' + port);

module.exports = app;