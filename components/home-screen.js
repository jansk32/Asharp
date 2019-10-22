import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, ToastAndroid, Picker, TouchableOpacity, Dimensions, ScrollView,
} from 'react-native';
import { throwStatement } from '@babel/types';
import { pickImage, uploadImage } from '../image-tools';
import AsyncStorage from '@react-native-community/async-storage';

export default function HomeScreen({ navigation }) {
	const { navigate } = navigation;
	const [condition, setCondition] = useState('');
	const [image, setImage] = useState({});

	/*	Upload the pictures to database */
	async function uploadImageArtefact() {
		const pictureUrl = await uploadImage(image.uri);
		console.log(pictureUrl);
		try {
			await AsyncStorage.setItem('artefactPictureUrl', pictureUrl);
		} catch (e) {
			console.error(e);
			ToastAndroid.show('Error storing picture URL', ToastAndroid.SHORT);
		}
	}
	/*	Go to image detail page once you upload the picture */
	async function upload() {
		try {
			await uploadImageArtefact();
			navigate('AddImageDetails');
		} catch (e) {
			alert('Please select an Image to upload');
		}
	}
	/*	A button for user to upload image, previews image, and a button to navigate 
	   to add details page */
	return (
		<>
			<View style={styles.headerContainer}>
				<Text style={styles.title}>Mementos</Text>
				<Text style={styles.uploadTitle}>Upload Artefact</Text>
			</View>
			<ScrollView>
				<Image source={image} style={styles.imageStyle} />
				<TouchableOpacity
					onPress={async () => setImage(await pickImage())}
					style={styles.pickImageButton}>
					<Text
						style={styles.text}>
						Select Image
						</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={upload}
					style={styles.uploadButton}>
					<Text style={styles.whiteText}>Upload Image</Text>
				</TouchableOpacity>
				<Text>{condition}</Text>
			</ScrollView>
		</>
	);
}
/* Stylesheets for styles */
const styles = StyleSheet.create({
	text: {
		fontSize: 16,
		textAlign: 'center',
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	pickImageButton: {
		backgroundColor: 'white',
		borderColor: '#233439',
		borderWidth: .5,
		width: Dimensions.get('window').width / 1.75,
		height: Dimensions.get('window').width / 10,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
		marginBottom: 15,
	},
	uploadButton: {
		backgroundColor: '#579B93',
		width: Dimensions.get('window').width / 1.75,
		height: Dimensions.get('window').width / 8,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
	},
	imageStyle: {
		width: Dimensions.get('window').width * 0.95,
		height: Dimensions.get('window').width * 0.95,
		marginBottom: '4%',
		marginTop: '4%',
		alignSelf: 'center',
		borderColor: 'black',
		borderWidth: 0.5,
		borderRadius: 5,
	},
	title: {
		fontSize: 20,
		marginLeft: 10,
		color: '#2d2e33',
		paddingTop: '8%',
	},
	uploadTitle: {
		fontSize: 30,
		marginLeft: 10,
		fontWeight: 'bold',
		paddingBottom: '8%',
	},
	headerContainer: {
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		backgroundColor: '#f5f7fb',
	},
}
);

HomeScreen.navigationOptions = {
	title: 'Home'
};