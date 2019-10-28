import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, StyleSheet, View, FlatList, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import OneSignal from 'react-native-onesignal';
import LinearGradient from 'react-native-linear-gradient';

import { BACK_END_ENDPOINT, BLANK_PROFILE_PIC_URI } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';

export default function NotificationScreen({ navigation }) {
	const { navigate } = navigation;
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchNotifications() {
			const userRes = await axios.get(`${BACK_END_ENDPOINT}/user/find/${await AsyncStorage.getItem('userId')}`);
			const user = userRes.data;

			console.log(user._id);

			const res = await axios.get(`${BACK_END_ENDPOINT}/notification`, {
				params: {
					recipient: user._id
				}
			});
			const notifs = res.data;
			if (notifs) {
				setLoading(false);
			}
			console.log(notifs);
			// Sort notifications so the most recent one appears first
			notifs.sort((a, b) => moment(b.time).diff(moment(a.time)));
			setNotifications(notifs);
		}
		fetchNotifications();

		// Fetch notifications whenever a new notification is received
		OneSignal.addEventListener('received', fetchNotifications);
	}, []);

	// List of notification when user received an item
	function renderItem({ item: { sender, artefact }, index }) {
		return (
			<View style={styles.notifBox}>
				<TouchableOpacity
					onPress={() => navigate('NewProfile', { userId: sender._id })}>
					<Image
						source={{ uri: sender.pictureUrl || BLANK_PROFILE_PIC_URI }}
						style={styles.profPicStyle}
					/>
				</TouchableOpacity>
				<Text style={styles.textStyle}>
					<Text style={styles.ownerStyle}>{sender.name}</Text>
					<Text> passed down an artefact, {artefact.name}, for you!</Text>
				</Text>

				<TouchableOpacity
					onPress={() => navigate('ItemDetail', { artefactId: artefact._id })}>
					<Image
						source={{ uri: artefact.file }}
						style={styles.artefactPicStyle}
					/>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<>
			<LinearGradient colors={['#F9AD6A', '#D46C4E']}
				start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
				style={styles.headerContainer}>
				<Text style={styles.title}>View Updates</Text>
				<Text style={styles.galleryTitle}>Notification</Text>
			</LinearGradient>
			{loading &&
				<ActivityIndicator size="large" color="#0000ff" />
			}
			<ScrollView>
				<FlatList
					data={notifications}
					renderItem={renderItem}
					keyExtractor={item => item._id}
					ListEmptyComponent={<Text style={styles.textStyle}>No notifications yet</Text>}
				/>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		marginLeft: 10,
		color: 'white',
		paddingTop: '8%',
	},
	galleryTitle: {
		fontSize: 30,
		marginLeft: 10,
		fontWeight: 'bold',
		paddingBottom: '5%',
		color: 'white',
	},
	headerContainer: {
		// borderBottomLeftRadius: 25,
		// borderBottomRightRadius: 25,
		backgroundColor: '#f5f7fb',
		// paddingBottom:'3%'
	},
	notifBox: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},
	profPicStyle: {
		width: 50,
		height: 50,
		borderRadius: 100,
		marginVertical: 10,
		marginLeft: 15,
	},
	artefactPicStyle: {
		width: 50,
		height: 50,
		borderRadius: 3,
		marginVertical: 10,
		marginHorizontal: 15,
	},
	textStyle: {
		fontSize: 16,
		flex: 1,
		flexWrap: 'wrap',
		textAlignVertical: 'center',
		margin: 10,
	},
	ownerStyle: {
		fontWeight: 'bold'
	}
});

NotificationScreen.navigationOptions = {
	title: 'Notification'
};