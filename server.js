const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const axios = require('axios');
const moment = require('moment');
const { ensureLoggedIn } = require('connect-ensure-login');

// Environment variables
const constants = require('./server-constants');
const { ONESIGNAL_ENDPOINT, ONESIGNAL_APP_ID } = constants;

/* Database */
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
		const user = await userModel.findById(_id);
		// console.log('DESERIALIZED: ' + user.name);
		done(null, user);
	} catch (e) {
		// console.log('ERROR IN DESERIALIZE');
		done(e);
	}
});

// Cookies
app.set('trust proxy', 1);

app.use(session({
	secret: 'secret_string',
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: false,
		maxAge: 60 * 60 * 1000,  // 1 hour
	},
}));

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

// Get logged-in user
app.get('/user', async (req, res) => {
	console.log('ACCESS COOKIE = ' + req.headers.cookie);
	console.log('ACCESS SESSION ID = ' + req.session.id);

	if (!req.user) {
		console.log('req.user is undefined');
		res.send('No user in session');
		return;
	}
	res.send(req.user);
	return;
	// Change later
	// const id = req.session.passport.user._id;
	const id = req.user._id;
	console.log('ID = ' + id);
	console.log('Authenticating user with id: ' + id);
	try {
		const user = await userModel.findById(id);
		res.send(user);
		// console.log('AUTHENTICATED user with id: ' + id);
	} catch (e) {
		console.trace(e);
	}
});

// Get limited information about another user
app.get('/user/find/:id', async (req, res) => {
	try {
		const user = await userModel.findById(req.params.id);
		delete user.email;
		delete user.password;
		res.send(user);
	} catch (e) {
		console.trace(e);
	}
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
	const user = new userModel({
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
app.get('/users', async (req, res) => {
	const family = [
		{
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

	try {
		const users = await userModel.find();
		res.send(users);
	} catch (e) {
		console.error(e);
	}
});

// Update logged-in user
app.put('/user/update', (req, res) => {
	const id = req.body.userId;
	userModel.findOneAndUpdate({ _id: id }, req.body, { new: true }, (err, result) => {
		if (err) throw err;
		res.send(result);
	});
});

// Get users by name for adding as parents
app.get('/user/search', async ({ query: { name } }, res) => {
	const users = await userModel.find({
		name: {
			$regex: new RegExp(name, 'i')
		}
	});
	res.send(users);
});

// Add parent who already has a spouse
app.put('/user/add-parent', async ({ body: { childId, parentId } }, res) => {
	// Make sure that parent already has a spouse
	const parent = await userModel.findById(parentId);
	if (!parent.spouse) {
		return;
	}
	const child = await userModel.findById(childId);
	child.father = parent.gender === 'm' ? parent._id : parent.spouse;
	child.mother = parent.gender === 'f' ? parent._id : parent.spouse;
	child.save();
});

// Add parents manually
app.post('/user/add-parents-manually', async ({ body: { fatherName, fatherDob, motherName, motherDob, personId } }, res) => {
	console.log(personId);
	const father = new userModel({
		name: fatherName,
		dob: fatherDob,
		gender: 'm',
		isUser: false,
	});

	const mother = new userModel({
		name: motherName,
		dob: motherDob,
		gender: 'f',
		isUser: false,
		spouse: father._id,
	});

	father.spouse = mother._id;

	father.save();
	mother.save();

	// Link person to their parents
	// findByIdAndUpdate must be called with await, else it won't work
	await userModel.findByIdAndUpdate(personId, { father: father._id, mother: mother._id });
});

// Add spouse
app.put('/user/add-spouse', async ({ body: { personId, spouseId } }, res) => {
	// Make sure that person and potential spouse don't have a spouse yet
	const person = await userModel.findById(personId);
	const spouse = await userModel.findById(spouseId);
	if (person.spouse || spouse.spouse) {
		return;
	}

	person.spouse = spouse._id;
	person.save();
	spouse.spouse = person._id;
	spouse.save();
});

// Add child
app.put('/user/add-child', async ({ body: { personId, childId } }, res) => {
	// Make sure that potential child doesn't have parents yet
	// and potential parent is married
	const child = await userModel.findById(childId);
	if (child.father || child.mother) {
		console.log('returning cos of child already having parents');
		return;
	}

	const parent = await userModel.findById(personId);
	if (!parent.spouse) {
		console.log('returning cos parent doesnt have spouse');
		return;
	}

	child.father = parent.gender === 'm' ? parent._id : parent.spouse;
	child.mother = parent.gender === 'f' ? parent._id : parent.spouse;
	child.save();
});

/* Artefact routes */
// Get ALL artefacts
app.get('/artefact', async (req, res) => {
	try {
		const artefacts = await artefactModel.find();
		res.send(artefacts);
	} catch (e) {
		console.trace(e);
	}
});


// Get a single artefact by id
app.get('/artefact/find/:artefactId', async (req, res) => {
	try {
		const artefact = await artefactModel.findById(req.params.artefactId);
		res.send(artefact);
	} catch (e) {
		console.trace(e);
	}
});

// Create an artefact
app.post('/artefact/create', ({
	body: { name, date, value, description, file, owner } }, res) => {
	const artefact = new artefactModel({
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

// Get artefacts by owner id
app.get('/artefact/findbyowner/:id', async ({ params: { id } }, res) => {
	try {
		const artefacts = await artefactModel.find({ owner: id });
		res.send(artefacts);
	} catch (e) {
		console.trace(e);
	}
});

/* Notification routes */
// Get all notifications that are meant for a certain user
app.get('/notification/', async ({ query: { recipient } }, res) => {
	try {
		const notifications = await notificationModel.find({ recipient })
			.populate('recipient')
			.populate('sender')
			.populate('artefact');
		res.send(notifications);
	} catch (e) {
		console.error(e);
	}
});

// login local
app.post('/login/local', passport.authenticate('local'), (req, res) => {
	res.send(req.user);
	console.log('LOGIN SESSION ID = ' + req.session.id);
});


app.get('/logout', (req, res) => {
	console.log('Logging out');
	req.logOut();
	res.send();

	// if (req.session) {
	// 	// delete session object
	// 	req.session.destroy(function (err) {
	// 		if (err) {
	// 			return next(err);
	// 		} else {
	// 			return res.send('Success');
	// 		}
	// 	});
	// }
});

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	// application specific logging, throwing an error, or other logic here
});


const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0');
console.log('Listening to port ' + port);

module.exports = app;