import React, { useState, useEffect } from 'react';
import {
	Text, View, StyleSheet, TextInput, TouchableOpacity
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
	},
	text: {
		fontSize: 18,
	},
	buttonText: {
		fontSize: 20,
		color: 'white',
	},
	inputBox: {
		justifyContent: 'space-between',
		padding: 40,
	},
	redButton: {
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
	textInput: {
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 3,
		alignContent: 'center',
		marginTop: 10,
		paddingLeft: 10,
	},
	inputElem: {
		marginBottom: 18,
	}
}
)

export default function LoginScreen({ navigation }) {
	const { navigate } = navigation;
	const [name, setName] = useState('');
	const [dob, setDob] = useState('');
	const [password, setPassword] = useState('');

	// axios + navigate ==> learn about cookies bruh
	function pressed(obj) {
		navigate('SignUp3');
		onPressedEffect(obj);
	}

	// axios
	// function onPressedEffect(body) {
	// 	axios.post("http://localhost:3000/user/create/2", {
	// 		name: body.name,
	// 		dob: body.dob,
	// 		userName: body.userName,
	// 		password: body.password
	// 	}
	// 	)
	// 	// useEffect(() => {
	// 	//   axios.get("http://localhost:3000/user/create/2", {
	// 	//     body :{
	// 	//       name: "LOL",
	// 	//       dob: "1976-03-04",
	// 	//       userName: body.userName,
	// 	//       password: body.password
	// 	//     }
	// 	//   })
	// 	// })
	// }

	return (
		<>
			<View style={styles.container}>
				<View style={styles.inputBox}>
					<View style={styles.inputElem}>
						<Text style={styles.text}>First Name</Text>
						<View style={styles.textInput}>
							<TextInput
								placeholder='Enter Full Name'
								onChangeText={setName}
								value={name}
							/>
						</View>
					</View>
					<View style={styles.inputElem}>
						<Text style={styles.text}>Date of Birth</Text>
						<View style={styles.textInput}>
							<TextInput
								placeholder='Enter DOB'
								onChangeText={setDob}
								value={dob}
							/>
						</View>
					</View>
					<View style={styles.inputElem}>
						<Text style={styles.text}>Password</Text>
						<View style={styles.textInput}>
							<TextInput
								placeholder='Enter Password'
								onChangeText={setPassword}
								value={password}
							/>
						</View>
					</View>
				</View>
				<View style={styles.redButton}>
					<TouchableOpacity
						onPress={() => pressed({ name, dob, password })}>
						<Text
							style={styles.buttonText}>
							Next
							</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
}