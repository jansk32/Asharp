import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Text, ScrollView, StyleSheet, View, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import moment from 'moment';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Gallery from './gallery';

import Toast from 'react-native-simple-toast';


import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider, withMenuContext, renderers } from 'react-native-popup-menu';
const { SlideInMenu } = renderers;

// Environment variables
import { BACK_END_ENDPOINT, DATE_FORMAT } from '../constants';
import PictureFrame from './picture-frame';


function ProfileScreen({ navigation, ctx }) {
	const { navigate } = navigation;
	const [viewedUser, setViewedUser] = useState('');
	const [artefacts, setArtefacts] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [canChangeSettings, setCanChangeSettings] = useState(false);
	const [isCurrentUser, setIsCurrentUser] = useState(false);


	async function logout() {
		try {
			await axios.get(`${BACK_END_ENDPOINT}/logout`);
			await AsyncStorage.multiRemove(['email', 'password', 'userId']);
			OneSignal.removeExternalUserId();
			navigate('Welcome');
		} catch (e) {
			Toast.show('Error logging out');
		}
	}

	// Get profile and artefacts by owner
	useEffect(() => {
		async function fetchViewedUser() {
			try {
				setLoading(true);
				const currentUserId = await AsyncStorage.getItem('userId');
				console.log(currentUserId);
				let viewedUserId;
				if (navigation.state.routeName === 'NewProfile') {
					viewedUserId = navigation.state.params.userId;
					if (viewedUserId === currentUserId) {
						setCanChangeSettings(true);
						setIsCurrentUser(true);
					}
				} else {
					viewedUserId = await AsyncStorage.getItem('userId');
					setCanChangeSettings(true);
					setIsCurrentUser(true);
				}
				const res = await axios.get(`${BACK_END_ENDPOINT}/user/find/${viewedUserId}`);
				setViewedUser(res.data);
				if (!res.data.isUser) {
					setCanChangeSettings(true);
				}
				console.log('profile is', res.data.name);
				console.log('profile id is', res.data._id);
				setLoading(false);
			} catch (e) {
				console.trace(e);
			}
		}
		fetchViewedUser();
	}, []);

	async function fetchArtefacts() {
		try {
			setLoading(true);
			const res = await axios.get(`${BACK_END_ENDPOINT}/artefact/findbyowner/${viewedUser._id}`);
			setArtefacts(res.data);
			setLoading(false);
		} catch (e) {
			console.trace(e);
		}
	}

	// Update artefacts according to fetched profile
	useEffect(() => {
		fetchArtefacts();
	}, [viewedUser]);

	// Update canChangeSettings once currentUser is loaded
	// useEffect(() => {
	// 	if (!userId) {
	// 		// No userId from navigation, this means the screen was opened from bottom tab
	// 		// So the viewed user is the current user
	// 		setCanChangeSettings(true);
	// 		setIsCurrentUser(true);
	// 		alert('no user id');
	// 	} else if (userId === currentUserId._id) {
	// 		// Viewed user is the same as the current user
	// 		setCanChangeSettings(true);
	// 		setIsCurrentUser(true);
	// 		alert('same as current user');
	// 	} else if (viewedUser && !viewedUser.isUser) {
	// 		// Anyone can edit or delete the dummy user
	// 		setCanChangeSettings(true);
	// 		alert('is dummy');
	// 	}
	// }, [currentUserId, viewedUser]);


	// Format date
	moment.locale('en');

	// Return the whole layout for profile
	return (
		<>
			{/* <View style={styles.header}> */}
			<LinearGradient colors={['#4568dc', '#b06ab3']}
				start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
				style={styles.header}>

				<Text style={styles.profile}>Profile</Text>
				{
					canChangeSettings &&
					<View style={styles.icon}>
						<Icon name="navicon" size={40} color={'white'}
							onPress={() => ctx.menuActions.openMenu('profileMenu' + navigation.state.routeName)} />
						<Menu name={'profileMenu' + navigation.state.routeName} renderer={SlideInMenu}>
							<MenuTrigger>
							</MenuTrigger>
							<MenuOptions customStyles={{ optionText: styles.menuText, optionWrapper: styles.menuWrapper, optionsContainer: styles.menuStyle }}>
								<MenuOption onSelect={() => navigate('ProfileSettings', { viewedUserId: viewedUser._id, setProfile: setViewedUser })} text="Profile Settings" />
								{
									isCurrentUser && <MenuOption onSelect={logout} text="Logout" />
								}
							</MenuOptions>
						</Menu>
					</View>
				}
			</LinearGradient>

			<ScrollView>
				<View style={styles.profileBox}>
					<PictureFrame
						image={{ uri: viewedUser.pictureUrl }}
						circular
						width={100}
						height={100} />
					<View style={styles.textBox}>
						<Text style={styles.nameText}>
							{viewedUser.name}
						</Text>
						<Text style={styles.dob}>
							{viewedUser.dob && 'DOB: ' + moment(viewedUser.dob).format(DATE_FORMAT)}
						</Text>
					</View>
				</View>
				<View style={styles.artefactsBox}>
					<Text style={styles.artText}>My Artefacts</Text>
					<Gallery
						artefacts={artefacts}
						isLoading={isLoading}
						navigation={navigation}
						refresh={fetchArtefacts}
					/>
				</View>
			</ScrollView>
		</>
	);
}

