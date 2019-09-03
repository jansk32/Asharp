import React, { useState, useEffect } from 'react';
import { Text, StyleSheet,View, FlatList, Dimensions } from 'react-native';

const data = [
    { key: 'A' },
    { key: 'B' },
    { key: 'C' },
    { key: 'D' },
    { key: 'E' },
    { key: 'F' },
    { key: 'G' },
    { key: 'H' },
    { key: 'I' },
    { key: 'J' },
    // { key: 'K' },
    // { key: 'L' },
  ];

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
  
    let numberOfElementsLastRow = data.length % numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
  
    return data;
  };

const numColumns =3;

export default function GalleryScreen() {
    renderItem = ({ item, index }) => {
        if (item.empty === true) {
          return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.key}</Text>
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
        backgroundColor: '#4D243D',
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
  })
  

GalleryScreen.navigationOptions = {
    title: 'Gallery'
};