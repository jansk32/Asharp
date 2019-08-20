import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Alert, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker
} from 'react-native';
import axios from 'axios';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import * as firebase from 'firebase';
import RNFetchBlob from 'rn-fetch-blob';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;


// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyC4JLE-2HExIPeHTFE0QZmOt7f6koxTqsE",
	authDomain: "mementos-7bca9.firebaseapp.com",
	databaseURL: "https://mementos-7bca9.firebaseio.com",
	projectId: "mementos-7bca9",
	storageBucket: "gs://mementos-7bca9.appspot.com/",
	messagingSenderId: "657679581397",
	appId: "1:657679581397:web:6dbc92e3aa881c59"
};
firebase.initializeApp(firebaseConfig);


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

function googleSignIn() {
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider);
	// firebase.auth().getRedirectResult().then(function (result) {
	// 	if (result.credential) {
	// 		var token = result.credential.accessToken;
	// 	}
	// 	var user = result.user;
	// }).catch(function (error) {

	// })
}


function HomeScreen({ navigation }) {
	const { navigate } = navigation;
	const [condition, setCondition] = useState('');
	const [newMemento, setNewMemento] = useState('');
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

	return (
		<>
			<Image source={image} style={{ height: 200, width: 200 }} />

			<Button
				title="Pick an image"
				onPress={() => {
					ImagePicker.showImagePicker(response => {
						if (!response.didCancel) {
							setImage({ uri: response.uri });
						}
					})
				}} />

			<Button
				title="Upload image"
				onPress={() => {
					uploadImage(image.uri);
				}} />

			<Button
				title='Go to profile screen'
				onPress={() => navigate('Profile', { name: 'Jane' })}
			/>

			<Button
				title="Log in"
				onPress={googleSignIn}
			/>

			<TextInput
				placeholder='Add a new memento'
				onChangeText={setNewMemento}
				value={newMemento}
			/>

			<Button
				title='Add memento'
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
				<Picker.Item label='new' value='new' />
				<Picker.Item label='used' value='used' />
			</Picker>

			<Text>{condition}</Text>

			<FlatList
				data={mementos}
				renderItem={({ item }) => <Text style={{ fontSize: 24, lineHeight: 40 }}>{item.name}</Text>}
				keyExtractor={(item, index) => item.id.toString()}
			/>
		</>
	);
}

HomeScreen.navigationOptions = {
	title: 'Welcome'
};


function ProfileScreen() {
	return (
		<>
			<Text style={{ fontSize: 42 }}>This is the profile screen</Text>
		</>
	);
}

ProfileScreen.navigationOptions = {
	title: 'Profile'
};


// Reference for starting out in RN
function SampleApp() {
	const [text, setText] = useState('');
	const [name, setName] = useState('');
	const styles = StyleSheet.create({
		blue: {
			color: 'blue',
			fontWeight: 'bold',
			fontSize: 30
		}
	});

	useEffect(() => {
		async function fetchData() {
			const res = await axios.get('https://reqres.in/api/users/2', {
				params: {
					delay: 4
				}
			});
			setName(res.data);
		}
		fetchData();
	}, []);

	return (
		<>
			<Text>{name ? JSON.stringify(name) : 'Loading'}</Text>
			<FlatList
				data={[...Array(50).keys()].map(e => ({ key: e.toString() }))}
				renderItem={({ item }) => <Text>{item.key}</Text>}
			/>

			<SectionList
				style={{ backgroundColor: 'pink', marginTop: 30 }}
				sections={[
					{ title: 'D', data: ['Devin'] },
					{ title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie'] }
				]}
				renderItem={({ item }) => <Text>{item}</Text>}
				renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
				keyExtractor={(item, index) => index}
			/>

			<ScrollView>
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, backgroundColor: 'powderblue' }}>
						<TextInput
							placeholder='Please type some text'
							onChangeText={setText}
							value={text}
							style={{ height: 40 }}
						/>
					</View>
					<View style={{ flex: 2, backgroundColor: 'skyblue' }}>
						<Text style={{ fontSize: 42 }}>{text.toUpperCase()}</Text>
					</View>
					<View style={{ flex: 3, backgroundColor: 'steelblue' }}>
						<Button
							title='my button'
							onPress={() => Alert.alert('Pressed the button')}
							color='green'
						/>
					</View>
				</View>
				<Text style={{ fontSize: 36 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
			</ScrollView>
		</>
	);
}


const MainNavigator = createStackNavigator({
	Home: { screen: HomeScreen },
	Profile: { screen: ProfileScreen }
});

const App = createAppContainer(MainNavigator);

export default App;