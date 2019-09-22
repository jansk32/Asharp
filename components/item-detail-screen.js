import React, { useState, useEffect } from 'react';
import { Text, Image, View, StyleSheet, Button, TouchableHighlight, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Moment from 'moment';



export default function ItemDetailScreen({navigation}) {
    const {navigate} = navigation;
    var artefactId = navigation.getParam('artefactId');
    const [artefact, setArtefact] = useState({});

    // get all artefacts
    useEffect(() => {
        async function fetchArtefact() {
            const res = await axios.get(`http://localhost:3000/artefact/find/${artefactId}`);
            setArtefact(res.data);
        }
        fetchArtefact();
    }, []);

    return (
        <>
            <View style={styles.container}>
                <Text></Text>
                <Image
                    style={styles.image}
                    source={{uri: artefact.file}}
                />
                <View style={styles.artefactElems}>
                    <Text>Name: {artefact.name}</Text>
                    <Text>Date: {artefact.date}</Text>
                    <Text>Owner id: {artefact.owner}</Text>
                    <Text>Value: {artefact.value}</Text>
                    <Text>Description: {artefact.description}</Text>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    image:{
        width: 350,
        height: 350
    },
    container:{
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center" 
    },
    artefactElems: {
        // alignItems:
    },
})

