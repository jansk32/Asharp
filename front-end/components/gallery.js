import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, StyleSheet, View, Image, Dimensions, TouchableHighlight, FlatList, RefreshControl, ScrollView } from 'react-native';
import moment from 'moment';

// Import date formatting module moment.js
moment.locale('en');

const numColumns = 3;


// Format images in the gallery
function formatData(data, numColumns) {
    // Sort artefacts in descending order of time
    data.sort((a, b) => moment(b.date).diff(moment(a.date)));

    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (numberOfElementsLastRow !== numColumns
        && numberOfElementsLastRow !== 0) {
        numberOfElementsLastRow++;
    }
    return data;
};


export default function Gallery({ isLoading, artefacts, navigation, refresh }) {
    const [refreshing, setRefreshing] = useState(false);

    const [noArtefactsTitle, setNoArtefactsTitle] = useState('');
    const [noArtefactsDescription, setNoArtefactsDescription] = useState('');

    useEffect(() => {
        if (navigation.state.routeName === 'Profile') {
            setNoArtefactsTitle("You don't have any artefacts right now");
            setNoArtefactsDescription("When you upload an artefact or someone sends you one, you will see it here.");
        } else if (navigation.state.routeName === 'Timeline') {
            setNoArtefactsTitle("Your family doesn't have any artefacts right now");
            setNoArtefactsDescription("When you or a family member gets an artefact, you will see it here.");
        } else {
            setNoArtefactsTitle("This person doesn't have any artefacts right now");
            setNoArtefactsDescription("When they upload an artefact or someone sends them one, you will see it here.");
        }
    }, []);

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
            refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                    setRefreshing(true);
                    await refresh();
                    setRefreshing(false);
                }} />}
            data={formatData(artefacts, numColumns)}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            numColumns={numColumns}
            ListEmptyComponent={(
                <>
                    <Text style={styles.textStyle}>{noArtefactsTitle}</Text>
                    <Text style={styles.desc}>{noArtefactsDescription}</Text>
                </>
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