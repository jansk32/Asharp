import React, { useState, useEffect } from 'react';
import { Text, Image, View, StyleSheet, Dimensions, ScrollView, Button } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import { TouchableOpacity } from 'react-native-gesture-handler';

moment.locale('en');

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
        marginHorizontal: '8%',
        marginTop: '5%',
        borderBottomColor: '#A4A4A4',
        borderBottomWidth: .5,
        justifyContent: 'space-between',
    },
    headerDesc: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    desc: {
        justifyContent: 'space-evenly',
        marginHorizontal: '8%',
        minHeight: 200,
    },
    title: {
        color: 'black',
        fontSize: 50,
        fontWeight: 'bold',
    },
    owner: {
        color: '#579B93',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateStyle: {
        color: '#EC6268',
        borderLeftColor: '#fff',
        alignSelf: 'flex-end',
        fontWeight: 'bold',
    },
    boldHeader: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    backButt: {
        borderRadius: 100,
        backgroundColor: '#fff',
        position: 'absolute',
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        margin: 30,
        paddingLeft: 10,
        paddingTop: 9,
        width: 40,
        height: 40,
    },
    value: {
        fontSize: 16,
    }
});


// See the details of each individual artefacts
export default function ItemDetailScreen({ navigation }) {
    const { navigate } = navigation;
    const { artefactId } = navigation.state.params;
    const [artefact, setArtefact] = useState({});
    const [owner, setOwner] = useState('');

    // Get all artefacts
    useEffect(() => {
        async function fetchArtefact() {
            const res = await axios.get(`http://localhost:3000/artefact/find/${artefactId}`);
            setArtefact(res.data);
            // console.log("owner id:"+ res.data.owner);
            const ownerObj = await axios.post('http://localhost:3000/user/artefact', {
                _id: res.data.owner
            });
            await setOwner(ownerObj.data.name);
            // await console.log(ownerObj.data.name);
        }
        fetchArtefact();
    }, []);

    const backButton = <Icon name="md-home" size={30} />

    return (
        <>
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={{ uri: artefact.file }}
                />

                <ScrollView>

                    <View style={styles.headerCont}>
                        <Text style={styles.title}>{artefact.name}</Text>

                        <View style={styles.headerDesc}>
                            <Text style={styles.owner}>Owned by {owner}</Text>
                            <Text style={styles.dateStyle}>{moment(artefact.date).format('L')}</Text>

                        </View>
                    </View>
                    <View style={styles.desc}>
                        <View>
                            <Text style={styles.boldHeader}>Description:</Text>
                            <Text>{artefact.description}</Text>
                        </View>
                        <View>
                            <Text style={styles.boldHeader}>Value:</Text>
                            <Text>{artefact.value}</Text>
                        </View>
                    </View>
                </ScrollView>
                <Icon
                    name="md-arrow-round-back"
                    size={22}
                    style={styles.backButt}
                    onPress={() => navigation.goBack()}
                />
                <Button
                    title="Send artefact"
                    onPress={() => navigate('FamilyTree', { isSendingArtefact: true, artefactId })}
                />
            </View>
        </>
    );
}

