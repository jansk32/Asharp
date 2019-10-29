import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TextInput, Dimensions, ScrollView, ToastAndroid } from 'react-native';
import axios from 'axios';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { BACK_END_ENDPOINT } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';

moment.locale('en');

export default function AddParentsManuallyScreen({ navigation, childNode }) {
    const { navigate } = navigation;
    const [fatherDob, setFatherDob] = useState('');
    const [motherDob, setMotherDob] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');

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
                <View style={styles.dobPicker}>
                    <DatePicker
                        style={styles.dateInputs}
                        date={fatherDob}
                        mode="date"
                        placeholder="Select date"
                        format="YYYY-MM-DD"
                        maxDate={moment().format('DD-MM-YYYY')}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        androidMode="spinner"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 0
                            }
                        }}
                        // showIcon={false}
                        onDateChange={dateString => setFatherDob(dateString)}
                        value={fatherDob}
                    />
                </View>
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
                <View style={styles.dobPicker}>
                    <DatePicker
                        style={styles.dateInputs}
                        date={motherDob}
                        mode="date"
                        placeholder="Select date"
                        format="YYYY-MM-DD"
                        maxDate={moment().format('DD-MM-YYYY')}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        androidMode="spinner"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 0
                            }
                        }}
                        // showIcon={false}
                        onDateChange={dateString => setMotherDob(dateString)}
                        value={motherDob}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={async () => {
                const personId = childNode._id;

                axios.post(`${BACK_END_ENDPOINT}/user/add-parents-manually`, {
                    fatherName,
                    fatherDob,
                    motherName,
                    motherDob,
                    personId,
                });

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