// Data set for testing
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
const radius = 50;
const margin = 10;
const baseWidth = 6 * (radius + margin);
const verticalGap = 4 * (radius + margin);


// Recursively find the most distant ancestors of a certain individual
function up(family, divisibles, nonDivisibles) {
	// Base case: no one to divide
	if (divisibles.length === 0) {
		return nonDivisibles;
	}
	// Look for parents of the first element in divisibles
	const divisibleNode = divisibles[0];
	if (divisibleNode.father && divisibleNode.mother) {
		// Can be further divided
		const father = family.find(node => node._id === divisibleNode.father);
		const mother = family.find(node => node._id === divisibleNode.mother);
		father.tempGen = mother.tempGen = divisibleNode.tempGen - 1;
		divisibles.splice(0, 1, father, mother);
	} else {
		// Can't be divided anymore, record as most distant ancestor
		divisibles.splice(0, 1);
		nonDivisibles.push(divisibleNode);
	}
	return up(family, divisibles, nonDivisibles);
}

// Get the most distant ancestors of the target person
function getAncestors(family, targetId) {
	const node = family.find(person => person._id === targetId);
	node.tempGen = 0;
	return up(family, [node], []);
}

// Recursively find children of a person and also the children's children
function down(family, ancestors, results, parents) {
	if (parents.length === 0) {
		if (ancestors.length === 0) {
			// Base case: ancestors is empty and there are no more parents to resolve
			return results;
		}
		// Parents is empty, move an ancestor to parents
		parents.push(ancestors.shift());
	} else {
		// There are parents to resolve, split them into their children
		const parent = parents.shift();
		if (results.includes(parent)) {
			// Parent already registered, skip registering spouse and children
			return down(family, ancestors, results, parents);
		}
		// Register parent
		results.push(parent);
		// If spouse exists, register spouse too
		const spouseId = parent.spouse;
		if (spouseId) {
			const spouse = family.find(node => node._id === spouseId);
			spouse.gen = parent.gen;
			results.push(spouse);
			// Then look for children, add children to parents to check them as parents
			const children = family.filter(node => node.father === parent._id || node.mother === parent._id);
			children.forEach(child => child.gen = parent.gen + 1);
			parents.unshift(...children);
		}
	}
	return down(family, ancestors, results, parents);
}

// Find all members of a family starting from the ancestors
function getDescendants(family, ancestors) {
	return down(family, ancestors, [], []);
}

/* Set the most distant ancestor's generation to 0
 * and everyone else's accordingly */
function normalizeAncestorGen(ancestors) {
	const offset = -Math.min(...ancestors.map(node => node.tempGen));
	ancestors.forEach(node => node.gen = node.tempGen + offset);
}

// Return a family tree object without SVG positions
function buildFamilyTree(family, _id) {
	const ancestors = getAncestors(family, _id);
	normalizeAncestorGen(ancestors);
	family.forEach(node => delete node.tempGen);
	const familyTree = getDescendants(family, ancestors);
	return familyTree;
}

// Assign SVG positions to each family member
function mainAssignXOffset(familyTree, ancestors, targetId) {
	const targetPerson = familyTree.find(person => person._id === targetId);
	for (const ancestor of ancestors) {
		ancestor.width = recursiveAssignXOffset(familyTree, ancestor, targetPerson);
	}
}

/* Recursively assign SVG positions to a person and their children,
 * then the children's children */
function recursiveAssignXOffset(familyTree, node, targetPerson) {
	// Base case: no spouse
	if (!node.spouse) {
		return baseWidth;
	}

	// START COMMENT OUT

	// const baseMarriageOffset = baseWidth / 4;

	// // By default, marriageOffset is determined by gender
	// // This is for father, mother, and everyone who is not in their generation
	// node.marriageOffset = node.gender === 'm' ? -baseMarriageOffset : baseMarriageOffset;
	// // But, if current parent is in the generation of the target person's parent:
	// // and is sibling of father, put to the left in marriage
	// // and is sibling of mother, put to the right in marriage
	// // and is father or mother themself, ignore since it's been handled by the default case
	// if (node.gen === targetPerson.gen - 1) {
	// 	// Father of the target person
	// 	const father = familyTree.find(person => person._id === targetPerson.father);
	// 	if (node._id !== father._id && node.father === father.father) {
	// 		node.marriageOffset = -baseMarriageOffset;
	// 	}
	// 	// Mother of the target person
	// 	const mother = familyTree.find(person => person._id === targetPerson.mother);
	// 	if (node._id !== mother._id && node.father === mother.father) {
	// 		node.marriageOffset = baseMarriageOffset;
	// 	}
	// }

	// const spouse = familyTree.find(spouse => spouse._id === node.spouse);
	// spouse.marriageOffset = -node.marriageOffset;

	// END COMMENT OUT


	const children = familyTree.filter(child => child.father === node._id || child.mother === node._id);
	// Base case: no children
	if (!children.length) {
		return baseWidth;
	}

	for (const child of children) {
		child.width = recursiveAssignXOffset(familyTree, child, targetPerson);
	}

	// Manually reorder siblings if it's the target person's parent generation
	if (children[0].gen === targetPerson.gen - 1) {
		if (children.some(child => child._id === targetPerson.father)) {
			// Father's cluster, move father to the end
			children.push(children.splice(children.findIndex(child => child._id === targetPerson.father), 1)[0]);
		} else {
			// Mother's cluster, move mother to the start
			children.unshift(children.splice(children.findIndex(child => child._id === targetPerson.mother), 1)[0]);
		}
	}
	children[0].xOffset = 0;
	for (let i = 1; i < children.length; i++) {
		children[i].xOffset = children[i - 1].xOffset + children[i - 1].width / 2 + children[i].width / 2;
	}

	// Shift children to the left
	const leftOffset = children[children.length - 1].xOffset / 2;
	children.forEach(child => child.xOffset -= leftOffset);

	const totalWidth = children.reduce((sum, child) => sum + child.width, 0);
	return totalWidth > baseWidth ? totalWidth : baseWidth;
}

