import React, { useState, useEffect, Component } from 'react';
import { View, PanResponder, Dimensions, ToastAndroid, TextInput, StyleSheet, ScrollView, Text, Alert, ActivityIndicator, } from 'react-native';
import Svg, { Circle, Line, Image, Defs, Pattern, Rect, ClipPath, G, Path, Text as SvgText } from 'react-native-svg';
import generateFamilyTree, { mainDrawLines } from '../build-family-tree';
import axios from 'axios';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider, withMenuContext, renderers } from 'react-native-popup-menu';
const { SlideInMenu } = renderers;
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';


import { BACK_END_ENDPOINT, BLANK_PROFILE_PIC_URI } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';

const NODE_RADIUS = 50;
/* SVG panning and zooming is taken from https://snack.expo.io/@msand/svg-pinch-to-pan-and-zoom
 * Written by Mikael Sand 
 * Taken on 22 October 2019 */

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
	viewBoxSize = 1200;
	resolution = this.viewBoxSize / Math.min(this.props.height, this.props.width);

	state = {
		zoom: 1,
		left: 0,
		top: 0,
		isGesture: false,
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

	UNSAFE_componentWillMount() {
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onStartShouldSetPanResponderCapture: () => true,
			onMoveShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponderCapture: () => true,
			onPanResponderGrant: (e, gesture) => {
				const { locationX, locationY } = e.nativeEvent;
				const { left, top, zoom } = this.state;

				const tapX = (locationX - left) * this.resolution / zoom;
				const tapY = (locationY - top) * this.resolution / zoom;

				// Look for any node that was tapped
				const tappedNode = this.props.familyTree.find(node => Math.hypot(node.x - tapX, node.y - tapY) <= NODE_RADIUS);
				if (tappedNode) {
					this.setState({ tappedNode });
					// Set long press timeout to open menu if a node was tapped
					const LONG_PRESS_DURATION = 1000;
					this.longPressTimeout = setTimeout(() => {
						this.props.ctx.menuActions.openMenu('menu');
						// Null long press timeout to signal that the timeout has been resolved
						// so on touch release, a tap isn't registered
						this.longPressTimeout = null;
					}, LONG_PRESS_DURATION);
				}
			},
			onPanResponderTerminate: () => { },
			onShouldBlockNativeResponder: () => true,
			onPanResponderTerminationRequest: () => true,
			onPanResponderMove: (evt, gesture) => {
				if (this.state.isGesture) {
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
				} else {
					if (Math.hypot(gesture.dx, gesture.dy) > 5) {
						this.setState({ isGesture: true });
						clearTimeout(this.longPressTimeout);
					}
				}
			},
			onPanResponderRelease: () => {
				clearTimeout(this.longPressTimeout);

				this.setState({
					isZooming: false,
					isMoving: false,
					isGesture: false,
				});

				if (!this.state.isGesture) {
					if (this.state.tappedNode && this.longPressTimeout) {
						// Register touch release as a tap if long press timeout hasn't
						// been nulled by itself which means it hasn't resolved
						const { navigation } = this.props;
						if (navigation.state.params && navigation.state.params.isSendingArtefact) {
							// Send artefact
							Alert.alert(
								'Send artefact',
								`Send artefact to ${this.state.tappedNode.name}?`,
								[{
									text: 'Cancel'
								},
								{
									text: 'OK',
									onPress: async () => {
										try {
											const userRes = await axios.get(`${BACK_END_ENDPOINT}/user/find/${await AsyncStorage.getItem('userId')}`);
											const user = userRes.data;
											axios.put(`${BACK_END_ENDPOINT}/artefact/assign`, {
												artefactId: navigation.state.params.artefactId,
												recipientId: this.state.tappedNode._id,
												senderId: user._id,
											});

											navigation.setParams(null);
											navigation.goBack();
										} catch (e) {
											console.error(e);
											ToastAndroid.show('Error sending artefact', ToastAndroid.SHORT);
										}
									}
								}]);
						} else {
							// Go to profile page but send family member details instead
							navigation.navigate('NewProfile', { userId: this.state.tappedNode._id });
						}
					}
				}
			},
		});
	}

	componentDidUpdate(prevProps) {
		/* Shift the whole family tree to center it.
		 * The x coordinate of the top left corner of the family tree is set to
		 * half the display width minus half the width of the family tree in pixels.
		 * Same with the y coordinate of the top left corner but uses height instead of width.
		 */
		if (prevProps.familyTree.length === 0) {
			const { height, width, familyTree } = this.props;
			const xCoords = familyTree.map(node => node.x);
			const familyTreeWidth = (Math.max(...xCoords) - Math.min(...xCoords)) / this.resolution;
			const yCoords = familyTree.map(node => node.y);
			const familyTreeHeight = (Math.max(...yCoords) - Math.min(...yCoords)) / this.resolution;
			this.setState({
				left: width / 2,
				top: height / 2,
				zoom: 2,
			});
		}
	}

	render() {
		const { height, width, familyTree, lines, navigation: { navigate } } = this.props;
		const { left, top, zoom } = this.state;

		return (
			<View {...this._panResponder.panHandlers}>
				<Menu name="menu" renderer={SlideInMenu}>
					<MenuTrigger>
					</MenuTrigger>
					<MenuOptions customStyles={{ optionText: styles.menuText, optionWrapper: styles.menuWrapper, optionsContainer: styles.menuStyle }}>
						<MenuOption onSelect={() => navigate('AddParents', { linkedNode: this.state.tappedNode })} text="Add parents" disabled={this.state.tappedNode && Boolean(this.state.tappedNode.father) && Boolean(this.state.tappedNode.mother)} />
						<MenuOption onSelect={() => navigate('AddFamilyMember', { linkedNode: this.state.tappedNode, isAddingSpouse: true })} text="Add spouse" disabled={this.state.tappedNode && Boolean(this.state.tappedNode.spouse)} />
						<MenuOption onSelect={() => navigate('AddFamilyMember', { linkedNode: this.state.tappedNode, isAddingSpouse: false })} text="Add a child" disabled={this.state.tappedNode && !Boolean(this.state.tappedNode.spouse)} />
					</MenuOptions>
				</Menu>
				<Svg
					width={width}
					height={height}
					viewBox={`0 0 ${this.viewBoxSize} ${this.viewBoxSize}`}
					preserveAspectRatio="xMinYMin meet" >
					<G
						transform={{
							translateX: left * this.resolution,
							translateY: top * this.resolution,
							scale: zoom,
						}}>
						{
							familyTree.map(node => <Node data={node} key={node._id} />)
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

function Node({ data: { x, y, name, _id, pictureUrl, matchesSearch } }) {
	return (
		<>
			<Defs>
				<ClipPath id={_id.toString()}>
					<Circle cx={x} cy={y} r={NODE_RADIUS} />
				</ClipPath>
			</Defs>
			<Circle
				cx={x}
				cy={y}
				r={NODE_RADIUS}
				stroke={matchesSearch ? '#EC6268' : 'white'}
				strokeWidth="8"
				fill="white"
			/>
			<Image
				height={NODE_RADIUS * 2}
				width={NODE_RADIUS * 2}
				x={x - NODE_RADIUS}
				y={y - NODE_RADIUS}
				href={{ uri: pictureUrl || BLANK_PROFILE_PIC_URI }}
				clipPath={`url(#${_id})`}
				preserveAspectRatio="xMidYMid slice"
			/>
			<SvgText
				x={x}
				y={y + 100}
				fill="black"
				stroke="black"
				fontSize="30"
				textAnchor="middle"
			>
				{name}
			</SvgText>
		</>
	);
}

function FamilyTreeScreen({ ctx, navigation }) {
	const [familyTree, setFamilyTree] = useState([]);
	const [lines, setLines] = useState([]);
	const [familyMemberSearch, setFamilyMemberSearch] = useState('');
	const [isSvgDimensionsSet, setSvgDimensionsSet] = useState(false);
	const [hide, setHide] = useState(true);
	const [svgWidth, setSvgWidth] = useState(Dimensions.get('window').width);
	const [svgHeight, setSvgHeight] = useState(Dimensions.get('window').height);

	useEffect(() => {
		async function fetchFamilyMembers() {
			try {
				// Get user document of current user
				const userRes = await axios.get(`${BACK_END_ENDPOINT}/user/find/${await AsyncStorage.getItem("userId")}`);
				const user = userRes.data;
				console.log(user);
				const res = await axios.get(`${BACK_END_ENDPOINT}/users`);
				const familyMembers = res.data;

				const familyTreeInfo = generateFamilyTree(familyMembers, user._id);
				const { familyTree, ancestors } = familyTreeInfo;
				const lines = mainDrawLines(familyTree, ancestors);

				setFamilyTree(familyTree);
				setLines(lines);
				setHide(false)
			} catch (e) {
				console.trace(e);
			}
		}
		fetchFamilyMembers();
	}, []);

	// Family tree searching and highlighting
	useEffect(() => {
		if (familyTree.length) {
			// Highlight the nodes that match the search string
			// If the search string is empty, there are no matches
			setFamilyTree(familyTree
				.map(node =>
					({ ...node, matchesSearch: familyMemberSearch ? node.name.toLowerCase().includes(familyMemberSearch.toLowerCase()) : false })));
		}
	}, [familyMemberSearch]);

	return (
		<>
			{/* <View style={styles.headerContainer}> */}
			<LinearGradient colors={['#02aab0', '#00cdac']} 
            	start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                 style={styles.headerContainer}>
				<Text style={styles.add}>This is your</Text>
				<Text style={styles.title}>Family Tree</Text>
				{ hide &&
					(
						<ActivityIndicator size="large" color="#0000ff" animating={hide} />
					)
				}
				<View style={styles.searchContainer}>
					<Icon name="md-search" size={30} color={'#2d2e33'} />
					<TextInput
						placeholder="Search family member"
						value={familyMemberSearch}
						onChangeText={setFamilyMemberSearch}
						style={styles.searchInput}
					/>
				</View>
			</LinearGradient>
			{/* </View> */}
			<View style={{ flex: 1, alignSelf: 'stretch' }} onLayout={event => {
				const { width, height } = event.nativeEvent.layout;
				if (isSvgDimensionsSet) {
					return;
				}
				setSvgWidth(width);
				setSvgHeight(height);
				setSvgDimensionsSet(true);
			}}>
				{
					isSvgDimensionsSet ?
						<ZoomableSvg
							width={svgWidth}
							height={svgHeight}
							familyTree={familyTree}
							lines={lines}
							ctx={ctx}
							navigation={navigation} />
						:
						null
				}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		// borderBottomLeftRadius: 30,
		// borderBottomRightRadius: 30,
		backgroundColor: '#f5f7fb',
		paddingBottom: 30,
	},
	searchContainer: {
		flexDirection: 'row',
		padding: 5,
		paddingHorizontal: 20,
		borderRadius: 10,
		borderWidth: 0.5,
		marginLeft: '5%',
		marginRight: '5%',
		backgroundColor: 'white',
		borderColor: 'white',
		// marginTop: 15,
	},
	searchInput: {
		flex: 1,
		marginLeft: 15,
		padding: 5
	},
	title: {
		fontSize: 35,
		// color: '#2d2e33',
		color: 'white',
		paddingBottom: 10,
		fontWeight: 'bold',
		marginLeft: 10,
	},
	add: {
		fontSize: 25,
		// color: '#2d2e33',
		color: 'white',
		marginLeft: 10,
		marginTop: 10,
	},
	menuStyle: {
		borderTopEndRadius: 20,
		borderTopStartRadius: 20,
		borderRadius: 20,
		borderColor: 'black',
		backgroundColor: "black",
		borderWidth: 1,
		flex: 1 / 4,
		width: Dimensions.get('window').width * 0.85,
		alignSelf: 'center',
		height: 150,
		marginBottom: 30,
		justifyContent: 'space-evenly',
	},
	menuText: {
		textAlign: 'center',
		fontSize: 20,
		color: 'white',
		borderBottomWidth: 1,
		borderBottomColor: 'white',
		paddingBottom: 7,

		// borderTopColor:'#f5f7fb',
		// borderLeftColor:'#f5f7fb',
	},
	menuStyle: {
		borderTopEndRadius: 20,
		borderTopStartRadius: 20,
		borderColor: 'black',
		borderWidth: 0.5,
		paddingTop: 20,
		justifyContent: 'space-between',
		paddingBottom: 80,
	},
	menuWrapper: {
		paddingVertical: 15,
		borderBottomColor: 'black',
		borderBottomWidth: 0.5,
		marginHorizontal: 50,
	},
	menuText: {
		textAlign: 'left',
		fontSize: 20,
	},
})

FamilyTreeScreen.navigationOptions = {
	title: 'Family tree'
};

export default withMenuContext(FamilyTreeScreen);