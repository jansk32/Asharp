import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Text, ActivityIndicator,StyleSheet, View, Image, Dimensions, TouchableOpacity, Button } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/EvilIcons';
import Moment from 'moment';

// Number 
const numColumns = 3;

// Array of images for the grid
const data = [
    { image: require('../tim_derp.jpg') }, { image: require('../gg.png') },
];

// To format data
const formatData = (data, numColumns) => {

    const fullRowsNum = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (fullRowsNum * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
    }
    return data;
};

export default function ProfileScreen({ navigation }) {
    const { navigate } = navigation;
    const [profile, setProfile] = useState({});
    const [artefact, setArtefact] = useState([]);
    const [hide, setHide] = useState("");

    // Get profile details
    async function getProfile() {
        //console.log('Sending request');
        await axios.get('http://localhost:3000/user', { withCredentials: true })
        .then((res) => {
            setProfile(res.data);
        })
        .catch(error => console.error(error));
    }
    // Get the artefact of the user
    async function getArtefact() {
        //console.log(profile);
        axios.get("http://localhost:3000/artefact/findbyowner")
        .then((result) => {
            //console.log(result.data);
            setArtefact(result.data);
            setHide("false")
        })
        .catch(err => console.log(error));
    }

    async function fetchProfile(){
       if(profile === null || artefact.length < 1){
        setHide("true");
       }
       await getProfile();
    //    await getArtefact();
    }

    // Get profile and artefacts by owner
    useEffect( () => { 
        fetchProfile();
        getArtefact();
    }, []);


    // Logout function
    function logout() {
        axios.get('http://localhost:3000/logout')
            .then((result) => navigate('Welcome'))
            .catch((err) => console.log(err));
    }

    // Render Item invisible if it's just a placeholder for columns in the grid,
    // if not, render the picture for each grid
    renderItem = ({ item, index }) => {

        if (item.empty === true) {
            return <View style={[styles.itemBox, styles.invisibleItem]} />;
        }
        return (
            <View style={styles.itemBox}>
                <TouchableOpacity
                    onPress={() => navigate('ItemDetail', { artefactId: item._id })}>
                    <Image
                        source={{ uri: item.file }}
                        style={styles.imageBox} />
                </TouchableOpacity>
            </View>
        );
    };

    // Format date
    Moment.locale('en');

    // Return the whole layout for profile
    return (
        <>
            <View style={styles.header}>
                <Text style={styles.profile}>Profile</Text>              
                <View style={styles.icon}>
                    <Icon name="navicon" size={40} color={'#2d2e33'} />
                </View>
            </View>
            <ActivityIndicator size="large" color="#0000ff" animating={hide === 'true'}/>    
            <ScrollView>
                <View style={styles.profileBox}>
                    <Image
                        source={{ uri: profile.pictureUrl }}
                        style={styles.image}
                    />
                    <View style={styles.textBox}>
                        <Text
                            style={styles.nameText}>{profile.name}</Text>
                        <Text
                            style={styles.dob}>DOB: {Moment(profile.dob).format('L')}</Text>
                    </View>
                    <View style={styles.settingBox}>
                        <View style={styles.settingButton}>
                            <TouchableOpacity
                                onPress={() => navigate('ProfileSetting', {setProfile})}>
                                <Text
                                    style={styles.buttonText}>
                                    Settings</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.settingButton}>
                            <TouchableOpacity
                                onPress={logout}>
                                <Text
                                    style={styles.buttonText}>
                                    Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.artefactsBox}>
                    <Text style={styles.artText}>My Artefacts</Text>
                    <FlatList
                        data={formatData(artefact, numColumns)}
                        keyExtractor={item => item._id}
                        numColumns={3}
                        renderItem={this.renderItem}
                    />
                </View>
            </ScrollView>
        </>
    );
}

// Stylesheets to format the layout of the page
const styles = StyleSheet.create({

    profileBox: {
        backgroundColor: '#f5f7fb',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    header: {
        flexDirection: 'row',
        paddingTop: 15,
        margin: 10,
    },

    profile: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2d2e33',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },

    icon: {
        alignItems: 'flex-end',
        flex: 3,
        paddingRight: 20,
        paddingTop: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 125,
        marginTop: 14,
        marginLeft: 14,
        marginRight: 10,
        marginBottom: 5,
        alignSelf: 'center',
    },
    imageBox: {
        margin: 1,
        width: Dimensions.get('window').width / 3.2,
        height: Dimensions.get('window').width / 3.2,
    },
    textBox: {
        // flex: 1,
        padding: 8,
        marginLeft: 10,
        justifyContent: "center",
        alignSelf: 'center',
    },
    itemBox: {
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
    },
    itemText: {
        color: 'black',
        justifyContent: "center",
        alignSelf: 'center',
    },
    settingBox: {
        paddingBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    settingButton: {
        backgroundColor: '#fff',
        borderColor: '#F2F2F2',
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 100,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 15,
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dob: {
        fontSize: 15,
        textAlign: 'center',
    },
    artefactsBox: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingLeft: 10,
        paddingBottom: 10,
        paddingRight: 10,
    },
    artText: {
        justifyContent: 'center',
        marginBottom: 18,
        marginLeft: 12,
        fontSize: 16,
    },
    container: {
        margin: 20,
    },
    invisibleItem: {
        backgroundColor: 'transparent',
    },
})