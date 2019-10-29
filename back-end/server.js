const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const session = require('express-session');
const axios = require('axios');
const moment = require('moment');

// Environment variables
const constants = require('./server-constants');
const { ONESIGNAL_ENDPOINT, ONESIGNAL_APP_ID } = constants;

const { buildFamilyTree } = require('../build-family-tree');

/* Database */
// Schemas
const userSchema = require('./schema/userSchema');
const artefactSchema = require('./schema/artefactSchema');
const notificationSchema = require('./schema/notificationSchema');

// Create the mongoose model 
const User = mongoose.model('User', userSchema);
const Artefact = mongoose.model('Artefact', artefactSchema);
const Notification = mongoose.model('Notification', notificationSchema);

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

// app.use(session({
// 	secret: 'secret_string',
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: {
// 		secure: false,
// 		maxAge: 60 * 60 * 1000,  // 1 hour
// 	},
// }));

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
// app.get('/user', async (req, res) => {
// 	console.log('ACCESS COOKIE = ' + req.headers.cookie);
// 	console.log('ACCESS SESSION ID = ' + req.session.id);

// 	if (!req.user) {
// 		console.log('req.user is undefined');
// 		res.send('No user in session');
// 		return;
// 	}
// 	res.send(req.user);
// 	return;
// 	// Change later
// 	// const id = req.session.passport.user._id;
// 	const id = req.user._id;
// 	console.log('ID = ' + id);
// 	console.log('Authenticating user with id: ' + id);
// 	try {
// 		const user = await userModel.findById(id);
// 		res.send(user);
// 		// console.log('AUTHENTICATED user with id: ' + id);
// 	} catch (e) {
// 		console.trace(e);
// 	}
// });

// Get limited information about another user
app.get('/user/find/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		delete user.email;
		delete user.password;
		res.send(user);
	} catch (e) {
		console.trace(e);
	}
});

