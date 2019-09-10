import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Alert, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker
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
	const [mementos, setMementos] = useState([
		{
			id: 0,
			name: 'Harmonicas'
		},
		{
			id: 1,
			name: 'Letter'
		},
		{
			id: 2,
			name: 'Photo'
		}
	]);
	const [image, setImage] = useState({});

	useEffect(() => {
		axios.get('http://localhost:3000/artefact', {
			body: {
				name: "vase"
			}
		})
		.then((resp) => {
			console.log(resp.data[0]);
			setMementos(resp.data);
		})
		.catch((err) =>{
			console.log(err);
		})
	})

	return (
		<>
			<Button
				title="Logout"
				onPress={() => {
					navigate('Welcome');
				}}
			/>
			<Button
				title="Pick an image"
				onPress={() => {
					ImagePicker.showImagePicker(response => {
						if (!response.didCancel) {
							setImage({ uri: response.uri });
						}
					})
				}} />

			<Image source={image} style={{ height: 200, width: 200 }} />

			<Button
				title="Upload image"
				onPress={() => {
					uploadImage(image.uri);
				}} />

			<TextInput
				placeholder="Add a new memento"
				onChangeText={setNewMemento}
				value={newMemento}
			/>

			<Button
				title="Add memento"
				onPress={() => {
					setMementos(mementos.concat({ id: mementos.length, name: newMemento }));
					ToastAndroid.show('Memento added', ToastAndroid.SHORT);
					setNewMemento('');
				}
				}
			/>

			<Picker
				selectedValue={condition}
				onValueChange={(value, index) => setCondition(value)}
			>
				<Picker.Item label="new" value='new' />
				<Picker.Item label="used" value='used' />
			</Picker>

			<Text>{condition}</Text>

			<FlatList
				data={mementos}
				renderItem={({ item }) => <Text style={{ fontSize: 24, lineHeight: 40 }}>{item.name}</Text>}
				keyExtractor={(item, index) => item.id}
			/>
		</>
	);
}

HomeScreen.navigationOptions = {
	title: 'Home'
};