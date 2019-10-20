import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, Dimensions, TouchableHighlight, FlatList } from 'react-native';
import Timeline from 'react-native-timeline-feed';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import moment from 'moment';
import { BACK_END_ENDPOINT } from '../constants';

// Import date formatting module moment.js
moment.locale('en');

const numColumns = 3;

export default function TimelineScreen({ navigation }) {

	const { navigate } = navigation;
	const [artefacts, setArtefacts] = useState([]);

	function formatTime(timeData) {
		// TIMELINE FORMAT
		// Format date DD-MM-YYYY
		timeData.forEach(entry => {
			entry.time = moment(entry.date).format('DD-MM-YYYY');
			console.log(entry.time);
			entry.key = entry._id
		});

		// Sort Timeline in descending order
		timeData.sort((a, b) => moment(b.time, 'DD-MM-YYYY').diff(moment(a.time, 'DD-MM-YYYY')));

		// Display only one date under several artefacts with the same date
		for (let i = timeData.length - 1; i > 0; i--) {
			if (timeData[i].time === timeData[i - 1].time) {
				timeData[i].time = '';
			}
		}
		return timeData;
	}

	function formatData(data, numColumns) {
		// GALLERY FORMAT
		const numberOfFullRows = Math.floor(data.length / numColumns);

		let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
		while (numberOfElementsLastRow !== numColumns
			&& numberOfElementsLastRow !== 0) {
			numberOfElementsLastRow++;
		}
		return data;
	};

	// Get all the artefact
	useEffect(() => {
		async function fetchArtefacts() {
			try {
				const res = await axios.get(`${BACK_END_ENDPOINT}/artefact`);
				setArtefacts(res.data);
				console.log(res.data)
			} catch (e) {
				console.error(e);
			}
		}
		fetchArtefacts();
	}, []);


	// Custom render event title and event description (Timeline)
	renderDetail = ({ item, index }) => {
		if (item.empty) {
			return <View style={[styles.item, styles.itemInvisible]} />;
		}
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					<TouchableOpacity onPress={() => navigate('ItemDetail', { artefactId: item._id })}>
						<Image source={{ uri: item.file }} style={styles.image} />
					</TouchableOpacity>
					<Text style={[styles.itemTitle]}>{item.name}</Text>
				</View>
			</View>
		);
	};

	// Render Item invisible if it's just a placeholder for columns in the grid,
	// if not, render the picture for each grid (Gallery)
	renderItem = ({ item, index }) => {
		if (item.empty) {
			return <View style={[styles.item, styles.itemInvisible]} />
		}
		return (
			<View style={styles.item}>
				<TouchableHighlight onPress={() => navigate('ItemDetail', { artefactId: item._id })}>
					<Image
						style={styles.imageBox}
						source={{ uri: item.file }}
					/>
				</TouchableHighlight>
			</View>
		);
	}

	// Layout for Gallery tab
	function GalleryRoute() {
		return (
			<FlatList
				data={formatData(artefacts, numColumns)}
				keyExtractor={item => item._id}
				renderItem={renderItem}
				numColumns={numColumns}
				style={styles.container}
			/>
		);
	}

	// Layout for Timeline tab
	function TimelineRoute() {
		return (
			<Timeline
				style={styles.list}
				data={formatTime(artefacts)}
				circleSize={15}
				circleColor="#EC6268"
				lineColor="#e3e3e3"
				innerCircleType="dot"
				renderDetail={renderDetail}
				timeContainerStyle={{ minWidth: 72, marginLeft: 10 }}
				timeStyle={{ color: '#2d2e33' }}
			/>
		);
	}

	const [tab, setTab] = useState({
		index: 0,
		routes: [
			{ key: 'first', title: 'Timeline' },
			{ key: 'second', title: 'Gallery' },
		],
	});

	return (
		<>
			<View style={styles.containers}>
				<Text style={styles.title}>Memories Left Behind</Text>
				<Text style={styles.artefactTitle}>Artefact</Text>
			</View>
			<TabView
				navigationState={tab}
				renderScene={SceneMap({
					first: TimelineRoute,
					second: GalleryRoute,
				})}
				renderTabBar={props =>
					<TabBar
						{...props}
						indicatorStyle={{ backgroundColor: '#EC6268' }}
						style={{ backgroundColor: '#f5f7fb' }}
						bounces={true}
						labelStyle={{ color: '#2d2e33' }}
					/>
				}
				onIndexChange={index => setTab({ ...tab, index })}
				initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	scene: {
		flex: 1,
	},
	itemTitle: {
		fontSize: 15,
		paddingLeft: 5,
	},
	title: {
		fontSize: 20,
		marginLeft: 10,
		color: '#2d2e33',
		paddingTop: '8%'
	},
	containers: {
		backgroundColor: '#f5f7fb',
	},
	artefactTitle: {
		fontSize: 30,
		marginLeft: 10,
		fontWeight: 'bold',
		paddingBottom: '8%',
	},
	image: {
		width: 75,
		height: 75,
		borderRadius: 10
	},
	list: {
		flex: 1,
		marginTop: 20,
	},
	container: {
		flex: 1,
		marginVertical: 20
	},
	header: {
		fontSize: 20,
		textAlign: 'center',
		marginVertical: 10
	},
	title: {
		fontSize: 20,
		marginLeft: 10,
		color: '#2d2e33',
		paddingTop: '8%',

	},
	galleryTitle: {
		fontSize: 30,
		marginLeft: 10,
		fontWeight: 'bold',
		paddingBottom: '8%',
	},
	item: {
		height: Dimensions.get('window').width / numColumns, // approximate a square
		backgroundColor: '#FAFAFA',
		alignItems: 'center',
	},
	itemInvisible: {
		backgroundColor: 'transparent',
	},
	itemText: {
		color: '#fff',
	},
	imageBox: {
		height: Dimensions.get('window').width / numColumns, // approximate a square
		flex: 1,
		margin: 1,
		width: Dimensions.get('window').width / numColumns,
	}
});

TimelineScreen.navigationOptions = {
	title: 'Timeline'
};