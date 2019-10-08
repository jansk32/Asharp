import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, ScrollView,
	ToastAndroid, TouchableOpacity, Dimensions
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { pickImage, uploadImage } from '../image-tools';


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
		marginBottom: 80,
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
		marginTop: '20%',
		width: Dimensions.get('window').width * 0.75,
		height: Dimensions.get('window').width * 0.75,
		alignSelf: 'center',
		borderColor: '#233439',
		borderWidth: 1,
		borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
	},
	buttonBox: {
		backgroundColor: '#fff',
		marginTop: '5%',
		justifyContent: 'space-between',
		flex: 1,
		marginBottom: '7.5%',
	},
}
)

// Upload profile picture page.
export default function SignUp3({ navigation }) {
	const { navigate } = navigation;
	const [image, setImage] = useState({});

	// Upload sign up data
	async function uploadSignUpData() {
		let dataKeys = ['email', 'name', 'dob', 'password', 'pictureUrl'];
		let data = {};
		for (const key of dataKeys) {
			try {
				data[key] = await AsyncStorage.getItem(key);
			} catch (e) {
				ToastAndroid.show('Error getting ' + key, ToastAndroid.SHORT);
			}
		}
		data.isUser = true;
		axios.post('http://localhost:3000/user/create', data);
	}

	// Automatically login to have give available acct details
	async function login() {
		  axios.post('http://localhost:3000/login/local',{
			email: await AsyncStorage.getItem('email'),
			password: await AsyncStorage.getItem('password')
		})
		.then((result) => navigate('Home'));
	}

	// Finish sign up and log in straight into the home page
	async function finishSignUp() {
		const pictureUrl = await uploadImage(image.uri);
		try {
			await AsyncStorage.setItem('pictureUrl', pictureUrl);
		} catch (e) {
			ToastAndroid.show('Error storing picture URL', ToastAndroid.SHORT);
		}
		await uploadSignUpData();
		await login()

	}

	return (
		<>
			<ScrollView>
				<View style={styles.container}>
					<Image source={image} style={styles.imageStyle} />
					<View style={styles.buttonBox}>
						<TouchableOpacity
							onPress={async () => setImage(await pickImage())}>
								<View style={styles.picButton}>
									<Text
									style={styles.text}>
									Pick Picture
									</Text>
								</View>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						onPress={finishSignUp}>
						<View style={styles.finishButton}>

							<Text
								style={styles.whiteText}>
								Finish
								</Text>
						</View>

					</TouchableOpacity>
				</View>
			</ScrollView>
		</>
	);
}