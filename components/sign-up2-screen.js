import React, { useState, useEffect } from 'react';
import {
	Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Dimensions,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
	},
	text: {
		fontSize: 18,
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	inputBox: {
		justifyContent: 'space-between',
		padding: 40,
	},
	redButton: {
		backgroundColor: '#EC6268',
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
		paddingLeft: 10,
	},
	dateInput: {
		alignContent: 'center',
		marginTop: 10,
		width: 330,
	},
	inputElem: {
		marginBottom: 18,
	}
}
)

// Enter Name, Birthday and password.
export default function LoginScreen({ navigation }) {
	const { navigate } = navigation;
	const [name, setName] = useState('');
	const [dob, setDob] = useState('');
	const [password, setPassword] = useState('');

	async function goToNextPage() {
		const data = { name, dob, password }
		for (const key in data) {
			try {
				await AsyncStorage.setItem(key, data[key]);
			} catch (e) {
				ToastAndroid.show('Error storing ' + key, ToastAndroid.SHORT);
			}
		}
		navigate('SignUp3');
	}

	return (
		<>
			<View style={styles.container}>

				<View style={styles.inputBox}>
					<View style={styles.inputElem}>
						<Text style={styles.text}>Name</Text>
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

							<DatePicker
								style={styles.dateInput}
								date={dob}
								mode="date"
								placeholder="select date"
								format="YYYY-MM-DD"
								minDate="1900-01-01"
								maxDate="2019-01-01"
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								androidMode = "spinner"
								customStyles={{
									dateIcon: {
										position: 'absolute',
										left: 0,
										top: 4,
										marginLeft: 0
										},
										dateInput: {
										marginLeft: 36
										}
								}}
								onDateChange={setDob}
								value={dob}
      						/>
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
				<TouchableOpacity
					onPress={goToNextPage}>
					<View style={styles.redButton}>
						<Text
							style={styles.whiteText}>
							Next
							</Text>
					</View>
				</TouchableOpacity>
			</View>
		</>
	);
}