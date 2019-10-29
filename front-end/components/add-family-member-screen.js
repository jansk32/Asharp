import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Dimensions, ScrollView, Alert } from 'react-native';
import UserSearchBox from './user-search-box';
import axios from 'axios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import DatePicker from 'react-native-datepicker';
import Moment from 'moment';

// import moment from 'moment';
Moment.locale('en');

import { BACK_END_ENDPOINT } from '../constants';
import PictureFrame from './picture-frame';
import { uploadImage } from '../image-tools';

export default function AddFamilyMemberScreen({ navigation }) {
    const { linkedNode, kinship, fetchFamilyMembers } = navigation.state.params;

    const DATE_FORMAT = 'YYYY-MM-DD';

    function SearchMemberRoute() {
        return (
            <ScrollView>
                <View style={styles.search}>
                    <UserSearchBox navigation={navigation} />
                </View>
            </ScrollView>
        );
    }

    function AddMemberRoute() {
        const [name, setName] = useState('');
        const [dob, setDob] = useState('');
        const [gender, setGender] = useState('');
        const [image, setImage] = useState();

        return (
            <>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Name"
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                    />
                    <Text style={styles.dobText}>Date of Birth:</Text>
                    <View style={styles.dobPicker}>
                        <DatePicker
                            style={styles.dateInputs}
                            date={dob}
                            mode="date"
                            placeholder="Select date"
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
                                    marginLeft: 0
                                }
                            }}
                            // showIcon={false}
                            onDateChange={newDate => setDob(newDate)}
                            value={dob}
                        />
                    </View>
                    {linkedNode.spouse &&
                        /* Gender options */
                        <View style={styles.gender}>
                            <Text>Gender: </Text>
                            <View >
                                <Text value={gender} onPress={() => setGender('m')} style={{ ...styles.genderButton, backgroundColor: gender === 'm' ? '#579B93' : '#a1a1a1' }}>
                                    Male
                                </Text>
                            </View>

                            <View>
                                <Text value={gender} onPress={() => setGender('f')} style={{ ...styles.genderButton, backgroundColor: gender === 'f' ? '#579B93' : '#a1a1a1' }}>
                                    Female
                                </Text>
                            </View>
                        </View>
                        // <TextInput
                        //     placeholder="Gender"
                        //     style={styles.textInput}
                        //     value={gender}
                        //     onChangeText={setGender}
                        // />
                    }
                    <Text>Profile picture</Text>
                    <PictureFrame
                        image={image}
                        setImage={setImage}
                        editable={true}
                    />
                </View>
                <View style={styles.button}>
                    <Text
                        style={styles.buttonText}
                        onPress={async () => {
                            const newUserInfo = {
                                name,
                                dob,
                                pictureUrl: await uploadImage(image.uri)
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
                            await axios.post(`${BACK_END_ENDPOINT}/user/create`, newUserInfo);
                            fetchFamilyMembers();
                            navigation.goBack();
                        }}>
                        Add
                        </Text>
                </View>
            </>
        );
    }

    const [tab, setTab] = useState({
        index: 0,
        routes: [
            { key: 'first', title: 'Search Family Member' },
            { key: 'second', title: 'Add Manually' },
        ],
    });

    return (
        <ScrollView style={styles.allContainer}>
            <View style={styles.container}>
                <Text style={styles.add}>Find your</Text>
                <Text style={styles.title}>{kinship.charAt(0).toUpperCase() + kinship.slice(1)}</Text>
            </View>
            <TabView
                navigationState={tab}
                renderScene={SceneMap({
                    first: SearchMemberRoute,
                    second: AddMemberRoute,
                })}
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: '#EC6268' }}
                        style={{ backgroundColor: 'white' }}
                        bounces={true}
                        labelStyle={{ color: '#2d2e33' }}
                    />
                }
                onIndexChange={index => setTab({ ...tab, index })}
                initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    gender: {
        marginTop: 10,
        padding: 5,
        paddingLeft: 10,
        marginLeft: '5%',
        marginRight: '5%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    genderButton: {
        // backgroundColor: '#EC6268',
        // borderColor: '#EC6268',
        borderWidth: 0,
        width: 80,
        height: 30,
        borderRadius: 50,
        textAlign: 'center',
        color: 'white',
        justifyContent: 'center'
        // justifyContent: 'center',
        // alignSelf: 'center',
        // marginVertical: 20,
    },
    genderText: {
        textAlign: 'center',
        color: 'white'
    },
    allContainer: {
        backgroundColor: '#f5f7fb',
    },
    search: {
        marginTop: 10,
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
        margin: 20,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    container: {
        backgroundColor: 'white',
    },
    title: {
        fontSize: 35,
        color: '#2d2e33',
        // paddingBottom: '8%',
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
        marginTop: '10%',
        backgroundColor: 'white',
        borderRadius: 25,
        padding: '10%',
        marginHorizontal: 15,
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
});