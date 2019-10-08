import React, { useState, useEffect } from 'react';
import { Text, Image, View, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import { TouchableOpacity } from 'react-native-gesture-handler';

Moment.locale('en');

// See the details of each individual artefacts
export default function ItemDetailScreen({ navigation }) {
    const { navigate } = navigation;
    var artefactId = navigation.getParam('artefactId');
    const [artefact, setArtefact] = useState({});
    const [owner, setOwner] = useState('');
    const [hide, setHide] = useState(true);




    // Get a specific artefact
    async function fetchArtefact() {
        const res = await axios.get(`http://localhost:3000/artefact/find/${artefactId}`);
        setArtefact(res.data);
        // console.log("owner id:"+ res.data.owner);
        await axios.get('http://localhost:3000/user/artefact', {
            params: {
            _id: res.data.owner
            }
        })
        .then((result) => {
            if (result.data) {
                setHide(false);
                setOwner(result.data.name);
            }
        });
        // await setOwner(ownerObj.data.name);
        // await console.log(ownerObj.data.name);
    }


    useEffect(() => {
        setHide(false);
        fetchArtefact();
    }, []);

    // TODO: Define function to send artefacts to family members
    const sendArtefact = () => {
        // @Timothy / @Jansen pls help
        async function postArtefact() {
            const res = axios.post(`http://localhost:3000/artefact`, {

            })
        }
    }


    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        style={styles.image}
                        source={{ uri: artefact.file }}
                    />
                    {hide && (
                    <ActivityIndicator
                        size="large"
                    />
                    )}

                    <View style={styles.headerCont}>
                        <Text style={styles.title}>{artefact.name}</Text>

                        <View style={styles.headerDesc}>
                            <Text style={styles.owner}>Owned by {owner}</Text>
                            <Text style={styles.dateStyle}>{Moment(artefact.date).format('L')}</Text>

                        </View>
                    </View>
                    <View style={styles.desc}>
                        <Text style={styles.boldHeader}>Description:</Text>
                        <Text style={styles.descriptionStyle}>{artefact.description}</Text>
                    </View>
                    <View style={styles.desc}>
                        <Text style={styles.boldHeader}>Value:</Text>
                        <Text style={styles.descriptionStyle}>{artefact.value}</Text>
                    </View>
                    <View style={styles.buttonBox}>
                        <TouchableOpacity
                            onPress={() => navigate('Home')}
                            style={styles.sendButton}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>
                                Send Artefacts
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View >
            </ScrollView>
        </>
    );
}
const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerCont: {
        paddingHorizontal: '8%',
        paddingVertical: '5%',
        marginBottom: '5%',
        // backgroundColor: '#E6E6E6',
        borderColor: 'black',
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
        borderWidth: 1,
        justifyContent: 'space-between',
    },
    headerDesc: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    desc: {
        marginHorizontal: '8%',
        marginVertical: 20,
        justifyContent: 'space-between',
    },
    descriptionStyle: {
        marginTop: 5,
        padding: 10,
        paddingBottom: 30,
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 0.5
    },
    title: {
        color: 'black',
        fontSize: 50,
        fontWeight: 'bold',
    },
    owner: {
        color: 'black',
        fontSize: 18,
    },
    dateStyle: {
        color: '#579B93',
        borderLeftColor: '#fff',
        alignSelf: 'flex-end',
        fontWeight: 'bold',
    },
    boldHeader: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    value: {
        fontSize: 16,
    },
    buttonBox: {
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 40,
    },
    sendButton: {
        backgroundColor: '#EC6268',
        width: Dimensions.get('window').width / 1.75,
        height: Dimensions.get('window').width / 8,
        borderRadius: 50,
        justifyContent: 'center',
        alignSelf: 'center',
    },
})

