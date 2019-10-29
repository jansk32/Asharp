import React, { useState, useEffect } from 'react';
import {
	Platform, Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Dimensions,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { DATE_FORMAT } from '../constants';

// import moment from 'moment';
moment.locale('en');

// Enter Name, Birthday and password.
export default function SignUp2({ navigation }) {
	const { navigate } = navigation;
	const [name, setName] = useState('');
	const [dob, setDob] = useState(moment());
	const [password, setPassword] = useState('');
	const [gender, setGender] = useState('');
	const [showDatePicker, setShowDatePicker] = useState(false);

	// Validate respective textinputs
	function validateInput() {
		if (!(name) || name === '') {
			alert('Please insert name');
			return false;
		}
		if (password.length < 6) {
			alert('Password must be at least 6 characters long');
			return false;

			// } else if (!(password.includes(/[-!$%^&*()_+|~=`{}[]:;'<>?,./]/))){
			// 	alert("must include one symbol");
			// 	return false;
		}
		if (gender.length < 1) {
			alert('Please select your gender');
			return false;
		}
		return true;
	}

	// Stores input in a temporary storage
	async function goToNextPage() {
		const data = { name, password, gender };
		data.dob = dob.format(DATE_FORMAT);
		if (validateInput()) {
			for (const key in data) {
				try {
					await AsyncStorage.setItem(key, data[key]);
				} catch (e) {
					ToastAndroid.show('Error storing ' + key, ToastAndroid.SHORT);
				}
			}
			navigate('SignUp3');
		} else {
			navigate('SignUp2');
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.inputBox}>
				<View style={styles.inputElem}>
					<Text style={styles.text}>Name</Text>
					<View style={styles.textInput}>
						<TextInput
							placeholder="Enter Full Name"
							onChangeText={setName}
							value={name}
						/>
					</View>
				</View>
				<View style={styles.inputElem}>
					<Text style={styles.text}>Date of Birth</Text>
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
				</View>
				<View style={styles.inputElem}>
					<Text style={styles.text}>Password</Text>
					<View style={styles.textInput}>
						<TextInput
							placeholder="Enter Password"
							secureTextEntry={true}
							onChangeText={setPassword}
							value={password}
							autoCapitalize="none"
						/>
					</View>
				</View>
				<View style={styles.gender}>
					<Text style={styles.text}>Gender: </Text>
					<View >
						<Text value={gender} onPress={() => setGender('m')} style={{ ...styles.genderButton, backgroundColor: gender === 'm' ? '#579B93' : '#a1a1a1' }}>
							Male
						</Text>
					</View>

					<View>
						<Text value={gender} onPress={() => setGender('f')} style={{ ...styles.genderButton, backgroundColor: gender === 'f' ? '#579B93' : '#a1a1a1' }}>
							Female
						</Text>
					</View>
				</View>
			</View>

			<TouchableOpacity
				onPress={goToNextPage}>
				<View style={styles.redButton}>
					<Text style={styles.whiteText}>
						Next
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}

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
	},
	gender: {
		// marginTop: 10,
		padding: 5,
		// paddingLeft: 10,
		// marginLeft: '5%',
		// marginRight: '5%', 
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 18,
	},
	genderButton: {
		borderWidth: 0,
		width: 80,
		height: 30,
		borderRadius: 50,
		textAlign: 'center',
		color: 'white',
		justifyContent: 'center',
		fontSize: 15,
		paddingTop: 3,
	},
});