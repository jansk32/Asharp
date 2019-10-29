import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, Image, Button, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { BACK_END_ENDPOINT } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import { pickImage } from '../image-tools';

moment.locale('en');

export default function PictureFrame({ image, setImage, editable = false, circular = false, width = 200, height = 200 }) {
    return (
        <>
            <Image source={image} style={{ width, height, borderRadius: circular ? 125 : null, alignSelf: 'center', margin: 10 }} />
            {
                editable &&
                <Button title="Pick image" onPress={async () => setImage(await pickImage())} />
            }
        </>
    );
}

const styles = StyleSheet.create({
	image: {
		width: 100,
		height: 100,
		borderRadius: 125,
		marginTop: 14,
		marginLeft: 14,
		marginRight: 10,
		marginBottom: 5,
		alignSelf: 'center',
	},
});