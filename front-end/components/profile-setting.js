import React, { useState, useEffect } from 'react';
import {
	Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Dimensions, Image, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
import { pickImage, uploadImage } from '../image-tools';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

import { BACK_END_ENDPOINT, BLANK_PROFILE_PIC_URI, DATE_FORMAT } from '../constants';

// import moment from 'moment';
moment.locale('en');

// Edit user details: Name, DOB, password, profile picture
export default function ProfileSettingScreen({ navigation }) {
	const { navigate } = navigation;
	// const handleProfileChange = navigation.getParam('handleProfileChange');
	const { setProfile } = navigation.state.params;

	const [user, setUser] = useState({});

	const [name, setName] = useState('');
	const [dob, setDob] = useState(moment());
	const [oldPassword, setOldPassword] = useState('');
	const [password, setPassword] = useState('');
	const [image, setImage] = useState({});
	const [isLoading, setLoading] = useState(true);
	const [showDatePicker, setShowDatePicker] = useState(false);


	// Validate name and new password
	function validateInput() {
		// Check if old password is the same as the new password
		if (password && user.password !== oldPassword) {
			alert('Old password does not match! >:)');
			return false;
		}
		else if (password && password.length < 6) {
			alert('Password must be at least 6 characters long');
			return false;
		}
		return true;
	}

	// Post profile
	// TODO: FIX ERROR -> AFTER CHANGING SETTING, RELOGIN THE PERSON
	async function updateProfile() {
		validateInput();
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
		}
		if (!image.uri.includes('firebase')) {
			const newImage = await uploadImage(image.uri);
			data.pictureUrl = newImage;
		}

		const userId = await AsyncStorage.getItem('userId');
		const res = await axios.put(`${BACK_END_ENDPOINT}/user/update/${userId}`, data);
		const updatedProfile = res.data;
		console.log(updatedProfile);
		setProfile(updatedProfile);
	}

	async function logout() {
		try {
			await axios.get(`${BACK_END_ENDPOINT}/logout`);
			await AsyncStorage.multiRemove(['email', 'password', 'userId']);
			OneSignal.removeExternalUserId();
			navigate('Welcome');
		} catch (e) {
			ToastAndroid.show('Error logging out', ToastAndroid.SHORT);
		}
	}

	// Get user details
	useEffect(() => {
		async function fetchProfile() {
			const res = await axios.get(`${BACK_END_ENDPOINT}/user/find/${await AsyncStorage.getItem('userId')}`);
			const user = res.data;
			console.log(user);
			setUser(user);
			setName(user.name);
			setDob(moment(user.dob, 'DD-MM-YYYY'));

			setImage({ uri: user.pictureUrl });
			setLoading(false);
		}
		fetchProfile();
	}, []);


	return (
		<ScrollView>
			<View style={styles.container}>
				<Image source={{ uri: image.uri || BLANK_PROFILE_PIC_URI }} style={styles.imageStyle} />
				{
					isLoading &&
					<ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
				}
				<View style={styles.buttonBox}>
					<TouchableOpacity
						onPress={async () => setImage(await pickImage())}>
						<View style={styles.picButton}>
							<Text
								style={styles.buttonText}>
								Pick Picture
			  					</Text>
						</View>
					</TouchableOpacity>
				</View>
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
						<TouchableOpacity onPress={() => setShowDatePicker(true)}>
							<Text style={{ borderWidth: 1, padding: 15 }}>{dob.format(DATE_FORMAT)}</Text>
						</TouchableOpacity>
						{showDatePicker &&
							<DateTimePicker
								value={dob.toDate()}
								maximumDate={moment().toDate()}
								onChange={(event, newDob) => {
									newDob = newDob || dob;
									setShowDatePicker(Platform.OS === 'ios' ? true : false);
									setDob(moment(newDob));
								}} />
						}

						{/* <DatePicker
							style={styles.dateInputs}
							date={dob || user.dob}
							mode="date"
							placeholder={moment(user.dob).format(DATE_FORMAT)}
							format={DATE_FORMAT}
							maxDate={moment().format(DATE_FORMAT)}
							confirmBtnText="Confirm"
							cancelBtnText="Cancel"
							androidMode="spinner"
							customStyles={{
								dateIcon: {
									position: 'absolute',
									left: 0,
									top: 4,
									marginLeft: 0
								},
								dateInput: {
									// borderColor: 'white',
								}
							}}
							showIcon={false}
							onDateChange={(dateStr, date) => setDob(moment(date))}
						/> */}
					</View>
					<View style={styles.inputElem}>
						<Text style={styles.text}>Old Password:</Text>
						<TextInput
							placeholder={'Enter Old Password'}
							secureTextEntry={true}
							onChangeText={setOldPassword}
							value={oldPassword}
							style={styles.textInput}
							autoCapitalize="none"
						/>
					</View>
					<View style={styles.inputElem}>
						<Text style={styles.text}> New Password:</Text>
						<TextInput
							placeholder='Enter New Password'
							secureTextEntry={true}
							onChangeText={setPassword}
							value={password}
							style={styles.textInput}
							autoCapitalize="none"
						/>
					</View>
				</View>
				<LinearGradient colors={['#c33764', '#1d2671']}
					start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
					style={styles.redButton}>
					<TouchableOpacity
						onPress={() => {
							updateProfile();
							navigate('Profile');
						}}>
						<Text
							style={styles.whiteText}>
							Save Changes
							</Text>
					</TouchableOpacity>
				</LinearGradient>
				<TouchableOpacity
					onPress={() => {
						Alert.alert('Delete profile', 'Are you sure you would like to delete your profile? You will lose all of your artefacts. This action cannot be undone.', [
							{
								text: 'Cancel'
							},
							{
								text: 'OK',
								onPress: async () => {
									setLoading(true);
									await axios.delete(`${BACK_END_ENDPOINT}/user/delete/${await AsyncStorage.getItem('userId')}`);
									setLoading(false);
									logout();
								},
							}
						])
					}}>
					<View style={styles.redButton}>
						<Text
							style={styles.whiteText}>
							Delete profile
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
	imageStyle: {
		margin: 2,
		marginTop: '10%',
		width: Dimensions.get('window').width / 3,
		height: Dimensions.get('window').width / 3,
		alignSelf: 'center',
		borderRadius: 20,
	},
	buttonBox: {
		backgroundColor: '#fff',
		marginTop: '5%',
		justifyContent: 'space-between',
		flex: 1,
		marginBottom: '7.5%',
	},
	container: {
		backgroundColor: 'white',
		flex: 1,
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	inputBox: {
		justifyContent: 'space-between',
		paddingHorizontal: 40,
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
		width: Dimensions.get('window').width / 2,
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