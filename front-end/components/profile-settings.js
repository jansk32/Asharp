import React, { useState, useEffect } from 'react';
import {
	Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Dimensions, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { uploadImage } from '../image-tools';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import DatePanel from './date-panel';

import { BACK_END_ENDPOINT } from '../constants';
import PictureFrame from './picture-frame';

moment.locale('en');

// Edit user details: Name, DOB, password, profile picture
export default function ProfileSettingsScreen({ navigation }) {
	const { navigate } = navigation;
	const { viewedUserId, setProfile } = navigation.state.params;
	const [user, setUser] = useState({});

	const [name, setName] = useState('');
	const [dob, setDob] = useState(moment());
	const [oldPassword, setOldPassword] = useState('');
	const [password, setPassword] = useState('');
	const [image, setImage] = useState({});
	const [isLoading, setLoading] = useState(true);
	const [isCurrentUser, setIsCurrentUser] = useState(false);

	// Validate name and new password
	function validatePassword() {
		// Check if old password is the same as the new password
		if (password && user.password !== oldPassword) {
			alert('Old password does not match! >:)');
			return false;
		} else if (password && password.length < 6) {
			alert('Password must be at least 6 characters long');
			return false;
		}
		return true;
	}

	async function updateProfile() {
		if (!validatePassword()) {
			return;
		}

		// Upload current image
		const data = {};
		if (name) {
			data.name = name;
		}
		if (dob) {
			data.dob = dob;
		}
		if (password) {
			data.password = password;
			await AsyncStorage.setItem('password', password);
		}
		if (!image.uri.includes('firebase')) {
			const newImage = await uploadImage(image.uri);
			data.pictureUrl = newImage;
		}

		const res = await axios.put(`${BACK_END_ENDPOINT}/user/update/${viewedUserId}`, data);
		const updatedProfile = res.data;
		console.log(updatedProfile);
		setProfile(updatedProfile);
		navigation.goBack();
	}

	async function logout() {
		try {
			await axios.get(`${BACK_END_ENDPOINT}/logout`);
			await AsyncStorage.multiRemove(['email', 'password', 'userId']);
			OneSignal.removeExternalUserId();
			navigate('Welcome');
		} catch (e) {
			ToastAndroid.show('Error logging out', ToastAndroid.LONG);
		}
	}

	// Get user details
	useEffect(() => {
		async function fetchProfile() {
			const currentUserId = await AsyncStorage.getItem('userId');
			if (currentUserId === viewedUserId) {
				setIsCurrentUser(true);
			}

			const res = await axios.get(`${BACK_END_ENDPOINT}/user/find/${viewedUserId}`);
			const user = res.data;
			console.log(user);

			setUser(user);
			setName(user.name);
			setDob(moment(user.dob));
			setImage({ uri: user.pictureUrl });
			setLoading(false);
		}
		fetchProfile();
	}, []);


	return (
		<ScrollView>
			<View style={styles.container}>
				<PictureFrame image={image} setImage={setImage} circular editable width={Dimensions.get('window').width / 3} height={Dimensions.get('window').width / 3} />
				{
					isLoading && <ActivityIndicator size="large" />
				}
				<View style={styles.inputBox}>
					<View style={styles.inputElem}>
						<Text style={styles.text}>Full Name:</Text>
						<TextInput
							placeholder={user.name}
							onChangeText={setName}
							value={name}
							style={styles.textInput}
						/>
					</View>

					<View style={styles.inputElem}>
						<Text style={styles.text}>Date of Birth:</Text>
						<DatePanel date={dob} setDate={setDob} isEditing={true} width={Dimensions.get('window').width / 2.5} />
					</View>

					{
						isCurrentUser &&
						(
							<>
								<View style={styles.inputElem}>
									<Text style={styles.text}>Old Password:</Text>
									<TextInput
										placeholder="Enter Old Password"
										secureTextEntry
										value={oldPassword}
										onChangeText={setOldPassword}
										style={styles.textInput}
										autoCapitalize="none"
									/>
								</View>
								<View style={styles.inputElem}>
									<Text style={styles.text}> New Password:</Text>
									<TextInput
										placeholder="Enter New Password"
										secureTextEntry
										value={password}
										onChangeText={setPassword}
										style={styles.textInput}
										autoCapitalize="none"
									/>
								</View>
							</>
						)
					}
				</View>
				<LinearGradient colors={['#c33764', '#1d2671']}
					start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
					style={styles.redButton}>
					<TouchableOpacity onPress={updateProfile}>
						<Text style={styles.whiteText}>
							Save Changes
						</Text>
					</TouchableOpacity>
				</LinearGradient>
				<TouchableOpacity
					onPress={() => {
						Alert.alert('Delete account', 'Are you sure you would like to delete this account? All currently owned artefacts will be lost. This action cannot be undone.', [
							{
								text: 'No'
							},
							{
								text: 'Yes',
								onPress: () => {
									async function task() {
										try {
											await axios.delete(`${BACK_END_ENDPOINT}/user/delete/${viewedUserId}`);
											if (isCurrentUser) {
												logout();
											} else {
												navigate('FamilyTree');
											}
										} catch (e) {
											ToastAndroid.show('Error deleting account', ToastAndroid.LONG);
										}
									}
									navigate('Loading', {loadingMessage: 'Deleting Account', task});
								},
							}
						])
					}}>
					<View style={styles.redButton}>
						<Text style={styles.whiteText}>
							Delete Account
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

// Stylesheets for formatting and designing layout
const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
	},
	text: {
		fontSize: 16,
		color: 'black',
		textAlign: 'center',
		justifyContent: 'center',
		marginTop: 10,
	},
	buttonText: {
		fontSize: 16,
		color: 'black',
		textAlign: 'center',
		justifyContent: 'center',
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	picButton: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#FBC074',
		width: Dimensions.get('window').width / 3,
		height: Dimensions.get('window').width / 11,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
		alignItems: 'center',
	},
	finishButton: {
		backgroundColor: '#FBC074',
		borderWidth: 1,
		borderColor: '#FBC074',
		width: Dimensions.get('window').width / 1.75,
		height: Dimensions.get('window').width / 8,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
	},
	header: {
		marginTop: 15,
		// alignItems: 'center',
	},
	buttonBox: {
		backgroundColor: '#fff',
		marginTop: '5%',
		justifyContent: 'space-between',
		flex: 1,
		marginBottom: '7.5%',
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	inputBox: {
		justifyContent: 'space-between',
		paddingHorizontal: 40,
		marginTop: 60,
		marginBottom: 40,
	},
	redButton: {
		backgroundColor: '#EC6268',
		width: Dimensions.get('window').width / 1.75,
		height: Dimensions.get('window').width / 8,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
		marginBottom: 20,
	},
	textInput: {
		borderColor: 'black',
		borderWidth: 0.5,
		borderRadius: 3,
		alignContent: 'center',
		padding: 5,
		paddingLeft: 10,
		width: Dimensions.get('window').width / 2.5,
	},
	dateInputs: {
		alignContent: 'center',
		width: Dimensions.get('window').width / 2,
	},
	inputElem: {
		marginBottom: 18,
		flexDirection: 'row',
		justifyContent: 'space-between',
	}
}
);