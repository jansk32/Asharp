import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';


export default function ProfileScreen() {
    const [profile, setProfile] = useState('');

    useEffect(() => {
        console.log('Sending request');
        axios.get('http://localhost:3000/user')
        .then((res) => {
            // setProfile(resp);
            console.log(res);
            // console.log('FOUND');
        })
        .catch(error => console.error(error));
    }, []);

    return (
        <>
            <Text style={{ fontSize: 42 }}>This is the profile screen</Text>
            <Text>{profile} hello</Text>
        </>
    );
}

// ProfileScreen.navigationOptions = {
//     title: 'Profile'
// };