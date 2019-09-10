import React, { useState, useEffect } from 'react';
import { Text, StyleSheet,View, FlatList, Dimensions, Image, TouchableHighlight } from 'react-native';

const data = [
    { image: require('../tim_derp.jpg') },
    { image: require('../tim_derp.jpg') },
    { image: require('../tim_derp.jpg') },
    { image: require('../tim_derp.jpg') },
    { image: require('../tim_derp.jpg') },

    // { key: 'K' },
    // { key: 'L' },
  ];

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
  
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({ image: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
  
    return data;
  };

const numColumns =3;

export default function GalleryScreen({navigation}) {
    const navigate = navigation;
    renderItem = ({ item, index }) => {
        if (item.empty === true) {
          return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
        <View style={styles.item}>
            <TouchableHighlight 
                onPress={()=> {navigate('Home')}}>
                <Image 
                    style={styles.imageBox}
                    source = {item.image}
                />
            </TouchableHighlight>    
        </View>
        );
      };
    return (
        <>
        <View>
            <Text style={styles.header}>Memories left behind</Text>
        </View>
        <FlatList
            data={formatData(data,numColumns)}
            renderItem={this.renderItem}
            numColumns = {numColumns}
            style = {styles.container}
        />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical:20
    },
    header: {
      fontSize: 20,
      textAlign:'center',
      marginVertical:10
    },
    item: {
        //backgroundColor: '#4D243D',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
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