import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Dimensions, ScrollView, Alert } from 'react-native';
import UserSearchBox from './user-search-box';
import axios from 'axios';

import DatePicker from 'react-native-datepicker';
import Moment from 'moment';

// import moment from 'moment';
Moment.locale('en');

export default function AddFamilyMemberScreen({ navigation }) {
    // isAddingSpouse is false if adding a child
    const { navigate } = navigation;
    const { linkedNode, isAddingSpouse } = navigation.state.params;
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');

    const DATE_FORMAT = 'YYYY-MM-DD';


    function renderSearchResult({ item: { _id, name, pictureUrl } }) {
        // const disabled = linkedNode._id === parentId || !spouse || spouse && linkedNode.spouse === parentId;
        const disabled = false;
        return (
            <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                    Alert.alert(
                        `Add ${isAddingSpouse ? 'spouse' : 'child'}`,
                        `Are you sure you would like to add ${name} as your ${isAddingSpouse ? 'spouse' : 'child'}?`,
                        [
                            {
                                text: 'Cancel'
                            },
                            {
                                text: 'OK',
                                onPress: () => {
                                    if (isAddingSpouse) {
                                        axios.put('http://localhost:3000/user/add-spouse', {
                                            personId: linkedNode._id,
                                            spouseId: _id,
                                        });
                                    } else {
                                        axios.put('http://localhost:3000/user/add-child', {
                                            personId: linkedNode._id,
                                            childId: _id,
                                        });
                                    }
                                }
                            }
                        ]
                    );
                }
                }
                style={{ backgroundColor: disabled ? 'red' : 'white' }}
            >
                <View style={{ flexDirection: 'row', marginHorizontal: 30, marginTop: 10, }}>
                    <Image
                        source={{ uri: pictureUrl }}
                        style={{ height: 60, width: 60, marginRight: 30, borderRadius: 50, }} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.add}>Find your</Text>
                <Text style={styles.title}>{isAddingSpouse ? 'Spouse' : 'Child'}</Text>
            </View>
            <ScrollView>
                    <View>
                        <UserSearchBox renderItem={renderSearchResult} />
                    </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.manualHeader}>Add details manually</Text>
                    <TextInput
                        placeholder="Name"
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                    />
                    <DatePicker
                        style={styles.dateInputs}
                        date={dob}
                        mode="date"
                        placeholder={Moment().format(DATE_FORMAT)}
                        format={DATE_FORMAT}
                        maxDate={Moment().format(DATE_FORMAT)}
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
                                // borderColor: 'white',
                            }
                        }}
                        showIcon={false}
                        onDateChange={newDate => setDob(newDate)}
                        value={dob}
                    />
                    {linkedNode.spouse ?
                        <TextInput
                            placeholder="Gender"
                            style={styles.textInput}
                            value={gender}
                            onChangeText={setGender}
                        />
                        :
                        null
                    }
                    <TextInput
                        placeholder="Picture"
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.button}>
                    <Text
                        style={styles.buttonText}
                        onPress={() => {
                            const newUserInfo = {
                                name,
                                dob,
                            };

                            if (linkedNode.spouse) {
                                // Linked node has a spouse, so add a child
                                // Father and mother are already entered
                                newUserInfo.father = linkedNode.gender === 'm' ? linkedNode._id : linkedNode.spouse;
                                newUserInfo.mother = linkedNode.gender === 'f' ? linkedNode._id : linkedNode.spouse;
                                newUserInfo.gender = gender;
                            } else {
                                // Linked node doesn't have a spouse, so add a spouse
                                // Spouse is already available
                                // Gender of the new user is implicitly the opposite of the linked node's
                                newUserInfo.spouse = linkedNode._id;
                                newUserInfo.gender = linkedNode.gender === 'm' ? 'f' : 'm';
                            }
                            axios.post('http://asharp-mementos.herokuapp.com/user/create', newUserInfo);
                            navigation.goBack();
                        }}>
                        Add
                        </Text>
                </View>
            </ScrollView>
        </>
    )
};

const styles = StyleSheet.create({
    allContainer: {
        backgroundColor: '#f5f7fb',
        alignSelf: 'center',
    },
    textInput: {
		borderColor: 'black',
		borderWidth: 0.5,
		borderRadius: 3,
		alignContent: 'center',
		padding: 5,
		paddingLeft: 10,
        width: Dimensions.get('window').width / 2,
        marginBottom:20,
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
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        backgroundColor: 'white',
    },
    title: {
        fontSize: 35,
        color: '#2d2e33',
        paddingBottom: '8%',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    add: {
        fontSize: 25,
        color: '#2d2e33',
        marginLeft: 10,
        marginTop: 10,
    },
    inputContainer: {
        backgroundColor: 'white',
        borderRadius: 25,
        marginHorizontal: 15,
        marginTop: 20,
        alignSelf:'center',
        justifyContent:'space-evenly',
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
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
        marginVertical: 20,
    },
    dateInputs: {
		alignContent: 'center',
        width: Dimensions.get('window').width / 2,
        marginBottom: 20,
	},
});