import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, Image, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { BACK_END_ENDPOINT } from '../constants';

moment.locale('en');

function useCurrentUser() {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        async function fetchCurrentUser() {
            const res = await axios.get(`${BACK_END_ENDPOINT}/user`, { withCredentials: true });
            setCurrentUser(res.data);
        }
        fetchCurrentUser();
    }, []);

    return currentUser;
}

// See the details of each individual artefact
export default function ItemDetailScreen({ navigation }) {
    const { navigate } = navigation;
    const { artefactId } = navigation.state.params;
    const [artefact, setArtefact] = useState({});
    const [owner, setOwner] = useState('');
    const [hide, setHide] = useState(true);
    const currentUser = useCurrentUser();

    useEffect(() => {
        // Get a specific artefact
        async function fetchArtefact() {
            const res = await axios.get(`${BACK_END_ENDPOINT}/artefact/find/${artefactId}`);
            setArtefact(res.data);
            setHide(false);
            const ownerRes = await axios.get(`${BACK_END_ENDPOINT}/user/artefact`, {
                params: {
                    _id: res.data.owner
                }
            });
            if (ownerRes.data) {
                setOwner(ownerRes.data.name);
            }
        }
        fetchArtefact();
    }, []);

    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        style={styles.image}
                        source={{ uri: artefact.file }}
                    />
                    <View style={styles.headerCont}>
                        <Text style={styles.title}>{artefact.name}</Text>
                        <View style={styles.headerDesc}>
                            <Text style={styles.owner}>Owned by {owner}</Text>
                            <Text style={styles.dateStyle}>{moment(artefact.date).format('L')}</Text>
                        </View>
                    </View>
                    <ActivityIndicator size="large" color="#0000ff" animating={hide} />
                    <View style={styles.desc}>
                        <Text style={styles.boldHeader}>Description:</Text>
                        <Text style={styles.descriptionStyle}>{artefact.description}</Text>
                    </View>
                    <View style={styles.desc}>
                        <Text style={styles.boldHeader}>Value:</Text>
                        <Text style={styles.descriptionStyle}>{artefact.value}</Text>
                    </View>
                    {
                        // If the artefact owner is the current user, allow them to send the artefact
                        artefact.owner === currentUser._id &&
                            (
                                <View style={styles.buttonBox}>
                                    <TouchableOpacity
                                        onPress={() => navigate('FamilyTree', { isSendingArtefact: true, artefactId })}
                                        style={styles.sendButton}>
                                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>
                                            Send Artefact
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )
                    }

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
        paddingTop: '5%',
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
        justifyContent: 'space-between',
    },
    headerDesc: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    desc: {
        marginHorizontal: '8%',
        marginBottom: 40,
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

