import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Alert, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker, TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import * as firebase from 'firebase';
import axios from 'axios';
import { throwStatement } from '@babel/types';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

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
	whiteText: {
		fontSize: 20,
		color: 'white',
	},
	loginBox: {
		justifyContent: 'space-evenly',
		textAlign: 'center',
		alignItems: 'center',
		paddingTop: 100,
		paddingBottom: 10,
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
	whiteButton: {
		backgroundColor: 'white',
		borderColor: '#EC6268',
		borderWidth: 1,
		paddingVertical: 9,
		paddingHorizontal: 70,
		borderRadius: 20,
		justifyContent: 'center',
		alignSelf: 'center',
	},
	buttonBox: {
		backgroundColor: '#fff',
		marginTop: 40,
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

async function uploadImage(uri) {
	const mime = 'image/jpg';
	const uploadUri = uri;
	const sessionId = new Date().getTime();
	let uploadBlob = null;
	const imageRef = firebase.storage().ref('images').child(sessionId.toString());

	const data = await fs.readFile(uploadUri, 'base64');
	const blob = await Blob.build(data, { type: `${mime};BASE64` });
	uploadBlob = blob;
	await imageRef.put(blob, { contentType: mime });
	uploadBlob.close();
	const url = await imageRef.getDownloadURL();
	console.log(url);
	ToastAndroid.show('Image uploaded', ToastAndroid.SHORT);
}

async function downloadImage(filename) {
	const imageRef = firebase.storage().ref('images/test.jpg');
}

export default function HomeScreen({ navigation }) {
	const { navigate } = navigation;
	const [condition, setCondition] = useState('');
	const [newMemento, setNewMemento] = useState({});
	const [image, setImage] = useState({});

	return (
		<>
			<View style={styles.container}>
				<View style={styles.loginBox}>
					<Text style={styles.title}>Upload Image</Text>
				</View>

				{/* Upload Image */}
				<View style={styles.whiteButton}>
					<TouchableOpacity
						onPress={() => {
							ImagePicker.showImagePicker(response => {
								if (!response.didCancel) {
									setImage({ uri: response.uri });
								}
							})
						}}>
						<Text styls={styles.text}>Pick Image</Text>
					</TouchableOpacity>
				</View>

				<Image source={image} style={{ height: 200, width: 200, alignSelf: 'center', borderColor:'black', borderWidth: 1, }} />

				<View style={styles.redButton}>
					<TouchableOpacity
						onPress={() => {
							uploadImage(image.uri);
						}}>
						<Text style={styles.text}>Upload Image</Text>
					</TouchableOpacity>
				</View>

				<Text>{condition}</Text>
			</View>
		</>
	);
}



HomeScreen.navigationOptions = {
	title: 'Home'
};