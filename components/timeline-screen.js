import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, FlatList, View, Image } from 'react-native';
import Timeline from 'react-native-timeline-feed';
import axios from 'axios';
import Moment from 'moment';

// Import date formatting module moment.js
Moment.locale('en');

export default function TimelineScreen({ navigation }) {
	const { navigate } = navigation;
	const [artefacts, setArtefacts] = useState([]);

    // Get all the artefact
    useEffect(() => {
		async function fetchArtefacts() {
			try {
				const res = await axios.get('http://localhost:3000/artefact');
				setArtefacts(res.data);
				console.log(res.data)
			} catch (e) {
				console.error(e);
			}
		}
		fetchArtefacts();
    }, []);
	
  // Sort date in descending order in the timeline
	const formatData = (data) => {
		data.sort(function (a, b) {
			if (a.date === b.date) {
				b.date = '';
			}
			// Change the name to time so we cann edit
			a.time = Moment(a.date).format("YYYY-MM-DD");
			b.time = Moment(b.date).format("YYYY-MM-DD");
			return a.time > b.time ? 1 : -1;
		});
		return data.reverse();
	};

	// Custom render event title and event description
	renderDetail = ({ item, index }) => {
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					<Image source={{uri: item.file}} style={styles.image} />
					<Text style={[styles.itemTitle]}>{item.name}</Text>
				</View>
			</View>
		);
	};

	return (
		<>
			<Text style={styles.title}>Timeline</Text>
			<Timeline
				style={styles.list}
				data={formatData(artefacts)}
				circleSize={15}
				circleColor='#FBC074'
				lineColor='grey'
				innerCircleType='dot'
				renderDetail={renderDetail}
				timeContainerStyle={{ minWidth: 72, marginLeft: 10 }}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	itemTitle: {
		fontSize: 15,
		paddingLeft: 5,
	},
	title: {
		fontSize: 35,
		textAlign: 'center',
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 25
	},
	list: {
		flex: 1,
		marginTop: 20,
	},
});

TimelineScreen.navigationOptions = {
	title: 'Timeline'
};