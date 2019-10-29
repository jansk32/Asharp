import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, StyleSheet, View, Image, Dimensions, TouchableHighlight, FlatList } from 'react-native';
import moment from 'moment';

// Import date formatting module moment.js
moment.locale('en');

const numColumns = 3;


// Format images in the gallery
function formatData(data, numColumns) {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (numberOfElementsLastRow !== numColumns
        && numberOfElementsLastRow !== 0) {
        numberOfElementsLastRow++;
    }
    return data;
};


export default function Gallery({ isLoading, artefacts, navigation }) {
    // Render Item invisible if it's just a placeholder for columns in the grid,
    // if not, render the picture for each grid (Gallery)
    function renderItem({ item, index }) {
        if (item.empty) {
            return <View style={[styles.item, styles.itemInvisible]} />
        }
        return (
            <View style={styles.item}>
                <TouchableHighlight onPress={() => navigation.navigate('ItemDetail', { artefactId: item._id })}>
                    <Image
                        style={styles.imageBox}
                        source={{ uri: item.file }}
                    />
                </TouchableHighlight>
            </View>
        );
    }


    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }
    return (
        <FlatList
            data={formatData(artefacts, numColumns)}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            numColumns={numColumns}
            ListEmptyComponent={<Text>No artefacts yet</Text>}
        />
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 15,
        paddingLeft: 5,
    },
    containers: {
        backgroundColor: '#f5f7fb',
    },
    artefactTitle: {
        fontSize: 30,
        marginLeft: 10,
        fontWeight: 'bold',
        paddingBottom: '5%',
        color: 'white',
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 10
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
    container: {
        // flex: 1,
        // marginVertical: 20
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 10
    },
    title: {
        fontSize: 20,
        marginLeft: 10,
        color: 'white',
        paddingTop: '8%',

    },
    item: {
        height: Dimensions.get('window').width / numColumns, // approximate a square
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemText: {
        color: '#fff',
    },
    imageBox: {
        height: Dimensions.get('window').width / numColumns, // approximate a square
        width: Dimensions.get('window').width / numColumns,
        flex: 1,
    }
});