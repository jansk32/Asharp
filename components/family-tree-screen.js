import React, { useState, Component } from 'react';
import { View, PanResponder, Dimensions } from 'react-native';
import Svg, { Circle, Line, Image, Defs, Pattern, Rect, ClipPath, G, Path, Text } from 'react-native-svg';
import generateFamilyTree, { family, mainDrawLines } from '../build-family-tree';

/* SVG panning and zooming was taken from https://snack.expo.io/@msand/svg-pinch-to-pan-and-zoom
 * Written by Mikael Sand */

function calcDistance(x1, y1, x2, y2) {
	const dx = x1 - x2;
	const dy = y1 - y2;
	return Math.sqrt(dx * dx + dy * dy);
}

function middle(p1, p2) {
	return (p1 + p2) / 2;
}

function calcCenter(x1, y1, x2, y2) {
	return {
		x: middle(x1, x2),
		y: middle(y1, y2),
	};
}

class ZoomableSvg extends Component {
	state = {
		zoom: 1,
		left: 0,
		top: 0,
	};

	processPinch(x1, y1, x2, y2) {
		const distance = calcDistance(x1, y1, x2, y2);
		const { x, y } = calcCenter(x1, y1, x2, y2);

		if (!this.state.isZooming) {
			const { top, left, zoom } = this.state;
			this.setState({
				isZooming: true,
				initialX: x,
				initialY: y,
				initialTop: top,
				initialLeft: left,
				initialZoom: zoom,
				initialDistance: distance,
			});
		} else {
			const {
				initialX,
				initialY,
				initialTop,
				initialLeft,
				initialZoom,
				initialDistance,
			} = this.state;

			const touchZoom = distance / initialDistance;
			const dx = x - initialX;
			const dy = y - initialY;

			const left = (initialLeft + dx - x) * touchZoom + x;
			const top = (initialTop + dy - y) * touchZoom + y;
			const zoom = initialZoom * touchZoom;

			this.setState({
				zoom,
				left,
				top,
			});
		}
	}

	processTouch(x, y) {
		if (!this.state.isMoving || this.state.isZooming) {
			const { top, left } = this.state;
			this.setState({
				isMoving: true,
				isZooming: false,
				initialLeft: left,
				initialTop: top,
				initialX: x,
				initialY: y,
			});
		} else {
			const { initialX, initialY, initialLeft, initialTop } = this.state;
			const dx = x - initialX;
			const dy = y - initialY;
			this.setState({
				left: initialLeft + dx,
				top: initialTop + dy,
			});
		}
	}

	componentWillMount() {
		this._panResponder = PanResponder.create({
			onPanResponderGrant: () => { },
			onPanResponderTerminate: () => { },
			onMoveShouldSetPanResponder: () => true,
			onStartShouldSetPanResponder: () => true,
			onShouldBlockNativeResponder: () => true,
			onPanResponderTerminationRequest: () => true,
			onMoveShouldSetPanResponderCapture: () => true,
			onStartShouldSetPanResponderCapture: () => true,
			onPanResponderMove: evt => {
				const touches = evt.nativeEvent.touches;
				const length = touches.length;
				if (length === 1) {
					const [{ locationX, locationY }] = touches;
					this.processTouch(locationX, locationY);
				} else if (length === 2) {
					const [touch1, touch2] = touches;
					this.processPinch(
						touch1.locationX,
						touch1.locationY,
						touch2.locationX,
						touch2.locationY
					);
				}
			},
			onPanResponderRelease: () => {
				this.setState({
					isZooming: false,
					isMoving: false,
				});
			},
		});
	}

	render() {
		const viewBoxSize = 1200;
		const { height, width, familyTree, lines } = this.props;
		const { left, top, zoom } = this.state;
		const resolution = viewBoxSize / Math.min(height, width);
		return (
			<View {...this._panResponder.panHandlers}>
				<Svg
					width={width}
					height={height}
					viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
					preserveAspectRatio="xMinYMin meet">
					<G
						transform={{
							translateX: left * resolution,
							translateY: top * resolution,
							scale: zoom,
						}}>
						{
							familyTree.map(node => <Node cx={node.x} cy={node.y} id={node.id} key={node.id} />)
						}
						{
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
						}
					</G>
				</Svg>
			</View>
		);
	}
}

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
			>
				{id}
			</Text>
		</>
	);
}

export default function FamilyTreeScreen() {
	const [familyTreeInfo] = useState(() => generateFamilyTree(family, 'th'));
	const [familyTree] = useState(familyTreeInfo.familyTree);
	const [ancestors] = useState(familyTreeInfo.ancestors);
	const [lines] = useState(() => mainDrawLines(familyTree, ancestors));

	const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

	return (
		<ZoomableSvg
			width={screenWidth}
			height={screenHeight}
			familyTree={familyTree}
			lines={lines} />
	);
}

FamilyTreeScreen.navigationOptions = {
	title: 'Family tree'
};