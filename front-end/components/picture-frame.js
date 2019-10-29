import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, Image, Button, View, StyleSheet, ScrollView, TouchableOpacity,Dimensions, } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { BACK_END_ENDPOINT, BLANK_PROFILE_PIC_URI } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import { pickImage } from '../image-tools';
import Icon from 'react-native-vector-icons/Ionicons';


moment.locale('en');

export default function PictureFrame({ image, setImage, editable = false, circular = false, width = 200, height = 200 }) {
    return (
        <>
		<View style={styles.container}>
            <Image source={Object.keys(image).length ? image : { uri: BLANK_PROFILE_PIC_URI }}  style={{ width, height, borderRadius: circular ? 250 : null}} />
            {
				editable &&
				<View style={styles.pickImage}>
					<Icon name="md-camera" color="black" size={25} onPress={async () => setImage(await pickImage())}/>
					{/* <Button title="Pick image" onPress={async () => setImage(await pickImage())} /> */}
				</View>

			}
		</View>
        </>
	);
}


const styles = StyleSheet.create({
	image: {
		width: 100,
		height: 100,
		borderRadius: 125,
		marginTop: 20,
		marginLeft: 14,
		// marginRight: 10,
		marginBottom: 5,
		alignSelf: 'center',
		position:'absolute'
	},
	pickImage:{
		flexDirection:'row',
		justifyContent:'center',
		// alignSelf: 'flex-end',
		padding:5,
		backgroundColor:'red',
		borderRadius: 25,
		width: 40,
		height: 40,
		overflow:'hidden',
		marginTop: 20,
		// position: 'absolute',
		
	},
	container:{
		alignSelf:'center',
		alignItems:'center',
		justifyContent:'space-around',
		flexDirection: 'column',
		marginTop:20,
	},
});