import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Text, ActivityIndicator, StyleSheet, View, Image, Dimensions, TouchableOpacity, Button } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/EvilIcons';
import moment from 'moment';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';
import { Assets } from 'react-navigation-stack';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider, withMenuContext, renderers } from 'react-native-popup-menu';
const { SlideInMenu } = renderers;

// Number 
const numColumns = 3;

// Array of images for the grid
const data = [
	{ image: require('../tim_derp.jpg') }, { image: require('../gg.png') },
];

// To format data
const formatData = (data, numColumns) => {

	const fullRowsNum = Math.floor(data.length / numColumns);

	let numberOfElementsLastRow = data.length - (fullRowsNum * numColumns);
	while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
		data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
		numberOfElementsLastRow++;
	}
	return data;
};

function useCurrentUser() {
	const [currentUser, setCurrentUser] = useState({});

	useEffect(() => {
		async function fetchCurrentUser() {
			const res = await axios.get('http://asharp-mementos.herokuapp.com/user', { withCredentials: true });
			setCurrentUser(res.data);
		}
		fetchCurrentUser();
	}, []);

	return currentUser;
}

function ProfileScreen({ navigation, ctx }) {
	const { navigate } = navigation;
	const [profile, setProfile] = useState({});
	const [artefact, setArtefact] = useState([]);
	const [hide, setHide] = useState(true);
	const currentUser = useCurrentUser();
	const userId = navigation.state.params ? navigation.state.params.userId : null;

	// Get profile details
	async function getProfile() {
		// console.log('Sending request');
		try {
			const res = await axios.get('http://localhost:3000/user/find/' + userId);
			setProfile(res.data);
		} catch (e) {
			console.error(e);
		}
	}

	// Get the artefacts of the user
	async function fetchArtefacts() {
		console.log('fetching artefacts');
		try {
			const res = await axios.get('http://asharp-mementos.herokuapp.com/artefact/findbyowner/' + userId);
			setArtefact(res.data);
			setHide(false);
		} catch (e) {
			console.log(e);
		}
	}

	async function fetchProfile() {
		if (profile === null || artefact.length < 1) {
			setHide(true);
		}
		await getProfile();
	}

	// Get profile and artefacts by owner
	useEffect(() => {
		fetchProfile();
		fetchArtefacts();
	}, [userId]);


	// Logout function
	async function logout() {
		try {
			await axios.get('http://asharp-mementos.herokuapp.com/logout');
			await AsyncStorage.multiRemove(['email', 'password']);
			OneSignal.removeExternalUserId();
			navigate('Welcome');
		} catch (e) {
			console.error(e);
		}
	}

	// Render Item invisible if it's just a placeholder for columns in the grid,
	// if not, render the picture for each grid
	renderItem = ({ item, index }) => {

		if (item.empty === true) {
			return <View style={[styles.itemBox, styles.invisibleItem]} />;
		}
		return (
			<View style={styles.itemBox}>
				<TouchableOpacity
					onPress={() => navigate('ItemDetail', { artefactId: item._id })}>
					<Image
						source={{ uri: item.file }}
						style={styles.imageBox} />
				</TouchableOpacity>
			</View>
		);
	};

	// Format date
	moment.locale('en');

	// Return the whole layout for profile
	return (
		<>
			<View style={styles.header}>
				<Text style={styles.profile}>Profile</Text>
				<View style={[styles.icon, { display: userId === currentUser._id ? 'flex' : 'none' }]}>
					<Icon name="navicon" size={40} color={'#2d2e33'}
						onPress={() => ctx.menuActions.openMenu('profileMenu')} />
					<Menu name="profileMenu" renderer={SlideInMenu}>
						<MenuTrigger>
						</MenuTrigger>
						<MenuOptions customStyles={{ optionText: styles.menuText, optionWrapper: styles.menuWrapper, optionsContainer: styles.menuStyle }}>
							<MenuOption onSelect={() => navigate('ProfileSetting', { setProfile })} text="Profile Setting" />
							<MenuOption onSelect={logout} text="Logout" />
						</MenuOptions>
					</Menu>
				</View>
			</View>
			<ActivityIndicator size="large" color="#0000ff" animating={hide === 'true'} />
			<ScrollView>
				<View style={styles.profileBox}>
					<Image
						source={{ uri: profile.pictureUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }}
						style={styles.image}
					/>
					<View style={styles.textBox}>
						<Text
							style={styles.nameText}>{profile.name}</Text>
						<Text
							style={styles.dob}>DOB: {moment(profile.dob).format('L')}</Text>
					</View>
				</View>
				<View style={styles.artefactsBox}>
					<Text style={styles.artText}>My Artefacts</Text>
					<FlatList
						data={formatData(artefact, numColumns)}
						keyExtractor={item => item._id}
						numColumns={3}
						renderItem={renderItem}
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
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
	},
	header: {
		flexDirection: 'row',
		paddingTop: 15,
		margin: 10,
	},

	profile: {
		fontSize: 30,
		fontWeight: 'bold',
		color: '#2d2e33',
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
		// flex: 1,
		padding: 8,
		marginLeft: 10,
		justifyContent: "center",
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
		paddingLeft: 10,
		paddingBottom: 10,
		paddingRight: 10,
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

export default withMenuContext(ProfileScreen);