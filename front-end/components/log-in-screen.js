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
		return true;
	} catch (e) {
		console.trace(e);
		return false;
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
						if (await axiosLocal({ email, password })) {
							AsyncStorage.setItem('email', email);
							AsyncStorage.setItem('password', password);
							navigate('Home');
						} else {
							alert('Email or password is incorrect');
						}
					}}>
					<View style={styles.redButton}>
						<Text
							style={styles.whiteText}>
							Login</Text>
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
		flex: 1,
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
		justifyContent: 'space-evenly',
		textAlign: 'center',
		alignItems: 'center',
		paddingTop: '30%',
	},
	inputBox: {
		justifyContent: 'space-between',
		paddingVertical: '10%',
		paddingHorizontal: '10%',
	},
	buttonBox: {
		backgroundColor: '#fff',
		paddingVertical: '9%',
		justifyContent: 'space-between',
		flex: 1,
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
	redButton: {
		backgroundColor: '#EC6268',
		width: Dimensions.get('window').width / 1.75,
		height: Dimensions.get('window').width / 8,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
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
	},
}
);