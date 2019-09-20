import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker, TouchableOpacity, ImagePicker, Dimensions
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
		fontSize: 18,
		color: 'black',
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
	},
	picButton: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#FBC074',
		paddingHorizontal: 26,
		paddingVertical: 3,
		borderRadius: 20,
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: 20,
		marginBottom: 80,

	},
	finishButton: {
		backgroundColor: '#FBC074',
		borderWidth: 1,
		borderColor: '#FBC074',
		paddingVertical: 9,
		paddingHorizontal: 80,
		borderRadius: 20,
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
}
)

export default function SignUp3({ navigation }) {
	const { navigate } = navigation;
	const [image, setImage] = useState({});

	async function uploadSignUpData() {
		let dataKeys = ['email', 'userName', 'name', 'dob', 'password', 'pictureUrl'];
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
					<Image source={image} style={styles.imageStyle} />
					<View style={styles.picButton}>
					<TouchableOpacity
							onPress={async () => setImage(await pickImage())}>
							<Text
								style={styles.textButton}>
								Pick Picture
								</Text>
						</TouchableOpacity>
					</View>
					
					<View style={styles.finishButton}>
						<TouchableOpacity
							onPress={finishSignUp}>
							<Text
								style={styles.whiteText}>
								Finish
								</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</>
	);
}