import React, { useState, useEffect } from 'react';
import { Text, StyleSheet,View, FlatList, Dimensions, Image, TouchableHighlight } from 'react-native';
import ItemDetailScreen from './item-detail-screen';
import axios from 'axios';
import downloadImage from '../image-tools';

// Format how the grid is going to be shown
const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
  
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
    	numberOfElementsLastRow !== numColumns &&
    	numberOfElementsLastRow !== 0
    ) {
    	data.push({key: `blank-${numberOfElementsLastRow}`, empty: true });
    	numberOfElementsLastRow++;
    }
	return data;
};

const numColumns = 3;

export default function GalleryScreen({navigation}) {
    const {navigate} = navigation;
    const [artefacts, setArtefacts] = useState([]);

    // Get all the artefact
    useEffect(() => {
		async function fetchArtefacts() {
			try {
				const res = await axios.get('http://localhost:3000/artefact');
				setArtefacts(res.data);
				// console.log(res.data)
			} catch (e) {
				console.error(e);
			}
		}
		fetchArtefacts();
	}, []);

	// Render Item invisible if it's just a placeholder for columns in the grid,
    // if not, render the picture for each grid
    renderItem = ({ item, index }) => {
        if (item.empty) {
          return <View style={[styles.item, styles.itemInvisible]} />;
		}
        return (
        <View style={styles.item}>
            <TouchableHighlight onPress={() => navigate('ItemDetail', {artefactId: item._id}) }>
                <Image
                    style={styles.imageBox}
                    source={{uri: item.file}}
                />
            </TouchableHighlight>    
        </View>
    	);
	}
	
    return (
        <>
        <View style={styles.headerContainer}>
            <Text style={styles.title}>Memories Left Behind</Text>
            <Text style={styles.galleryTitle}>Gallery</Text>
        </View>
        <FlatList
			data={formatData(artefacts, numColumns)}
            keyExtractor={(item, index) => item._id}
            renderItem={renderItem}
            numColumns={numColumns}
            style={styles.container}
        />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20
    },
    header: {
      fontSize: 20,
      textAlign:'center',
      marginVertical:10
    },
    title:{
        fontSize: 20,
		marginLeft:10,
		color:'#2d2e33',
        paddingTop:'8%',
        
    },
    galleryTitle:{
		fontSize: 30,
		marginLeft:10,
		fontWeight:'bold',
        paddingBottom:'8%',
    },
    headerContainer:{
		borderBottomLeftRadius:25,
		borderBottomRightRadius:25,
        backgroundColor:'#f5f7fb',
	},
    item: {
        //backgroundColor: '#4D243D',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft:10,
        marginRight:10,
        height: Dimensions.get('window').width / numColumns, // approximate a square
      },
      itemInvisible: {
        backgroundColor: 'transparent',
      },
      itemText: {
        color: '#fff',
      },
      imageBox:{
        height: Dimensions.get('window').width / numColumns, // approximate a square
        flex: 1,
        margin: 1,
        width: Dimensions.get('window').width / numColumns,
      }
  })
  

GalleryScreen.navigationOptions = {
    title: 'Gallery'
};