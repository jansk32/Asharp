import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import moment from 'moment';
import { BLANK_PROFILE_PIC_URI } from '../constants';
import { pickImage } from '../image-tools';
import Icon from 'react-native-vector-icons/Ionicons';

moment.locale('en');


export default function PictureFrame({ image, setImage, editable = false, circular = false, width = 200, height = 200 }) {
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			alignSelf: 'center',
			marginTop: 0.2 * height,
		},
		image: {
			width,
			height,
			borderRadius: circular ? 0.5 * width : null,
			borderWidth: 0.5,
			borderColor: 'black',
		},
		pickImageButton: {
			backgroundColor: 'aquamarine',
			borderRadius: 0.5 * 0.3 * width,
			width: 0.3 * width,
			height: 0.3 * height,
			position: 'absolute',
			top: 0.75 * height,
			left: 0.75 * width,
			alignItems: 'center',
			justifyContent: 'center',
		},
	});

	return (
		<View style={styles.container}>
			<Image source={Object.keys(image).length ? image : { uri: BLANK_PROFILE_PIC_URI }} style={styles.image} />
			{
				editable &&
				<View style={styles.pickImageButton}>
					<Icon name="md-camera" color="black" size={0.15 * width} onPress={async () => setImage(await pickImage())} />
				</View>
			}
		</View>
	);
}