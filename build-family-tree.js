// Data set for testing
export const family = [{
	id: 'th',
	gender: 'm',
	m: 'yb',
	f: 'ah'
}, {
	id: 'fh',
	gender: 'f',
	spouse: 'mg',
	m: 'yb',
	f: 'ah'
}, {
	id: 'mg',
	gender: 'm',
	spouse: 'fh'
}, {
	id: 'yb',
	gender: 'f',
	spouse: 'ah',
	m: 'pp',
	f: 'gg'
}, {
	id: 'vb',
	gender: 'f',
	spouse: 'tk',
	m: 'pp',
	f: 'gg'
}, {
	id: 'tk',
	gender: 'm',
	spouse: 'vb',
}, {
	id: 'j0',
	gender: 'm',
	m: 'vb',
	f: 'tk'
}, {
	id: 'j1',
	gender: 'f',
	m: 'vb',
	f: 'tk'
}, {
	id: 'j2',
	gender: 'f',
	m: 'vb',
	f: 'tk'
}, {
	id: 'lb',
	gender: 'f',
	spouse: 'ak',
	m: 'pp',
	f: 'gg'
}, {
	id: 'ak',
	gender: 'm',
	spouse: 'lb',
}, {
	id: 'ad',
	gender: 'm',
	m: 'lb',
	f: 'ak'
}, {
	id: 'nd',
	gender: 'f',
	m: 'lb',
	f: 'ak'
}, {
	id: 'ah',
	gender: 'm',
	spouse: 'yb',
	m: 'gm',
	f: 'gf'
}, {
	id: 'lh',
	gender: 'f',
	spouse: 'jk',
	f: 'gf',
	m: 'gm'
}, {
	id: 'jk',
	gender: 'm',
	spouse: 'lh'
}, {
	id: 'dh',
	gender: 'm',
	spouse: 'yh',
	m: 'gm',
	f: 'gf'
}, {
	id: 'yh',
	gender: 'f',
	spouse: 'dh'
}, {
	id: 'pp',
	gender: 'f',
	spouse: 'gg'
},
{
	id: 'gg',
	gender: 'm',
	spouse: 'pp'
},
{
	id: 'gm',
	gender: 'f',
	spouse: 'gf',
	f: 'ggf',
	m: 'ggm'
}, {
	id: 'ggf',
	gender: 'm',
	spouse: 'ggm'
}, {
	id: 'ggm',
	gender: 'f',
	spouse: 'ggf'
}, {
	id: 'gf',
	gender: 'm',
	spouse: 'gm'
},
];
const radius = 50;
const margin = 10;

function up(family, divisibles, nonDivisibles) {
	// Base case: no one to divide
	if (divisibles.length === 0) {
		return nonDivisibles;
	}
	// Look for parents of the first element in divisibles
	const divisibleNode = divisibles[0];
	if (divisibleNode.f && divisibleNode.m) {
		// Can be further divided
		const father = family.find(node => node.id === divisibleNode.f);
		const mother = family.find(node => node.id === divisibleNode.m);
		father.tempGen = mother.tempGen = divisibleNode.tempGen - 1;
		divisibles.splice(0, 1, father, mother);
	} else {
		// Can't be divided anymore, record as most distant ancestor
		divisibles.splice(0, 1);
		nonDivisibles.push(divisibleNode);
	}
	return up(family, divisibles, nonDivisibles);
}

function getAncestors(family, targetId) {
	const node = family.find(person => person.id === targetId);
	node.tempGen = 0;
	return up(family, [node], []);
}

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
			const spouse = family.find(node => node.id === spouseId);
			spouse.gen = parent.gen;
			results.push(spouse);
			// Then look for children, add children to parents to check them as parents
			const children = family.filter(node => node.f === parent.id || node.m === parent.id);
			children.forEach(child => child.gen = parent.gen + 1);
			parents.unshift(...children);
		}
	}
	return down(family, ancestors, results, parents);
}

function getDescendants(family, ancestors) {
	return down(family, ancestors, [], []);
}


function normalizeAncestorGen(ancestors) {
	const offset = -Math.min(...ancestors.map(node => node.tempGen));
	ancestors.forEach(node => node.gen = node.tempGen + offset);
}

function buildFamilyTree(family, id) {
	const ancestors = getAncestors(family, id);
	normalizeAncestorGen(ancestors);
	family.forEach(node => delete node.tempGen);
	const familyTree = getDescendants(family, ancestors);
	return familyTree;
}

function mainArrangeFamilyTree(familyTree, ancestors, targetId) {
	const targetPerson = familyTree.find(person => person.id === targetId);
	for (let ancestor of ancestors) {
		if (!('marriageOffset' in ancestor)) {
			ancestor.width = recursiveArrangeFamilyTree(familyTree, ancestor, targetPerson);
		}
	}
}