// Stylesheets to format the layout of the page
const styles = StyleSheet.create({
	profileBox: {
		backgroundColor: '#f5f7fb',
		// borderBottomLeftRadius: 25,
		// borderBottomRightRadius: 25,
	},
	header: {
		flexDirection: 'row',
		padding: 15,
		paddingTop: Platform.OS === 'ios' ? 60 : 15,
	},

	profile: {
		fontSize: 30,
		fontWeight: 'bold',
		color: 'white',
		alignItems: 'flex-start',
		paddingLeft: 10,
	},

	icon: {
		alignItems: 'flex-end',
		flex: 3,
		paddingRight: 20,
		paddingTop: 5,
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 125,
		marginTop: 14,
		marginLeft: 14,
		marginRight: 10,
		marginBottom: 5,
		alignSelf: 'center',
	},
	imageBox: {
		margin: 1,
		width: Dimensions.get('window').width / 3.2,
		height: Dimensions.get('window').width / 3.2,
	},
	textBox: {
		padding: 8,
		justifyContent: 'center',
		alignSelf: 'center',
	},
	itemBox: {
		backgroundColor: '#FAFAFA',
		alignItems: 'center',
	},
	itemText: {
		color: 'black',
		justifyContent: "center",
		alignSelf: 'center',
	},
	buttonText: {
		fontSize: 15,
	},
	nameText: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	dob: {
		fontSize: 15,
		textAlign: 'center',
	},
	artefactsBox: {
		backgroundColor: '#fff',
		paddingTop: 20,
	},
	artText: {
		justifyContent: 'center',
		marginBottom: 18,
		marginLeft: 12,
		fontSize: 16,
	},
	container: {
		margin: 20,
	},
	invisibleItem: {
		backgroundColor: 'transparent',
	},
	menuStyle: {
		borderTopEndRadius: 20,
		borderTopStartRadius: 20,
		borderColor: '#f5f7fb',
		backgroundColor: '#f5f7fb',
		borderWidth: 0.5,
		paddingTop: 20,
		justifyContent: 'space-between',
		paddingBottom: 80,
	},
	menuWrapper: {
		paddingVertical: 15,
		borderBottomColor: '#2d2e33',
		borderBottomWidth: 0.5,
		marginHorizontal: 50,
	},
	menuText: {
		textAlign: 'left',
		fontSize: 20,
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

export default withMenuContext(ProfileScreen);