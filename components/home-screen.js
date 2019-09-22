import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Alert, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker, TouchableOpacity, Dimensions,
} from 'react-native';
import { throwStatement } from '@babel/types';
import { pickImage, uploadImage } from '../image-tools';
import AsyncStorage from '@react-native-community/async-storage';


const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
	},
	uploadImageTitle: {
		fontSize: 30,
		justifyContent: 'space-evenly',
		textAlign: 'center',
		alignItems: 'center',
		marginTop: '20%',
	},
	text: {
		fontSize: 20,
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
	},
	pickImageButton: {
		backgroundColor: 'white',
		borderColor: '#233439',
		borderWidth: 1,
		paddingVertical: 4,
		paddingHorizontal: 40,
		borderRadius: 10,
		justifyContent: 'center',
		alignSelf: 'center',
		marginBottom: 30,
	},
	uploadButton: {
		backgroundColor: '#579B93',
		borderColor: 'black',
		borderWidth: 1,
		paddingVertical: 4,
		paddingHorizontal: 40,
		borderRadius: 10,
		justifyContent: 'center',
		alignSelf: 'center',
	},
	imageStyle: {
		width: Dimensions.get('window').width * 0.95,
		height: Dimensions.get('window').width * 0.95,
		marginBottom: '4%',
		marginTop: '6%',
		alignSelf: 'center',
		borderColor: 'black',
		borderWidth: 1,
	},
}
);

export default function HomeScreen({ navigation }) {
	const { navigate } = navigation;
	const [condition, setCondition] = useState('');
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
				<Text style={styles.uploadImageTitle}>Upload Image!</Text>
				<Image source={image} style={styles.imageStyle} />
				
				<View style={styles.pickImageButton}>
					<TouchableOpacity
						onPress={async () => setImage(await pickImage())}>
						<Text 
						style={styles.text}>
							Pick Image
						</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.uploadButton}>
					<TouchableOpacity
						onPress= {upload}>
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