function mainAssignMarriageOffset(familyTree, targetId) {
	const maxGen = Math.max(...familyTree.map(node => node.gen));
	for (let i = 0; i <= maxGen; i++) {
		const genNodes = familyTree.filter(node => node.gen === i);
		genNodes.forEach(node => assignMarriageOffset(familyTree, node, targetId));

		const shouldEqualizeMarriageOffset = true;
		if (shouldEqualizeMarriageOffset) {
			genNodes.forEach(node => {
				if (!node.spouse) {
					return;
				}
				const spouse = familyTree.find(person => person._id === node.spouse);
				const higherOffset = Math.max(Math.abs(node.marriageOffset), Math.abs(spouse.marriageOffset));
				node.marriageOffset = Math.sign(node.marriageOffset) * higherOffset;
				spouse.marriageOffset = Math.sign(spouse.marriageOffset) * higherOffset;
			});
		}
	}
}

// Deal with parents clashing
function assignMarriageOffset(familyTree, node, targetId) {
	const targetPerson = familyTree.find(person => person._id === targetId);
	const father = familyTree.find(person => person._id === node.father);
	const mother = familyTree.find(person => person._id === node.mother);
	
	if (!father || !mother || node.gen >= targetPerson.gen && node._id !== targetId) {
		// If node is an ancestor (no parents), set leftWidth and rightWidth to 0
		// Or node is in the same generation as the target person but not the target person themself
		// since the parents of their spouses won't be shown
		node.leftWidth = 0;
		node.rightWidth = 0;
	} else {
		// If node has parents, add parent's width and parent's marriage offset
		node.leftWidth = father.marriageOffset - node.xOffset + father.leftWidth;
		node.rightWidth = mother.marriageOffset - node.xOffset + mother.rightWidth;
	}

	const baseMarriageOffset = baseWidth / 4;
	// node.marriageOffset = node.gender === 'm'
	// 	? -(node.rightWidth + radius + baseMarriageOffset)
	// 	: -(node.leftWidth - radius - baseMarriageOffset);
	node.marriageOffset = node.gender === 'm'
		? -(node.rightWidth + baseMarriageOffset)
		: -(node.leftWidth - baseMarriageOffset);
}

// Assign absolute (not relative) x coordinates for each family member for drawing on SVG
function mainAssignX(familyTree, ancestors, targetId) {
	const ancestorsCopy = [...ancestors];
	const initialAncestor = ancestorsCopy.splice(ancestorsCopy.findIndex(ancestor => ancestor.gen === 0), 1)[0];
	initialAncestor.x = 0;
	assignX(familyTree, initialAncestor);

	for (const ancestor of ancestorsCopy) {
		// Boomerang (down and up) then waterfall (down)
		const traversedChild = mainFindTraversedChild(familyTree, ancestor);
		assignXUp(familyTree, traversedChild);

		assignX(familyTree, ancestor);
	}

	// Normalize x coordinates so that the target person has an x coordinate of 0
	const targetNode = familyTree.find(node => node._id === targetId);
	const offset = targetNode.x;
	familyTree.forEach(node => node.x -= offset);
}

// The passed node should already have its x assigned
function assignX(familyTree, node) {
	if (node.isTraversed || !node.spouse) {
		node.isTraversed = true;
		return;
	}
	const spouse = familyTree.find(spouse => spouse._id === node.spouse);
	spouse.x = node.x + spouse.marriageOffset - node.marriageOffset;

	const children = familyTree.filter(child => child.father === node._id || child.mother === node._id);
	children.forEach(child => child.x = node.x - node.marriageOffset + child.xOffset);
	children.forEach(child => assignX(familyTree, child));
	node.isTraversed = true;
	spouse.isTraversed = true;
}

