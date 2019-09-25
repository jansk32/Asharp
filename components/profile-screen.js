import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Text, StyleSheet, View, Image, Dimensions, TouchableOpacity, Button } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Moment from 'moment';

// Number 
const numColumns = 3;

// Array of images for the grid
const data = [
    { image: require('../tim_derp.jpg') }, { image: require('../gg.png') },
];

// Stylesheets to format the layout of the page
const styles = StyleSheet.create({
    profileBox: {
        backgroundColor: '#fff',
        flex: 1 / 4,
        flexDirection: 'row',
        textAlign: 'center',
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 125,
        marginTop: 14,
        marginLeft: 14,
        marginRight: 10,
        marginBottom: 5,
    },
    imageBox: {
        margin: 1,
        width: Dimensions.get('window').width / 3.2,
        height: Dimensions.get('window').width / 3.2,
    },
    textBox: {
        flex: 1,
        padding: 8,
        marginLeft: 10,
        justifyContent: "center",
        alignSelf: 'center',
    },
    itemBox: {
        backgroundColor: '#FAFAFA',
        flex: 1,
        alignItems: 'center',
    },
    itemText: {
        color: 'black',
        justifyContent: "center",
        alignSelf: 'center',
    },
    settingBox: {
        flex: 1 / 10,
        backgroundColor: '#fff',
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
    nameText: {
        fontSize: 16,
        justifyContent: 'space-around',
    },
    artefactsBox: {
        backgroundColor: '#fff',
        borderTopColor: '#585858',
        borderTopWidth: 1,
        paddingTop: 20,
        paddingLeft: 10,
        paddingBottom: 10,
        paddingRight: 10,
        flex: 3 / 4,
    },
    artText: {
        justifyContent: 'center',
        marginBottom: 18,
        marginLeft: 12,
        fontSize: 16,
    },
    container: {
        flex: 3 / 4,
        margin: 20,
    },
    invisibleItem: {
        backgroundColor: 'transparent',
    },
})

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
    var [profile, setProfile] = useState({});
    const [artefact, setArtefact] = useState([]);

    // Get profile details
    async function getProfile() {
        console.log('Sending request');
        axios.get('http://localhost:3000/user', { withCredentials: true })
        .then((res) => {
            setProfile(res.data);
        })
        .catch(error => console.error(error));
    }
    // Get the artefact of the user
    async function getArtefact() {
        console.log(profile);
        axios.get("http://localhost:3000/artefact/findbyowner/")
        .then((result) => {
            console.log(result.data);
            setArtefact(result.data);
        })
        .catch(err => console.log(error));
    }

    async function fetchProfile(){
       await getProfile();
       await getArtefact();
    }

    // Get profile and artefacts by owner
    useEffect( () => { fetchProfile()}, []);

    
    // Render Item invisible if it's just a placeholder for columns in the grid,
    // if not, render the picture for each grid
    renderItem = ({ item, index }) => {
        
        if (item.empty === true) {
            return <View style={[styles.itemBox, styles.invisibleItem]} />;
        }
        return (
            <View style={styles.itemBox}>
                <TouchableOpacity 
                onPress={() => navigate('ItemDetail', {artefactId: item._id})}>
                    <Image
                        source={{uri: item.file}}
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
            <React.Fragment>
                <View style={styles.profileBox}>
                    <Image
                        source={{uri: profile.pictureUrl}}
                        style={styles.image}
                    />
                    
                    <View style={styles.textBox}>
                        <Text 
                            style={styles.nameText}>Name: {profile.name}</Text>
                        <Text
                            style={styles.nameText}>Date of Birth: {Moment(profile.dob).format('L')}</Text>
                    </View>
                </View>
                <View style={styles.settingBox}>
                    <View style={styles.settingButton}>
                        <TouchableOpacity
                            onPress={() => navigate('Home')}>
                            <Text
                                style={styles.nameText}>
                                My Family</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.settingButton}>
                        <TouchableOpacity
                            onPress={() => navigate('Welcome')}>
                            <Text
                                style={styles.nameText}>
                                Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.artefactsBox}>
                    <Text style={styles.artText}>My Artefacts</Text>
                    <FlatList
                        data={formatData(artefact, numColumns)}
                        numColumns={3}
                        renderItem={this.renderItem}
                    />
                </View>
            </React.Fragment>
        </>
    );
}
