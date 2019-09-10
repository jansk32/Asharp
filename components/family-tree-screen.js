import React from 'react';
// import { Text as RNText } from 'react-native';
import Svg, { Circle, Line, Image, Defs, Pattern, Rect, ClipPath, G, Path, Text } from 'react-native-svg';
import generateFamilyTree, { family } from '../build-family-tree';


function Node({ cx, cy, id }) {
    const radius = 50;
    return (
        <>
            <Defs>
                <ClipPath id={id.toString()}>
                    <Circle cx={cx} cy={cy} r={radius} />
                </ClipPath>
            </Defs>

            {/* <Image
                height={radius * 2}
                width={radius * 2}
                x={cx - radius}
                y={cy - radius}
                href={require('../tim_derp.jpg')}
                clipPath={`url(#${id})`}
            /> */}

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
                fontSize="20"
                textAnchor="middle"
            >{id}</Text>

        </>
    );
}

export default function FamilyTreeScreen() {
    const familyTree = generateFamilyTree(family, 'th');
    console.log(familyTree.map(node => [node.id, node.x, node.marriageOffset, node.xOffset, node.width]));

    return (
        <>
            <Svg height="100%" width="100%" viewBox="250 -200 1200 1200">

                {/* <Line x1="50" y1="50" x2="200" y2="50"
                    stroke="black"
                    strokeWidth="3"
                />

                <Line x1="125" y1="50" x2="125" y2="200"
                    stroke="black"
                    strokeWidth="3"
                />

                <Circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="blue"
                    strokeWidth="2.5"
                    fill="green"
                />

                <Circle
                    cx="200"
                    cy="50"
                    r="45"
                    stroke="blue"
                    strokeWidth="2.5"
                    fill="green"
                />

                <Defs>
                    <ClipPath id="circleView">
                        <Circle cx="125" cy="200" r="70" />
                    </ClipPath>
                </Defs>

                <Image
                    height="140"
                    width="140"
                    x="55"
                    y="130"
                    clipPath="url(#circleView)"
                    href={require('../tim_derp.jpg')}
                />

                <Rect
                    height="100"
                    width="100"
                    x="300"
                    y="200"
                    clipPath="url(#circleView)"
                    fill="green"
                /> */}
                {/* 
                {
                    [50, 200].map(el => <Node cx={el} cy="50" id={el} key={el} />)
                } */}
                {
                    familyTree.map(node => <Node cx={node.x} cy={node.gen * 200} id={node.id} key={node.id} />)
                }
            </Svg>
        </>
    );
}

FamilyTreeScreen.navigationOptions = {
    title: 'Family tree'
};