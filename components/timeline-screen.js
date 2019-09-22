import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, FlatList, View, Image } from 'react-native';
import Timeline from 'react-native-timeline-feed';

export default function TimelineScreen({ navigation }) {
	const { navigate } = navigation;
	const data = [
		{
			time: '2018-03-11',
			title: 'Pictures',
			image: require('../tim_derp.jpg'),
		},
		{
			time: '2018-03-11',
			title: 'Drums',
			image: require('../tim_derp.jpg')
		},
		{
			time: '2013-03-13',
			title: 'Piano',
			image: require('../tim_derp.jpg')
		},
		{
			time: '2018-03-11',
			title: 'Teapot',
			image: require('../tim_derp.jpg')
		},
		{
			time: '2013-03-12',
			title: 'Cards',
			image: require('../tim_derp.jpg')
		},
		{
			time: '2013-03-13',
			title: 'Figurine',
			image: require('../tim_derp.jpg')
		},
		{
			time: '2013-03-13',
			title: 'Family Picture',
			image: require('../tim_derp.jpg')
		}
	];

	// Sort data, print duplicates without the time
	const formatData = (data) => {
		data.sort(function (a, b) {
			if (a.time === b.time) {
				b.time = '';
			}
			return (new Date(a.time)) > (new Date(b.time)) ? 1 : -1;
		});
		return data;
	};

	// Custom render event title and event description
	renderDetail = ({ item, index }) => {
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					<Image source={require('../tim_derp.jpg')} style={styles.image} />
					<Text style={[styles.itemTitle]}>{item.title}</Text>
				</View>
			</View>
		);
	};

	return (
		<>
			<Text style={styles.title}>Timeline</Text>
			<Timeline
				style={styles.list}
				data={formatData(data)}
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