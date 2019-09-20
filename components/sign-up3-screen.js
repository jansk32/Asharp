import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker, TouchableHighlight, ImagePicker,
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
	loginText: {
		fontSize: 30,
	},
	text: {
		fontSize: 20,
	},
	title: {
		fontSize: 20,
	},
	loginButtonText: {
		fontSize: 20,
		color: 'white',
	},
	loginBox: {
		justifyContent: 'space-evenly',
		textAlign: 'center',
		alignItems: 'center',
		paddingTop: 100,
		paddingBottom: 10,
	},
	inputBox: {
		justifyContent: 'space-between',
		padding: 40,
		// justifyContent: 'center',
	},
	loginButton: {
		backgroundColor: '#EC6268',
		borderColor: '#EC6268',
		borderWidth: 1,
		paddingVertical: 9,
		paddingHorizontal: 80,
		borderRadius: 20,
		justifyContent: 'center',
		alignSelf: 'center',
		marginBottom: 30,
	},
	signInButton: {
		backgroundColor: 'white',
		borderColor: '#EC6268',
		borderWidth: 1,
		paddingVertical: 8,
		paddingHorizontal: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignSelf: 'center',
		marginBottom: 20,
	},
	buttonBox: {
		backgroundColor: '#fff',
		marginTop: 40,
		// justifyContent:'space-between',
	},
	textInput: {
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 3,
		alignContent: 'center',
		marginTop: 10,
		padding: 5,
		paddingLeft: 10,
	},
	usernameBox: {
		marginBottom: 40,
	},
	imageStyle: {
		margin: 2,
		width: 400,
		height: 400,
		alignSelf: 'center',
		borderColor: 'black',
		borderWidth: 1,
	},
}
)

export default function SignUp3({ navigation }) {
	const { navigate } = navigation;
	const [image, setImage] = useState({});

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
		axios.post('http://localhost:3000/user/create', data);
	}

	async function finishSignUp() {
		const pictureUrl = await uploadImage(image.uri);
		try {
			await AsyncStorage.setItem('pictureUrl', pictureUrl);
		} catch (e) {
			ToastAndroid.show('Error storing picture URL', ToastAndroid.SHORT);
		}
		await uploadSignUpData();
		navigate('Home');
	}

	return (
		<>
			<ScrollView>
				<View style={styles.container}>
					<Text style={styles.title}>Picture preview</Text>
					<View style={styles.buttonBox}>
						<View style={styles.signInButton}>
							<TouchableHighlight
								onPress={async () => setImage(await pickImage())}>
								<Text
									style={styles.text}>
									Pick Picture
								</Text>
							</TouchableHighlight>
						</View>
						<Image source={image} style={styles.imageStyle} />

						<View style={styles.loginButton}>
							<TouchableHighlight
								onPress={finishSignUp}>
								<Text
									style={styles.loginButtonText}>
									Finish
								</Text>
							</TouchableHighlight>
						</View>
					</View>
				</View>
			</ScrollView>
		</>
	);
}