function recursiveArrangeFamilyTree(familyTree, node, targetPerson) {
	const baseWidth = 4 * (radius + margin);
	// Base case: no spouse
	if (!node.spouse) {
		return baseWidth;
	}
	const baseMarriageOffset = baseWidth / 4;

	// By default, marriageOffset is determined by gender
	// This is for father, mother, and everyone who is not in their generation
	node.marriageOffset = node.gender === 'm' ? -baseMarriageOffset : baseMarriageOffset;
	
	// But, if current parent is in the generation of the target person's parent:
	// and is sibling of father, put to the left in marriage
	// and is sibling of mother, put to the right in marriage
	// and is father or mother themself, ignore since it's been handled by the default case
	if (node.gen === targetPerson.gen - 1) {
		const father = familyTree.find(person => person.id === targetPerson.f);
		if (node.id !== father.id && node.f === father.f) {
			node.marriageOffset = -baseMarriageOffset;
		}
		const mother = familyTree.find(person => person.id === node.m);
		if (node.id !== mother.id && node.f === mother.f) {
			node.marriageOffset = baseMarriageOffset;
		}
	}

	const spouse = familyTree.find(spouse => spouse.id === node.spouse);
	spouse.marriageOffset = -node.marriageOffset;
	const children = familyTree.filter(child => child.f === node.id || child.m === node.id);
	// Base case: no children
	if (!children.length) {
		return baseWidth;
	}
	for (let child of children) {
		child.width = recursiveArrangeFamilyTree(familyTree, child, targetPerson);
	}

	// Manually reorder siblings if it's the target person's parent generation
	if (children[0].gen === targetPerson.gen - 1) {
		if (children.some(child => child.id === targetPerson.f)) {
			// Father's cluster, move father to the end
			children.push(children.splice(children.findIndex(child => child.id === targetPerson.f), 1)[0]);
		} else {
			// Mother's cluster, move mother to the start
			children.unshift(children.splice(children.findIndex(child => child.id === targetPerson.m), 1)[0]);
		}
	}
	children[0].xOffset = 0;
	for (let i = 1; i < children.length; i++) {
		children[i].xOffset = children[i - 1].xOffset + children[i - 1].width / 2 + children[i].width / 2;
	}

	// Shift children to the left
	const leftOffset = children[children.length - 1].xOffset / 2;
	console.log(children[0].id + ' ' + leftOffset);
	children.forEach(child => console.log(child.xOffset));
	children.forEach(child => child.xOffset -= leftOffset);
	const totalWidth = children.reduce((sum, child) => sum + child.width, 0);
	return totalWidth > baseWidth ? totalWidth : baseWidth;
}

function mainAssignX(familyTree, ancestors) {
	const initialAncestor = ancestors.splice(ancestors.findIndex(ancestor => ancestor.gen === 0), 1)[0];
	initialAncestor;
	initialAncestor.x = 0;
	assignX(familyTree, initialAncestor);

	for (let ancestor of ancestors) {
		// Boomerang (down and up) then waterfall (down)
		const traversedChild = mainFindTraversedChild(familyTree, ancestor);
		assignXUp(familyTree, traversedChild);

		assignX(familyTree, ancestor);
	}
}

// The passed node should already have its x assigned
function assignX(familyTree, node) {
	if (node.isTraversed || !node.spouse) {
		node.isTraversed = true;
		return;
	}
	const spouse = familyTree.find(spouse => spouse.id === node.spouse);
	spouse.x = node.x + spouse.marriageOffset - node.marriageOffset;
	const children = familyTree.filter(child => child.f === node.id || child.m === node.id);
	children.forEach(child => child.x = node.x - node.marriageOffset + child.xOffset);
	children.forEach(child => assignX(familyTree, child));
	node.isTraversed = true;
	spouse.isTraversed = true;
}

function mainFindTraversedChild(familyTree, node) {
	return findTraversedChild(familyTree, [node]);
}

function findTraversedChild(familyTree, parents) {
	// breadth first, add to the start
	// Base case: parents is empty -> failed to find any traversed child
	if (!parents.length) {
		return null;
	}
	const parent = parents.pop();
	
	// Base case: current node is traversed, return it
	if (parent.isTraversed) {
		return parent;
	}
	const children = familyTree.filter(child => child.f === parent.id || child.m === parent.id);
	parents.unshift(...children);
	return findTraversedChild(familyTree, parents);
}

// Assign x but don't set isTraversed to true
function assignXUp(familyTree, node) {
	// Base case: no parents
	if (!node.f || !node.m) {
		return;
	}
	const father = familyTree.find(parent => parent.id === node.f);
	const mother = familyTree.find(parent => parent.id === node.m);

	father.x = node.x - node.xOffset + father.marriageOffset;
	mother.x = node.x - node.xOffset + mother.marriageOffset;

	assignXUp(familyTree, father);
	assignXUp(familyTree, mother);
}


function shiftToFitScreen(familyTree) {
	const offset = -Math.min(...familyTree.map(node => node.x)) + radius + margin;
	familyTree.forEach(node => node.x += offset);
}

export default function generateFamilyTree(family, targetId) {
	const familyTree = buildFamilyTree(family, targetId);
	const ancestors = getAncestors(family, targetId);
	mainArrangeFamilyTree(familyTree, ancestors, targetId);
	console.log(familyTree.map(node => [node.id, node.xOffset]));
	mainAssignX(familyTree, ancestors);
	shiftToFitScreen(familyTree);
	return familyTree;
}