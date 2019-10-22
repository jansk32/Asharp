import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView,
} from 'react-native';
import { pickImage } from '../image-tools';

export default function HomeScreen({ navigation }) {
	const { navigate } = navigation;
	const [image, setImage] = useState({});

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
					onPress={async () => {
						const myImage = await pickImage();
						const uri = myImage.uri;
						navigate('AddImageDetails', { uri });
					}}
					style={styles.uploadButton}>
					<Text
						style={styles.text}>
						Select Image
						</Text>
				</TouchableOpacity>
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