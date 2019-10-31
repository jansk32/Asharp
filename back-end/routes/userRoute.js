const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userSchema = require('../schema/userSchema');

// creates the mongoose model 
const User = mongoose.model('User', userSchema);


// Get limited information about another user
router.get('/find/:id', async (req, res) => {
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
router.get('/artefact', (req, res) => {
	User.findOne(req.query, (err, result) => {
		if (err) throw err;
		res.send(result);
	});
});

// Create a user
router.post('/create', async ({ body: {
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


// Update logged-in user
router.put('/update/:id', ({ params: { id }, body }, res) => {
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
router.put('/add-parent', async ({ body: { childId, parentId } }, res) => {
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
router.post('/add-parents-manually', async ({ body: { fatherName, fatherDob, fatherPictureUrl, motherName, motherDob, motherPictureUrl, personId } }, res) => {
	const father = new User({
		name: fatherName,
		dob: fatherDob,
		gender: 'm',
		pictureUrl: fatherPictureUrl,
		isUser: false,
	});

	const mother = new User({
		name: motherName,
		dob: motherDob,
		gender: 'f',
		pictureUrl: motherPictureUrl,
		isUser: false,
		spouse: father._id,
	});

	father.spouse = mother._id;

	await father.save();
	await mother.save();

	// Link person to their parents
	// findByIdAndUpdate must be called with await, else it won't work
	await User.findByIdAndUpdate(personId, { father: father._id, mother: mother._id });
	res.send();
});

// Add spouse
router.put('/add-spouse', async ({ body: { personId, spouseId } }, res) => {
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
router.put('/add-child', async ({ body: { personId, childId } }, res) => {
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
router.put('/remove-child/:id', async ({ params: { id } }, res) => {
	await User.findByIdAndUpdate(id, { $unset: { father: null, mother: null } });
	res.send();
});

// Remove a user's spouse
// Also remove the user and their spouse as parents of their children
router.put('/remove-spouse/:id', async ({ params: { id } }, res) => {
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
router.delete('/delete/:id', async ({ params: { id } }, res) => {
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

module.exports = router;
