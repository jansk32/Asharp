import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView,
} from 'react-native';
import { pickImage } from '../image-tools';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { blockStatement } from '@babel/types';


export default function HomeScreen({ navigation }) {
	const { navigate } = navigation;
	const [image, setImage] = useState({});


	/*	A button for user to upload image, previews image, and a button to navigate 
	   to add details page */
	return (	
		<>
			<LinearGradient colors={['#8360c3', '#2ebf91']}
				start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
				style={styles.headerContainer}>
				<Text style={styles.title}>Welcome to</Text>
				<Text style={styles.uploadTitle}>Mementos</Text>
					</LinearGradient>

			
			
			{/* <Text style={{textAlign:'center', fontWeight:'bold'}}>MEMENTOS</Text> */}

			{/* <ScrollView> */}
			<View style={styles.background}>
				<Text style={styles.upload}>Upload Your Artefact Here!</Text>
				<View style={styles.imageStyle}>
					<Icon name="md-cloud-upload" size={150} color="black" />
					{/* <Icon name="cloud-upload" size={200} color="#f5f7fb" style={{alignSelf:'center', justifyContent:'center'}}/> */}
				<LinearGradient colors={['#06beb6', '#48b1bf']}
					start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
					style={styles.uploadButton}>
					<TouchableOpacity
						onPress={async () => {
							const myImage = await pickImage();
							const uri = myImage.uri;
							navigate('AddImageDetails', { uri });
						}}
					>
						<Text style={styles.text}>
							Select Image
						</Text>
					</TouchableOpacity>
				</LinearGradient>
				</View>
				</View>

				{/* <Image source={require('../upload-icon.png')} style={styles.imageStyle} /> */}
				
			{/* </ScrollView> */}
				{/* </View> */}
		</>
	);
}
/* Stylesheets for styles */
const styles = StyleSheet.create({
	background:{
		backgroundColor: 'white',
	},
	text: {
		fontSize: 20,
		textAlign: 'center',
		color: 'white'
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
		height: Dimensions.get('window').width / 7,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: 10,
	},
	imageStyle: {
		// width: Dimensions.get('window').width * 0.95,
		// height: Dimensions.get('window').width * 0.95,
		width: 300,
		height: 300,
		// marginBottom: 500,
		marginTop: 50,
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent:'center',
		borderRadius:25,
		backgroundColor: 'white',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		
		elevation: 5,
		// borderRadius:375,
		// borderColor:'black',
		// borderWidth:1,
	},
	title: {
		fontSize: 20,
		marginLeft: 10,
		color: 'white',
		paddingTop: '8%',
	},
	uploadTitle: {
		fontSize: 30,
		marginLeft: 10,
		fontWeight: 'bold',
		paddingBottom: '8%',
		color: 'white',
		// color: '#525151',
	},
	upload:{
		fontSize: 25,
		// fontWeight: 'bold',
		// paddingBottom: '8%',
		textAlign:'center',
		marginTop: 30,
	},
	headerContainer: {
		// borderBottomLeftRadius: 25,
		// borderBottomRightRadius: 25,
		backgroundColor: '#f5f7fb',
	},
}
);

HomeScreen.navigationOptions = {
	title: 'Home'
};