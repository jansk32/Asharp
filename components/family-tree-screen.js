import React, { useState, useEffect, useRef } from 'react';
import { View, PanResponder } from 'react-native';
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
                fontSize="30"
                textAnchor="middle"
            >{id}</Text>

        </>
    );
}

export default function FamilyTreeScreen() {
    const [familyTreeInfo] = useState(() => generateFamilyTree(family, 'th'));
    const [familyTree] = useState(familyTreeInfo.familyTree);
    const [ancestors] = useState(familyTreeInfo.ancestors);
    const [lines] = useState(() => mainDrawLines(familyTree, ancestors));

    const isMoving = useRef(false);
    const isZooming = useRef(false);

    const startingViewBoxCoords = useRef({ x: 0, y: 0 });
    const [viewBoxCoords, setViewBoxCoords] = useState({ x: 0, y: 0 });

    const [zoom, setZoom] = useState(1);
    const initialZoom = useRef(1);
    const initialDistance = useRef(0);
    const lastDistance = useRef(0);

    function distanceFromTwoTouches(touches) {
        return Math.hypot(
            touches[0].locationX - touches[1].locationX,
            touches[0].locationY - touches[1].locationY
        );
    }

    function calcCenter(touches) {
        return {
            x: (touches[0].locationX + touches[1].locationX) / 2,
            y: (touches[0].locationY + touches[1].locationY) / 2
        };
    }

    const [panResponder] = useState(() => PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (event, gestureState) => {
            console.log('GRANT: ' + event.nativeEvent.touches.length);
            const touches = event.nativeEvent.touches;
            if (touches.length === 1) {
                isMoving.current = true;
            } else if (touches.length === 2) {
            }
        },
        onPanResponderMove: (event, gestureState) => {
            const touches = event.nativeEvent.touches;
            if (touches.length === 1) {
                if (isZooming.current) {
                    // Transition from zooming to panning
                    const scale = lastDistance.current / initialDistance.current;
                    initialZoom.current *= scale;
                    isZooming.current = false;
                }
                console.log('**MOVE**');
                console.log(`start coords is ${JSON.stringify(startingViewBoxCoords)}`);
                console.log(`dx is ${(gestureState.dx)}`);
                setViewBoxCoords({
                    x: startingViewBoxCoords.current.x + gestureState.dx,
                    y: startingViewBoxCoords.current.y + gestureState.dy
                });
            } else if (touches.length === 2) {
                if (!isZooming.current) {
                    // Start zooming mode
                    initialDistance.current = distanceFromTwoTouches(touches);
                    isZooming.current = true;
                } else {
                    // Continuing zooming mode
                    lastDistance.current = distanceFromTwoTouches(touches);
                    const scale = lastDistance.current / initialDistance.current;
                    const currZoom = initialZoom.current * scale;
                    setZoom(currZoom);

                    // Offset to keep screen in center of zooming center
                    setViewBoxCoords(currCoords => {
                        return {
                            x: currCoords.x - (1 - currZoom) * center.x,
                            y: currCoords.y - (1 - currZoom) * center.y
                        };
                    })

                    // Also pan according to center of touches
                    const center = calcCenter(touches);
                    
                }
            }
        },
        onPanResponderRelease: (event, { dx, dy }) => {
            if (isMoving.current) {
                // Update starting coords
                startingViewBoxCoords.current.x += dx;
                startingViewBoxCoords.current.y += dy;
                isMoving.current = false;
            }
            if (isZooming.current) {
                // Update initial zoom
                const scale = lastDistance.current / initialDistance.current;
                initialZoom.current *= scale;
                isZooming.current = false;
            }
        }
    }));
    // console.log(familyTree.map(node => [node.id, node.x, node.marriageOffset, node.xOffset, node.width]));


    return (
        <View {...panResponder.panHandlers}>
            <Svg height="100%" width="100%" viewBox={'0 0 700 900'}>

                {/*
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

                <G
                    translateX={viewBoxCoords.x}
                    translateY={viewBoxCoords.y}
                    scale={zoom}>
                    {/* {
                        familyTree.map(node => <Node cx={node.x} cy={node.y} id={node.id} key={node.id} />)
                    } */}
                    {/* {
                        lines.map((line, i) =>
                            <Line
                                x1={line.x1}
                                y1={line.y1}
                                x2={line.x2}
                                y2={line.y2}
                                stroke="black"
                                strokeWidth="3"
                                key={i}
                            />)
                    } */}
                    <Rect
                        height="100"
                        width="100"
                        x="300"
                        y="200"
                        fill="green"
                    />
                    <Line
                        x1="350"
                        y1="250"
                        x2="450"
                        y2="300"
                        stroke="purple"
                        strokeWidth="5"
                    />
                </G>
            </Svg>
        </View>
    );
}

FamilyTreeScreen.navigationOptions = {
    title: 'Family tree'
};