import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, FlatList, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import ItemDetailScreen from './item-detail-screen';
import axios from 'axios';
import downloadImage from '../image-tools';

const DummyData = [
    { 	
		_id: '0',
		profPic: require('../tim_derp.jpg'),
		sender: 'Timothy',
		artefactName: 'Himself',
		artefactPic: require('../tim_derp.jpg')
	}, 
	{ 
		_id: '0',
		profPic: require('../gg.png'),
		sender: 'Jansen',
		artefactName: 'Cat',
		artefactPic: require('../cat.jpg')
	 },
];

export default function NotificationScreen({ navigation }) {
	const { navigate } = navigation;
	const [artefacts, setArtefacts] = useState([]);
	
	// Make flatlist of notifications
	/* Notifications
		* When you recieve artefact
		* etc
	
    */
    
   renderItem = ({ item, index }) => {
        return (
            <View style={styles.notifBox}>
				<Image source={item.profPic}
					style={styles.profPicStyle}
				/>
				<Text style={styles.textStyle}>
                    <Text style={styles.ownerStyle}>{item.sender}</Text>
                    <Text> pass down an artefact, {item.artefactName} for you! </Text>
				</Text>
				
				<TouchableOpacity
					// onPress={() => navigate('ItemDetail', { artefactId: item._id })}>
					onPress={() => navigate('Home')}>
                    <Image
                        source={item.artefactPic}
                        style={styles.artefactPicStyle}
                    />
                </TouchableOpacity>
            </View>
        );
	};
    
	return (
		<>
			<View style={styles.headerContainer}>
				<Text style={styles.title}>View Updates</Text>
				<Text style={styles.galleryTitle}>Notification</Text>
			</View>
			<ScrollView>   
			<FlatList 
                data={DummyData}
                keyExtractor={item => item._id}
                renderItem={this.renderItem}
            />
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		marginLeft: 10,
		color: '#2d2e33',
		paddingTop: '8%',

	},
	galleryTitle: {
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
	notifBox:{
        flexDirection:'row',
		alignItems:'flex-start',
		justifyContent: 'space-between',
	},
	profPicStyle:{
        width: 50,
        height: 50,
        borderRadius: 100,
		marginVertical: 10,
		marginLeft: 15,
	},
    artefactPicStyle:{
        width: 50,
        height: 50,
		borderRadius:3,
		marginVertical: 10,
		marginHorizontal: 15,
    },
    textStyle:{
		fontSize: 16,
		flex:1,
		flexWrap:'wrap',
		textAlignVertical: 'center',
		margin: 10,
    },
    ownerStyle:{
        fontWeight:'bold'
    }
})
NotificationScreen.navigationOptions = {
	title: 'Notification'
}; 