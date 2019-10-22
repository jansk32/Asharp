import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Dimensions, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import UserSearchBox from './user-search-box';

import { BACK_END_ENDPOINT } from '../constants';

export default function AddParentsScreen({ navigation }) {
    const { navigate } = navigation;
    const { linkedNode: childNode } = navigation.state.params;

    function renderSearchResult({ item: { _id: parentId, name, pictureUrl, spouse } }) {
        const disabled = childNode._id === parentId || !spouse || spouse && childNode.spouse === parentId;
        return (
            <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                    Alert.alert(
                        'Add parent',
                        `Are you sure you would like to add ${name} as your parent?`,
                        [
                            {
                                text: 'Cancel'
                            },
                            {
                                text: 'OK',
                                onPress: () => {
                                    axios.put(`${BACK_END_ENDPOINT}/user/add-parent`, {
                                        childId: childNode._id,
                                        parentId,
                                    });
                                }
                            }
                        ]
                    );
                }
                }
                style={{ backgroundColor: disabled ? 'red' : 'white' }}
            >
                <Image
                    source={{ uri: pictureUrl }}
                    style={{ height: 50, width: 50 }} />
                <Text>{name}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <ScrollView style={styles.allContainer}>
            <View style={styles.container}>
                <Text style={styles.add}>Add members</Text>
                <Text style={styles.title}>Parents</Text>
            </View>
            <UserSearchBox renderItem={renderSearchResult} />
            <Text style={styles.results}>Can't find them? Add them manually!</Text>
            <TouchableOpacity
                onPress={() => navigate('AddParentsManually')}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Add parents manually</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    allContainer: {
        backgroundColor: '#f5f7fb'
    },
    textInput: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        alignContent: 'center',
        marginTop: 10,
        padding: 5,
        paddingLeft: 10,
        marginLeft: '5%',
        marginRight: '5%',
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        marginLeft: '5%',
        marginRight: '5%',
        backgroundColor: '#f5f7fb',
        borderColor: '#f5f7fb'
    },
    searchInput: {
        flex: 1,
        marginLeft: 15,
        padding: 5
    },
    header: {
        padding: 10,
        fontSize: 20,
    },
    manualHeader: {
        // marginTop: '10%',
        padding: 10,
        fontSize: 20,
    },
    container: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: 'white',
        paddingBottom: 30,
    },
    title: {
        fontSize: 35,
        color: '#2d2e33',
        paddingBottom: '8%',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    results: {
        fontSize: 15,
        color: '#2d2e33',
        marginLeft: 10,
        fontWeight: 'bold',
    },
    add: {
        fontSize: 25,
        color: '#2d2e33',
        marginLeft: 10,
        marginTop: 10,
    },
    inputContainer: {
        marginTop: '10%',
        backgroundColor: 'white',
        borderRadius: 25,
        padding: '10%',
        marginHorizontal: 15,
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        paddingTop: 30,
        color: 'white'
    },
    button: {
        backgroundColor: '#EC6268',
        borderColor: '#EC6268',
        borderWidth: 1,
        width: Dimensions.get('window').width / 1.75,
        height: Dimensions.get('window').width / 8,
        borderRadius: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '20%',
        marginBottom: '30%'
    },
});