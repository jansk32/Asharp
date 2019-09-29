import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Timeline from 'react-native-timeline-feed';
import LinearGradient from 'react-native-linear-gradient';
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
	
	const formatData = (data) => {
		// Sort date in descending order in the timeline
		data.sort(function (a, b) {
			return a.date > b.date ? -1 : 1;
		});
		
		// Format date DD-MM-YYYY
		data.forEach(entry => {entry.time = Moment(entry.date).format("DD-MM-YYYY")});

		// Display only one date under several artefacts with the same date
		for (let i = data.length - 1; i > 0; i--) {
			if (data[i].time === data[i-1].time) {
				data[i].time = '';
			} 
		}
		return data;
	};

	// Custom render event title and event description
	renderDetail = ({ item, index }) => {
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					<TouchableOpacity onPress={() => navigate('ItemDetail',{artefactId: item._id})}>
						<Image source={{uri: item.file}} style={styles.image} />
					</TouchableOpacity>
					<Text style={[styles.itemTitle]}>{item.name}</Text>
				</View>
			</View>
		);
	};

	return (
		<>
			<LinearGradient colors={['#50D5B7','#067D68']} style={styles.container}>
				<Text  style={styles.title}>Timeline</Text>				
			</LinearGradient>
			<Timeline
				style={styles.list}
				data={formatData(artefacts)}
				circleSize={15}
				circleColor='#EC6268'
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
		// backgroundColor: '#EC6268',
		// borderBottomLeftRadius:75,
		color:'white',
		paddingBottom:'15%',
		paddingTop:'10%'
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 10
	},
	list: {
		flex: 1,
		marginTop: 20,
		// backgroundColor: '#ebecf1',
	},
	container:{
		borderBottomLeftRadius: 75,
		borderColor:'black',
	}

});

TimelineScreen.navigationOptions = {
	title: 'Timeline'
};