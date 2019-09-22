import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Alert, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker, TouchableOpacity,
} from 'react-native';
import { throwStatement } from '@babel/types';
import { pickImage, uploadImage } from '../image-tools';
import AsyncStorage from '@react-native-community/async-storage';


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
		paddingTop: 50,
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
	},
	imageStyle: { 
        margin: 2,
        width: 400,
        height: 400,
		alignSelf: 'center', 
		borderColor:'black', 
		borderWidth: 1, 
	},
}
);

export default function HomeScreen({ navigation }) {
	const { navigate } = navigation;
	const [condition, setCondition] = useState('');
	const [newMemento, setNewMemento] = useState({});
	const [image, setImage] = useState({});

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

    async function upload() {
        await uploadImageArtefact()
        .then(() => navigate('AddImageDetails'));
    }
	return (
		<>
			<View style={styles.container}>
				<View style={styles.loginBox}>
					<Text style={styles.title}>Upload Image</Text>
				</View>

				{/* Upload Image */}
				<View style={styles.whiteButton}>
					<TouchableOpacity
						onPress={async () => setImage(await pickImage())}>
						<Text style={styles.text}>Pick Image</Text>
					</TouchableOpacity>
				</View>

				<Image source={image} style={styles.imageStyle} />

				<View style={styles.whiteButton}>
					<TouchableOpacity
						onPress={upload}>
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