// Get user by id for artefacts
app.get('/user/artefact', (req, res) => {
	User.findOne(req.query, (err, result) => {
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
	const user = new User({
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
		const spouseNode = await User.findById(spouse);
		spouseNode.spouse = savedUser._id;
		await spouseNode.save();
	}
	res.send();
});

// Get all users (registered and non-registered)
// The front end will decide which ones are relevant to the user
app.get('/users', async (req, res) => {

	try {
		const users = await User.find();
		res.send(users);
	} catch (e) {
		console.error(e);
	}
});

// Update logged-in user
app.put('/user/update/:id', ({ params: { id }, body }, res) => {
	User.findByIdAndUpdate(id, body, { new: true }, (err, result) => {
		if (err) {
			console.trace(err);
			return;
		}
		console.log(result);
		res.send(result);
	});
});

// Add parent who already has a spouse
app.put('/user/add-parent', async ({ body: { childId, parentId } }, res) => {
	// Make sure that parent already has a spouse
	const parent = await User.findById(parentId);
	if (!parent.spouse) {
		return;
	}
	const child = await User.findById(childId);
	child.father = parent.gender === 'm' ? parent._id : parent.spouse;
	child.mother = parent.gender === 'f' ? parent._id : parent.spouse;
	await child.save();
	res.send();
});

// Add parents manually
app.post('/user/add-parents-manually', async ({ body: { fatherName, fatherDob, motherName, motherDob, personId } }, res) => {
	console.log(personId);
	const father = new User({
		name: fatherName,
		dob: fatherDob,
		gender: 'm',
		isUser: false,
	});

	const mother = new User({
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
	await User.findByIdAndUpdate(personId, { father: father._id, mother: mother._id });
});

// Add spouse
app.put('/user/add-spouse', async ({ body: { personId, spouseId } }, res) => {
	// Make sure that person and potential spouse don't have a spouse yet
	const person = await User.findById(personId);
	const spouse = await User.findById(spouseId);
	if (person.spouse || spouse.spouse) {
		return;
	}

	person.spouse = spouse._id;
	await person.save();
	spouse.spouse = person._id;
	await spouse.save();
	res.send();
});

// Add child
app.put('/user/add-child', async ({ body: { personId, childId } }, res) => {
	// Make sure that potential child doesn't have parents yet
	// and potential parent is married
	const child = await User.findById(childId);
	if (child.father || child.mother) {
		return;
	}

	const parent = await User.findById(personId);
	if (!parent.spouse) {
		return;
	}

	child.father = parent.gender === 'm' ? parent._id : parent.spouse;
	child.mother = parent.gender === 'f' ? parent._id : parent.spouse;
	await child.save();
	res.send();
});

// Remove a user's child
app.put('/user/remove-child/:id', async ({ params: { id } }, res) => {
	await User.findByIdAndUpdate(id, { $unset: { father: null, mother: null } });
	res.send();
});

// Remove a user's spouse
// Also remove the user and their spouse as parents of their children
app.put('/user/remove-spouse/:id', async ({ params: { id } }, res) => {
	// Remove spouse from user and user from spouse
	const oldUser = await User.findByIdAndUpdate(id, { $unset: { spouse: null } });
	const oldSpouse = await User.findByIdAndUpdate(oldUser.spouse, { $unset: { spouse: null } });

	// Remove user and spouse as parents of their children
	const father = oldUser.gender === 'm' ? oldUser._id : oldSpouse._id;
	const mother = oldUser.gender === 'f' ? oldUser._id : oldSpouse._id;
	await User.updateMany({ father, mother }, { $unset: { father: null, mother: null } });
	res.send();
});

// Delete a family member or user
app.delete('/user/delete/:id', async ({ params: { id } }, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(id);

		// Detach spouse
		if (deletedUser.spouse) {
			const spouse = await User.findByIdAndUpdate(deletedUser.spouse, { $unset: { spouse: null } });
			// Detach children
			const father = deletedUser.gender === 'm' ? deletedUser._id : spouse._id;
			const mother = deletedUser.gender === 'f' ? deletedUser._id : spouse._id;
			await User.updateMany({ father, mother }, { $unset: { father: null, mother: null } });
		}

		// Delete artefacts
		const artefactsToDelete = await Artefact.find({ owner: id });
		await Artefact.deleteMany({ owner: id });
		// Delete notifications related to artefacts
		await Notification.deleteMany({ artefact: { $in: artefactsToDelete.map(artefact => artefact._id) } });

		// Delete notifications related to user
		await Notification.deleteMany({ $or: [{ sender: id }, { recipient: id }] });
		res.send();
	} catch (e) {
		console.trace(e);
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
// Get all artefacts which are owned by the user's family
app.get('/artefact/:userId', async ({ params: { userId } }, res) => {
	try {
		const familyTree = await getFamilyTree(userId);
		const artefacts = await Artefact.find({ owner: { $in: familyTree.map(person => person._id) } });
		res.send(artefacts);
	} catch (e) {
		console.trace(e);
	}
});


// Get a single artefact by id
app.get('/artefact/find/:artefactId', async (req, res) => {
	try {
		const artefact = await Artefact.findById(req.params.artefactId);
		res.send(artefact);
	} catch (e) {
		console.trace(e);
	}
});

// Create an artefact
app.post('/artefact/create', ({
	body: { name, date, value, description, file, owner } }, res) => {
	const artefact = new Artefact({
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
	Artefact.findByIdAndUpdate(artefactId, { owner: recipientId }, (err, resp) => {
		if (err) {
			console.trace(err);
			return;
		}
		res.send(resp);
		console.log(resp);
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
	const notif = new Notification({
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
		const artefacts = await Artefact.find({ owner: id });
		res.send(artefacts);
	} catch (e) {
		console.trace(e);
	}
});

// Update an artefact
app.put('/artefact/update/:id', async ({ params: { id }, body }, res) => {
	try {
		const newArtefact = await Artefact.findByIdAndUpdate(id, body, { new: true });
		res.send(newArtefact);
	} catch (e) {
		console.trace(e);
	}
});

// Delete an artefact
app.delete('/artefact/delete/:id', (req, res) => {
	Artefact.findByIdAndDelete(req.params.id, (err, resp) => {
		if (err) throw err;
		res.send(resp);
	});
});

/* Notification routes */
// Get all notifications that are meant for a certain user
app.get('/notification/', async ({ query: { recipient } }, res) => {
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

// login local
app.post('/login/local', passport.authenticate('local'), (req, res) => {
	res.send(req.user);
	console.log('LOGIN SESSION ID = ' + req.session.id);
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