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
        return <ActivityIndicator size="large" color="#EC6268" />;
    }
    return (
        <FlatList
            data={formatData(artefacts, numColumns)}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            numColumns={numColumns}
            ListEmptyComponent={(
                navigation.state.routeName === 'Profile' ?
                    (
                        <>
                            <Text style={styles.textStyle}>You don't have any artefacts right now.</Text>
                            <Text style={styles.desc}>When you upload an artefact or someone sends you one, you will see it here.</Text>
                        </>
                    )
                    :
                    (
                        <>
                            <Text style={styles.textStyle}>Your family doesn't have any artefacts right now.</Text>
                            <Text style={styles.desc}>When you or a family member gets an artefact, you will see it here.</Text>
                        </>
                    )

            )}
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
    },
    textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        flexWrap: 'wrap',
        // textAlignVertical: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        margin: 10,
        padding: 30,
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    desc: {
        fontSize: 16,
        paddingHorizontal: 30,
        flexWrap: 'wrap',
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
});