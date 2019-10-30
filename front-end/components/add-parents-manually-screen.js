import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TextInput, Dimensions, ScrollView, ToastAndroid } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { BACK_END_ENDPOINT } from '../constants';
import DatePanel from './date-panel';
import PictureFrame from './picture-frame';
import { uploadImage } from '../image-tools';

moment.locale('en');

export default function AddParentsManuallyScreen({ navigation, childNode }) {
    const { navigate } = navigation;
    const { fetchFamilyMembers } = navigation.state.params;
    const [fatherDob, setFatherDob] = useState(moment());
    const [motherDob, setMotherDob] = useState(moment());
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [fatherImage, setFatherImage] = useState({});
    const [motherImage, setMotherImage] = useState({});

    return (
        <ScrollView style={styles.allContainer}>
            <View style={styles.container}>
                <Text style={styles.add}>Add manually</Text>
                <Text style={styles.title}>Parents</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.manualHeader}>Add Father</Text>
                <TextInput
                    placeholder="Name"
                    style={styles.textInput}
                    value={fatherName}
                    onChangeText={setFatherName}
                />

                <Text style={styles.dobText}>Date of Birth:</Text>
                <DatePanel date={fatherDob} setDate={setFatherDob} isEditing={true} />

                <PictureFrame
                    image={fatherImage}
                    setImage={setFatherImage}
                    circular
                    editable
                    width={200}
                    height={200}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.manualHeader}>Add Mother</Text>
                <TextInput
                    placeholder="Name"
                    style={styles.textInput}
                    value={motherName}
                    onChangeText={setMotherName}
                />

                <Text style={styles.dobText}>Date of Birth:</Text>
                <DatePanel date={motherDob} setDate={setMotherDob} isEditing={true} />

                <PictureFrame
                    image={motherImage}
                    setImage={setMotherImage}
                    circular
                    editable
                    width={200}
                    height={200}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={async () => {
                const personId = childNode._id;

                await axios.post(`${BACK_END_ENDPOINT}/user/add-parents-manually`, {
                    fatherName,
                    fatherDob,
                    fatherPictureUrl: await uploadImage(fatherImage.uri),
                    motherName,
                    motherDob,
                    motherPictureUrl: await uploadImage(motherImage.uri),
                    personId,
                });
                
                fetchFamilyMembers();
                navigate('FamilyTree');
            }}>
                <Text style={styles.buttonText}>Add</Text>
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
    dobText: {
        marginTop: 10,
        padding: 5,
        paddingLeft: 10,
        marginLeft: '5%',
        marginRight: '5%',
    },
    dobPicker: {
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
        paddingBottom: 10,
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
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 40,
        marginHorizontal: 15,
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        paddingTop: 40,
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
        marginTop: 50,
        marginBottom: '30%'
    },
});