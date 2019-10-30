import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, ScrollView, ToastAndroid, TouchableOpacity, Dimensions,
} from 'react-native';
import axios from 'axios';
import { uploadImage } from '../image-tools';
import AsyncStorage from '@react-native-community/async-storage';
import DatePanel from './date-panel';
import moment from 'moment';
import { BACK_END_ENDPOINT } from '../constants';

moment.locale('en');


export default function UploadImageScreen({ navigation }) {
	const { navigate } = navigation;
	const { uri } = navigation.state.params;

	const [name, setName] = useState('');
	const [date, setDate] = useState(moment());
	const [description, setDescription] = useState('');
	const [value, setValue] = useState('');

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
			alert('Please describe the sentimental value');
			return false;
		}
		return true;
	}

	function createArtefact() {
		async function task() {
			const data = {
				name,
				date,
				description,
				value,
			};
			data.owner = await AsyncStorage.getItem('userId');
			try {
				data.file = await uploadImage(uri);
			} catch (e) {
				ToastAndroid.show('Error uploading image', ToastAndroid.LONG);
				navigation.goBack();
			}
			try {
				console.log(data);
				await axios.post(`${BACK_END_ENDPOINT}/artefact/create`, data);
				navigation.popToTop();
				navigate('Profile');
			} catch (e) {
				console.trace(e);
				ToastAndroid.show('Error uploading artefact', ToastAndroid.LONG);
				navigation.goBack();
			}
		}
		if (validateInput()) {
			navigate('Loading', { loadingMessage: 'Uploading Artefact', task });
		}
	}

	/* Render a form where the user can fill in their artefact's
	   name, date, description, and value */
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
						<Text style={styles.text}>Date:</Text>
						<DatePanel date={date} setDate={setDate} isEditing={true} width={Dimensions.get('window').width / 2} />
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
					<Text style={styles.whiteText}>
						Upload Artefact
					</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

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
);