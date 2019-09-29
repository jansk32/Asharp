import React, { useState, useEffect } from 'react';
import { Text, Image, View, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import Moment from 'moment';

Moment.locale('en');

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width * 0.95,
        height: Dimensions.get('window').width * 0.95,
        borderColor: 'black',
        borderWidth: .5,
        alignSelf: 'center',
        justifyContent: 'center',
        marginVertical: 2,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerDesc: {
        flex: 1 / 3,
        justifyContent: 'space-evenly',
        marginHorizontal: '3%',
        marginTop: '3%',
    },
    desc: {
        flex: 1/2,
        marginHorizontal: '3%',
        justifyContent: 'space-evenly',
        marginTop: '3%',
    },
    title: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
    },
    owner: {
        color: '#579B93',
        fontSize: 14,
        borderColor: '#579B93',
        backgroundColor: '#eff6f5',
        borderWidth: .5,
        borderRadius: 50,
        marginRight: '25%',
        paddingHorizontal: '3%',
        paddingVertical: '.5%'

    },
    dateStyle: {
        fontStyle: 'italic',
        marginHorizontal: '3%',
    },
    boldHeader: {
        fontWeight: 'bold',
        fontSize: 16,
    },
})


// See the details of each individual artefacts
export default function ItemDetailScreen({ navigation }) {
    const { navigate } = navigation;
    var artefactId = navigation.getParam('artefactId');
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

    return (
        <>
            <View style={styles.container}>
                <View style={styles.headerDesc}>
                    <Text style={styles.title}>{artefact.name}</Text>
                    <Text style={styles.owner}>Owned by: {owner}</Text>
                </View>
                <Image
                    style={styles.image}
                    source={{ uri: artefact.file }}
                />
                <Text style={styles.dateStyle}>Date: {Moment(artefact.date).format('L')}</Text>
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

            </View>
        </>
    );
}

