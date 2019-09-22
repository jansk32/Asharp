import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, Dimensions,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
	},
	title: {
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
	signUpBox: {
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
		justifyContent: 'space-evenly',
		paddingVertical: '9%',
		flex: 1,
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
	textInput: {
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 3,
		alignContent: 'center',
		marginTop: 10,
		padding: 2,
		paddingLeft: 10,
	},
	inputElem: {
		marginBottom: 40,
	}
}
)

export default function LoginScreen({ navigation }) {
	const { navigate } = navigation;
	const [email, setEmail] = useState('');

	async function storeEmail() {
		try {
			await AsyncStorage.setItem('email', email);
			ToastAndroid.show('Stored email', ToastAndroid.SHORT);
		} catch (e) {
			ToastAndroid.show('Error storing email', ToastAndroid.SHORT);
		}
	}

	// so that sign in screen signups and sends axios req
	async function goToNextPage() {
		await storeEmail();
		navigate('SignUp2');
	}

	return (
		<>
			<View style={styles.container}>
				<View style={styles.signUpBox}>
					<Text style={styles.title}>Sign Up</Text>
				</View>
				<View style={styles.inputBox}>
					<View style={styles.inputElem}>
						<Text style={styles.text}>Email</Text>
						<View style={styles.textInput}>
							<TextInput
								placeholder="Enter Email"
								onChangeText={setEmail}
								value={email}
							/>
						</View>
					</View>
				</View>
				<View style={styles.buttonBox}>
					<TouchableOpacity
						onPress={goToNextPage}>
						<View style={styles.redButton}>
							<Text
								style={styles.whiteText}>
								Next
								</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => navigate('Welcome')}>
						<View style={styles.whiteButton}>

							<Text
								style={styles.buttonText}>
								Back
								</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
}