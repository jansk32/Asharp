import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, StyleSheet, View, FlatList, Dimensions, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import OneSignal from 'react-native-onesignal';
import LinearGradient from 'react-native-linear-gradient';

import { BACK_END_ENDPOINT, BLANK_PROFILE_PIC_URI } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';

export default function NotificationScreen({ navigation }) {
	const { navigate } = navigation;
	const [notifications, setNotifications] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	async function fetchNotifications() {
		const res = await axios.get(`${BACK_END_ENDPOINT}/notification`, {
			params: {
				recipient: await AsyncStorage.getItem('userId')
			}
		});
		let notifs = res.data;
		
		// Filter out notifications that refer to non-existent users or artefacts
		notifs = notifs.filter(notif => notif.sender && notif.recipient && notif.artefact);
		
		// Sort notifications so the most recent one appears first
		notifs.sort((a, b) => moment(b.time).diff(moment(a.time)));
		setNotifications(notifs);
		setLoading(false);
	}

	useEffect(() => {
		fetchNotifications();
		// Fetch notifications whenever a new notification is received
		OneSignal.addEventListener('received', fetchNotifications);
	}, []);

	// List of notification when user received an item
	function renderItem({ item: { sender, artefact }, index }) {
		// If the notification refers to a non-existent sender or artefact
		if (!sender || !artefact) {
			return null;
		}
		return (
			<View style={styles.notifBox}>
				<TouchableOpacity
					onPress={() => navigate('NewProfile', { userId: sender._id })}>
					<Image
						source={{ uri: sender.pictureUrl || BLANK_PROFILE_PIC_URI }}
						style={styles.profPicStyle}
					/>
				</TouchableOpacity>
				<Text style={styles.sendDetails}>
					<Text style={styles.ownerStyle} onPress={() => navigate('NewProfile', { userId: sender._id })}>{sender.name}</Text>
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
				<Text style={styles.galleryTitle}>Notifications</Text>
			</LinearGradient>
			{
				isLoading ?
					<ActivityIndicator size="large" color="#EC6268" />
					:
					(
						<FlatList
							data={notifications}
							renderItem={renderItem}
							keyExtractor={item => item._id}
							ListEmptyComponent={(
								<>
									<Text style={styles.textStyle}>You don't have any notifications right now</Text>
									<Text style={styles.desc}>When someone sends you an artefact, you will see it here.</Text>
								</>
							)}
							refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
								setRefreshing(true);
								await fetchNotifications();
								setRefreshing(false);
							}} />}
						/>
					)
			}
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
		fontSize: 20,
		fontWeight: 'bold',
		flex: 1,
		flexWrap: 'wrap',
		textAlignVertical: 'center',
		textAlign: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		margin: 10,
		padding: 30,
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
	ownerStyle: {
		fontWeight: 'bold'
	},
	sendDetails: {
		flex: 1,
		fontSize: 16,
		flexWrap: 'wrap',
		textAlignVertical: 'center',
		margin: 10,
	}
});

NotificationScreen.navigationOptions = {
	title: 'Notification'
};