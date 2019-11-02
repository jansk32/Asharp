const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const moment = require('moment');
const { buildFamilyTree } = require('../../build-family-tree');

// Environment variables
const constants = require('../server-constants');
const { ONESIGNAL_ENDPOINT, ONESIGNAL_APP_ID } = constants;

// Schema
const userSchema = require('../schema/userSchema');
const artefactSchema = require('../schema/artefactSchema');
const notificationSchema = require('../schema/notificationSchema');
const User = mongoose.model('User', userSchema);
const Artefact = mongoose.model('Artefact', artefactSchema);
const Notification = mongoose.model('Notification', notificationSchema);


// get family Tree
async function getFamilyTree(id) {
	// Query uses .lean() so query results are plain JS objects instead of mongoose documents
	// This is to allow casting of id from MongoDB ObjectID to String
	const allUsers = await User.find().lean();

	// Cast MongoDB ObjectIDs to strings (self, father, mother, spouse)
	allUsers.forEach(user => user._id = user._id.toString());

	const familyTree = buildFamilyTree(allUsers, id);
	return familyTree;
}

// Get all artefacts which are owned by the user's family
router.get('/:userId', async ({ params: { userId } }, res) => {
	try {
		const familyTree = await getFamilyTree(userId);
		const artefacts = await Artefact.find({ owner: { $in: familyTree.map(person => person._id) } });
		res.send(artefacts);
	} catch (e) {
		console.trace(e);
	}
});


// Get a single artefact by id
router.get('/find/:artefactId', async (req, res) => {
	try {
		const artefact = await Artefact.findById(req.params.artefactId);
		res.send(artefact);
	} catch (e) {
		console.trace(e);
	}
});

// Create an artefact
router.post('/create', ({
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
router.put('/assign', ({ body: { artefactId, recipientId, senderId } }, res) => {
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
router.get('/findbyowner/:id', async ({ params: { id } }, res) => {
	try {
		const artefacts = await Artefact.find({ owner: id });
		res.send(artefacts);
	} catch (e) {
		console.trace(e);
	}
});

// Update an artefact
router.put('/update/:id', async ({ params: { id }, body }, res) => {
	try {
		const newArtefact = await Artefact.findByIdAndUpdate(id, body, { new: true });
		res.send(newArtefact);
	} catch (e) {
		console.trace(e);
	}
});

// Delete an artefact
router.delete('/delete/:id', (req, res) => {
	Artefact.findByIdAndDelete(req.params.id, (err, resp) => {
		if (err) throw err;
		res.send(resp);
	});

	// Delete notifications that refer to the artefact
	Notification.deleteMany({artefact: req.params.id});
});

module.exports = router;