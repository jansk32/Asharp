import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, ScrollView, ToastAndroid, TouchableOpacity, Dimensions,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import axios from 'axios';
import { pickImage, uploadImage } from '../image-tools';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import { BACK_END_ENDPOINT, DATE_FORMAT } from '../constants';

// Import date formatting module moment.js
moment.locale('en');

export default function UploadImageScreen({ navigation }) {
	const { navigate } = navigation;
	const { uri } = navigation.state.params;
	const [description, setDescription] = useState('');
	const [value, setValue] = useState('');
	const [name, setName] = useState('');
	const [date, setDate] = useState(moment());
	const [showDatePicker, setShowDatePicker] = useState(false);

	//   useEffect(() => {
	//     // createArtefact();
	//     console.log("I am in the add image details screen");
	//     // console.log(await AsyncStorage.getItem('artefactPictureUrl'));
	//     // setImage(downloadImage());
	// },[]);

	// Function to create artefact
	async function createArtefact() {
		// let dataKeys = ['value', 'name', 'date', 'description','pictureUrl'];
		const data = {
			name,
			date,
			value,
			description,
		};
		data.owner = await AsyncStorage.getItem('userId');
		if (validateInput()) {
			try {
				data.file = await uploadImage(uri);
				// setImage(data.file);
			} catch (e) {
				ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
			}
			try {
				console.log(data);
				await axios.post(`${BACK_END_ENDPOINT}/artefact/create`, data);
				navigation.popToTop();
				navigate('Profile', { shouldRefreshArtefacts: true });
			} catch (e) {
				console.log(e);
			}
		} else {
			navigate('AddImageDetails');
		}
	}

	// Validate input of the item details
	function validateInput() {
		if (!name) {
			alert('Please input a name');
			return false;
		}
		if (!description) {
			alert('Please give a small description');
			return false;
		}
		if (!value) {
			alert('No value inputed');
			return false;
		}
		return true;
	}

	// Initialise image
	// async function getImage() {
	// 	// const file = await AsyncStorage.getItem('artefactPictureUrl');
	// 	setImage({ uri });
	// 	console.log(file);
	// }

	// Get image to show on the screen
	// useEffect(() => {
	// 	setLoad(false);
	// 	getImage();
	// 	setLoad(true);
	// }, []);

	/* Returns a form where the user can fill in their artefacts
	   name, description and value. */
	return (
		<ScrollView>
			<View style={styles.container}>
				<Image
					source={{ uri }}
					style={styles.imageStyle}
				/>
				<View style={styles.inputBox}>
					<View style={styles.inputElem}>
						<Text style={styles.text}>Item Name:</Text>
						<TextInput
							placeholder='Enter Item Name'
							onChangeText={setName}
							style={styles.textInputUpper}
						/>
					</View>
					<View style={styles.inputElem}>
						{/* <Text style={styles.text}>Date:</Text>
						<DatePicker
							style={styles.dateInputs}
							date={date}
							mode="date"
							placeholder="Select date"
							format="YYYY-MM-DD"
							maxDate={moment().format('DD-MM-YYYY')}
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
									marginLeft: 0
								}
							}}
							showIcon={false}
							onDateChange={setDate}
							value={date}
						/> */}
						<Text style={styles.text}>Date:</Text>
						<TouchableOpacity onPress={() => setShowDatePicker(true)}>
							<Text style={{ borderWidth: 1, padding: 15 }}>{date.format(DATE_FORMAT)}</Text>
						</TouchableOpacity>
						{showDatePicker &&
							<DateTimePicker
								value={date.toDate()}
								maximumDate={moment().toDate()}
								onChange={(event, newDate) => {
									newDate = newDate || date;
									setShowDatePicker(Platform.OS === 'ios' ? true : false);
									setDate(moment(newDate));
								}} />
						}
					</View>
					<Text style={styles.text}>Description</Text>
					<TextInput
						placeholder='Describe the item.'
						onChangeText={setDescription}
						multiline={true}
						style={styles.textInput}
					/>
					<Text style={styles.text}>Value</Text>
					<TextInput
						placeholder='Write down the value and memory this item holds.'
						onChangeText={setValue}
						multiline={true}
						style={styles.textInput}
					/>
				</View>
				<TouchableOpacity
					onPress={createArtefact}
					style={styles.redButton}>
					<Text
						style={styles.whiteText}>
						Upload Artefact</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

// Stylesheets for styles
const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
	},
	text: {
		fontSize: 16,
		color: 'black',
		justifyContent: 'center',
		marginTop: 10,
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
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
		borderWidth: 0.5,
		borderRadius: 3,
		marginTop: 10,
		height: 100,
		paddingLeft: 10,
		textAlignVertical: 'top',
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row',
	},
	textInputUpper: {
		borderColor: 'black',
		borderWidth: 0.5,
		borderRadius: 3,
		alignContent: 'center',
		padding: 5,
		paddingLeft: 10,
		width: Dimensions.get('window').width / 2,
	},
	imageStyle: {
		width: Dimensions.get('window').width / 2,
		height: Dimensions.get('window').width / 2,
		margin: 20,
		alignSelf: 'center',
		borderRadius: 5,
	},
	inputElem: {
		marginBottom: 18,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	dateInputs: {
		alignContent: 'center',
		width: Dimensions.get('window').width / 2,
	},
	inputBox: {
		justifyContent: 'space-between',
		paddingHorizontal: 40,
		marginBottom: 20,
	},
}
)