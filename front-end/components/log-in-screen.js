import React, { useState, useEffect } from 'react';
import {
	Text, View, StyleSheet, TextInput, TouchableOpacity, Dimensions,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';
import { BACK_END_ENDPOINT } from '../constants';


// Axios authentication
export async function axiosLocal(objData) {
	console.log(objData);
	try {
		const res = await axios.post(`${BACK_END_ENDPOINT}/login/local`, objData);
		AsyncStorage.setItem('userId', res.data._id);
		OneSignal.setExternalUserId(res.data._id);
		return res.status;
	} catch (e) {
		console.trace(e);
		if (e.response) {
			// Request was sent and got an error response
			return e.response.status;
		} else if (e.request) {
			// Request was unable to be sent
			return e.request.status;
		}
	}
}

export default function LoginScreen({ navigation }) {
	const { navigate } = navigation;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<View style={styles.container}>
			<View style={styles.loginBox}>
				<Text style={styles.loginText}>LOGIN</Text>
			</View>
			<View style={styles.inputBox}>
				<View style={styles.usernameBox}>
					<Text style={styles.text}>Email</Text>
					<View style={styles.textInput}>
						<TextInput
							placeholder="Enter Email"
							onChangeText={setEmail}
							autoCapitalize="none"
							keyboardType="email-address"
						/>
					</View>
				</View>
				<View style={styles.passwordBox}>
					<Text style={styles.text}>Password</Text>
					<View style={styles.textInput}>
						<TextInput
							placeholder="Enter Password"
							secureTextEntry={true}
							onChangeText={setPassword}
							autoCapitalize="none"
						/>
					</View>
				</View>
			</View>
			<View style={styles.buttonBox}>
				<TouchableOpacity
					onPress={async () => {
						const status = await axiosLocal({ email, password });
						if (status === 200) {
							AsyncStorage.setItem('email', email);
							AsyncStorage.setItem('password', password);
							navigate('Home');
						} else if (status === 400) {
							alert('Please fill in your email and password');
						} else if (status === 401) {
							alert('Email or password is incorrect');
						} else if (status === 0) {
							alert('Unable to connect to server');
						}
					}}>
					<View style={styles.redButton}>
						<Text style={styles.whiteText}>
							Login
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => navigate('SignUp1')}>
					<View style={styles.whiteButton}>
						<Text
							style={styles.buttonText}>
							Sign Up</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		// flex: 1,
	},
	loginText: {
		fontSize: 30,
	},
	text: {
		fontSize: 20,
	},
	buttonText: {
		fontSize: 20,
		textAlign: 'center',
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	loginBox: {
		textAlign: 'center',
		alignItems: 'center',
		paddingTop: '10%',
	},
	inputBox: {
		paddingVertical: '10%',
		paddingHorizontal: '10%',
	},
	buttonBox: {
		backgroundColor: '#fff',
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
		paddingBottom: 30,
	},
	redButton: {
		backgroundColor: '#EC6268',
		width: Dimensions.get('window').width / 1.75,
		height: Dimensions.get('window').width / 8,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: 30
	},
	whiteButton: {
		backgroundColor: 'white',
		borderColor: '#EC6268',
		borderWidth: 1,
		width: Dimensions.get('window').width / 1.75,
		height: Dimensions.get('window').width / 8,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: 20
	},
}
);