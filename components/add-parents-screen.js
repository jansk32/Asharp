import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Dimensions, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import UserSearchBox from './user-search-box';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';  
import DatePicker from 'react-native-datepicker';
import moment from 'moment';


import { BACK_END_ENDPOINT } from '../constants';

// import moment from 'moment';
moment.locale('en');

export default function AddParentsScreen({ navigation }) {
    const { navigate } = navigation;
    const [dob, setDob] = useState('');
    const [dobMother, setDobMother] = useState('');
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

    function SearchMemberRoute(){
        return (
            <ScrollView>
                <View style={styles.search}>
                    <UserSearchBox renderItem={renderSearchResult} />
                </View>
            </ScrollView>
        )
    }
    
    function AddMemberRoute(){
        return(
        <>
            <View style={styles.inputContainer}>
                <Text style={styles.manualHeader}>Add Father</Text>
                <TextInput
                    placeholder="Name"
                    style={styles.textInput}
                />

                    <Text style = {styles.dobText}>Date of Birth:</Text>
                    <View style = {styles.dobPicker}>
                       <DatePicker
                            style={styles.dateInputs}
                            date={dob}
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
                            onDateChange={setDob}
                            value={dob}
                        />
                    </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.manualHeader}>Add Mother</Text>
                <TextInput
                    placeholder="Name"
                    style={styles.textInput}
                // value={name}
                // onChangeText={setName}
                />
                <Text style = {styles.dobText}>Date of Birth:</Text>
                <View style = {styles.dobPicker}>
                <DatePicker
                    style={styles.dateInputs}
                    date={dobMother}
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
                    onDateChange={setDobMother}
                    value={dobMother}
                />
                </View>

            </View>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Add</Text>
            </View>
    </>
        )
    }

    const [tab, setTab] = useState({
        index:0,
        routes: [
            {key: 'first', title:'Search'},
            {key: 'second', title: 'Add Manually'},
        ],
    });
    
    return (
        <>
        <ScrollView style={styles.allContainer}>
            <View style={styles.container}>
                <Text style={styles.add}>Find your</Text>
                <Text style={styles.title}>Parents</Text>
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
        </>
    );
}

{/* <View style={styles.container}>
<Text style={styles.add}>Add members</Text>
<Text style={styles.title}>Parents</Text>
</View> */}
{/* <Text style={styles.results}>Can't find them? Add them manually!</Text>
<TouchableOpacity
onPress={() => navigate('AddParentsManually')}
style={styles.button}
>
<Text style={styles.buttonText}>Add parents manually</Text>
</TouchableOpacity> */}

const styles = StyleSheet.create({
    allContainer: {
        backgroundColor: '#f5f7fb'
        // backgroundColor: 'white',
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
    search: {
        marginTop:10,
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
        backgroundColor: 'white',
    },
    title: {
        fontSize: 35,
        color: '#2d2e33',
        // paddingBottom: '8%',
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
        marginTop: 50,
        marginBottom: '30%'
    },
    dobText: {
        marginTop: 10,
        padding: 5,
        paddingLeft: 10,
        marginLeft: '5%',
        marginRight: '5%',
    },
    dobPicker:{
        padding: 5,
        paddingLeft:10,
        marginLeft:'5%',
        marginRight: '5%',
    },  
});