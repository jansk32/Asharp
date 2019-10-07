import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

export default function ViewFamilyMemberScreen({ navigation }) {
    const { navigate } = navigation;
    const userId = navigation.getParam('userId');
    const [user, setUser] = useState({});

    useEffect(() => {
        async function fetchMember() {
            const res = await axios.get('http://localhost:3000/user/find/' + userId);
            const fetchedUser = res.data;
            setUser(fetchedUser);
        }
        fetchMember();
    });

    return (
        <>
            {/* <LinearGradient colors={['#436aac','#43b7b8']} style={styles.container}>
            <Text style={styles.title}>View family member</Text>
        </LinearGradient> */}

            <Image
                source={{ uri: user.pictureUrl ? user.pictureUrl : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }}
                style={styles.profilePic}
            />

            <Text style={styles.status}>Status</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Details</Text>
                <Text style={styles.details}>Name: {user.name}</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
        paddingBottom: '8%',
        paddingTop: '8%'
    },
    profilePic: {
        borderRadius: 125,
        alignSelf: 'center',
        height: 125,
        width: 125,
        margin: 20
    },
    status: {
        textAlign: 'center',
        fontSize: 20,
        paddingBottom: 10
    },
    detailsContainer: {
        margin: 10,
        // backgroundColor:'red',
        borderRadius: 15,
        backgroundColor: '#579B93',
    },
    detailsTitle: {
        margin: 10,
        fontSize: 25,
        color: 'white'
    },
    details: {
        margin: 10,
        fontSize: 15,
        color: 'white'
    }
});