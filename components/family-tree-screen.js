import React from 'react';
import Svg, { Circle, Line, Image, Defs, Pattern, Rect, ClipPath, G, Path, Text } from 'react-native-svg';
import generateFamilyTree, { family, mainDrawLines } from '../build-family-tree';


function Node({ cx, cy, id }) {
	const radius = 50;
	return (
		<>
			<Defs>
				<ClipPath id={id.toString()}>
					<Circle cx={cx} cy={cy} r={radius} />
				</ClipPath>
			</Defs>
			<Circle
				cx={cx}
				cy={cy}
				r={radius}
				stroke="black"
				fill="white"
			/>

			<Text
				x={cx}
				y={cy}
				fill="black"
				stroke="black"
				fontSize="30"
				textAnchor="middle"
			>{id}</Text>

		</>
	);
}

export default function FamilyTreeScreen() {
	const familyTreeInfo = generateFamilyTree(family, 'th');
	const familyTree = familyTreeInfo.familyTree;
	const ancestors = familyTreeInfo.ancestors;
	console.log(familyTree.map(node => [node.id, node.x, node.marriageOffset, node.xOffset, node.width]));

	return (
		<>
			<Svg height="100%" width="100%" viewBox="250 -200 1200 1200">
				{
					familyTree.map(node => <Node cx={node.x} cy={node.y} id={node.id} key={node.id} />)
				}
				{
					mainDrawLines(familyTree, ancestors).map((line, i) =>
						<Line
							x1={line.x1}
							y1={line.y1}
							x2={line.x2}
							y2={line.y2}
							stroke="black"
							strokeWidth="3"
							key={i}
						/>)
				}
			</Svg>
		</>
	);
}

FamilyTreeScreen.navigationOptions = {
	title: 'Family tree'
};