/* Find an already traversed child who has their x coordinate assigned so we can
 * assign x coordinates to the people who are connected to the child relative
 * to the child's x coordinate */
function mainFindTraversedChild(familyTree, node) {
	return findTraversedChild(familyTree, [node]);
}

function findTraversedChild(familyTree, parents) {
	// Breadth first, so add to the start
	// Base case: parents is empty -> failed to find any traversed child
	if (!parents.length) {
		return null;
	}
	const parent = parents.pop();

	// Base case: current node is traversed, return it
	if (parent.isTraversed) {
		return parent;
	}
	const children = familyTree.filter(child => child.father === parent._id || child.mother === parent._id);
	parents.unshift(...children);
	return findTraversedChild(familyTree, parents);
}

// Assign x but don't set isTraversed to true
function assignXUp(familyTree, node) {
	// Base case: no parents
	if (!node.father || !node.mother) {
		return;
	}
	const father = familyTree.find(parent => parent._id === node.father);
	const mother = familyTree.find(parent => parent._id === node.mother);

	father.x = node.x - node.xOffset + father.marriageOffset;
	mother.x = node.x - node.xOffset + mother.marriageOffset;

	assignXUp(familyTree, father);
	assignXUp(familyTree, mother);
}

function assignY(familyTree, targetId) {
	const targetNode = familyTree.find(node => node._id === targetId);
	const targetGen = targetNode.gen;

	// Target node should have a y coordinate of 0, adjust everyone else according
	// to the target node
	familyTree.forEach(node => node.y = (node.gen - targetGen) * verticalGap);
}

/* Accepts a family object and the id of the target person.
 * The family tree will be generated for people who are related by blood to 
 * the target person and their spouses.
 * Returns an object consisting of the family tree itself and ancestors 
 * of the target person (used for other functions) */
function generateFamilyTree(family, targetId) {
	// Cast MongoDB ObjectIDs to strings
	family.forEach(person => person._id = person._id.toString());

	const familyTree = buildFamilyTree(family, targetId);
	const ancestors = getAncestors(familyTree, targetId);

	familyTree.forEach(person => {
		if (person.name === 'Grandma') {
			person.nice = true;
		}
	});

	mainAssignXOffset(familyTree, ancestors, targetId);
	mainAssignMarriageOffset(familyTree, targetId);
	mainAssignX(familyTree, ancestors, targetId);
	assignY(familyTree, targetId);
	return { familyTree, ancestors };
}

function arrangeFamilyTree(familyTree, ancestors, targetId) {
	mainAssignXOffset(familyTree, ancestors, targetId);
	mainAssignMarriageOffset(familyTree, targetId);
	mainAssignX(familyTree, ancestors, targetId);
	assignY(familyTree, targetId);
	return { familyTree, ancestors };
}

// Create lines for family tree
function mainDrawLines(familyTree, ancestors) {
	let lines = [];
	for (const ancestor of ancestors) {
		lines.push(...recursiveDrawLines(familyTree, ancestor));
	}
	return lines;
}

function recursiveDrawLines(familyTree, node) {
	let lines = [];
	// Check for parents
	if (node.father && node.mother) {
		// If yes, draw vertical line up
		lines.push({
			x1: node.x,
			y1: node.y - radius,
			x2: node.x,
			y2: node.y - verticalGap / 2
		});
	}
	if (node.hasLines) {
		return lines;
	}
	// Check for spouse
	if (node.spouse) {
		lines.push({
			x1: node.x - radius * Math.sign(node.marriageOffset),
			y1: node.y,
			x2: node.x - node.marriageOffset,
			y2: node.y
		});

		const spouseNode = familyTree.find(person => person._id === node.spouse);
		lines.push({
			x1: spouseNode.x - radius * Math.sign(spouseNode.marriageOffset),
			y1: spouseNode.y,
			x2: spouseNode.x - spouseNode.marriageOffset,
			y2: spouseNode.y
		});
		spouseNode.hasLines = true;
	}
	// Check for kids
	const children = familyTree.filter(child => child.father === node._id || child.mother === node._id);
	if (children.length) {
		// Draw single vertical line down for kids
		lines.push({
			x1: node.x - node.marriageOffset,
			y1: node.y,
			x2: node.x - node.marriageOffset,
			y2: node.y + verticalGap / 2
		});

		// Draw horizontal line to span all kids
		lines.push({
			x1: Math.min(...children.map(child => child.x)),
			y1: node.y + verticalGap / 2,
			x2: Math.max(...children.map(child => child.x)),
			y2: node.y + verticalGap / 2
		});

		// Recurse into each child
		for (const child of children) {
			lines.push(...recursiveDrawLines(familyTree, child));
		}
	}

	node.hasLines = true;
	return lines;
}

module.exports = {
	buildFamilyTree,
	arrangeFamilyTree,
	mainDrawLines,
	getAncestors
}