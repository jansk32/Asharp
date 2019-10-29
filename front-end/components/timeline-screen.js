import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, StyleSheet, View, Image, TouchableOpacity, Dimensions, TouchableHighlight, FlatList } from 'react-native';
import Timeline from 'react-native-timeline-feed';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import moment from 'moment';
import { BACK_END_ENDPOINT, DATE_FORMAT } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import Gallery from './gallery';

// Import date formatting module moment.js
moment.locale('en');

const numColumns = 3;

export default function TimelineScreen({ navigation }) {
	const { navigate } = navigation;
	const [artefacts, setArtefacts] = useState([]);
	const [isLoading, setLoading] = useState(true);

	function formatTime(timeData) {
		// TIMELINE FORMAT
		// Format date DD-MM-YYYY
		timeData.forEach(entry => {
			entry.time = moment(entry.date).format(DATE_FORMAT);
			console.log(entry.time);
			entry.key = entry._id
		});

		// Sort Timeline in descending order
		timeData.sort((a, b) => moment(b.time, DATE_FORMAT).diff(moment(a.time, DATE_FORMAT)));

		// Display only one date under several artefacts with the same date
		for (let i = timeData.length - 1; i > 0; i--) {
			if (timeData[i].time === timeData[i - 1].time) {
				timeData[i].time = '';
			}
		}
		return timeData;
	}

	// Get all the artefact
	async function fetchArtefacts() {
		try {
			const res = await axios.get(`${BACK_END_ENDPOINT}/artefact/${await AsyncStorage.getItem('userId')}`);
			setArtefacts(res.data);
			console.log(res.data)
			setLoading(false)
		} catch (e) {
			console.error(e);
		}
	}

	useEffect(() => {		
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


	// Layout for Timeline tab
	function TimelineRoute() {
		if (isLoading) {
			return <ActivityIndicator size="large" color="#EC6268" />;
		}
		if (!artefacts.length) {
			return (
				<>
					<Text style={styles.textStyle}>Your family doesn't have any artefacts right now.</Text>
					<Text style={styles.desc}>When you or a family member gets an artefact, you will see it here.</Text>
				</>
			);

		}
		return (
			<Timeline
				style={styles.list}
				data={formatTime(artefacts)}
				circleSize={15}
				circleColor="#EC6268"
				lineColor="#e3e3e3"
				innerCircleType="dot"
				renderDetail={renderDetail}
				timeContainerStyle={{ minWidth: 85, marginLeft: 10 }}
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
			{/* <View style={styles.containers}> */}
			<LinearGradient colors={['#de6262', '#ffb88c']}
				start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
				style={styles.container}>

				<Text style={styles.title}>Memories Left Behind</Text>
				<Text style={styles.artefactTitle}>Artefact</Text>
			</LinearGradient>
			{/* </View> */}
			<TabView
				navigationState={tab}
				renderScene={SceneMap({
					first: TimelineRoute,
					second: () => Gallery({ isLoading, artefacts, navigation, refresh: fetchArtefacts }),
				})}
				renderTabBar={props =>
					<TabBar
						{...props}
						indicatorStyle={{ backgroundColor: '#de6262' }}
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
	containers: {
		backgroundColor: '#f5f7fb',
	},
	artefactTitle: {
		fontSize: 30,
		marginLeft: 10,
		fontWeight: 'bold',
		paddingBottom: '5%',
		color: 'white',
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
		// flex: 1,
		// marginVertical: 20
	},
	header: {
		fontSize: 20,
		textAlign: 'center',
		marginVertical: 10
	},
	title: {
		fontSize: 20,
		marginLeft: 10,
		color: 'white',
		paddingTop: '8%',

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
		width: Dimensions.get('window').width / numColumns,
		flex: 1,
	},
	textStyle: {
		fontSize: 20,
		fontWeight: 'bold',
		flexWrap: 'wrap',
		// textAlignVertical: 'center',
		textAlign: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		margin: 10,
		padding: 30,
		flexWrap: 'wrap',
		flexDirection: 'row',
	},
	desc: {
		fontSize: 16,
		paddingHorizontal: 30,
		flexWrap: 'wrap',
		textAlign: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
	},
});

TimelineScreen.navigationOptions = {
	title: 'Timeline'
};